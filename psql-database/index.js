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


  retrieveStudentWithGrades : (student, callback) => {
    Student.forge(student)
    .fetch({ required: true, withRelated: ['grades'] })
    .then((student) => {
      callback(null, student);
      // console.log('this is the student', student);
    })
    .catch((err) => {
      callback(err, null);
      console.log('there was an error!', err);
    });
  },

  // ADMIN PAGE: ADD STUDENT
  insertStudent : (student) => {
    return Student.forge({
      first_name: student.firstName,
      last_name: student.lastName
    }).save()
    .then(function(student) {
      return null, student;
    })
    .catch(function(err) {
      return err, null;
    });
  },

  // ADMIN PAGE: SET STUDENT RELATION (TEACHER OR PARENT)
  insertUserStudent : (id_user, student_id) => {
    UserStudent.forge({
      id_user: id_user,
      id_student: student_id
    }).save()
    .then(function(student) {
      console.log('SUCCESSFUL INSERT IN USER_STUDENT TABLE:', student);
    })
    .catch(function(err) {
      console.log('ERROR WITH INSERT IN USER_STUDENT TABLE:', err);
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
    Student.forge()
    .query('where', {id: id_student})
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
  // ME: DOCUMENTS DB WAS CHANGED AND SO WAS INSERT DOCUMENT
  insertDocument : (doc, callback) => {
    Document.forge({
      title: doc.title,
      body: doc.body,
      id_student: doc.studentId,
      // commented out until class data can be passed in through doc.
      // id_class: doc.classId
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
  },

  // ME: TEACHER CLASSES PAGE: ADD CLASS
  insertClass : (data, callback) => {
    Class.forge({
      name: data.name,
      description: data.description,
      id_user: data.userId
    })
      .save()
      .then(data => {
        console.log('SUCCESSFUL INSERT INTO CLASS TABLE: ', data);
        callback(null, data);
      })
      .catch(error => {
        console.log('ERROR WITH INSERT IN CLASS TABLE:', error);
        callback(error, null);
      });
  },

  // ME: GET ALL CLASSES ASSOCIATED WITH A STUDENT
  retrieveStudentClasses : (id_student, callback) => {
    console.log('student id: ', id_student)
    ClassStudent.forge()
      .query('where', {id_student: id_student})
      .fetchAll({required: true})
      .then(studentClasses => {
        console.log('students classes: ', studentClasses)
        callback(null, studentClasses);
      })
      .catch(error => {
        callback(error, null);
      })
  },

  retrieveClasses : (data, callback) => {
    Class.forge()
      .query('where', { id_user: data.id_user })
      .fetchAll({ require: true })
      .then(results => {
        callback(null, results);
      })
      .catch(err => {
        callback(err, null);
      })
  },

  // ME: RETRIEVE SPECIFIC CLASS
  retrieveClass : (id_class, callback) => {
    Class.forge()
      .query('where', {id: id_class})
      .fetchAll({required: true})
      .then(classes => {
        callback(null, classes);
      })
      .catch(error => {
        callback(error, null);
      })
  },

  // ME: GET ALL CLASSES ASSOCIATED WITH A TEACHER
  retrieveTeacherClasses : (id_user, callback) => {
    Class.forge()
      .query('where', {id_user: id_user})
      .fetchAll({required: true})
      .then(teacherClasses => {
        callback(null, teacherClasses);
      })
      .catch(error => {
        callback(error, null);
      })
  },

  // ME: GET ALL THE STUDENTS IN A GIVEN CLASS
  retrieveSelectedClassStudents : (id_class, callback) => {
    ClassStudent.forge()
      .query('where', {id_class: id_class})
      .fetchAll({required: true})
      .then(classStudentEntry => {
        callback(null, classStudentEntry);
      })
      .catch(error => {
        console.log('there was an error', error);
        callback(error, null);
      });
  },

  retrieveGradesForStudent : (studentId, cb) => {
    return Grade.forge()
    .query('where', {student_id: studentId})
    .fetchAll({required: true})
    .then(grades => {
      return grades;
    });
  },

  // ME: ADD A STUDENT TO A GIVEN CLASS
  insertClassStudent : (id_class, student_id) => {
    return ClassStudent.forge({
      id_class: id_class,
      id_student: student_id
    }).save()
    .then(function(student) {
      console.log('SUCCESSFUL INSERT IN CLASS_STUDENT TABLE:', student);
      return student;
    })
    .catch(function(err) {
      console.log('ERROR WITH INSERT IN CLASS_STUDENT TABLE:', err);
    });
  },

  // ME: ADD ASSIGNMENT TO A GIVEN CLASS
  insertAssignment : (assignment, callback) => {
    Assignment.forge({
      name: assignment.name,
      id_class: assignment.classId
    })
    .save()
    .then(assignment => {
      console.log('SUCCESSFUL INSERT INTO ASSIGNMENT TABLE', assignment);
      callback(null, assignment);
    })
    .catch(error => {
      console.log('ERROR WITH INSERT INTO ASSIGNMENT TABLE', error);
      callback(error, null);
    })
  },

  // ME: FETCH ALL ASSIGNMENTS FOR A GIVEN CLASS 
  retrieveClassAssignments : (id_class, callback) => {
    Assignment.forge()
      .query('where', {id_class: id_class})
      .fetchAll({required: true})
      .then(assignments => {
        callback(null, assignments);
      })
      .catch(error => {
        callback(error, null);
      })
  },
  
  // ME: FETCH GRADE FOR A SPECIFIC ASSIGNMENT AND STUDENT
  retrieveStudentAssignmentGrade : (id_assignment, id_student, callback) => {
    Grade.forge()
      .query({where: {id_assignment: id_assignment}, andWhere: {student_id: id_student}})
      .fetchAll({required: true})
      .then(grades => {
        // console.log('got to the right one!!', grades)
        callback(null, grades);
      })
      .catch(error => {
        callback(error, null);
      })
  },

  // ME: FETCH GRADE FOR A SPECIFIC ASSIGNMENT
  retrieveAssignmentGrade : (id_assignment, callback) => {
    Grade.forge()
      .query('where', {id_assignment: id_assignment})
      .fetchAll({required: true})
      .then(grades => {
        callback(null, grades);
      })
      .catch(error => {
        callback(error, null);
      })
  },

  insertGrade : (grade) => {
    return Grade.forge(grade)
    .save()
    .then(grade => {
      return grade;
    })
    .then(err => {
      console.log('there was an error', err);
    });
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
