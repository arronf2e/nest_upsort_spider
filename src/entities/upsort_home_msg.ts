import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity({
  name: 'upsort_home_msg'
})
export class UpsortHomeMsg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 2000
  })
  content: string;

  @Column()
  create_time: string;

  @CreateDateColumn()
  createdAt: Date;
}
