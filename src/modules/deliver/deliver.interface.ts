interface LegacyCdnApiResponse {
  files: LegacyVideoData[];
}

interface LegacyVideoData {
  quality: 'sd' | 'hd' | 'hls';
  type: string;
  height: number;
  link: string;
  size: number;
}

interface NewCdnApiResponse {
  code: number;
  result: NewVideoData;
}

interface NewVideoData {
  type: 'pd';
  streamingUrls: { streamingUrl: string; profile: string }[];
}

interface StreamingInfo {
  url: string;
  quality: number;
  qualities: number[];
}

export { LegacyCdnApiResponse, LegacyVideoData, NewCdnApiResponse, NewVideoData, StreamingInfo };
