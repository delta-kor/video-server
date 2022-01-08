import Service from './base.service';

class ServiceProviderClass {
  private readonly instances: Map<typeof Service, Service> = new Map();

  public async load(services: typeof Service[]): Promise<void> {
    for (const service of services) {
      const instance = new service();
      await instance.load();
      this.instances.set(service, instance);
      console.log(`Loaded ${service.name}`);
    }
  }

  public get(service: typeof Service): any {
    const instance = this.instances.get(service);
    if (!instance) throw new Error(`Service ${service.name} is not loaded`);
    return instance;
  }
}

const ServiceProvider = new ServiceProviderClass();

export default ServiceProvider;
