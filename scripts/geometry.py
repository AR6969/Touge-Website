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
