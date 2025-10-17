'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      // Handle different error response formats
      let errorMessage = 'Registration failed. Please try again.';
      
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
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
          <p className="text-gray-600 text-center mt-2">Start building your professional resume</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone (Optional)"
              type="tel"
              name="phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Location (Optional)"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

