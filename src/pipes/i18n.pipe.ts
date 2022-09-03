import { Application } from 'express';
import i18next from 'i18next';
import middleware, { LanguageDetector } from 'i18next-http-middleware';
import translationEnglish from '../locales/en.json';
import translationKorean from '../locales/ko.json';

class I18nPipe {
  public static use(application: Application): void {
    i18next.use(LanguageDetector).init({
      resources: {
        en: {
          translation: translationEnglish,
        },
        ko: {
          translation: translationKorean,
        },
      },
      lng: 'en',
      fallbackLng: 'en',
      keySeparator: '.',
    });
    application.use(middleware.handle(i18next));
  }
}

export default I18nPipe;
