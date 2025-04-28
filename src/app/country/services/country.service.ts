import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, count, map, of, tap, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';
const API_URL = 'https://restcountries.com/v3.1';
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();

  searchByCapital(query: string) {
    query = query.toLowerCase();
    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((res) => CountryMapper.RestCountriesToCountries(res)),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('buscando paises con ese query'));
      })
    );
  }
  searchByCountry(query: string) {
    query = query.toLowerCase();
    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }
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
      tap((country) => {
        this.queryCacheCountry.set(code, country);
      }),
      map((res) => res.at(0)),

      catchError((error) => {
        console.log(error);
        return throwError(
          () => new Error(`buscando paises con ese codigo ${code}`)
        );
      })
    );
  }
  searchByRegion(region: Region) {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }
    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe(
      map((res) => CountryMapper.RestCountriesToCountries(res)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('buscando paises con ese region'));
      })
    );
  }
}
