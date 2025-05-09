import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Submitting login form with POST request', { email, password });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            console.log('Response received:', response);

            if (!response.ok) {
                const text = await response.text();
                console.error('Raw response:', text);
                try {
                    const data = JSON.parse(text);
                    if (response.status === 405) {
                        setError('Method not allowed. Please ensure the request is sent as POST.');
                    } else {
                        setError(data.message || 'Invalid credentials');
                    }
                } catch (jsonError) {
                    setError('Server returned an invalid response');
                }
                return;
            }

            const data = await response.json();
            console.log('Response data:', data); // Log the full response
            localStorage.setItem('token', data.token || '');
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('Login successful, navigating to dashboard');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                maxWidth: '400px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 className="text-center mb-4">Admin Login</h2>
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} method="POST">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
