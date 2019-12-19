var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Engert88",
    database: "employees_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId + "\n");
    // run the start function after the connection is made to prompt the user
    start();
});

// Prompt user if they want to add, view, or update data

function start() {
    inquirer
        .prompt({
            name: "addViewOrUpdate",
            type: "list",
            message: "Would you like to [ADD] Departments, Roles, Employees, [VIEW] Departments, Roles, Employees, or [UPDATE] Employee Roles?",
            choices: ["ADD", "VIEW", "UPDATE", "EXIT"]
        })
        .then(function (answer) {

            if (answer.addViewOrUpdate === "ADD") {
                addData();
            }
            else if (answer.addViewOrUpdate === "VIEW") {
                viewData();
            }
            else if (answer.addViewOrUpdate === "UPDATE") {
                updateData();
            } else {
                connection.end();
            }
        });
}

// Prompt user for what type of data to add

function addData() {
    inquirer
        .prompt({
            name: "addDepartmentRoleOrEmployee",
            type: "list",
            message: "Would you like to ADD a Department, Role, or Employee?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"]
        })
        .then(function (answer) {

            if (answer.addDepartmentRoleOrEmployee === "DEPARTMENT") {
                addDepartment();
            }
            else if (answer.addDepartmentRoleOrEmployee === "ROLE") {
                addRole();
            }
            else if (answer.addDepartmentRoleOrEmployee === "EMPLOYEE") {
                addEmployee();
            } else {
                start();
            }
        });
}

// Prompt user for what type of department to add

function addDepartment() {
    inquirer
        .prompt({
            name: "addDepartment",
            type: "input",
            message: "What is the name of the department you would like to add?",
        })
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?",
                {
                    title: answer.addDepartment
                },
                function (err) {
                    if (err) throw err;
                    console.log("\nYou successfully added a(n) " + answer.addDepartment + " Department\n");
                    start();
                }
            );
        });
};

// Prompt user for what type of role to add

function addRole() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "roleTitle",
                    type: "input",
                    message: "What is the title of the role you would like to add?"
                },
                {
                    name: "roleSalary",
                    type: "number",
                    message: "What is the salary for this role?"
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "What is the department for this role?"
                },
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        department_id: chosenItem.id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("\nYou successfully added a Role!\n");
                        start();
                    }
                );
            });
    })
};

// Prompt user to add an employee

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "What is the employee's role ID?"
                },
                {
                    name: "managerID",
                    type: "number",
                    message: "What is the employee's manager ID?",
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstName,
                        second_name: answer.lastName,
                        role_id: chosenItem.id,
                        manager_id: answer.managerID
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("\nYou successfully added an Employee!\n");
                        start();
                    }
                );
            });
    })
};

// Prompt user for what type of data to view

function viewData() {
    inquirer
        .prompt({
            name: "viewDepartmentsRolesOrEmployees",
            type: "list",
            message: "Would you like to VIEW Departments, Roles, or Employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "EXIT"]
        })
        .then(function (answer) {

            if (answer.viewDepartmentsRolesOrEmployees === "DEPARTMENTS") {
                viewDepartments();
            }
            else if (answer.viewDepartmentsRolesOrEmployees === "ROLES") {
                viewRoles();
            }
            else if (answer.viewDepartmentsRolesOrEmployees === "EMPLOYEES") {
                viewEmployees();
            } else {
                start();
            }
        });
};

// Function to list current departments

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log("\n" + res.length + " departments found!\n" + "______________________________________\n");
        for (var i = 0; i < res.length; i++) {
            console.log(
                "||  " +
                res[i].id +
                "  ||\t" +
                res[i].title + "\n" + "______________________________________\n"
            );
        }
        start();
    });
};

// Function to list current roles

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.log("\n" + res.length + " roles found!\n" + "___________________________________________________________________________________\n");
        for (var i = 0; i < res.length; i++) {
            console.log(
                "||  " +
                res[i].id +
                "  ||\t" +
                res[i].title +
                "  \t  Salary: " +
                res[i].salary +
                "  \t  Department ID: " +
                res[i].department_id + "\n" + "___________________________________________________________________________________\n"
            );
        }
        start();
    });
};

// Function to list current employees

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log("\n" + res.length + " employees found!\n" + "______________________________________________________________________\n");
        for (var i = 0; i < res.length; i++) {
            console.log(
                "||  " +
                res[i].id +
                "  ||\t" +
                res[i].first_name + " " + res[i].second_name +
                "  \t  Role ID: " +
                res[i].role_id +
                "  \t  Manager ID: " +
                res[i].manager_id + "\n" + "______________________________________________________________________\n"
            );
        }
        start();
    });
};

// Function to update employee roles

function updateData() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name + " " + results[i].second_name);
                        }
                        return choiceArray;
                    },
                    message: "What employee would you like to update?"
                },
                {
                    name: "newRole",
                    type: "list",
                    message: "What would you like to update their role to? [1] Engineer [2] Salesperson [3] Lawyer [4] Accountant",
                    choices: [1, 2, 3, 4]
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].second_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: answer.newRole
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Employee role changed successfully!\n");
                        start();
                    })
            });
    });
};
