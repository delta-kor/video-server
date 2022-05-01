import Controller from '../../classes/controller.class';
import NotFoundException from '../../exceptions/not-found.exception';
import ServiceProvider from '../../services/provider.service';
import RadioResponse from './radio.response';
import RadioService from './radio.service';

class RadioController extends Controller {
  public readonly path = '/radio';
  private readonly radioService: RadioService = ServiceProvider.get(RadioService);

  protected mount(): void {
    this.mounter.get('/:id', this.stream.bind(this));
  }

  private async stream(req: TypedRequest, res: TypedResponse<RadioResponse.Stream>): Promise<void> {
    const id = req.params.id;
    const radio = this.radioService.get(id);
    if (!radio) throw new NotFoundException();

    const url = `${process.env.RADIO_URL}/${id}`;
    res.json({ ok: true, title: radio.title, album: radio.album, duration: radio.duration, lyrics: radio.lyrics, url });
  }
}

export default RadioController;
