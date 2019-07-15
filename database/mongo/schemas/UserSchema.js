
const { Schema } = require('mongoose')

module.exports = new Schema({
    _id: String,
    vipRole: String,
    vipUser: String
})