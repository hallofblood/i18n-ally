import { ExtensionContext, TreeItemCollapsibleState, Uri } from 'vscode'
import { BaseTreeItem } from '.'
import i18n from '~/i18n'
import { KeyUsage } from '~/core'

export class UsageReportRootItem extends BaseTreeItem {
  public readonly count: number

  constructor(
    ctx: ExtensionContext,
    public readonly key: 'active' | 'idle' | 'missing',
    public readonly keys: KeyUsage[],
  ) {
    super(ctx)

    const iconResult = this.getIcon({
      active: 'checkmark',
      idle: 'warning',
      missing: 'icon-unknown',
    }[this.key])

    // Handle the icon path conversion
    if (typeof iconResult === 'string') {
      this.iconPath = iconResult
    }
    else if (iconResult && typeof iconResult === 'object' && 'light' in iconResult) {
      // Convert string paths to Uri objects
      const iconObj = iconResult as { light: string; dark: string }
      this.iconPath = {
        light: Uri.file(iconObj.light),
        dark: Uri.file(iconObj.dark),
      }
    }

    this.count = keys.length
    this.collapsibleState = TreeItemCollapsibleState.Collapsed
    this.id = `usage-root-${this.key}`
  }

  getLabel() {
    return {
      active: i18n.t('view.usage_keys_in_use', this.count),
      idle: i18n.t('view.usage_keys_not_in_use', this.count),
      missing: i18n.t('view.usage_keys_missing', this.count),
    }[this.key]
  }

  // @ts-expect-error
  get contextValue() {
    return `usage_${this.key}`
  }

  set contextValue(_) {}
}
