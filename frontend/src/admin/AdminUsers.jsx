import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getJoinedDate = (registeredUser) => {
    if (registeredUser.createdAt) {
      return new Date(registeredUser.createdAt).toLocaleDateString();
    }

    if (registeredUser._id?.length >= 8) {
      const timestamp = parseInt(registeredUser._id.slice(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString();
    }

    return "-";
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Only administrators can view users.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/auth/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load users.");
        }

        setUsers(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="admin-users">
      <div className="admin-users__header">
        <p className="admin-users__eyebrow">Administration</p>
        <h1>User Directory</h1>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="admin-users__table-wrapper">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((registeredUser) => (
                <tr key={registeredUser._id}>
                  <td className="admin-users__id" title={registeredUser._id}>
                    {registeredUser._id.slice(-8)}...
                  </td>
                  <td>{registeredUser.name}</td>
                  <td>{registeredUser.email}</td>
                  <td>
                    <span
                      className={`admin-users__role admin-users__role--${registeredUser.role}`}
                    >
                      {registeredUser.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{getJoinedDate(registeredUser)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;
