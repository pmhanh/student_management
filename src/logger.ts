import * as XLSX from 'xlsx';
import * as fs from 'fs';

const logFilePath = 'logs/logs.xlsx';
const sheetName = 'Logs';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    details: string;
}

const getTimestamp = (): string => {
    return new Date().toISOString();
}

const writeLogToFile = (logEntry: LogEntry): void => {
    let workbook;
    let worksheet;

    if (fs.existsSync(logFilePath)) {
        workbook = XLSX.readFile(logFilePath);
        worksheet = workbook.Sheets[sheetName];
    } else {
        workbook = XLSX.utils.book_new();
        worksheet = XLSX.utils.aoa_to_sheet([['Timestamp', 'Level', 'Message', 'Details']]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    const json = XLSX.utils.sheet_to_json(worksheet);
    json.push(logEntry);
    const newWorksheet = XLSX.utils.json_to_sheet(json, { header: ['Timestamp', 'Level', 'Message', 'Details'] });
    workbook.Sheets[sheetName] = newWorksheet;

    XLSX.writeFile(workbook, logFilePath);
}

export const logInfo = (message: string, details: string = ''): void => {
    const logEntry: LogEntry = {
        timestamp: getTimestamp(),
        level: 'INFO',
        message,
        details,
    };
    writeLogToFile(logEntry);
}

export const logError = (message: string, details: string = ''): void => {
    const logEntry: LogEntry = {
        timestamp: getTimestamp(),
        level: 'ERROR',
        message,
        details,
    };
    writeLogToFile(logEntry);
}

export const logWarn = (message: string, details: string = ''): void => {
    const logEntry: LogEntry = {
        timestamp: getTimestamp(),
        level: 'WARN',
        message,
        details,
    };
    writeLogToFile(logEntry);
}