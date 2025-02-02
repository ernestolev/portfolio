import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            if (user) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/admin');
            }
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('User not found');
                    break;
                case 'auth/wrong-password':
                    setError('Invalid password');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format');
                    break;
                default:
                    setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.layout}>
            <motion.div 
                className={styles.loginContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.error}>{error}</div>}
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;