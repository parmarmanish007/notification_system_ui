# 🔔 Real-Time Notification System (Frontend)

This is the frontend built using:

* React.js
* Axios
* WebSocket API

---

## 🚀 Features

* Fetch notifications via REST API
* Real-time updates using WebSocket
* Auto reconnect on disconnect
* Instant UI updates (no refresh)

---

## 📁 Project Structure

```
frontend/
│
├── src/
│   ├──components/
│   │──────── Notification.js
│   ├── App.js
│
└── package.json
```
### 1️⃣ Clone Project

```bash
git clone "https://github.com/parmarmanish007/notification_system_ui.git"
cd notification_system_ui
```
---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Start React App

```bash
npm start
```

---

## 🔗 API URL

```
http://127.0.0.1:8000/api/notifications/
```

---

## 🔌 WebSocket URL

```
ws://localhost:8000/ws/notifications/
```

---

## ⚡ How It Works

1. Fetch notifications via API
2. Connect to WebSocket
3. Listen for real-time data
4. Update UI instantly

---

## 🔄 Reconnection Logic

* Auto reconnect on failure
* Exponential backoff

---

## 🧪 Testing

1. Start backend server
2. Open frontend
3. Create notification from backend
4. See instant update

---

