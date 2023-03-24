import categoryEnglish from '../locales/en/category.json';
import descriptionEnglish from '../locales/en/description.json';
import musicEnglish from '../locales/en/music.json';
import { SentryLog } from '../decorators/sentry.decorator';

class I18nUtil {
  @SentryLog('i18n util', 'get video title')
  public static getVideoTitle(title: string, language: string): string {
    if (language === 'ko') return title;

    let dataset: any;
    if (language === 'en') dataset = musicEnglish;
    else dataset = musicEnglish;

    return dataset[title] || title;
  }

  @SentryLog('i18n util', 'get video description')
  public static getVideoDescription(description: string, language: string): string {
    if (language === 'ko') return description;

    if (description.match(/.+ \d+회/g)) {
      const group = description.match(/(.+) (\d+)회/);
      if (group) {
        const type = group[1];
        const episode = group[2];
        return `${I18nUtil.getVideoDescription(type, language)} EP${episode}`;
      }
    }

    let dataset: any;
    if (language === 'en') dataset = descriptionEnglish;
    else dataset = descriptionEnglish;

    return dataset[description] || description;
  }

  @SentryLog('i18n util', 'get video category item')
  public static getVideoCategoryItem(category: string, language: string): string {
    if (language === 'ko') return category;

    if (category.match(/\d+회/g)) {
      return `EP${category.replace('회', '')}`;
    }

    let dataset: any;
    if (language === 'en') dataset = categoryEnglish;
    else dataset = categoryEnglish;

    return dataset[category] || category;
  }

  @SentryLog('i18n util', 'get video category')
  public static getVideoCategory(category: string[], language: string): string[] {
    return category.map(item => I18nUtil.getVideoCategoryItem(item, language));
  }

  @SentryLog('i18n util', 'get locale string')
  public static getLocaleString(data: Locales, language: string): string {
    const locale = data[language];
    return locale || data.en || data.ko;
  }
}

export default I18nUtil;
