import { Address } from "viem";
import { BASE_REGISTRY_CATEGORIES, BASE_REGISTRY_CURATION_TYPES } from '../../constants/base-registry';

export type BaseRegistryCategory = (typeof BASE_REGISTRY_CATEGORIES)[keyof typeof BASE_REGISTRY_CATEGORIES];

export type BaseRegistryCurationType = (typeof BASE_REGISTRY_CURATION_TYPES)[keyof typeof BASE_REGISTRY_CURATION_TYPES];

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
