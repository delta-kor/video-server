import { model, Schema } from 'mongoose';
import CampdVideo from '../interface/campd-video.interface';
import generateId from '../../../utils/id.util';
import { Request } from 'express';
import I18nUtil from '../../../utils/i18n.util';

const CampdVideoSchema = new Schema<CampdVideo>({
  id: { type: String, required: true, unique: true, default: () => generateId(6) },
  title: { type: String, required: true },
  description: { type: String, required: true },
  cdn_id: { type: String, required: true },
  scoresheet: { type: Object, required: true },
});

CampdVideoSchema.methods.serialize = function (
  this: CampdVideo,
  req: Request,
  ...keys: (keyof CampdVideo)[]
): CampdVideo {
  const result: any = {};

  for (const key of keys) {
    let value: any = this[key];

    if (key === 'title') value = I18nUtil.getVideoTitle(value, req.i18n.resolvedLanguage);
    if (key === 'description') value = I18nUtil.getVideoDescription(value, req.i18n.resolvedLanguage);

    result[key] = value;
  }

  return result;
};

const CampdVideoModel = model('campd-video', CampdVideoSchema);

export default CampdVideoModel;
