"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    videos: "Videos",
    games: "Games",
    "hero.tagline": "Learn Without Limits",
    "hero.subtitle": "Free educational videos and games in Kannada, Hindi, and English for every learner.",
    "hero.cta.videos": "Browse Videos",
    "hero.cta.games": "Play Games",
    "nav.language": "Language",
    "videos.title": "Educational Videos",
    "videos.subtitle": "Watch and learn at your own pace",
    "videos.filter.all": "All Languages",
    "videos.filter.en": "English",
    "videos.filter.hi": "Hindi",
    "videos.filter.kn": "Kannada",
    "games.title": "Learning Games",
    "games.subtitle": "Play your way to knowledge",
    "games.plays": "plays",
    "games.play": "Play Now",
    "video.views": "views",
    "video.duration": "Duration",
    "video.watch": "Watch Now",
    "video.related": "Related Videos",
    "footer.tagline": "Open learning for every child, in every language.",
    "footer.built": "Built with love for learners across India.",
    "admin.login": "Admin Login",
    "admin.dashboard": "Dashboard",
    "admin.videos": "Manage Videos",
    "admin.analytics": "Analytics",
    "admin.logout": "Logout",
    "analytics.totalViews": "Total Video Views",
    "analytics.totalPlays": "Total Game Plays",
    "analytics.avgWatch": "Avg Watch Duration",
    "analytics.topContent": "Top Content",
    minutes: "min",
    subjects: "Subjects",
    difficulty: "Difficulty",
    age: "Age",
    search: "Search videos...",
    all: "All",
    noResults: "No videos found. Try a different filter.",
    loading: "Loading...",
  },
  hi: {
    home: "होम",
    videos: "वीडियो",
    games: "खेल",
    "hero.tagline": "बिना सीमा के सीखें",
    "hero.subtitle": "हर सीखने वाले के लिए कन्नड़, हिंदी और अंग्रेजी में मुफ्त शैक्षिक वीडियो और खेल।",
    "hero.cta.videos": "वीडियो देखें",
    "hero.cta.games": "खेल खेलें",
    "nav.language": "भाषा",
    "videos.title": "शैक्षिक वीडियो",
    "videos.subtitle": "अपनी गति से देखें और सीखें",
    "videos.filter.all": "सभी भाषाएं",
    "videos.filter.en": "अंग्रेजी",
    "videos.filter.hi": "हिंदी",
    "videos.filter.kn": "कन्नड़",
    "games.title": "सीखने के खेल",
    "games.subtitle": "खेलते हुए ज्ञान अर्जित करें",
    "games.plays": "खेल",
    "games.play": "अभी खेलें",
    "video.views": "दृश्य",
    "video.duration": "अवधि",
    "video.watch": "अभी देखें",
    "video.related": "संबंधित वीडियो",
    "footer.tagline": "हर बच्चे के लिए, हर भाषा में खुली शिक्षा।",
    "footer.built": "भारत भर के शिक्षार्थियों के लिए प्यार से बनाया गया।",
    "admin.login": "व्यवस्थापक लॉगिन",
    "admin.dashboard": "डैशबोर्ड",
    "admin.videos": "वीडियो प्रबंधित करें",
    "admin.analytics": "विश्लेषण",
    "admin.logout": "लॉगआउट",
    "analytics.totalViews": "कुल वीडियो दृश्य",
    "analytics.totalPlays": "कुल गेम खेल",
    "analytics.avgWatch": "औसत देखने की अवधि",
    "analytics.topContent": "शीर्ष सामग्री",
    minutes: "मिनट",
    subjects: "विषय",
    difficulty: "कठिनाई",
    age: "आयु",
    search: "वीडियो खोजें...",
    all: "सभी",
    noResults: "कोई वीडियो नहीं मिला। एक अलग फ़िल्टर आज़माएं।",
    loading: "लोड हो रहा है...",
  },
  kn: {
    home: "ಮನೆ",
    videos: "ವೀಡಿಯೊಗಳು",
    games: "ಆಟಗಳು",
    "hero.tagline": "ಮಿತಿಯಿಲ್ಲದೆ ಕಲಿಯಿರಿ",
    "hero.subtitle": "ಪ್ರತಿ ಕಲಿಯುವವರಿಗೆ ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಉಚಿತ ಶೈಕ್ಷಣಿಕ ವೀಡಿಯೊಗಳು ಮತ್ತು ಆಟಗಳು.",
    "hero.cta.videos": "ವೀಡಿಯೊಗಳನ್ನು ನೋಡಿ",
    "hero.cta.games": "ಆಟ ಆಡಿ",
    "nav.language": "ಭಾಷೆ",
    "videos.title": "ಶೈಕ್ಷಣಿಕ ವೀಡಿಯೊಗಳು",
    "videos.subtitle": "ನಿಮ್ಮ ಗತಿಯಲ್ಲಿ ನೋಡಿ ಮತ್ತು ಕಲಿಯಿರಿ",
    "videos.filter.all": "ಎಲ್ಲಾ ಭಾಷೆಗಳು",
    "videos.filter.en": "ಇಂಗ್ಲಿಷ್",
    "videos.filter.hi": "ಹಿಂದಿ",
    "videos.filter.kn": "ಕನ್ನಡ",
    "games.title": "ಕಲಿಕಾ ಆಟಗಳು",
    "games.subtitle": "ಆಟವಾಡುತ್ತಾ ಜ್ಞಾನ ಪಡೆಯಿರಿ",
    "games.plays": "ಆಟಗಳು",
    "games.play": "ಈಗ ಆಡಿ",
    "video.views": "ವೀಕ್ಷಣೆಗಳು",
    "video.duration": "ಅವಧಿ",
    "video.watch": "ಈಗ ನೋಡಿ",
    "video.related": "ಸಂಬಂಧಿತ ವೀಡಿಯೊಗಳು",
    "footer.tagline": "ಪ್ರತಿ ಮಗುವಿಗೆ, ಪ್ರತಿ ಭಾಷೆಯಲ್ಲಿ ಮುಕ್ತ ಕಲಿಕೆ.",
    "footer.built": "ಭಾರತದ ಕಲಿಯುವವರಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ.",
    "admin.login": "ಆಡಳಿತಗಾರ ಲಾಗಿನ್",
    "admin.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "admin.videos": "ವೀಡಿಯೊಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    "admin.analytics": "ವಿಶ್ಲೇಷಣೆ",
    "admin.logout": "ಲಾಗ್‌ಔಟ್",
    "analytics.totalViews": "ಒಟ್ಟು ವೀಡಿಯೊ ವೀಕ್ಷಣೆಗಳು",
    "analytics.totalPlays": "ಒಟ್ಟು ಗೇಮ್ ಆಟಗಳು",
    "analytics.avgWatch": "ಸರಾಸರಿ ವೀಕ್ಷಣೆ ಅವಧಿ",
    "analytics.topContent": "ಉನ್ನತ ವಿಷಯ",
    minutes: "ನಿಮಿಷ",
    subjects: "ವಿಷಯಗಳು",
    difficulty: "ಕಷ್ಟ",
    age: "ವಯಸ್ಸು",
    search: "ವೀಡಿಯೊಗಳನ್ನು ಹುಡುಕಿ...",
    all: "ಎಲ್ಲಾ",
    noResults: "ಯಾವುದೇ ವೀಡಿಯೊಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಫಿಲ್ಟರ್ ಪ್ರಯತ್ನಿಸಿ.",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lms_language") as Language | null;
    if (stored && ["en", "hi", "kn"].includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lms_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] ?? translations["en"][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
