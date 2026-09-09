"""Build locally served road traces from an Overpass snapshot.
Usage: python3 scripts/build-road-data.py snapshot.json [extra-snapshot.json]
Geometry and maxspeed tags: OpenStreetMap contributors, ODbL 1.0.
Catalog descriptions, difficulty and character are editorial; never derive a legal
speed limit from road shape, routing duration, or a driver's reported speed.
"""
import collections
import json
import math
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ways = {}
for filename in sys.argv[1:]:
    snapshot = json.loads(Path(filename).read_text())
    if snapshot.get('remark'):
        raise ValueError(snapshot['remark'])
    ways.update({way['id']: way for way in snapshot['elements'] if way['type'] == 'way'})

SOURCES = {
    'reddit': {'title': 'r/Touge · Bay Area drives', 'url': 'https://www.reddit.com/r/Touge/comments/1ne9y4c/collection_bay_area_drives/'},
    'bayarea': {'title': 'r/bayarea · Favorite driving roads', 'url': 'https://www.reddit.com/r/bayarea/comments/1o99iqz/'},
    'sanjose': {'title': 'r/SanJose · Local backroads', 'url': 'https://www.reddit.com/r/SanJose/comments/16hecck/'},
    'rennlist': {'title': 'Rennlist · Bay Area road discussion', 'url': 'https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html'},
    'barf': {'title': 'Bay Area Riders Forum · Scenic roads', 'url': 'https://www.bayarearidersforum.com/forums/threads/scenic-road-suggestions-requested.453694/'},
    'marin': {'title': 'r/bayarea · Marin driving roads', 'url': 'https://www.reddit.com/r/bayarea/comments/oudkbt/'},
    'guide': {'title': 'Driver’s Guide · Regional road directory', 'url': 'https://weisskrispies.github.io/drivers-guide/'},
    'biking': {'title': 'Best Biking Roads · Santa Cruz loop', 'url': 'https://www.bestbikingroads.com/motorcycle-roads/united-states/california/ride/jamison-creek-empire-grade-pine-flat-bonny-doon-to-hwy1'},
    'eastbay': {'title': 'CivicX · East Bay driving roads', 'url': 'https://www.civicx.com/forum/threads/east-bay-driving-roads.32309/'},
    'pebble': {'title': 'Pebble Beach · Official 17-Mile Drive guide', 'url': 'https://www.pebblebeach.com/17-mile-drive/'},
    'scenic': {'title': 'Pebble Beach · Regional road trip', 'url': 'https://www.pebblebeach.com/insidepebblebeach/road-trip-california-dreamin/'},
}
# Bounding boxes are (west, south, east, north). They select the scenic section,
# avoiding identically named roads, urban expressways and distant highway sections.
def road(id, name, area, difficulty, character, names, bbox, description, sources, ref=None):
    return dict(id=id, name=name, area=area, difficulty=difficulty, character=character,
                names=names, bbox=bbox, description=description,
                sources=[SOURCES[s] for s in sources], ref=ref)

