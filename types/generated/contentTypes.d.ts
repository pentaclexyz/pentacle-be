import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAboutAbout extends Schema.SingleType {
  collectionName: 'abouts';
  info: {
    singularName: 'about';
    pluralName: 'abouts';
    displayName: 'About';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    content: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::about.about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::about.about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    singularName: 'article';
    pluralName: 'articles';
    displayName: 'article';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    article_url: Attribute.String;
    content_type: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'api::content-type.content-type'
    >;
    skill_level: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'api::skill-level.skill-level'
    >;
    slug: Attribute.UID<'api::article.article', 'title'>;
    tags: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::tag.tag'
    >;
    categories: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::category.category'
    >;
    description: Attribute.Text;
    people: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::person.person'
    >;
    sections: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::section.section'
    >;
    chains: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::chain.chain'
    >;
    skill_levels: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::skill-level.skill-level'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuditAudit extends Schema.CollectionType {
  collectionName: 'audits';
  info: {
    singularName: 'audit';
    pluralName: 'audits';
    displayName: 'Audit';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    audited_project: Attribute.Relation<
      'api::audit.audit',
      'manyToMany',
      'api::project.project'
    >;
    audit_url: Attribute.String;
    audited_by: Attribute.Relation<
      'api::audit.audit',
      'manyToMany',
      'api::project.project'
    >;
    date: Attribute.Date;
    name: Attribute.String;
    Slug: Attribute.UID<'api::audit.audit', 'name'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::audit.audit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::audit.audit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: 'categories';
  info: {
    singularName: 'category';
    pluralName: 'categories';
    displayName: 'category';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    slug: Attribute.UID<'api::category.category', 'name'>;
    articles: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::article.article'
    >;
    glossary_items: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::glossary-item.glossary-item'
    >;
    projects: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::project.project'
    >;
    sections: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::section.section'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChainChain extends Schema.CollectionType {
  collectionName: 'chains';
  info: {
    singularName: 'chain';
    pluralName: 'chains';
    displayName: 'Chain';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    ticker: Attribute.String;
    coingecko_id: Attribute.String;
    projects: Attribute.Relation<
      'api::chain.chain',
      'manyToMany',
      'api::project.project'
    >;
    slug: Attribute.UID<'api::chain.chain', 'name'>;
    articles: Attribute.Relation<
      'api::chain.chain',
      'manyToMany',
      'api::article.article'
    >;
    evm_chain_id: Attribute.String;
    description: Attribute.Text;
    project: Attribute.Relation<
      'api::chain.chain',
      'oneToOne',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::chain.chain',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::chain.chain',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentTypeContentType extends Schema.CollectionType {
  collectionName: 'content_types';
  info: {
    singularName: 'content-type';
    pluralName: 'content-types';
    displayName: 'content_types';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    slug: Attribute.UID<'api::content-type.content-type', 'name'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-type.content-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::content-type.content-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDefiSafetyReportDefiSafetyReport
  extends Schema.CollectionType {
  collectionName: 'defi-safety-reports';
  info: {
    singularName: 'defi-safety-report';
    pluralName: 'defi-safety-reports';
    displayName: 'defi-safety-report';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    defiSafetyId: Attribute.String;
    version: Attribute.String;
    title: Attribute.String;
    ethAddress: Attribute.String;
    tokenAddress: Attribute.String;
    status: Attribute.String;
    reviewStatus: Attribute.String;
    overallScore: Attribute.Integer;
    penaltyScore: Attribute.Integer;
    finalScore: Attribute.Integer;
    date: Attribute.String;
    chain: Attribute.JSON;
    categories: Attribute.JSON;
    breakdowns: Attribute.JSON;
    hackHistory: Attribute.JSON;
    imageUrl: Attribute.String;
    url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::defi-safety-report.defi-safety-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::defi-safety-report.defi-safety-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEventEvent extends Schema.CollectionType {
  collectionName: 'events';
  info: {
    singularName: 'event';
    pluralName: 'events';
    displayName: 'event';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    start_date: Attribute.String;
    end_date: Attribute.String;
    location: Attribute.String;
    url: Attribute.String;
    twitter_url: Attribute.String;
    telegram_discord: Attribute.String;
    slug: Attribute.UID<'api::event.event', 'name'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::event.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::event.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGlobalGlobal extends Schema.SingleType {
  collectionName: 'globals';
  info: {
    singularName: 'global';
    pluralName: 'globals';
    displayName: 'Global';
    name: 'global';
    description: '';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  attributes: {
    siteName: Attribute.String & Attribute.Required;
    defaultSeo: Attribute.Component<'shared.seo'> & Attribute.Required;
    favicon: Attribute.Media;
    defaultNav: Attribute.Component<'shared.nav', true>;
    sections: Attribute.Relation<
      'api::global.global',
      'oneToMany',
      'api::section.section'
    >;
    categories: Attribute.Relation<
      'api::global.global',
      'oneToMany',
      'api::category.category'
    >;
    defaultLogo: Attribute.Component<'shared.logo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::global.global',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::global.global',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGlossaryItemGlossaryItem extends Schema.CollectionType {
  collectionName: 'glossary_items';
  info: {
    singularName: 'glossary-item';
    pluralName: 'glossary-items';
    displayName: 'glossary_item';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    what: Attribute.Text;
    why: Attribute.Text;
    risk: Attribute.String;
    reward: Attribute.String;
    categories: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'manyToMany',
      'api::category.category'
    >;
    skill_levels: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'manyToMany',
      'api::skill-level.skill-level'
    >;
    tags: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'manyToMany',
      'api::tag.tag'
    >;
    people: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'manyToMany',
      'api::person.person'
    >;
    slug: Attribute.UID<'api::glossary-item.glossary-item', 'name'>;
    skill_types: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'manyToMany',
      'api::skill-type.skill-type'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::glossary-item.glossary-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGovernanceDiscussionGovernanceDiscussion
  extends Schema.CollectionType {
  collectionName: 'governance-discussions';
  info: {
    singularName: 'governance-discussion';
    pluralName: 'governance-discussions';
    displayName: 'governance-discussion';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    project_slug: Attribute.String;
    discussions: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::governance-discussion.governance-discussion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::governance-discussion.governance-discussion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGovernanceProposalGovernanceProposal
  extends Schema.CollectionType {
  collectionName: 'governance-proposals';
  info: {
    singularName: 'governance-proposal';
    pluralName: 'governance-proposals';
    displayName: 'governance-proposal';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    state: Attribute.String;
    end: Attribute.Integer;
    start: Attribute.Integer;
    governance_url: Attribute.String;
    choices: Attribute.JSON;
    scores: Attribute.JSON;
    scores_total: Attribute.Float;
    body: Attribute.Text;
    snapshot_id: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::governance-proposal.governance-proposal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::governance-proposal.governance-proposal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGrantGrant extends Schema.CollectionType {
  collectionName: 'grants';
  info: {
    singularName: 'grant';
    pluralName: 'grants';
    displayName: 'Grant';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.String;
    slug: Attribute.UID<'api::grant.grant', 'name'>;
    organisation: Attribute.String;
    grant_url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::grant.grant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::grant.grant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHelperHelper extends Schema.CollectionType {
  collectionName: 'helpers';
  info: {
    singularName: 'helper';
    pluralName: 'helpers';
    displayName: 'helper';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::helper.helper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::helper.helper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomepageHomepage extends Schema.SingleType {
  collectionName: 'homepages';
  info: {
    singularName: 'homepage';
    pluralName: 'homepages';
    displayName: 'homepage';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    homeFeatures: Attribute.Component<'shared.card-large', true>;
    defi: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::project.project'
    >;
    skill_types: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::skill-type.skill-type'
    >;
    homeCollections: Attribute.Component<'shared.card-large', true>;
    skill_levels: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::skill-level.skill-level'
    >;
    tags: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::tag.tag'
    >;
    nfts: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::project.project'
    >;
    social: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::project.project'
    >;
    developer: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::project.project'
    >;
    resources: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::project.project'
    >;
    lores: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::lore.lore'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiJobJob extends Schema.CollectionType {
  collectionName: 'jobs';
  info: {
    singularName: 'job';
    pluralName: 'jobs';
    displayName: 'Job';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    jobs_url: Attribute.String;
    organisation: Attribute.String;
    slug: Attribute.UID<'api::job.job', 'name'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::job.job', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::job.job', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiLoreLore extends Schema.CollectionType {
  collectionName: 'lores';
  info: {
    singularName: 'lore';
    pluralName: 'lores';
    displayName: 'Lore';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.RichText;
    projects: Attribute.Relation<
      'api::lore.lore',
      'manyToMany',
      'api::project.project'
    >;
    people: Attribute.Relation<
      'api::lore.lore',
      'manyToMany',
      'api::person.person'
    >;
    tags: Attribute.Relation<'api::lore.lore', 'manyToMany', 'api::tag.tag'>;
    image: Attribute.String;
    date: Attribute.Date;
    bg_image: Attribute.String;
    link: Attribute.String;
    link_text: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::lore.lore', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::lore.lore', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiMediaKitMediaKit extends Schema.CollectionType {
  collectionName: 'media_kits';
  info: {
    singularName: 'media-kit';
    pluralName: 'media-kits';
    displayName: 'media-kit';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Blocks;
    logo: Attribute.Media;
    brand_guidelines: Attribute.Media;
    font: Attribute.String;
    project: Attribute.Relation<
      'api::media-kit.media-kit',
      'oneToOne',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::media-kit.media-kit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::media-kit.media-kit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPayWithCryptoPayWithCrypto extends Schema.CollectionType {
  collectionName: 'pay_with_cryptos';
  info: {
    singularName: 'pay-with-crypto';
    pluralName: 'pay-with-cryptos';
    displayName: 'pay-with-crypto';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    website: Attribute.String;
    physical_location: Attribute.Text;
    chain: Attribute.Relation<
      'api::pay-with-crypto.pay-with-crypto',
      'oneToOne',
      'api::chain.chain'
    >;
    main_image: Attribute.Media;
    images: Attribute.Media;
    map: Attribute.String;
    type: Attribute.Enumeration<['cafe', 'retail store', 'travel']>;
    twitter: Attribute.String;
    farcaster: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pay-with-crypto.pay-with-crypto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pay-with-crypto.pay-with-crypto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPersonPerson extends Schema.CollectionType {
  collectionName: 'people';
  info: {
    singularName: 'person';
    pluralName: 'people';
    displayName: 'person';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    bio: Attribute.String;
    twitter: Attribute.String;
    website: Attribute.String;
    slug: Attribute.UID<'api::person.person', 'name'>;
    articles: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::article.article'
    >;
    github: Attribute.String;
    glossary_items: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::glossary-item.glossary-item'
    >;
    skills: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::skill.skill'
    >;
    avatar: Attribute.String;
    projects: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::project.project'
    >;
    has_investment: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::project.project'
    >;
    subject_expert_types: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::subject-expert-type.subject-expert-type'
    >;
    tags: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::tag.tag'
    >;
    twitter_img: Attribute.String;
    twitter_banner: Attribute.String;
    lores: Attribute.Relation<
      'api::person.person',
      'manyToMany',
      'api::lore.lore'
    >;
    farcaster_handle: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::person.person',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::person.person',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProjectProject extends Schema.CollectionType {
  collectionName: 'projects';
  info: {
    singularName: 'project';
    pluralName: 'projects';
    displayName: 'projects';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    coingecko_id: Attribute.String;
    ticker: Attribute.String;
    website_url: Attribute.String;
    webapp_url: Attribute.String;
    twitter_url: Attribute.String;
    blog_url: Attribute.String;
    token_image_url: Attribute.String;
    contract_url: Attribute.String;
    coingecko_url: Attribute.String;
    llama_url: Attribute.String;
    dune_url: Attribute.String;
    rekt_url: Attribute.String;
    marketplace_url: Attribute.String;
    whitepaper_url: Attribute.String;
    github_url: Attribute.String;
    github_id: Attribute.String;
    github_created_at: Attribute.String;
    docs_url: Attribute.String;
    discord_url: Attribute.String;
    telegram_url: Attribute.String;
    medium_url: Attribute.String;
    tags: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::tag.tag'
    >;
    slug: Attribute.UID<'api::project.project', 'name'>;
    categories: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::category.category'
    >;
    sections: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::section.section'
    >;
    chains: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::chain.chain'
    >;
    people: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::person.person'
    >;
    has_investor: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    has_investment: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    has_investor_person: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::person.person'
    >;
    skill_levels: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::skill-level.skill-level'
    >;
    governance_url: Attribute.String;
    jobs_url: Attribute.String;
    defisafety_id: Attribute.String;
    llama_id: Attribute.String;
    grants_url: Attribute.String;
    video_url: Attribute.String;
    podcast_url: Attribute.String;
    description: Attribute.RichText;
    discourse_url: Attribute.String;
    contributors_url: Attribute.String;
    treasury_wallets: Attribute.Component<'shared.treasury-wallet', true>;
    has_audit: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::audit.audit'
    >;
    is_auditor: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::audit.audit'
    >;
    audits_url: Attribute.String;
    has_audited: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    has_auditor: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    risk_manager_for: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    risk_managed_by: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    powers: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    powered_by: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    child_projects: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    parent_projects: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::project.project'
    >;
    risk_urls: Attribute.Component<'project.risk-urls', true>;
    twitter_img: Attribute.String;
    mirror_url: Attribute.String;
    twitter_banner: Attribute.String;
    tag: Attribute.Relation<
      'api::project.project',
      'manyToOne',
      'api::tag.tag'
    >;
    lores: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::lore.lore'
    >;
    farcaster_handle: Attribute.String;
    created_by: Attribute.String;
    skills: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::skill.skill'
    >;
    sponsors_tag: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::tag.tag'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSectionSection extends Schema.CollectionType {
  collectionName: 'sections';
  info: {
    singularName: 'section';
    pluralName: 'sections';
    displayName: 'section';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    slug: Attribute.UID<'api::section.section', 'name'>;
    articles: Attribute.Relation<
      'api::section.section',
      'manyToMany',
      'api::article.article'
    >;
    categories: Attribute.Relation<
      'api::section.section',
      'manyToMany',
      'api::category.category'
    >;
    projects: Attribute.Relation<
      'api::section.section',
      'manyToMany',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::section.section',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::section.section',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSkillSkill extends Schema.CollectionType {
  collectionName: 'skills';
  info: {
    singularName: 'skill';
    pluralName: 'skills';
    displayName: 'skill';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.Text;
    skill_levels: Attribute.Relation<
      'api::skill.skill',
      'manyToMany',
      'api::skill-level.skill-level'
    >;
    skill_types: Attribute.Relation<
      'api::skill.skill',
      'manyToMany',
      'api::skill-type.skill-type'
    >;
    people: Attribute.Relation<
      'api::skill.skill',
      'manyToMany',
      'api::person.person'
    >;
    tags: Attribute.Relation<'api::skill.skill', 'manyToMany', 'api::tag.tag'>;
    slug: Attribute.UID<'api::skill.skill', 'title'>;
    content: Attribute.RichText;
    projects: Attribute.Relation<
      'api::skill.skill',
      'manyToMany',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::skill.skill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::skill.skill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSkillLevelSkillLevel extends Schema.CollectionType {
  collectionName: 'skill_levels';
  info: {
    singularName: 'skill-level';
    pluralName: 'skill-levels';
    displayName: 'skill_level';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.UID<'api::skill-level.skill-level', 'name'>;
    skills: Attribute.Relation<
      'api::skill-level.skill-level',
      'manyToMany',
      'api::skill.skill'
    >;
    glossary_items: Attribute.Relation<
      'api::skill-level.skill-level',
      'manyToMany',
      'api::glossary-item.glossary-item'
    >;
    projects: Attribute.Relation<
      'api::skill-level.skill-level',
      'manyToMany',
      'api::project.project'
    >;
    articles: Attribute.Relation<
      'api::skill-level.skill-level',
      'manyToMany',
      'api::article.article'
    >;
    description: Attribute.RichText;
    image_url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::skill-level.skill-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::skill-level.skill-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSkillTypeSkillType extends Schema.CollectionType {
  collectionName: 'skill_types';
  info: {
    singularName: 'skill-type';
    pluralName: 'skill-types';
    displayName: 'skill_type';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.UID<'api::skill-type.skill-type', 'name'>;
    skills: Attribute.Relation<
      'api::skill-type.skill-type',
      'manyToMany',
      'api::skill.skill'
    >;
    glossary_items: Attribute.Relation<
      'api::skill-type.skill-type',
      'manyToMany',
      'api::glossary-item.glossary-item'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::skill-type.skill-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::skill-type.skill-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubjectExpertTypeSubjectExpertType
  extends Schema.CollectionType {
  collectionName: 'subject_expert_types';
  info: {
    singularName: 'subject-expert-type';
    pluralName: 'subject-expert-types';
    displayName: 'subject_expert_type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.RichText;
    slug: Attribute.UID<'api::subject-expert-type.subject-expert-type', 'name'>;
    people: Attribute.Relation<
      'api::subject-expert-type.subject-expert-type',
      'manyToMany',
      'api::person.person'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subject-expert-type.subject-expert-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subject-expert-type.subject-expert-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubmissionSubmission extends Schema.CollectionType {
  collectionName: 'submissions';
  info: {
    singularName: 'submission';
    pluralName: 'submissions';
    displayName: 'submissions';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    ticker: Attribute.String;
    website_url: Attribute.String;
    webapp_url: Attribute.String;
    twitter_handle: Attribute.String;
    token_image_url: Attribute.String;
    contract_url: Attribute.String;
    coingecko_url: Attribute.String;
    llama_url: Attribute.String;
    llama_id: Attribute.String;
    dune_url: Attribute.String;
    rekt_url: Attribute.String;
    whitepaper_url: Attribute.String;
    github_url: Attribute.String;
    github_id: Attribute.String;
    github_created_at: Attribute.String;
    docs_url: Attribute.String;
    discord_url: Attribute.String;
    marketplace_url: Attribute.String;
    telegram_url: Attribute.String;
    blog_url: Attribute.String;
    tags: Attribute.String;
    slug: Attribute.UID<'api::submission.submission', 'name'>;
    chains: Attribute.String;
    governance_url: Attribute.String;
    jobs_url: Attribute.String;
    defisafety_url: Attribute.String;
    grants_url: Attribute.String;
    video_url: Attribute.String;
    podcast_url: Attribute.String;
    description: Attribute.RichText;
    discourse_url: Attribute.String;
    contributors_url: Attribute.String;
    audits_url: Attribute.String;
    contact: Attribute.String;
    farcaster_handle: Attribute.String;
    profile_img: Attribute.String;
    profile_banner: Attribute.String;
    eth_address: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::submission.submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::submission.submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTagTag extends Schema.CollectionType {
  collectionName: 'tags';
  info: {
    singularName: 'tag';
    pluralName: 'tags';
    displayName: 'tag';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    articles: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::article.article'
    >;
    projects: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::project.project'
    >;
    glossary_items: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::glossary-item.glossary-item'
    >;
    slug: Attribute.UID<'api::tag.tag', 'name'>;
    skills: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::skill.skill'
    >;
    people: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::person.person'
    >;
    related_to: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::tag.tag'
    >;
    inbound_relation: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::tag.tag'
    >;
    description: Attribute.RichText;
    ecosystem_projects: Attribute.Relation<
      'api::tag.tag',
      'oneToMany',
      'api::project.project'
    >;
    lores: Attribute.Relation<'api::tag.tag', 'manyToMany', 'api::lore.lore'>;
    sponsored_by: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTermTerm extends Schema.SingleType {
  collectionName: 'terms';
  info: {
    singularName: 'term';
    pluralName: 'terms';
    displayName: 'Terms';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    content: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::term.term', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::term.term', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTweetTweet extends Schema.CollectionType {
  collectionName: 'tweets';
  info: {
    singularName: 'tweet';
    pluralName: 'tweets';
    displayName: 'tweet';
    description: 'Opengraph tweet like tweets';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tweet_id: Attribute.String;
    text: Attribute.Text;
    author_id: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tweet.tweet',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tweet.tweet',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTweetTwitterList extends Schema.CollectionType {
  collectionName: 'twitter-list';
  info: {
    singularName: 'twitter-list';
    pluralName: 'twitter-lists';
    displayName: 'twitter-list';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    screen_name: Attribute.String;
    lists: Attribute.JSON;
    timestamp: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tweet.twitter-list',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tweet.twitter-list',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::about.about': ApiAboutAbout;
      'api::article.article': ApiArticleArticle;
      'api::audit.audit': ApiAuditAudit;
      'api::category.category': ApiCategoryCategory;
      'api::chain.chain': ApiChainChain;
      'api::content-type.content-type': ApiContentTypeContentType;
      'api::defi-safety-report.defi-safety-report': ApiDefiSafetyReportDefiSafetyReport;
      'api::event.event': ApiEventEvent;
      'api::global.global': ApiGlobalGlobal;
      'api::glossary-item.glossary-item': ApiGlossaryItemGlossaryItem;
      'api::governance-discussion.governance-discussion': ApiGovernanceDiscussionGovernanceDiscussion;
      'api::governance-proposal.governance-proposal': ApiGovernanceProposalGovernanceProposal;
      'api::grant.grant': ApiGrantGrant;
      'api::helper.helper': ApiHelperHelper;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::job.job': ApiJobJob;
      'api::lore.lore': ApiLoreLore;
      'api::media-kit.media-kit': ApiMediaKitMediaKit;
      'api::pay-with-crypto.pay-with-crypto': ApiPayWithCryptoPayWithCrypto;
      'api::person.person': ApiPersonPerson;
      'api::project.project': ApiProjectProject;
      'api::section.section': ApiSectionSection;
      'api::skill.skill': ApiSkillSkill;
      'api::skill-level.skill-level': ApiSkillLevelSkillLevel;
      'api::skill-type.skill-type': ApiSkillTypeSkillType;
      'api::subject-expert-type.subject-expert-type': ApiSubjectExpertTypeSubjectExpertType;
      'api::submission.submission': ApiSubmissionSubmission;
      'api::tag.tag': ApiTagTag;
      'api::term.term': ApiTermTerm;
      'api::tweet.tweet': ApiTweetTweet;
      'api::tweet.twitter-list': ApiTweetTwitterList;
    }
  }
}
