import Video from '../video/video.interface';

namespace CalendarResponse {
  export interface GetAll extends ApiResponse {
    timestamps: [string, number][];
  }

  export interface GetOne extends ApiResponse {
    videos: Video[];
  }
}

export default CalendarResponse;
