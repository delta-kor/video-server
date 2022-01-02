import Service from './base.service';

class ServiceProviderClass {
  private readonly instances: Map<typeof Service, Service> = new Map();

  public load(services: typeof Service[]): void {
    for (const service of services) {
      this.instances.set(service, new service());
    }
  }

  public get(service: typeof Service): any {
    return this.instances.get(service)!;
  }
}

const ServiceProvider = new ServiceProviderClass();

export default ServiceProvider;
