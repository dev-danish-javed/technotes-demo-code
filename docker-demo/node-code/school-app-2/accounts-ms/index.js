const logger = require("./logger");
const express = require("express");
const fs = require("node:fs");
const app = express();
app.use(express.json());

// in case of docker
const appDataDirectory = "/app/data/accounts-ms";
// const appDataDirectory = __dirname;
const appDBFileName = "accounts-data.json";

const studentMsUrl = process.env.STUDENTS_MS_URL;
const appPort = process.argv[2] || 8080;

const initializeFeeDetails = (value) => {
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