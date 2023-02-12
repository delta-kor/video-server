import { IsNumber, IsString } from 'class-validator';

class BeaconDto {
  @IsNumber()
  time!: number;

  @IsNumber()
  total!: number;

  @IsString()
  language!: string;

  @IsString()
  agent!: string;
}

export default BeaconDto;
