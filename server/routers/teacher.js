const express = require('express');
const router = express.Router();
const pg = require('../../psql-database');
const bodyParser = require('body-parser');
const services = require('../../services');
const Promise = require('bluebird');

const ensureAuthorized = services.ensureAuth;

router.use(bodyParser.json());

router.get('/classes', ensureAuthorized, (req, res) => {
    pg.retrieveTeacherClasses(req.decoded.id, (err, classes) => {
        if (err) res.end(err);
        res.json(classes);
    });
});


// EXPECTED REQ.BODY
// {
//   name: name,
//   classId: class id
// }

// ME: TEACHER CREATES ASSIGNMENT FOR ENTIRE CLASS
router.post('/class/addAssignment', ensureAuthorized, (req, res) => {
    // Teacher creates an assignment for an entire class.
    pg.insertAssignment(req.body, assignment => {
        res.end(JSON.stringify(assignment));
    });
});

router.post('/class/addStudentToClass', ensureAuthorized, (req, res) => {

  pg.checkIfStudentExists(req.body.studentData.firstName, req.body.studentData.lastName)
  .then((student) => {
    if (student) {
      return student;
    } else {
      return pg.insertStudent(req.body.studentData);
    }
  })
  .then((student) => {
    return pg.insertClassStudent(req.body.classId, student.id);
  })
  .then((classStudent) => {
    var obj = {
      id: classStudent.id,
      F_Name: req.body.studentData.firstName,
      L_Name: req.body.studentData.lastName,
      grades: []
    };
    console.log('this is the class student', classStudent);
    res.end(JSON.stringify(obj));
  });
}); 

router.post('/class/addGrade', ensureAuthorized, (req, res) => {
    req.body.student_id = 1;
    req.body.id_assignment = 1;
    pg.insertGrade(req.body)
        .then((grade) => {
            res.end(grade);
        });
});

router.post('/addClass', ensureAuthorized, (req, res) => {
    req.body.userId = req.decoded.id;
    pg.insertClass(req.body, (err, insertedClass) => {
        if (err) res.end(err);
        res.end(JSON.stringify(insertedClass));
    });
});

router.get('/class', ensureAuthorized, (req, res) => {
    var classId = req.query.classId;
    var classStudentsGrades = [];
    var classAssignments = [];
    var classStudents = [];

    var retrieveSelectedClassStudentsAsync = Promise.promisify(pg.retrieveSelectedClassStudents);

    retrieveSelectedClassStudentsAsync(classId)
        .then(students => {
            for (var i = 0; i < students.models.length; i++) {
                pg.selectStudent(students.models[i].attributes.id_student, (error, student) => {
                    if (error) {
                        console.log('SELECT STUDENT ERROR: ', error);
                    } else {
                        classStudents.push(student.attributes)
                        if (classStudents.length === students.models.length) {
                            for (var k = 0; k < classStudents.length; k++) {
                                pg.retrieveStudentWithGrades(classStudents[k], (error, student) => {
                                    if (error) {
                                        console.log('ERROR RETRIEVE STUDENT WITH GRADES: ', error);
                                    } else {
                                        student.attributes.grades = [];
                                        for (var b = 0; b < student.relations.grades.models.length; b++) {
                                            student.attributes.grades.push(student.relations.grades.models[b].attributes);
                                            if (student.attributes.grades.length === student.relations.grades.models.length) {
                                                classStudentsGrades.push(student.attributes.grades);
                                                if (classStudentsGrades.length === classStudents.length) {
                                                    for (var w = 0; w < classStudents.length; w++) {
                                                        classStudents[w].grades = [];
                                                        classStudents[w].grades.push(classStudentsGrades[w]);
                                                        if (w === classStudents.length - 1) {
                                                            console.log('STUDENTS WITH GRADES: ', classStudents[0].grades);
                                                            pg.retrieveClassAssignments(classId, (error, assignments) => {
                                                                console.log(assignments.models[0].attributes)
                                                                for (var u = 0; u < assignments.models.length; u++) {
                                                                    classAssignments.push(assignments.models[u].attributes);
                                                                    if (classAssignments.length === assignments.models.length) {
                                                                        res.json({ students: classStudents, assignments: classAssignments });
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                })
            }
        })
        .catch(error => {
            console.log('ERROR WITH GET /class : ', error)
        })
});


module.exports = router;
