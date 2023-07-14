const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
        adminName: {
            type: String,
            required: true
        },
        adminEmail: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        classCode: {
            type: Number,
            required: true
        }, 
        className: {
            type: String,
            required: true
        },
        members: [String]
    },
    {
        timestamps: true,
        usePushEach: true
    }
)

module.exports = mongoose.model('Workspace', workspaceSchema);