import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import EnvService from '../env/env.service';

class CdnService extends Service {
  private readonly envService: EnvService = ServiceProvider.get(EnvService);
}

export default CdnService;
