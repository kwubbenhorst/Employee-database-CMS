const inquirer = require('inquirer');
const mysql = require('mysql2');
const queries = require('./db/queries');
require('dotenv').config()

// Call in query functions, a module export from queries.sql
const { getAllDepartments, addDepartment, deleteDepartment, getAllRoles, addRole, deleteRole, getAllEmployees, addEmployee, deleteEmployee, updateEmployeeRole, viewEmployeesByManager, viewEmployeesByDepartment, getTotalUtilizedBudget } = require('./queries');

// Call in connection method with credentials in its object, a module export from connection.js
const connection = require('connection');

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
    })
    .finally(() => {
      // Close the database connection
      connection.end();
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
      'View all employees',
      'Add employee',
      'Delete employee',
      'View all roles',
      'Add role',
      'Delete role',
      'Update employee role',
      'View employees by manager',
      'View employees by department',
      'View total utilized departmental budget',
      'Quit'
    ]
  })
  .then((answers) => {
      // Call the appropriate function based on user input
      switch (answers.action) {
        case 'View all departments':
          return getAllDepartments();
          break;
        case 'Add department':
          return addDepartment();
          break;
        case 'Delete department':
          return deleteDepartment();
          break;
        case 'View all employees':
          return getAllEmployees();
          break;
        case 'Add employee':
          return addEmployee();
          break;
        case 'Delete employee':
          return deleteEmployee();
          break;
        case 'View all roles':
          return getAllRoles();
          break;
        case 'Add role':
          return addRole();
          break;
        case 'Delete role':
          return deleteRole();
          break;
        case 'Update employee role':
          return updateEmployeeRole();
          break;
        case 'View employees by manager':
          return viewEmployeesByManager();
          break;
        case 'View employees by department':
          return viewEmployeesByDepartment();
          break;
        case 'View total utilized departmental budget':
          return getTotalUtilizedBudget();
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
