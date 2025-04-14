import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  placeholder = input.required<string>();
  newValues = output<string>();
  onSearch(value: string) {
    console.log('Search value:', value);
    this.newValues.emit(value);
  }
}
