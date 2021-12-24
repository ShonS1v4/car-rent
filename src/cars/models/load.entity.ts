import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cars } from './cars.entity';

@Entity()
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: 0 })
  total_days: number;

  @Column({ nullable: true, default: 0 })
  last_rent_total: number;

  @Column({ nullable: true, default: 0 })
  total_km: number;

  @Column({ nullable: true, default: 0 })
  last_km: number;

  @OneToOne(() => Cars, (cars) => cars.load_total)
  car: Cars;
}
