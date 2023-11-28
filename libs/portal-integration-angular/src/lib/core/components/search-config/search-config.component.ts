import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { SearchConfig } from '../../../model/search-config'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'ocx-search-config',
  templateUrl: './search-config.component.html',
  styleUrls: ['./search-config.component.scss'],
})
export class SearchConfigComponent implements OnInit {
  @Input()
  searchConfigs: SearchConfig[] | undefined

  @Output()
  selectedSearchConfig: EventEmitter<SearchConfig | null> | undefined

  formGroup: FormGroup | undefined
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      searchConfigForm: new FormControl<SearchConfig | null>(null),
    })
  }

  onChange(event: SearchConfig) {
    this.selectedSearchConfig?.emit(event)
  }
}
