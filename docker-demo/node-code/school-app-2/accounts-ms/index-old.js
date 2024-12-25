const logger = require("./logger");
const express = require("express");
const fs = require("node:fs");
const app = express();
app.use(express.json());

// in case of docker
const appDataDirectory = "app/data/school-app/accounts-ms";
// const appDataDirectory = __dirname;
const appDBFileName = "accounts-data.json";

const studentMsUrl = process.env.STUDENTS_MS_URL;
const appPort = process.argv[2] || 8080;

const initializeFeeDetails = (value) => {
    const fileFullPath = appDataDirectory + "/" + appDBFileName;
    try {
        try{
            const fileExists = fs.existsSync(fileFullPath);
            if (fileExists && !value) {
                logger.info(`File already initialized at ${fileFullPath}`);
                return;
            }
        } catch (e) {
            logger.error(`Can not check if file exists ${appDBFileName}: ${e}`);
            return;
        }
        if(!fs.existsSync(appDataDirectory)){
            logger.info(`Creating app data directory : ${appDataDirectory}`);
            fs.mkdirSync(appDataDirectory, { recursive: true });
            logger.info(`Directory created : ${appDataDirectory}`);
        }
        logger.info(`File doesn't exists !! Creating ${fileFullPath}`)
        try {
            const initialContent = JSON.stringify(value, null, 2) || '[]';
            fs.writeFileSync(fileFullPath, initialContent, 'utf8');
        } catch (e) {
            logger.error(`Error writing file : ${appDBFileName}: ${e}`);
        }

        logger.info(`Updated content in file: ${fileFullPath}`);
        return true;
    } catch (e) {
        logger.error(`Error!! File name : ${appDBFileName}: ${e}`);
        return false;
    }
}

const getFeeStructure = () => {
    const feeStructureString = fs.readFileSync(appDataDirectory + '/' + appDBFileName, 'utf8');
    return JSON.parse(feeStructureString);
}

const getClassStudentsDetails = async (className) => {
    const studentDetailsUrl = studentMsUrl + "/class/" + className;
    logger.info(`Fetching info for class ${className} from ${studentDetailsUrl}`);
    try{
        let response = await fetch(studentDetailsUrl);
        return response.status === 200 ? await response.json() : [];
    }
    catch(e) {
        logger.error(`Error during fetching info for class -${e.cause.code} : ${e.message}`);
    }
}

app.get("/", (req, res) => {
    logger.info("Test successful");
    res.send("Service is up!");
});

app.get("/info", (req, res) => {
    const feeStructureString = getFeeStructure();
    logger.info("Request fee");
    res.json(feeStructureString);
})

app.get("/info/:className", async (req, res) => {
    const className = req.params.className;
    let students = await getClassStudentsDetails(className) || [];
    let classFee = getFeeStructure().find(classData => classData.class === className)?.fee || 0;
    const result = students.length * classFee;
    res.status(result>0 ? 200 : 404).send({fee: result, students});
})

app.post("/info/add", (req, res) => {
    const feeDetails = req.body;
    logger.info(`Adding class details ${JSON.stringify(feeDetails)}`);
    // add the fees to existing fees array
    let existingFeeDetails = getFeeStructure();
    existingFeeDetails.push(feeDetails);

    // write the updates in the file
    initializeFeeDetails(existingFeeDetails);
    res.status(201).json(feeDetails);
})

app.listen(appPort, () => {
    logger.info(`student-ms url set to : ${studentMsUrl}`);
    // create the file prior to operations
    initializeFeeDetails();
    logger.info(`Server started on port ${appPort}`);
})