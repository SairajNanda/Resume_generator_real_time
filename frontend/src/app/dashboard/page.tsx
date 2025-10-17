'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import { Plus, FileText, Briefcase, BookOpen, Trophy, Code, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, fetchUser } = useAuthStore();
  const { resumes, achievements, fetchResumes, fetchAchievements, createResume } = useResumeStore();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchResumes();
      fetchAchievements();
    }
  }, [isAuthenticated, fetchResumes, fetchAchievements]);

  const handleCreateResume = async () => {
    setIsCreating(true);
    try {
      const resume = await createResume({
        title: 'My Resume',
        template: 'modern',
        is_ai_generated_summary: true,
        is_public: false,
      });
      toast.success('Resume created successfully!');
      router.push(`/resume/${resume.id}`);
    } catch (error) {
      toast.error('Failed to create resume');
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.full_name}!</h1>
          <p className="text-gray-600 mt-2">Manage your achievements and resumes</p>
        </div>

        {/* Resumes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Resumes</h2>
            <Button onClick={handleCreateResume} isLoading={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Create Resume
            </Button>
          </div>
          
          {resumes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't created any resumes yet</p>
                <Button onClick={handleCreateResume} isLoading={isCreating}>
                  Create Your First Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <Link key={resume.id} href={`/resume/${resume.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>{resume.title}</CardTitle>
                      <p className="text-sm text-gray-500">Template: {resume.template}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Views: {resume.view_count}
                        </span>
                        <span className={`px-2 py-1 rounded ${resume.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {resume.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AchievementCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Internships"
              count={achievements.internships.length}
              href="/achievements/internships"
            />
            <AchievementCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Courses"
              count={achievements.courses.length}
              href="/achievements/courses"
            />
            <AchievementCard
              icon={<Trophy className="h-6 w-6" />}
              title="Hackathons"
              count={achievements.hackathons.length}
              href="/achievements/hackathons"
            />
            <AchievementCard
              icon={<Code className="h-6 w-6" />}
              title="Projects"
              count={achievements.projects.length}
              href="/achievements/projects"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Skills</h2>
            <Link href="/achievements/skills">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Skills
              </Button>
            </Link>
          </div>
          {achievements.skills.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Award className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No skills added yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-wrap gap-2">
              {achievements.skills.map((userSkill: any) => (
                <span
                  key={userSkill.id}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {userSkill.skill.name}
                  {userSkill.proficiency_level && ` • ${userSkill.proficiency_level}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ icon, title, count, href }: { icon: React.ReactNode; title: string; count: number; href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
            <div className="text-primary-600">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

