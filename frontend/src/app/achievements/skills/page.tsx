'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/Card';
import { Plus, Trash2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillsPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { achievements, fetchAchievements, addSkill, deleteSkill } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skill_name: '',
    category: '',
    proficiency_level: 'Intermediate',
    years_of_experience: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
      };
      await addSkill(data);
      toast.success('Skill added successfully!');
      setShowForm(false);
      setFormData({
        skill_name: '',
        category: '',
        proficiency_level: 'Intermediate',
        years_of_experience: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await deleteSkill(id);
      toast.success('Skill deleted');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const groupedSkills = achievements.skills.reduce((acc: any, userSkill: any) => {
    const category = userSkill.skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(userSkill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Skills</h1>
            <p className="text-gray-600">Manage your technical and soft skills</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Skill Name"
                    name="skill_name"
                    value={formData.skill_name}
                    onChange={handleChange}
                    placeholder="e.g., Python, React, Communication"
                    required
                  />
                  <Input
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Programming, Framework, Tool, Soft Skill"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                    <select
                      name="proficiency_level"
                      value={formData.proficiency_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>
                  <Input
                    label="Years of Experience"
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    placeholder="1, 2, 3..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isSubmitting}>Add Skill</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {achievements.skills.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No skills added yet</p>
              </CardContent>
            </Card>
          ) : (
            Object.keys(groupedSkills).map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {groupedSkills[category].map((userSkill: any) => (
                      <div key={userSkill.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{userSkill.skill.name}</p>
                          <div className="flex gap-2 text-sm text-gray-600 mt-1">
                            <span>{userSkill.proficiency_level}</span>
                            {userSkill.years_of_experience && (
                              <>
                                <span>•</span>
                                <span>{userSkill.years_of_experience} yr{userSkill.years_of_experience > 1 ? 's' : ''}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(userSkill.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
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

