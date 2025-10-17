'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { FileText, Award, Zap, Shield, TrendingUp, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Build Your Professional Resume
              <br />
              <span className="text-primary-200">Automatically</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Create dynamic, verified resumes based on your real achievements from internships, 
              courses, hackathons, and projects. Let AI do the heavy lifting.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary-600" />}
              title="Real-Time Updates"
              description="Your resume automatically updates when you add new achievements, courses, or projects."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary-600" />}
              title="Verified Achievements"
              description="Link to certificates and verify your accomplishments from multiple platforms."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-primary-600" />}
              title="AI-Powered Summaries"
              description="Let AI generate compelling professional summaries based on your experiences."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary-600" />}
              title="Multiple Templates"
              description="Choose from modern, classic, minimal, or creative resume templates."
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary-600" />}
              title="Career Tracking"
              description="Track your professional growth across internships, hackathons, and courses."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary-600" />}
              title="Skill Management"
              description="Automatically extract and verify skills from your various experiences."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Future?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students and professionals creating verified, dynamic resumes.
          </p>
          <Link href="/register">
            <Button size="lg" variant="primary">
              Create Your Resume Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

