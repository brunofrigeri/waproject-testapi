import { Injectable } from '@nestjs/common';
import { IOrder } from 'modules/database/interfaces/order';
import { Order } from 'modules/database/models/order';
import { Page, Transaction } from 'objection';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { User } from 'modules/database/models/user';

@Injectable()
export class OrderRepository {
  public async list(
    params: IPaginationParams,
    currentUser: ICurrentUser,
    transaction?: Transaction
  ): Promise<Page<Order>> {
    let userIsAdmin = currentUser.roles.includes('sysAdmin');
    let queryBase = Order.query(transaction)
      .select('*')
      .page(params.page, params.pageSize);

    let query = userIsAdmin
      ? Order.query(transaction)
          .innerJoin('User', 'User.id', 'Order.userId')
          .select('Order.*', 'User.firstName', 'User.lastName', 'User.roles')
          .page(params.page, params.pageSize)
      : queryBase.where({ userId: currentUser.id });

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
