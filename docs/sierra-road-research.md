# Sierra Nevada road research

Reviewed September 12, 2026. A 7-road starting collection, not an exhaustive inventory
or a field survey — the eastern-Sierra canyons off Highway 395 and the western-slope
climb to Huntington Lake, added on request.

Unlike the Bay Area and Southern California collections (built from forum threads
recommending named local roads), these are well-documented state highways and Forest
Service/NPS-recognized roads. Sourcing here leans on official agency pages (NPS,
USFS), Wikipedia, and enthusiast route write-ups (Pashnit, The Ridrs, Climber.org,
Gribblenation, Dangerous Roads) rather than forum threads, because that is where the
verifiable facts about these roads — elevation, grade, seasonal closure dates — live.

## Selection

Requested directly: Tioga Pass, Sonora Pass, Rock Creek Road, the road to Lake
Sabrina, Horseshoe Meadow Road, and Highway 168 from Shaver Lake to Huntington Lake.

Nine Mile Canyon Road was added separately, after a shared screenshot of an unlabeled
switchback road was matched — by shape, location and community reputation, not by any
label in the image — to Nine Mile Canyon's descent toward Highway 395. **That
identification is inference, not a confirmed fact.** The road itself is real and its
catalog entry below is independently sourced; only the claim "this is the road in that
screenshot" is a guess, and that claim appears nowhere on the public site — only here,
as a note for whoever next asks why this road is in the collection.

US 395 itself (Ridgecrest to Tahoe) is not catalogued as its own road. It is the
corridor that connects every road in this collection, but at 300+ miles of mostly
straight desert highway it does not fit this site's per-road model of a single
measured section — it would produce a curvature figure diluted across a distance
nobody drives for the curves.

## Ratings

Same scale as every other region: difficulty 1–3 for width, hairpins and sightlines;
character (Technical / Low / Medium / High speed) for pace, independent of shape. Two
of these are notably not "Technical" despite complex terrain: Bishop Creek Canyon Road
is a moderate, flowing canyon climb rather than a tight one (113°/mile, the lowest of
the seven), and Nine Mile Canyon Road is sourced specifically as "fast, twisty and wide
open" rather than narrow or hairpin-heavy, despite a high curvature figure — the same
distinction the site already draws for Mount Umunhum Road in the Bay Area collection.

## Access

Six of the seven close seasonally; this is the most consequential fact about this
region and is on every affected road's own page, not just here. Sonora Pass, Tioga
Pass, Rock Creek Road and the upper Bishop Creek Canyon Road are gone every winter,
typically November to May, sometimes later. Confirm current status before planning a
crossing — [Caltrans QuickMap](https://quickmap.dot.ca.gov/) for the highways,
[NPS](https://www.nps.gov/yose/planyourvisit/tioga.htm) for Tioga specifically.

## Geometry

Fetched per-road rather than as one shared query: these seven span nearly three
degrees of latitude, and CA 168 alone has two physically disconnected segments (the
Fresno-side climb to Huntington Lake and the Bishop-side climb to Lake Sabrina) that
must not be fetched or measured together. Rebuild:

```bash
python3 scripts/fetch-sierra-overpass.py
python3 scripts/build-sierra-road-data.py
python3 scripts/fetch-elevation.py
python3 scripts/build-derived-data.py
```

## Road/source matrix

| Road | Difficulty | Character | Speed evidence | Access | Sources |
| --- | --- | --- | --- | --- | --- |
| Sonora Pass · Hwy 108 | 3/3 | Technical | [Mapped limits: 40 / 55 mph](https://www.openstreetmap.org/way/10281773) | Closed by snow every winter, typically November through May. Confirm it is open before planning a crossing. | [USDA Forest Service · Stanislaus National Forest, Highway 108 corridor](https://www.fs.usda.gov/r05/stanislaus/recreation/highway-108-corridor); [Jalopnik · Probably the steepest stretch of highway in the US](https://www.jalopnik.com/2250341/probably-steepest-stretch-highway-united-states-california-108-26-percent-grade/); [Wikipedia · Sonora Pass](https://en.wikipedia.org/wiki/Sonora_Pass) |
| Tioga Pass · Hwy 120 | 2/3 | Technical | [Mapped limits: 40 / 50 mph](https://www.openstreetmap.org/way/10462565) | The last Sierra pass to open most years and the first to close — typically shut from November to late May or early June. An entrance fee applies inside Yosemite. | [National Park Service · Yosemite, Tioga Road opening & closing](https://www.nps.gov/yose/planyourvisit/tioga.htm); [Mono Basin Clearinghouse · Tioga Pass opening and closing dates since 1933](https://www.monobasinresearch.org/data/tiogapass.php) |
| Rock Creek Road | 2/3 | Technical | [Mapped limits: 15 / 35 mph](https://www.openstreetmap.org/way/32881492) | Snow-covered well into spring most years; not reliably open until late May or June. | [Dangerous Roads · Rock Creek Road](https://www.dangerousroads.org/north-america/usa/3084-rock-creek-road.html); [The Ridrs · Rock Creek Road, Tom's Place to Mosquito Flat](https://theridrs.com/routes/rock-creek-road/); [Visit Mono County · Rock Creek Lake](https://www.monocounty.org/places-to-go/lakes-rivers-creeks/rock-creek-lake/) |
| Bishop Creek Canyon Road · Hwy 168 | 2/3 | Medium speed | [Mapped limits: 40 / 50 / 55 mph](https://www.openstreetmap.org/way/10377624) | The section above Aspendell closes to most vehicles in winter for snow removal, typically reopening in mid-to-late April. | [Wikipedia · California State Route 168](https://en.wikipedia.org/wiki/California_State_Route_168); [SummitPost · Lake Sabrina trailhead information](https://www.summitpost.org/lake-sabrina/338390); [Visit Bishop · Bishop Creek Canyon](https://bishopvisitor.com/place-to-go/bishop-creek-canyon/) |
| Horseshoe Meadow Road | 3/3 | Technical | Unverified: Not verified | Snow-covered into late spring most years. | [Dangerous Roads · Horseshoe Meadow](https://www.dangerousroads.org/north-america/usa/7019-horseshoe-meadow.html); [Pashnit · Horseshoe Meadows Rd, Lone Pine](https://www.pashnit.com/post/horseshoe-meadows-rd-lone-pine-ca); [Gribblenation · Horseshoe Meadows Road, former SR 190](http://www.gribblenation.org/2020/08/horseshoe-meadows-road-former.html) |
| Highway 168 · Shaver Lake to Huntington Lake | 2/3 | Technical | [Mapped limits: 15 / 25 / 40 / 45 / 55 / 60 mph](https://www.openstreetmap.org/way/10347086) | Not verified — no seasonal closure was found for this lower-elevation western-slope section. | [The Ridrs · CA-168 West, Fresno to Huntington Lake](https://theridrs.com/routes/california-state-route-168-west-to-huntington-lake/); [Climber.org · Kaiser Pass, Shaver Lake to Edison and Florence](https://www.climber.org/driving/KaiserPass.html); [Gribblenation · The tale of CA 168 West's climb to Kaiser](http://www.gribblenation.org/2017/07/tale-of-ca-168-west-climb-to-kaiser-on.html) |
| Nine Mile Canyon Road | 3/3 | High speed | Unverified: Not verified | Not verified — no seasonal closure was found; lower elevation than the others here. | [Sierra Mountain Passes · The Nine Mile Canyon summit](https://sierramountainpasses.com/listings/unnamed-pass/) |
