import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Verify admin role (redundant with ProtectedRoute but added for safety)
    if (currentUser.role !== 'admin') {
      toast.error(' only Admin can accses.');
      navigate('/user');
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
      toast.success('Users fetched successfully');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, { isBlocked: !user.isBlocked });
      fetchUsers();
      toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleBack = () => {
    navigate('/admindashboard');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-600">Users</h2>
        <button
          onClick={handleBack}
          className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Back
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{user.name}</td>
                <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{user.email}</td>
                <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{user.role}</td>
                <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                  {user.role === 'admin' ? (
                    <button
                      disabled
                      className="p-2 rounded text-white bg-gray-400 opacity-50 cursor-not-allowed text-sm sm:text-base"
                    >
                      Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleBlock(user)}
                      className={`p-2 rounded text-white text-sm sm:text-base ${
                        user.isBlocked ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-500 hover:bg-red-600'
                      } transition`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;