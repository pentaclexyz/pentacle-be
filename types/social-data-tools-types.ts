export interface SocialDataToolsUser {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  url: any;
  description: string;
  protected: boolean;
  verified: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  favourites_count: number;
  statuses_count: number;
  created_at: string;
  profile_banner_url: string;
  profile_image_url_https: string;
  can_dm: boolean;
}
