import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

class CreatePlaylistDto {
  @IsString({ message: '라벨을 입력해주세요' })
  public label!: string;

  @IsString({ message: '타입을 선택해주세요' })
  public type!: string;

  @IsString({ message: '제목을 입력해주세요' })
  public title!: string;

  @IsString({ message: '설명을 입력해주세요' })
  public description!: string;

  @IsArray({ message: '영상을 선택해주세요' })
  public video!: string[];

  @IsBoolean({ message: 'Featured 여부를 선택해주세요' })
  public featured!: boolean;

  @IsNumber({}, { message: '순서를 입력해주세요' })
  public order!: number;
}

export default CreatePlaylistDto;
