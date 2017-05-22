var express = require('express');
var bodyParser = require('body-parser');
var pg = require('../psql-database');
var services = require('../services');
var home = require('./routers/admin');
var admin = require('./routers/admin');
var doc = require('./routers/document');
var video = require('./routers/video');
var teacher = require('./routers/teacher');
var students = require('./routers/student');

var ensureAuthorized = services.ensureAuth;
var createToken = services.createToken;

var app = express();

app.use('/teacher', teacher);
app.use('/admin', admin);
app.use('/doc', doc);
app.use('/video', video);
app.use('/students', students);
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());


// Shows how secured paths works and get executed when the user enters the website the first time
app.get('/checkOnClientLoad', ensureAuthorized, (req, res) => {
  pg.selectUserById(req.decoded.id, (error, data) => {
    if (error) {
      res.json({userid: req.decoded.id});
    } else {
      let user = {
        userid: req.decoded.id,
        userRole: data.attributes.role,
        firstName: data.attributes.first_name
      };
      res.json(user);
    }
  });
});

// ------------ STEP 1
// COMMENT OUT ALL OTHER STEPS --- MAKE SURE TO BE WORKING ON A FRESH DATABASE

// pg.insertUser({
//   email: '123abc@example.com',
//   password: '123',
//   firstName: 'John',
//   lastName: 'Doe',
//   phone: '18001234567',
//   role: 'teacher'
// }, (error, data) => {
//   if (error) {
//     console.error('Error inserting fake user.', error);
//   } else {
//     console.log('Inserted fake user ok.', data);
//   }
// });

// pg.insertStudent({
//   firstName: 'Ali',
//   lastName: 'Elgiadi'
// }, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(data);
//   }
// });

// pg.insertStudent({
//   firstName: 'Oliver',
//   lastName: 'Ullman'
// }, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(data);
//   }
// });

// pg.insertStudent({
//   firstName: 'Michael',
//   lastName: 'Drew'
// }, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(data);
//   }
// });

//---------------------------------------- STEP 2
// COMMENT OUT ALL OTHER STEPS

// pg.insertClass({
//   name: 'Math',
//   description: 'Super Cool',
//   userId: 1
// }, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(data);
//   }
// });

// ----------------------------STEP 3
// COMMENT OUT ALL OTHER STEPS

// pg.insertClassStudent(1, 1);
// pg.insertClassStudent(1, 2);
// pg.insertClassStudent(1, 3);


// -------------------------STEP 4
// COMMENT OUT ALL OTHER STEPS

// pg.insertAssignment({
//   name: 'Adding',
//   classId: 1
// }, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(data);
//   }
// });

// pg.insertAssignment({
//   name: 'Subtraction',
//   classId: 1
// }, (error, data) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(data);
//   }
// });

// -----------------------STEP 5
// COMMENT OUT ALL OTHER STEPS

// pg.insertGrade({
//   id_assignment: 1,
//   student_id: 1,
//   grade: '98'
// });

// pg.insertGrade({
//   id_assignment: 1,
//   student_id: 2,
//   grade: '89'
// });

// pg.insertGrade({
//   id_assignment: 1,
//   student_id: 3,
//   grade: '27'
// });

// pg.insertGrade({
//   id_assignment: 2,
//   student_id: 1,
//   grade: '45'
// });

// pg.insertGrade({
//   id_assignment: 2,
//   student_id: 2,
//   grade: '34'
// });

// pg.insertGrade({
//   id_assignment: 2,
//   student_id: 3,
//   grade: '100'
// });

// ------DONE

app.post('/login', (req, res) => {
  let retrievedUser;
  pg.selectUser({email: req.body.username}, (error, data) => {
    if (error) {
      res.sendStatus(500);
      res.send(JSON.stringify(data));
    } else {
      services.checkHashPassword(req.body.password, data.attributes.password)
      .then((match) => {
        if (match) {
          var payload = {id: data.attributes.id};
          var token = createToken(payload);
          res.json({
            isLoggedIn: true,
            jwtToken: token,
            userRole: data.attributes.role,
            firstName: data.attributes.first_name
          });
        } else {
          res.json({isLoggedIn: false});
        }
      })
      .catch((err) => {
        if (err) console.log('password issue:', err);
      });
    }
  });
});

app.get('*', (req, res) => {
 res.redirect('/');
});

app.listen(process.env.PORT || 5000, function() {
  console.log('Listening on enviornment port or 5000!');
});