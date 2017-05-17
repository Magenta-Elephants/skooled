const bookshelf = require('../bookshelf.js');

const ClassStudent = bookshelf.Model.extend({
  tableName: 'class_students'
});

module.exports = bookshelf.model('ClassStudent', ClassStudent);