import SocketException from '../../../exceptions/socket.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import VideoService from '../../video/video.service';
import { Media, MediaUpload } from '../interface/cinema.interface';
import { ServerPacket } from '../live.packet';
import LiveSocket from '../live.socket';
import MediaModel from '../model/media.model';
import SocketService from './socket.service';

interface CinemaState {
  playing: boolean;
  cue: Media[];
}

class CinemaService extends Service {
  private readonly socketService: SocketService = ServiceProvider.get(SocketService);
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  private readonly state: CinemaState = {
    playing: false,
    cue: [],
  };

  public async load(): Promise<void> {
    const medias: Media[] = await MediaModel.find().sort({ _id: 1 });
    this.state.cue.push(...medias);
  }

  public sendCueSyncPacket(socket?: LiveSocket, packetId: number | null = null): void {
    const packet: ServerPacket.Manage.CueSync = {
      type: 'cue-sync',
      packet_id: packetId,
      media: this.state.cue,
    };
    if (socket) socket.sendPacket(packet);
    else this.socketService.sendToAllStaffSockets(packet);
  }

  private async addMediaToQue(media: Media): Promise<void> {
    await media.save();
    this.state.cue.push(media);
    this.sendCueSyncPacket();
  }

  public async addMedia(upload: MediaUpload): Promise<Media> {
    const data = upload.data;
    const action = upload.action;
    switch (data.type) {
      case 'empty': {
        const media = new MediaModel({ data, action, duration: data.duration, isSequence: false });
        await this.addMediaToQue(media);
        return media;
      }
      case 'izflix_video': {
        const videoId = data.video_id;
        const video = this.videoService.get(videoId);
        if (!video) throw new SocketException('video_id에 해당하는 영상을 찾지 못했어요');

        const duration = video.duration;
        const media = new MediaModel({ data, action, duration, isSequence: false });
        await this.addMediaToQue(media);
        return media;
      }
      default:
        throw new SocketException('지원하지 않는 media 타입이에요');
    }
  }
}

export default CinemaService;
