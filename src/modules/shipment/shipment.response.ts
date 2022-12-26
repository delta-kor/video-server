import Shipment from './shipment.interface';

namespace ShipmentResponse {
  export interface Get extends ApiResponse {
    shipment: Shipment;
  }
}

export default ShipmentResponse;
