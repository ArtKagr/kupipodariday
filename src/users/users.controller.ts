import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Query() query: Partial<User>) {
    return this.usersService.findOne(query);
  }

  @Patch('me')
  updateCurrentUser(
    @Query() query: UpdateUserDto,
    @Body() update: UpdateUserDto,
  ) {
    return this.usersService.updateOne(query, update);
  }

  @Get('me/wishes')
  getCurrentUserWishes(@Query() query: Partial<User>) {
    return this.usersService.getWishes(query);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findOne({ username });
  }

  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishes({ username });
  }

  @Post('find')
  findUsers(@Body() body: FindOptionsWhere<User>[]) {
    return this.usersService.findMany(body);
  }
}
