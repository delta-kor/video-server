import { IsObject, IsString } from 'class-validator';
import { CampdGameInput } from '../interface/campd-game.interface';

class CampdSubmitDto {
  @IsObject({ message: 'Input error' })
  public input!: CampdGameInput;

  @IsString({ message: 'Token error' })
  public token!: string;
}

export default CampdSubmitDto;
