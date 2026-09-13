# Northern additions and GMR connection — September 13, 2026

The request named six roads. Names were treated as discovery leads, not as
verified route numbers, coordinates, speed limits or current-access reports.

## Selected sections

| Road | Selected endpoints | Editorial character / difficulty |
| --- | --- | --- |
| Hopland Grade / CA-175 | US 101 at River Road, Hopland → CA-29 at Soda Bay Road | Technical / 3 |
| CA-193 eastern section | CA-49 at Cool → Georgetown → CA-49 north of Placerville | Technical / 3 |
| CA-49 Auburn–Cool | Borland Avenue roundabout, Auburn → CA-193, Cool | Medium speed / 2 |
| Mosquito Ridge | Foresthill Road → French Meadows Road junction near the reservoir | Technical / 3 |
| Eastside, Sonoma | Old Redwood Highway → Wohler Road | Low speed / 1 |
| Westside, Sonoma | Mill Street, Healdsburg → River Road near Forestville | Low speed / 2 |

Difficulty and character are editorial assessments of the selected roads. They
are not official ratings or speed advice. No numerical speed limit was verified
for these additions, so all six say **Not verified**. OSM maxspeed tags were not
promoted to published speed claims.

## Naming and access sources

- [Caltrans Route 175](https://dot.ca.gov/programs/traffic-operations/legal-truck-access/restrict-route-175)
  confirms Hopland Grade is on **175, not 153**. Its restricted grade section is
  narrower than our full US-101–CA-29 crossing; the page does not claim that the
  whole mapped road is the restricted grade.
- [Caltrans 175 conditions](https://roads.dot.ca.gov/?roadnumber=175), retrieved
  September 13: report timestamp September 12, 4:08pm, construction traffic
  control west of the county line. Publish a dated notice plus the live check,
  not a permanent claim about a delay or opening date.
- [Caltrans 193](https://roads.dot.ca.gov/?roadnumber=193) and
  [49](https://roads.dot.ca.gov/?roadnumber=49) reported no restrictions in the
  retrieved reports. That is not a guarantee for a future trip. CA-193 here is
  the eastern Cool–Georgetown–Placerville section, not Lincoln–Newcastle.
- [California State Parks Auburn trail access](https://www.parks.ca.gov/?page_id=1345)
  supports the Highway 49 recreation-access context and caution around visitors.
- [Visit Placer, French Meadows access](https://www.visitplacer.com/lewis-campground/)
  describes Mosquito Ridge as the Foresthill approach. The selected trace ends
  at the French Meadows Road junction, not a guessed campground entrance.
- [Tahoe National Forest alerts](https://www.fs.usda.gov/r05/tahoe/alerts)
  was checked September 13. Older fire-closure posts can remain indexed after
  conditions change; they are not used to label the entire road closed. The
  published page directs readers to current forest orders and the ranger
  district, and does not assert the road is open.
- [Santa Rosa Cycling Club profiles](https://www.srcc.com/Elevation-Profile) and
  [Hafner Vineyard's cycling account](https://www.hafnervineyard.com/blog/2016/may/31/biking-in-healdsburg/)
  establish Eastside and Westside as cycling routes. Both road descriptions ask
  drivers to give cyclists room and wait for a clear place to pass. The older
  account is not evidence of current pavement quality.
- [Sonoma County repair authorization](https://sonoma-county.legistar.com/LegislationDetail.aspx?GUID=9B4C6FB0-C181-4957-BB44-9BF52C524403&ID=7780323&Options=&Search=)
  documents Westside slide repairs and Wohler Bridge works. Check the
  [county closure map](https://roadclosures-sonomacounty.hub.arcgis.com/) before
  assuming the two roads form an available loop. The map is client rendered;
  a complete live closure inventory could not be independently extracted.

## Geometry and reproducibility

`data/north-overpass.json` merges four successful Overpass snapshots, retaining
OSM way/node IDs, geometry and tags. `sourceSnapshots` records their timestamps.
`scripts/roads-north.overpass` provides a refresh query; the original fetch was
split into road, junction, connector and Hopland groups to avoid timeouts.

`scripts/north-roads.json` owns the six editorial records and exact anchors,
which were copied from existing OSM junction nodes. The shared tracer in
`scripts/la_roads.py` excludes inaccessible, private and explicitly unpaved
ways; selects actual nodes; and fails if no connected path exists. No invented
coordinate or straight-line connection is inserted. The unrelated gravel
Eastside Road in Napa and old Westside residential spurs are not selected.

Lengths and terrain are computed from the full-precision archive. Elevation was
fetched with the existing USGS NED10m/OpenTopoData pipeline: 21 rate-limited API
calls for the six additions and the extended GMR trace. OSM and USGS measurements
are not a road survey or a pavement/access guarantee.

All builders now preserve roads they do not own. In particular, the LA builder
previously treated every non-Bay road as its own and could delete Sierra roads.
The Sierra builder must also preserve the newer Auburn records in its region.
Stage 3 retains shared endpoint vertices when simplifying, so connecting guide
sections meet at the junction. Shape statistics still use the unchanged full
archive, rather than the simplified trace.

## Glendora Mountain Road → Highway 39

The actual mountain connection is **GMR → East Fork Road west → Highway 39 south
into Azusa**. GMR's previous geometry stopped at Glendora Ridge even though its
copy promised East Fork. Its existing saved OSM way contains the north-side
descent: the selected trace now continues along that same way to the existing
East Fork junction. The drive clips Highway 39 at that junction and heads south;
it does not highlight the northern Crystal Lake section.

- [LA County closures](https://pw.lacounty.gov/roadclosures/) identifies the GMR
  endpoints. The retrieved table is dated December 2025, so it cannot establish
  current vehicle access. The guide prominently says to verify the gates.
- [Caltrans Highway 39](https://roads.dot.ca.gov/?roadnumber=39), retrieved
  September 13, reports the closure north of Crystal Lake toward Highway 2.
  That section is beyond this itinerary.
- [Carl Pulley's route report](https://russbrown.com/glendora-mountain-ridge-roads-motorcycle-ride-by-carl-pulley/)
  and [Autoblog's older drive report](https://www.autoblog.com/features/autoblog-sunday-drive-glendora-mountain-road)
  support route character and connections, not current closures or pavement.
- [Angeles National Forest alerts](https://www.fs.usda.gov/r05/angeles/alerts)
  remains linked as a current check. No assertion of unrestricted access is made.

The guide describes GMR's tighter technical section and lower 39's more flowing
highway character. It does not recommend a speed or promise smooth pavement.
`node --test tests/drive-geometry.test.mjs` verifies real road IDs, clipped traces,
reversed selection, rejection of disconnected anchors and both GMR junctions.
