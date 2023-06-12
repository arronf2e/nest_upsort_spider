import {Injectable, Logger} from '@nestjs/common';
import {AppService} from "../app.service";
import {ConfigService} from "@nestjs/config";
import axios, {AxiosResponse} from 'axios'
import {UpsortHomeMsg} from "../entities/upsort_home_msg";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class SpiderService {

  private readonly logger = new Logger(SpiderService.name)
  constructor(
    @InjectRepository(UpsortHomeMsg)
    private upsortHomeMsgRepository: Repository<UpsortHomeMsg>,
    private readonly configService: ConfigService,
  ) {}
  async getUpsortHomeMsg() {
    const url = this.configService.get<string>('UPSORT_HOME_MSG_URL')
    try {
      const result: AxiosResponse<any> = await axios.get(`${url}`)
      const { data, code } = result?.data
      if(data?.length && code === 0) {
        await this.saveUpsortHomeMsgData(data)
        this.logger.debug('Called page: success');
      }
    }catch (e) {
      this.logger.error('Called page failed:', e);
    }
  }

  async saveUpsortHomeMsgData(data) {
    await this.upsortHomeMsgRepository.save(data)
  }
}
