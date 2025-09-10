import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { VoiceInput } from '@/components/VoiceInput';
import { motion } from 'framer-motion';
import { Download, User, GraduationCap, MapPin, Briefcase, Users, Calendar } from 'lucide-react';
import { generateResumePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  name: string;
  education: string;
  skills: string;
  location: string;
  sector: string;
  gender: string;
  age: string;
}

export default function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    education: '',
    skills: '',
    location: '',
    sector: '',
    gender: '',
    age: ''
  });

  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  const calculateProgress = () => {
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / 7) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (calculateProgress() < 70) {
      toast({
        title: "Profile Incomplete",
        description: "Please fill at least 5 fields to get better recommendations",
        variant: "destructive"
      });
      return;
    }

    // Save user data to localStorage for recommendations
    localStorage.setItem('userProfile', JSON.stringify(formData));
    
    toast({
      title: "Profile Created Successfully!",
      description: "Finding your personalized internship recommendations...",
    });

    // Navigate to recommendations with a slight delay
    setTimeout(() => {
      navigate('/recommendations');
    }, 1500);
  };

  const handleGenerateResume = async () => {
    if (!formData.name || !formData.education) {
      toast({
        title: "Missing Information",
        description: "Please fill name and education to generate resume",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingResume(true);
    
    try {
      await generateResumePDF(formData);
      toast({
        title: "Resume Generated!",
        description: "Your resume has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const educationOptions = [
    "High School (10th)",
    "Higher Secondary (12th)", 
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD"
  ];

  const sectorOptions = [
    "Technology",
    "Healthcare", 
    "Education",
    "Agriculture",
    "Finance",
    "Environment",
    "Social Work",
    "Research"
  ];

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('signup.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('signup.subtitle')}
            </p>
          </div>

          <Card className="p-8 card-gradient border-0 shadow-medium">
            {/* Profile Strength */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">
                  {t('signup.profileStrength')}
                </Label>
                <span className="text-sm font-bold text-primary">
                  {calculateProgress()}%
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-3 progress-animate" />
              <p className="text-xs text-muted-foreground mt-1">
                Complete more fields for better recommendations
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {t('signup.fields.name')}
                </Label>
                <VoiceInput
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Education Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {t('signup.fields.education')}
                </Label>
                <Select value={formData.education} onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skills Field with Voice */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {t('signup.fields.skills')}
                </Label>
                <VoiceInput
                  value={formData.skills}
                  onChange={(value) => setFormData(prev => ({ ...prev, skills: value }))}
                  placeholder="e.g., HTML, Communication, Research, Hindi"
                />
                <p className="text-xs text-muted-foreground">
                  {t('signup.voiceHint')}
                </p>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t('signup.fields.location')}
                </Label>
                <VoiceInput
                  value={formData.location}
                  onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  placeholder="Enter your city or state"
                />
              </div>

              {/* Sector Interest */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {t('signup.fields.sector')}
                </Label>
                <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector of interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {t('signup.fields.gender')}
                </Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {t('signup.fields.age')}
                </Label>
                <VoiceInput
                  value={formData.age}
                  onChange={(value) => setFormData(prev => ({ ...prev, age: value }))}
                  placeholder="Enter your age"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateResume}
                  disabled={isGeneratingResume}
                  className="flex-1"
                >
                  <Download className="h-4 w-4" />
                  {isGeneratingResume ? 'Generating...' : t('signup.downloadResume')}
                </Button>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  className="flex-1"
                  disabled={calculateProgress() < 50}
                >
                  {t('signup.submit')}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}