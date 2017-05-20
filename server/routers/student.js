const express = require('express');
const router = express.Router();
const pg = require('../../psql-database');
const bodyParser = require('body-parser');
const services = require('../../services');
const Promise = require('bluebird');

const ensureAuthorized = services.ensureAuth;

router.use(bodyParser.json());

router.get('', ensureAuthorized, (req, res) => {
  var userId = req.decoded.id;

  var retrieveSelectedUsersStudentsAsync = Promise.promisify(pg.retrieveSelectedUsersStudents);
  var selectStudentAsync = Promise.promisify(pg.selectStudent);

  retrieveSelectedUsersStudentsAsync(userId)
    .then(userStudentEntry => {
      return selectStudentAsync(userStudentEntry.models[0].attributes.id_student) 
    })
    .then(student => {
        res.json(student.attributes);
    })  
    .catch(error => {
      res.sendStatus(500);
    })
});

router.get('/classes', ensureAuthorized, (req, res) => {
  var userId = req.decoded.id;
  var studentId = req.query.studentId;

  var retrieveStudentClassesAsync = Promise.promisify(pg.retrieveStudentClasses);
  var retrieveClassAsync = Promise.promisify(pg.retrieveClass);

  retrieveStudentClassesAsync(studentId)
    .then(studentClasses => {
      console.log('STUDENT CLASSES: ', studentClasses.models[0].attributes.id_class);
      return retrieveClassAsync(studentClasses.models[0].attributes.id_class)
    })
    .then(classInfo => {
      res.json(classInfo.attributes);
    })
    .catch(error => {
      res.sendStatus(500);
    })
})


router.get('/classDetail', ensureAuthorized, (req, res) => {
  var specificStudentGrades = [];
  var allAssignmentsGrades = [];
  var classAssignments = [];
  var classId = req.query.classId;
  var studentId = req.query.studentId;
  // console.log('CLASS ID: ', classId);
  // console.log('STUDENT ID: ', studentId);

  var retrieveClassAssignmentsAsync = Promise.promisify(pg.retrieveClassAssignments);
  var retrieveAssignmentGradeAsync = Promise.promisify(pg.retrieveAssignmentGrade);
  var retrieveStudentAssignmentGradeAsync = Promise.promisify(pg.retrieveStudentAssignmentGrade);

  retrieveClassAssignmentsAsync(classId)
    .then(assignments => {
      // console.log('\nASSIGNMENTS 1: ', assignments.models); 
      for (var i = 0; i < assignments.models.length; i++) {
        classAssignments.push(assignments.models[i].attributes);
        if (classAssignments.length === assignments.models.length) {
          return classAssignments;
        }
      }
    })
    .then(assignments => {
      for (var i = 0; i < assignments.length; i++) {

        pg.retrieveAssignmentGrade(classAssignments[i].id, (error, grade) => {
          if (error) {
            // console.log('RETRIEVE ASSIGNMENT GRADE ERROR: ', error);
          } else {
          // console.log('\nGRADE 1: ', grade.models);
            var assignmentGrades = [];
            for (var k = 0; k < grade.models.length; k++) {
              // console.log('\nGRADE MODEL: ', grade.models[k].attributes)
              assignmentGrades.push(grade.models[k].attributes);
              if (assignmentGrades.length === grade.models.length) {
                // console.log('\nASSIGNMENT GRADES: ', assignmentGrades);
                allAssignmentsGrades.push(assignmentGrades);
              }
            }
            // it's skipping down immediately !!! why?
            if (allAssignmentsGrades.length === classAssignments.length) {
              // console.log('\nALL ASSIGNMENTS GRADES: ', allAssignmentsGrades);
              for (var i = 0; i < allAssignmentsGrades.length; i++) {
                classAssignments[i].allGrades = allAssignmentsGrades[i];
                
                if (i === classAssignments.length -1) {
                  // console.log('CLASS ASSIGNMENTS: ', classAssignments)
                  for (var p = 0; p < classAssignments.length; p++) {
                    pg.retrieveStudentAssignmentGrade(classAssignments[p].id, studentId, (error, grade) => {
                      // console.log('\nGRADE 2: ', grade);
                      specificStudentGrades.push(grade.models[0].attributes);

                      if (specificStudentGrades.length === classAssignments.length) {
                        res.json([specificStudentGrades, classAssignments]);
                      }
                    })
                  }
                }
              }
            }
          }
        })
      }
    })
    .catch(error => {
      console.log('CLASS DETAIL - RETRIEVE CLASS ASSIGNMENTS ERROR: ', error)
      res.sendStatus(500);
    })
})

// router.get('/students', ensureAuthorized, (req, res) => {
//   // Parents fetch the list of their students
//   // check which user_id is currently logged in.
//   const id_user = req.decoded.id;

//   // with the id_user, find all students associated with that user.

//   // Promisify retrieveSelectedUsersStudents
//   const retrieveUsersStudents = Promise.promisify(pg.retrieveSelectedUsersStudents);

//   // Promisify selectStudent.
//   const selectStudent = Promise.promisify(pg.selectStudent);

//   retrieveUsersStudents(id_user)

// })

module.exports = router;