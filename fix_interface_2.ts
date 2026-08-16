import fs from 'fs';

let content = fs.readFileSync('src/data/entitiesData.ts', 'utf8');

// Remove companyInfo from PersonEntity
content = content.replace(
  "export interface PersonEntity extends BaseKeyEntity {\n  entityClass: 'PERSON';\n  roles: Array<'DESIGNER' | 'ENGINEER' | 'RACING_FIGURE' | 'TEST_DRIVER' | 'FOUNDER'>;\n  companyInfoIt?: string;\n  companyInfoEn?: string;\n}",
  "export interface PersonEntity extends BaseKeyEntity {\n  entityClass: 'PERSON';\n  roles: Array<'DESIGNER' | 'ENGINEER' | 'RACING_FIGURE' | 'TEST_DRIVER' | 'FOUNDER'>;\n}"
);

// Remove companyInfo from OrganizationEntity
content = content.replace(
  "export interface OrganizationEntity extends BaseKeyEntity {\n  entityClass: 'ORGANIZATION';\n  organizationType: 'MAKER' | 'DESIGN_HOUSE' | 'ENGINEERING_ORGANIZATION';\n  companyInfoIt?: string;\n  companyInfoEn?: string;\n}",
  "export interface OrganizationEntity extends BaseKeyEntity {\n  entityClass: 'ORGANIZATION';\n  organizationType: 'MAKER' | 'DESIGN_HOUSE' | 'ENGINEERING_ORGANIZATION';\n}"
);

// Add to BaseKeyEntity
content = content.replace(
  "  biographyEn: string;",
  "  biographyEn: string;\n  companyInfoIt?: string;\n  companyInfoEn?: string;"
);

fs.writeFileSync('src/data/entitiesData.ts', content);
