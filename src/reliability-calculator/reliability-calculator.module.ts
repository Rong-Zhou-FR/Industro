import { Module } from '@nestjs/common';
import { ReliabilityCalculatorController } from './reliability-calculator.controller';
import { ReliabilityCalculatorService } from './reliability-calculator.service';

@Module({
  controllers: [ReliabilityCalculatorController],
  providers: [ReliabilityCalculatorService],
})
export class ReliabilityCalculatorModule {}
