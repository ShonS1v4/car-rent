import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  days_from: number;

  @Column({ nullable: false })
  days_to: number;

  @Column({ nullable: false })
  discount: number;
}
