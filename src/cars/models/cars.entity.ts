import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Load } from './load.entity';

@Entity()
export class Cars {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  mark: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: false })
  gov_number: string;

  @Column({ nullable: false })
  vin: string;

  @Column({ nullable: false, default: new Date() })
  created_at: Date;

  @Column({ nullable: false, default: true })
  is_available: boolean;

  @Column({ nullable: true })
  taken_from: Date;

  @Column({ nullable: true, default: null })
  taken_for: Date;

  @OneToOne(() => Load, (load) => load.id, {
    cascade: true,
  })
  @JoinColumn({
    name: 'loadId',
  })
  load_total: Load;
}
