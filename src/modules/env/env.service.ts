import Service from '../../services/base.service';
import Env from './env.interface';
import EnvModel from './env.model';

class EnvService extends Service {
  private readonly cache: Map<string, any> = new Map();

  public async get<T>(key: string): Promise<T | null> {
    if (this.cache.has(key)) return this.cache.get(key);
    const env: Env | null = await EnvModel.findOne({ key });
    if (!env) return null;
    return env.value;
  }

  public async set<T>(key: string, value: T): Promise<T> {
    this.cache.set(key, value);
    const env: Env | null = await EnvModel.findOne({ key });
    if (env) {
      env.value = value;
      await env.save();
      return env.value;
    } else {
      const newEnv = new EnvModel({ key, value });
      await newEnv.save();
      return newEnv.value;
    }
  }
}

export default EnvService;
