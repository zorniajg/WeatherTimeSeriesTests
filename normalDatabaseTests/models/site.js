const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema( {
    name: {type: String},
    friendlyId: {type: String, unique : true, required : true, index: true},
});

module.exports = mongoose.model('Site', schema);
