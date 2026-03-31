let express = require("express");
let router = express.Router();
let messageController = require("../controllers/messages");
let { CheckLogin } = require("../utils/authHandler");

// GET /:userID - Get all messages between current user and specified user
// Or get all messages of current user if userID matches current user
// Must be defined BEFORE GET / to prevent wildcard matching
router.get("/:userID", CheckLogin, async function (req, res, next) {
    try {
        let { userID } = req.params;
        let currentUserId = req.user._id.toString();

        let result;
        
        // If userID matches current user, get all messages of current user
        if (userID === currentUserId) {
            result = await messageController.GetAllMessagesOfUser(req.user._id);
        } else {
            // Otherwise, get messages between current user and the specified user
            result = await messageController.GetMessagesBetweenUsers(
                req.user._id,
                userID
            );
        }

        if (result === false) {
            res.status(400).send({ message: "Failed to get messages" });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// POST - Send a message
router.post("/", CheckLogin, async function (req, res, next) {
    try {
        let { to, type, text } = req.body;

        // Validate inputs
        if (!to || !type || !text) {
            res.status(400).send({ message: "Missing required fields: to, type, text" });
            return;
        }

        if (!["file", "text"].includes(type)) {
            res.status(400).send({ message: "Type must be 'file' or 'text'" });
            return;
        }

        let result = await messageController.SendMessage(
            req.user._id,
            to,
            type,
            text
        );

        if (result === false) {
            res.status(400).send({ message: "Failed to send message" });
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET / - Get last message from each conversation
router.get("/", CheckLogin, async function (req, res, next) {
    try {
        let result = await messageController.GetLastMessagesForUser(req.user._id);
        if (result === false) {
            res.status(400).send({ message: "Failed to get messages" });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
