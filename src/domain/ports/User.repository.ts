import { User } from '../entities/User';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User>;
}
