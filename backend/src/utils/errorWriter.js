import fs from "fs";

export const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

export const logEntry = `
**********************************
*        ERROR LOG ENTRY        *
**********************************
Timestamp: {{TIMESTAMP}}
Error: {{ERROR_MESSAGE}}

Request Info:
Method: {{REQUEST_METHOD}}
URL: {{REQUEST_URL}}
Headers: {{REQUEST_HEADERS}}
Body: {{REQUEST_BODY}}

Stack Trace:
{{STACK_TRACE}}

**********************************

`;

export async function generateErrorLog() {
  const dateNow = new Date();
  const fileName = `${dateNow.toISOString()}_error_log.log`;
  const fileLocation = `logs/${fileName}`;
  fs.writeFileSync(
    fileLocation,
    `Error log created at ${dateNow.toISOString()}\n`
  );
  console.log(`Error log file created at: ${fileLocation}`);
  return fileLocation;
}

export async function appendToErrorLog(fileLocation, msg) {
  try {
    fs.appendFileSync(fileLocation, msg + "\n");
  } catch (error) {
    console.error("Failed to append to error log:", error);
  }
}
