const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EditorSchema = new Schema({
    _id: String,
    data: Object,
    }
)

module.exports = mongoose.model('Editor', EditorSchema);