import Service from '../../services/base.service';
import User from '../user/user.interface';
import Video from '../video/video.interface';
import VideoBeacon from './log.interface';

class LogService extends Service {
  private readonly videoBeaconMap: Map<string, VideoBeacon> = new Map();

  public videoBeacon(
    user: User,
    video: Video,
    playedTime: number,
    totalPlayedTime: number,
    language: string,
    agent: string,
    sessionTime: number,
    quality: number,
    fullscreen: boolean,
    pip: number
  ): void {
    const time = new Date();
    this.videoBeaconMap.set(user.id, {
      user,
      time,
      video,
      playedTime,
      totalPlayedTime,
      language,
      agent,
      sessionTime,
      quality,
      fullscreen,
      pip,
    });
  }

  public getVideoBeacon(): VideoBeacon[] {
    return Array.from(this.videoBeaconMap.values()).filter(
      beacon => beacon.time.getTime() + 10 * 1000 > new Date().getTime()
    );
  }
}

export default LogService;
