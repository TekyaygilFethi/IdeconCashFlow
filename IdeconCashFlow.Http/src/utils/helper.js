import moment from 'moment';
import * as _ from 'lodash';
import staticData from './staticData.json';
import accounting from 'accounting';
// import staticData from '../utils/staticData.json';



// localstorage belli bir formatta data yazar ve okur
export const localStorageData = {
  prefix: 'idecon',
  get: item => {
    const localData = JSON.parse(localStorage.getItem(`${localStorageData.prefix}-${item}`));

    if (localData) return localData;
    return false;
  },
  set: (name, data, expiration) => {
    const allData = {
      data,
      creation: moment(),
      expiration: moment.unix(expiration).toISOString() || moment().add(1, 'month'),
    };

    return new Promise((resolve, reject) => {
      if (!_.isEmpty(localStorageData.prefix) && !_.isEmpty(name)) {
        localStorage.setItem(`${localStorageData.prefix}-${name}`, JSON.stringify(allData));

        const parsed = JSON.parse(localStorage.getItem(`${localStorageData.prefix}-${name}`));

        resolve({
          status: 'success',
          name,
          data: { data: parsed.data, expiration: parsed.expiration, creation: parsed.creation },
        });
      } else {
        reject(new Error(`${name} has not created!`));
      }
    });
  },
  delete: item =>
    new Promise(resolve => {
      if (localStorage.getItem(`${localStorageData.prefix}-${item}`)) {
        localStorage.removeItem(`${localStorageData.prefix}-${item}`);
        resolve(`${item} has been deleted!`);
      } else {
        console.error(`${item} has not found!`);
      }
    }),
  clearExpired: () => {
    // clear expired data
    Object.keys(localStorage).reduce((total, item) => {
      let data;

      try {
        data = JSON.parse(localStorage[item]);

        if (moment(data.expiration).format() < moment().format()) {
          localStorage.removeItem(item);
        }
      } catch (err) {
        console.log('localstorage uzerinde gecersiz kayit tespit edildi');
      }
      return total;
    }, []);
    // clear expired data
  },
};

export const prettify = text =>
  text
    .replace(/[i|İ]/g, 'i')
    .replace(/[ı|I]/g, 'i')
    .replace(/[ş|Ş]/g, 's')
    .replace(/[ö|Ö]/g, 'o')
    .replace(/[ü|Ü]/g, 'u')
    .replace(/[ç|Ç]/g, 'c')
    .replace(/[ğ|Ğ]/g, 'g')
    .replace(/\s/gi, '-')
    .replace(/[-]+/gi, '-')
    .toLowerCase();

export const detectLang = () => {
  const language =
    (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
  const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
  const lang = localStorageData.get('language');
  if (lang) return lang.data;
  return languageWithoutRegionCode;
};


export const localeAmountPrice = number => accounting.formatNumber(number, 2, '.', ',');

export const currencyType = currency => {
  const currencyData = staticData.currencies[currency];

  if (currencyData) {
    return currencyData;
  }
  return '?';
};