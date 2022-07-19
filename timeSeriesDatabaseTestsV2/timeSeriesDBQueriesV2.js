const Site = require('./models/site');
const Endpoint = require('./models/endpoint');
const Sample = require('./models/sample');

const mongoose = require('mongoose');

let startTime, endTime;

async function main() {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect("mongodb+srv://zorniajg:timeToTime321@cluster0.xf4y8.mongodb.net/timeseries?retryWrites=true&w=majority");

        let vienna = await Site.find({name: 'Vienna'});
        console.log('VIENNA = ' + vienna[0].name);

        if(vienna) {
            startTime = performance.now();
            const viennaSamples = await getFirstFiftyDays(vienna[0]);
            endTime = performance.now();
            console.log(viennaSamples + '\nGetting first 50 days took: ' + ((endTime - startTime) / 60000).toFixed(2) + ' minutes');
        }
    }
    catch (err) {
        console.error(err);
    } 
};
main().catch(console.error);


async function getRowsPerDay(site, date) {
    console.log('Site = ' + site + ', \nDate = ' + date + ' \nSITEID = ' + site._id);
    try {
        const sample = await Sample.find({ _id: '62ce1becb59c4e8bf863ae3c', timeseries: {metaField: '62ce1bebb59c4e8bf863ae39' },/*timeseries: {metaField: site._id}*/ /*weather: {temperature: 55.70}*/ } , {ep: 0}/*, timeField: {"$gte": date} , timeField: {"$lt": date + 1} */);
        console.log("SAMPLE: " + sample);
        return sample;
    }
    catch(err) {
        console.log(err);
    }
};

async function getFirstFiftyDays(site) {
    let samples = [];
    let date = new Date('2021-01-02');
    let dayInMilliseconds = 1000*60*60*24;

    try {
        for(let i = 0; i < 1; i++) {
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