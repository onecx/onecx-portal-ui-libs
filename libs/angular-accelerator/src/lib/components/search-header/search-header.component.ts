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
import { SearchConfigInfo } from '../../model/search-config-info'
import { SLOT_SERVICE, SlotService } from '@onecx/angular-remote-components'

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
  providers: [{ provide: SLOT_SERVICE, useExisting: SlotService }],
})
export class SearchHeaderComponent implements AfterViewInit {
  @Input() searchConfigs: SearchConfigInfo[] | undefined
  @Input() header = ''

  /**
   * @deprecated Will be replaced by header
   */
  @Input()
  get headline(): string {
    return this.header
  }
  set headline(value: string) {
    this.header = value
  }
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
  @Output() selectedSearchConfigChanged: EventEmitter<any> = new EventEmitter()
  @Output() viewModeChanged: EventEmitter<'basic' | 'advanced'> = new EventEmitter()
  @ContentChild('additionalToolbarContent')
  additionalToolbarContent: TemplateRef<any> | undefined

  get _additionalToolbarContent(): TemplateRef<any> | undefined {
    return this.additionalToolbarContent
  }
  @ContentChild('additionalToolbarContentLeft')
  additionalToolbarContentLeft: TemplateRef<any> | undefined

  get _additionalToolbarContentLeft(): TemplateRef<any> | undefined {
    return this.additionalToolbarContentLeft
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
        id: 'simpleAdvancedButton',
        labelKey:
          this.viewMode === 'basic'
            ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.TEXT'
            : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.TEXT',
        actionCallback: () => this.toggleViewMode(),
        show: 'always',
        titleKey:
          this.viewMode === 'basic'
            ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.DETAIL'
            : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.DETAIL',
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
}
