const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Novel = new Schema({
    novel_name : {type: String, required:true},
    novel_initial_url:{type:String, required:true},
    novel_link:{type:String}
})

module.exports = mongoose.model("Novel", Novel);