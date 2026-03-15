import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Login({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, we simulate success. Later we will connect to Java.
        onLogin(formData.email);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
            <h2>Login to Medi-Hub</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" style={{ width: '100%', marginBottom: '10px' }} required />
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        style={{ width: '100%', marginBottom: '20px' }}
                        required
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer' }}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Login</button>
            </form>
        </div>
    );
}
export default Login;