import { Component, EventEmitter, Input, Output } from '@angular/core'
interface SearchCriteriaTemplate {
  name: string
  value: string
}
@Component({
  standalone: false,
  selector: 'ocx-criteria-template',
  templateUrl: './criteria-template.component.html',
  styleUrls: ['./criteria-template.component.scss'],
})
export class CriteriaTemplateComponent {
  @Input() searchId!: string
  @Output() readonly templateSelected: EventEmitter<SearchCriteriaTemplate> = new EventEmitter<SearchCriteriaTemplate>()

  protected selectedTemplate: SearchCriteriaTemplate | undefined
  protected templates: SearchCriteriaTemplate[] = []
}
