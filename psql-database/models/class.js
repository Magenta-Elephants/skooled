const bookshelf = require('../bookshelf.js');

const Class = bookshelf.Model.extend({
  tableName: 'classes',
  users: () => {
    return this.belongsToMany(User);
  }
})

module.exports = bookshelf.model('Class', Class);