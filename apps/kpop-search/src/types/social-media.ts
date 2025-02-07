import { SearchResultWithSnippet } from "../view/types";

export interface SocialMediaSource {
  platform: 'twitter' | 'instagram' | 'youtube';
  username: string;
  postId: string;
  url: string;
  content: string;
  timestamp: string;
}

export interface SearchResultWithSocial extends SearchResultWithSnippet {
  socialSource?: SocialMediaSource;
}
