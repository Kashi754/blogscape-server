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

  static async list(page, limit, search) {
    const list = await knex.transaction(async (trx) => {
      const queryBuilder = this.table.transacting(trx);

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
