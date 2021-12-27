import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import {CarDto} from "./dto/car.dto";
import { KmDiscountDto } from './dto/km_discount.dto';
import {RentDto} from "./dto/rent.dto";

@Controller('cars')
export class CarsController {
  constructor(private serv: CarsService) {}

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }

  @Post()
  public async setItem(@Body() data: CarDto) {
    return await this.serv.setItem(data);
  }

  @Post('/take')
  public async takeForRent(@Body() data: RentDto) {
    return await this.serv.rent(data);
  }

  @Post('/return')
  public async rent_return(@Body() data: any) {
    return await this.serv.rent_back(data);
  }

  //tariffs and discounts
  @Get('/utils')
  public async getUtils(@Body() data: KmDiscountDto) {
    return await this.serv.getUtils(data.type);
  }

  @Post('/utils')
  public async setUtils(@Body() data: KmDiscountDto) {
    return await this.serv.setUtil(data);
  }

  @Delete('/utils')
  public async deleteUtils(@Body() data: KmDiscountDto) {
    return await this.serv.deleteUtil(data);
  }

  @Post('/utils/by')
  public async getUtilsByRow(@Body() data: KmDiscountDto) {
    return await this.serv.getUtilByRow(data);
  }

  @Get('/get-overview-by-car')
  public async update_load_data(@Body() data: any) {
    return await this.serv.getOverviewByyCar(data.carid);
  }
}
