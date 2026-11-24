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

    // Every historical paper is available with full 200 questions and full 200 marks.
    'two_hundred_from' => 10,
    'sizes' => [],

    // Full 200 marks for all papers.
    'marks' => [],

    // Preliminary exam dates (Y-m-d) shown on a paper's header, where known.
    'dates' => [
        10 => '1989-12-22', 11 => '1991-10-17', 12 => '1992-05-15', 13 => '1992-10-23', 14 => '1993-04-09',
        15 => '1993-08-29', 16 => '1994-09-02', 17 => '1995-12-08', 18 => '1997-04-25', 19 => '1998-05-22',
        20 => '1998-12-11', 21 => '1999-12-24', 22 => '2001-02-02', 23 => '2001-03-23', 24 => '2003-08-08',
        25 => '2004-09-03', 26 => '2004-12-31', 27 => '2005-11-18', 28 => '2008-11-28', 29 => '2009-08-14',
        30 => '2010-05-30', 31 => '2011-05-27', 32 => '2012-03-09', 33 => '2012-06-01', 34 => '2013-05-24',
        35 => '2015-03-06', 36 => '2016-01-08', 37 => '2016-09-30', 38 => '2017-12-29', 39 => '2018-08-03',
        40 => '2019-05-03', 41 => '2021-03-19', 42 => '2021-02-26', 43 => '2021-10-29', 44 => '2022-05-27',
        45 => '2023-05-19', 46 => '2024-04-26', 47 => '2025-09-19', 48 => '2025-07-18',
    ],
];
