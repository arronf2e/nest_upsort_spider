import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity({
  name: 'upsort_hot_news'
})
export class UpsortHotNews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 2000
  })
  content: string;

  @Column()
  source: string;


  @Column()
  source_tag: string;


  @Column()
  create_time: string;

  @CreateDateColumn()
  createdAt: Date;
}
