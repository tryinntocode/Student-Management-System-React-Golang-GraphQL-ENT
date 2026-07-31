This project is a complete CRUD application for managing student records — name, email, date of birth, phone number, department, and semester — exposed through a type-safe GraphQL API and consumed by a responsive React frontend.

It was built as a hands-on exploration of a modern Go backend stack: Ent for type-safe schema-driven database access, gqlgen for a code-first GraphQL API, and PostgreSQL for persistence, paired with a lightweight React + Vite client for the UI.

🖥️ Features
Create new student records with full validation
Search for a student instantly by ID
Update existing student details inline
Delete records from the dashboard
Live table view of all students, auto-refreshing after every mutation
GraphQL Playground available out of the box for testing queries/mutations directly
Clean separation between backend (GraphQL API) and frontend (React SPA), connected over CORS-enabled HTTP
🏗️ Tech Stack
Layer	Technology
Backend Language	Go
API Layer	gqlgen (schema-first GraphQL)
ORM	Ent (entity framework for Go)
Database	PostgreSQL
Frontend	React 19 + Vite
Styling	Custom CSS (component-scoped)
Networking	Native fetch GraphQL requests, CORS via rs/cors
📂 Project Structure
Final Project/
├── backend/
│   ├── ent/                # Ent-generated ORM code & schema
│   │   └── schema/user.go  # User entity definition
│   ├── graph/               # GraphQL schema, resolvers & generated code
│   │   ├── schema.graphqls
│   │   └── schema.resolvers.go
│   ├── config/database.go   # PostgreSQL connection setup
│   ├── server.go            # Entry point — starts the GraphQL server
│   └── gqlgen.yml
└── frontend/
    ├── src/
    │   ├── components/      # CreateUser, UpdateUser, SearchUser, UserTable, Navbar
    │   ├── App.jsx           # Root component & GraphQL data fetching
    │   └── main.jsx
    └── package.json
🔗 GraphQL API

Schema

graphql
type User {
  id: ID!
  name: String!
  email: String!
  dob: String!
  phNo: String!
  department: String!
  semester: String!
}

type Query {
  user: [User!]!
  getUser(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!, dob: String!, phNo: String!, department: String!, semester: String!): User!
  updateUser(id: ID!, name: String!, email: String!, dob: String!, phNo: String!, department: String!, semester: String!): User!
  deleteUser(id: ID!): User!
}

Once the backend is running, the interactive GraphQL Playground is available at http://localhost:8086/.

🚀 Getting Started
Prerequisites
Go 1.26+
Node.js 18+
PostgreSQL running locally
1. Clone the repository
bash
git clone https://github.com/<your-username>/<repo-name>.git
cd "Final Project"
2. Set up the database

Create a PostgreSQL database matching the connection string in backend/config/database.go:

dbname=finaldb  user=postgres  password=1234  port=5432

💡 For production or sharing this repo publicly, move these credentials into environment variables instead of hardcoding them.

3. Run the backend
bash
cd backend
go mod tidy
go run server.go

The GraphQL server will start on http://localhost:8086, and Ent will automatically create the required schema/tables on first run.

4. Run the frontend
bash
cd frontend
npm install
npm run dev

The React app will be available on http://localhost:5173, pre-configured to talk to the backend at port 8086.

📸 Preview

Add a screenshot or GIF of the dashboard here — it makes a huge difference on GitHub!

![Student Admin System Dashboard](./frontend/src/assets/hero.png)
🛣️ Roadmap / Ideas for Improvement
 Move DB credentials to a .env file
 Add pagination & sorting to the student table
 Add authentication (admin login)
 Write unit tests for resolvers
 Dockerize backend + frontend + Postgres with docker-compose
 Deploy (Render/Railway for backend, Vercel/Netlify for frontend)
🧑‍💻 Author

Built by Mayur as a hands-on project exploring Go, GraphQL (gqlgen), Ent ORM, and React.
