import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Cars} from "./models/cars.entity";
import {Discount} from "./models/discount.entity";
import {Tariffs} from "./models/tariffs.entity";
import {Load} from "./models/load.entity";

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  imports: [TypeOrmModule.forFeature([Cars, Discount, Tariffs, Load])]
})
export class CarsModule {}
