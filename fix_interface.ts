import fs from 'fs';

let content = fs.readFileSync('src/data/entitiesData.ts', 'utf8');

content = content.replace(
  "export interface PersonEntity extends BaseKeyEntity {\n  entityClass: 'PERSON';\n  roles: Array<'DESIGNER' | 'ENGINEER' | 'RACING_FIGURE' | 'TEST_DRIVER' | 'FOUNDER'>;\n}",
  "export interface PersonEntity extends BaseKeyEntity {\n  entityClass: 'PERSON';\n  roles: Array<'DESIGNER' | 'ENGINEER' | 'RACING_FIGURE' | 'TEST_DRIVER' | 'FOUNDER'>;\n  companyInfoIt?: string;\n  companyInfoEn?: string;\n}"
);

fs.writeFileSync('src/data/entitiesData.ts', content);
