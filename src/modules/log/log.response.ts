import VideoBeacon from './log.interface';

namespace LogResponse {
  export interface GetVideoBeacon extends ApiResponse {
    beacons: VideoBeacon[];
  }
}

export default LogResponse;
