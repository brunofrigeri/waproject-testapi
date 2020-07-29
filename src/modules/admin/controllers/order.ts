import { Body, Controller, Post, Get, Query, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { Order } from 'modules/database/models/order';

import { OrderRepository } from '../repositories/order';
import { OrderService } from '../services/order';
import { UpdateValidator } from '../validators/order/update';
import { SaveValidator } from '../validators/order/save';
import { ListValidator } from '../validators/order/list';

@ApiTags('App: Order')
@Controller('/order')
@AuthRequired()
export class OrderController {
  constructor(private orderRepository: OrderRepository, private orderService: OrderService) {}

  @Get()
  @ApiResponse({ status: 200, type: [Order] })
  public async list(@Query() model: ListValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderRepository.list(model, currentUser);
  }

  @Post()
  @ApiResponse({ status: 200, type: Order })
  public async save(@Body() model: SaveValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.save(model, currentUser);
  }

  @Post()
  @ApiResponse({ status: 200, type: Order })
  public async update(@Body() model: UpdateValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.update(model, currentUser);
  }

  @Get(':orderId')
  @ApiResponse({ status: 200, type: Order })
  public async details(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderRepository.findById(orderId);
  }

  @Delete(':orderId')
  public async delete(@Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.remove(orderId, currentUser);
  }
}
