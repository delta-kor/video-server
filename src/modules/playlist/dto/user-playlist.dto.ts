import { IsString, MaxLength } from 'class-validator';

class CreateUserPlaylistDto {
  @IsString({ message: 'error.playlist.enter_title' })
  @MaxLength(50, { message: 'error.playlist.title_too_long' })
  public title!: string;
}

class AddVideoToUserPlaylistDto {
  @IsString({ message: 'error.playlist.enter_video_id' })
  public video_id!: string;
}

export { CreateUserPlaylistDto, AddVideoToUserPlaylistDto };
