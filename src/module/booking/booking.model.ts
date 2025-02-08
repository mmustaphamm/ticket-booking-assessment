import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ engine: 'MEMORY' })
export class Booking {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column()
    user_id: number

    @Column({ default: null })
    user_email: string

    @Column()
    event_id: number

    @Column()
    status: 'booked' | 'waiting' | 'cancelled'

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date
}
