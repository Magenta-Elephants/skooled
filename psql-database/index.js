const User = require('./models/user.js');
const Student = require('./models/student.js');
const UserStudent = require('./models/user_student.js');
const Document = require('./models/document.js')
const services = require('../services');

module.exports = {
  // ADMIN PAGE: ADD USER
  insertUser : (user, callback) => {
    services.createHashPassword(user.password)
    .then((hash) => {
      User.forge({
        email: user.email,
        password: hash,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phone,
        role: user.role
      }).save().then(function(user) {
        callback(null, user);
      }).catch(function(err) {
        callback(err, null);
      });
    }).catch((err) => {
      if (err) console.log('hash password error:', err);
    });
  },

  // LOGIN PAGE: GET USER BY EMAIL
  selectUser : (user, callback) => {
    User.forge({email: user.email})
    .fetch({require: true})
    .then(function (user) {
      callback(null, user);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  selectUserById : (userId, callback) => {
    User.forge({id: userId})
    .fetch({require: true})
    .then(function (user) {
      callback(null, user);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  // ADMIN PAGE: ADD STUDENT
  insertStudent : (student, callback) => {
    Student.forge({
      first_name: student.firstName,
      last_name: student.lastName
    }).save()
    .then(function(student) {
      callback(null, student);

    })
    .catch(function(err) {
      callback(err, null);
    });
  },

  // ADMIN PAGE: SET STUDENT RELATION (TEACHER OR PARENT)
  insertUserStudent : (id_user, student_id) => {
    UserStudent.forge({
      id_user: id_user,
      id_student: student_id
    }).save()
    .then(function(student) {
      console.log('SUCCESSFUL INSERT IN JOIN TABLE:', student);
    })
    .catch(function(err) {
      console.log('ERROR WITH INSERT IN JOIN TABLE:', err);
    });
  },

  // ADMIN PAGE: GET ALL STUDENTS
  selectAllStudents : (user, callback) => {
    Student.collection().fetch()
    .then(function(students) {
      callback(null, students);
    }).catch(function(err) {
      callback(err, null);
    });
  },

  selectStudent : (id_student, callback) => {
    Student.forge({id: id_student})
    .fetch({required: true})
    .then(student => {
      callback(null, student);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  // DOC PAGE: GET SELECTED STUDENTS
  retrieveSelectedUsersStudents : (id_user, callback) => {
    UserStudent.forge()
    .query('where', {id_user: id_user})
    .fetchAll({require: true})
    .then(userStudentEntry => {
      callback(null, userStudentEntry);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  insertDocument : (doc, callback) => {
    Document.forge({
      title: doc.title,
      body: doc.body,
      id_student: doc.studentId,
      first_name_student: doc.studentFirstName,
      last_name_student: doc.studentLastName
    })
    .save()
    .then(doc => {
      console.log('SUCCESSFUL INSERT IN DOCUMENTS TABLE:', doc);
      callback(null, doc);
    })
    .catch(error => {
      console.log('ERROR WITH INSERT IN DOCUMENTS TABLE:', error);
      callback(error, null);
    });
  },

  selectApplicableDocuments : (id_student, callback) => {
    // Selects all applicable documents depending on the student_ids for each document.
    Document.forge()
    .query('where', {id_student: id_student})
    .fetchAll({require: true})
    .then(documentEntry => {
      callback(null, documentEntry)
    })
    .catch(error => {
      callback(error, null);
    });
    // Must refer to the users_students join table for reference the user_id to get the relevant student_id.

    // Then select only the documents where the student_id matches that retrieved from the join table.
  },

  selectAllDocuments : (callback) => {
    Document.collection
    .fetch()
    .then(documents => {
      callback(null, documents);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  updatePermission : (returnedDoc, callback) => {
    Document
    .forge({id: returnedDoc.docId})
    .save({permissioned: returnedDoc.permissioned})
    .then(doc => {
      console.log('SUCCESSFUL UPDATE OF DOCUMENT PERMISSION STATUS:', doc);
      callback(null, doc);
    })
    .catch(error => {
      console.log('ERROR UPDATING DOCUMENT PERMISSION STATUS', error);
      callback(error, null);
    })
  }

};

/*
USE DATABASE COMMAND BELOW TO CLEAR ALL TABLES...
DROP TABLE IF EXISTS users, students, users_students CASCADE;
*/


/*
// ADMIN PAGE: DELETE USER BY EMAIL
User.forge({email: 'abc123@example.com'})
.fetch({require: true})
.then(function (category) {
  category.destroy()
  .then(function () {
    console.log('Category successfully deleted');
  })
  .catch(function (err) {
    console.log('message:', err.message);
  });
})
.catch(function (err) {
  console.log('message:', err.message);
});
// ADMIN PAGE: ADD STUDENT
Student.forge({
  first_name: 'Jimmy',
  last_name: 'John'
}).save().then(function(newRow) {
  console.log(newRow.id); // Returns ID of new row
}).catch(function(err) {
  console.log(err);
});
// ADMIN PAGE: GET ALL USERS
User.collection().fetch().then(function(users) {
   console.log(JSON.stringify(users)); // collection of users
});
// ADMIN PAGE: GET ALL STUDENTS
Student.collection().fetch().then(function(users) {
   console.log(JSON.stringify(users)); // collection of users
});
// ADMIN PAGE: DELETE USER BY ID
User.forge({id: 1}).fetch().then(function (item) {
  return item.destroy().then(function () {
      console.log('destroyed!');
    });
});
// ADMIN PAGE: DELETE STUDENT BY ID
Student.forge({id: 1}).fetch().then(function (item) {
  return item.destroy().then(function () {
      console.log('destroyed!');
    });
});
*/