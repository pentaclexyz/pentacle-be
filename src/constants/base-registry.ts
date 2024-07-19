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
};

//(Options: Games, Social, Creators, Finance, Media)
export const BASE_REGISTRY_CATEGORIES = {
  games: "Games",
  social: "Social",
  creators: "Creators",
  finance: "Finance",
  media: "Media",
};

//(Options: Featured, Curated, Community)
export const BASE_REGISTRY_CURATION_TYPES = {
  featured: "Featured",
  curated: "Curated",
  community: "Community",
};
