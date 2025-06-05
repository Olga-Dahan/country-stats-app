import { Country, Currency, Region } from "../interfaces/interfaces.js";

export function reduceTotalPopulation(countries: Country[]): number {
  return countries.reduce((accumulator, current) => accumulator + current.population, 0);
}


export function reduceCountries(countries: Country[]): string {
  return countries
    .map(country => `
            <tr>
                <td>${country.officialName}</td>
                <td>${country.population}</td>
            </tr>
        `)
    .reduce((acc, curr) => acc + curr, '')
}

export function reduceRegions(regions: Region[]): string {
  return regions
    .map(region => `
            <tr>
                <td>${region.region}</td>
                <td>${region.numberOfCountries}</td>
            </tr>
        `)
    .reduce((acc, curr) => acc + curr, '')
}

export function reduceCurrencies(currencies: Currency[]): string {
  return currencies
    .map(currency => `
            <tr>
                <td>${currency.currency}</td>
                <td>${currency.numberOfCountries}</td>
            </tr>
        `)
    .reduce((acc, curr) => acc + curr, '')
}




