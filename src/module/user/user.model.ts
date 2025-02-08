import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import BaseModel from '../../models/base.model'

@Entity({ name: 'user_data_test', engine: 'MEMORY' })
export class User extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        nullable: false,
    })
    email: string

    @Column({ nullable: false })
    password: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
