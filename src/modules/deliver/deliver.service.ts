import axios from 'axios';
import NodeCache from 'node-cache';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import EnvService from '../env/env.service';
import { CdnApiResponse, StreamingInfo, VideoData } from './deliver.interface';

const ttl = 60 * 60;

class DeliverService extends Service {
  private usedToken: string | null = null;
  private readonly apiCache: NodeCache = new NodeCache();
  private readonly urlCache: NodeCache = new NodeCache();
  private readonly envService: EnvService = ServiceProvider.get(EnvService);

  public async getCdnInfo(cdnId: string, quality: number): Promise<StreamingInfo> {
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

    const qualityFilteredData = data.files.filter(video => video.quality !== 'hls' && video.height >= quality);
    const sortedData = qualityFilteredData.sort((a, b) => a.size - b.size);
    let selectedVideo: VideoData = sortedData[0];

    const qualities = [...new Set(data.files.filter(video => video.quality !== 'hls').map(video => video.height))].sort(
      (a, b) => b - a
    );

    if (!selectedVideo) {
      if (data.files.length === 0) throw new Error('Cdn file not selected');
      const qualityFilteredData = data.files.filter(video => video.quality !== 'hls');
      const sortedData = qualityFilteredData.sort((a, b) => b.size - a.size);
      selectedVideo = sortedData[0];
    }

    const selectedQuality = selectedVideo.height;
    const link = selectedVideo.link;

    let result: string;
    if (this.urlCache.has(link)) {
      result = this.urlCache.get(link)!;
    } else {
      const linkResponse = await axios({ url: link, method: 'GET', maxRedirects: 0, validateStatus: () => true });
      const location = linkResponse.headers.location;
      result = location.split('?filename')[0];
    }

    !this.apiCache.has(url) && this.apiCache.set(url, data, ttl);
    !this.urlCache.has(link) && this.urlCache.set(link, result, ttl);
    this.usedToken = freshToken;

    return { url: result, quality: selectedQuality, qualities };
  }

  private clearCache(): void {
    this.apiCache.flushAll();
    this.urlCache.flushAll();
  }
}

export default DeliverService;
