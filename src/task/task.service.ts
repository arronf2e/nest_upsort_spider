import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import {SpiderService} from "../spider/spider.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name)
  constructor(private readonly spiderService: SpiderService) {}
  @Cron('*/10 * * * * *')
  async handleCron() {
    this.logger.debug('Called per second 20');
    await this.spiderService.getUpsortHomeMsg()
    await this.spiderService.getHotNews()
  }
}
