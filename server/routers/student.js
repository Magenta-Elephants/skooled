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

  var obj = [
    { id: 2, name: 'Stacy'},
    { id: 4, name: 'TK'},
    { id: 7, name: 'Michael Denny'}
  ];

  res.send(obj);
});

router.get('/classes', ensureAuthorized, (req, res) => {
  var userId = req.decoded.id;

  var classes = [
    {
      id: 1,
      name: 'Reading',
      assignments: {
        1: 'Reading - Pop Quiz 1',
        2: 'Reading - Test1',
        3: 'Reading - Midterm',
        4: 'Reading - Final'
      },
      students: {
        2: 2
      }
    },
    {
      id: 2,
      name: 'Riting',
      assignments: {
        1: 'Riting - Pop Quiz 1',
        2: 'Riting - Test1',
        3: 'Riting - Midterm',
        4: 'Riting - Final'
      },
      students: {
        4: 4
      }
    },
    {
      id: 3,
      name: 'Rithmatic',
      assignments: {
        1: 'Rithmatic - Pop Quiz 1',
        2: 'Rithmatic - Test1',
        3: 'Rithmatic - Midterm',
        4: 'Rithmatic - Final'
      },
      students: {
        4: 4,
        7: 7
      }
    },
    {
      id: 3,
      name: 'Basket Weaving',
      assignments: {
        1: 'Not a Pop Quiz 1',
        2: 'Not a Test1',
        3: 'Not a Midterm',
        4: 'Not a Final'
      },
      students: {
        2: 2
      }
    }
  ];

  res.send(classes);
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