import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConnectionOptions} from "typeorm";
import {UpsortHomeMsg} from "../entities/upsort_home_msg";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_DATABASE'),
          charset: configService.get<string>('DATABASE_CHARSET'),
          // entities: [UpsortHomeMsg],
          autoLoadEntities: true,
          // synchronize: true,
        } as ConnectionOptions
      },
      inject: [ConfigService]
    }),
  ]
})
export class DatabaseModule {}
