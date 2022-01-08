namespace VideoResponse {
  export interface Upload extends ApiResponse {
    id: string;
  }

  export interface Stream extends ApiResponse {
    url: string;
    duration: number;
  }
}
