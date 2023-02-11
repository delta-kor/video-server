import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import VideoBeacon from './log.interface';
import LogResponse from './log.response';
import LogService from './log.service';

class LogController extends Controller {
  public readonly path: string = '/log';
  private readonly logService: LogService = ServiceProvider.get(LogService);

  protected mount(): void {
    this.mounter.get('/beacon', this.getVideoBeacon.bind(this));
  }

  private async getVideoBeacon(req: TypedRequest, res: TypedResponse<LogResponse.GetVideoBeacon>): Promise<void> {
    const beacons = this.logService.getVideoBeacon();
    const serializedBeacons: VideoBeacon[] = beacons.map(beacon => ({
      user: beacon.user.serialize('id', 'nickname'),
      time: beacon.time,
      video: beacon.video.serialize(req, 'id', 'title', 'description', 'duration'),
      playedTime: beacon.playedTime,
      totalPlayedTime: beacon.totalPlayedTime,
    }));
    res.json({ ok: true, beacons: serializedBeacons });
  }
}

export default LogController;
