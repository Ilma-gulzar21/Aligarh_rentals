/* =========================================================
   ALIGARH RENTALS
   AREA NORMALIZER
   ---------------------------------------------------------
   Purpose:
   Convert different user-written area formats into
   one canonical area key.

   Examples:

   Shahjamal
   Shah Jamal
   Shahjmal
   Near Shahjamal
   Shahjamal Road

   All can map to:

   areaKey = "shahjamal"

   NOTE:
   This file does NOT change the original user input.

   area  = original user input
   areaKey = normalized canonical key
========================================================= */

"use strict";


/* =========================================================
   MAIN ALIGARH AREAS
========================================================= */

const MAIN_AREAS = [

    {
        key: "shahjamal",
        name: "Shahjamal"
    },

    {
        key: "civil-lines",
        name: "Civil Lines"
    },

    {
        key: "ramghat-road",
        name: "Ramghat Road"
    },

    {
        key: "medical-road",
        name: "Medical Road"
    },

    {
        key: "center-point",
        name: "Center Point"
    },

    {
        key: "dodhpura",
        name: "Dodhpura"
    },

    {
        key: "upper-fort",
        name: "Upper Fort"
    },

    {
        key: "lower-fort",
        name: "Lower Fort"
    },

    {
        key: "sarsol",
        name: "Sarsol"
    },

    {
        key: "quarsi",
        name: "Quarsi"
    },

    {
        key: "quarsi-bypass",
        name: "Quarsi Bypass"
    },

    {
        key: "marris-road",
        name: "Marris Road"
    },

    {
        key: "amu",
        name: "AMU"
    },

    {
        key: "amu-campus",
        name: "AMU Campus"
    },

    {
        key: "abdullah-college",
        name: "Abdullah College"
    },

    {
        key: "ramghat",
        name: "Ramghat"
    },

    {
        key: "gt-road",
        name: "GT Road"
    },

    {
        key: "mathura-road",
        name: "Mathura Road"
    },

    {
        key: "agra-road",
        name: "Agra Road"
    },

    {
        key: "delhi-gate",
        name: "Delhi Gate"
    },

    {
        key: "lal-diggi",
        name: "Lal Diggi"
    },

    {
        key: "naurangabad",
        name: "Naurangabad"
    },

    {
        key: "banne-devi",
        name: "Banne Devi"
    },

    {
        key: "tasveer-mahal",
        name: "Tasveer Mahal"
    },

    {
        key: "kelanagar",
        name: "Kela Nagar"
    },

    {
        key: "sangam-vihar",
        name: "Sangam Vihar"
    }

];


/* =========================================================
   TEXT CLEANING
========================================================= */

