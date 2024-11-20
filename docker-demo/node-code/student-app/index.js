const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'students.json');

// Helper to read students from JSON
const readStudents = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Helper to write students to JSON
const writeStudents = (students) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2));
};

// Create a new student
app.post('/students', (req, res) => {
    const students = readStudents();
    const newStudent = { id: Date.now(), ...req.body };
    students.push(newStudent);
    writeStudents(students);
    res.status(201).send(newStudent);
});

// Get all students
app.get('/students', (req, res) => {
    const students = readStudents();
    res.send(students);
});

// Search student by ID
app.get('/students/id/:id', (req, res) => {
    const students = readStudents();
    const student = students.find((s) => s.id === parseInt(req.params.id));
    if (student) {
        res.send(student);
    } else {
        res.status(404).send({ message: 'Student not found' });
    }
});

// Search student by name
app.get('/students/name/:name', (req, res) => {
    const students = readStudents();
    const matchingStudents = students.filter((s) => s.name === req.params.name);
    res.send(matchingStudents);
});

// Update a student by ID
app.put('/students/:id', (req, res) => {
    const students = readStudents();
    const studentIndex = students.findIndex((s) => s.id === parseInt(req.params.id));
    if (studentIndex !== -1) {
        students[studentIndex] = { ...students[studentIndex], ...req.body };
        writeStudents(students);
        res.send(students[studentIndex]);
    } else {
        res.status(404).send({ message: 'Student not found' });
    }
});

// Delete a student by ID
app.delete('/students/:id', (req, res) => {
    const students = readStudents();
    const updatedStudents = students.filter((s) => s.id !== parseInt(req.params.id));
    writeStudents(updatedStudents);
    res.send({ message: 'Student deleted' });
});

// Start the server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
