import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { ListComponent } from '../../components/list/list.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-capital-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCapitalPageComponent {
  activadedRoute = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activadedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal<string>(() => this.queryParam ?? '');

  countryService = inject(CountryService);
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);
  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);
      this.router.navigate(['/country/by-capital'], {
        queryParams: { query: request.query },
      });
      return this.countryService.searchByCapital(request.query);
    },
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({ request }) => {
  //     if (!request.query) return [];
  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   },
  // });

  // OnSearch(query: string) {
  //   if (this.isLoading()) return;
  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //       console.log(countries);
  //     },
  //     error: (error) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(error);
  //       console.error(error);
  //     },
  //   });
  // }
}
