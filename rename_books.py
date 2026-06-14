#!/usr/bin/env python3
"""
Script to rename categories, subcategories, and books with proper numbering and suffixes.
"""

import os
import shutil
from pathlib import Path
import json

BASE_DIR = Path("knowledge/01-mind-behavior-and-human-performance")

# New category order with proper naming
NEW_CATEGORY_ORDER = [
    "learning-and-skill-acquisition-category",
    "habits-productivity-and-focus-category",
    "cognitive-biases-and-rationality-category",
    "decision-making-systems-thinking-category",
    "social-psychology-category",
    "behavioral-psychology-category",
    "clinical-psychology-category",
    "positive-psychology-category",
    "mental-models-category",
    "evolutionary-psychology-category",
    "industrial-organizational-psychology-category",
]

# Current category names mapped to new order
CURRENT_TO_NEW = {
    "01-behavioral-psychology": "01-learning-and-skill-acquisition-category",
    "02-clinical-psychology": "02-habits-productivity-and-focus-category",
    "03-cognitive-and-behavioral-psychology": "03-cognitive-biases-and-rationality-category",
    "04-cognitive-biases-and-rationality": "04-decision-making-systems-thinking-category",
    "05-creativity-and-innovation": "05-social-psychology-category",
    "06-habits-productivity-and-focus": "06-behavioral-psychology-category",
    "07-learning-and-skill-acquisition": "07-clinical-psychology-category",
    "08-mental-models-and-decision-making": "08-positive-psychology-category",
    "09-personality-psychology": "09-mental-models-category",
    "10-positive-psychology": "10-evolutionary-psychology-category",
    "11-probability-forecasting-and-risk": "11-industrial-organizational-psychology-category",
    "12-social-psychology": None,  # Will be handled separately
    "13-systems-thinking-and-game-theory": None,
    "evolutionary-psychology": None,
    "industrial-organizational-psychology": None,
}

