const inquirer = require('inquirer');
const db = require('./db/connection');

const options = [
  {
    type: 'list',
    name: 'choice',
    message: 'What do you want to do?',
    choices: [
      'View all employees',
      'Add employee',
      'Update employee role',
      'View all roles',
      'Add role',
      'View all departments',
      'Add department',
      'Quit',
    ],
  },
];

const departmentQuestions = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of this department?',
  },
];

const promptLoop = async () => {
  const connection = await db;
  const choice = await inquirer.prompt(options);

  if (choice.choice == 'View all employees') {
    const [rows] = await connection.query("SELECT * FROM employees;");
    console.table(rows);
  }

  if (choice.choice == 'View all roles') {
    const [rows] = await connection.query("SELECT * FROM roles;");
    console.table(rows);
  }

  if (choice.choice == 'View all departments') {
    const [rows] = await connection.query("SELECT * FROM departments");
    console.table(rows);
  }

  if (choice.choice == 'Quit') {
    process.exit(0);
  }

  if (choice.choice == 'Add employee') {
    const [roles] = await connection.query("SELECT * FROM roles;");
    const [managers] = await connection.query("SELECT * FROM employees;");

    const employee = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Please enter first name of employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Please enter last name of employee:',
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Enter role of employee',
        choices: roles.map(({id, title}) => ({name: title, value: id}))
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Enter manager of employee:',
        choices: [{name: 'None', value: null},...managers.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}))]
      },
    ]);

    const [rows] = await connection.query(
      "INSERT INTO employee SET ?",
      employee
    );
  }

  if (choice.choice == 'Update employee role') {
    const [employees] = await connection.query("SELECT * FROM employees;");
    const [roles] = await connection.query("SELECT * FROM roles;");

    const update = await inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'What employee would you like to update?',
        choices: employees.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}))
      },
      {
        type: 'list',
        name: 'role',
        message: 'What role would you like to switch them to?',
        choices: roles.map(({id, title}) => ({name: title, value: id}))
      },
    ]);

    const [rows] = await connection.query(
      "UPDATE employee SET role_id = " +
      update.role +
      " WHERE id = " +
      update.name
    );
  }

  if (choice.choice == 'Add role') {
    const [departments] = await connection.query("SELECT * FROM department;");
    const role = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Name of role?',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'What department does this role belong to?',
        choices: departments.map(({id, name}) => ({name, value: id}))
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of this role?',
      },
    ]);

    const [rows] = await connection.query("INSERT INTO role SET ?", role);
  }

  if (choice.choice == 'Add department') {
    const department = await inquirer.prompt(departmentQuestions);
    const [rows] = await connection.query(
      "INSERT INTO department SET ?",
      department
    );
  }

  promptLoop();
};

promptLoop();