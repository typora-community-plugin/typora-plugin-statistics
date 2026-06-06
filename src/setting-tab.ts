import { SettingTab } from "@typora-community-plugin/core"
import type StatisticsPlugin from "./main"


export class StatisticsSettingTab extends SettingTab {

  get name() {
    return 'Statistics'
  }

  constructor(private plugin: StatisticsPlugin) {
    super()
  }

  show() {
    const { plugin } = this

    this.containerEl.innerHTML = ''

    this.addSettingTitle('Statistics')

    this.addSetting(setting => {
      setting.addName('Headings')
      setting.addDescription('Count headings in the document')
      setting.addCheckbox(checkbox => {
        checkbox.checked = plugin.settings.get('enableHeadings')
        checkbox.onchange = () => {
          plugin.settings.set('enableHeadings', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName('Paragraphs')
      setting.addDescription('Count non-empty paragraphs')
      setting.addCheckbox(checkbox => {
        checkbox.checked = plugin.settings.get('enableParagraphs')
        checkbox.onchange = () => {
          plugin.settings.set('enableParagraphs', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName('Sentences')
      setting.addDescription('Count sentences (Western and CJK)')
      setting.addCheckbox(checkbox => {
        checkbox.checked = plugin.settings.get('enableSentences')
        checkbox.onchange = () => {
          plugin.settings.set('enableSentences', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName('Words/Paragraph')
      setting.addDescription('Average words per paragraph')
      setting.addCheckbox(checkbox => {
        checkbox.checked = plugin.settings.get('enableAvgWpp')
        checkbox.onchange = () => {
          plugin.settings.set('enableAvgWpp', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName('Words/Sentence')
      setting.addDescription('Average words per sentence')
      setting.addCheckbox(checkbox => {
        checkbox.checked = plugin.settings.get('enableAvgWps')
        checkbox.onchange = () => {
          plugin.settings.set('enableAvgWps', checkbox.checked)
        }
      })
    })

    super.show()
  }
}
