import Ad from './ad.interface';

namespace AdResponse {
  export interface Add extends ApiResponse {
    id: string;
  }

  export interface GetAll extends ApiResponse {
    ads: Ad[];
  }
}

export default AdResponse;
