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

  retrieveAssignmentGrade(id_assignment, (error, grades) => {
    res.json(grades);
  })
})
