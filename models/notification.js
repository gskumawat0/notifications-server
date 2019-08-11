const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notification: String,
    date: {
        type: Date,
        default: Date.now()
    },
    viewed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Notification', notificationSchema)



