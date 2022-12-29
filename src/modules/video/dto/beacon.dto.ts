import { IsNumber } from 'class-validator';

class BeaconDto {
  @IsNumber()
  time!: number;

  @IsNumber()
  total!: number;
}

export default BeaconDto;