# Subcategory order within each category (index 0 = first)
SUBCATEGORY_ORDERS = {
    "learning-and-skill-acquisition-category": [
        "meta-learning-and-learning-to-learn",
        "spaced-repetition-and-anki",
        "the-first-20-hours-josh-kaufman",
        "how-to-read-actively-and-efficiently",
        "ultralearning-and-rapid-skill-acquisition",
        "the-art-of-learning-josh-waitzkin",
        "peak-anders-ericsson",
        "talent-is-overrated-geoff-colvin",
        "the-little-book-of-talent-daniel-coyle",
        "the-talent-code-daniel-coyle",
        "ultralearning-scott-young",
        "mastery-robert-greene",
        "outliers-malcolm-gladwell",
        "moonwalking-with-einstein-joshua-foer",
        "note-taking-as-thinking",
        "personal-knowledge-management-systems",
        "zettelkasten-roam-research-obsidian",
    ],
    "habits-productivity-and-focus-category": [
        "tiny-habits-bj-fogg",
        "habit-loops-and-cue-routine-reward-models",
        "keystone-habits-and-identity-based-change",
        "atomic-habits-james-clear",
        "the-power-of-habit-charles-duhigg",
        "smarter-faster-better-charles-duhigg",
        "deep-work-cal-newport",
        "deep-work-theory-and-practice",
        "time-blocking-and-calendar-architecture",
        "switch-chip-dan-heath",
        "essentialism-greg-mckeown",
        "the-one-thing-gary-keller",
        "getting-things-done-david-allen",
        "getting-things-done-and-zero-inbox-systems",
        "eisenhower-matrix-and-priority-frameworks",
        "distraction-focus-and-cognitive-bandwidth",
        "mindistractable-nir-eyal",
        "fixed-vs-growth-mindset",
        "assertiveness-training",
        "building-self-worth",
        "overcoming-imposter-syndrome",
        "triggers-marshall-goldsmith",
        "why-we-work-barry-schwartz",
        "willpower-baumeister-tierney",
        "better-than-before-gretchen-rubin",
        "behavioral-design-for-personal-systems",
        "recovery-rest-and-strategic-downtime",
        "role-of-nutrition-and-exercise-on-cognitive-output",
        "circadian-rhythms-and-chronobiology",
        "the-compound-effect-darren-hardy",
        "the-happiness-advantage-shawn-achor",
        "the-six-pillars-of-self-esteem-nathaniel-branden",
        "four-thousand-weeks-oliver-burkeman",
        "systems-thinking-for-personal-goals",
    ],
    "cognitive-biases-and-rationality-category": [
        "factfulness-hans-rosling",
        "scout-mindset-julia-galef",
        "catalogue-of-human-cognitive-biases",
        "debiasing-strategies-and-decision-hygiene",
    ],
    "decision-making-systems-thinking-category": [
        "decision-quality-carl-spetzler",
        "decisive-chip-dan-heath",
        "how-to-decide-annie-duke",
        "thinking-in-bets-annie-duke",
        "the-power-of-knowing-what-you-know-annie-duke",
        "nudge-richard-thaler",
        "algorithms-to-live-by-brian-christian",
        "smart-choices-hammond-keeney-raiffa",
        "the-paradox-of-choice-barry-schwartz",
        "the-art-of-decision-making-joseph-bikart",
        "the-matrix-decision-making-georgiy",
        "lattices-of-mental-models",
        "great-mental-models-volume-1-shane-parrish",
        "great-mental-models-vol-5-shane-parrish",
        "great-mental-models-volume-2-shane-parrish",
    ],
    "social-psychology-category": [
        "the-righteous-mind-jonathan-haidt",
        "pre-suasion-robert-cialdini",
        "influence-robert-cialdini",
        "the-charisma-myth-olivia-fox-cabane",
        "the-5-love-languages-gary-chapman",
        "mistakes-were-made-but-not-by-me-carol-tavris",
        "prosocial-behavior-and-altruism",
        "prejudice-discrimination-and-intergroup-relations",
        "group-dynamics-conformity-and-obedience",
        "interpersonal-skills-and-eq",
        "emotional-intelligence-daniel-goleman",
        "romantic-relationships-and-attachment",
        "building-deep-friendships",
    ],
    "behavioral-psychology-category": [
        "classical-and-operant-conditioning",
        "behavior-modification-and-applied-behavior-analysis",
        "child-development",
        "the-developing-mind-daniel-siegel",
        "the-whole-brain-child-daniel-siegel",
        "no-drama-discipline-siegel-bryson",
        "how-children-succeed-paul-tough",
        "the-gardener-and-carpenter-alison-gopnik",
        "mindsight-daniel-siegel",
        "brainstorm-daniel-siegel",
        "adolescent-psychology-and-identity-formation",
        "adult-development-and-aging",
    ],
    "clinical-psychology-category": [
        "diagnosis-and-classification-dsm-5",
        "evidence-based-psychotherapy",
        "trauma-and-post-traumatic-growth",
        "anxiety-phobia-workbook-edmund-bourne",
    ],
    "positive-psychology-category": [
        "well-being-science-and-the-perma-model",
        "character-strengths-and-virtues",
        "flow-meaning-and-eudaimonia",
        "building-resilience-and-ptg",
        "anxiety-and-stress-management",
        "managing-depression-through-behavioral-activation",
        "the-happiness-hypothesis-jonathan-haidt",
    ],
    "mental-models-category": [
        "great-mental-models-volume-1-shane-parrish",
        "decisive-chip-dan-heath",
        "decision-quality-carl-spetzler",
        "algorithms-to-live-by-brian-christian",
        "nudge-richard-thaler",
        "how-to-decide-annie-duke",
        "thinking-in-bets-annie-duke",
        "the-paradox-of-choice-barry-schwartz",
        "the-art-of-decision-making-joseph-bikart",
        "smart-choices-hammond-keeney-raiffa",
    ],
    "evolutionary-psychology-category": [
        "evolutionary-origins-of-human-behavior",
        "mating-cooperation-and-competition",
        "cross-cultural-universals-of-human-behavior",
    ],
    "industrial-organizational-psychology-category": [
        "workplace-motivation-and-engagement",
        "team-dynamics-and-group-decision-making",
        "leadership-psychology",
    ],
}


def main():
    # Step 1: Rename categories
    print("=== Renaming Categories ===")
    for idx, (old_name, new_name) in enumerate(CURRENT_TO_NEW.items(), 1):
        if new_name is None:
            continue
        old_path = BASE_DIR / old_name
        if old_path.exists():
            print(f"Renaming {old_name} -> {new_name}")
            old_path.rename(BASE_DIR / new_name)

    # Step 2: Rename subcategories
    print("\n=== Renaming Subcategories ===")
    for cat_name, subcats in SUBCATEGORY_ORDERS.items():
        cat_path = BASE_DIR / cat_name
        if not cat_path.exists():
            print(f"Category not found: {cat_name}")
            continue
        
        for sub_idx, sub_name in enumerate(subcats, 1):
            old_sub_path = cat_path / sub_name
            if old_sub_path.exists():
                new_sub_name = f"{sub_idx:02d}-{sub_name}-subcategory"
                print(f"  {sub_name} -> {new_sub_name}")
                old_sub_path.rename(cat_path / new_sub_name)

    # Step 3: Rename books
    print("\n=== Renaming Books ===")
    for cat_name, subcats in SUBCATEGORY_ORDERS.items():
        cat_path = BASE_DIR / cat_name
        if not cat_path.exists():
            continue
        
        for sub_name in subcats:
            sub_path = cat_path / sub_name
            if not sub_path.exists():
                continue
            
            books = sorted([d for d in sub_path.iterdir() if d.is_dir()])
            for book_idx, book_path in enumerate(books, 1):
                new_book_name = f"{book_idx:02d}-{book_path.name}-book"
                print(f"    {book_path.name} -> {new_book_name}")
                book_path.rename(sub_path / new_book_name)


if __name__ == "__main__":
    main()