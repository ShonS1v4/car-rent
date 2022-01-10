import {IsNotEmpty, Length} from "class-validator";

export class CarDto {
    @IsNotEmpty({message: "Mark cannot be empty."})
    mark: string;

    @IsNotEmpty({message: "Model cannot be empty."})
    model: string;

    @IsNotEmpty({message: "Government number cannot be empty."})
    @Length(7, 9)
    gov_number: string;

    @IsNotEmpty({message: "Vin number cannot be empty"})
    @Length(17, 17)
    vin: string;
}