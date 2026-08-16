const fs = require('fs');

const HONDA_ID = 'mkr-honda';
const CIVIC_ID = 'mdl-civic';

const makers = [
  {
    id: HONDA_ID,
    slug: 'honda',
    canonical_name: 'Honda',
    official_name: 'Honda Motor Co., Ltd.',
    country_code: 'JP',
    founded_year: 1948,
    active: true,
    catalogue_status: 'PUBLISHED',
    is_ui_fixture: true,
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/1024px-Honda_Logo.svg.png'
  }
];

const models = [
  {
    id: CIVIC_ID,
    maker_id: HONDA_ID,
    canonical_name: 'Civic',
    slug: 'civic',
    category: undefined,
    introduced_year: 1972,
    discontinued_year: null,
    catalogue_status: 'PUBLISHED',
    is_ui_fixture: true,
    hero_image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/2022_Honda_Civic_LX_sedan_%28United_States%29.jpg/1920px-2022_Honda_Civic_LX_sedan_%28United_States%29.jpg'
  }
];

const gensData = [
  { gen: 1, years: '1972-1979', code: '1st Gen', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/1978_Honda_Civic_1200_3-door_01.jpg/1280px-1978_Honda_Civic_1200_3-door_01.jpg' },
  { gen: 2, years: '1979-1983', code: '2nd Gen', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/1981_Honda_Civic_1300_3-door_01.jpg/1280px-1981_Honda_Civic_1300_3-door_01.jpg' },
  { gen: 3, years: '1983-1987', code: '3rd Gen (AH/AK/AT)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Honda_Civic_1.5i_GT_%28AH%29.jpg/1280px-Honda_Civic_1.5i_GT_%28AH%29.jpg' },
  { gen: 4, years: '1987-1991', code: '4th Gen (EF/ED)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/1990_Honda_Civic_ED6_1.5_GL_3-door_hatchback_%282011-06-15%29_01.jpg/1280px-1990_Honda_Civic_ED6_1.5_GL_3-door_hatchback_%282011-06-15%29_01.jpg' },
  { gen: 5, years: '1991-1995', code: '5th Gen (EG/EH)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/1992-1995_Honda_Civic_VTi_hatchback_%282015-12-28%29_01.jpg/1280px-1992-1995_Honda_Civic_VTi_hatchback_%282015-12-28%29_01.jpg' },
  { gen: 6, years: '1995-2000', code: '6th Gen (EK/EJ)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/1998_Honda_Civic_CXi_3-door_hatchback_%282010-09-19%29_01.jpg/1280px-1998_Honda_Civic_CXi_3-door_hatchback_%282010-09-19%29_01.jpg' },
  { gen: 7, years: '2000-2005', code: '7th Gen (EP/ES)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2004_Honda_Civic_%28EP3%29_Type_R_3-door_hatchback_%282015-10-24%29_01.jpg/1280px-2004_Honda_Civic_%28EP3%29_Type_R_3-door_hatchback_%282015-10-24%29_01.jpg' },
  { gen: 8, years: '2005-2011', code: '8th Gen (FD/FN/FK)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2007_Honda_Civic_Type_R_2.0_Front.jpg/1280px-2007_Honda_Civic_Type_R_2.0_Front.jpg' },
  { gen: 9, years: '2011-2015', code: '9th Gen (FB/FK)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2012_Honda_Civic_Ti_1.8_Front.jpg/1280px-2012_Honda_Civic_Ti_1.8_Front.jpg' },
  { gen: 10, years: '2015-2021', code: '10th Gen (FC/FK)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2017_Honda_Civic_Type_R_GT_VTEC_2.0_Front.jpg/1280px-2017_Honda_Civic_Type_R_GT_VTEC_2.0_Front.jpg' },
  { gen: 11, years: '2021-Present', code: '11th Gen (FE/FL)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/2023_Honda_Civic_Type_R_%28FL5%29_Front.jpg/1280px-2023_Honda_Civic_Type_R_%28FL5%29_Front.jpg' }
];

const generations = gensData.map(g => ({
  id: `gen-civic-${g.gen}`,
  model_id: CIVIC_ID,
  generation_code: g.code,
  canonical_name: `${g.gen}th Generation`,
  slug: `gen-${g.gen}`,
  production_start: parseInt(g.years.split('-')[0]),
  production_end: g.years.split('-')[1] === 'Present' ? null : parseInt(g.years.split('-')[1]),
  catalogue_status: 'PUBLISHED',
  is_ui_fixture: true,
  hero_image_url: g.img
}));

const engineData = [
  { id: 'eng-eb1', slug: 'eb1', name: 'EB1 1.2L', code: 'EB1', disp: 1170, cyl: 4, hp: 50 },
  { id: 'eng-ed1', slug: 'ed1', name: 'ED1 1.5L', code: 'ED1', disp: 1488, cyl: 4, hp: 70 },
  { id: 'eng-ew3', slug: 'ew3', name: 'EW3 1.5L', code: 'EW3', disp: 1488, cyl: 4, hp: 91 },
  { id: 'eng-b16a', slug: 'b16a', name: 'B16A 1.6L', code: 'B16A', disp: 1595, cyl: 4, hp: 158 },
  { id: 'eng-b16a2', slug: 'b16a2', name: 'B16A2 1.6L', code: 'B16A2', disp: 1595, cyl: 4, hp: 160 },
  { id: 'eng-b16b', slug: 'b16b', name: 'B16B 1.6L', code: 'B16B', disp: 1595, cyl: 4, hp: 182 },
  { id: 'eng-k20a2', slug: 'k20a2', name: 'K20A2 2.0L', code: 'K20A2', disp: 1998, cyl: 4, hp: 200 },
  { id: 'eng-k20z3', slug: 'k20z3', name: 'K20Z3 2.0L', code: 'K20Z3', disp: 1998, cyl: 4, hp: 197 },
  { id: 'eng-k20a', slug: 'k20a', name: 'K20A 2.0L', code: 'K20A', disp: 1998, cyl: 4, hp: 222 },
  // Consolidated K20C1 (removed K20C1-FL5)
  { id: 'eng-k20c1', slug: 'k20c1', name: 'K20C1 2.0L Turbo', code: 'K20C1', disp: 1996, cyl: 4, hp: 306, turbo: true }
];

const engines = engineData.map(e => ({
  id: e.id,
  slug: e.slug,
  canonical_name: e.name,
  engine_code: e.code,
  manufacturer_id: HONDA_ID,
  specs: {
    displacement_cc: e.disp,
    cylinders: e.cyl,
    architecture: 'Inline',
    aspiration: e.turbo ? 'Turbocharged' : 'Naturally Aspirated',
    power_hp: e.hp
  },
  data_status: 'demo',
  catalogue_status: 'PUBLISHED',
  is_ui_fixture: true
}));

const variantData = [
  { id: 'v-civic-1200', gen: 1, name: '1200 3-door', eng: 'eng-eb1', img: gensData[0].img, hp: 50 },
  { id: 'v-civic-1500', gen: 2, name: '1500 3-door', eng: 'eng-ed1', img: gensData[1].img, hp: 70 },
  { id: 'v-civic-si-ah', gen: 3, name: 'Si (AH)', eng: 'eng-ew3', img: gensData[2].img, hp: 91 },
  { id: 'v-civic-sir-ef9', gen: 4, name: 'SiR (EF9)', eng: 'eng-b16a', img: gensData[3].img, hp: 158 },
  { id: 'v-civic-sir-eg6', gen: 5, name: 'SiR II (EG6)', eng: 'eng-b16a2', img: gensData[4].img, hp: 160 },
  { id: 'v-civic-type-r-ek9', gen: 6, name: 'Type R (EK9)', eng: 'eng-b16b', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/1998_Honda_Civic_Type_R.jpg/1280px-1998_Honda_Civic_Type_R.jpg', hp: 182 },
  { id: 'v-civic-type-r-ep3', gen: 7, name: 'Type R (EP3)', eng: 'eng-k20a2', img: gensData[6].img, hp: 200 },
  { id: 'v-civic-si-fg2', gen: 8, name: 'Si Coupe (FG2)', eng: 'eng-k20z3', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Honda_Civic_Si_Coupe_--_08-28-2009.jpg/1280px-Honda_Civic_Si_Coupe_--_08-28-2009.jpg', hp: 197 },
  { id: 'v-civic-type-r-fd2', gen: 8, name: 'Type R Sedan (FD2)', eng: 'eng-k20a', img: gensData[7].img, hp: 222 },
  { id: 'v-civic-type-r-fk2', gen: 9, name: 'Type R (FK2)', eng: 'eng-k20c1', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Honda_Civic_Type_R_%28FK2%29_Front_View.jpg/1280px-Honda_Civic_Type_R_%28FK2%29_Front_View.jpg', hp: 306 },
  { id: 'v-civic-type-r-fk8', gen: 10, name: 'Type R (FK8)', eng: 'eng-k20c1', img: gensData[9].img, hp: 306 },
  { id: 'v-civic-type-r-fl5', gen: 11, name: 'Type R (FL5)', eng: 'eng-k20c1', img: gensData[10].img, hp: 315 } // Note: using k20c1 but with 315hp
];

const variants = variantData.map(v => {
  const e = engines.find(eng => eng.id === v.eng);
  return {
    id: v.id,
    generation_id: `gen-civic-${v.gen}`,
    manufacturer_id: HONDA_ID,
    manufacturer_name: 'Honda',
    model_name: 'Civic',
    slug: v.id.replace('v-', ''),
    variant_name: v.name,
    data_status: 'demo', // Use demo now since we use is_ui_fixture
    catalogue_status: 'PUBLISHED',
    is_ui_fixture: true,
    hero_image_url: v.img,
    canonical_engine_id: v.eng,
    engine: {
      displacement_cc: e.specs.displacement_cc,
      cylinders: e.specs.cylinders,
      architecture: e.specs.architecture,
      aspiration: e.specs.aspiration,
      power_hp: v.hp
    }
  };
});

let testCatStr = `
import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../types';

export const TEST_MAKERS: Maker[] = ${JSON.stringify(makers, null, 2)};
export const TEST_MODELS: Model[] = ${JSON.stringify(models, null, 2)};
export const TEST_GENERATIONS: Generation[] = ${JSON.stringify(generations, null, 2)};
export const TEST_VARIANTS: VehicleVariant[] = ${JSON.stringify(variants, null, 2)};
export const TEST_CANONICAL_ENGINES: CanonicalEngine[] = ${JSON.stringify(engines, null, 2)};
`;

fs.writeFileSync('src/data/testCatalogue.ts', testCatStr);
