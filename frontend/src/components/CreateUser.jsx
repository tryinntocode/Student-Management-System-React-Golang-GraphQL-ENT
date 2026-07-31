import React, { useState } from 'react';
import './CreateUser.css';

//store graphql mutation
//We define the CREATE_USER mutation in the React component 
//because the frontend must tell the GraphQL server 
//what operation to execute.

//mutation CreateUser --> these are the values which react will send 
//createUser --> calling the backend function (Call the createUser function in the Go backend using these values)

const CREATE_USER = `
  mutation CreateUser($name: String!, $email: String!, $dob: String!, $phNo: String!, $department: String!, $semester: String!) {
    createUser(name: $name, email: $email, dob: $dob, phNo: $phNo, department: $department, semester: $semester) {
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

//formats date from yyyy-mm-dd to dd-mm-yyyy
const formatDateToBackend = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

//dropdown data
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

//component for creating a new user
const CreateUser = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    phNo: '',
    department: '',
    semester: '',
  });

  //stores error message
  const [error, setError] = useState('');
  //stores loading state
  const [loading, setLoading] = useState(false);
  //stores success message
  const [success, setSuccess] = useState(false);

  //updates form data on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //submits form
  const handleSubmit = async (e) => {
    e.preventDefault();//prevents from refreshing 
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const formattedDob = formatDateToBackend(formData.dob);
      //This sends an HTTP POST request to the Go backend.
      const response = await fetch('http://localhost:8086/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //javascript object to json conversion
        body: JSON.stringify({
          query: CREATE_USER,
          variables: {
            ...formData,
            dob: formattedDob,
          },
        }),
      });
      //get response
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message || 'GraphQL execution failed');
      }

      setSuccess(true);

      setFormData({
        name: '',
        email: '',
        dob: '',
        phNo: '',
        department: '',
        semester: '',
      });
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      setError(err.message || 'Failed to create student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create Student Record</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Student created successfully!</div>}

        <div className="form-group-grid">
          <div className="form-group">
            <label htmlFor="create-name">Name</label>
            <input
              type="text"
              id="create-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mayur"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-email">Email Address</label>
            <input
              type="email"
              id="create-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. mayur@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-dob">Date of Birth</label>
            <input
              type="date"
              id="create-dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-phNo">Phone Number</label>
            <input
              type="tel"
              id="create-phNo"
              name="phNo"
              value={formData.phNo}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-department">Department</label>
            <select
              id="create-department"
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
            <label htmlFor="create-semester">Semester</label>
            <select
              id="create-semester"
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

        <button type="submit" disabled={loading} className="btn btn-success">
          {loading ? 'Adding Student...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
