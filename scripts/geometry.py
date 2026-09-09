"""Geometry helpers shared by the road build scripts.

Everything here is derived from OpenStreetMap way geometry (ODbL 1.0). These are
measurements of the mapped centreline, not a survey: they describe road shape,
and must never be presented as a speed limit, a safety rating or a legal claim.
"""
import math

EARTH_RADIUS_M = 6371000
METERS_PER_MILE = 1609.344

# A bend is a sustained direction change; a switchback reverses direction.
BEND_DEGREES = 40
SWITCHBACK_DEGREES = 130
# Resampling to a fixed step removes OSM's uneven vertex spacing from the counts.
SAMPLE_STEP_M = 20
# Direction wobble below this is digitising noise, not a corner.
NOISE_DEGREES = 3


def haversine(a, b):
    (x1, y1), (x2, y2) = a, b
    dy, dx = math.radians(y2 - y1), math.radians(x2 - x1)
    h = math.sin(dy / 2) ** 2 + math.cos(math.radians(y1)) * math.cos(math.radians(y2)) * math.sin(dx / 2) ** 2
    return EARTH_RADIUS_M * 2 * math.atan2(math.sqrt(h), math.sqrt(max(0, 1 - h)))


def line_length(coords):
    return sum(haversine(a, b) for a, b in zip(coords, coords[1:]))


def _project(coords):
    """Local equirectangular projection to metres, accurate over a single road."""
    lat0 = math.radians(sum(point[1] for point in coords) / len(coords))
    return [(x * 111320 * math.cos(lat0), y * 110540) for x, y in coords]


def simplify(coords, tolerance_m):
    """Ramer-Douglas-Peucker. Keeps every endpoint, so segments still join."""
    if len(coords) < 3:
        return coords
    points = _project(coords)
    keep = [False] * len(coords)
    keep[0] = keep[-1] = True
    stack = [(0, len(coords) - 1)]
    while stack:
        start, end = stack.pop()
        if end - start < 2:
            continue
        (ax, ay), (bx, by) = points[start], points[end]
        dx, dy = bx - ax, by - ay
        span = math.hypot(dx, dy)
        worst, index = -1.0, start
        for i in range(start + 1, end):
            px, py = points[i]
            if span == 0:
                distance = math.hypot(px - ax, py - ay)
            else:
                distance = abs(dy * px - dx * py + bx * ay - by * ax) / span
            if distance > worst:
                worst, index = distance, i
        if worst > tolerance_m:
            keep[index] = True
            stack.extend([(start, index), (index, end)])
    return [point for point, keeper in zip(coords, keep) if keeper]


def _resample(coords, step_m):
    """Walk the line emitting a point every `step_m`, so headings are comparable."""
    points = _project(coords)
    output = [points[0]]
    carry = 0.0
    for (ax, ay), (bx, by) in zip(points, points[1:]):
        segment = math.hypot(bx - ax, by - ay)
        if segment == 0:
            continue
        travelled = step_m - carry
        while travelled <= segment:
            ratio = travelled / segment
            output.append((ax + (bx - ax) * ratio, ay + (by - ay) * ratio))
            travelled += step_m
        carry = (carry + segment) % step_m
    return output


def resample_lonlat(coords, step_m):
    """Walk the line in lon/lat, emitting a point every `step_m`.

    Unlike _resample this stays in geographic coordinates, so the results can be
    sent to an elevation service and lined back up with distance along the road.
    """
    if len(coords) < 2:
        return list(coords)
    output = [tuple(coords[0])]
    carry = 0.0
    for a, b in zip(coords, coords[1:]):
        segment = haversine(a, b)
        if segment == 0:
            continue
        travelled = step_m - carry
        while travelled <= segment:
            ratio = travelled / segment
            output.append((a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio))
            travelled += step_m
        carry = (carry + segment) % step_m
    if output[-1] != tuple(coords[-1]):
        output.append(tuple(coords[-1]))
    return output


def _turn_deltas(coords):
    """Signed heading change, in degrees, between consecutive resampled steps."""
    points = _resample(coords, SAMPLE_STEP_M)
    if len(points) < 3:
        return []
    headings = [math.degrees(math.atan2(b[1] - a[1], b[0] - a[0])) for a, b in zip(points, points[1:])]
    deltas = []
    for previous, current in zip(headings, headings[1:]):
        deltas.append((current - previous + 180) % 360 - 180)
    return deltas


