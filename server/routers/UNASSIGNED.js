// EXPECTED REQ.BODY
// {
//   name: name,
//   classId: class id
// }

// ME: TEACHER CREATES ASSIGNMENT FOR ENTIRE CLASS
router.post('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {
  // Teacher creates an assignment for an entire class.
  pg.insertAssignment(req.body);
});

// EXPECTED REQ.BODY
// {
//   classId: class id
// }

// EXPECTED DATA WITHIN RESPONSE 
// [{
//   name: name,
//   id_class: class id,
//   created_at: time stamp
// }, ...]

// ME: PARENT LOOKING AT ASSIGNMENTS FOR A SPECIFIC CLASS
router.get('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {
  // Parents fetch the list of assignments for a specific class

  // Check which id_class is currently in use
  const id_class = req.body.classId;

  pg.retrieveClassAssignments(id_class, (error, data) => {
    if (error) {
      console.error('Error retrieving assignments for specific class');
      res.sendStatus(500).send(error);
    } else {
      res.send(data);
    }
  });

  // grab all assignments for a class
  // grab all students in a class
  // 
});

// EXPECTED REQ.BODY
// {
//   classId: class id
//   studentId: student id
// }

// EXPECTED DATA WITHIN RESPONSE 
// [{
//   id: id,
//   id_assignment: assignment id,
//   id_student: student id,
//   grade: grade
// }, ...]

// ME: PARENT LOOKING AT A SPECIFIC ASSIGNMENT GRADE
router.get('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {
  // Parents fetch the grades for each assignment associated with their student and class
  const id_class = req.body.classId;
  const id_student = req.body.studentId;

  // Promisify retrieveClassAssignments
  const retrieveClassAssignmentsAsync = Promise.promisify(pg.retrieveClassAssignments);

  // Promisify retrieveAssignmentGrade
  const retrieveStudentAssignmentGradeAsync = Promise.promisify(pg.retrieveStudentAssignmentGrade);

  // find what assignments are associated with the class
  retrieveClassAssignmentsAsync(id_class)
    .then(assignments => {
      allGrades = [];
      // find grades for each assignment for given student
      assignments.forEach(assignment => {
        retrieveStudentAssignmentGradeAsync(assignment.id, id_student, (error, data) => {
          allGrades.push(data)
        })  
      })
      res.json(allGrades);
    })
    .catch(error => {
      res.sendStatus(500).send(error);
    })
});

// EXPECTED REQ.BODY
// {
//   assignmentId: assignment id
// }

// EXPECTED DATA WITHIN RESPONSE 
// [{
//   id: id,
//   id_assignment: assignment id,
//   id_student: student id,
//   grade: grade
// }, ...]

// ME: TEACHER RETRIEVES ALL GRADES FOR A SPECIFIC ASSIGNMENT
router.get('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {
  // Teachers fetch entire class's grades for a specific assignment
  const id_assignment = req.body.assignmentId;

  pg.retrieveAssignmentGrade(id_assignment, (error, grades) => {
    res.json(grades);
  })
})

// EXPECTED DATA WITHIN RESPONSE 
// [{
//   id: class id,
//   name: class name,
//   description: class description,
//   id_user: teacher id
// }, ...]

// ME: RETRIEVE ALL CLASSES ASSOCIATED WITH TEACHER
router.get('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {
  const id_user = req.decode.id;

  retrieveTeacherClasses(id_user, (error, classes) => {
    res.json(classes);
  })
})

// EXPECTED REQ.BODY
// {
//   studentId: student id
// }

// EXPECTED DATA WITHIN RESPONSE 
// [{
//   id: id,
//   name: class name,
//   description: class description,
//   id_user: teacher id
// }, ...]

// ME: RETRIEVE ALL CLASSES ASSOCIATED WITH STUDENT
router.get('CHANGE_THIS_ROUTE', ensureAuthorized, (req, res) => {

  const id_student = req.body.id_student;

  const retrieveStudentClassesAsync = Promise.promisify(pg.retrieveStudentClasses);

  const retrieveClassAsync = Promise.promisify(pg.retrieveClass);

  retrieveStudentClassesAsync(id_student)
    .then(classes => { 
      var classList = [];

      for (var i = 0; i < classes.length; i++) {
        classList.push(pg.retrieveClass(classes[i].id_class));
        if (i === classes.length -1) {
          res.json(classList);
        }
      }
    })
    .catch(error => {
      res.sendStatus(500).send(error);
    })
}
