import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Action } from '../page-header/page-header.component'

@Component({
  selector: 'ocx-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent {
  @Input() headline = ''
  @Input() manualBreadcrumbs = false
  _actions: Action[] = []
  @Input()
  get actions() {
    return this._actions
  }
  set actions(value) {
    this._actions = value
    this.updateHeaderActions()
  }

  @Output() searched: EventEmitter<any> = new EventEmitter()
  @Output() resetted: EventEmitter<any> = new EventEmitter()

  viewMode: 'basic' | 'advanced' = 'basic'
  hasAdvanced = false
  headerActions: Action[] = []

  toggleViewMode() {
    this.viewMode = this.viewMode === 'basic' ? 'advanced' : 'basic'
    this.updateHeaderActions()
  }

  onResetClicked() {
    this.resetted.emit()
  }

  onSearchClicked() {
    this.searched.emit()
  }

  updateHeaderActions() {
    const headerActions: Action[] = []
    if (this.hasAdvanced) {
      headerActions.push({
        labelKey:
          this.viewMode === 'basic'
            ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED'
            : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.BASIC',
        actionCallback: () => this.toggleViewMode(),
        show: 'always',
      })
    }
    this.headerActions = headerActions.concat(this.actions)
  }
}
