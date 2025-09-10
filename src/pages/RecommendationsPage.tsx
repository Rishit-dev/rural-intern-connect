import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Banknote, 
  Send, 
  Volume2, 
  FileText, 
  Mail,
  Building,
  Calendar,
  WifiOff,
  CheckCircle,
  X
} from 'lucide-react';
import { mockInternships, getPersonalizedRecommendations, type Internship } from '@/data/mockInternships';
import { useToast } from '@/hooks/use-toast';

export default function RecommendationsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recommendations, setRecommendations] = useState<Internship[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Internship[]>([]);
  const [locationFilter, setLocationFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showSMSDialog, setShowSMSDialog] = useState(false);
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if user has profile data
    const userProfileData = localStorage.getItem('userProfile');
    if (!userProfileData) {
      navigate('/signup');
      return;
    }

    const userProfile = JSON.parse(userProfileData);
    const personalizedRecommendations = getPersonalizedRecommendations(userProfile);
    setRecommendations(personalizedRecommendations);
    setFilteredRecommendations(personalizedRecommendations);

    // Listen for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  useEffect(() => {
    let filtered = recommendations;
    
    if (locationFilter !== 'all') {
      filtered = filtered.filter(internship => 
        internship.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(internship => 
        internship.sector.toLowerCase() === sectorFilter.toLowerCase()
      );
    }
    
    setFilteredRecommendations(filtered);
  }, [recommendations, locationFilter, sectorFilter]);

  const speakRecommendations = () => {
    if ('speechSynthesis' in window) {
      const text = filteredRecommendations.slice(0, 3).map((internship, index) => 
        `${index + 1}. ${internship.title} at ${internship.organization}. Location: ${internship.location}. Stipend: ${internship.stipend}. Duration: ${internship.duration}.`
      ).join(' ');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const sendSMSRecommendations = () => {
    toast({
      title: t('recommendations.smsSuccess'),
      description: "Check your phone for internship details and application links.",
    });
    setShowSMSDialog(false);
  };

  const applyToInternship = (internshipId: string) => {
    setAppliedInternships(prev => new Set(prev).add(internshipId));
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent. You'll receive updates via SMS.",
    });
  };

  const uniqueLocations = [...new Set(recommendations.map(i => i.location))];
  const uniqueSectors = [...new Set(recommendations.map(i => i.sector))];

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <h1 className="text-2xl font-bold mb-4">No Profile Found</h1>
            <p className="text-muted-foreground mb-6">
              Please create your profile first to get personalized recommendations.
            </p>
            <Button onClick={() => navigate('/signup')} variant="hero">
              Create Profile
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="offline-banner py-3 text-center"
          >
            <div className="container mx-auto px-4 flex items-center justify-center gap-2">
              <WifiOff className="h-4 w-4" />
              {t('recommendations.offline')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('recommendations.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('recommendations.subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button 
                variant="outline" 
                onClick={speakRecommendations}
                className="touch-target"
              >
                <Volume2 className="h-4 w-4" />
                {t('recommendations.speakRecommendations')}
              </Button>

              <Dialog open={showSMSDialog} onOpenChange={setShowSMSDialog}>
                <DialogTrigger asChild>
                  <Button variant="success" className="touch-target">
                    <Send className="h-4 w-4" />
                    {t('recommendations.sendSMS')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Recommendations via SMS</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-muted-foreground mb-4">
                      We'll send your top 3 internship recommendations to your registered mobile number.
                    </p>
                    <Button onClick={sendSMSRecommendations} className="w-full">
                      Send SMS Now
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('recommendations.filters.location')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('recommendations.filters.all')}</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('recommendations.filters.sector')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('recommendations.filters.all')}</SelectItem>
                  {uniqueSectors.map((sector) => (
                    <SelectItem key={sector} value={sector.toLowerCase()}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRecommendations.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  layout
                >
                  <Card className="p-6 hover:shadow-medium transition-smooth card-gradient border-0 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <Badge variant={internship.type === 'remote' ? 'secondary' : 'outline'}>
                        {internship.type}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-card-foreground mb-2">
                          {internship.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{internship.organization}</span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-success" />
                            <span className="font-semibold text-success">{internship.stipend}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-warning" />
                            <span>{internship.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-destructive" />
                            <span>Apply by: {internship.applicationDeadline}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {internship.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {internship.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{internship.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {internship.description}
                        </p>
                        
                        <div className="space-y-3">
                          <Button 
                            onClick={() => applyToInternship(internship.id)}
                            disabled={appliedInternships.has(internship.id)}
                            variant={appliedInternships.has(internship.id) ? "outline" : "success"}
                            size="sm"
                            className="w-full touch-target"
                          >
                            {appliedInternships.has(internship.id) ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Applied
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                {t('recommendations.apply')}
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedInternship(internship)}
                            className="w-full"
                          >
                            <FileText className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results */}
          {filteredRecommendations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later for new opportunities.
              </p>
              <Button 
                onClick={() => {
                  setLocationFilter('all');
                  setSectorFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Internship Details Dialog */}
      <Dialog open={!!selectedInternship} onOpenChange={() => setSelectedInternship(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedInternship && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedInternship.title}</h2>
                    <p className="text-muted-foreground mt-1">{selectedInternship.organization}</p>
                  </div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedInternship(null)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedInternship.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedInternship.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Skills Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      applyToInternship(selectedInternship.id);
                      setSelectedInternship(null);
                    }}
                    disabled={appliedInternships.has(selectedInternship.id)}
                    variant="success"
                    className="flex-1"
                  >
                    {appliedInternships.has(selectedInternship.id) ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}