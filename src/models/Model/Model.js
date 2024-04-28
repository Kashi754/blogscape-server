const knex = require('../../database');
const Builder = require('./Builder');

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

  static get view() {
    if (!this.materializedView) {
      return knex(this.tableName);
    }

    return knex(this.materializedView);
  }

  static all() {
    return this.table;
  }

  static async insert(trx, data, returning = '*') {
    const queryBuilder = this.table
      .transacting(trx)
      .insert(data)
      .returning(returning);

    const [result] = await queryBuilder;

    return result;
  }

  static async update(trx, id, data, returning = '*') {
    const queryBuilder = this.table
      .transacting(trx)
      .where({ id })
      .update(data)
      .returning(returning);

    const [result] = await queryBuilder;

    return result;
  }

  static async findById(id, transaction) {
    const queryBuilder = this.view.where({ id });

    if (this.relations) {
      for (const relation of this.relations) {
        queryBuilder.modify(Builder.join, relation);
      }
    }

    let result;

    if (!transaction) {
      result = await knex.transaction(async (trx) => {
        return await queryBuilder
          .transacting(trx)
          .first(this.selectableProps || '*');
      });
    } else {
      [result] = await queryBuilder
        .transacting(transaction)
        .select(this.selectableProps || '*');
    }

    return result;
  }

  static async findBy(data) {
    const result = await this.table.where(data).first();
    return result;
  }

  static async deleteById(trx, id, columnName = 'id') {
    await this.table
      .transacting(trx)
      .where({ [columnName]: id })
      .del();
  }

  static async list(page, limit, search) {
    const list = await knex.transaction(async (trx) => {
      const queryBuilder = this.view.transacting(trx);

      if (page) {
        queryBuilder.modify(Builder.nextPage, page);
      }

      if (search) {
        queryBuilder.modify(Builder.search, search);
      }

      if (this.resultOrder) {
        queryBuilder.modify(Builder.orderBy, this.resultOrder);
      }

      if (limit || this.resultLimit) {
        queryBuilder.limit(limit || this.resultLimit);
      }

      if (this.relations) {
        for (const relation of this.relations) {
          queryBuilder.modify(Builder.join, relation);
        }
      }

      let result;

      if (search) {
        result = await queryBuilder.select([
          ...(this.selectableProps || '*'),
          search.searchProps,
        ]);
      } else {
        result = await queryBuilder.select(this.selectableProps || '*');
      }

      return result;
    });

    return list;
  }
}

module.exports = Model;
