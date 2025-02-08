import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'

@Entity({ engine: 'MEMORY' })
export class WaitingList {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column({ default: null })
    user_email: string

    @Column()
    event_id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
