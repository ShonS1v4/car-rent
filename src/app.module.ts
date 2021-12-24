import { Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { CarsModule } from './cars/cars.module';
import {ConfigModule} from "@nestjs/config";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        TypeOrmModule.forRoot(),
        CarsModule,
    ],
})
export class AppModule {}