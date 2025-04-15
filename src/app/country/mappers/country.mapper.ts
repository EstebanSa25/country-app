import type { Country } from '../interfaces/country.interface';
import type { RESTCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  static restCountryToCountry(rest: RESTCountry): Country {
    return {
      cca2: rest.cca2,
      flag: rest.flag,
      flagSvg: rest.flags.svg,
      name: rest.translations['spa'].common ?? 'no spanish name',
      capital: rest.capital.join(','),
      population: rest.population,
      region: rest.region,
      subregion: rest.subregion,
    };
  }
  static RestCountriesToCountries(res: RESTCountry[]): Country[] {
    return res.map((rest) => this.restCountryToCountry(rest));
  }
}
