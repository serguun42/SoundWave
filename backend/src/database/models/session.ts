import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Session } from '../../types/entities.js';
import UserModel from './user.js';

@Entity('sessions')
export default class SessionModel implements Session {
  @PrimaryColumn({ type: 'string', length: 64 })
  declare session_token: string;

  @ManyToOne(() => UserModel, (user) => user.sessions)
  @JoinColumn({ name: 'owner', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare owner: string;

  @Column({ type: 'timestamp' })
  declare until: Date;
}
