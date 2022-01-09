import { IsArray, IsString } from 'class-validator';

class UploadPlaylistDto {
  @IsString({ message: '제목을 입력해주세요' })
  public title!: string;

  @IsArray({ message: '영상을 선택해주세요' })
  public video!: string[];
}

export default UploadPlaylistDto;
