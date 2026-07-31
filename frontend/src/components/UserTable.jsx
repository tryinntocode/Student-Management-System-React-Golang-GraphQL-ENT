import React, { useState } from 'react';
import './UserTable.css';

const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const UserTable = ({ users, loading, error, onEdit, onUserDeleted }) => {
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete student ID ${id}?`)) {
      return;
    }

    setDeleteLoadingId(id);
    try {
      const response = await fetch('http://localhost:8086/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_USER,
          variables: { id },
        }),
      });
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message || 'GraphQL execution failed');
      }

      if (onUserDeleted) {
        onUserDeleted();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete student.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="mt-2">Loading student records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-danger">
          <strong>Error loading records:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex-header">
        <h2>Student Records</h2>
        <span className="badge">{users.length} Total</span>
      </div>
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Student Name</th>
              <th>Email Address</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Semester</th>
              <th className="text-center">Update</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center empty-row">
                  No student records found. Create one above!
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.id}</strong></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.dob}</td>
                  <td>{user.phNo}</td>
                  <td>{user.department}</td>
                  <td>{user.semester}</td>
                  <td className="text-center">
                    <button
                      onClick={() => onEdit(user)}
                      className="btn btn-sm btn-primary-outline"
                    >
                      Update
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteLoadingId === user.id}
                      className="btn btn-sm btn-danger-outline"
                    >
                      {deleteLoadingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
