"""Draft scripts/la-roads.json from the research shortlist.

Carries across everything the research already settled — id, name, area,
difficulty, character, sources, speed evidence, access — and leaves the two
things that need a human: `description`, and the `anchors` that pick the exact
section out of OSM. Never overwrites an existing spec's description or anchors.

Usage: python3 scripts/draft-la-specs.py [--priority first]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHORTLIST = ROOT / 'docs/los-angeles-road-shortlist.json'
OUT = ROOT / 'scripts/la-roads.json'


def source_entry(ref, sources):
    """Turn a research citation into the {title, url} the site renders."""
    raw = sources[ref]
    citation = raw['citation']
    link = re.search(r'\[([^\]]+)\]\((https?://[^)]+)\)', citation)
    publisher = citation.split('.')[0].strip()
    if link:
        title = re.sub(r'\s+', ' ', link.group(1)).strip(' “”"')
        return {'title': f'{publisher} · {title}'[:110], 'url': link.group(2)}
    urls = raw.get('urls') or []
    return {'title': publisher[:110], 'url': urls[0]} if urls else None


def speed_for(road):
    """Never a numeric summary without evidence scoped to the selected section."""
    evidence = road['speed'].get('evidence') or []
    if not evidence:
        return {
            'value': 'Not verified', 'kind': 'Unverified',
            'note': 'No posted limit has been verified for this selected section. Follow current signs.',
            'source': None,
        }
    scopes = '; '.join(f"{e['value']} ({e['scope']})" for e in evidence)
    return {
        'value': 'Varies', 'kind': 'Documented sections',
        'note': f'Documented only where scoped: {scopes}. These sections do not cover the whole '
                'selected trace and have not been checked against current signs.',
        'source': None,
    }


def main():
    wanted = None
    if '--priority' in sys.argv:
        wanted = sys.argv[sys.argv.index('--priority') + 1]

    data = json.loads(SHORTLIST.read_text())
    sources = data['sources']
    existing = {s['id']: s for s in json.loads(OUT.read_text())} if OUT.exists() else {}

    specs = []
    for road in data['roads']:
        if wanted and road['priority'] != wanted:
            continue
        previous = existing.get(road['id'], {})
        spec = {
            'id': road['id'],
            'name': road['name'],
            'area': road['area'],
            'difficulty': road['difficulty'],
            'character': road['character'],
            'description': previous.get('description', f"TODO — {road['proposedSegment']}"),
            'sources': [s for s in (source_entry(r, sources) for r in road['sourceRefs']) if s],
            'speed': speed_for(road),
            'names': previous.get('names', [road['name']]),
            'anchors': previous.get('anchors', []),
        }
        if road['access'].get('note'):
            spec['access'] = {'note': road['access']['note'], 'status': road['access']['status']}
        specs.append(spec)

    OUT.write_text(json.dumps(specs, indent=2, ensure_ascii=False) + '\n')
    todo = [s['id'] for s in specs if not s['anchors'] or s['description'].startswith('TODO')]
    print(f'Wrote {OUT.relative_to(ROOT)}: {len(specs)} specs')
    print(f'Needing anchors or description ({len(todo)}): {", ".join(todo)}')


if __name__ == '__main__':
    main()
