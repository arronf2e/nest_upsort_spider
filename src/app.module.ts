import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UpsortHomeMsg} from "./entities/upsort_home_msg";
import { SpiderService } from './spider/spider.service';
import { TaskService } from './task/task.service';
import {ScheduleModule} from "@nestjs/schedule";
import {ConfigService} from "@nestjs/config";
import {UpsortHotNews} from "./entities/upsort_hot_news";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UpsortHomeMsg, UpsortHotNews]), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SpiderService, TaskService, ConfigService],
})
export class AppModule {}
