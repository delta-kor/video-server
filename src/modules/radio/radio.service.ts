import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import BuilderService from '../builder/builder.service';
import Radio from './radio.interface';

class RadioService extends Service {
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);
  public readonly radios: Radio[] = [];

  public async load(): Promise<void> {
    const radios = this.builderService.getAllRadioData();
    this.radios.push(...radios);
  }

  public get(id: string): Radio | null {
    for (const radio of this.radios) {
      if (radio.id === id) return radio;
    }
    return null;
  }
}

export default RadioService;
