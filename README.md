# 🗂️ TaskFlow — MERN Stack Task Management Application

> A premium, full-featured task management application built with MongoDB, Express, React, and Node.js. Collaborate with your team, organize work into boards, lists, and cards — with real-time role-based access control.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access Control (RBAC)](#-role-based-access-control)
- [Frontend Pages & Components](#-frontend-pages--components)
- [Redux State Management](#-redux-state-management)
- [Drag & Drop](#-drag--drop)
- [Scripts Reference](#-scripts-reference)

---

## ✨ Features

### 🔐 Authentication
- User **registration** and **login** with JWT-based authentication
- Persistent sessions via localStorage token
- Protected routes — unauthenticated users are redirected to login
- Clear error feedback on invalid credentials

### 📌 Boards
- Create, **rename**, and **delete** boards (Owner only)
- Dashboard grid view displaying all accessible boards
- Board-level **member management** — invite users by email, assign roles

### 📃 Lists (Columns)
- Create, **rename**, and **delete** lists inside a board (Editor/Admin)
- Inline title editing directly on the list header
- Drag-and-drop **reorder** lists horizontally across the board

### 🃏 Cards (Tasks)
- Create cards within any list
- Click a card to open a **detailed modal** with:
  - **Description** — rich-text click-to-edit field
  - **Labels** — add and remove colored labels
  - **Due Date** — date picker with overdue highlighting
  - **Attachments** — add and display URL links
  - **Comments/Activity** — comment thread with user avatars and timestamps
- Drag-and-drop cards **within** and **between** lists

### 👥 Collaboration
- Invite team members to boards via email
- Assign roles: **Admin**, **Editor**, or **Viewer**
- Role-based UI — Viewers see read-only boards; Editors can add/edit; Admins can invite/delete

### 🎨 UI/UX
- Premium glassmorphism dark theme
- Fully **responsive** across mobile, tablet, and desktop
- Smooth animations and micro-interactions
- Real-time feedback with success/error messages

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js v5** | RESTful API framework |
| **MongoDB** | NoSQL document database |
| **Mongoose** | MongoDB ODM for schema modeling |
| **JSON Web Token (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing |
| **nodemon** | Auto-restart server on file changes |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite** | Lightning-fast build tool and dev server |
| **Redux Toolkit** | Global state management |
| **React Redux** | React bindings for Redux |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **@hello-pangea/dnd** | Drag-and-drop for lists and cards |
| **TailwindCSS v3** | Utility-first CSS framework |
| **lucide-react** | Beautiful icon set |
| **moment.js** | Date formatting and relative time |

---

## 📁 Project Structure

```
QurinomSolutions-TaskAss/
├── backend/                    # Express API server
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js             # User Mongoose schema
│   │   ├── Board.js            # Board Mongoose schema
│   │   ├── List.js             # List Mongoose schema
│   │   └── Card.js             # Card Mongoose schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth — register, login, me
│   │   ├── boards.js           # /api/boards — CRUD, invite members
│   │   ├── lists.js            # /api/boards/:boardId/lists — CRUD
│   │   └── cards.js            # /api/lists/:listId/cards — CRUD
│   ├── .env                    # Environment variables (gitignored)
│   ├── package.json
│   └── server.js               # App entry point
│
└── frontend/                   # React + Vite SPA
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── CardModal.jsx   # Full card detail modal
    │   │   ├── InviteModal.jsx # Invite member modal
    │   │   ├── ListColumn.jsx  # Kanban list column
    │   │   ├── Navbar.jsx      # Top navigation bar
    │   │   └── TaskCard.jsx    # Individual draggable card
    │   ├── pages/
    │   │   ├── BoardView.jsx   # Single board with drag-drop
    │   │   ├── Dashboard.jsx   # All boards overview
    │   │   ├── Login.jsx       # Login page
    │   │   └── Register.jsx    # Registration page
    │   ├── store/
    │   │   ├── index.js        # Redux store config
    │   │   └── slices/
    │   │       ├── authSlice.js    # Auth state and thunks
    │   │       └── boardSlice.js   # Board/list/card state and thunks
    │   ├── utils/
    │   │   └── api.js          # Axios instance with JWT interceptor
    │   ├── App.jsx             # Router and top-level layout
    │   ├── main.jsx            # ReactDOM entry point
    │   └── index.css           # Global styles and TailwindCSS
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## ✅ Prerequisites

- **Node.js** v20+ (v20.19.0+ recommended)
- **npm** v10+
- **MongoDB** — local instance (`mongodb://localhost:27017`) or [MongoDB Atlas](https://www.mongodb.com/atlas)
- Optional: [nvm](https://github.com/nvm-sh/nvm) for Node version management

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd QurinomSolutions-TaskAss
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create the .env file (see Environment Variables section below)
# Then start the development server:
npm run dev
```

The backend server will start on **http://localhost:5000**

### Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend app will start on **http://localhost:5173**

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` directory with the following values:

```env
# MongoDB connection string (local or Atlas)
MONGO_URI=mongodb://localhost:27017/taskmanager

# JWT secret key (use a long, random string in production)
JWT_SECRET=your_super_secret_jwt_key_here

# Server port (optional, defaults to 5000)
PORT=5000
```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 📡 API Reference

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `GET` | `/me` | ✅ | Get current authenticated user |

**Register / Login Request Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

---

### 📌 Board Routes — `/api/boards`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | ✅ | Any member | Get all boards for current user |
| `POST` | `/` | ✅ | Authenticated | Create a new board |
| `GET` | `/:id` | ✅ | Any member | Get single board with lists and cards |
| `PUT` | `/:id` | ✅ | Owner only | Update board title/description |
| `DELETE` | `/:id` | ✅ | Owner only | Delete board + all lists + all cards |
| `POST` | `/:id/members` | ✅ | Admin only | Invite a user by email with a role |

**Invite Member Request Body:**
```json
{
  "email": "teammate@example.com",
  "role": "Editor"
}
```

---

### 📃 List Routes — `/api/boards/:boardId/lists`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | ✅ | Any member | Get all lists for a board |
| `POST` | `/` | ✅ | Editor/Admin | Create a new list |
| `PUT` | `/:id` | ✅ | Editor/Admin | Rename a list |
| `DELETE` | `/:id` | ✅ | Editor/Admin | Delete a list |

---

### 🃏 Card Routes — `/api/lists/:listId/cards`

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/` | ✅ | Any member | Search/filter cards by boardId or title |
| `POST` | `/` | ✅ | Editor/Admin | Create a new card |
| `PUT` | `/:id` | ✅ | Editor/Admin | Update card (title, description, dueDate, labels, attachments, position, listId, add comment) |
| `DELETE` | `/:id` | ✅ | Editor/Admin | Delete a card |

**Update Card Request Body (all fields optional):**
```json
{
  "title": "New title",
  "description": "Card description",
  "dueDate": "2025-12-31",
  "labels": ["feature", "urgent"],
  "attachments": ["https://example.com/doc.pdf"],
  "listId": "<target-list-id>",
  "position": 2,
  "commentText": "This is a comment"
}
```

---

## 🛡️ Role-Based Access Control

The application enforces three roles at both the **frontend** (UI restrictions) and **backend** (API restrictions) levels.

| Feature | Viewer | Editor | Admin (Owner) |
|---------|--------|--------|---------------|
| View boards, lists, cards | ✅ | ✅ | ✅ |
| Create / edit / delete cards | ❌ | ✅ | ✅ |
| Create / rename / delete lists | ❌ | ✅ | ✅ |
| Drag and drop lists/cards | ❌ | ✅ | ✅ |
| Edit card description / labels / dates / attachments | ❌ | ✅ | ✅ |
| Add comments to cards | ❌ | ✅ | ✅ |
| Invite members to board | ❌ | ❌ | ✅ |
| Edit board title/description | ❌ | ❌ | ✅ (Owner) |
| Delete board | ❌ | ❌ | ✅ (Owner) |

---

## 🖥️ Frontend Pages & Components

### Pages

| Page | Route | Description |
|------|-------|-------------|
| `Login.jsx` | `/login` | User login form with validation feedback |
| `Register.jsx` | `/register` | Registration form with validation feedback |
| `Dashboard.jsx` | `/` | Grid of all accessible boards. Owners see Edit/Delete actions |
| `BoardView.jsx` | `/b/:id` | Full Kanban board view with drag-and-drop |

### Components

| Component | Description |
|-----------|-------------|
| `Navbar.jsx` | Top bar with search and user logout |
| `ListColumn.jsx` | A single Kanban column. Supports inline title editing and deletion |
| `TaskCard.jsx` | A draggable card; shows labels, due date, and comment count indicators |
| `CardModal.jsx` | Full card detail view with editing capabilities (RBAC-aware) |
| `InviteModal.jsx` | Modal form for inviting team members by email with role selection |

---

## 🗃️ Redux State Management

The Redux store is split into two slices:

### `authSlice`
| State | Description |
|-------|-------------|
| `token` | JWT token |
| `user` | Authenticated user object |
| `isAuthenticated` | Boolean auth status |
| `loading` / `error` | Request state |

**Thunks:** `loadUser`, `login`, `register`

### `boardSlice`
| State | Description |
|-------|-------------|
| `boards` | All boards for the user (Dashboard) |
| `currentBoard` | Full board data with lists and cards |
| `loading` / `error` | Request state |

**Thunks:** `getBoards`, `getBoard`, `createBoard`, `updateBoard`, `deleteBoard`, `updateListTitle`, `deleteList`

**Local (synchronous) actions:** `updateListLocal`, `reorderListsLocal`, `updateCardLocal`, `removeCardLocal`

---

## 🔄 Drag & Drop

Drag and drop is powered by **`@hello-pangea/dnd`** (the maintained React 18+ fork of `react-beautiful-dnd`).

- **Lists**: Draggable horizontally across the board. Reordering saves the new `position` to all affected lists on the backend automatically.
- **Cards**: Draggable within a list (reorder) or moved between different lists. Moving a card updates both `listId` and `position` in the database.
- **RBAC**: Viewers cannot drag any elements. Only Editors and Admins can reorder and move items.

---

## 📜 Scripts Reference

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-restart on changes) |
| `npm start` | Start server with Node (production) |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🌐 Running Both Servers

You need **two separate terminals** running simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✅ App running on http://localhost:5173
```

Then open your browser at **[http://localhost:5173](http://localhost:5173)** and register your first account!

---

## 🤝 Default Quick Start Workflow

1. Register a new account at `/register`
2. Create a new Board from the Dashboard
3. Add Lists (columns) to your board — e.g., "To Do", "In Progress", "Done"
4. Add Cards (tasks) to your lists
5. Click any card to open the detail modal — add a description, labels, or due date
6. Drag cards between lists as your work progresses
7. Invite teammates via the **Invite** button (Admin only) and assign roles

---

> Built as a MERN Stack assignment project. All features including authentication, CRUD, RBAC, and drag-and-drop are fully implemented and production-ready.
