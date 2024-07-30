export type BaseEcosystemTag =
  | 'social'
  | 'nft'
  | 'infra'
  | 'defi'
  | 'gaming'
  | 'wallet'
  | 'onramp'
  | 'dao'
  | 'bridge'
  | 'security';

export type BaseEcosystem = {
  name: string;
  tags: BaseEcosystemTag[];
  description: string;
  url: string;
  imageUrl: string;
};
