import { ExtensionContext, Uri } from 'vscode'
import { FeedbackItemDefintion } from '../providers'
import { BaseTreeItem } from './Base'
import { Commands } from '~/commands'

export class FeedbackItem extends BaseTreeItem {
  constructor(ctx: ExtensionContext, define: FeedbackItemDefintion) {
    super(ctx)
    this.getLabel = () => define.text

    // Handle icon path properly
    if (define.icon.startsWith('$')) {
      this.iconPath = define.icon
    }
    else {
      const iconResult = this.getIcon(define.icon)
      if (typeof iconResult === 'string') {
        this.iconPath = iconResult
      }
      else if (iconResult && typeof iconResult === 'object' && 'light' in iconResult) {
        // Convert string paths to Uri objects
        this.iconPath = {
          light: Uri.file(iconResult.light),
          dark: Uri.file(iconResult.dark),
        }
      }
    }

    if (define.desc)
      this.tooltip = define.desc
    if (define.command) {
      this.command = define.command
    }
    else if (define.url) {
      this.command = {
        title: define.text,
        command: Commands.open_url,
        arguments: [define.url],
      }
    }
  }
}
