import allCountriesListener from "./event-listeners/countries-data.js";
import searchCountriesListener from "./event-listeners/search-country.js";


(() => {
    document.getElementById('load-all-btn')?.addEventListener('click', allCountriesListener)
    document.getElementById('search-btn')?.addEventListener('click', searchCountriesListener)
})();


