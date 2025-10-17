'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function CoursesPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { achievements, fetchAchievements, addCourse, deleteCourse } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    platform: '',
    instructor: '',
    completion_date: '',
    duration_hours: '',
    grade: '',
    description: '',
    skills_learned: '',
    certificate_url: '',
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchAchievements();
  }, [isAuthenticated, fetchAchievements, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        completion_date: formData.completion_date ? new Date(formData.completion_date).toISOString() : null,
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
      };
      await addCourse(data);
      toast.success('Course added successfully!');
      setShowForm(false);
      setFormData({
        course_name: '',
        platform: '',
        instructor: '',
        completion_date: '',
        duration_hours: '',
        grade: '',
        description: '',
        skills_learned: '',
        certificate_url: '',
      });
    } catch (error) {
      toast.error('Failed to add course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Courses & Certifications</h1>
            <p className="text-gray-600">Track your learning journey</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Course Name"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    placeholder="Coursera, Udemy, etc."
                    required
                  />
                  <Input
                    label="Instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                  />
                  <Input
                    label="Completion Date"
                    type="date"
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleChange}
                  />
                  <Input
                    label="Duration (hours)"
                    type="number"
                    name="duration_hours"
                    value={formData.duration_hours}
                    onChange={handleChange}
                  />
                  <Input
                    label="Grade/Score"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="95%, A+, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <Input
                  label="Skills Learned (comma-separated)"
                  name="skills_learned"
                  value={formData.skills_learned}
                  onChange={handleChange}
                  placeholder="Machine Learning, Python, TensorFlow"
                />
                <Input
                  label="Certificate URL"
                  name="certificate_url"
                  value={formData.certificate_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isSubmitting}>Save Course</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {achievements.courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses added yet</p>
              </CardContent>
            </Card>
          ) : (
            achievements.courses.map((course: any) => (
              <Card key={course.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{course.course_name}</h3>
                      <p className="text-primary-600">{course.platform}</p>
                      {course.instructor && <p className="text-sm text-gray-600">by {course.instructor}</p>}
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        {course.completion_date && <span>Completed: {formatDate(course.completion_date)}</span>}
                        {course.duration_hours && <span>• {course.duration_hours} hours</span>}
                        {course.grade && <span>• Grade: {course.grade}</span>}
                      </div>
                      {course.description && <p className="text-gray-700 mt-2">{course.description}</p>}
                      {course.skills_learned && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {course.skills_learned.split(',').map((skill: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {course.certificate_url && (
                        <a href={course.certificate_url} className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                          View Certificate →
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

