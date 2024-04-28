const knex = require('../../database');

class Builder {
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

  static orderBy(builder, resultOrder) {
    if (resultOrder instanceof Array) {
      for (const param of resultOrder) {
        builder.orderBy(param.column, param.direction);
      }
    } else {
      builder.orderBy(resultOrder.column, resultOrder.direction);
    }
  }

  static nextPage(builder, nextPage) {
    // use parameter binding for this next step
    builder.whereRaw(
      `(${nextPage[0].column}, ${nextPage[1].column}) < (?, ?)`,
      [nextPage[0].value, nextPage[1].value]
    );
  }

  static search(builder, search) {
    for (const [index, column] of search.columns.entries()) {
      if (index === 0) {
        if (column === 'search') {
          builder.whereRaw(
            `
            :column: @@ (
              websearch_to_tsquery(:query) ||
              websearch_to_tsquery('simple',:query) ||
              websearch_to_tsquery('english',:query)
            )
          `,
            { column: column, query: search.query }
          );
        } else {
          builder.whereILike(column, `%${search.query}%`);
        }
      } else {
        if (column === 'search') {
          builder.orWhereRaw(
            `
            :column: @@ (
              websearch_to_tsquery(:query) ||
              websearch_to_tsquery('simple',:query) ||
              websearch_to_tsquery('english',:query)
            )
          `,
            { column: column, query: search.query }
          );
        } else {
          builder.orWhereILike(column, `%${search.query}%`);
        }
      }
    }
  }
}

module.exports = Builder;
