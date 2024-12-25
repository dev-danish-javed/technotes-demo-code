const logger = require("./logger");
const express = require("express");
const fs = require("node:fs");
const app = express();
app.use(express.json());

// in case of docker
const appDataDirectory = "/app/school-app/students-ms";
// const appDataDirectory = __dirname;
const appDBFileName = "students-data.json";
const appPort = process.argv[2] || 8080;

const initializeFeeDetails = () =>{
    saveClassDetails(null);
}

const saveClassDetails = (value) => {
    const fileFullPath = appDataDirectory + "/" + appDBFileName;
    try {
        const fileExists = fs.existsSync(fileFullPath);
        if (fileExists && !value) {
            logger.info(`File already initialized at ${fileFullPath}`);
            return;
        }
        const initialContent = JSON.stringify(value || [], null, 2);
        fs.writeFileSync(fileFullPath, initialContent, 'utf8');

        logger.info(`Updated content in file: ${fileFullPath}`);
        return true;
    } catch (e) {
        logger.error(`Error!! File name : ${appDBFileName}: ${e}`);
        return false;
    }
}

const getStudentsData = () => {
    const studentsDataString = fs.readFileSync(appDataDirectory + '/' + appDBFileName, 'utf8');
    return JSON.parse(studentsDataString||'[]');
}

app.get("/test", (req, res) => {
    logger.info("Test successful");
    res.send("Service is up!");
});

app.get("/class/:className", (req, res) => {
    let className = req.params.className;
    let studentsData = getStudentsData().filter(student => student.class === className);
    if(studentsData && studentsData.length > 0){
        res.status(200).send(studentsData);
    }else{
        res.status(404).send({ message: 'Students not found' });
    }
})

app.post("/student/add", (req, res) => {
    const studentData = req.body;
    logger.info(`Adding student details ${JSON.stringify(studentData)}`);
    // add the fees to existing fees array
    let existingStudentsDetails = getStudentsData();
    existingStudentsDetails.push(studentData);

    // write the updates in the file
    saveClassDetails(existingStudentsDetails);
    res.status(201).json(studentData);
})

app.listen(appPort, () => {
    logger.info(`Server started on port ${appPort}`);
    // create the file prior to starting the server
    initializeFeeDetails();
})