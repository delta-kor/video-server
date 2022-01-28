import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

class UploadPlaylistDto {
  @IsString({ message: '제목을 입력해주세요' })
  public title!: string;

  @IsArray({ message: '영상을 선택해주세요' })
  public video!: string[];

  @IsBoolean({ message: 'Featured 여부를 선택해주세요' })
  public featured!: boolean;

  @IsNumber({}, { message: '순서를 입력해주세요' })
  public order!: number;
}

export default UploadPlaylistDto;
