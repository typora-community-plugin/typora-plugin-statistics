export interface StatisticsSettings {
  enableHeadings: boolean
  enableParagraphs: boolean
  enableSentences: boolean
  enableAvgWpp: boolean
  enableAvgWps: boolean
}

export const DEFAULT_SETTINGS: StatisticsSettings = {
  enableHeadings: true,
  enableParagraphs: true,
  enableSentences: true,
  enableAvgWpp: true,
  enableAvgWps: true,
}
