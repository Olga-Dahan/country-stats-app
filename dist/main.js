import allCountriesListener from "./event-listeners/countries-data.js";
import searchCountriesListener from "./event-listeners/search-country.js";
(() => {
    var _a, _b;
    (_a = document.getElementById('load-all-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', allCountriesListener);
    (_b = document.getElementById('search-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', searchCountriesListener);
})();
