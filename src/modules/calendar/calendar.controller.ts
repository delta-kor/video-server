import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import CalendarResponse from './calendar.response';
import CalendarService from './calendar.service';

class CalendarController extends Controller {
  public readonly path: string = '/calendar';
  private readonly calendarService: CalendarService = ServiceProvider.get(CalendarService);

  protected mount(): void {
    this.mounter.get('/', this.getAll.bind(this));
  }

  private async getAll(_req: TypedRequest, res: TypedResponse<CalendarResponse.GetAll>) {
    const timestamps = this.calendarService.getAll();
    res.json({ ok: true, timestamps });
  }
}

export default CalendarController;
