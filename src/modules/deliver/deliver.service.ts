import axios from 'axios';
import NodeCache from 'node-cache';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import EnvService from '../env/env.service';
import { LegacyCdnApiResponse, LegacyVideoData, NewCdnApiResponse, StreamingInfo } from './deliver.interface';

const ttl = 60 * 60;

class DeliverService extends Service {
  private usedToken: string | null = null;
  private readonly apiCache: NodeCache = new NodeCache();
  private readonly urlCache: NodeCache = new NodeCache();
  private readonly envService: EnvService = ServiceProvider.get(EnvService);

  public async getCdnInfo(cdnId: string, quality: number): Promise<StreamingInfo> {
    if (cdnId.length === 9) return this.getLegacyCdnInfo(cdnId, quality);
    else return this.getNewCdnInfo(cdnId, quality);
  }

  public async getLegacyCdnInfo(cdnId: string, quality: number): Promise<StreamingInfo> {
    const freshToken = await this.envService.get<string>('token');
    if (this.usedToken !== freshToken) this.clearCache();

    const url = `${process.env.CDN_URL}/videos/${cdnId}?fields=files.size,files.link,files.type,files.quality,files.height`;

    let data: LegacyCdnApiResponse;
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
    let selectedVideo: LegacyVideoData = sortedData[0];

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

  public async getNewCdnInfo(cdnId: string, quality: number): Promise<StreamingInfo> {
    const freshToken = await this.envService.get<string>('n_token');
    if (this.usedToken !== freshToken) this.clearCache();

    const url = `${process.env.NEW_CDN_URL}?resourceKey=${cdnId}&model=pc_photo&linkType=folder`;

    let data: NewCdnApiResponse;
    if (this.apiCache.has(url)) {
      data = this.apiCache.get(url)!;
    } else {
      const response = await axios({
        url,
        method: 'GET',
        headers: { Cookie: `NNDV_SHARE=${freshToken}` },
      });
      data = response.data;
      if (data.code !== 0) throw new Error('Cdn file error');
    }

    const qualities = data.result.streamingUrls
      .map(url => parseInt(url.profile.replace('p', '')))
      .sort((a, b) => b - a);

    const selectedQuality = qualities.find(q => q >= quality) || qualities[0];
    const selectedUrl = data.result.streamingUrls.find(url => url.profile === `${selectedQuality}p`)!.streamingUrl;

    !this.apiCache.has(url) && this.apiCache.set(url, data, ttl);

    this.usedToken = freshToken;

    return { url: selectedUrl, quality: selectedQuality, qualities };
  }

  private clearCache(): void {
    this.apiCache.flushAll();
    this.urlCache.flushAll();
  }
}

export default DeliverService;
