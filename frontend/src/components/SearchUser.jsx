import React, { useState } from 'react';
import './SearchUser.css';

//graphql query to fetch student by id
const GET_USER_BY_ID = `
  query GetUserById($id: ID!) {
    getUser(id: $id) {
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

const SearchUser = () => {
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    //If no ID is entered, it doesn't continue.
    if (!searchId.trim()) return;

    setError('');
    setStudent(null);
    setLoading(true);
    setSearched(true);

    //fetch -> sends graphql request
    try {
      const response = await fetch('http://localhost:8086/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_USER_BY_ID,
          variables: { id: searchId.trim() },
        }),
      });
      //reads the response ->converts response to json
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message || 'GraphQL execution failed');
      }
      //gets student(data from response)
      const data = result.data.getUser;
      if (data) {
        setStudent(data);
      } else {
        setError('No student found with the provided ID.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch student details. Verify the ID exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchId('');
    setStudent(null);
    setError('');
    setSearched(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Search Student by ID</h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group flex-grow">
            <label htmlFor="search-id">Student ID</label>
            <div className="input-group">
              <input
                type="text"
                id="search-id"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Student ID (e.g. 1)"
                required
              />
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Searching...' : 'Search'}
              </button>
              {searched && (
                <button type="button" onClick={handleClear} className="btn btn-secondary">
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {student && (
          <div className="result-card mt-3">
            <h3>Student Details</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">ID:</span>
                <span className="result-value">{student.id}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Name:</span>
                <span className="result-value">{student.name}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Email:</span>
                <span className="result-value">{student.email}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Date of Birth:</span>
                <span className="result-value">{student.dob}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Phone:</span>
                <span className="result-value">{student.phNo}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Department:</span>
                <span className="result-value">{student.department}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Semester:</span>
                <span className="result-value">{student.semester}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
