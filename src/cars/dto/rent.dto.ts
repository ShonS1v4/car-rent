import {IsDate, IsNotEmpty} from "class-validator";

export class RentDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsDate({message: "Taken_from should be a date"})
    taken_from: Date;

    @IsNotEmpty()
    @IsDate({message: "Taken_for should be a date"})
    taken_for: Date;

    @IsNotEmpty()
    km: number
}