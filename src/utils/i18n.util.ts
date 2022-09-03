import musicEnglish from '../locales/en/music.json';

function getMusicTitle(title: string, language: string): string {
  let dataset;
  if (language === 'en') dataset = musicEnglish;
  else if (language === 'ko') dataset = {};
  else dataset = musicEnglish;
  return dataset[title] || title;
}

export { getMusicTitle };
