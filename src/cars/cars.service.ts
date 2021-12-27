import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cars } from './models/cars.entity';
import { getRepository, Repository } from 'typeorm';
import { getConnection } from 'typeorm';
import { Discount } from './models/discount.entity';
import { Tariffs } from './models/tariffs.entity';
import { Load } from './models/load.entity';

enum types {
  TARIFF,
  DISCOUNT,
}

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Cars) private readonly Cars: Repository<Cars>,
    @InjectRepository(Discount) private readonly Discount: Repository<Discount>,
    @InjectRepository(Tariffs) private readonly Tariffs: Repository<Tariffs>,
    @InjectRepository(Load) private readonly Load: Repository<Load>,
  ) {}

  public async getAll() {
    return await this.Cars.find();
  }

  public async setItem(data) {
    const carRepository = getRepository(Cars);
    const loadRepository = getRepository(Load);

    const car = new Cars();
    car.mark = data.mark;
    car.model = data.model;
    car.gov_number = data.gov_number;
    car.vin = data.vin;

    const load = new Load();

    car.load_total = load;

    await carRepository.save(car);
    await loadRepository.save(load);

    return car;
  }

  public async rent(data: any) {
    const car = await this.Cars.findOne({ id: data.id });
    if (car.is_available)
        return  await this.rent_success(data)
    if (!car.is_available)
      return 'Машина на данный момент занята';
    return 'Машина не найдена';
  }

  //rent
  public async rent_success(data: any) {
    //получение данных из тела запроса
    const { taken_from, taken_for, km } = data;
    //преобразование из строки в дату
    const taken_from_day = new Date(taken_from).getDay();

    //если начало аренды падает на субботу или воскресенье
    if (taken_from_day == 6 || taken_from_day == 0) {
      return 'Невозможно арендовать автомобиль в выходной день!';
    }
    //подсчет общего срока аренды
    const total_days = taken_for.split(' ')[2] - taken_from.split(' ')[2];

    //если срок аренды не превышает максимально разрешимый
    if (total_days <= 30) {
      //получаем тариф подходящий под условие
      const tariff = await this.getUtilByRow({ type: 0, km: km });
      //получаем скику подходящую под условие аренды
      const discount = await this.getUtilByRow({
        type: 1,
        days: total_days,
      });
      //высчитываем цену за день
      const price_per_day =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        tariff.price - (tariff.price * discount.discount) / 100;

      //высчитываем общюю цену за аренду
      const total_price = price_per_day * total_days;

      //получаем id отчета
      const carRepository = getRepository(Cars);
      const car = await carRepository.findOne(data.id, {
        relations: ['load_total'],
      });
      car.load_total.total_km += km;
      car.load_total.total_days += total_days;
      car.load_total.last_rent_total = total_days;
      car.load_total.last_km = km;
      car.taken_from = taken_from;
      car.taken_for = taken_for;
      car.is_available = !car.is_available;
      await carRepository.save(car);
      return {
        message: 'Rent success',
        price: total_price,
        load: car.load_total,
      };
    }

    //если машину пытаются взять в аренду на срок больше максимального, то
    return 'Максимальный срок аренды до 30 дней!';
  }

  //функция которая оббновит отчет об машине
  public async getOverviewByyCar(id) {
    console.log(id);
    const loads = await getRepository(Load).find({
      relations: ['car'],
    });
    for (let item of loads) {
      item.car.id == id
      ?? item
    }
  }

  //give car back to service
  public async rent_back(data) {
    const today = new Date();
    const new_end_date = String(today).split(' ');
    new_end_date[2] = String(Number(new_end_date[2]) + Number(3));
    console.log(new_end_date);
    await getConnection()
      .createQueryBuilder()
      .update(Cars)
      .set({
        is_available: true,
        taken_from: null,
        taken_for: null,
      })
      .where('id = :id', { id: data.id })
      .execute();
  }

  //tariffs and discounts get all
  public async getUtils(data) {
    if (data.type == types.TARIFF || data == types.TARIFF)
      return await this.Tariffs.find();
    if (data.type == types.DISCOUNT || data == types.DISCOUNT)
      return await this.Discount.find();
  }

  //add tariff or discount
  public async setUtil(data) {
    if (data.type == types.TARIFF) {
      const km_per_day = Number(data.km_per_day);
      const price = Number(data.price);
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Tariffs)
        .values([
          {
            km_per_day,
            price,
          },
        ])
        .execute();
    }
    if (data.type == types.DISCOUNT) {
      const days_from = Number(data.days_from);
      const days_to = Number(data.days_to);
      const discount = Number(data.discount);
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Discount)
        .values([
          {
            days_from,
            days_to,
            discount,
          },
        ])
        .execute();
    }
  }

  //this func find tariff by km or discount by days
  public async getUtilByRow(data) {
    if (data.type === types.TARIFF) {
      const { km } = data;
      let tariffs = await this.getUtils({ type: 0 });
      tariffs.sort((a) => {
        return a.km_per_day;
      });
      tariffs = tariffs.reverse();
      for (const item of tariffs) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (km >= item.km_per_day) {
          return item;
        }
      }
      return {
        massage: 'Tariff not found',
      };
    }
    if (data.type == types.DISCOUNT) {
      const { days } = data;
      if (days < 3) {
        return {
          message: 'No discount allowed',
        };
      }
      const discounts = await this.getUtils({ type: 1 });
      discounts.sort(function (a, b) {
        return a.days_from - b.days_from;
      });
      for (let i = 0; i < discounts.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (days <= discounts[i].days_to) return discounts[i];
      }
      return {
        massage: 'Discount not found',
      };
    }
  }

  //this func delete your tariff or discount
  public async deleteUtil(data) {
    if (data.type == types.TARIFF) {
      const type = 'Tariffs';
      const id = data.id;
      await CarsService.delete(type, id);
    }
    if (data.type == types.DISCOUNT) {
      const type = 'Discount';
      const id = data.id;
      await CarsService.delete(type, id);
    }
  }

  private static async delete(type, id) {
    return await getConnection()
      .createQueryBuilder()
      .delete()
      .from(type)
      .where('id = :id', { id: id })
      .execute();
  }
}
