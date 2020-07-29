import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from 'modules/common/module';
import { DatabaseModule } from 'modules/database/module';

import { AuthController } from './controllers/auth';
import { TestController } from './controllers/test';
import { UserController } from './controllers/user';
import { RenewTokenMiddleware } from './middlewares/renewToken';
import { UserRepository } from './repositories/user';
import { AuthService } from './services/auth';
import { UserService } from './services/user';
import { OrderRepository } from './repositories/order';
import { OrderService } from './services/order';
import { OrderController } from './controllers/order';

@Module({
  imports: [HttpModule, CommonModule, DatabaseModule],
  controllers: [AuthController, UserController, TestController, OrderController],
  providers: [AuthService, OrderService, OrderRepository, UserRepository, UserService]
})
export class AdminModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(RenewTokenMiddleware).forRoutes('*');
  }
}
