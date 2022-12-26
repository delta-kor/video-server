import { IsString, MaxLength, MinLength } from 'class-validator';

class UserDto {
  @IsString({ message: 'error.user.enter_nickname' })
  @MinLength(1, { message: 'error.user.enter_nickname' })
  @MaxLength(12, { message: 'error.user.nickname_too_long' })
  public nickname!: string;
}

export default UserDto;
