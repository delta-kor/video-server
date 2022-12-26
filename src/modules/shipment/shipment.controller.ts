import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import ShipmentResponse from './shipment.response';
import ShipmentService from './shipment.service';

class ShipmentController extends Controller {
  public readonly path: string = '/shipment';
  private readonly shipmentService: ShipmentService = ServiceProvider.get(ShipmentService);

  protected mount(): void {
    this.mounter.get('/', this.get.bind(this));
  }

  private async get(req: TypedRequest, res: TypedResponse<ShipmentResponse.Get>): Promise<void> {
    const shipment = await this.shipmentService.get();

    shipment.playlists = shipment.playlists.map(playlist =>
      playlist.serialize(req, 'id', 'title', 'description', 'video', 'thumbnail', 'featured')
    );

    shipment.videos = shipment.videos.map(video =>
      video.serialize(req, 'id', 'title', 'description', 'category', 'duration', 'date')
    );

    res.json({ ok: true, shipment });
  }
}

export default ShipmentController;
