namespace VideoResponse {
  export interface Upload extends ApiResponse {
    id: string;
  }

  export interface GetStreamingUrl extends ApiResponse {
    url: string;
  }
}
