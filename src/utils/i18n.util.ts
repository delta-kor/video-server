import categoryEnglish from '../locales/en/category.json';
import descriptionEnglish from '../locales/en/description.json';
import musicEnglish from '../locales/en/music.json';

function getVideoTitle(title: string, language: string): string {
  if (language === 'ko') return title;

  let dataset: any;
  if (language === 'en') dataset = musicEnglish;
  else dataset = musicEnglish;

  return dataset[title] || title;
}

function getVideoDescription(description: string, language: string): string {
  if (language === 'ko') return description;

  if (description.match(/.+ \d+회/g)) {
    const group = description.match(/(.+) (\d+)회/);
    if (group) {
      const type = group[1];
      const episode = group[2];
      return `${getVideoDescription(type, language)} EP${episode}`;
    }
  }

  let dataset: any;
  if (language === 'en') dataset = descriptionEnglish;
  else dataset = descriptionEnglish;

  return dataset[description] || description;
}

function getVideoCategoryItem(category: string, language: string): string {
  if (language === 'ko') return category;

  if (category.match(/\d+회/g)) {
    return `EP${category.replace('회', '')}`;
  }

  let dataset: any;
  if (language === 'en') dataset = categoryEnglish;
  else dataset = categoryEnglish;

  return dataset[category] || category;
}

function getVideoCategory(category: string[], language: string): string[] {
  return category.map(item => getVideoCategoryItem(item, language));
}

export { getVideoTitle, getVideoDescription, getVideoCategoryItem, getVideoCategory };
