import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

class UploadDto {
  @IsString({ message: 'CDN ID를 입력해주세요' })
  public cdnId!: string;

  @IsString({ message: '제목을 입력해주세요' })
  public title!: string;

  @IsString({ message: '영상설명을 입력해주세요' })
  public description!: string;

  @IsNumber({}, { message: '날짜를 입력해주세요' })
  public date!: number;

  @IsArray({ message: '카테고리를 입력해주세요' })
  public category!: string[];

  @IsBoolean({ message: '비공개 여부를 설정해주세요' })
  public private!: boolean;
}

export default UploadDto;
