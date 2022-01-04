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

export { CdnApiResponse, VideoData };
