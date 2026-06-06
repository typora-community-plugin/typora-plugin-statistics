import { SettingTab } from "@typora-community-plugin/core"
import type StatisticsPlugin from "./main"


export class StatisticsSettingTab extends SettingTab {

  get name() {
    return this.plugin.i18n.t.settingTitle
  }

  constructor(private plugin: StatisticsPlugin) {
    super()
  }

  show() {
    const { i18n, settings } = this.plugin
    const { t } = i18n

    this.containerEl.innerHTML = ''

    this.addSettingTitle(t.settingTitle)

    this.addSetting(setting => {
      setting.addName(t.headingsName)
      setting.addDescription(t.headingsDesc)
      setting.addCheckbox(checkbox => {
        checkbox.checked = settings.get('enableHeadings')
        checkbox.onchange = () => {
          settings.set('enableHeadings', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.paragraphsName)
      setting.addDescription(t.paragraphsDesc)
      setting.addCheckbox(checkbox => {
        checkbox.checked = settings.get('enableParagraphs')
        checkbox.onchange = () => {
          settings.set('enableParagraphs', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.sentencesName)
      setting.addDescription(t.sentencesDesc)
      setting.addCheckbox(checkbox => {
        checkbox.checked = settings.get('enableSentences')
        checkbox.onchange = () => {
          settings.set('enableSentences', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.avgWppName)
      setting.addDescription(t.avgWppDesc)
      setting.addCheckbox(checkbox => {
        checkbox.checked = settings.get('enableAvgWpp')
        checkbox.onchange = () => {
          settings.set('enableAvgWpp', checkbox.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.avgWpsName)
      setting.addDescription(t.avgWpsDesc)
      setting.addCheckbox(checkbox => {
        checkbox.checked = settings.get('enableAvgWps')
        checkbox.onchange = () => {
          settings.set('enableAvgWps', checkbox.checked)
        }
      })
    })

    super.show()
  }
}
