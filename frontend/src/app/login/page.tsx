'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      // Handle different error response formats
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        // Handle Pydantic validation errors (array format)
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err: any) => err.msg).join(', ');
        } 
        // Handle simple string detail
        else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
        // Handle other formats
        else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <p className="text-gray-600 text-center mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

