import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import CalendarResponse from './calendar.response';
import CalendarService from './calendar.service';

class CalendarController extends Controller {
  public readonly path: string = '/calendar';
  private readonly calendarService: CalendarService = ServiceProvider.get(CalendarService);

  protected mount(): void {
    this.mounter.get('/', this.getAll.bind(this));
    this.mounter.get('/:timestamp', this.getOne.bind(this));
  }

  private async getAll(_req: TypedRequest, res: TypedResponse<CalendarResponse.GetAll>): Promise<void> {
    const timestamps = this.calendarService.getAll();
    res.json({ ok: true, timestamps });
  }

  private async getOne(req: TypedRequest, res: TypedResponse<CalendarResponse.GetOne>): Promise<void> {
    const timestamp = req.params.timestamp;
    const videos = this.calendarService
      .getOne(timestamp)
      .map(video => video.serialize(req, 'id', 'title', 'description', 'duration', 'properties'));
    res.json({ ok: true, videos });
  }
}

export default CalendarController;
