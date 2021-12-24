import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Tariffs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    km_per_day: number;

    @Column({nullable: false})
    price: number;
}