import processData from "../services/dataProcessing.js";
export default function allCountriesListener(e) {
    e.preventDefault();
    processData('https://restcountries.com/v3.1/all');
}
