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
            const headings = document.querySelectorAll<HTMLElement>('[mdtype="heading"]')
            return String(headings.length)
          },
        },
      },
      {
        key: 'enableParagraphs',
        handler: {
          id: 'paragraphs',
          name: t.statParagraphs,
          eval() {
            const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('[mdtype="paragraph"]'))
              .filter(el => el.textContent && el.textContent.trim().length > 0)
            return String(paragraphs.length)
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
            const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('[mdtype="paragraph"]'))
              .filter(el => el.textContent && el.textContent.trim().length > 0)
            return (words / paragraphs.length).toFixed(2)
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

    const registerStats = () => {
      this.statDisposers.forEach(d => d())
      this.statDisposers.clear()

      for (const { key, handler } of statHandlers) {
        if (this.settings.get(key as any)) {
          const dispose = stats.registerStatistic(handler)
          this.statDisposers.set(handler.id, dispose)
        }
      }
    }

    // Listen for setting changes to re-register stats live
    const keys = statHandlers.map(s => s.key)
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

/** Count sentences by Western (. ! ? + space/EOL) and CJK (。！？…) delimiters. */
function countSentences(md: string): number {
  const western = md.match(/[.!?](?:\s|$)/g) ?? []
  const cjk = md.match(/[。！？…]/g) ?? []
  return western.length + cjk.length
}
