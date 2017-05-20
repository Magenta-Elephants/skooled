var bookshelf = require('../bookshelf.js');

var Student = bookshelf.Model.extend({
  tableName: 'students',
  users: () => {
    return this.belongsToMany(User);
  },
  grades: function() {
    return this.hasMany('Grade');
  },
  class_students: function() {
    return this.hasMany('classstudent');
  }
});

module.exports = bookshelf.model('Student', Student);