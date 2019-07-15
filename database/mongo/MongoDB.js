const DBWrapper = require('../DBWrapper.js')
const { UserRepository } = require('./repositories')

const mongoose = require('mongoose')

module.exports = class MongoDB extends DBWrapper {
    constructor(options = {}) {
        super(options)
        this.mongoose = mongoose
    }

    async connect() {
        return mongoose.connect(process.env.MONGODB_URI, this.options).then((m) => {
            this.users = new UserRepository(m)
        })
    }
}