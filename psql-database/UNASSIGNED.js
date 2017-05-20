const User = require('./models/user.js');
const Student = require('./models/student.js');
const UserStudent = require('./models/user_student.js');
const Document = require('./models/document.js')
const Grade = require('./models/grade.js');
const Assignment = require('./models/assignment.js');
const Class = require('./models/class.js');
const ClassStudent = require('./models/class_student.js');
const services = require('../services');

module.exports = {
  checkIfStudentExists : (first_name, last_name) => {
    return Student.forge({ first_name: first_name, last_name: last_name })
      .fetch()
      .then((student) => {
        console.log('there was no error', student);
        return student;
      })
      .catch((err) => {
        console.log('there was an error!', err)
      });
  },
}