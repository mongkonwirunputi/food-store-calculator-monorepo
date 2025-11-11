import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersHistoryController } from './orders.history.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { RedStatusModule } from '../red-status/red-status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    RedStatusModule,
  ],
  controllers: [OrdersController, OrdersHistoryController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
