var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { reduceCountries, reduceRegions, reduceTotalPopulation, reduceCurrencies } from "../reducers/reducers.js";
import { insertHtml } from "../ui/countries.js";
export default function processData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const countriesJson = yield getData(url);
        if (countriesJson.length === 0)
            return;
        const countries = prepareData(countriesJson);
        computeStatistics(countries);
        computeTablePopulation(countries);
        computeTableRegion(countries);
        computeTableCurrency(countries);
        document.getElementById("search-input").value = "";
    });
}
export function getData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const countriesJson = yield response.json();
            document.getElementById("error").textContent = "";
            return countriesJson;
        }
        catch (err) {
            document.getElementById("error").textContent = err.message || "An error occurred while fetching data.";
            document.getElementById("table-population").innerHTML = "";
            document.getElementById("table-region").innerHTML = "";
            document.getElementById("table-currency").innerHTML = "";
            document.getElementById("stats-total").innerHTML = "";
            console.error("Fetch error:", err);
            return [];
        }
    });
}
export function prepareData(countriesJson) {
    return countriesJson.map(country => {
        var _a;
        return ({
            officialName: country.name.official,
            population: country.population,
            region: country.region,
            currency: Object.keys((_a = country.currencies) !== null && _a !== void 0 ? _a : {})
        });
    });
}
export function computeStatistics(countries) {
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
export function computeTablePopulation(countries) {
    renderTable("table-population", ["Country Name", "Number of citizens"], "table-body-population");
    const html = reduceCountries(countries);
    insertHtml(html, 'table-body-population');
}
export function computeTableRegion(countries) {
    renderTable("table-region", ["Region", "Number of countries"], "table-body-region");
    const regions = [...new Set(countries.map(country => country.region))];
    const mappedRegions = regions.map(region => {
        const countriesOfRegion = countries.filter(country => country.region === region);
        return {
            region: region,
            numberOfCountries: countriesOfRegion.length
        };
    });
    const html = reduceRegions(mappedRegions);
    insertHtml(html, 'table-body-region');
}
export function computeTableCurrency(countries) {
    renderTable("table-currency", ["Currency", "Number of countries"], "table-body-currency");
    const codes = new Set();
    countries.forEach(c => {
        if (c.currency) {
            c.currency.forEach(code => codes.add(code));
        }
    });
    const currencies = Array.from(codes);
    const mappedCurrencies = currencies.map(currency => {
        const countriesOfCurrency = countries.filter(country => { var _a; return ((_a = country.currency) === null || _a === void 0 ? void 0 : _a.indexOf(currency)) !== -1; });
        return {
            currency: currency,
            numberOfCountries: countriesOfCurrency.length
        };
    });
    const html = reduceCurrencies(mappedCurrencies);
    insertHtml(html, 'table-body-currency');
}
export function renderTable(containerId, headers, bodyId) {
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