R = [
road('page-mill','Page Mill Road','Peninsula',3,'Technical',['Page Mill Road'],[-122.22,37.30,-122.13,37.39], 'A steep foothill climb to Skyline, with tight bends, limited sightlines and frequent bicycle traffic.', ['sanjose','rennlist']),
road('west-alpine','West Alpine Road','Peninsula',3,'Technical',['Alpine Road'],[-122.32,37.24,-122.18,37.34], 'The narrow western descent from Skyline toward Pescadero Creek, with forest switchbacks and changing visibility.', ['rennlist']),
road('pescadero','Pescadero Creek Road','Peninsula',2,'Medium speed',['Pescadero Creek Road'],[-122.44,37.17,-122.25,37.31], 'A winding connection through Loma Mar and redwoods to the farms and coast around Pescadero.', ['reddit','bayarea']),
road('skyline','Skyline Boulevard · Hwy 35','Peninsula',2,'Medium speed',[],[-122.40,37.22,-122.10,37.50], 'The mountain section of Highway 35 links the Peninsula’s ridge roads between Highway 92 and Highway 9.', ['reddit','bayarea'], 'CA 35'),
road('la-honda','La Honda Road · Hwy 84','Peninsula',2,'Medium speed',[],[-122.42,37.28,-122.255,37.44], 'Woodside and Sky Londa lead into redwood bends, La Honda and the open valley toward San Gregorio.', ['reddit','bayarea'], 'CA 84'),
road('kings','Kings Mountain Road','Peninsula',3,'Technical',['Kings Mountain Road'],[-122.36,37.40,-122.26,37.46], 'A short, steep forest climb between Woodside and Skyline, with close bends and shaded corners.', ['rennlist']),
road('tunitas','Tunitas Creek Road','Peninsula',3,'Technical',['Tunitas Creek Road'],[-122.44,37.34,-122.32,37.44], 'A narrow creekside road rising from the coast into redwoods and the Skyline ridgeline.', ['rennlist']),
road('old-la-honda','Old La Honda Road','Peninsula',3,'Technical',['Old La Honda Road'],[-122.32,37.33,-122.24,37.39], 'A narrow local road climbing to Skyline. Short sightlines and cyclists make this a patient, low-pace drive.', ['rennlist']),
road('stage','Stage Road','Peninsula',2,'Low speed',['Stage Road'],[-122.45,37.24,-122.35,37.36], 'Rolling coastal backroad between Pescadero and San Gregorio, passing farms and small settlements.', ['rennlist']),
road('highway-1-coast','Highway 1 · Coastside','Coastside / Santa Cruz',1,'High speed',[],[-122.55,36.95,-122.02,37.61], 'The coastal highway from Pacifica toward Santa Cruz, via Half Moon Bay, Pescadero and Davenport. Town sections are slower.', ['bayarea'], 'CA 1'),
road('highway-9','Highway 9','Santa Cruz Mountains',2,'Medium speed',[],[-122.25,36.97,-122.02,37.265], 'A mountain crossing from Saratoga through the redwoods and San Lorenzo Valley, with slower village sections.', ['reddit','bayarea'], 'CA 9'),
road('bear-creek','Bear Creek Road','Santa Cruz Mountains',3,'Technical',['Bear Creek Road'],[-122.15,37.12,-121.98,37.25], 'A winding mountain connector above Boulder Creek, with close corners and residential entrances.', ['reddit','bayarea']),
road('empire','Empire Grade','Santa Cruz Mountains',2,'Medium speed',['Empire Grade'],[-122.27,36.97,-122.04,37.18], 'A ridge road above Santa Cruz, linking forest, open hills and the Bonny Doon area.', ['biking','bayarea']),
road('bonny-doon','Bonny Doon Road','Santa Cruz Mountains',2,'Medium speed',['Bonny Doon Road'],[-122.22,37.0,-122.11,37.11], 'A coastal climb from Highway 1 toward Bonny Doon, connecting open slopes and wooded sections.', ['biking']),
road('jamison','Jamison Creek Road','Santa Cruz Mountains',3,'Technical',['Jamison Creek Road'],[-122.20,37.13,-122.12,37.20], 'A steep, compact climb between Big Basin Way and Empire Grade, with a succession of tight turns.', ['biking']),
road('big-basin','Big Basin Highway · Hwy 236','Santa Cruz Mountains',3,'Technical',[],[-122.27,37.10,-122.10,37.24], 'A narrow forest loop through Big Basin country. Check Caltrans and park access updates before planning a through-drive.', ['bayarea'], 'CA 236'),
road('old-santa-cruz','Old Santa Cruz Highway','Santa Cruz Mountains',2,'Low speed',['Old Santa Cruz Highway'],[-122.02,37.10,-121.90,37.23], 'A wooded local-road alternative near Highway 17, with bends and driveways along the mountain communities.', ['bayarea']),
road('soquel','Soquel–San Jose Road','Santa Cruz Mountains',2,'Medium speed',['Soquel San Jose Road'],[-122.0,36.98,-121.90,37.16], 'A mountain-to-coast connection from Summit Road toward Soquel, with forest curves and residential stretches.', ['bayarea']),
road('calaveras','Calaveras Road','East Bay / South Bay',3,'Technical',['Calaveras Road'],[-121.91,37.44,-121.70,37.60], 'A reservoir-side road between Milpitas and Sunol. The narrow, blind sections demand more care than the map suggests.', ['reddit','sanjose']),
road('palomares','Palomares Road','East Bay',3,'Technical',['Palomares Road'],[-122.04,37.56,-121.93,37.72], 'A rural canyon connection from Castro Valley toward Niles Canyon, with narrow bends and driveways.', ['reddit']),
road('mines','Mines Road','East Bay',3,'Technical',['Mines Road'],[-121.79,37.37,-121.48,37.70], 'A long, remote backroad south of Livermore, mixing open valleys with narrow, winding sections.', ['marin','guide']),
road('san-antonio','San Antonio Valley Road','Diablo Range',3,'Technical',['San Antonio Valley Road'],[-121.67,37.30,-121.44,37.43], 'A remote link between Mount Hamilton and the Mines Road junction, with exposed bends and ranchland.', ['marin']),
road('hamilton','Mount Hamilton Road','South Bay',3,'Technical',['Mount Hamilton Road'],[-121.83,37.30,-121.60,37.40], 'A long ascent from San Jose toward Lick Observatory, with repeated switchbacks and changing sightlines.', ['reddit','sanjose']),
road('patterson','Patterson Pass Road','East Bay',3,'Technical',['Patterson Pass Road'],[-121.78,37.63,-121.47,37.73], 'A pass east of Livermore through wind-farm hills, including narrow sections and blind crests.', ['guide']),
road('redwood','Redwood Road','East Bay',2,'Medium speed',['Redwood Road'],[-122.19,37.69,-122.06,37.83], 'A wooded East Bay corridor between Castro Valley and the Oakland hills, with flowing bends and park entrances.', ['guide']),
road('grizzly','Grizzly Peak Boulevard','East Bay',2,'Low speed',['Grizzly Peak Boulevard'],[-122.28,37.83,-122.18,37.91], 'An Oakland–Berkeley hills road with bay overlooks, local traffic and short, winding sections.', ['eastbay']),
road('diablo','Mount Diablo roads','East Bay',3,'Technical',['North Gate Road','South Gate Road','Summit Road','Mount Diablo Scenic Boulevard'],[-121.99,37.82,-121.88,37.93], 'The north and south approaches converge on the summit road. Park access and hours apply.', ['guide']),
road('hicks','Hicks Road','South Bay',3,'Technical',['Hicks Road'],[-121.96,37.15,-121.84,37.25], 'A steep and winding foothill road near Almaden and the approach to Mount Umunhum.', ['reddit']),
road('umunhum','Mount Umunhum Road','South Bay',3,'Low speed',['Mount Umunhum Road'],[-121.92,37.13,-121.85,37.19], 'A summit-access road with tight turns and broad valley views. Preserve opening hours apply.', ['reddit']),
road('uvas','Uvas Road','South Bay',2,'Medium speed',['Uvas Road'],[-121.84,37.04,-121.68,37.18], 'A rolling reservoir-side road south of San Jose, linking with McKean Road and rural Santa Clara Valley.', ['reddit','sanjose']),
road('mckean','McKean Road','South Bay',1,'Medium speed',['McKean Road'],[-121.85,37.15,-121.77,37.22], 'Open foothill and reservoir country between Almaden and Uvas, with intersections and local access.', ['reddit']),
road('panoramic','Panoramic Highway','Marin',2,'Medium speed',['Panoramic Highway'],[-122.66,37.86,-122.54,37.93], 'A forested climb above Muir Woods connecting the Mount Tamalpais area with the Stinson Beach side.', ['barf','reddit']),
road('ridgecrest','Pantoll & East Ridgecrest','Marin',2,'Low speed',['Pantoll Road','East Ridgecrest Boulevard'],[-122.64,37.89,-122.56,37.94], 'The upper Mount Tamalpais approach combines exposed ridge views with tight mountain turns and park access.', ['barf']),
road('lucas','Lucas Valley Road','Marin',2,'Medium speed',['Lucas Valley Road'],[-122.71,38.015,-122.54,38.085], 'A Marin cross-country road linking open valley stretches with shaded turns toward Nicasio.', ['marin','guide']),
road('marshall','Marshall–Petaluma Road','Marin',2,'Medium speed',['Marshall-Petaluma Road','Marshall Petaluma Road'],[-122.92,38.13,-122.72,38.23], 'Rolling ranch country between the Tomales Bay side and inland Marin, with crests and changing visibility.', ['barf','rennlist']),
road('highway-1-marin','Highway 1 · Marin coast','Marin / Sonoma',2,'Medium speed',[],[-123.13,37.87,-122.51,38.46], 'A coastal road via Stinson Beach, Point Reyes, Tomales Bay and Bodega Bay. Tight bends alternate with open stretches.', ['barf','bayarea'], 'CA 1'),
road('highway-128','Highway 128 · Lake Berryessa','Napa / Solano',2,'Medium speed',[],[-122.50,38.43,-122.0,38.66], 'A winding inland route across Napa-area hills toward Lake Berryessa and the Putah Creek corridor.', ['guide'], 'CA 128'),
road('highway-29','Highway 29 · Mount St. Helena','Napa / Lake',3,'Technical',[],[-122.67,38.585,-122.48,38.80], 'The mountain section north of Calistoga climbs through repeated bends toward the Lake County side.', ['reddit','guide'], 'CA 29'),
road('17-mile','17-Mile Drive','Monterey Peninsula',1,'Low speed',['17 Mile Drive','17-Mile Drive','Seventeen Mile Drive'],[-121.98,36.55,-121.91,36.63], 'A scenic coastal drive through Pebble Beach and Del Monte Forest. This is a private visitor road with an entry fee.', ['pebble']),
road('carmel-valley','Carmel Valley Road','Monterey County',2,'Medium speed',['Carmel Valley Road'],[-121.94,36.42,-121.35,36.58], 'A Monterey-area extension inland through Carmel Valley, with village stretches and increasingly rural bends.', ['scenic']),
]

