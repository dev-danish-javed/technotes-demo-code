const logger = require("./logger");
const express = require("express");
const fs = require("node:fs");
const app = express();
app.use(express.json());

// in case of docker
const appDataDirectory = "/app/data/students-ms";
// const appDataDirectory = __dirname;
const appDBFileName = "students-data.json";
const appPort = process.argv[2] || 8080;

const initializeFeeDetails = () =>{
    saveClassDetails(null);
}

const saveClassDetails = (value) => {
    const fileFullPath = appDataDirectory + "/" + appDBFileName;
    try {
        const appDataDirectoryExists = fs.existsSync(appDataDirectory);
        if(!appDataDirectoryExists){
            logger.info(`Creating app data directory : ${appDataDirectory}`);
            fs.mkdirSync(appDataDirectory, { recursive: true });
            logger.info(`Directory created successfully: ${appDataDirectory}`);
        }

        const fileExists = fs.existsSync(fileFullPath);
        if (fileExists) {
            if(!value){
                logger.info(`File already initialized at ${fileFullPath}`);
                return;
            }
        } else{
            logger.info(`File doesn't exists !! Creating ${fileFullPath}`)
        }
        logger.info(`Adding content ${value} to file`);
        const initialContent = JSON.stringify(value, null, 2) || '[]';
        fs.writeFileSync(fileFullPath, initialContent, 'utf8');
        logger.info(`Content updated successfully : ${fileFullPath}`);
    } catch (e) {
        logger.error(`Encountered error ${e}`);
    }
}

const getStudentsData = () => {
    const studentsDataString = fs.readFileSync(appDataDirectory + '/' + appDBFileName, 'utf8');
    return JSON.parse(studentsDataString) || [];
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