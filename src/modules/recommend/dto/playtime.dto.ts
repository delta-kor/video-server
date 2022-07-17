import { IsArray } from 'class-validator';
import Constants from '../../../constants';
import { PlaytimeData } from '../store/emotion.store';

class PlaytimeDto {
  @IsArray({ message: Constants.WRONG_REQUEST })
  public data!: PlaytimeData;
}

export default PlaytimeDto;