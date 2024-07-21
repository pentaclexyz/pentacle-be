export interface Entity {
  start: number;
  end: number;
}

export interface UrlEntity extends Entity {
  url: string; // https;//t.co/...
  expanded_url: string; // https://unfollow.ninja/
  display_url: string; // unfollow.ninja
}

export interface HashtagEntity extends Entity {
  hashtag: string;
}

export interface CashtagEntity extends Entity {
  cashtag: string;
}

export interface MentionEntity extends Entity {
  username: string;
}

export interface UserV2 {
  id: string;
  name: string;
  username: string;
  created_at?: string; // ISO 8601 date
  protected?: boolean;
  withheld?: {
    country_codes?: string[];
    scope?: 'user';
  };
  location?: string;
  url?: string;
  description?: string;
  verified?: boolean;
  verified_type?: 'none' | 'blue' | 'business' | 'government';
  entities?: {
    url?: { urls: UrlEntity[] };
    description: {
      urls?: UrlEntity[];
      hashtags?: HashtagEntity[];
      cashtags?: CashtagEntity[];
      mentions?: MentionEntity[];
    };
  };
  profile_image_url?: string;
  public_metrics?: {
    followers_count?: number;
    following_count?: number;
    tweet_count?: number;
    listed_count?: number;
    like_count?: number;
  };
  pinned_tweet_id?: string;
  connection_status?: string[];
}
