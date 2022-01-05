import axios from 'axios';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import EnvService from '../env/env.service';
import { CdnApiResponse } from './cdn.interface';

class CdnService extends Service {
  private usedToken: string | null = null;
  private readonly apiCache: Map<string, CdnApiResponse> = new Map();
  private readonly urlCache: Map<string, string> = new Map();
  private readonly envService: EnvService = ServiceProvider.get(EnvService);

  public async getCdnUrl(cdnId: string, quality: number): Promise<string> {
    const freshToken = await this.envService.get<string>('token');
    if (this.usedToken !== freshToken) this.clearCache();

    const url = `${process.env.CDN_URL}/videos/${cdnId}?fields=files.size,files.link,files.type,files.quality,files.height`;

    let data: CdnApiResponse;
    if (this.apiCache.has(url)) {
      data = this.apiCache.get(url)!;
    } else {
      const response = await axios({
        url,
        method: 'GET',
        headers: { Authorization: `jwt ${freshToken}` },
      });
      data = response.data;
      if (!data.files) throw new Error('Cdn file error');
    }

    const qualityFilteredData = data.files.filter(video => video.quality !== 'hls' && video.height <= quality);
    const sortedData = qualityFilteredData.sort((a, b) => b.size - a.size);
    const selectedVideo = sortedData[0];

    if (!selectedVideo) throw new Error('Cdn file not selected');

    const link = selectedVideo.link;

    let result: string;
    if (this.urlCache.has(link)) {
      result = this.urlCache.get(link)!;
    } else {
      const linkResponse = await axios({ url: link, method: 'GET', maxRedirects: 0, validateStatus: () => true });
      const location = linkResponse.headers.location;
      result = location.split('?filename')[0];
    }

    this.apiCache.set(url, data);
    this.urlCache.set(link, result);
    this.usedToken = freshToken;

    return result;
  }

  private clearCache(): void {
    this.apiCache.clear();
    this.urlCache.clear();
  }
}

export default CdnService;
