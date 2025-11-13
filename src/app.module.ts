import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WelcomeModule } from './welcome/welcome.module';
import { ReliabilityCalculatorModule } from './reliability-calculator/reliability-calculator.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    WelcomeModule,
    ReliabilityCalculatorModule,
  ],
})
export class AppModule {}
