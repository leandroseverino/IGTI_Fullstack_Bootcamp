// import express from 'express';
// import winston from 'winston';
// import {promises} from 'fs';
// const readFile = promises.readFile;

const express = require("express");
const fs = require("fs").promises;
const winston = require('winston');

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [ ${label} ${level} ] : ${message}`;
});

global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'grades-control-api.log'})
    ],
    format: combine(
        label({ label: 'grades-control-api'}),
        timestamp(),
        logFormat
    )
});

global.filename = "accounts.json";
global.errorMessageOnWriteFile = "Error on write the file";

const router = require('./routes/accounts.routes');

const app = express();
app.use(express.json());

app.use('/accounts', router);

app.listen(3000, async () =>  {
    try {
        await fs.readFile(global.filename, "utf8");    
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        };
        try {
            await fs.writeFile(global.filename, JSON.stringify(initialJson))
        } catch (err) {
            logger.error(global.errorMessageOnWriteFile, err);
            res.status(400).send({ error: err.message});
        }
    }
    logger.info("API Started !");
});