export interface NewsItem {
    id: string;
    title: string;
    text: string;
    imageUrl: string;
    date: string;
    published: boolean;
    createdAt: number;
}

export interface Coach {
    id: string;
    name: string;
    role: string;
    bio: string;
    achievements: string[];
    phone: string;
    photoUrl: string;
}

export interface GalleryPhoto {
    id: string;
    url: string;
    album: string;
    uploadedAt: number;
}

export interface ScheduleRow {
    id: string;
    day: string;
    time: string;
    group: string;
    coach: string;
}

export interface Application {
    id: string;
    name: string;
    phone: string;
    age: string;
    message: string;
    status: 'new' | 'processing' | 'done';
    createdAt: number;
    telegramSent?: boolean;
}