# Published evidence is scoped to the section actually described by its source.
PUBLISHED = {
 'empire': ('40 mph', 'Santa Cruz County code specifies 40 mph from the city limits to the end. City sections may differ.', 'https://ecode360.com/47529696'),
 'soquel': ('35 / 40 mph', 'County code: 35 mph from Paper Mill Road to 1.4 miles north of Soquel Drive; 40 mph from there to Summit Road.', 'https://ecode360.com/47529696'),
 'bonny-doon': ('35 mph section', 'County code specifies a section starting 0.9 miles north of Pine Flat Road and continuing 1.7 miles. Other sections not verified.', 'https://ecode360.com/47529696'),
 'marshall': ('40 mph section', 'Marin’s 2024 bridge-project RFP describes a posted 40 mph road at the project area. This does not verify every section.', 'https://www.marincounty.gov/sites/g/files/fdkgoe241/files/2024-08/final-rfp-marshall-petaluma-rd-bridge-replacement-2024-08-19-002.pdf'),
 'pescadero': ('35 mph', 'Cloverdale Road to Butano Cut-Off only; other sections vary. County ordinance adopted December 2021.', 'https://sanmateocounty.legistar.com/LegislationDetail.aspx?GUID=78180F1B-90FE-44B0-957B-2B5C546D1EFB&ID=5349023'),
 'bear-creek': ('30 / 35 mph', 'County code: 30 mph from Hwy 9 to Keller Drive; 35 mph from Pilger Road to Hwy 35. Other sections not verified.', 'https://ecode360.com/47529696'),
 'umunhum': ('25 mph', 'Midpen’s 2016 road rehabilitation sign plan specifies 25 mph signs. Current signs take precedence.', 'https://www.openspace.org/sites/default/files/20160525_MtUmRoad_BidPlanSet-Approval_R-16-62.pdf'),
 '17-mile': ('25 mph zones', 'Pebble Beach CSD identifies posted 25 mph residential and school zones. This is not a verified limit for the entire drive.', 'https://www.pbcsd.org/supplemental-law-enforcement'),
}

