import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { catchError, map, throwError } from 'rxjs';
const API_URL = 'https://restcountries.com/v3.1';
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  searchByCapital(query: string) {
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((res) => CountryMapper.RestCountriesToCountries(res)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('buscando paises con ese query'));
      })
    );
  }
  searchByCountry(query: string) {
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((res) => CountryMapper.RestCountriesToCountries(res)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('buscando paises con ese query'));
      })
    );
  }
  searchByAlphaCode(code: string) {
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((res) => CountryMapper.RestCountriesToCountries(res)),
      map((res) => res.at(0)),
      catchError((error) => {
        console.log(error);
        return throwError(
          () => new Error(`buscando paises con ese codigo ${code}`)
        );
      })
    );
  }
}
