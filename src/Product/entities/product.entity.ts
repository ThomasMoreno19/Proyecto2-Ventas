import {
Entity,
PrimaryGeneratedColumn,
Column,
ManyToOne,
JoinColumn,
CreateDateColumn,
UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'products' })
export class ProductEntity {
@PrimaryGeneratedColumn('increment')
id: number;


@Column({ type: 'varchar', length: 255 })
name: string;


@Column({ type: 'text', nullable: true })
description?: string;


@Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
price: number;


@Column({ type: 'int', default: 0 })
stock: number;
    

// relación con Line
@ManyToOne(() => Line, (line) => line.products, { eager: false, onDelete: 'SET NULL' })
@JoinColumn({ name: 'line_id' })
line: Line;

@CreateDateColumn({ type: 'timestamptz' })
createdAt: Date;


@UpdateDateColumn({ type: 'timestamptz' })
updatedAt: Date;
}