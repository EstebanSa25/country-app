import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { Region } from '../../interfaces/region.type';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ListComponent } from '../../components/list/list.component';
import { ActivatedRoute, Router } from '@angular/router';

const validateQueryParam = (queryParam: string): Region => {
  queryParam = queryParam.toLocaleLowerCase();
  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };
  return validRegions[queryParam] ?? 'Americas';
};
@Component({
  selector: 'app-by-region-page',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);
  activadedRoute = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activadedRoute.snapshot.queryParamMap.get('region');
  countryResource = rxResource({
    request: () => ({ query: this.selectedRegion() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);
      this.router.navigate(['/country/by-region'], {
        queryParams: { region: request.query },
      });
      return this.countryService.searchByRegion(request.query);
    },
  });
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];
  selectedRegion = linkedSignal<Region | null>(() =>
    validateQueryParam(this.queryParam || '')
  );
}
