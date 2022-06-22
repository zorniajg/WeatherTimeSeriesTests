const Site = require('./models/site');
const Endpoint = require('./models/endpoint');
const Sample = require('./models/sample');

const mongoose = require('mongoose');

const INTERVAL_IN_MINUTES = 15; // minutes
const TOTAL_SITES = 2; // number of site
const ENDPOINTS_PER_SITE = 100; // endpoints per site
const TOTAL_ENDPOINTS = TOTAL_SITES * ENDPOINTS_PER_SITE;

let startTime;
let endTime;

async function main() {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect("mongodb+srv://zorniajg:timeToTime321@cluster0.xf4y8.mongodb.net/normal?retryWrites=true&w=majority");

        startTime = performance.now();
        console.log('Starting to create normal database');
        // Create endpoints if they do not exist
        const endpointsExist = await Endpoint.find().countDocuments();
        if(!endpointsExist) {
            await createEndpoints();
        }

        // Create sites with sample data generated
        createSite("Vienna");
        createSite("Arlington");
    }
    catch (err) {
        console.error(err);
    } 
};
main().catch(console.error);

async function createEndpoints() {
    for(let endpointNum = 0; endpointNum < TOTAL_ENDPOINTS; endpointNum++) {
        const newEndpoint = new Endpoint({
            name: "Endpoint " + endpointNum
        });

        try {
            await newEndpoint.save()
        }
        catch(err) {
            console.log(err);
        }
    }
};

async function createSite(siteName) {
    let newSite;

    try {
        // Check if site already exists
        const site = await Site.findOne({name: siteName});

        // If site does not exist, create it
        if(!site) {
            site = new Site({
                name: siteName,
                friendlyId: siteName
            });
            await site.save();
        }
        // Generate samples for site once it has been created
        generateSamples(site._id);
    }
    catch(err) {
        console.log(err);
    }  
    
};

async function generateSamples(siteId) {
    try {
        // Get all endpoints
        const endpoints = await Endpoint.find();

        let date = new Date('2021-01-01');
        let endDate = new Date('2022-1-1');
        let endpointInputs = new Array();
        let samples = new Array();

        console.log("siteID = " + siteId);

        // Generate sample data from 2021-01-01 to 2022-01-01
        for(let i = 0; date < endDate; i++) {
            console.log('Date = ' + date);

            // Traverse endpoints to generate random sample values
            for(let endpoint = 0; endpoint < TOTAL_ENDPOINTS / TOTAL_SITES; endpoint++){
                endpointInputs[endpoint] = {
                    id: endpoints[endpoint]._id,
                    value: (Math.random() * 100).toFixed(2),
                    min: 0,
                    max: 100,
                    raw: (Math.random() * 100).toFixed(2) 
                };
            }

            // Create timeseries sample object with timeseries fields, enpoint data, and temperature reading
            const sample = new Sample({
                site: siteId,
                date: date,

                ep: endpointInputs,
                weather: {
                    temperature: (Math.random() * (80 - 50) + 50).toFixed(2)
                }
            });
            
            // Insert every 100 sample objects into sample array which will be written to the database
            samples[i % 100] = sample;

            // Increment date by 15 minutes
            date = new Date(date.getTime() + (INTERVAL_IN_MINUTES * 60000));

            // Write samples to database in batches of 100
            if(i % 100 === 0 || date === endDate) {
                await Sample.insertMany(samples);
                samples = [];
            }
        }
        endTime = performance.now();
        const timeTaken = endTime - startTime;
        const minutes = (timeTaken / 60000).toFixed(2);
        console.log('Total time taken to create normal database: \nMinutes: ' + minutes);
    }
    catch(err) {
        console.log(err);
    }
};
