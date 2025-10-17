import { create } from 'zustand';
import api from '@/lib/api';

interface Resume {
  id: number;
  title: string;
  template: string;
  summary: string;
  is_ai_generated_summary: boolean;
  configuration: any;
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface Achievement {
  internships: any[];
  courses: any[];
  hackathons: any[];
  projects: any[];
  skills: any[];
}

interface ResumeState {
  resumes: Resume[];
  currentResume: any | null;
  achievements: Achievement;
  isLoading: boolean;
  
  // Resume operations
  fetchResumes: () => Promise<void>;
  fetchResume: (id: number) => Promise<void>;
  createResume: (data: any) => Promise<Resume>;
  updateResume: (id: number, data: any) => Promise<void>;
  deleteResume: (id: number) => Promise<void>;
  regenerateSummary: (id: number) => Promise<void>;
  
  // Achievement operations
  fetchAchievements: () => Promise<void>;
  addInternship: (data: any) => Promise<void>;
  addCourse: (data: any) => Promise<void>;
  addHackathon: (data: any) => Promise<void>;
  addProject: (data: any) => Promise<void>;
  addSkill: (data: any) => Promise<void>;
  deleteInternship: (id: number) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  deleteHackathon: (id: number) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResume: null,
  achievements: {
    internships: [],
    courses: [],
    hackathons: [],
    projects: [],
    skills: [],
  },
  isLoading: false,

  // Resume operations
  fetchResumes: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/api/resumes');
      set({ resumes: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchResume: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/api/resumes/${id}`);
      set({ currentResume: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createResume: async (data: any) => {
    const response = await api.post('/api/resumes', data);
    set((state) => ({ resumes: [...state.resumes, response.data] }));
    return response.data;
  },

  updateResume: async (id: number, data: any) => {
    const response = await api.put(`/api/resumes/${id}`, data);
    set((state) => ({
      resumes: state.resumes.map((r) => (r.id === id ? response.data : r)),
      currentResume: state.currentResume?.id === id ? { ...state.currentResume, ...response.data } : state.currentResume,
    }));
  },

  deleteResume: async (id: number) => {
    await api.delete(`/api/resumes/${id}`);
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
    }));
  },

  regenerateSummary: async (id: number) => {
    const response = await api.post(`/api/resumes/${id}/regenerate-summary`);
    set((state) => ({
      currentResume: state.currentResume?.id === id ? { ...state.currentResume, summary: response.data.summary } : state.currentResume,
    }));
  },

  // Achievement operations
  fetchAchievements: async () => {
    set({ isLoading: true });
    try {
      const [internships, courses, hackathons, projects, skills] = await Promise.all([
        api.get('/api/achievements/internships'),
        api.get('/api/achievements/courses'),
        api.get('/api/achievements/hackathons'),
        api.get('/api/achievements/projects'),
        api.get('/api/achievements/skills'),
      ]);

      set({
        achievements: {
          internships: internships.data,
          courses: courses.data,
          hackathons: hackathons.data,
          projects: projects.data,
          skills: skills.data,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addInternship: async (data: any) => {
    const response = await api.post('/api/achievements/internships', data);
    set((state) => ({
      achievements: {
        ...state.achievements,
        internships: [...state.achievements.internships, response.data],
      },
    }));
  },

  addCourse: async (data: any) => {
    const response = await api.post('/api/achievements/courses', data);
    set((state) => ({
      achievements: {
        ...state.achievements,
        courses: [...state.achievements.courses, response.data],
      },
    }));
  },

  addHackathon: async (data: any) => {
    const response = await api.post('/api/achievements/hackathons', data);
    set((state) => ({
      achievements: {
        ...state.achievements,
        hackathons: [...state.achievements.hackathons, response.data],
      },
    }));
  },

  addProject: async (data: any) => {
    const response = await api.post('/api/achievements/projects', data);
    set((state) => ({
      achievements: {
        ...state.achievements,
        projects: [...state.achievements.projects, response.data],
      },
    }));
  },

  addSkill: async (data: any) => {
    const response = await api.post('/api/achievements/skills', data);
    set((state) => ({
      achievements: {
        ...state.achievements,
        skills: [...state.achievements.skills, response.data],
      },
    }));
  },

  deleteInternship: async (id: number) => {
    await api.delete(`/api/achievements/internships/${id}`);
    set((state) => ({
      achievements: {
        ...state.achievements,
        internships: state.achievements.internships.filter((i: any) => i.id !== id),
      },
    }));
  },

  deleteCourse: async (id: number) => {
    await api.delete(`/api/achievements/courses/${id}`);
    set((state) => ({
      achievements: {
        ...state.achievements,
        courses: state.achievements.courses.filter((c: any) => c.id !== id),
      },
    }));
  },

  deleteHackathon: async (id: number) => {
    await api.delete(`/api/achievements/hackathons/${id}`);
    set((state) => ({
      achievements: {
        ...state.achievements,
        hackathons: state.achievements.hackathons.filter((h: any) => h.id !== id),
      },
    }));
  },

  deleteProject: async (id: number) => {
    await api.delete(`/api/achievements/projects/${id}`);
    set((state) => ({
      achievements: {
        ...state.achievements,
        projects: state.achievements.projects.filter((p: any) => p.id !== id),
      },
    }));
  },

  deleteSkill: async (id: number) => {
    await api.delete(`/api/achievements/skills/${id}`);
    set((state) => ({
      achievements: {
        ...state.achievements,
        skills: state.achievements.skills.filter((s: any) => s.id !== id),
      },
    }));
  },
}));

