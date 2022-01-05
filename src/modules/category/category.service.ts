import Service from '../../services/base.service';
import VideoModel from '../video/video.model';

class CategoryService extends Service {
  constructor() {
    super();
    this.load();
  }

  public async load(): Promise<void> {
    const videos = await VideoModel.find();
  }
}

export default CategoryService;
