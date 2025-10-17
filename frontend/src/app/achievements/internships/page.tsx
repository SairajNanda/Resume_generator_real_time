'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function InternshipsPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { achievements, fetchAchievements, addInternship, deleteInternship } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    achievements: '',
    skills_used: '',
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
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };
      await addInternship(data);
      toast.success('Internship added successfully!');
      setShowForm(false);
      setFormData({
        company_name: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        achievements: '',
        skills_used: '',
      });
    } catch (error) {
      toast.error('Failed to add internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    
    try {
      await deleteInternship(id);
      toast.success('Internship deleted');
    } catch (error) {
      toast.error('Failed to delete internship');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Internships</h1>
            <p className="text-gray-600">Manage your internship experiences</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Internship
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Internship</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                  {!formData.is_current && (
                    <Input
                      label="End Date"
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_current"
                      checked={formData.is_current}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Currently working here</label>
                  </div>
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
                  label="Key Achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                />
                <Input
                  label="Skills Used (comma-separated)"
                  name="skills_used"
                  value={formData.skills_used}
                  onChange={handleChange}
                  placeholder="Python, React, AWS"
                />
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isSubmitting}>Save Internship</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {achievements.internships.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No internships added yet</p>
              </CardContent>
            </Card>
          ) : (
            achievements.internships.map((internship: any) => (
              <Card key={internship.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{internship.position}</h3>
                      <p className="text-primary-600">{internship.company_name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(internship.start_date)} - {internship.is_current ? 'Present' : formatDate(internship.end_date)}
                        {internship.location && ` • ${internship.location}`}
                      </p>
                      {internship.description && (
                        <p className="text-gray-700 mt-2">{internship.description}</p>
                      )}
                      {internship.skills_used && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {internship.skills_used.split(',').map((skill: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                        {internship.verification_status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(internship.id)}
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

