import Service from '../../services/base.service';
import User from '../user/user.interface';
import Video from '../video/video.interface';
import VideoBeacon from './log.interface';
import Beacon from '../../modules/beacon/beacon.interface';
import BeaconModel from '../../modules/beacon/beacon.model';

class LogService extends Service {
  private readonly videoBeaconMap: Map<string, VideoBeacon> = new Map();
  private readonly beaconList: Set<Beacon> = new Set();

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
    pip: boolean,
    pwa: boolean,
    ip: string
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
      pwa,
    });

    const beacon = new BeaconModel({
      ip,
      videoId: video.id,
      userId: user.id,
      playedTime,
    });

    if (process.env.NODE_ENV === 'production') this.beaconList.add(beacon);

    if (this.beaconList.size > 100) {
      const beaconListCopy = [...this.beaconList];
      BeaconModel.insertMany(beaconListCopy)
        .then(() => {
          for (const beacon of beaconListCopy) this.beaconList.delete(beacon);
        })
        .catch(() => {});
    }
  }

  public getVideoBeacon(): VideoBeacon[] {
    return Array.from(this.videoBeaconMap.values()).filter(
      beacon => beacon.time.getTime() + 10 * 1000 > new Date().getTime()
    );
  }
}

export default LogService;
