"use client"

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

const Page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return; // Prevent double submit
        if (debounceTimeout.current) return; // Debounce: ignore if within debounce period
        if (password !== confirmPassword) {
            alert("Password do not match");
            return;
        }
        setLoading(true);
        debounceTimeout.current = setTimeout(() => {
            debounceTimeout.current = null;
        }, 1000); // 1 second debounce
        try {
            const res = await axios.post("/api/auth/register", { email, password });
            console.log(res);
            
            if (res.status) {
                alert("Registration successful!");
                router.push("/login");
            } else {
                throw new Error("Registration failed");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <p className="text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>
            </form>
        </div>
    );
}

export default Page