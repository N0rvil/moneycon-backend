const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: '$',
    },
    records: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Record',
        }
    ],
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }
    ]
});

module.exports = mongoose.model('User', userSchema);