import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity({
  name: 'upsort_home_msg'
})
export class UpsortHomeMsg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  create_time: string;

  @CreateDateColumn()
  createdAt: Date;
}
