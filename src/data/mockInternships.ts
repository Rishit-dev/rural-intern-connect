export interface Internship {
  id: string;
  title: string;
  organization: string;
  location: string;
  sector: string;
  stipend: string;
  duration: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  type: 'remote' | 'onsite' | 'hybrid';
  skills: string[];
}

export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Digital India Web Development Intern',
    organization: 'Ministry of Electronics & IT',
    location: 'New Delhi',
    sector: 'Technology',
    stipend: '₹15,000/month',
    duration: '3 months',
    description: 'Work on government digital transformation projects and web applications.',
    requirements: ['HTML/CSS', 'JavaScript', 'React', 'Basic programming'],
    applicationDeadline: '2024-01-15',
    type: 'hybrid',
    skills: ['HTML', 'CSS', 'JavaScript', 'React']
  },
  {
    id: '2',
    title: 'Rural Development Research Intern',
    organization: 'Ministry of Rural Development',
    location: 'Mumbai',
    sector: 'Agriculture',
    stipend: '₹12,000/month',
    duration: '4 months',
    description: 'Conduct field research on rural development programs and policy implementation.',
    requirements: ['Research skills', 'Data analysis', 'Field work', 'Hindi/Local language'],
    applicationDeadline: '2024-01-20',
    type: 'onsite',
    skills: ['Research', 'Data Analysis', 'Hindi']
  },
  {
    id: '3',
    title: 'Public Health Data Analyst',
    organization: 'Ministry of Health',
    location: 'Bangalore',
    sector: 'Healthcare',
    stipend: '₹18,000/month',
    duration: '6 months',
    description: 'Analyze public health data and create reports for policy makers.',
    requirements: ['Data analysis', 'Excel/Sheets', 'Statistics', 'Report writing'],
    applicationDeadline: '2024-01-25',
    type: 'remote',
    skills: ['Data Analysis', 'Excel', 'Statistics']
  },
  {
    id: '4',
    title: 'Education Technology Assistant',
    organization: 'Ministry of Education',
    location: 'Chennai',
    sector: 'Education',
    stipend: '₹14,000/month',
    duration: '3 months',
    description: 'Support digital learning initiatives and educational content development.',
    requirements: ['Content creation', 'Basic tech skills', 'Teaching aptitude'],
    applicationDeadline: '2024-01-30',
    type: 'hybrid',
    skills: ['Content Creation', 'Teaching', 'Technology']
  },
  {
    id: '5',
    title: 'Environmental Monitoring Intern',
    organization: 'Ministry of Environment',
    location: 'Pune',
    sector: 'Environment',
    stipend: '₹13,000/month',
    duration: '4 months',
    description: 'Monitor environmental parameters and assist in climate change research.',
    requirements: ['Environmental science', 'Data collection', 'Field work'],
    applicationDeadline: '2024-02-05',
    type: 'onsite',
    skills: ['Environmental Science', 'Data Collection', 'Research']
  },
  {
    id: '6',
    title: 'Financial Inclusion Research',
    organization: 'Reserve Bank of India',
    location: 'Kolkata',
    sector: 'Finance',
    stipend: '₹16,000/month',
    duration: '3 months',
    description: 'Research financial inclusion initiatives and banking accessibility in rural areas.',
    requirements: ['Finance knowledge', 'Research skills', 'Analysis'],
    applicationDeadline: '2024-02-10',
    type: 'hybrid',
    skills: ['Finance', 'Research', 'Analysis']
  }
];

export const getFilteredInternships = (
  internships: Internship[],
  locationFilter?: string,
  sectorFilter?: string,
  skills?: string[]
): Internship[] => {
  return internships.filter(internship => {
    const matchesLocation = !locationFilter || locationFilter === 'all' || 
      internship.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesSector = !sectorFilter || sectorFilter === 'all' || 
      internship.sector.toLowerCase() === sectorFilter.toLowerCase();
    
    // Ensure skills is an array and internship.skills is an array
    const skillsArray = Array.isArray(skills) ? skills : [];
    const internshipSkills = Array.isArray(internship.skills) ? internship.skills : [];
    
    const matchesSkills = skillsArray.length === 0 || 
      skillsArray.some(skill => 
        internshipSkills.some(internshipSkill => 
          internshipSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    
    return matchesLocation && matchesSector && matchesSkills;
  });
};

export const getPersonalizedRecommendations = (
  userProfile: {
    skills: string[];
    location: string;
    sector: string;
    education: string;
  }
): Internship[] => {
  // Ensure userProfile.skills is an array
  const userSkills = Array.isArray(userProfile.skills) ? userProfile.skills : [];
  
  const filteredByPreferences = getFilteredInternships(
    mockInternships,
    userProfile.location,
    userProfile.sector,
    userSkills
  );

  // If we have matches based on preferences, return them
  if (filteredByPreferences.length > 0) {
    return filteredByPreferences.slice(0, 5);
  }

  // Otherwise, return skill-based matches
  const skillMatches = getFilteredInternships(
    mockInternships,
    undefined,
    undefined,
    userSkills
  );

  return skillMatches.slice(0, 5);
};
