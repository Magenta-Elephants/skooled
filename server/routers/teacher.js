const express = require('express');
const router = express.Router();
const pg = require('../../psql-database');
const bodyParser = require('body-parser');
const services = require('../../services');
const Promise = require('bluebird');

const ensureAuthorized = services.ensureAuth;

router.use(bodyParser.json());

router.get('/classes', ensureAuthorized, (req, res) => {
  var userId = req.decoded.id;

  var obj = [
    { id: 3, name: 'Economics 101'},
    { id: 5, name: 'Music Theory'},
    { id: 10, name: 'Art'}
  ];

  res.end(JSON.stringify(obj));
});

router.post('/class/addStudent', ensureAuthorized, (req, res) => {
  // will add a student to the database
  res.end(`added ${req.body.F_Name} ${req.body.L_Name} to the database`);
}); 

router.post('/class/addGrade', ensureAuthorized, (req, res) => {
  res.end(`added the assignment grade for the assignment id ${req.body.Ass_Id} with a grade of ${req.body.Grade} for student ${req.body.studentName} `);
});

router.post('/addClass', ensureAuthorized, (req, res) => {
  res.end(`added the class ${req.body.name} with a description of ${req.body.description} `)
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

  var obj = {
    students: students,
    assignments: assignments
  };
  res.end(JSON.stringify(obj));
});

module.exports = router;