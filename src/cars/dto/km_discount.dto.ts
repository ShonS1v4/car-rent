import {IsNotEmpty} from "class-validator";

enum types {
    TARIFF,
    DISCOUNT,
}

export class KmDiscountDto {
    @IsNotEmpty()
    type: types

    km?: number

    days?: number

    id?: number


}