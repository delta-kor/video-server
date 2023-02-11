import Service from '../../services/base.service';
import User from '../user/user.interface';
import Video from '../video/video.interface';
import VideoBeacon from './log.interface';

class LogService extends Service {
  private readonly videoBeaconMap: Map<string, VideoBeacon> = new Map();

  public videoBeacon(user: User, video: Video, playedTime: number, totalPlayedTime: number): void {
    const time = new Date();
    this.videoBeaconMap.set(user.id, { user, time, video, playedTime, totalPlayedTime });
  }

  public getVideoBeacon(): VideoBeacon[] {
    return Array.from(this.videoBeaconMap.values()).filter(
      beacon => beacon.time.getTime() + 5 * 60 * 1000 > new Date().getTime()
    );
  }
}

export default LogService;
