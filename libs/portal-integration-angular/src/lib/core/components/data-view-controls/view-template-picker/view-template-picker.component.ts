import { ColumnViewTemplate } from '../../../../model/column-view-template'
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DropdownChangeEvent } from 'primeng/dropdown'
@Component({
  standalone: false,
  templateUrl: './view-template-picker.component.html',
  selector: 'ocx-data-view-template-picker',
  styleUrls: ['./view-template-picker.component.scss'],
})
export class ViewTemplatePickerComponent implements OnInit {
  private translate = inject(TranslateService);

  @Input() templates: ColumnViewTemplate[] = []
  @Input() placeholder = ''
  @Output() templateChanged: EventEmitter<{ activeCols: string[]; inactiveCols: string[] }> = new EventEmitter()
  @Output() templateReset: EventEmitter<void> = new EventEmitter()
  public labels: { label: string; value: string }[] = []
  public value: null | string = null
  public placeholderText = ''

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}
  ngOnInit() {
    if (this.templates.length > 0) {
      this.templates.forEach((template) => {
        this.labels.push({ label: this.translate.instant(template.label), value: template.label })
      })
    }
    if (this.placeholder) {
      this.placeholderText = this.translate.instant(this.placeholder)
    } else {
      this.placeholderText = 'Template'
    }
  }

  handleTemplateChange(event: DropdownChangeEvent) {
    const pickedTemplate = this.templates.filter((template) => template.label === event.value).at(0)
    if (pickedTemplate) {
      const activeColumnIds = pickedTemplate.template
        .filter((c) => {
          return c.active === true
        })
        .map((a) => {
          return a.field
        })

      const inactiveColumnIds = pickedTemplate.template
        .filter((c) => {
          return c.active === false
        })
        .map((a) => {
          return a.field
        })

      this.templateChanged.emit({
        activeCols: activeColumnIds,
        inactiveCols: inactiveColumnIds,
      })
    } else {
      this.templateReset.emit()
    }
  }

  handleTemplateReset() {
    this.templateReset.emit()
  }

  reset() {
    this.value = null
  }
}
