export type Language = "en" | "hi" | "kn";

export interface Video {
  id: string;
  title: string;
  titleHi?: string;
  titleKn?: string;
  description: string;
  descriptionHi?: string;
  descriptionKn?: string;
  language: Language;
  subject: string;
  grade: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // seconds
  views: number;
  avgWatchDuration: number; // seconds
  createdAt: string;
  tags: string[];
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: "easy" | "medium" | "hard";
  ageRange: string;
  plays: number;
  subjects: string[];
  languages: Language[];
}

export interface AnalyticsData {
  totalVideoViews: number;
  totalGamePlays: number;
  avgWatchDuration: number;
  topVideos: Video[];
  topGames: Game[];
  viewsByLanguage: Record<Language, number>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: "video_view" | "game_play";
  itemId: string;
  itemTitle: string;
  timestamp: string;
  language: Language;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
}
