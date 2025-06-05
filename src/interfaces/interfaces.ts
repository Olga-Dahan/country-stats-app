export interface Country {
  officialName: string;
  population: number;
  region: string;
  currency: string[];
}

export interface CountriesResponse {
  name: {
    common: string;
    official: string;
  }
  population: number,
  region: string;
  currencies?: {
    [currencyCode: string]: {
    };
  };
}

export interface Region {
  region: string;
  numberOfCountries: number;
}

export interface Currency {
  currency: string;
  numberOfCountries: number;
}

