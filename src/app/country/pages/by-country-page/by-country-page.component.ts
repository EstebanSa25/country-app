import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ListComponent } from '../../components/list/list.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  activadedRoute = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activadedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal<string>(() => this.queryParam ?? '');
  countries = signal<Country[]>([]);
  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);
      this.router.navigate(['/country/by-country'], {
        queryParams: { query: request.query },
      });
      return this.countryService.searchByCountry(request.query);
    },
  });
}
