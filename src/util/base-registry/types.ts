import { Address } from "viem";

export type BaseRegistryCategory =
  | "Games"
  | "Social"
  | "Creators"
  | "Finance"
  | "Media";

export type BaseRegistryCurationType = "Featured" | "Curated" | "Community";

export type BaseRegistryEntryResponseItem = {
  id: string;
  category: BaseRegistryCategory;
  content: {
    title: string;
    short_description: string;
    full_description: string;
    image_url: string;
    target_url: string;
    cta_text: string;
    function_signature: string;
    contract_address: Address;
    token_id: string;
    token_amount: string;
    curation: BaseRegistryCurationType;
    creator_name: string;
    creator_image_url: string;
  };
};

export type BaseRegistryEntryResponse = {
  data: BaseRegistryEntryResponseItem[];
};
