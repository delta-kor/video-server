import Controller from '../../classes/controller.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import ServiceProvider from '../../services/provider.service';
import SearchResponse from './search.response';
import SearchService from './search.service';

class SearchController extends Controller {
  public readonly path: string = '/search';
  private readonly searchService: SearchService = ServiceProvider.get(SearchService);

  protected mount(): void {
    this.mounter.get('/', this.search.bind(this));
  }

  private async search(req: TypedRequest, res: TypedResponse<SearchResponse.Search>): Promise<void> {
    const query = req.query.query as string;
    if (!query) throw new UnprocessableEntityException('검색어를 입력해주세요');

    const videos = this.searchService.search(query);
    const serializedVideos = videos.map(video =>
      video.serialize(req, 'id', 'title', 'description', 'duration', 'is_4k')
    );

    res.json({ ok: true, videos: serializedVideos });
  }
}

export default SearchController;
