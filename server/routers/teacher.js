const express = require('express');
const router = express.Router();
const pg = require('../../psql-database');
const bodyParser = require('body-parser');
const services = require('../../services');
const Promise = require('bluebird');

const ensureAuthorized = services.ensureAuth;

router.use(bodyParser.json());

router.get('/classes', ensureAuthorized, (req, res) => {
  pg.retrieveClasses({ id_user: req.decoded.id }, (err, classes) => {
    if (err) res.end(err);
    res.end(JSON.stringify(classes));
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
  var students = [
    { id: 1, 
      F_Name: 'Oliver',
      L_Name: 'Ullman',
      grades: [{
        Ass_Id: 2,
        Name: 'Math Shit',
        Grade: 81
      }, {
        Ass_Id: 0,
        Name: 'Reading Log',
        Grade: 81
      }]
    },
    { id: 8, 
      F_Name: 'Michael',
      L_Name: 'Shymershiem',
      grades: [{
        Ass_Id: 2,
        Name: 'Math Shit',
        Grade: 88
      }, {
        Ass_Id: 0,
        Name: 'Reading Log',
        Grade: 10
      }]
    },
    { id: 8, 
      F_Name: 'Ali',
      L_Name: 'Elgiadi',
      grades: [{
        Ass_Id: 2,
        Name: 'Math Shit',
        Grade: 91
      }, {
        Ass_Id: 0,
        Name: 'Reading Log',
        Grade: 69
      }]
    }
  ];

  var obj = {
    first_name: 'Oliver',
    last_name: 'Ullman'
  };

  var assignments = [
    {
      id: 4,
      Name: 'Math Shit',
      grades: [{
        F_Name: 'Oliver',
        L_Name: 'Ullman',
        Grade: 62
      }, {
        F_Name: 'Ali',
        L_Name: 'Elgiadi',
        Grade: 83
      }, {
        F_Name: 'Michael',
        L_Name: 'Shermershiem',
        Grade: 86
      }]
    },
    {
      id: 9,
      Name: 'Reading Log',
      grades: [{
        F_Name: 'Oliver',
        L_Name: 'Ullman',
        Grade: 74
      }, {
        F_Name: 'Ali',
        L_Name: 'Elgiadi',
        Grade: 24
      }, {
        F_Name: 'Michael',
        L_Name: 'Shermershiem',
        Grade: 96
      }]
    }
  ];
  // var obj = {};
  // pg.retrieveSelectedClassStudents(req['headers'].class_id, (students) => {
  //   console.log('these are the students', students);
  //   obj.students = students;
  //   if (obj.assignments) {
  //     res.end(JSON.stringify(students));
  //   }
  // });

  // pg.retreiveClassAssignments(req['headers'].class_id, (assignments) => {
  //   console.log('these are the assignments', assignments);
  //   obj.assignments = assignments;
  //   if (obj.students) {
  //     res.end(JSON.stringify(obj));
  //   }
  // });

  var obj = {
    students: students,
    assignments: assignments
  };
  res.end(JSON.stringify(obj));
});


module.exports = router;