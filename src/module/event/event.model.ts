import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm'

@Entity({ engine: 'MEMORY' })
export class EventModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: 0 })
    total_tickets: number

    @Column({ default: 0 })
    booked_tickets: number

    @Column({ type: 'boolean', default: false })
    is_active: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
