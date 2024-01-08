// Import dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

// Call in query functions, module exports from queries.js
const { getAllDepartments, addDepartment, deleteDepartment, getAllRoles, addRole, deleteRole, getAllEmployees, addEmployee, deleteEmployee, updateEmployeeRole, viewEmployeesByManager, viewEmployeesByDepartment, getTotalUtilizedBudget } = require('./db/queries.js');


// Call in the mySQL connection object with database credentials from connection.js 
const connection = require('./connection.js');


// Function to initialize the application
function init() {
  // Connect to the database
  connection.promise()
    .connect()
    .then(() => {
      // Call the function to display main list of options
      displayMainOptions();
    })
  
    .catch((error) => {
      console.error('Error connecting to the database:', error);
      
    });
}

// Function to display main list of options
function displayMainOptions() {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do? (Scroll with arrow keys to reveal all choices)',
    choices: [
      'View all departments',
      'Add department',
      'Delete department',
      'View all roles',
      'Add role',
      'Delete role',
      'View all employees',
      'Add employee',
      'Delete employee',
      'Update employee role',
      'View employees by manager',
      'View employees by department',
      'View total utilized departmental budget',
      'Quit'
    ]
  })
  .then((answers) => {
      // Call the appropriate function based on user selection from the MainOptions list
      switch (answers.action) {
        case 'View all departments':
          return getAllDepartments(displayMainOptions);
          break;
        case 'Add department':
          return addDepartment(displayMainOptions);
          break;
        case 'Delete department':
          return deleteDepartment(displayMainOptions);
          break;
        case 'View all roles':
          return getAllRoles(displayMainOptions);
          break;
        case 'Add role':
          return addRole(displayMainOptions);
          break;
        case 'Delete role':
          return deleteRole(displayMainOptions);
          break;
        case 'View all employees':
          return getAllEmployees(displayMainOptions);
          break;
        case 'Add employee':
          return addEmployee(displayMainOptions);
          break;
        case 'Delete employee':
          return deleteEmployee(displayMainOptions);
          break;
        case 'Update employee role':
          return updateEmployeeRole(displayMainOptions);
          break;
        case 'View employees by manager':
          return viewEmployeesByManager(displayMainOptions);
          break;
        case 'View employees by department':
          return viewEmployeesByDepartment(displayMainOptions);
          break;
        case 'View total utilized departmental budget':
          return getTotalUtilizedBudget(displayMainOptions);
          break;
        case 'Quit':
          console.log('Goodbye!');
          process.exit();
          break;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Start the application
init();
