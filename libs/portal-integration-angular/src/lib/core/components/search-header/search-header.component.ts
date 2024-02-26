import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { Action } from '../page-header/page-header.component'
import { SearchConfig } from '../../../model/search-config'

/**
 * To trigger the search when Enter key is pressed inside a search parameter field,
 * an EventListener for keyup enter event is added for HTML elements which have an input.
 * Please add the EventListener yourself manually, if you want to have that functionality for some other elements
 * which do not have an input element.
 */
@Component({
  selector: 'ocx-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent implements AfterViewInit {
  @Input() searchConfigs: SearchConfig[] | undefined
  @Input() headline = ''
  @Input() subheader: string | undefined
  @Input() viewMode: 'basic' | 'advanced' = 'basic'
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
  @Output() selectedSearchConfigChanged: EventEmitter<SearchConfig> = new EventEmitter()
  @Output() viewModeChanged: EventEmitter<string> = new EventEmitter()
  @ContentChild('additionalToolbarContent')
  additionalToolbarContent: TemplateRef<any> | undefined

  get _additionalToolbarContent(): TemplateRef<any> | undefined {
    return this.additionalToolbarContent
  }

  @ViewChild('searchParameterFields') searchParameterFields: ElementRef | undefined

  hasAdvanced = false
  headerActions: Action[] = []

  ngAfterViewInit(): void {
    this.addKeyUpEventListener()
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'basic' ? 'advanced' : 'basic'
    this.viewModeChanged?.emit(this.viewMode)
    this.updateHeaderActions()
    setTimeout(() => this.addKeyUpEventListener())
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
        id: 'basicAdvancedButton',
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

  addKeyUpEventListener() {
    const inputElements = this.searchParameterFields?.nativeElement.querySelectorAll('input')
    inputElements.forEach((inputElement: any) => {
      if (!inputElement.listenerAdded) {
        inputElement.addEventListener('keyup', (event: any) => this.onSearchKeyup(event))
        inputElement.listenerAdded = true
      }
    })
  }

  onSearchKeyup(event: any) {
    if (event.code === 'Enter') {
      this.onSearchClicked()
    }
  }

  confirmSearchConfig(searchConfig: SearchConfig) {
    this.selectedSearchConfigChanged?.emit(searchConfig)
  }
}
