'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { formatDate } from '@/lib/utils';
import { 
  Download, 
  RefreshCw, 
  Settings, 
  Eye, 
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = parseInt(params.id as string);
  
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { currentResume, fetchResume, updateResume, regenerateSummary, exportPDF } = useResumeStore();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchResume(resumeId);
  }, [isAuthenticated, resumeId, fetchResume, router]);

  const handleRegenerateSummary = async () => {
    setIsRegenerating(true);
    try {
      await regenerateSummary(resumeId);
      await fetchResume(resumeId);
      toast.success('Summary regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate summary');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      await updateResume(resumeId, { is_public: !currentResume?.is_public });
      await fetchResume(resumeId);
      toast.success(currentResume?.is_public ? 'Resume is now private' : 'Resume is now public');
    } catch (error) {
      toast.error('Failed to update resume');
    }
  };

  const handleTemplateChange = async (template: string) => {
    setSelectedTemplate(template);
    try {
      await updateResume(resumeId, { template });
      await fetchResume(resumeId);
      toast.success('Template updated!');
    } catch (error) {
      toast.error('Failed to update template');
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportPDF(resumeId);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  const userData = currentResume.user_data;
  const template = currentResume.template || selectedTemplate;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{currentResume.title}</h1>
            <p className="text-gray-600">Template: {template}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTogglePublic}>
              {currentResume.is_public ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {currentResume.is_public ? 'Make Private' : 'Make Public'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              isLoading={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Templates */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Choose Template</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['modern', 'classic', 'minimal', 'creative'].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTemplateChange(t)}
                      className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                        template === t
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">AI Summary</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Generate a professional summary based on your achievements
                </p>
                <Button 
                  onClick={handleRegenerateSummary} 
                  isLoading={isRegenerating}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Summary
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Statistics</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Internships:</span>
                  <span className="font-medium">{userData.internships?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Courses:</span>
                  <span className="font-medium">{userData.courses?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects:</span>
                  <span className="font-medium">{userData.projects?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills:</span>
                  <span className="font-medium">{userData.skills?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className={`resume-preview ${template}-template`}>
                <ResumePreview resume={currentResume} userData={userData} template={template} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumePreview({ resume, userData, template }: any) {
  const templates: any = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
  };

  const TemplateComponent = templates[template] || ModernTemplate;
  return <TemplateComponent resume={resume} userData={userData} />;
}

function ModernTemplate({ resume, userData }: any) {
  return (
    <div className="p-8 bg-white">
      {/* Header */}
      <div className="border-b-4 border-primary-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{userData.full_name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {userData.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {userData.email}
            </div>
          )}
          {userData.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {userData.phone}
            </div>
          )}
          {userData.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {userData.location}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-2">
          {userData.linkedin_url && (
            <a href={userData.linkedin_url} className="text-primary-600 hover:underline flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          {userData.github_url && (
            <a href={userData.github_url} className="text-primary-600 hover:underline flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
          {userData.portfolio_url && (
            <a href={userData.portfolio_url} className="text-primary-600 hover:underline flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {userData.internships?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Experience</h2>
          {userData.internships.map((intern: any) => (
            <div key={intern.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{intern.position}</h3>
                  <p className="text-primary-600">{intern.company_name}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(intern.start_date)} - {intern.is_current ? 'Present' : formatDate(intern.end_date)}
                </span>
              </div>
              {intern.description && <p className="text-gray-700 mt-1">{intern.description}</p>}
              {intern.achievements && <p className="text-gray-700 mt-1">• {intern.achievements}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {userData.projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Projects</h2>
          {userData.projects.map((project: any) => (
            <div key={project.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{project.project_name}</h3>
                <span className="text-sm text-gray-600">
                  {formatDate(project.start_date)} - {project.is_ongoing ? 'Ongoing' : formatDate(project.end_date)}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{project.description}</p>
              {project.technologies && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Technologies:</strong> {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education/Courses */}
      {userData.courses?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Education & Certifications</h2>
          {userData.courses.map((course: any) => (
            <div key={course.id} className="mb-3">
              <h3 className="font-semibold text-gray-900">{course.course_name}</h3>
              <p className="text-primary-600">{course.platform}</p>
              {course.completion_date && (
                <p className="text-sm text-gray-600">{formatDate(course.completion_date)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {userData.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((userSkill: any) => (
              <span key={userSkill.id} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {userSkill.skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hackathons */}
      {userData.hackathons?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Hackathons & Competitions</h2>
          {userData.hackathons.map((hackathon: any) => (
            <div key={hackathon.id} className="mb-3">
              <h3 className="font-semibold text-gray-900">{hackathon.hackathon_name}</h3>
              <p className="text-gray-600">{hackathon.organizer} • {formatDate(hackathon.participation_date)}</p>
              {hackathon.position && <p className="text-primary-600">{hackathon.position}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClassicTemplate({ resume, userData }: any) {
  return (
    <div className="p-8 bg-white font-serif">
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-2">{userData.full_name}</h1>
        <div className="text-sm space-x-4">
          {userData.email && <span>{userData.email}</span>}
          {userData.phone && <span>•</span>}
          {userData.phone && <span>{userData.phone}</span>}
          {userData.location && <span>•</span>}
          {userData.location && <span>{userData.location}</span>}
        </div>
      </div>
      {/* Similar structure to Modern but with classic styling */}
      <ModernTemplate resume={resume} userData={userData} />
    </div>
  );
}

function MinimalTemplate({ resume, userData }: any) {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-light mb-1">{userData.full_name}</h1>
      <p className="text-sm text-gray-600 mb-6">
        {[userData.email, userData.phone, userData.location].filter(Boolean).join(' • ')}
      </p>
      {/* Minimal version of content */}
      <ModernTemplate resume={resume} userData={userData} />
    </div>
  );
}

function CreativeTemplate({ resume, userData }: any) {
  return (
    <div className="p-8 bg-gradient-to-br from-primary-50 to-white">
      <div className="bg-primary-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">{userData.full_name}</h1>
        <p className="text-primary-100">{userData.email} • {userData.location}</p>
      </div>
      {/* Creative version of content */}
      <div className="bg-white p-6 rounded-lg">
        <ModernTemplate resume={resume} userData={userData} />
      </div>
    </div>
  );
}

