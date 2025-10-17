from typing import Dict, Any, List
from app.config import settings


class AIService:
    """Service for AI-powered resume generation features"""
    
    def __init__(self):
        self.has_openai = bool(settings.openai_api_key)
        self.has_hf = bool(settings.hf_token)
    
    def generate_resume_summary(self, user_data: Dict[str, Any]) -> str:
        """Generate a professional resume summary based on user's achievements"""
        
        if self.has_hf:
            return self._generate_with_huggingface(user_data)
        elif self.has_openai:
            return self._generate_with_openai(user_data)
        else:
            return self._generate_fallback_summary(user_data)
    
    def _generate_with_huggingface(self, user_data: Dict[str, Any]) -> str:
        """Generate summary using Hugging Face Router API"""
        try:
            from openai import OpenAI
            
            client = OpenAI(
                base_url="https://router.huggingface.co/v1",
                api_key=settings.hf_token,
            )
            
            prompt = self._build_prompt(user_data)
            
            completion = client.chat.completions.create(
                model="openai/gpt-oss-120b:groq",
                messages=[
                    {"role": "system", "content": "You are a professional resume writer. Create concise, impactful professional summaries."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return completion.choices[0].message.content.strip()
        except Exception as e:
            print(f"Hugging Face API error: {e}")
            return self._generate_fallback_summary(user_data)
    
    def _generate_with_openai(self, user_data: Dict[str, Any]) -> str:
        """Generate summary using OpenAI API"""
        try:
            from openai import OpenAI
            
            client = OpenAI(api_key=settings.openai_api_key)
            
            prompt = self._build_prompt(user_data)
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional resume writer. Create concise, impactful professional summaries."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._generate_fallback_summary(user_data)
    
    def _generate_fallback_summary(self, user_data: Dict[str, Any]) -> str:
        """Generate a rule-based summary without AI API"""
        
        full_name = user_data.get('full_name', 'Professional')
        bio = user_data.get('bio', '')
        
        # Extract key information
        internships = user_data.get('internships', [])
        courses = user_data.get('courses', [])
        hackathons = user_data.get('hackathons', [])
        projects = user_data.get('projects', [])
        skills = user_data.get('skills', [])
        
        # Count experiences
        total_internships = len(internships)
        total_courses = len(courses)
        total_hackathons = len(hackathons)
        total_projects = len(projects)
        
        # Get top skills
        skill_names = [s.get('skill', {}).get('name', '') for s in skills[:5]]
        
        # Build summary
        summary_parts = []
        
        if bio:
            summary_parts.append(bio)
        else:
            # Create a professional opening
            if total_internships > 0:
                summary_parts.append(f"Results-driven professional with experience from {total_internships} internship{'s' if total_internships > 1 else ''}.")
            else:
                summary_parts.append("Motivated and skilled professional passionate about technology and innovation.")
        
        # Add experience highlights
        experiences = []
        if total_internships > 0:
            experiences.append(f"{total_internships} internship{'s' if total_internships > 1 else ''}")
        if total_projects > 0:
            experiences.append(f"{total_projects} project{'s' if total_projects > 1 else ''}")
        if total_hackathons > 0:
            experiences.append(f"{total_hackathons} hackathon{'s' if total_hackathons > 1 else ''}")
        
        if experiences:
            summary_parts.append(f"Demonstrated expertise through {', '.join(experiences)}.")
        
        # Add skills
        if skill_names:
            skills_str = ', '.join(skill_names)
            summary_parts.append(f"Proficient in {skills_str}.")
        
        # Add continuous learning
        if total_courses > 0:
            summary_parts.append(f"Committed to continuous learning with {total_courses} completed course{'s' if total_courses > 1 else ''}.")
        
        # Closing statement
        summary_parts.append("Eager to contribute to innovative projects and drive meaningful impact.")
        
        return " ".join(summary_parts)
    
    def _build_prompt(self, user_data: Dict[str, Any]) -> str:
        """Build a prompt for OpenAI"""
        
        full_name = user_data.get('full_name', 'the candidate')
        internships = user_data.get('internships', [])
        courses = user_data.get('courses', [])
        hackathons = user_data.get('hackathons', [])
        projects = user_data.get('projects', [])
        skills = user_data.get('skills', [])
        
        prompt = f"Create a professional resume summary for {full_name} based on the following information:\n\n"
        
        if internships:
            prompt += f"Internships: {len(internships)} positions at companies including "
            prompt += ", ".join([i.get('company_name', '') for i in internships[:3]])
            prompt += "\n"
        
        if projects:
            prompt += f"Projects: {len(projects)} projects "
            project_techs = []
            for p in projects[:3]:
                if p.get('technologies'):
                    project_techs.append(p['technologies'])
            if project_techs:
                prompt += f"using technologies like {', '.join(project_techs[:5])}"
            prompt += "\n"
        
        if hackathons:
            prompt += f"Hackathons: Participated in {len(hackathons)} hackathons\n"
        
        if courses:
            prompt += f"Courses: Completed {len(courses)} courses\n"
        
        if skills:
            skill_names = [s.get('skill', {}).get('name', '') for s in skills[:8]]
            prompt += f"Skills: {', '.join(skill_names)}\n"
        
        prompt += "\nWrite a compelling 3-4 sentence professional summary that highlights their key strengths and value proposition."
        
        return prompt
    
    def suggest_skills(self, achievements: List[Dict[str, Any]]) -> List[str]:
        """Suggest skills based on achievements"""
        
        suggested_skills = set()
        
        # Extract from internships
        for item in achievements:
            skills_used = item.get('skills_used', '') or item.get('skills_learned', '') or item.get('technologies_used', '') or item.get('technologies', '')
            if skills_used:
                skills_list = [s.strip() for s in skills_used.split(',')]
                suggested_skills.update(skills_list)
        
        return list(suggested_skills)


# Singleton instance
ai_service = AIService()

