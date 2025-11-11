import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedStatusController } from './red-status.controller';
import { RedStatusService } from './red-status.service';
import { RedOrderLog } from './entities/red-order-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RedOrderLog])],
  controllers: [RedStatusController],
  providers: [RedStatusService],
  exports: [RedStatusService],
})
export class RedStatusModule {}

