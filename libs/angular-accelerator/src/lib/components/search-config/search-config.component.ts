import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { SearchConfig } from '../../model/search-config'

@Component({
  selector: 'ocx-search-config',
  templateUrl: './search-config.component.html',
  styleUrls: ['./search-config.component.scss'],
})
export class SearchConfigComponent implements OnInit {
  @Input()
  searchConfigs: SearchConfig[] | [] | undefined

  @Input() placeholderKey = 'OCX_SEARCH_HEADER.OCX_SEARCH_CONFIG.DROPDOWN_DEFAULT'

  @Output()
  selectedSearchConfigChanged: EventEmitter<SearchConfig> = new EventEmitter()

  formGroup: FormGroup | undefined
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      searchConfigForm: new FormControl<SearchConfig | null>(null),
    })
  }

  onSearchConfigChange(searchConfig: SearchConfig) {
    this.selectedSearchConfigChanged?.emit(searchConfig)
  }
}
