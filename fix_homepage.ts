import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const filterRegex = /const recentlyAddedPeople = KEY_ENTITIES\.filter\([\s\S]*?\.slice\(0, 6\);/;

const newFilter = `const recentlyAddedPeople = KEY_ENTITIES.filter(
    p => p.entityClass === 'PERSON' && 
         p.roles.some(role => role === 'DESIGNER' || role === 'ENGINEER' || role === 'RACING_FIGURE') &&
         p.publicationStatus === 'PUBLISHED' &&
         p.publishedAt
  ).sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
  .slice(0, 6);`;

content = content.replace(filterRegex, newFilter);

const typeRenderRegex = /\{person\.type\.replace\('\ \/\ ',\ '\/'\)\}/g;
content = content.replace(typeRenderRegex, "{person.entityClass === 'PERSON' ? person.roles.join(', ') : ''}");

fs.writeFileSync('src/pages/HomePage.tsx', content);
