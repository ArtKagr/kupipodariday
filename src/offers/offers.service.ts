import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  create(offer: Partial<Offer>) {
    const newOffer = this.offersRepository.create(offer);
    return this.offersRepository.save(newOffer);
  }

  findOne(query: Partial<Offer>) {
    return this.offersRepository.findOne({ where: query });
  }

  findMany(query: Partial<Offer>) {
    return this.offersRepository.find({ where: query });
  }

  updateOne(query: Partial<Offer>, update: Partial<Offer>) {
    return this.offersRepository.update(query, update);
  }

  removeOne(query: Partial<Offer>) {
    return this.offersRepository.delete(query);
  }
}
