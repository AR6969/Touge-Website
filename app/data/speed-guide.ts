type SpeedRoad = {
  id: string;
  speed: { value: string; kind: string };
};

const sectionNotes: Record<string, string> = {
  pescadero: "35 mph near Pescadero; other sections vary.",
  "bear-creek": "30–35 mph in the documented sections; limits vary elsewhere.",
  empire: "40 mph outside Santa Cruz city limits; city sections vary.",
  soquel: "35 mph near Soquel, then 40 mph toward Summit Road.",
  "bonny-doon": "35 mph in the section north of Pine Flat Road; other sections vary.",
  marshall: "40 mph in the documented section; check signs elsewhere.",
  umunhum: "Lower speeds may be needed at bends. Follow posted signs.",
  "17-mile": "25 mph in residential and school zones; other sections vary.",
};

// Summarize the source values as a range, never invent a legal limit by averaging.
export function getSpeedGuide(road: SpeedRoad) {
  if (road.id === "highway-1-coast") {
    return {
      value: "55 mph",
      note: "Open stretches; lower limits through towns and some coastal sections.",
    };
  }
  const values = road.speed.value.match(/\d+/g)?.map(Number) ?? [];
  if (!values.length) return { value: "Varies", note: "Check posted signs along the road." };
  const low = Math.min(...values);
  const high = Math.max(...values);
  return {
    value: low === high ? `${low} mph` : `${low}–${high} mph`,
    note: sectionNotes[road.id] ?? "Approximate guide; limits vary by section. Follow posted signs.",
  };
}
