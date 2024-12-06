import React, { useState, useEffect } from 'react';
const AccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  // Fetch account details 
  useEffect(() => {
    const loadAccountDetails = async () => {
      try {
        const response = await fetch('/getAccountDetails');
        const data = await response.json();
  
        if (response.ok) {
          setAccount({ username: data.username,
          createdDate: data.createdDate, });
          setIsPremium(data.premium);
        } else {
          console.error(data.error || 'Error fetching account details');
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
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
  const handlePremiumToggle = async () => {
    const newStatus = !isPremium;

    try {
        const response = await fetch('/updatePremiumStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ premium: newStatus }),
        });

        if (response.ok) {
            setIsPremium(newStatus);
        } else {
            console.error('Failed to update premium status');
        }
    } catch (error) {
        console.error('Error updating premium status:', error);
    }
  };
  return (
    <div className="account-details">
        {account ? (
            <>
                <h3>Account Details</h3>
                <p><strong>Username:</strong> {account.username}</p>
                <p><strong>Date Created:</strong> {new Date(account.createdDate).toLocaleDateString()}</p>
                <p><strong>Premium Account:</strong> {isPremium ? 'Yes' : 'No'}</p>
                <button className="btn btn-premium" onClick={handlePremiumToggle}>
                    {isPremium ? 'Cancel Premium' : 'Upgrade to Premium'}
                </button><br></br>
                <form onSubmit={handlePasswordChange} className="password-form">
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="btn btn-submit">Change Password</button>
                </form>
            </>
        ) : (
            <p>Loading account details...</p>
        )}
    </div>
  );
};
export default AccountDetails;