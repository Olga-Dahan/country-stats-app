import processData from "../services/dataProcessing.js";
export default function searchCountriesListener(e) {
    e.preventDefault();
    const countryName = document.getElementById('search-input').value;
    processData(`https://restcountries.com/v3.1/name/${countryName}`);
}
