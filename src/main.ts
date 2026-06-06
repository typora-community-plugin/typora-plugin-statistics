import { Plugin } from '@typora-community-plugin/core'


export default class extends Plugin {

  onload() {
    const stats = this.app.features.statistics

    this.register(
      stats.registerStatistic({
        id: 'headings',
        name: 'Headings',
        eval() {
          const headings = document.querySelectorAll<HTMLElement>('[mdtype="heading"]')
          return String(headings.length)
        },
      }))

    this.register(
      stats.registerStatistic({
        id: 'paragraphs',
        name: 'Paragraphs',
        eval() {
          const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('[mdtype="paragraph"]'))
            .filter(el => el.textContent && el.textContent.trim().length > 0)
          return String(paragraphs.length)
        },
      }))

    this.register(
      stats.registerStatistic({
        id: 'sentences',
        name: 'Sentences',
        eval(context) {
          const md = context.markdown
          if (!md) return '0'
          return String(countSentences(md))
        },
      }))

    this.register(
      stats.registerStatistic({
        id: 'avg-wpp',
        name: 'Words/Paragraph',
        eval(context) {
          const md = context.markdown
          if (!md) return '0'
          const words = +(context.get('words') ?? 0)
          const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('[mdtype="paragraph"]'))
            .filter(el => el.textContent && el.textContent.trim().length > 0)
          return (words / paragraphs.length).toFixed(2)
        },
      }))

    this.register(
      stats.registerStatistic({
        id: 'avg-wps',
        name: 'Words/Sentence',
        eval(context) {
          const md = context.markdown
          if (!md) return '0'
          const words = +(context.get('words') ?? 0)
          const sentences = +(context.get('sentences') ?? 0)
          if (sentences === 0) return '0'
          return (words / sentences).toFixed(2)
        },
      }))
  }

  onunload() {
  }
}

/** Count sentences by Western (. ! ? + space/EOL) and CJK (。！？…) delimiters. */
function countSentences(md: string): number {
  const western = md.match(/[.!?](?:\s|$)/g) ?? []
  const cjk = md.match(/[。！？…]/g) ?? []
  return western.length + cjk.length
}
