import { Application } from 'express';
import i18next from 'i18next';
import middleware, { LanguageDetector } from 'i18next-http-middleware';
import commonEnglish from '../locales/en/common.json';
import commonKorean from '../locales/ko/common.json';

class I18nPipe {
  public static use(application: Application): void {
    i18next.use(LanguageDetector).init({
      resources: {
        en: {
          common: commonEnglish,
        },
        ko: {
          common: commonKorean,
        },
      },
      load: 'languageOnly',
      lng: 'en',
      fallbackLng: 'en',
      defaultNS: 'common',
      keySeparator: '.',
    });
    application.use(middleware.handle(i18next));
  }
}

export default I18nPipe;
