import { IsNumber, IsString } from 'class-validator';

class UploadDto {
  @IsString({ message: 'Please enter cdn id' })
  public cdnId!: string;

  @IsString({ message: 'Please enter title' })
  public title!: string;

  @IsNumber({}, { message: 'Please enter date' })
  public date!: number;

  @IsString({ message: 'Please enter category' })
  public category!: string;

  @IsString({ message: 'Please enter details' })
  public details!: string;
}

export default UploadDto;
