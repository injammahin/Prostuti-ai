const suffix = (n) => (n % 100 >= 11 && n % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th")

/** The page with one BCS paper's questions and answers, e.g. 41 → /bcs/41st-bcs-question-solution */
export const bcsPath = (number) => `/bcs/${number}${suffix(number)}-bcs-question-solution`

/** Solutions used to be blog articles: their new address, or null for any other article. */
export function movedPost(slug) {
  const number = /^(\d+)(?:st|nd|rd|th)-bcs-question-solution-pdf$/.exec(slug ?? "")?.[1]
  return number ? bcsPath(Number(number)) : null
}
