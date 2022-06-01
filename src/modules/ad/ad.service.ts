import Service from '../../services/base.service';
import Ad from './ad.interface';
import AdModel from './ad.model';
import AddDto from './dto/add.dto';

class AdService extends Service {
  private ads: Ad[] = [];

  public async load(): Promise<void> {
    this.ads = await AdModel.find();
  }

  public async add(data: AddDto): Promise<Ad> {
    const ad: Ad = new AdModel({ title: data.title, description: data.description, link: data.link });
    await ad.save();
    await this.load();

    return ad;
  }

  public getAll(): Ad[] {
    return this.ads;
  }
}

export default AdService;
