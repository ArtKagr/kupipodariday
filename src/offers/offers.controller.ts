import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() offerData: CreateOfferDto, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const userId = (req.user as User)['id'];
    return this.offersService.create({
      amount: offerData.amount,
      hidden: offerData.hidden ?? false,
      item: { id: offerData.itemId } as Wish,
      user: { id: userId } as User,
    });
  }

  @Get()
  findAll() {
    return this.offersService.findMany({});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne({ id });
  }
}
