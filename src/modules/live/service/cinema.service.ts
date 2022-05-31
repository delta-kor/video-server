import SocketException from '../../../exceptions/socket.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import VideoService from '../../video/video.service';
import { Media, MediaInfo } from '../interface/cinema.interface';
import MediaModel from '../model/media.model';

interface CinemaState {
  playing: boolean;
  cue: Media[];
}

class CinemaService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  private readonly state: CinemaState = {
    playing: false,
    cue: [],
  };

  private async addMediaToQue(media: Media): Promise<void> {
    await media.save();
    this.state.cue.push(media);
  }

  public async addMedia(info: MediaInfo): Promise<Media> {
    const data = info.data;
    const action = info.action;
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
