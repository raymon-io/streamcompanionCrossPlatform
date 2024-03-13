export interface Kickinterface {
  id?: number;
  user_id?: number;
  slug: string;
  playback_url?: string;
  user: {
    username: string;
    bio?: string;
    profile_pic?: string;
    profilePic?: string;
  };
  livestream?: {
    is_live: boolean;
    categories: {
      name: string;
    }[];
    viewer_count: number;
    is_mature?: boolean;
    session_title?: string;
  };
  followers_count?: number;
  verified?: boolean | object | null;
  followersCount?: number;
  isLive?: boolean;
  chatroom?: {
    id: number;
  };
}

export interface KickVideoInterface {
  channel_id: number;
  session_title: string;
  source: string;
  views: number;
  duration: number;
  start_time: number;
  categories: {
    name: string;
  }[];
  thumbnail: {
    src: string;
  };
  video: {
    uuid: string;
  };
  videoQualities?: {
    src1080p60: string;
    src720p60: string;
    src480p30: string;
    src360p30: string;
    src160p30: string;
  };
  videoTime?: string;
  durationString: string;
}

export interface KickVideoInterface {
  id: number;
  channel_id: number;
  session_title: string;
  source: string;
  views: number;
  duration: number;
  start_time: number;
  categories: {
    name: string;
  }[];
  thumbnail: {
    src: string;
  };
  video: {
    uuid: string;
  };
  videoQualities?: {
    src1080p60: string;
    src720p60: string;
    src480p30: string;
    src360p30: string;
    src160p30: string;
  };
  durationString: string;
}
