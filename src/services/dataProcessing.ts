import { CountriesResponse, Country, Region } from "../interfaces/interfaces.js";
import { reduceCountries, reduceRegions, reduceTotalPopulation, reduceCurrencies } from "../reducers/reducers.js";
import { insertHtml } from "../ui/countries.js";


export default async function processData(url: string) {
  const countriesJson: CountriesResponse[] = await getData(url);
  if (countriesJson.length === 0) return;

  const countries: Country[] = prepareData(countriesJson);
  computeStatistics(countries);
  computeTablePopulation(countries);
  computeTableRegion(countries);
  computeTableCurrency(countries);
  (document.getElementById("search-input") as HTMLInputElement).value = "";
}

export async function getData(url: string): Promise<CountriesResponse[]> {

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const countriesJson: CountriesResponse[] = await response.json();
    document.getElementById("error")!.textContent = "";
    return countriesJson;

  } catch (err: any) {

    document.getElementById("error")!.textContent = err.message || "An error occurred while fetching data.";
    document.getElementById("table-population")!.innerHTML = "";
    document.getElementById("table-region")!.innerHTML = "";
    document.getElementById("table-currency")!.innerHTML = "";
    document.getElementById("stats-total")!.innerHTML = "";

    console.error("Fetch error:", err);
    return [];
  }
}


export function prepareData(countriesJson: CountriesResponse[]): Country[] {
  return countriesJson.map(country => ({
    officialName: country.name.official,
    population: country.population,
    region: country.region,
    currency: Object.keys(country.currencies ?? {})   // => ["USD", "EUR"]
  }));
}

export function computeStatistics(countries: Country[]): void {
  const totalCountries = countries.length;
  const totalPopulation = reduceTotalPopulation(countries);
  const averagePopulation = Math.floor(totalPopulation / totalCountries);

  insertHtml(`
            <br>
            <span>Total countries result: ${totalCountries}</span>
            <br>
            <span>Total Countries Population: ${totalPopulation}</span>
            <br>
            <span>Average Population: ${averagePopulation}</span>
            <br>
        `, `stats-total`);
}

export function computeTablePopulation(countries: Country[]): void {
  renderTable("table-population", ["Country Name", "Number of citizens"], "table-body-population");
  const html = reduceCountries(countries);
  insertHtml(html, 'table-body-population')
}

export function computeTableRegion(countries: Country[]): void {

  renderTable("table-region", ["Region", "Number of countries"], "table-body-region");

  const regions = [...new Set(countries.map(country => country.region))]

  const mappedRegions: Region[] = regions.map(region => {
    const countriesOfRegion = countries.filter(country => country.region === region)
    return {
      region: region,
      numberOfCountries: countriesOfRegion.length
    }
  })
  const html = reduceRegions(mappedRegions);
  insertHtml(html, 'table-body-region')
}

export function computeTableCurrency(countries: Country[]): void {

  renderTable("table-currency", ["Currency", "Number of countries"], "table-body-currency");

  const codes = new Set<string>();

  countries.forEach(c => {
    if (c.currency) {
      c.currency.forEach(currency => codes.add(currency));
    }
  });

  const currencies = Array.from(codes);

  const mappedCurrencies = currencies.map(currency => {
    const countriesOfCurrency = countries.filter(country =>
      country.currency?.indexOf(currency) !== -1
    );

    return {
      currency: currency,
      numberOfCountries: countriesOfCurrency.length
    };
  });

  const html = reduceCurrencies(mappedCurrencies);
  insertHtml(html, 'table-body-currency')
}


export function renderTable(containerId: string, headers: string[], bodyId: string): void {

  const theadHtml = headers.map(h => `
    <th>${h}</th>
  `).reduce((acc, curr) => acc + curr, '');

  const html = `
    <br>
    <table>
      <thead>${theadHtml}</thead>
      <tbody id="${bodyId}"></tbody>
    </table>
  `;

  insertHtml(html, containerId);
}
