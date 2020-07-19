const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Novel = new Schema({
    novel_name : {type: String, required:true},
    novel_initial_url:{type:String, required:true},
    novel_link:{type:String},
    last_read: {type:Number, default:0}
})

module.exports = mongoose.model("Novel", Novel);