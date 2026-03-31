# Báo cáo Implemention - Message System

## Ngày: 24/3/2026

## Mục tiêu
Tạo message schema và 3 routers cho hệ thống chat:
1. GET `/:userID` - Lấy toàn bộ tin nhắn giữa 2 user
2. POST `/` - Gửi tin nhắn (text hoặc file)
3. GET `/` - Lấy tin nhắn cuối cùng từ mỗi cuộc hội thoại

---

## Các file được tạo/sửa

### 1. **schemas/messages.js** ✅
File schema MongoDB cho messages
- Field `from`: Reference tới user (người gửi)
- Field `to`: Reference tới user (người nhận)
- Field `messageContent`: Object chứa:
  - `type`: String ("file" hoặc "text")
  - `text`: String (nội dung text hoặc path file)
- Field `isDeleted`: Boolean (mặc định false)
- Timestamps: Tự động tạo createdAt và updatedAt

### 2. **controllers/messages.js** ✅
Controller xử lý logic message
- `GetMessagesBetweenUsers(userId, otherUserId)`: Lấy tất cả tin nhắn giữa 2 user (sorted by createdAt)
- `SendMessage(from, to, type, text)`: Tạo và lưu tin nhắn mới
- `GetLastMessagesForUser(userId)`: Lấy tin nhắn cuối cùng từ mỗi conversation

### 3. **routes/messages.js** ✅
Router Express với 3 endpoints:

#### Endpoint 1: GET / 
**Mục đích**: Lấy tin nhắn cuối cùng của mỗi user mà user hiện tại đã nhắn tin hoặc nhận tin từ
**Yêu cầu**: Bearer token (CheckLogin middleware)
**Response**: Array các conversation với tin nhắn cuối cùng
**Status**: 200 OK

#### Endpoint 2: POST /
**Mục đích**: Gửi tin nhắn mới
**Yêu cầu**: 
- Bearer token (CheckLogin middleware)
- Request body: {to, type, text}
- type: "file" hoặc "text"
- Nếu type="file": text = đường dẫn file
- Nếu type="text": text = nội dung tin nhắn
**Response**: Object message mới được tạo
**Status**: 201 Created

#### Endpoint 3: GET /:userID
**Mục đích**: Lấy toàn bộ tin nhắn (2 chiều) giữa user hiện tại và userID
**Yêu cầu**: Bearer token (CheckLogin middleware)
**Parameter**: userID - ID của user khác
**Response**: Array tất cả tin nhắn giữa 2 user (sắp xếp theo createdAt)
**Status**: 200 OK

### 4. **app.js** - Updated ✅
Thêm route cho messages:
```javascript
app.use('/api/v1/messages', require('./routes/messages'));
```

---

## Features Implementation

### ✅ Message Schema
- [x] from: user reference
- [x] to: user reference  
- [x] messageContent.type: "file" | "text"
- [x] messageContent.text: String
- [x] Timestamps (createdAt, updatedAt)
- [x] isDeleted flag

### ✅ Controller Functions
- [x] GetMessagesBetweenUsers - Lấy message 2 chiều
- [x] SendMessage - Tạo message mới
- [x] GetLastMessagesForUser - Lấy last message mỗi conversation

### ✅ Router Endpoints
- [x] GET / - Last messages
- [x] POST / - Send message  
- [x] GET /:userID - All messages between 2 users

### ✅ Authentication
- [x] CheckLogin middleware trên tất cả endpoints
- [x] req.user set từ JWT token
- [x] Bearer token hoặc Cookie support

### ✅ Error Handling
- [x] Validate required fields (to, type, text)
- [x] Validate type enum (file/text)
- [x] Try-catch blocks
- [x] Proper HTTP status codes (200, 201, 400, 500)

---

## API Base URL
```
http://localhost:3000/api/v1/messages
```

---

## Testing Checklist

### Chuẩn bị:
1. ✅ MongoDB running
2. ✅ Server running (`npm start`)
3. ✅ Token authentication (login để lấy token)
4. ✅ Postman ready

### Test Cases:

#### Test 1: POST / - Gửi tin nhắn text
- [ ] Request: POST `/api/v1/messages/`
- [ ] Body: `{to: "user_id", type: "text", text: "Hello"}`
- [ ] Expected: 201, message object returned

#### Test 2: POST / - Gửi tin nhắn file
- [ ] Request: POST `/api/v1/messages/`
- [ ] Body: `{to: "user_id", type: "file", text: "uploads/doc.pdf"}`
- [ ] Expected: 201, message object returned

#### Test 3: GET / - Lấy list conversation
- [ ] Request: GET `/api/v1/messages/`
- [ ] Expected: 200, array of conversations

#### Test 4: GET /:userID - Lấy all messages 2 chiều
- [ ] Request: GET `/api/v1/messages/user_id_2`
- [ ] Expected: 200, array of all messages

#### Test 5: Error - Missing field
- [ ] Request: POST `/api/v1/messages/` với missing "to"
- [ ] Expected: 400, error message

#### Test 6: Error - Invalid type
- [ ] Request: POST `/api/v1/messages/` với type="invalid"  
- [ ] Expected: 400, error message

---

## Git Commit
```
git add .
git commit -m "Add message schema, controller and router with 3 endpoints"
```

---

## Notes
- Tất cả endpoints require authentication (CheckLogin middleware)
- Message content được lưu với type và text
- Get last messages grouped by conversation partner
- All queries populate user information (username, email, avatar, fullName)
- isDeleted flag cho soft delete functionality
