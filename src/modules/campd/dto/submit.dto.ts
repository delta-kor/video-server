import { IsObject } from 'class-validator';
import { CampdGameInput } from '../interface/campd-game.interface';

class CampdSubmitDto {
  @IsObject({ message: 'Input error' })
  public input!: CampdGameInput;
}

export default CampdSubmitDto;
