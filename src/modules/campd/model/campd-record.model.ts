import { model, Schema } from 'mongoose';
import CampdRecord from '../interface/campd-record.interface';
import UnauthorizedException from '../../../exceptions/unauthorized.exception';

const CampdRecordSchema = new Schema<CampdRecord>({
  token: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  input: { type: Object, required: false },
  result: { type: Object, required: true },
});

CampdRecordSchema.pre('save', async function (this: CampdRecord, next) {
  const record = await CampdRecordModel.findOne({ token: this.token });
  if (record) next(new UnauthorizedException());
  else next();
});

const CampdRecordModel = model('campd-record', CampdRecordSchema);

export default CampdRecordModel;
