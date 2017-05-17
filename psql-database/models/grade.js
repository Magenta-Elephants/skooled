const bookshelf = require('../bookshelf.js');

const Grade = bookshelf.Model.extend({
  tableName: 'grades',
  users: () => {
    return this.belongsToMany(Assignment);
  }
})

module.exports = bookshelf.model('Grade', Grade);