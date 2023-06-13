import {Injectable, Logger} from '@nestjs/common';
import {AppService} from "../app.service";
import {ConfigService} from "@nestjs/config";
import axios, {AxiosResponse} from 'axios'
import {UpsortHomeMsg} from "../entities/upsort_home_msg";
import {getConnection, Repository} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import * as cheerio from 'cheerio';
import {UpsortHotNews} from "../entities/upsort_hot_news";

@Injectable()
export class SpiderService {

  private readonly logger = new Logger(SpiderService.name)

  constructor(
    @InjectRepository(UpsortHomeMsg)
    private upsortHomeMsgRepository: Repository<UpsortHomeMsg>,
    @InjectRepository(UpsortHotNews)
    private upsortHotNewsRepository: Repository<UpsortHotNews>,
    private readonly configService: ConfigService,
  ) {
  }

  async getUpsortHomeMsg() {
    const url = this.configService.get<string>('UPSORT_HOME_MSG_URL')
    try {
      const result: AxiosResponse<any> = await axios.get(`${url}`)
      const {data, code} = result?.data
      if (data?.length && code === 0) {
        await this.saveUpsortHomeMsgData(data)
        this.logger.debug('Called page: success');
      }
    } catch (e) {
      this.logger.error('Called page failed:', e);
    }
  }

  async saveUpsortHomeMsgData(data) {
    await this.upsortHomeMsgRepository.save(data)
  }


  async getHotNews() {
    try {
      const result = await axios.get('https://upsort.com/news')
      this.getHtmlContent(result?.data)
    } catch (e) {

    }
  }

  getHtmlContent(result: string) {
    try {
      const $ = cheerio.load(result);
      this.logger.debug(`parser html: success?`);
      const contentBoxs = $('div.news-box-wrap')
      for (let i = 0; i < contentBoxs.length; i++) {
        const box = contentBoxs[i]
        const updateTime = $(box).find('div.news-box-foot>div.news-box-foot-time').text()
        const source_tag = $(box).find('div.news-box-head>div.news-box-head-tag').text()
        const source = $(box).find('div.news-box-head-title>a').text()
        const list = $(box).find('div.news-box-body-row-content>a')
        const data = [];
        // console.log(updateTime, source_tag, source, list.length, 'tag')
        for (let j = 0; j < list.length; j++) {
          console.log(updateTime, source_tag, source, $(list[j]).text(), 'tag')

          data.push({
            source,
            source_tag,
            create_time: updateTime,
            content: $(list[j]).text(),
          })
        }
        this.saveHotNewsData(data)
      }
    } catch (e) {
      this.logger.debug(`parse error ${e}`);
    }
  }

  async saveHotNewsData(data: UpsortHotNews[]) {
    const queryRunner = this.upsortHotNewsRepository.manager.connection.createQueryRunner()
    try {

      await queryRunner.startTransaction();

      for (const item of data) {
        // await queryRunner.manager
        //   .createQueryBuilder()
        //   .insert()
        //   .into(UpsortHotNews)
        //   .values(item)
        //   .orIgnore()
        //   .execute();
        const existingNews = await queryRunner.manager.findOne(UpsortHotNews, {
          where: {
            content: item.content
          }
        })

        if (!existingNews) {
          // 如果不存在，则保存数据
          await queryRunner.manager.save(UpsortHotNews, item);
        } else {
          // 如果存在，则进行相应的处理
          // ...
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
