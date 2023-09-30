import { model, Schema } from 'mongoose';

const CampdUserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    scoreboard: { type: Object, required: true, default: () => {} },
    exp: { type: Number, required: true, default: () => 0 },
  },
  { minimize: false }
);

const CampdUserModel = model('campd-user', CampdUserSchema);

export default CampdUserModel;
