const Site = require('./models/site');
const Endpoint = require('./models/endpoint');
const Sample = require('./models/sample');

const mongoose = require('mongoose');

let startTime, endTime;

async function main() {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect("mongodb+srv://zorniajg:timeSeriesDatabaseTests123@cluster0.xf4y8.mongodb.net/normal?retryWrites=true&w=majority");

        let vienna = await Site.find({name: 'Vienna'});

        if(vienna) {
            startTime = performance.now();
            const viennaSamples = await getFirstFiftyDays(vienna[0]);
            endTime = performance.now();
            console.log('Getting first 50 days took: ' + ((endTime - startTime) / 60000).toFixed(2) + ' minutes');
        }
    }
    catch (err) {
        console.error(err);
    } 
};
main().catch(console.error);


async function getRowsPerDay(site, startDate, endDate) {
    try {
        console.log('SITEID = '+ site._id + '\nSTART DATE = ' + startDate + "\nEND DATE = " + endDate);
        const samples = await Sample.find( {site: site._id, date: {$gte: startDate, $lt: endDate}}/*, {ep: 0}*/);
        console.log('SAMPLES FOUND = ' + samples);
        return samples;
    }
    catch(err) {
        console.log(err);
    }
};

async function getFirstFiftyDays(site) {
    let samples = [];
    let date = new Date('01-01-2021');
    let dayInMilliseconds = 1000*60*60*24;

    try {
        for(let i = 0; i < 50; i++) {
            samples[i] = await getRowsPerDay(site, date, new Date(date.getTime() + dayInMilliseconds));
            date = new Date(date.getTime() + dayInMilliseconds);
            console.log("DATE= " + date);
        }

        return samples;
    }
    catch(err) {
        console.log(err);
    }
};