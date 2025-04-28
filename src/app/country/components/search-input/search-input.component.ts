import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  linkedSignal,
  output,
  signal,
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
  initialValue = input<string>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  onSearch(value: string) {
    console.log('Search value:', value);
    this.newValues.emit(value);
  }
  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.newValues.emit(value);
    }, 500);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
