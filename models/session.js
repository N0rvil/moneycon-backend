const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Session', sessionSchema);
