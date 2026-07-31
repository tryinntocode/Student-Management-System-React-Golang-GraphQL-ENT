import React, { useState, useEffect } from 'react';
import './UpdateUser.css';

const UPDATE_USER = `
  mutation UpdateUser($id: ID!, $name: String!, $email: String!, $dob: String!, $phNo: String!, $department: String!, $semester: String!) {
    updateUser(id: $id, name: $name, email: $email, dob: $dob, phNo: $phNo, department: $department, semester: $semester) {
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

const formatDateToBackend = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const formatDateToFrontend = (dateStr) => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

const DEPARTMENTS = [
  "CSE",
  "ISE",
  "ECE",
  "EEE",
  "ME",
  "CE"
];

const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

const UpdateUser = ({ user, onUserUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    phNo: '',
    department: '',
    semester: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if selected user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        dob: formatDateToFrontend(user.dob),
        phNo: user.phNo,
        department: user.department,
        semester: user.semester || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedDob = formatDateToBackend(formData.dob);
      const response = await fetch('http://localhost:8086/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //javascript to json
        body: JSON.stringify({
          query: UPDATE_USER,
          variables: {
            ...formData,
            id: user.id,
            dob: formattedDob,
          },
        }),
      });
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message || 'GraphQL execution failed');
      }
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (err) {
      setError(err.message || 'Failed to update student details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card editing-card">
      <div className="card-header flex-header">
        <h2>Update Student Record (ID: {user.id})</h2>
        <button onClick={onCancel} className="btn btn-secondary btn-sm">Cancel</button>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group-grid">
          <div className="form-group">
            <label htmlFor="update-name">Name</label>
            <input
              type="text"
              id="update-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="update-email">Email Address</label>
            <input
              type="email"
              id="update-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="update-dob">Date of Birth</label>
            <input
              type="date"
              id="update-dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="update-phNo">Phone Number</label>
            <input
              type="tel"
              id="update-phNo"
              name="phNo"
              value={formData.phNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="update-department">Department</label>
            <select
              id="update-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Department --</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="update-semester">Semester</label>
            <select
              id="update-semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Semester --</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions mt-3">
          <button type="submit" disabled={loading} className="btn btn-success">
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
