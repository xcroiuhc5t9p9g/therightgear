import fs from 'fs';

let content = fs.readFileSync('src/data/entitiesData.ts', 'utf8');

const interfaceRegex = /export interface KeyEntity \{[\s\S]*?associatedVehicleSlugs: string\[\];\n\}/;

const newInterface = `export type EntityClass = 'PERSON' | 'ORGANIZATION';

export interface BaseKeyEntity {
  id: string;
  slug: string;
  name: string;
  entityClass: EntityClass;
  nationality: string;
  countryCode: string;
  yearsActive: string;
  roleTitle: string;
  avatarUrl: string;
  coverImageUrl?: string;
  biographyIt: string;
  biographyEn: string;
  keyAchievementsIt: string[];
  keyAchievementsEn: string[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  publicationStatus?: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  associatedVehicleSlugs: string[];
}

export interface PersonEntity extends BaseKeyEntity {
  entityClass: 'PERSON';
  roles: Array<'DESIGNER' | 'ENGINEER' | 'RACING_FIGURE' | 'TEST_DRIVER' | 'FOUNDER'>;
}

export interface OrganizationEntity extends BaseKeyEntity {
  entityClass: 'ORGANIZATION';
  organizationType: 'MAKER' | 'DESIGN_HOUSE' | 'ENGINEERING_ORGANIZATION';
  companyInfoIt?: string;
  companyInfoEn?: string;
}

export type KeyEntity = PersonEntity | OrganizationEntity;`;

content = content.replace(interfaceRegex, newInterface);

// Update Nicola Materazzi
content = content.replace(
  "type: 'Engineer',",
  "entityClass: 'PERSON',\n    roles: ['ENGINEER'],"
);

// Update Pininfarina
content = content.replace(
  "type: 'Coachbuilder / Design House',",
  "entityClass: 'ORGANIZATION',\n    organizationType: 'DESIGN_HOUSE',"
);

// Update Marcello Gandini
content = content.replace(
  "type: 'Designer',",
  "entityClass: 'PERSON',\n    roles: ['DESIGNER'],"
);

// Update Gordon Murray
content = content.replace(
  "type: 'Engineer',",
  "entityClass: 'PERSON',\n    roles: ['ENGINEER'],"
);

fs.writeFileSync('src/data/entitiesData.ts', content);
