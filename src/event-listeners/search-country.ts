import processData from "../services/dataProcessing.js";

export default function searchCountriesListener(e: MouseEvent) {
  e.preventDefault();
  const countryName = (document.getElementById('search-input') as HTMLInputElement).value;
  processData(`https://restcountries.com/v3.1/name/${countryName}`)
}




