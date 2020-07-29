import { Injectable } from '@nestjs/common';
import { IOrder } from 'modules/database/interfaces/order';
import { Order } from 'modules/database/models/order';
import { Page, Transaction } from 'objection';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';

@Injectable()
export class OrderRepository {
  public async list(
    params: IPaginationParams,
    currentUser: ICurrentUser,
    transaction?: Transaction
  ): Promise<Page<Order>> {
    let query = Order.query(transaction)
      .select('*')
      .where({ userId: currentUser.id })
      .page(params.page, params.pageSize);

    if (params.orderBy) {
      query = query.orderBy('description', params.orderDirection);
    }

    if (params.term) {
      query = query.where(query => {
        return query
          .where('description', 'ilike', `%${params.term}%`)
          .orWhere('quantity', 'ilike', `%${params.term}%`)
          .orWhere('value', 'ilike', `%${params.term}%`);
      });
    }

    return query;
  }

  public async findById(id: number, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction).findById(id);
  }

  public async update(model: IOrder, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction).updateAndFetchById(model.id, model as any);
  }

  public async insert(model: IOrder, transaction: Transaction = null): Promise<Order> {
    return Order.query(transaction).insertAndFetch(model as any);
  }

  public async remove(id: number, transaction?: Transaction): Promise<void> {
    await Order.query(transaction)
      .del()
      .where({ id });
  }
}
