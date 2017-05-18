const express = require('express');
const router = express.Router();
const pg = require('../../psql-database');
const bodyParser = require('body-parser');
const services = require('../../services');
const Promise = require('bluebird');

const ensureAuthorized = services.ensureAuth;

router.use(express.static(__dirname + '/../../react-client/dist'));
router.use(bodyParser.json());



// {
//   title: title,
//   body: body,
//   classId: classId
// }

// ME: ONCE CLASSES ARE CREATED, USE THE BELOW POST REQUEST WITH THE ABOVE FORMAT IN REQ.BODY 
//  --------------------->

router.post('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {
  // Teacher creates a document for an activity.
  // Check which class_id is currently in use.

  // Get all student_id from db class_student table connected to current id_class.
  const id_class = req.body.classId;

  // Promisify retrieveSelectedUsersStudents.
  const retrieveSelectedClassStudentsAsync = Promise.promisify(pg.retrieveSelectedClassStudents);

  // Promisify selectStudent.
  const selectStudentAsync = Promise.promisify(pg.selectStudent);

  // Promisify insertDocument.
  const insertDocumentAsync = Promise.promisify(pg.insertDocument);

  retrieveSelectedClassStudentsAsync(id_class)
  .then(response => {
    // For each student create a new instance of doc in db, INCLUDING FOR STUDENT'S ID.
    // id  title  body  permissioned  student_id

    // Iterate through array of entries from class_student join table.
    response.models.forEach(classStudentsEntry => {
      // With each student id, get the full student's info from students table in db.
      const id_student = classStudentsEntry.attributes.id_student;
      selectStudentAsync(id_student)
      .then(studentInfo => {
        // Populate the document entry attributes by combining the req.body info with the studentInfo.
        const doc = {
          title: req.body.title,
          body: req.body.body,
          studentId: studentInfo.attributes.id,
          classId: req.body.classId
        };
        insertDocumentAsync(doc)
        .catch(error => {
          console.log('Error inserting doc for a specific student.')
        })
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        res.sendStatus(500).send(error);
      })
    });
  })
  .catch(error => {
    res.sendStatus(500).send(error);
  });
});

// ME: AND DELETE THE CURRENT ONE
// <----------------------

router.post('/documents', ensureAuthorized, (req, res) => {
  // Teacher creates a document for an activity.
  // Check which user_id is currently authorized/logged in.

  // Get all student_id from db users_students table connected to current id_user.
  const id_user = req.decoded.id;

  // Promisify retrieveSelectedUsersStudents.
  const retrieveSelectedUsersStudentsAsync = Promise.promisify(pg.retrieveSelectedUsersStudents);

  // Promisify selectStudent.
  const selectStudentAsync = Promise.promisify(pg.selectStudent);

  // Promisify insertDocument.
  const insertDocumentAsync = Promise.promisify(pg.insertDocument);

  retrieveSelectedUsersStudentsAsync(id_user)
  .then(response => {
    // For each student create a new instance of doc in db, INCLUDING FOR STUDENT'S ID.
    // id  title  body  permissioned  student_id

    // Iterate through array of entries from users_students join table.
    response.models.forEach(usersStudentsEntry => {
      // With each student id, get the full student's info from students table in db.
      const id_student = usersStudentsEntry.attributes.id_student;
      selectStudentAsync(id_student)
      .then(studentInfo => {
        // Populate the document entry attributes by combining the req.body info with the studentInfo.
        const doc = {
          title: req.body.title,
          body: req.body.body,
          studentId: studentInfo.attributes.id,
          studentFirstName: studentInfo.attributes.first_name,
          studentLastName: studentInfo.attributes.last_name
        };
        insertDocumentAsync(doc)
        .catch(error => {
          console.log('Error inserting doc for a specific student.')
        })
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        res.sendStatus(500);
      })
    });
  })
  .catch(error => {
    res.sendStatus(500).send(error);
  });
});

router.get('/documents', ensureAuthorized, (req, res) => {
  // Teachers and parents fetch the list of documents applicable to them based on their id.
  // Check which user_id is currently authorised/logged in.
  const id_user = req.decoded.id;

  // With the id_user, find all students associcated with that user.

  // Promisify retrieveSelectedUsersStudents.
  const retrieveSelectedUsersStudentsAsync = Promise.promisify(pg.retrieveSelectedUsersStudents);

  // Promisify selectApplicableDocuments.
  const selectApplicableDocumentsAsync = Promise.promisify(pg.selectApplicableDocuments);

  retrieveSelectedUsersStudentsAsync(id_user)
  .then(response => {
    return response.models.map(userStudentEntry => {
      return userStudentEntry.attributes.id_student;
    });
  })
  .then(studentIds => {
    // For each of these student ids, fetch all documents pertaining to them.
    let results = [];

    // Recursive function to gather up all documents array for a user, iterating through the associated student ids of that user. Look at join table.
    function syncFetchDocs(studentsIdArray) {
      let studentId = studentsIdArray.pop();
      pg.selectApplicableDocuments(studentId, (error, list) => {
        results = results.concat(list.models)
        if (studentIds.length) {
          return syncFetchDocs(studentsIdArray);
        } else {
          // For each object in the results array, extract the attributes.
          results = results.map(doc => {
            return doc.attributes;
          })
          res.json(results);
        }
      });
    }

    return syncFetchDocs(studentIds);
  })
  .catch(error => {
    res.sendStatus(500);
  });
});


router.put('/documents', ensureAuthorized, (req, res) => {
  // Parent updates the permission status of the document to the db.

  // Promisify updatePermission.
  const updatePermissionAsync = Promise.promisify(pg.updatePermission);
  updatePermissionAsync(req.body)
  .then(response => {
    res.sendStatus(200);
  })
  .catch(error => {
    res.sendStatus(500);
  });
});

module.exports = router;
