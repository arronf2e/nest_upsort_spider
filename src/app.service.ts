import { Injectable } from '@nestjs/common';
import {SpiderService} from "./spider/spider.service";

@Injectable()
export class AppService {

  constructor(private readonly spiderService: SpiderService) {}
  getHello() {
    return 'good service'
  }
}
