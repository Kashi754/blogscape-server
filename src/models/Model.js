const knex = require('../database');

class Model {
  static tableName;

  constructor() {
    if (this.constructor == Model) {
      throw new Error('Abstract class "Model" cannot be instantiated.');
    }
  }

  static get table() {
    if (!this.tableName) {
      throw new Error('You must define a table name!');
    }
    return knex(this.tableName);
  }

  static orderBy(builder, resultOrder) {
    if (resultOrder instanceof Array) {
      for (const param of resultOrder) {
        builder.orderBy(param.column, param.direction);
      }
    } else {
      builder.orderBy(resultOrder.column, resultOrder.direction);
    }
  }

  static join(builder, relation) {
    const { modelClass: table, join } = relation;
    const { type, from, to, andFrom, andTo } = join;

    switch (type) {
      case 'join':
        builder.join(table, from, to);
        break;
      case 'inner':
        builder.innerJoin(table, from, to);
        break;
      case 'left':
        builder.leftJoin(table, from, to);
        break;
      case 'leftOuter':
        if (andFrom) {
          builder.leftOuterJoin(table, function () {
            this.on(from, to).andOn(knex.raw(andFrom + ' = ?', andTo));
          });
        } else {
          builder.leftOuterJoin(table, from, to);
        }
        break;
      case 'right':
        builder.rightJoin(table, from, to);
        break;
      case 'rightOuter':
        builder.rightOuterJoin(table, from, to);
        break;
      case 'fullOuter':
        builder.fullOuterJoin(table, from, to);
        break;
    }
  }

  static nextPage(builder, nextPage) {
    const keys = Object.keys(nextPage);
    builder.where(() => {
      for (const [index, key] of keys.entries()) {
        if (index === 0) {
          builder.where(key, '>', nextPage[key]);
        } else {
          builder.andWhere(key, '>', nextPage[key]);
        }
      }
    });
  }

  static all() {
    return this.table;
  }

  static async search(searchTerms) {
    await knex.transaction(async (trx) => {
      const queryBuilder = this.table
        .limit(10)
        .orderBy('created_at', 'desc')
        .orderBy('id', 'desc');
    });
  }

  static async insert(data) {
    const [result] = await this.table.insert(data).returning('*');
    return result;
  }

  static async update(id, data) {
    const [result] = await this.table.where({ id }).update(data).returning('*');
    return result;
  }

  static async findById(id) {
    const result = await this.table.where({ id }).first();
    return result;
  }

  static async findBy(data) {
    const result = await this.table.where(data).first();
    return result;
  }

  static async list(page) {
    const list = await knex.transaction(async (trx) => {
      const queryBuilder = this.table.transacting(trx);

      if (page) {
        queryBuilder.modify(this.nextPage, page);
      }

      if (this.resultOrder) {
        queryBuilder.modify(this.orderBy, this.resultOrder);
      }

      if (this.resultLimit) {
        queryBuilder.limit(this.resultLimit);
      }

      if (this.relations) {
        for (const relation of this.relations) {
          queryBuilder.modify(this.join, relation);
        }
      }

      const result = await queryBuilder.select(this.selectableProps || '*');

      return result;
    });

    return list;
  }
}

module.exports = Model;
