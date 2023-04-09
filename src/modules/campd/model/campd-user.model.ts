import { model, Schema } from 'mongoose';

const CampdUserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    scoreboard: { type: Object, required: true, default: () => {} },
  },
  { minimize: false }
);

const CampdUserModel = model('campd-user', CampdUserSchema);

export default CampdUserModel;
