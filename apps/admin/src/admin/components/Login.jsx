import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/v1/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                login(data.data.user, data.data.token);
                toast.success('Login successful!');
                navigate('/');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Network error, please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-400/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10">
                <div className="glass-card rounded-[2rem] p-8 lg:p-12 border border-white/5 shadow-2xl backdrop-blur-xl bg-white/[0.02]">
                    <div className="text-center mb-10">
                        <div className="size-20 bg-yellow-400/10 rounded-3xl flex items-center justify-center border border-yellow-400/20 mx-auto mb-6 group transition-transform hover:scale-110">
                            <span className="material-symbols-outlined text-yellow-400 text-5xl group-hover:rotate-12 transition-transform">lock_person</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">Admin Login</h1>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sign in to manage your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors">person</span>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 focus:border-yellow-400/50 focus:ring-0 rounded-2xl pl-12 py-4 text-sm text-white placeholder-gray-600 transition-all font-medium"
                                    placeholder="Admin username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 focus:border-yellow-400/50 focus:ring-0 rounded-2xl pl-12 py-4 text-sm text-white placeholder-gray-600 transition-all font-medium"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-yellow-400 text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:bg-yellow-300 active:scale-[0.98] shadow-lg shadow-yellow-400/20 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                "Login Now"
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Welcome back, please login below.</p>
                    </div>
                </div>
                
                <p className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-8 opacity-50">
                    © 2024 DECENTRALIZED PROTOCOL FOUNDATION
                </p>
            </div>
        </div>
    );
};

export default Login;
