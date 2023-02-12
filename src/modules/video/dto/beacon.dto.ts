import { IsNumber } from 'class-validator';

class BeaconDto {
  @IsNumber()
  time!: number;

  @IsNumber()
  total!: number;

  language!: string;

  agent!: string;
}

export default BeaconDto;
