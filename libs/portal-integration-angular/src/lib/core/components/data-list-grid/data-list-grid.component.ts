import {
  Component,
  ContentChild,
  DoCheck,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core'
import { DataSortDirection } from '../../../model/data-sort-direction'
import { MenuItem } from 'primeng/api'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE, MFE_INFO } from '../../../api/injection-tokens'
import { MfeInfo } from '../../../model/mfe-info.model'
import { DataAction } from '../../../model/data-action'
import { TranslateService } from '@ngx-translate/core'

export type ListGridData = {
  id: string | number
  imagePath: string | number
  [columnId: string]: unknown
}

export interface ListGridDataMenuItem extends MenuItem {
  permission: string
}

@Component({
  selector: 'ocx-data-list-grid',
  templateUrl: './data-list-grid.component.html',
  styleUrls: ['./data-list-grid.component.scss'],
})
export class DataListGridComponent implements OnInit, DoCheck {
  @Input() data: ListGridData[] = []
  @Input() sortDirection: DataSortDirection = DataSortDirection.NONE
  @Input() sortField = ''
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() clientSideSorting = true
  @Input() sortStates: DataSortDirection[] = []
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number = this.pageSizes[0] || 50
  @Input() emptyResultsMessage: string | undefined
  @Input() fallbackImage = 'placeholder.png'
  @Input() layout: 'grid' | 'list' = 'grid'
  @Input() viewPermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() deletePermission: string | undefined
  @Input() viewMenuItemKey: string | undefined
  @Input() editMenuItemKey: string | undefined
  @Input() deleteMenuItemKey: string | undefined

  @Input() gridItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLinesTemplate || this.gridItemSubtitleLinesChildTemplate
  }

  @Input() listItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLinesTemplate || this.listItemSubtitleLinesChildTemplate
  }

  @Input() listItemTemplate: TemplateRef<any> | undefined
  @ContentChild('listItem') listItemChildTemplate: TemplateRef<any> | undefined
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate || this.listItemChildTemplate
  }

  @Input() gridItemTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItemChildTemplate: TemplateRef<any> | undefined
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate || this.gridItemChildTemplate
  }

  _additionalActions: DataAction[] = []
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions = value
    this.updateGridMenuItems()
  }

  @Output() deleteItem = new EventEmitter<ListGridData>()
  @Output() viewItem = new EventEmitter<ListGridData>()
  @Output() editItem = new EventEmitter<ListGridData>()

  showMenu = false
  gridMenuItems: MenuItem[] = []
  selectedItem: ListGridData | undefined
  observedOutputs = 0

  get sortDirectionNumber() {
    if (this.sortDirection === DataSortDirection.ASCENDING) return 1
    if (this.sortDirection === DataSortDirection.DESCENDING) return -1
    return 0
  }

  constructor(
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Inject(MFE_INFO) private mfeInfo: MfeInfo,
    private translateService: TranslateService
  ) {}

  ngDoCheck(): void {
    const observedOutputs = <any>this.viewItem.observed + <any>this.deleteItem.observed + <any>this.editItem.observed
    if (this.observedOutputs !== observedOutputs) {
      this.updateGridMenuItems()
      this.observedOutputs = observedOutputs
    }
  }

  ngOnInit(): void {
    this.showMenu =
      (!!this.viewPermission && this.authService.hasPermission(this.viewPermission)) ||
      (!!this.editPermission && this.authService.hasPermission(this.editPermission)) ||
      (!!this.deletePermission && this.authService.hasPermission(this.deletePermission))
  }

  onDeleteRow(element: ListGridData) {
    this.deleteItem.emit(element)
  }

  onViewRow(element: ListGridData) {
    if (!!this.viewPermission && this.authService.hasPermission(this.viewPermission)) {
      this.viewItem.emit(element)
    }
  }

  onEditRow(element: ListGridData) {
    this.editItem.emit(element)
  }

  imgError(event: Event) {
    if (!!this.fallbackImage && (<any>event?.target)?.src != this.fallbackImage) {
      ;(<any>event.target).src = this.getFallbackImagePath(this.mfeInfo)
    }
  }

  getFallbackImagePath(mfeInfo: MfeInfo) {
    return mfeInfo?.remoteBaseUrl
      ? `${mfeInfo.remoteBaseUrl}/onecx-portal-lib/assets/images/${this.fallbackImage}`
      : `./onecx-portal-lib/assets/images/${this.fallbackImage}`
  }

  updateGridMenuItems(): void {
    this.translateService
      .get([
        this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW',
        this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT',
        this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE',
        ...this.additionalActions.map((a) => a.labelKey || ''),
      ])
      .subscribe((translations) => {
        let menuItems: MenuItem[] = []
        if (this.viewItem.observed && this.authService.hasPermission(this.viewPermission || '')) {
          menuItems.push({
            label: translations[this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW'],
            icon: 'pi pi-eye',
            command: () => this.viewItem.emit(this.selectedItem),
          })
        }
        if (this.editItem.observed && this.authService.hasPermission(this.editPermission || '')) {
          menuItems.push({
            label: translations[this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT'],
            icon: 'pi pi-pencil',
            command: () => this.editItem.emit(this.selectedItem),
          })
        }
        if (this.deleteItem.observed && this.authService.hasPermission(this.deletePermission || '')) {
          menuItems.push({
            label: translations[this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE'],
            icon: 'pi pi-trash',
            command: () => this.deleteItem.emit(this.selectedItem),
          })
        }
        menuItems = menuItems.concat(
          this.additionalActions
            .filter((a) => this.authService.hasPermission(a.permission))
            .map((a) => ({
              label: translations[a.labelKey || ''],
              icon: a.icon,
              styleClass: (a.classes || []).join(' '),
              disabled: a.disabled,
              command: () => a.callback(this.selectedItem),
            }))
        )
        this.gridMenuItems = menuItems
      })
  }

  setSelectedItem(item: ListGridData) {
    this.selectedItem = item
  }
}
