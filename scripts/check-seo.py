#!/usr/bin/env python3
"""Check rendered SEO and crawlable links against a running production build.

Usage: python3 scripts/check-seo.py http://127.0.0.1:3102
Uses only Python's standard library; canonical origin defaults to production.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROAD_IDS = [
    'highway-9-front', 'page-mill', 'skyline', 'pescadero', 'highway-1-coast',
    'mines', 'glendora-mountain', 'angeles-crest-west', 'latigo-canyon', 'palomar-south-grade',
]
PATHS = ['/', '/roads', '/drives'] + ['/roads/' + road for road in ROAD_IDS]


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta, self.canon, self.links, self.ids, self.schemas = {}, [], [], set(), []
        self.title, self.h1 = '', []
        self.capture, self.buffer = None, ''
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property', ''))] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canon.append(attrs.get('href'))
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag in ('title', 'h1') or (tag == 'script' and attrs.get('type') == 'application/ld+json'):
            self.capture, self.buffer = tag, ''

    def handle_data(self, data):
        if self.capture:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag != self.capture:
            return
        if tag == 'title':
            self.title = self.buffer
        elif tag == 'h1':
            self.h1.append(self.buffer)
        else:
            self.schemas.append(json.loads(self.buffer))
        self.capture, self.buffer = None, ''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('base', nargs='?', default='http://127.0.0.1:3102')
    parser.add_argument('--canonical-origin', default='https://www.tougemap.com')
    args = parser.parse_args()
    origin, base = args.canonical_origin.rstrip('/'), args.base.rstrip('/')

    def fetch(path):
        request = Request(base + path, headers={'User-Agent': 'TougeMap-SEO-check/1.0'})
        try:
            response = urlopen(request, timeout=30)
        except HTTPError as error:
            response = error
        with response:
            data = response.read()
            content_type = response.headers.get('Content-Type', '')
            text = data.decode() if any(kind in content_type for kind in ('text/', 'xml', 'json')) else ''
            return response.status, text, response.headers

    with ThreadPoolExecutor(max_workers=4) as pool:
        results = dict(zip(PATHS, pool.map(fetch, PATHS)))
    pages, all_links = {}, set()
    for path, (status, html, headers) in results.items():
        page = pages[path] = Page(html)
        assert status == 200, (path, status)
        assert page.canon == [origin + ('' if path == '/' else path)], (path, page.canon)
        assert len(page.h1) == 1, (path, page.h1)
        assert 20 <= len(page.title) <= 65, (path, page.title)
        assert 90 <= len(page.meta.get('description', '')) <= 180, path
        assert 'noindex' not in page.meta.get('robots', '').lower(), path
        assert 'noindex' not in headers.get('X-Robots-Tag', '').lower(), path
        assert page.meta.get('og:title') == page.title, (path, 'OG title')
        assert page.meta.get('twitter:title') == page.title, (path, 'Twitter title')
        assert page.meta.get('og:description') == page.meta['description'], path
        assert page.meta.get('viewport'), (path, 'mobile viewport')
        graph = [node for schema in page.schemas for node in schema.get('@graph', [schema])]
        types = {node.get('@type') for node in graph}
        required = {'WebSite', 'ItemList'} if path == '/' else {'CollectionPage', 'BreadcrumbList', 'ItemList'} if path in ('/roads', '/drives') else {'WebPage', 'Place', 'BreadcrumbList'}
        assert required <= types, (path, types)
        if path.startswith('/roads/'):
            assert 'drive-notes' in page.ids, path
        for link in page.links:
            resolved = urlsplit(urljoin(origin + path, link))
            if resolved.netloc == urlsplit(origin).netloc:
                all_links.add((resolved.path or '/', resolved.fragment))
        print(f'PASS {path}: title {len(page.title)} chars, description {len(page.meta["description"])} chars')
    assert len({page.title for page in pages.values()}) == len(PATHS), 'Duplicate titles'
    assert len({page.meta['description'] for page in pages.values()}) == len(PATHS), 'Duplicate descriptions'
    assert all('/roads/' + road in pages['/roads'].links for road in ROAD_IDS), 'Road missing from directory'

    # Every internal destination and fragment on the audited pages must resolve.
    destinations = sorted({path for path, fragment in all_links} - set(pages))
    with ThreadPoolExecutor(max_workers=6) as pool:
        for path, (status, html, _) in zip(destinations, pool.map(fetch, destinations)):
            assert status == 200, ('Broken internal link', path, status)
            pages[path] = Page(html)
    for path, fragment in all_links:
        assert not fragment or unquote(fragment) in pages[path].ids, ('Broken fragment', path, fragment)

    status, xml, _ = fetch('/sitemap.xml')
    assert status == 200
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    entries = ET.fromstring(xml).findall('s:url', ns)
    sitemap = {entry.findtext('s:loc', namespaces=ns): entry.findtext('s:lastmod', namespaces=ns) for entry in entries}
    assert len(sitemap) == len(entries), 'Duplicate sitemap URLs'
    assert all(url.startswith(origin) and not urlsplit(url).query for url in sitemap), 'Noncanonical sitemap URL'
    remaining = sorted({urlsplit(url).path or '/' for url in sitemap} - set(pages))
    with ThreadPoolExecutor(max_workers=6) as pool:
        for path, (status, html, headers) in zip(remaining, pool.map(fetch, remaining)):
            page = Page(html)
            assert status == 200 and 'noindex' not in page.meta.get('robots', '').lower(), ('Nonindexable sitemap page', path, status)
            assert page.canon == [origin + ('' if path == '/' else path)], ('Sitemap canonical mismatch', path)
    for path in PATHS:
        url = origin + ('' if path == '/' else path)
        assert sitemap.get(url, '')[:10] >= '2026-09-15', ('Editorial lastmod missing', path)
    status, robots, _ = fetch('/robots.txt')
    assert status == 200 and f'Sitemap: {origin}/sitemap.xml' in robots
    assert 'Disallow: /\n' not in robots, 'Robots blocks whole site'
    status, html, _ = fetch('/roads/this-road-does-not-exist')
    assert status == 404 and 'noindex' in Page(html).meta.get('robots', ''), 'Invalid road must be a noindex 404'
    status, html, _ = fetch('/?region=los-angeles&utm_source=seo-check')
    assert status == 200 and Page(html).canon == [origin], 'Homepage query canonical'
    print(f'PASS {len(PATHS)} priority pages, {len(all_links)} internal links/fragments, {len(sitemap)} sitemap URLs, robots, 404 and query canonical')


if __name__ == '__main__':
    main()
