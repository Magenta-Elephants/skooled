const bookshelf = require('../bookshelf.js');

const Assignment = bookshelf.Model.extend({
  tableName: 'assignments',
  users: () => {
    return this.belongsToMany(Class);
  }
})

module.exports = bookshelf.model('Assignment', Assignment);