const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema( {

    site: {type: Schema.Types.ObjectID, ref: 'Site'},
    complete: {type: Boolean},
    
    timeseries: {
        timeField: {
            type: Date,
            required: true
        },
        metaField: {
            type: Schema.Types.ObjectId, ref: 'Endpoint',
            required: true
        },
        granularity: {
            type: String,
            required: true
        }
     },

    ep: 
        {
            _id:false,
            value: {type: Number },
            min: {type: Number },
            max: {type: Number },
            raw: {type: Number }
        },

    weather: {

        observationDate: {type: Date},
        source: {type: String},

        pressure: { type: Number },                 // mb
        windSpeed: { type: Number },                // mph
        windDirection: { type: Number },            // degrees
        temperature: { type: Number },              // F
        relativeHumidity: { type: Number },         // %
        dewPoint: { type: Number },                 // F
        wetBulb: { type: Number },                 // F
        clouds: { type: Number },                   // %
        precipitation: { type: Number },            // in in past hour
        snow: { type: Number },                     // in in past 24 hours
        uvIndex: { type: Number }                  // 0-11+
    },

    weatherAge: {type: Number}

});

schema.index({metaField:1, timeField:1});

module.exports = mongoose.model('Sample',schema);