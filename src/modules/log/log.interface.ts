import User from '../user/user.interface';
import Video from '../video/video.interface';

interface VideoBeacon {
  user: User;
  time: Date;
  video: Video;
  playedTime: number;
  totalPlayedTime: number;
  language: string;
  agent: string;
}

export default VideoBeacon;
