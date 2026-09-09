"""The Touge Score: one 0-100 number for how engaging a road is to drive.

Published in full, deliberately. A score nobody can check is a score nobody has
reason to believe, and the reasoning below is the part worth arguing with.

Three inputs, chosen because they are close to independent of one another:

  Corners   how often the road changes direction, per mile
  Climb     how much vertical it covers, per mile
  Technical our editorial difficulty rating

Corner density and total turning per mile measure the same thing (they rank at
rho = 0.99 across the collection), so only one of them is used. Elevation is the
dimension corner geometry cannot see: it is what separates a mountain climb from
a flat squiggle. The editorial rating is the human check on the two machine
measures, and correlates with them at only rho = 0.44 — it carries real
independent information about width and sightlines, which no measurement here
captures.

What this is not: a safety rating, a difficulty warning, or any suggestion of an
appropriate speed. It describes road shape and terrain. Posted signs govern.

ANCHORS ARE ABSOLUTE, NOT RELATIVE. Each input is scored against a fixed
reference value rather than against the rest of the collection. If the anchors
were percentiles, every road's score would shift whenever a road was added, and
published numbers would silently go stale. With fixed anchors, adding Los
Angeles roads leaves every existing score untouched.
"""

# Full marks at 14 bends per mile. The curviest road measured so far is Old La
# Honda at 12.0, so the scale keeps headroom rather than pinning today's best
# road at exactly 100.
CORNER_ANCHOR = 14.0

# Full marks at 500 ft of vertical per mile. Jamison Creek, a road that exists
# mainly to climb, measures 494.
CLIMB_ANCHOR = 500.0

# Weights sum to 100. Corners lead because cornering is what a touge is for;
# climb is the second axis; the editorial rating moderates both.
WEIGHT_CORNERS = 45
WEIGHT_CLIMB = 35
WEIGHT_TECHNICAL = 20


def _capped(value, anchor):
    return min(1.0, max(0.0, value / anchor))


def touge_score(shape, elevation, difficulty):
    """Return the 0-100 score and the three parts it is made of."""
    corners = _capped(shape["bendsPerMile"], CORNER_ANCHOR)
    miles = shape["lengthMi"] or 1
    climb = _capped((elevation["climbFt"] if elevation else 0) / miles, CLIMB_ANCHOR)
    # Difficulty is 1-3, so 1 scores nothing and 3 scores full.
    technical = (difficulty - 1) / 2

    total = corners * WEIGHT_CORNERS + climb * WEIGHT_CLIMB + technical * WEIGHT_TECHNICAL
    return {
        "score": round(total),
        "corners": round(corners * WEIGHT_CORNERS),
        "climb": round(climb * WEIGHT_CLIMB),
        "technical": round(technical * WEIGHT_TECHNICAL),
    }
