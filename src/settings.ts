export interface StatisticsSettings {
  enableHeadings: boolean
  enableHeading1: boolean
  enableHeading2: boolean
  enableHeading3: boolean
  enableHeading4: boolean
  enableHeading5: boolean
  enableHeading6: boolean
  enableParagraphs: boolean
  enableSentences: boolean
  enableAvgWpp: boolean
  enableAvgWps: boolean
}

export const DEFAULT_SETTINGS: StatisticsSettings = {
  enableHeadings: true,
  enableHeading1: true,
  enableHeading2: true,
  enableHeading3: true,
  enableHeading4: true,
  enableHeading5: true,
  enableHeading6: true,
  enableParagraphs: true,
  enableSentences: true,
  enableAvgWpp: true,
  enableAvgWps: true,
}
