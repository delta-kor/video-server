import { Schema } from 'mongoose';

const LocaleSchema = new Schema<Locales | any>(
  {
    en: { type: String, required: false },
    ko: { type: String, required: false },
  },
  { _id: false }
);

export default LocaleSchema;
