// module.exports.up = function (knex, Promise) {
module.exports = function (knex, Promise) {

  knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('email', 80).unique();
        table.string('password', 60);
        table.string('first_name', 80);
        table.string('last_name', 80);
        table.string('phone_number', 20);
        table.string('role', 20);
      }).catch((error) => {
        console.log('users database error:', error);
      });
    }
  })

  knex.schema.hasTable('students').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('students', (table) => {
        table.increments('id');
        table.string('first_name', 80);
        table.string('last_name', 80);
        table.integer('id_class').references('classes.id');
      }).catch((error) => {
        console.log('students database error:', error);
      });
    }
  });

  knex.schema.hasTable('users_students').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('users_students', (table) => {
        table.increments('id');
        table.integer('id_user').references('users.id');
        table.integer('id_student').references('students.id');
      }).catch((error) => {
          console.log('users_students database error:', error);
      });
    }
  });

  knex.schema.hasTable('documents').then(exists => {
    if (!exists) {
      return knex.schema.createTable('documents', (table) => {
        table.increments('id');
        table.string('title', 250);
        table.string('body', 10000);
        table.boolean('permissioned', false);
        table.integer('id_student').references('students.id');
        table.string('first_name_student');
        table.string('last_name_student');
        table.integer('id_classes').references('classes.id');
      }).catch((error) => {
        console.log('documents database error:', error);
      });
    }
  });

  knex.schema.hasTable('grades').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('grades', (table) => {
        table.increments('id');
        table.integer('id_assignment').references('assignments.id');
        table.integer('id_student').references('students.id');
        table.string('grade', 250);
    }).catch((error) => {
      console.log('grades database error:', error)
    })
    }
  });

  knex.schema.hasTable('assignments').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('assignments', (table) => {
        table.increments('id');
        table.string('name', 250);
        table.integer('id_class').references('classes.id');
    }).catch((error) => {
      console.log('assignments database error:', error)
    })
    }
  });

  knex.schema.hasTable('classes').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('classes', (table) => {
        table.increments('id');
        table.string('name', 250);
        table.string('description', 1000);
        table.integer('id_user').references('users.id')
    }).catch((error) => {
      console.log('classes database error:', error)
    })
    }
  });

  knex.schema.hasTable('class_students').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('class_students', (table) => {
        table.increments('id');
        table.integer('id_class').references('classes.id');
        table.integer('id_student').references('students.id');
    }).catch((error) => {
      console.log('class_students database error:', error)
    })
    }
  });
};

// module.exports.down = function (knex, Promise) {
//   knex.schema.raw('DROP TABLE IF EXISTS users, students, users_students CASCADE');
// };