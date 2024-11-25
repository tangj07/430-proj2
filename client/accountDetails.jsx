import React, { useState, useEffect } from 'react';

const AccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch account details 
  useEffect(() => {
    const loadAccountDetails = async () => {
      const response = await fetch('/getAccountUsernameType');
      const data = await response.json();
      if (data.account) {
        setAccount(data.account);
      } else {
        console.error('Error fetching account details');
      }
    };
    loadAccountDetails();
  }, []);

  // Handle password change form submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch('/changePass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass: newPassword, pass2: confirmPassword }),
    });

    const result = await response.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert('Password successfully changed!');
    }
  };

  return (
    <div className="account">
      {account ? (
        <>
          <h3>Account Details</h3>
          <p>Username: {account.username}</p>
          <p>Date Created: {new Date(account.createdAt).toLocaleDateString()}</p>

          <form onSubmit={handlePasswordChange}>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button type="submit">Change Password</button>
          </form>
        </>
      ) : (
        <p>Loading account details...</p>
      )}
    </div>
  );
};

export default AccountDetails;
