let messageModel = require("../schemas/messages");

module.exports = {
    GetMessagesBetweenUsers: async function (userId, otherUserId) {
        try {
            let messages = await messageModel.find({
                $or: [
                    { from: userId, to: otherUserId },
                    { from: otherUserId, to: userId }
                ],
                isDeleted: false
            })
            .populate('from', 'username email avatarUrl fullName')
            .populate('to', 'username email avatarUrl fullName')
            .sort({ createdAt: 1 });
            
            return messages;
        } catch (error) {
            return false;
        }
    },

    SendMessage: async function (from, to, type, text) {
        try {
            let newMessage = new messageModel({
                from: from,
                to: to,
                messageContent: {
                    type: type,
                    text: text
                }
            });
            
            await newMessage.save();
            
            let populatedMessage = await messageModel.findById(newMessage._id)
                .populate('from', 'username email avatarUrl fullName')
                .populate('to', 'username email avatarUrl fullName');
            
            return populatedMessage;
        } catch (error) {
            return false;
        }
    },

    GetLastMessagesForUser: async function (userId) {
        try {
            // Get all unique users that current user has chatted with
            let messages = await messageModel.find({
                $or: [
                    { from: userId },
                    { to: userId }
                ],
                isDeleted: false
            })
            .populate('from', 'username email avatarUrl fullName _id')
            .populate('to', 'username email avatarUrl fullName _id')
            .sort({ createdAt: -1 });

            // Group by conversation and get the last message with each user
            const conversationMap = new Map();
            
            messages.forEach(msg => {
                const otherUser = msg.from._id.toString() === userId ? msg.to : msg.from;
                const otherUserId = otherUser._id.toString();
                
                if (!conversationMap.has(otherUserId)) {
                    conversationMap.set(otherUserId, {
                        user: otherUser,
                        lastMessage: msg
                    });
                }
            });

            return Array.from(conversationMap.values());
        } catch (error) {
            return false;
        }
    },

    GetAllMessagesOfUser: async function (userId) {
        try {
            // Get all messages sent by or received by the user
            let messages = await messageModel.find({
                $or: [
                    { from: userId },
                    { to: userId }
                ],
                isDeleted: false
            })
            .populate('from', 'username email avatarUrl fullName')
            .populate('to', 'username email avatarUrl fullName')
            .sort({ createdAt: 1 });
            
            return messages;
        } catch (error) {
            return false;
        }
    }
};
