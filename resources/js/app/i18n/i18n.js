import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from './translations/en';
import es from './translations/es';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: en
    },
    es: {
        translation: es
    }
};

i18n
.use(initReactI18next) // passes i18n down to react-i18next
.init({
    debug:false,
    resources,
    lng: "es",

    keySeparator: '.', // we do not use keys in form messages.welcome
    pluralSeparator: '_',

    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default i18n;