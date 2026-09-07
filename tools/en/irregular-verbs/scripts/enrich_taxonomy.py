#!/usr/bin/env python3
"""
Enrich tools/en/irregular-verbs/data/verbs.json with a finer linguistic taxonomy.

ADDITIVE only: keeps the existing `pattern_group` field (used by the engine's
practice.js) and adds two new fields to every verb:

  - subgroup:       a finer linguistic family (see SUBGROUPS below)
  - vowel_pattern:  the base/past/participle vowel sequence, e.g. "i-a-u"

Also prints a distribution + the 'other' bucket so we can review edge cases.
"""
import json, collections, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data", "verbs.json")

SUBGROUPS = {
    "i_a_u_ablaut": "Classic i->a->u ablaut (sing/sang/sung, ring/rang/rung, drink/drank/drunk).",
    "ew_own": "Past ends -ew, participle ends -own (fly/flew/flown, grow/grew/grown, throw/threw/thrown).",
    "ew_awe_family": "Past ends -ew, participle ends -awn (draw/drew/drawn, withdraw/withdrew/withdrawn).",
    "ore_orne": "Past ends -ore, participle ends -orne (bear/bore/borne).",
    "ore_orn_family": "Past ends -ore, participle ends -orn (wear/wore/worn, swear/swore/sworn, shear/shore/shorn).",
    "did_done_family": "Base ends -o, participle ends -one (do/did/done, outdo/outdid/outdone, undergo/underwent/undergone).",
    "regular_past_n_participle": "Regular -ed past + -wn participle (saw/sawed/sawn, sow/sowed/sown, hew/hewed/hewn).",
    "ought_aught": "Past & participle end in -ought/-aught (think/thought, buy/bought).",
    "ablaut_plus_en": "Vowel change + -en participle (speak/spoke/spoken, write/wrote/written, break/broke/broken).",
    "a_ou_a_come_family": "a->ou->a, base==participle (come/came/come, become/became/become).",
    "base_past_base": "A-B-A: participle == base (run/ran/run, sit/sat/sat, win/won/won).",
    "base_past_past": "A-B-B: past == participle (find/found/found, hold/held/held, bind/bound/bound).",
    "no_change": "All three forms identical (put/put/put, cut/cut/cut).",
    "totally_irregular": "Suppletive / no recoverable pattern (be, go, do).",
    "other": "Does not match a known subgroup (review for reclassification).",
}

VOWELS = set("aeiou")

def first_vowel(word):
    for ch in word:
        if ch in VOWELS:
            return ch
    return "-"

def norm(form):
    if not form:
        return ""
    # "was/were" -> "was"; take the first listed form
    return form.lower().strip().split("/")[0].split()[0]

def classify(base, past, participle):
    b, p, pp = norm(base), norm(past), norm(participle)

    # Totally irregular / suppletive (be, go, do + modals)
    if b in {"be", "go", "do", "will", "can", "may", "might", "must", "shall",
             "should", "would", "could", "ought"}:
        return "totally_irregular"

    # All three identical -> no change
    if b and b == p == pp:
        return "no_change"

    # -ought / -aught family (past == participle, ending in -ought/-aught)
    if (p.endswith("ought") or p.endswith("aught")) and p == pp:
        return "ought_aught"

    # i-a-u ablaut: base has i, past has a, participle has u, all distinct
    if ("i" in b) and ("a" in p) and ("u" in pp) and b != p and p != pp and b != pp:
        return "i_a_u_ablaut"  # sing/sang/sung, drink/drank/drunk

    # -ew / -own family: past ends -ew, participle ends -own
    if p.endswith("ew") and pp.endswith("own") and p != pp:
        return "ew_own"  # fly/flew/flown, grow/grew/grown

    # -ew / -awn family: past ends -ew, participle ends -awn
    if p.endswith("ew") and pp.endswith("awn") and p != pp:
        return "ew_awe_family"  # draw/drew/drawn, withdraw/withdrew/withdrawn

    # -ore / -orne family: past ends -ore, participle ends -orne
    if p.endswith("ore") and pp.endswith("orne") and p != pp:
        return "ore_orne"  # bear/bore/borne

    # -ore / -orn family: past ends -ore, participle ends -orn
    if p.endswith("ore") and pp.endswith("orn") and p != pp:
        return "ore_orn_family"  # wear/wore/worn, swear/swore/sworn

    # do-family: base ends -o, participle ends -one (do/did/done, outdo/outdid/outdone)
    if b.endswith("o") and pp.endswith("one") and pp != b:
        return "did_done_family"

    # regular -ed past + -wn participle (saw/sawed/sawn, sow/sowed/sown, hew/hewed/hewn)
    if p.endswith("ed") and pp.endswith("wn") and p != pp:
        return "regular_past_n_participle"

    # Vowel change + -en participle, all three distinct
    if pp.endswith("en") and pp != p and pp != b:
        return "ablaut_plus_en"  # speak/spoke/spoken, write/wrote/written

    # come-family: base ends -ome, participle == base, past ends -ame
    if b.endswith("ome") and pp == b and p.endswith("ame"):
        return "a_ou_a_come_family"

    # A-B-A: participle == base, past differs
    if pp == b and p != b:
        return "base_past_base"

    # A-B-B: past == participle, both differ from base
    if p == pp and p != b:
        return "base_past_past"

    return "other"


def main():
    with open(DATA, "r", encoding="utf-8") as f:
        data = json.load(f)

    counts = collections.Counter()
    others = []
    for verb, entry in data.items():
        subgroup = classify(entry.get("base", verb),
                           entry.get("past_simple", ""),
                           entry.get("past_participle", ""))
        entry["subgroup"] = subgroup
        # vowel pattern e.g. "i-a-u"
        vp = "-".join(first_vowel(norm(w)) for w in
                      (entry.get("base", verb),
                       entry.get("past_simple", ""),
                       entry.get("past_participle", "")))
        entry["vowel_pattern"] = vp
        counts[subgroup] += 1
        if subgroup == "other":
            others.append((verb, entry.get("past_simple"), entry.get("past_participle")))

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Enriched {len(data)} verbs. Subgroup distribution:")
    for k, v in counts.most_common():
        print(f"  {k:24s} {v:3d}  {SUBGROUPS[k]}")
    if others:
        print(f"\n'other' bucket ({len(others)}) — review:")
        for o in others:
            print(f"  {o[0]:18s} {o[1]} | {o[2]}")

if __name__ == "__main__":
    main()
