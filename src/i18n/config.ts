import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        profile: "Profile",
        recommendations: "Internships"
      },
      
      // Landing Page
      landing: {
        headline: "Your One-Step Solution to All Government Internships",
        subtext: "Simple. Personalized. Accessible for everyone.",
        getStarted: "Get Started",
        learnMore: "Learn More",
        features: {
          simple: "Simple Application Process",
          personalized: "AI-Powered Matching",
          accessible: "Voice & Offline Support"
        }
      },
      
      // Signup Page
      signup: {
        title: "Create Your Profile",
        subtitle: "Tell us about yourself to get personalized recommendations",
        fields: {
          name: "Full Name",
          education: "Education Level",
          skills: "Skills (speak or type)",
          location: "Location",
          sector: "Sector Interest",
          gender: "Gender",
          age: "Age"
        },
        voiceHint: "Click mic to speak",
        profileStrength: "Profile Strength",
        submit: "Find My Internships",
        downloadResume: "Download My Resume"
      },
      
      // Recommendations Page
      recommendations: {
        title: "Your Personalized Internships",
        subtitle: "We found these perfect matches for you",
        filters: {
          location: "Filter by Location",
          sector: "Filter by Sector",
          all: "All"
        },
        apply: "Apply Now",
        sendSMS: "Send via SMS",
        speakRecommendations: "Listen to Recommendations",
        offline: "You're offline. Showing last saved recommendations.",
        smsSuccess: "SMS sent to your mobile with top 3 internships!",
        resume: "AI-Generated Resume",
        coverLetter: "AI Cover Letter"
      },
      
      // Common
      common: {
        loading: "Loading...",
        error: "Something went wrong",
        retry: "Try Again",
        close: "Close",
        next: "Next",
        back: "Back",
        darkMode: "Dark Mode",
        lightMode: "Light Mode"
      }
    }
  },
  hi: {
    translation: {
      // Navigation
      nav: {
        home: "होम",
        profile: "प्रोफ़ाइल",
        recommendations: "इंटर्नशिप"
      },
      
      // Landing Page
      landing: {
        headline: "सभी सरकारी इंटर्नशिप का आपका वन-स्टेप समाधान",
        subtext: "सरल। व्यक्तिगत। सभी के लिए सुलभ।",
        getStarted: "शुरू करें",
        learnMore: "और जानें",
        features: {
          simple: "सरल आवेदन प्रक्रिया",
          personalized: "AI-आधारित मैचिंग",
          accessible: "आवाज़ और ऑफ़लाइन सपोर्ट"
        }
      },
      
      // Signup Page
      signup: {
        title: "अपनी प्रोफ़ाइल बनाएं",
        subtitle: "व्यक्तिगत सुझाव पाने के लिए अपने बारे में बताएं",
        fields: {
          name: "पूरा नाम",
          education: "शिक्षा स्तर",
          skills: "कुशलताएं (बोलें या टाइप करें)",
          location: "स्थान",
          sector: "क्षेत्र की रुचि",
          gender: "लिंग",
          age: "आयु"
        },
        voiceHint: "बोलने के लिए माइक पर क्लिक करें",
        profileStrength: "प्रोफ़ाइल शक्ति",
        submit: "मेरी इंटर्नशिप खोजें",
        downloadResume: "मेरा रिज्यूमे डाउनलोड करें"
      },
      
      // Recommendations Page
      recommendations: {
        title: "आपकी व्यक्तिगत इंटर्नशिप",
        subtitle: "हमने आपके लिए ये परफेक्ट मैच पाए हैं",
        filters: {
          location: "स्थान के अनुसार फ़िल्टर करें",
          sector: "क्षेत्र के अनुसार फ़िल्टर करें",
          all: "सभी"
        },
        apply: "अभी आवेदन करें",
        sendSMS: "SMS भेजें",
        speakRecommendations: "सुझाव सुनें",
        offline: "आप ऑफ़लाइन हैं। अंतिम सेव किए गए सुझाव दिखा रहे हैं।",
        smsSuccess: "आपके मोबाइल पर टॉप 3 इंटर्नशिप के साथ SMS भेजा गया!",
        resume: "AI-जेनरेटेड रिज्यूमे",
        coverLetter: "AI कवर लेटर"
      },
      
      // Common
      common: {
        loading: "लोड हो रहा है...",
        error: "कुछ गलत हुआ",
        retry: "फिर से कोशिश करें",
        close: "बंद करें",
        next: "अगला",
        back: "वापस",
        darkMode: "डार्क मोड",
        lightMode: "लाइट मोड"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;