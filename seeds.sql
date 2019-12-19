USE employees_DB;

INSERT INTO department (title)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 120000, 2), ("Salesperson", 80000, 1), ("Lawyer", 190000, 4), ("Accountant", 125000, 3);

INSERT INTO employee (first_name, second_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 2), ("Sarah", "Conner", 2, 4), ("Zach", "Nylen", 3, 5), ("Beth", "Smith", 4, 1);