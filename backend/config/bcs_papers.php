<?php

/*
|--------------------------------------------------------------------------
| Previous BCS preliminary papers
|--------------------------------------------------------------------------
|
| The "Previous BCS questions" page lists every BCS from `first` to `latest`,
| newest first. MCQ preliminary tests began with the 10th BCS. When a new BCS
| preliminary is held, raise `latest`. Questions are linked to a paper through
| their "source" field, written like "47th BCS".
|
*/

return [
    'first' => (int) env('BCS_PAPERS_FIRST', 10),

    'latest' => (int) env('BCS_PAPERS_LATEST', 48),

    // Special BCS (held for particular cadres, e.g. health). Shown with a "Special" tag.
    'special' => [32, 39, 42, 48],
];
