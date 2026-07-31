import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CreateUser from './components/CreateUser';
import SearchUser from './components/SearchUser';
import UserTable from './components/UserTable';
import UpdateUser from './components/UpdateUser';
import './App.css';

const GET_ALL_USERS = `
  query GetAllUsers {
    user {
      id
      name
      email
      dob
      phNo
      department
      semester
    }
  }
`;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8086/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: GET_ALL_USERS }),
      });
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message || 'GraphQL execution failed');
      }
      const data = result.data.user;
      const sorted = (data || []).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
      setUsers(sorted);
    } catch (err) {
      setError(err.message || 'Failed to connect to the backend server. Please make sure the Go server is running on port 8086.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);

    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleUserUpdated = () => {
    setEditingUser(null);
    fetchUsers();
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div id="form-section" className="grid-2-col">
          {editingUser ? (
            <UpdateUser
              user={editingUser}
              onUserUpdated={handleUserUpdated}
              onCancel={() => setEditingUser(null)}
            />
          ) : (
            <CreateUser onUserCreated={handleUserCreated} />
          )}

          <SearchUser />
        </div>

        <div className="table-section">
          <UserTable
            users={users}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onUserDeleted={handleUserDeleted}
          />
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Student Admin System. Built with Go, GraphQL, Ent & React.</p>
      </footer>
    </div>
  );
}

export default App;
