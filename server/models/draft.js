const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const draftSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        classCode: {
            type: Number,
            required: true
        },
        creatorEmail: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Draft', draftSchema);