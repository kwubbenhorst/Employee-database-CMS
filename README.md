# Employee-database-CMS
A content management system, designed to be run as a command line application using Node.js, the inquirer package and MySQL, that will provide an interface for viewing and managing entries in an employee database.

![MIT License](https://img.shields.io/badge/MIT-License-blue)


## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Contributions](#contributions)
- [Tests](#tests)
- [Questions](#questions)

## Description
Frequently the use of databases by non-tech specialists is facilitated by content management systems (CMS). This commandline application, which I have built from scratch, is such an interface which allows any user to access a company's personnel information, such as the names of employees, the departments to which they belong, the title of their roles, their salaries, who their manager is and the total utilized budget for a department. The CMS also allows the database to be edited. New departments, roles, and employees can be created and existing entries deleted. While in the database departments and managers are identified by an id number, the view options in the CMS present the information in the most user-friendly way, by name or title. The dialogue in the terminal guides the user through the information they need to enter and informs the user when the database addition or deletion has occurred, or if they have entered something not valid. In short this application provides business owners with an easy way to view and manage the departments, roles and employees in their companies, allowing them to plan and organize their business. 

This application was built using Node.js, the Inquirer package to handle the prompts to the user and MySQL to create the database.  While it is arguably easier to create and seed a datable and tables using an ORM tool such as Sequelize, this application uses the raw SQL (structured query language) in its promise-based functions, to display facility in writing the queries. The application contains 13 separate functions to provide a wide range of functionality from the Main Options list. The most challenging of these to write were those used to add new departments, roles or employees, since the prompt section often involved more than one question and the .then section made use of chained promises and prepared statements acting as placeholders for the user-defined input. The query for the total utilized budget of a department was the most complex. This application also makes use of the dotenv dependency to conceal the information which is used to connect to the database seeing that the application is hosted publicly on Github. The greatest challenge with the .env file was in realizing that some computers do not acknowledge localhost as a database host, but prefer 127.0.0.1. For a while in development the application was impeded by not being able to establish connection. When this simple fix was discovered, great was the rejoicing. 

The specs given for this project required it to have 7 pieces of functionality, namely the ability to view departments, roles and employees, to add a department, a role, or an employee, and to update an employee's role. My application is distinguished by including 6 further pieces of functionality: the ability to view employees by manager, to view employees by department, to delete departments, roles and employees, and to view the total utilized budget of a department (the combined salaries of all employees in that department). It is necessary in the way I have written the application logic for a new employee's department and role to be assigned before they are created as a new employee in the database. In a future iteration of this application I would like to incorporate conditional logic that would handle a user creating the department, role, or employee in any order. It would also be good to include an option for updating a manager.

The application is not deployed. It is designed to be run entirely in the terminal.)

## Installation
It is necessary for the user to have Node.js installed on their machine  for the application to run. All other dependencies are included with the application, so to initialize, the user only has to enter the commandline command "node index.js" A menu of options will then be presented from which the user can choose using the arrow keys for navigation.

## Usage
When the user starts the application their options are to view all departments, add a department, delete a department, view all roles, add a role, delete a role, view all employees, add an employee, delete an employee, update and employee role, view employees by manager, view employees by department and view total utilized budget. There is also an option to quit the application. This menu will be re-presented to the user at the completion of each function the user asks the application to perform. Options in a list can always be selected by using the arrow keys to navigate the list and hitting enter when the desired option is highlighted. In a case where the user has to type in information, a prompt will guide the user as to acceptable input and the terminal will log either an error in the case of invalid input or verification that the database has been updated as desired. A walkthrough video is supplied at the link below to demonstrate the full functionality of the application:

https://drive.google.com/file/d/1fbex63q_oqCxERqB6dyeppe7RD4VadIn/view?usp=sharing


## Credits
This project was a single-author creation.
For help with the formulation of the SQL queries the excellent tutorial by W3 schools was consulted: https://www.w3schools.com/MySQL/default.asp

## License
This project is licensed under the [MIT License](./LICENSE-MIT).

## Contributions
Contributions to this project are welcome. Please contact the developer directly through email kwubbenhorst@gmail.com or on Github: github.com/kwubbenhorst

## Tests
N/A

## Questions
Questions can also be directed to the email given above: kwubbenhorst@gmail.com
