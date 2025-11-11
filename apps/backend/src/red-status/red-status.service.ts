import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RedStatusResponse } from '@food-store-calculator/shared';
import { RedOrderLog } from './entities/red-order-log.entity';

const RED_SET_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class RedStatusService {
  constructor(
    @InjectRepository(RedOrderLog)
    private redOrderLogRepository: Repository<RedOrderLog>
  ) {}

  async checkRedStatus(): Promise<RedStatusResponse> {
    const oneHourAgo = new Date(Date.now() - RED_SET_COOLDOWN_MS);

    const recentOrder = await this.redOrderLogRepository.findOne({
      where: {
        orderedAt: MoreThan(oneHourAgo),
      },
      order: {
        orderedAt: 'DESC',
      },
    });

    if (recentOrder) {
      const lastOrderedAt = recentOrder.orderedAt;
      const nextAvailableAt = new Date(lastOrderedAt.getTime() + RED_SET_COOLDOWN_MS);
      const remainingTimeMs = Math.max(0, nextAvailableAt.getTime() - Date.now());

      return {
        canOrder: false,
        lastOrderedAt: lastOrderedAt.toISOString(),
        nextAvailableAt: nextAvailableAt.toISOString(),
        remainingTimeMs,
        message: 'Red Set can only be ordered once per hour',
      };
    }

    return {
      canOrder: true,
      message: 'Red Set is available to order',
      remainingTimeMs: 0,
    };
  }

  async logRedOrder(): Promise<void> {
    const log = this.redOrderLogRepository.create({
      orderedAt: new Date(),
    });
    await this.redOrderLogRepository.save(log);
  }
}
