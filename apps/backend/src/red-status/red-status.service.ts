import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RedStatusResponse } from '@food-store-calculator/shared';
import { RedOrderLog } from './entities/red-order-log.entity';

@Injectable()
export class RedStatusService {
  constructor(
    @InjectRepository(RedOrderLog)
    private redOrderLogRepository: Repository<RedOrderLog>
  ) {}

  async checkRedStatus(): Promise<RedStatusResponse> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentOrder = await this.redOrderLogRepository.findOne({
      where: {
        orderedAt: MoreThan(oneHourAgo),
      },
      order: {
        orderedAt: 'DESC',
      },
    });

    if (recentOrder) {
      return {
        canOrder: false,
        lastOrderedAt: recentOrder.orderedAt.toISOString(),
        message: 'Red Set can only be ordered once per hour',
      };
    }

    return {
      canOrder: true,
      message: 'Red Set is available to order',
    };
  }

  async logRedOrder(): Promise<void> {
    const log = this.redOrderLogRepository.create({
      orderedAt: new Date(),
    });
    await this.redOrderLogRepository.save(log);
  }
}

