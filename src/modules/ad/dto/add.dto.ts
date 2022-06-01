import { IsString } from 'class-validator';

class AddDto {
  @IsString({ message: '제목을 입력해주세요' })
  public title!: string;

  @IsString({ message: '설명을 입력해주세요' })
  public description!: string;

  @IsString({ message: '링크를 입력해주세요' })
  public link!: string;
}

export default AddDto;
