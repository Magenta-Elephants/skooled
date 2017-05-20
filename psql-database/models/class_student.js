const bookshelf = require('../bookshelf.js');

const ClassStudent = bookshelf.Model.extend({
  tableName: 'class_students',
  students: function() {
    return this.belongsTo('Student', 'id');
  }
});

module.exports = bookshelf.model('ClassStudent', ClassStudent);