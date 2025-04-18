import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Like } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: User['username'], password: User['password']) {
    const user = await this.usersService.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: number) {
    const user: User | null = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const { password, ...restData } = user;
    return restData;
  }

  async updateProfile(userId: Partial<User> | number, updateData: User) {
    const user: User | null = await this.usersService.findOne({
      id: userId as number,
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.usersService.updateOne(userId as Partial<User>, updateData);

    const updatedUser: User | null = await this.usersService.findOne({
      id: userId as number,
    });

    if (!updatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const { password, ...rest } = updatedUser;
    return rest;
  }

  async getPublicProfile(username: string) {
    const user = await this.usersService.findOne({ username });
    if (!user) throw new NotFoundException('Пользователь не найден');
    const { password, email, ...restData } = user;
    return restData;
  }

  async findUsersByQuery(query: string) {
    const users = await this.usersService.findMany([
      { username: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ]);

    return users.map(({ password, email, ...restData }) => restData);
  }
}
