import Service from '../../services/base.service';
import UploadDto from './dto/upload.dto';
import Video from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  public async upload(data: UploadDto): Promise<Video> {
    const video: Video = new VideoModel({
      cdnId: data.cdnId,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      category: data.category,
    });
    await video.save();

    return video;
  }
}

export default VideoService;
