'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import { Plus, Trash2, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function HackathonsPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { achievements, fetchAchievements, addHackathon, deleteHackathon } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hackathon_name: '',
    organizer: '',
    participation_date: '',
    team_size: '',
    position: '',
    project_name: '',
    project_description: '',
    technologies_used: '',
    project_url: '',
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
        participation_date: new Date(formData.participation_date).toISOString(),
        team_size: formData.team_size ? parseInt(formData.team_size) : null,
      };
      await addHackathon(data);
      toast.success('Hackathon added successfully!');
      setShowForm(false);
      setFormData({
        hackathon_name: '',
        organizer: '',
        participation_date: '',
        team_size: '',
        position: '',
        project_name: '',
        project_description: '',
        technologies_used: '',
        project_url: '',
      });
    } catch (error) {
      toast.error('Failed to add hackathon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hackathon?')) return;
    
    try {
      await deleteHackathon(id);
      toast.success('Hackathon deleted');
    } catch (error) {
      toast.error('Failed to delete hackathon');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Hackathons & Competitions</h1>
            <p className="text-gray-600">Showcase your competitive achievements</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Hackathon
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Hackathon</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Hackathon Name"
                    name="hackathon_name"
                    value={formData.hackathon_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Participation Date"
                    type="date"
                    name="participation_date"
                    value={formData.participation_date}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Team Size"
                    type="number"
                    name="team_size"
                    value={formData.team_size}
                    onChange={handleChange}
                  />
                  <Input
                    label="Position/Achievement"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Winner, Runner-up, Finalist, etc."
                  />
                  <Input
                    label="Project Name"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                  <textarea
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <Input
                  label="Technologies Used (comma-separated)"
                  name="technologies_used"
                  value={formData.technologies_used}
                  onChange={handleChange}
                  placeholder="React, Python, Firebase"
                />
                <Input
                  label="Project URL"
                  name="project_url"
                  value={formData.project_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isSubmitting}>Save Hackathon</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {achievements.hackathons.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hackathons added yet</p>
              </CardContent>
            </Card>
          ) : (
            achievements.hackathons.map((hackathon: any) => (
              <Card key={hackathon.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{hackathon.hackathon_name}</h3>
                      <p className="text-gray-600">{hackathon.organizer} • {formatDate(hackathon.participation_date)}</p>
                      {hackathon.position && (
                        <p className="text-primary-600 font-medium mt-1">{hackathon.position}</p>
                      )}
                      {hackathon.project_name && (
                        <p className="text-gray-900 font-medium mt-2">Project: {hackathon.project_name}</p>
                      )}
                      {hackathon.project_description && (
                        <p className="text-gray-700 mt-1">{hackathon.project_description}</p>
                      )}
                      {hackathon.technologies_used && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {hackathon.technologies_used.split(',').map((tech: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {hackathon.project_url && (
                        <a href={hackathon.project_url} className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                          View Project →
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(hackathon.id)}
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

