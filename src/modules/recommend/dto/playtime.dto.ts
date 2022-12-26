import { IsArray } from 'class-validator';
import { PlaytimeData } from '../store/emotion.store';

class PlaytimeDto {
  @IsArray({ message: 'error.wrong_request' })
  public data!: PlaytimeData;
}

export default PlaytimeDto;