def bend_runs(line):
    """Signed magnitude of each sustained turn, in degrees, along one segment.

    Positive is one direction, negative the other, so the sequence carries both
    how hard each corner is and whether the road alternates or spirals.
    """
    runs = []
    run = 0.0
    for delta in _turn_deltas(line):
        if run != 0 and (delta > 0) != (run > 0):
            if abs(delta) < NOISE_DEGREES:
                continue
            if abs(run) >= BEND_DEGREES:
                runs.append(run)
            run = 0.0
        run += delta
    if abs(run) >= BEND_DEGREES:
        runs.append(run)
    return runs


FEET_PER_METER = 3.28084
# Elevation samples carry digital-model noise. Averaging over three samples
# (300 m) removes it without flattening a real climb.
SMOOTH_WINDOW = 3
# Steepest stretch is measured over 500 m, not between adjacent samples, so one
# noisy reading cannot invent a cliff.
GRADIENT_SPAN = 5
# Elevation is sampled from a terrain model, which describes the ground, not the
# roadway. Where a road tunnels, bridges or runs on a cliff shelf, the model
# reports the hillside instead — Devil's Slide on Highway 1 reads as a 35% grade.
# Public through-roads are engineered well below this, so steps implying a
# steeper grade are treated as terrain, not road, and clamped.
MAX_PLAUSIBLE_GRADE = 0.20


def _smooth(values, window):
    if len(values) < window:
        return values
    half = window // 2
    out = []
    for i in range(len(values)):
        lo, hi = max(0, i - half), min(len(values), i + half + 1)
        out.append(sum(values[lo:hi]) / (hi - lo))
    return out


def elevation_stats(segments, step_m):
    """Climb and gradient along a road, from sampled ground elevation in metres.

    Elevation is the dimension corner geometry cannot see: it is what separates
    a mountain climb from a flat squiggle of the same curvature.
    """
    climb_m = 0.0
    highest = lowest = None
    grades = []

    for raw in segments:
        values = [v for v in raw if v is not None]
        if len(values) < 2:
            continue
        smoothed = _smooth(values, SMOOTH_WINDOW)

        limit = MAX_PLAUSIBLE_GRADE * step_m
        # Total vertical change, up and down together. Summing only the ups would
        # depend on which way round the geometry happens to be stored, and a road
        # is driven in both directions anyway.
        for previous, current in zip(smoothed, smoothed[1:]):
            climb_m += min(abs(current - previous), limit)

        for i in range(len(smoothed) - GRADIENT_SPAN):
            rise = abs(smoothed[i + GRADIENT_SPAN] - smoothed[i])
            grades.append(min(rise / (GRADIENT_SPAN * step_m), MAX_PLAUSIBLE_GRADE))

        high, low = max(smoothed), min(smoothed)
        highest = high if highest is None else max(highest, high)
        lowest = low if lowest is None else min(lowest, low)

    if highest is None:
        return None
    # The 95th percentile, not the maximum: a handful of samples on a cliff face
    # or over a tunnel would otherwise set the figure for the whole road.
    steepest = sorted(grades)[int(len(grades) * 0.95)] if grades else 0.0
    return {
        "climbFt": round(climb_m * FEET_PER_METER),
        "highFt": round(highest * FEET_PER_METER),
        "lowFt": round(lowest * FEET_PER_METER),
        "reliefFt": round((highest - lowest) * FEET_PER_METER),
        "maxGradient": round(steepest * 100, 1),
    }


def shape_stats(lines):
    """Count corners across every segment of one road.

    A run of same-direction turning is one corner. Small opposite wobbles do not
    end a run, otherwise digitising noise would split a single sweeping bend into
    several. Runs reaching BEND_DEGREES count as bends; those reaching
    SWITCHBACK_DEGREES also count as switchbacks.
    """
    length_m = sum(line_length(line) for line in lines)
    bends = switchbacks = 0
    total_turn = 0.0

    for line in lines:
        run = 0.0
        for delta in _turn_deltas(line):
            total_turn += abs(delta)
            if run != 0 and (delta > 0) != (run > 0):
                # Direction reversed. Ignore it if it is only noise.
                if abs(delta) < NOISE_DEGREES:
                    continue
                if abs(run) >= BEND_DEGREES:
                    bends += 1
                    switchbacks += abs(run) >= SWITCHBACK_DEGREES
                run = 0.0
            run += delta
        if abs(run) >= BEND_DEGREES:
            bends += 1
            switchbacks += abs(run) >= SWITCHBACK_DEGREES

    miles = length_m / METERS_PER_MILE
    return {
        'lengthMi': round(miles, 1),
        'bends': bends,
        'switchbacks': switchbacks,
        # Degrees of direction change per mile: a scale-free "how curvy" number.
        'curvature': round(total_turn / miles) if miles else 0,
        'bendsPerMile': round(bends / miles, 1) if miles else 0,
    }
