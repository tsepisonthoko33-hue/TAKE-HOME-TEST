# Library Management System — BIWA2110

A React + Express + MySQL implementation of the Web Application Development individual assignment.

## 1. Requirements
- Node.js 18+
- MySQL 8+
- npm

## 2. Database setup
1. Open MySQL Workbench or the MySQL command line.
2. Run the contents of `database/schema.sql`.
3. The script creates the `library_management` database and its tables, plus a sample admin user and sample books.

Sample login:
- Membership ID: `ADMIN001`
- Password: `admin123`

This is a classroom demonstration login. For a real deployment, use hashed passwords and stronger authentication.

## 3. Start the backend
```bash
cd backend
cp .env.example .env
```
Edit `.env` with your MySQL username and password, then:
```bash
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

## 4. Start the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## 5. Features included
- Dashboard with book count, stock count, users and recent transactions
- Low-stock highlighting for books with fewer than 2 copies
- Book create, read, update and delete
- User create, read, update and delete
- Membership ID/password login
- Stock-in and borrow transactions
- Transaction history
- React Router navigation
- Express JSON and CORS middleware
- MySQL tables with foreign keys

## 6. Project structure
```text
Library-Management-System/
├── database/schema.sql
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── middleware/auth.js
│   ├── routes/books.js
│   ├── routes/users.js
│   ├── routes/transactions.js
│   ├── routes/dashboard.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/Layout.jsx
    │   ├── pages/
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    └── package.json
```

## 7. How the system works
1. A user interacts with a React page.
2. React uses `fetch()` to send an HTTP request to the Express API.
3. Express validates the request and runs an SQL query through `mysql2`.
4. MySQL stores or returns the data.
5. Express sends a JSON response.
6. React updates the page using state.

## 8. Assignment requirement mapping
| Lecturer's requirement | Implementation |
|---|---|
| React hooks | `useState` and `useEffect` in pages |
| Reusable components | `Layout` and reusable page patterns |
| Controlled forms | React form state and required fields |
| React Router | Dashboard, Books, Transactions, Users |
| Fetch API | `src/api.js` |
| Express REST API | `/api/books`, `/api/users`, `/api/transactions` |
| Database | MySQL schema and `mysql2` |
| Middleware | `express.json()` and `cors` |
| Low-stock display | Dashboard and Books page |
| Stock changes | Transaction endpoint uses a database transaction |

## 9. Important notes
- The project expects MySQL to be running before the backend starts.
- The backend uses a simple membership-ID login for demonstration. It is not production-grade security.
- The assignment asks for the student's own work. Read the code, customize the interface, test it, and make sure you can explain each part before submission.
- Submit the project repository link on GitHub, including both `frontend/` and `backend/`.
