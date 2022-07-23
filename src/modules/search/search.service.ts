import { Document } from 'flexsearch';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';

class SearchService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly index: Document<Video> = new Document({
    document: {
      id: 'id',
      index: [
        { field: 'title' },
        {
          field: 'description',
        },
        { field: 'category' },
      ],
    },
    encode: item => item.replace(/ - /g, ' ').split(' '),
    tokenize: 'full',
  });

  public async load(): Promise<void> {
    const videos = this.videoService.getAllFiltered('category');
    for (const video of videos) this.index.add(video.id, video);
  }

  public search(query: string): Video[] {
    const data = this.index.search(query);

    const result: Set<Video> = new Set();
    data.forEach(item => item.result.forEach(id => result.add(this.videoService.get(id as any)!)));

    return [...result];
  }
}

export default SearchService;
