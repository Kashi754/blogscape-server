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

  static addSearchColumn(query) {
    return knex.raw(
      `
      ts_rank_cd(search, websearch_to_tsquery(:query)) +
      ts_rank_cd(search, websearch_to_tsquery('simple',:query)) +
      ts_rank_cd(search, websearch_to_tsquery('english',:query))
      AS rank
    `,
      { query: query }
    );
  }

  static all() {
    return this.table;
  }

  static async insert(transaction, data, returning = '*') {
    const queryBuilder = this.table.insert(data).returning(returning);

    let result;

    if (!transaction) {
      result = await knex.transaction(async (trx) => {
        return await queryBuilder.transacting(trx);
      });
    } else {
      result = await queryBuilder.transacting(transaction);
    }

    return result;
  }

  static async delete(transaction, where, returning = '*') {
    const queryBuilder = this.table;

    if (!(where instanceof Array)) {
      queryBuilder.modify(Builder.where, where);
    } else {
      for (const whereValue of where) {
        queryBuilder.modify(Builder.where, whereValue);
      }
    }

    let result;

    if (!transaction) {
      result = await knex.transaction(async (trx) => {
        return await queryBuilder.del(returning).transacting(trx);
      });
    } else {
      result = await queryBuilder.del(returning).transacting(transaction);
    }
    return result;
  }

  static async update(transaction, id, data, returning = '*') {
    const queryBuilder = this.table.update(data).returning(returning);

    if (id instanceof Object) {
      queryBuilder.where(id);
    } else {
      queryBuilder.where({ id });
    }

    let result;
    if (!transaction) {
      result = await knex.transaction(async (trx) => {
        return await queryBuilder.transacting(trx);
      });
    } else {
      result = await queryBuilder.transacting(transaction);
    }
    return result;
  }

  static async findBy(query, transaction, distinct) {
    const queryBuilder = this.view.modify(Builder.where, query);

    if (this.relations) {
      for (const relation of this.relations) {
        queryBuilder.modify(Builder.join, relation);
      }
    }

    let result;

    if (distinct) {
      queryBuilder.distinctOn(distinct);
    }

    if (!transaction) {
      result = await knex.transaction(async (trx) => {
        return await queryBuilder
          .transacting(trx)
          .select(this.selectableProps || '*');
      });
    } else {
      result = await queryBuilder
        .transacting(transaction)
        .select(this.selectableProps || '*');
    }

    return result;
  }

  static async list(page, limit, search, order) {
    const list = await knex.transaction(async (trx) => {
      const queryBuilder = this.view.transacting(trx);

      if (page) {
        queryBuilder.modify(Builder.nextPage, page);
      }

      if (search) {
        queryBuilder.modify(Builder.search, search);
      }

      if (order || this.resultOrder) {
        queryBuilder.modify(Builder.orderBy, order || this.resultOrder);
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
