interface CdnApiResponse {
  files: VideoData[];
}

interface VideoData {
  quality: 'sd' | 'hd' | 'hls';
  type: string;
  height: number;
  link: string;
  size: number;
}

interface StreamingInfo {
  url: string;
  quality: number;
  qualities: number[];
}

export { CdnApiResponse, VideoData, StreamingInfo };
