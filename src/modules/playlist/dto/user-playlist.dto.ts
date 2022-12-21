import { IsString, MaxLength } from 'class-validator';

class CreateUserPlaylistDto {
  @IsString({ message: 'error.playlist.enter_title' })
  @MaxLength(50, { message: 'error.playlist.title_too_long' })
  public title!: string;
}

type UpdateUserPlaylistRequest =
  | AddVideoToUserPlaylistRequest
  | RemoveVideoFromUserPlaylistRequest
  | RenameUserPlaylistRequest
  | ReorderUserPlaylistRequest;

interface AddVideoToUserPlaylistRequest {
  action: 'add';
  video_id: string;
}

interface RemoveVideoFromUserPlaylistRequest {
  action: 'remove';
  video_id: string;
}

interface RenameUserPlaylistRequest {
  action: 'rename';
  title: string;
}

interface ReorderUserPlaylistRequest {
  action: 'reorder';
  video_id: string;
  order: number;
}

export { CreateUserPlaylistDto, UpdateUserPlaylistRequest };
