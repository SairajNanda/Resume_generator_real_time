'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import { Plus, Trash2, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { achievements, fetchAchievements, addProject, deleteProject } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: 'Personal',
    start_date: '',
    end_date: '',
    is_ongoing: false,
    description: '',
    technologies: '',
    role: '',
    github_url: '',
    live_url: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await addProject(data);
      toast.success('Project added successfully!');
      setShowForm(false);
      setFormData({
        project_name: '',
        project_type: 'Personal',
        start_date: '',
        end_date: '',
        is_ongoing: false,
        description: '',
        technologies: '',
        role: '',
        github_url: '',
        live_url: '',
      });
    } catch (error) {
      toast.error('Failed to add project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-600">Showcase your work and contributions</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Project Name"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option>Personal</option>
                      <option>Academic</option>
                      <option>Professional</option>
                    </select>
                  </div>
                  <Input
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                  {!formData.is_ongoing && (
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
                      name="is_ongoing"
                      checked={formData.is_ongoing}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Ongoing project</label>
                  </div>
                  <Input
                    label="Your Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <Input
                  label="Technologies (comma-separated)"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="GitHub URL"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                  <Input
                    label="Live URL"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isSubmitting}>Save Project</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {achievements.projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No projects added yet</p>
              </CardContent>
            </Card>
          ) : (
            achievements.projects.map((project: any) => (
              <Card key={project.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{project.project_name}</h3>
                      <p className="text-sm text-gray-600">
                        {project.project_type} • {formatDate(project.start_date)} - {project.is_ongoing ? 'Ongoing' : formatDate(project.end_date)}
                      </p>
                      {project.role && <p className="text-primary-600 text-sm">{project.role}</p>}
                      <p className="text-gray-700 mt-2">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.split(',').map((tech: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3 mt-2">
                        {project.github_url && (
                          <a href={project.github_url} className="text-sm text-primary-600 hover:underline">
                            GitHub →
                          </a>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} className="text-sm text-primary-600 hover:underline">
                            Live Demo →
                          </a>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
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

