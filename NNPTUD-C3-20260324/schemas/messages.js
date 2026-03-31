let mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "from is required"]
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "to is required"]
    },
    messageContent: {
        type: {
            type: String,
            enum: ["file", "text"],
            required: [true, "type is required"]
        },
        text: {
            type: String,
            required: [true, "text is required"]
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('message', messageSchema);
