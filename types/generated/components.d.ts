import type { Schema, Attribute } from '@strapi/strapi';

export interface ProjectRiskUrls extends Schema.Component {
  collectionName: 'components_project_risk_urls';
  info: {
    displayName: 'risk_urls';
    icon: 'ad';
  };
  attributes: {
    risk_url: Attribute.String;
  };
}

export interface ProjectProjectSummary extends Schema.Component {
  collectionName: 'components_project_project_summaries';
  info: {
    displayName: 'projectSummary';
    icon: 'adjust';
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.String;
  };
}

export interface SharedTreasuryWallet extends Schema.Component {
  collectionName: 'components_shared_treasury_wallets';
  info: {
    displayName: 'treasury_wallet';
    icon: 'apple-alt';
    description: '';
  };
  attributes: {
    wallet_address: Attribute.String;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    name: 'Seo';
    icon: 'allergies';
  };
  attributes: {
    metaTitle: Attribute.String & Attribute.Required;
    metaDescription: Attribute.Text & Attribute.Required;
    shareImage: Attribute.Media<'images'>;
  };
}

export interface SharedNav extends Schema.Component {
  collectionName: 'components_shared_nav';
  info: {
    displayName: 'Shared.nav';
    icon: 'apple-alt';
    description: '';
  };
  attributes: {
    navTitle: Attribute.String;
    section: Attribute.Relation<'shared.nav', 'oneToOne', 'api::section.section'>;
  };
}

export interface SharedLogo extends Schema.Component {
  collectionName: 'components_shared_logos';
  info: {
    displayName: 'shared.logo';
    icon: 'baby-carriage';
    description: '';
  };
  attributes: {
    icon: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    logo: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedCardLarge extends Schema.Component {
  collectionName: 'components_features_card_larges';
  info: {
    displayName: 'cardLarge';
    icon: 'address-card';
    description: '';
  };
  attributes: {
    header: Attribute.String;
    text: Attribute.Text;
    link: Attribute.String;
    sections: Attribute.Relation<'shared.card-large', 'oneToMany', 'api::section.section'>;
    categories: Attribute.Relation<'shared.card-large', 'oneToMany', 'api::category.category'>;
    tags: Attribute.Relation<'shared.card-large', 'oneToMany', 'api::tag.tag'>;
    skill_levels: Attribute.Relation<
      'shared.card-large',
      'oneToMany',
      'api::skill-level.skill-level'
    >;
    bg_image: Attribute.String;
  };
}

export interface SharedAudits extends Schema.Component {
  collectionName: 'components_shared_audits';
  info: {
    displayName: 'audits';
    description: '';
  };
  attributes: {
    auditor: Attribute.Relation<'shared.audits', 'oneToOne', 'api::project.project'>;
    audit_url: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'project.risk-urls': ProjectRiskUrls;
      'project.project-summary': ProjectProjectSummary;
      'shared.treasury-wallet': SharedTreasuryWallet;
      'shared.seo': SharedSeo;
      'shared.nav': SharedNav;
      'shared.logo': SharedLogo;
      'shared.card-large': SharedCardLarge;
      'shared.audits': SharedAudits;
    }
  }
}
