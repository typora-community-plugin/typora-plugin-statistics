import { I18n, Plugin, PluginSettings, StatisticHandler } from '@typora-community-plugin/core'
import type { DisposeFunc } from '@typora-community-plugin/core'
import { LANGS } from './i18n'
import { StatisticsSettingTab } from './setting-tab'
import { DEFAULT_SETTINGS, StatisticsSettings } from './settings'


export default class StatisticsPlugin extends Plugin<StatisticsSettings> {

  i18n = new I18n({
    resources: LANGS,
  })

  private statDisposers = new Map<string, DisposeFunc>()

  async onload() {
    this.registerSettings(
      new PluginSettings(this.app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(DEFAULT_SETTINGS)

    const stats = this.app.features.statistics
    const { t } = this.i18n

    const statHandlers: Array<{ key: string, handler: StatisticHandler }> = [
      {
        key: 'enableHeadings',
        handler: {
          id: 'headings',
          name: t.statHeadings,
          eval() {
            return String(countELements('[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading1',
        handler: {
          id: 'heading-1',
          name: t.statHeading1,
          eval() {
            return String(countELements('h1[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading2',
        handler: {
          id: 'heading-2',
          name: t.statHeading2,
          eval() {
            return String(countELements('h2[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading3',
        handler: {
          id: 'heading-3',
          name: t.statHeading3,
          eval() {
            return String(countELements('h3[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading4',
        handler: {
          id: 'heading-4',
          name: t.statHeading4,
          eval() {
            return String(countELements('h4[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading5',
        handler: {
          id: 'heading-5',
          name: t.statHeading5,
          eval() {
            return String(countELements('h5[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading6',
        handler: {
          id: 'heading-6',
          name: t.statHeading6,
          eval() {
            return String(countELements('h6[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableParagraphs',
        handler: {
          id: 'paragraphs',
          name: t.statParagraphs,
          eval() {
            return String(countELements('[mdtype="paragraph"]'))
          },
        },
      },
      {
        key: 'enableSentences',
        handler: {
          id: 'sentences',
          name: t.statSentences,
          eval(context) {
            const md = context.markdown
            if (!md) return '0'
            return String(countSentences(md))
          },
        },
      },
      {
        key: 'enableAvgWpp',
        handler: {
          id: 'avg-wpp',
          name: t.statAvgWpp,
          eval(context) {
            const md = context.markdown
            if (!md) return '0'
            const words = +(context.get('words') ?? 0)
            const paragraphs = countELements('[mdtype="paragraph"]')
            if (!paragraphs) return '0'
            return (words / paragraphs).toFixed(2)
          },
        },
      },
      {
        key: 'enableAvgWps',
        handler: {
          id: 'avg-wps',
          name: t.statAvgWps,
          eval(context) {
            const md = context.markdown
            if (!md) return '0'
            const words = +(context.get('words') ?? 0)
            const sentences = +(context.get('sentences') ?? countSentences(md))
            if (sentences === 0) return '0'
            return (words / sentences).toFixed(2)
          },
        },
      },
    ]

    const selectionStatHandlers: Array<{ key: string, handler: StatisticHandler }> = [
      {
        key: 'enableHeading1',
        handler: {
          id: 'sel-heading-1',
          name: t.statHeading1,
          eval() {
            return String(countSelectionElements('h1[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading2',
        handler: {
          id: 'sel-heading-2',
          name: t.statHeading2,
          eval() {
            return String(countSelectionElements('h2[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading3',
        handler: {
          id: 'sel-heading-3',
          name: t.statHeading3,
          eval() {
            return String(countSelectionElements('h3[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading4',
        handler: {
          id: 'sel-heading-4',
          name: t.statHeading4,
          eval() {
            return String(countSelectionElements('h4[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading5',
        handler: {
          id: 'sel-heading-5',
          name: t.statHeading5,
          eval() {
            return String(countSelectionElements('h5[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableHeading6',
        handler: {
          id: 'sel-heading-6',
          name: t.statHeading6,
          eval() {
            return String(countSelectionElements('h6[mdtype="heading"]'))
          },
        },
      },
      {
        key: 'enableParagraphs',
        handler: {
          id: 'sel-paragraphs',
          name: t.statParagraphs,
          eval() {
            return String(countSelectionElements('[mdtype="paragraph"]'))
          },
        },
      },
      {
        key: 'enableSentences',
        handler: {
          id: 'sel-sentences',
          name: t.statSentences,
          eval(context) {
            const text = context.selectionText
            if (!text) return '0'
            return String(countSentences(text))
          },
        },
      },
      {
        key: 'enableAvgWpp',
        handler: {
          id: 'sel-avg-wpp',
          name: t.statAvgWpp,
          eval(context) {
            const text = context.selectionText
            if (!text) return '0'
            const words = +(context.get('selected-words') ?? 0)
            const paragraphs = countSelectionElements('[mdtype="paragraph"]')
            if (!paragraphs) return '0'
            return (words / paragraphs).toFixed(2)
          },
        },
      },
      {
        key: 'enableAvgWps',
        handler: {
          id: 'sel-avg-wps',
          name: t.statAvgWps,
          eval(context) {
            const text = context.selectionText
            if (!text) return '0'
            const words = +(context.get('selected-words') ?? 0)
            const sentences = +(context.get('sel-sentences') ?? countSentences(text))
            if (!sentences) return '0'
            return (words / sentences).toFixed(2)
          },
        },
      },
    ]

    const registerStats = () => {
      this.statDisposers.forEach(d => d())
      this.statDisposers.clear()

      for (const { key, handler } of statHandlers) {
        if (this.settings.get(key as any)) {
          const dispose = stats.registerStatistic(handler)
          this.statDisposers.set(handler.id, dispose)
        }
      }

      for (const { key, handler } of selectionStatHandlers) {
        if (this.settings.get(key as any)) {
          const dispose = stats.registerSelectionStatistic(handler)
          this.statDisposers.set(handler.id, dispose)
        }
      }
    }

    // Listen for setting changes to re-register stats live
    const keys = [...statHandlers.map(s => s.key), ...selectionStatHandlers.map(s => s.key)]
    for (const key of keys) {
      this.register(
        this.settings.onChange(key as any, () => registerStats())
      )
    }

    registerStats()

    this.registerSettingTab(new StatisticsSettingTab(this))
  }

  onunload() {
    this.statDisposers.forEach(d => d())
    this.statDisposers.clear()
  }
}

function countELements(selector: string): number {
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter(el => el.textContent && el.textContent.trim().length > 0)
    .length
}

/** Count elements matching a CSS selector within the selected region. */
function countSelectionElements(selector: string): number {
  const sel = document.getSelection()
  if (!sel || sel.isCollapsed || !sel.rangeCount) return 0

  const range = sel.getRangeAt(0)
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter(el => el.textContent && el.textContent.trim().length > 0)
  let count = 0

  for (const el of elements) {
    if (range.intersectsNode(el)) count++
  }

  return count
}

/** Count sentences by Western (. ! ? + space/EOL) and CJK (。！？…) delimiters. */
function countSentences(md: string): number {
  const western = md.match(/[.!?](?:\s|$)/g) ?? []
  const cjk = md.match(/[。！？…]/g) ?? []
  return western.length + cjk.length
}
