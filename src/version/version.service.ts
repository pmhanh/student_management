import { Get, Injectable } from '@nestjs/common';
// import * as packageJson from 'package.json';
const packageJson = require('../../package.json');

@Injectable()
export class VersionService {
    getVersionInfo() {
        // packageJson.buildDate = new Date().toISOString();
        // console.log(packageJson.buildDate);
        return {
            version: packageJson.version,
            buildDate: packageJson.buildDate,
            environment: process.env.NODE_ENV || 'development'
        };
    }
}