import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(user: Partial<User>) {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  findOne(query: Partial<User>) {
    return this.usersRepository.findOne({ where: query });
  }

  async findMany(query: FindOptionsWhere<User>[]) {
    return this.usersRepository.find({ where: query });
  }

  updateOne(query: Partial<User>, update: Partial<User>) {
    return this.usersRepository.update(query, update);
  }

  removeOne(query: Partial<User>) {
    return this.usersRepository.delete(query);
  }

  async getWishes(query: Partial<User>) {
    const user: User | null = await this.usersRepository.findOne({
      where: query,
      relations: ['wishes'],
    });
    return user?.wishes || [];
  }
}
