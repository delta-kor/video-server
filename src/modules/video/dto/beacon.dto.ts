import { IsNumber } from 'class-validator';

class BeaconDto {
  @IsNumber()
  time!: number;

  @IsNumber()
  total!: number;

  language!: string;

  agent!: string;

  session_time!: number;

  quality!: number;

  fullscreen!: boolean;

  pip!: number;

  pwa!: boolean;
}

export default BeaconDto;