function cleanAreaText(value) {

    if (
        typeof value !== "string"
    ) {
        return "";
    }


    return value

        .trim()

        .toLowerCase()

        // Replace punctuation / special characters
        // with spaces

        .replace(
            /[.,/\\|()[\]{}:;'"`!?_-]/g,
            " "
        )

        // Remove extra spaces

        .replace(
            /\s+/g,
            " "
        )

        .trim();
}


/* =========================================================
   WORD NORMALIZATION
========================================================= */

function normalizeCommonWords(text) {

    return text

        // =============================================
        // SHAHJAMAL VARIATIONS
        // =============================================

        .replace(
            /\bshah\s+jamal\b/g,
            "shahjamal"
        )

        .replace(
            /\bshahjmal\b/g,
            "shahjamal"
        )


        // =============================================
        // NEAR / LOCATION WORDS
        // =============================================

        .replace(
            /\bnear\b/g,
            " "
        )

        .replace(
            /\bnearby\b/g,
            " "
        )

        .replace(
            /\bpass\b/g,
            " "
        )

        .replace(
            /\bpaas\b/g,
            " "
        )

        .replace(
            /\bke\s+paas\b/g,
            " "
        )

        .replace(
            /\bke\s+pass\b/g,
            " "
        )


        // =============================================
        // ROAD WORDS
        // =============================================

        .replace(
            /\broad\b/g,
            " "
        )

        .replace(
            /\brd\b/g,
            " "
        )

        .replace(
            /\broadside\b/g,
            " "
        )


        // =============================================
        // COMMON LOCATION WORDS
        // =============================================

        .replace(
            /\barea\b/g,
            " "
        )

        .replace(
            /\blocality\b/g,
            " "
        )

        .replace(
            /\baligarh\b/g,
            " "
        )

        .replace(
            /\bup\b/g,
            " "
        )

        .replace(
            /\buttar\s+pradesh\b/g,
            " "
        )


        // =============================================
        // FINAL SPACE CLEANUP
        // =============================================

        .replace(
            /\s+/g,
            " "
        )

        .trim();
}


/* =========================================================
   EXACT AREA MATCH
========================================================= */

function findExactArea(text) {

    if (!text) {
        return null;
    }


    const cleaned =
        normalizeCommonWords(text);


    const cleanedWithoutSpaces =
        cleaned.replace(
            /\s+/g,
            ""
        );


    for (
        const area of MAIN_AREAS
    ) {

        const areaName =
            cleanAreaText(
                area.name
            );


        const areaKey =
            cleanAreaText(
                area.key
            ).replace(
                /\s+/g,
                ""
            );


        // =============================================
        // EXACT KEY MATCH
        // =============================================

        if (
            cleanedWithoutSpaces ===
            areaKey
        ) {

            return area;

        }


        // =============================================
        // EXACT DISPLAY NAME MATCH
        // =============================================

        if (
            cleaned ===
            areaName
        ) {

            return area;

        }


        // =============================================
        // DISPLAY NAME WITHOUT SPACES
        // =============================================

        const areaNameWithoutSpaces =
            areaName.replace(
                /\s+/g,
                ""
            );


        if (
            cleanedWithoutSpaces ===
            areaNameWithoutSpaces
        ) {

            return area;

        }

    }


    return null;
}


/* =========================================================
   AREA NAME INSIDE USER TEXT
========================================================= */

function findAreaInsideText(text) {

    if (!text) {
        return null;
    }


    const cleaned =
        normalizeCommonWords(text);


    const cleanedWithoutSpaces =
        cleaned.replace(
            /\s+/g,
            ""
        );


    /* -----------------------------------------------------
       Sort longest names first.

       Example:

       "Ramghat Road"
       should be checked before
       "Ramghat"

       This prevents the shorter area from being selected.
    ----------------------------------------------------- */

    const sortedAreas =
        [...MAIN_AREAS].sort(
            (a, b) =>
                b.name.length -
                a.name.length
        );


    for (
        const area of sortedAreas
    ) {

        const areaName =
            cleanAreaText(
                area.name
            );


        const areaKey =
            area.key
                .toLowerCase()
                .replace(
                    /-/g,
                    ""
                );


        const areaNameWithoutSpaces =
            areaName.replace(
                /\s+/g,
                ""
            );


        // =============================================
        // MATCH AREA DISPLAY NAME
        // =============================================

        if (
            cleanedWithoutSpaces.includes(
                areaNameWithoutSpaces
            )
        ) {

            return area;

        }


        // =============================================
        // MATCH CANONICAL KEY
        // =============================================

        if (
            cleanedWithoutSpaces.includes(
                areaKey
            )
        ) {

            return area;

        }

    }


    return null;
}


/* =========================================================
   MAIN NORMALIZER
   ---------------------------------------------------------
   IMPORTANT:

   This function returns ONLY a STRING.

   Known area:
       "shahjamal"

   Unknown area:
       null

   It does NOT return:

       {
           key,
           name,
           matched
       }

   because Listing.areaKey is a String field.
========================================================= */

function normalizeArea(value) {

    const cleaned =
        cleanAreaText(value);


    // =============================================
    // EMPTY VALUE
    // =============================================

    if (!cleaned) {

        return null;

    }


    // =============================================
    // STEP 1
    // EXACT MATCH
    // =============================================

    let matchedArea =
        findExactArea(
            cleaned
        );


    // =============================================
    // STEP 2
    // AREA INSIDE LONGER TEXT
    // =============================================

    if (!matchedArea) {

        matchedArea =
            findAreaInsideText(
                cleaned
            );

    }


    // =============================================
    // KNOWN AREA FOUND
    // =============================================

    if (matchedArea) {

        return matchedArea.key;

    }


    // =============================================
    // UNKNOWN AREA
    // =============================================

    return null;
}


/* =========================================================
   GET ALL MAIN AREAS
========================================================= */

function getMainAreas() {

    return [
        ...MAIN_AREAS
    ];

}


/* =========================================================
   GET AREA BY KEY
========================================================= */

function getAreaByKey(areaKey) {

    if (
        typeof areaKey !== "string"
    ) {

        return null;

    }


    const cleanKey =
        areaKey
            .trim()
            .toLowerCase();


    return (

        MAIN_AREAS.find(
            area =>
                area.key ===
                cleanKey
        )

        || null

    );

}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    normalizeArea,

    getMainAreas,

    getAreaByKey,

    MAIN_AREAS

};