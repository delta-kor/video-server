import Fuse from 'fuse.js';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import SearchConvertStore from './store/convert.store';

class SearchService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly index: Fuse<Video> = new Fuse([], {
    includeScore: true,
    keys: [{ name: 'title' }, { name: 'description' }, { name: 'category' }, { name: 'tags' }],
    threshold: 0.8,
  });

  private static convert(query: string): string {
    let currentQuery: string = query;
    for (let i = 0; i < 100; i++) {
      let convertedQuery = currentQuery;
      for (const item of SearchConvertStore) {
        const [key, value] = item;
        convertedQuery = convertedQuery.replace(
          new RegExp(key.toLowerCase().replace(/ /g, ''), 'g'),
          value.toLowerCase().replace(/ /g, '')
        );
      }

      if (convertedQuery === currentQuery) return convertedQuery;
      currentQuery = convertedQuery;
    }

    return currentQuery;
  }

  public async load(): Promise<void> {
    const videos = this.videoService.getAllFiltered('category');
    for (const video of videos) this.index.add(video);
  }

  public search(query: string): Video[] {
    const convertedQuery = SearchService.convert(query.toLowerCase().replace(/ /g, ''));
    const data = this.index.search(convertedQuery, { limit: 20 });
    return data.map(item => item.item);
  }
}

export default SearchService;