def length(coords):
    total = 0
    for (x1,y1),(x2,y2) in zip(coords,coords[1:]):
        dy=math.radians(y2-y1); dx=math.radians(x2-x1)
        a=math.sin(dy/2)**2+math.cos(math.radians(y1))*math.cos(math.radians(y2))*math.sin(dx/2)**2
        total += 6371000*2*math.atan2(math.sqrt(a), math.sqrt(max(0,1-a)))
    return total

def merge(lines):
    # Join only exact OSM endpoints. Never draw a straight bridge across a gap.
    result=[]
    pending=[line[:] for line in lines]
    while pending:
        current=pending.pop()
        changed=True
        while changed:
            changed=False
            for i,other in enumerate(pending):
                if current[-1]==other[0]: current+=other[1:]
                elif current[-1]==other[-1]: current+=other[-2::-1]
                elif current[0]==other[-1]: current=other[:-1]+current
                elif current[0]==other[0]: current=other[:0:-1]+current
                else: continue
                pending.pop(i);changed=True;break
        result.append(current)
    return result

features=[]; labels=[]; catalog=[]
for entry in R:
    west,south,east,north=entry.pop('bbox')
    names=entry.pop('names'); ref=entry.pop('ref')
    lines=[]; speedways=[]; ids=[]; tagged_length=0; total_length=0
    for way in ways.values():
        tags=way.get('tags',{})
        if not ((ref and ref in tags.get('ref','').split(';')) or tags.get('name') in names): continue
        if tags.get('motor_vehicle')=='no' or (tags.get('access') in ('no','private') and entry['id']!='17-mile'): continue
        raw=way.get('geometry',[])
        # Clip at existing geometry vertices; do not include distant road segments.
        chunks=[]; chunk=[]
        for point in raw:
            if west <= point['lon'] <= east and south <= point['lat'] <= north:
                chunk.append([round(point['lon'],6),round(point['lat'],6)])
            else:
                if len(chunk)>1:chunks.append(chunk)
                chunk=[]
        if len(chunk)>1: chunks.append(chunk)
        if not chunks: continue
        lines.extend(chunks);ids.append(way['id'])
        distance=sum(length(c) for c in chunks);total_length+=distance
        speed=tags.get('maxspeed','')
        if re.fullmatch(r'\d+ mph',speed):
            speedways.append({'mph':int(speed.split()[0]),'wayId':way['id']})
            tagged_length+=distance
    if not lines: raise ValueError('Missing geometry: '+entry['id'])
    merged=merge(lines)
    allpoints=[p for line in lines for p in line]
    bounds=[[min(p[0] for p in allpoints), min(p[1] for p in allpoints)], [max(p[0] for p in allpoints), max(p[1] for p in allpoints)]]
    longest=max(merged,key=length); center=longest[len(longest)//2]
    vals=sorted(set(s['mph'] for s in speedways))
    mapped=(' / '.join(str(v) for v in vals)+' mph') if vals else 'Not mapped'
    speed=dict(value='Not verified',kind='Unverified',note='No reliable posted limit was found for this road. Check signs along the route.',source=None)
    if vals:
        speed=dict(value=mapped,kind='Mapped limits',note=f'OpenStreetMap tags cover approximately {round(tagged_length/total_length*100)}% of this trace. These values have not been checked against current signs.',source=f'https://www.openstreetmap.org/way/{speedways[0]["wayId"]}')
    if entry['id'] in PUBLISHED:
        value,note,url=PUBLISHED[entry['id']]
        speed=dict(value=value,kind='Published limits',note=note,source=url)
    entry.update(center=center,bounds=bounds,speed=speed,mappedSpeed=mapped,taggedPercent=round(tagged_length/total_length*100),osmWayIds=ids,reviewed='2026-09-08')
    props={k:entry[k] for k in ['id','name','difficulty','character']}
    features.append(dict(type='Feature',properties=props,geometry=dict(type='MultiLineString',coordinates=merged)))
    labels.append(dict(type='Feature',properties=props,geometry=dict(type='Point',coordinates=center)))
    catalog.append(entry)
    print(entry['id'],len(lines),'segments',round(total_length/1609.344,1),'mi',speed['kind'],speed['value'])

for filename, data in [('roads.geojson',dict(type='FeatureCollection',features=features)),('road-labels.geojson',dict(type='FeatureCollection',features=labels))]:
    (ROOT/'public/data'/filename).write_text(json.dumps(data,separators=(',',':'))+'\n')
(ROOT/'app/data/roads.json').write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+'\n')
print('Built',len(catalog),'roads.')
