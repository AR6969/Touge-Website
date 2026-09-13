import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectDriveSection, traceBounds } from '../app/lib/drive-geometry.ts';
import { drives } from '../app/lib/drives.ts';

const trace = coordinates => ({type:'Feature',properties:{id:'test'},geometry:{type:'MultiLineString',coordinates}});
test('sections follow existing vertices in either travel direction', () => {
  const points = [[-118,34],[-118.001,34.001],[-118.002,34.002],[-118.003,34.003]];
  const selected=selectDriveSection(trace([points]),{from:points[2],to:points[0]});
  assert.deepEqual(selected.geometry.coordinates,[points[2],points[1],points[0]]);
  assert.deepEqual(points[0],[-118,34]);
});
test('disconnected or distant anchors fail instead of drawing a shortcut', () => {
  const split=trace([[[-118,34],[-118.001,34.001]],[[-117,35],[-117.001,35.001]]]);
  assert.throws(()=>selectDriveSection(split,{from:[-118,34],to:[-117,35]}));
  assert.throws(()=>selectDriveSection(split,{from:[0,0],to:[1,1]}));
});
test('every published drive resolves to real nonempty road files and valid selected sections', () => {
  const catalog=JSON.parse(readFileSync(new URL('../app/data/roads.json',import.meta.url)));
  for (const drive of drives) {
    const features=drive.steps.filter(s=>s.roadId).map(step=>{
      assert.ok(catalog.some(r=>r.id===step.roadId),`${drive.slug}: ${step.roadId}`);
      return selectDriveSection(JSON.parse(readFileSync(new URL(`../public/data/roads/${step.roadId}.geojson`,import.meta.url))),step.mapSection);
    });
    assert.ok(features.length>0);
    assert.ok(traceBounds(features));
  }
});
test('GMR drive reaches East Fork and uses only lower Highway 39', () => {
  const drive=drives.find(d=>d.slug==='glendora-mountain-road-highway-39-drive');
  const parts=drive.steps.map(step=>selectDriveSection(JSON.parse(readFileSync(new URL(`../public/data/roads/${step.roadId}.geojson`,import.meta.url))),step.mapSection));
  const lines=parts.map(f=>f.geometry.type==='LineString'?f.geometry.coordinates:f.geometry.coordinates[0]);
  const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<0.0001;
  assert.ok(near(lines[0].at(-1),lines[1][0]),'GMR must meet East Fork');
  assert.ok(near(lines[1].at(-1),lines[2][0]),'East Fork must meet Highway 39');
  assert.ok(Math.max(...lines[2].map(p=>p[1]))<34.241,'Northern Hwy 39 spur must not appear');
});
