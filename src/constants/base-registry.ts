export const BASE_REGISTRY_API_BASE_URL = "https://base.org/api/registry";
export const BASE_REGISTRY_API_ENDPOINTS = {
  entries: "entries",
  featured: "featured",
};

export const BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS = {
  //The page number (default 1)
  page: "page",
  //The number of entries per page (default 10)
  limit: "limit",
  //The category or categories of the entries of interest
  category: "category",
  //The entry’s level of curation
  curation: "curation",
} as const;

//(Options: Games, Social, Creators, Finance, Media)
export const BASE_REGISTRY_CATEGORIES = {
  games: "Games",
  social: "Social",
  creators: "Creators",
  finance: "Finance",
  media: "Media",
} as const;

//(Options: Featured, Curated, Community)
export const BASE_REGISTRY_CURATION_TYPES = {
  featured: "Featured",
  curated: "Curated",
  community: "Community",
} as const;


export const BASE_CATEGORY_TO_STRAPI_SECTION_MAPPING = {
  [BASE_REGISTRY_CATEGORIES.games]: "games",
  [BASE_REGISTRY_CATEGORIES.social]: "social",
  [BASE_REGISTRY_CATEGORIES.creators]: "creative",
  [BASE_REGISTRY_CATEGORIES.finance]: "defi",
  [BASE_REGISTRY_CATEGORIES.media]: "creative",
}
