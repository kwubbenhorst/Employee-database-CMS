//Import connection object with anonymized credentials from the connection.js file to connect to  db
const connection = require('../connection');  

//Function to get all departments. Departments will display alphabetically as in the mock up
function getAllDepartments() {
  return connection.promise()
    .query('SELECT * FROM department ORDER BY name')
    .then(([rows]) => {
      console.table(rows);
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}

//Function to add a department. Uses inquirer to gather the name input. Uses a prepared statement as a placeholder for the user-defined input
function addDepartment() { 
  inquirer
    .prompt({
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of the department?',
      validate: (input) => {
        if (input.trim() === '') {
          return 'Please enter a valid department name.';
        }
        return true;
      },
    })
    .then((answers) => {
      const departmentName = answers.departmentName;

      connection.promise()
        .query('INSERT INTO department (name) VALUES (?)', [departmentName])
        .then(() => {
          console.log(`Added ${departmentName} to the database.`);
          displayMainOptions();
        })
        .catch((error) => {
          console.error('Error:', error);
          displayMainOptions();
        });
    })
    .catch((error) => {
      console.error('Error in the outer then block:', error);
      displayMainOptions();  
    });
}


//Function to delete a department
function deleteDepartment() {
  return connection.promise()
    .query('SELECT id, name FROM department')
    .then(([departments]) => {
      return inquirer.prompt({
        type: 'list',
        name: 'department_id',
        message: 'Which department do you want to delete?',
        choices: departments.map((department) => ({ name: department.name, value: department.id })),
      });
    })
    .then((answers) => {
      const department_id = answers.department_id;
      return connection.promise().query('DELETE FROM department WHERE id = ?', [department_id]);
    })
    .then(() => {
      console.log('Department deleted successfully.');
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}

//Function to get all employees, rendering department by name rather than department id and manager by name rather than department id. Salary is also included.
function getAllEmployees() {
  return connection.promise()
    .query(`
      SELECT 
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title as title,
        department.name as department,
        roles.salary,
        IFNULL(manager.manager_id, 'Null') AS manager
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN department ON roles.department_id = department.id
      LEFT JOIN employees ON employees.manager_id = manager.id
    `)
    .then(([rows]) => {
      console.table(rows);
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Function to add an employee. Uses inquirer to collect four pieces of user-supplied data. Uses two promises managerPromise and rolePromise to handle asynchronous tasks of looking up the manager's role and role id based on user input. If user selects "None" Promise.result(null) is used to handle that case. Promise.all resolves with both managerPromise and rolePromise are finished and inserts employee data into the database.
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: (input) => {
          if (input.trim() === '') {
            return "Please enter a valid employee's first name.";
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: (input) => {
          if (input.trim() === '') {
            return "Please enter a valid employee's last name.";
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: () => {
          return connection
            .promise()
            .query('SELECT title FROM role')
            .then(([roles]) => roles.map((role) => role.title));
        },
      },
      {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: () => {
          return connection
            .promise()
            .query('SELECT CONCAT(first_name, " ", last_name) AS manager FROM employee WHERE CONCAT(first_name, " ", last_name) != ?',
            [`${answers.first_name} ${answers.last_name}`])
            .then(([managers]) => managers.map((manager) => manager.manager));
        },
      }
    ])
    .then((answers) => {
      const { firstName, lastName, role, manager } = answers;

      connection
        .promise()
        .query('SELECT id FROM role WHERE title = ?', [role])
        .then(([roleResult]) => {
          const roleId = roleResult[0].id;

          // Handle the case when 'None' is selected as manager. This is a ternary operator (? :) that checks a condition. If the condition is true, it resolves a promise with null using Promise.resolve(null). If the condition is false, it continues with the alternative value or promise.
          const managerIdPromise =
            manager === 'None'
              ? Promise.resolve(null)
              : connection
                  .promise()
                  .query('SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?', [manager])
                  .then(([managerResult]) => managerResult[0].id);

          managerIdPromise
            .then((managerId) => {
              connection
                .promise()
                .query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
                  firstName,
                  lastName,
                  roleId,
                  managerId,
                ])
                .then(() => {
                  console.log(`Added ${firstName} ${lastName} to the database.`);
                  displayMainOptions();
                })
                .catch((error) => {
                  console.error('Error:', error);
                  displayMainOptions();
                });
            })
            .catch((error) => {
              console.error('Error:', error);
              displayMainOptions();
            });
        })
        .catch((error) => {
          console.error('Error:', error);
          displayMainOptions();
        });
    });
}


//Function to delete an employee
function deleteEmployee() {
  return connection.promise()
    .query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee')
    .then(([employees]) => {
      return inquirer.prompt({
        type: 'list',
        name: 'employee_id',
        message: 'Which employee do you want to delete?',
        choices: employees.map((employee) => ({ name: employee.employee_name, value: employee.id })),
      });
    })
    .then((answers) => {
      const employee_id = answers.employee_id;
      return connection.promise().query('DELETE FROM employee WHERE id = ?', [employee_id]);
    })
    .then(() => {
      console.log('Employee deleted successfully.');
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}

//Function to get all roles, with department names listed explicitly, not just the department_id reference
function getAllRoles() {
  return connection.promise()
    .query(`
      SELECT roles.id, roles.title, roles.salary, department.name AS department
      FROM roles
      JOIN department ON roles.department_id = department.id
    `)
    .then(([rows]) => {
      console.table(rows);
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Function to add a role. Uses inquirer to collect three pieces of user-supplied data and chains promises to ensure they are handled in order. ParseFloat ensures the inputted string for salary is converted to a number as DECIMAL is the SQL data type required for salary. the map method to iterate over the array of departments to look for a match between the user input and an existing name value in the department table.
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?',
        validate: (input) => {
          if (input.trim() === '') {
            return 'Please enter a valid role name.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
        validate: (input) => {
          if (isNaN(input) || input.trim() === '') {
            return 'Please enter a valid salary (numeric value).';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: () => {
          return connection
            .promise()
            .query('SELECT name FROM department')
            .then(([departments]) => departments.map((department) => department.name));
        },
      },
    ])
    .then((answers) => {
      const { title, salary, department } = answers;

      connection
        .promise()
        .query('SELECT id FROM department WHERE name = ?', [department])
        .then(([result]) => {
          const departmentId = result[0].id;

          connection
            .promise()
            .query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [
              title,
              parseFloat(salary),
              departmentId,
            ])
            .then(() => {
              console.log(`Added ${title} to the database.`);
              displayMainOptions();
            })
            .catch((error) => {
              console.error('Error:', error);
              displayMainOptions();
            });
        })
        .catch((error) => {
          console.error('Error:', error);
          displayMainOptions();
        });
    });
}

//Function to delete a role
function deleteRole() {
  return connection.promise()
    .query('SELECT id, title FROM role')
    .then(([roles]) => {
      return inquirer.prompt({
        type: 'list',
        name: 'role_id',
        message: 'Which role do you want to delete?',
        choices: roles.map((role) => ({ name: role.title, value: role.id })),
      });
    })
    .then((answers) => {
      const role_id = answers.role_id;
      return connection.promise().query('DELETE FROM role WHERE id = ?', [role_id]);
    })
    .then(() => {
      console.log('Role deleted successfully.');
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Function to update an employee's role, user input is gathered with prompts, user selections are matched with entries in an array using the map method, SQL UPDATE syntax is used to replace value of role_id and tables are joined so that selected employee first and last name and role title can be used to update role_id in employee table. Three promises are used to handle the querying of the employee list, the querying of the role list and the updating of the employee role in sequential order
function updateEmployeeRole() {
  //Query to get the list of employees for the first prompt
  const employeeListQuery = 'SELECT CONCAT(first_name, " ", last_name) AS employeeName FROM employee';

  //Prompt to select the employee whose role will be updated
  return connection
    .promise()
    .query(employeeListQuery)
    .then(([employees]) =>
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Whose role do you want to update?',
          choices: employees.map((employee) => employee.employeeName),
        },
      ])
    )
    .then((answers) => {
      const selectedEmployeeName = answers.employeeName;

      //Query to get the list of roles for the second prompt
      const roleListQuery = 'SELECT title FROM role';

      //Prompt to get the new role which will be assigned to the selected employee
      return connection
        .promise()
        .query(roleListQuery)
        .then(([roles]) =>
          inquirer.prompt([
            {
              type: 'list',
              name: 'newRole',
              message: 'Which role do you want to assign the selected employee?',
              choices: roles.map((role) => role.title),
            },
          ])
        )
        .then((roleAnswer) => {
          const newRoleTitle = roleAnswer.newRole;

          //Update the employee's role based on the selected employee and new role title
          return connection
            .promise()
            .query(
              'UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE CONCAT(first_name, " ", last_name) = ?',
              [newRoleTitle, selectedEmployeeName]
            )
            .then(() => {
              console.log('Updated employee role.');
              displayMainOptions();
            })
            .catch((error) => {
              console.error('Error:', error);
              displayMainOptions();
            });
        });
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Function to view employees by manager. Query selects the employee id, employee name(concatenated first_name and last_name) and the manager name (also concatenated first_name and last_name). LEFT JOIN is used to handle cases where an employee's manager_id is null. The result is to present the user with a new table of three columns: id, employee name and manager name  
function viewEmployeesByManager() {
  return connection.promise()
    .query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, \
            CONCAT(manager.first_name, " ", manager.last_name) AS manager_name \
            FROM employee \
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id')
    .then(([rows]) => {
      console.table(rows);
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Function to view employees by department. Query selects the employee id, employee name, and department name. It uses INNER JOIN to link the employee with their role and then the role with the department. The WHERE clause filters by the specified department_id. The result is to present the user with a new table of three columns: id, employee name and department name 
function viewEmployeesByDepartment() {
  return connection.promise()
    .query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, \
            department.name AS department_name \
            FROM employee \
            INNER JOIN role ON employee.role_id = role.id \
            INNER JOIN department ON role.department_id = department.id')
    .then(([rows]) => {
      console.table(rows);
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Function to get the total utilized budget of a department. SUM calculates the total salary of all employees in a specified department. employee and role tables are joined to get the salary info based on role_id.  WHERE filters the employees based on the specified department_id. The result is retrieved using connection.promise().query() and the total utilized budget is logged 
function getTotalUtilizedBudget() {
  return connection.promise()
    .query('SELECT department.id, department.name, SUM(role.salary) AS total_budget ' +
           'FROM employee ' +
           'INNER JOIN role ON employee.role_id = role.id ' +
           'INNER JOIN department ON role.department_id = department.id ' +
           'GROUP BY department.id, department.name')
    .then(([rows]) => {
      console.table(rows);
      displayMainOptions();
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMainOptions();
    });
}


//Export all functions so that based on different user input the index.js file can invoke the appropriate one in its switch case

module.exports = {
  getAllDepartments,
  addDepartment,
  deleteDepartment,
  getAllEmployees,
  addEmployee,
  deleteEmployee,
  getAllRoles,
  addRole,
  deleteRole,
  updateEmployeeRole,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  getTotalUtilizedBudget
};
