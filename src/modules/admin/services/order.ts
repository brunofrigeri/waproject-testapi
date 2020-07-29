import { Injectable, BadRequestException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IOrder } from 'modules/database/interfaces/order';

import { OrderRepository } from '../repositories/order';
import { Order } from 'modules/database/models/order';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async remove(orderId: number, currentUser: ICurrentUser): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (order.userId !== currentUser.id) {
      throw new BadRequestException('not-allowed-remove-order-of-another');
    }

    return this.orderRepository.remove(orderId);
  }

  public async update(model: IOrder, currentUser: ICurrentUser): Promise<Order> {
    const order = await this.orderRepository.findById(model.id);

    delete model.id;
    if (order.userId !== currentUser.id) {
      throw new BadRequestException('not-allowed-update-order-of-another');
    }

    return this.orderRepository.update({ ...order, ...model });
  }

  public async save(model: IOrder, currentUser: ICurrentUser): Promise<Order> {
    if (model.id) return this.update(model, currentUser);
    return this.create(model, currentUser);
  }

  private async create(model: IOrder, currentUser: ICurrentUser): Promise<Order> {
    const order = await this.orderRepository.insert({ ...model, userId: currentUser.id });

    return order;
  }
}
