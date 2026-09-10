California Touge road collection — September 8–9, 2026

Road geometry and mapped speed-limit tags: © OpenStreetMap contributors.
https://www.openstreetmap.org/copyright
https://opendatacommons.org/licenses/odbl/1-0/

roads.geojson, roads/<id>.geojson and road-labels.geojson contain an adapted
OpenStreetMap database and are made available under the Open Database License
(ODbL) 1.0. Adjacent ways were joined only where their endpoints match exactly.
Bay Area traces select named road sections inside regional bounding boxes.
Southern California traces select connected OSM edges between existing vertices
and named junctions. They are not turn-by-turn routes. Gaps are not bridged.
Regional subdirectories contain subsets of the same adapted database.
17-Mile Drive is a trace of the named
road, not the entire signed tourist loop.

The served files are simplified for display: Ramer-Douglas-Peucker at a 6 metre
tolerance, then coordinates rounded to five decimal places (about 1 metre). The
full-precision build is kept at data/roads.full.geojson in the source project.
All published measurements — length, bend and switchback counts, and degrees of
turning per mile — are computed from that full-precision geometry, not from
these simplified files.

Retrieved via https://overpass-api.de/api/interpreter on September 8–9, 2026.
Build recipe: scripts/build-road-data.py or scripts/build-la-road-data.py,
then scripts/build-derived-data.py. Southern California raw geometry and
editorial selection rules are in data/la-overpass.json and scripts/la-roads.json.
Per-road OSM way identifiers and research links are recorded in
app/data/roads.json in the source project.
The map's own Mapbox/OpenStreetMap attribution also applies to its basemap.

Road difficulty and character are editorial assessments, not official ratings.
They do not indicate a safe or permitted driving speed. Current posted signs
and road access rules take precedence. Source dates do not imply field checks.
Published limits describe only the sections documented in the linked sources.
Mapped limits are community tags, not verified current posted limits.
No current limit is asserted where evidence is absent.
