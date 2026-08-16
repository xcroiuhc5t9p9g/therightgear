
import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../types';

export const TEST_MAKERS: Maker[] = [
  {
    "id": "mkr-honda",
    "slug": "honda",
    "canonical_name": "Honda",
    "official_name": "Honda Motor Co., Ltd.",
    "country_code": "JP",
    "founded_year": 1948,
    "active": true,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "logo_url": "/brand/makers/honda.svg"
  }
];
export const TEST_MODELS: Model[] = [
  {
    "id": "mdl-civic",
    "maker_id": "mkr-honda",
    "canonical_name": "Civic",
    "slug": "civic",
    "introduced_year": 1972,
    "discontinued_year": null,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg/1280px-Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg"
  }
];
export const TEST_GENERATIONS: Generation[] = [
  {
    "id": "gen-civic-1",
    "model_id": "mdl-civic",
    "generation_code": "1st Gen",
    "canonical_name": "1th Generation",
    "slug": "gen-1",
    "production_start": 1972,
    "production_end": 1979,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Honda_Civic_CVCC.jpg/1280px-Honda_Civic_CVCC.jpg"
  },
  {
    "id": "gen-civic-2",
    "model_id": "mdl-civic",
    "generation_code": "2nd Gen",
    "canonical_name": "2th Generation",
    "slug": "gen-2",
    "production_start": 1979,
    "production_end": 1983,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Honda_Civic_arriving_Schaffen-Diest_2018.jpg/1280px-Honda_Civic_arriving_Schaffen-Diest_2018.jpg"
  },
  {
    "id": "gen-civic-3",
    "model_id": "mdl-civic",
    "generation_code": "3rd Gen (AH/AK/AT)",
    "canonical_name": "3th Generation",
    "slug": "gen-3",
    "production_start": 1983,
    "production_end": 1987,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Honda_Civic_1.5i_GT_%28AH%29.jpg/1280px-Honda_Civic_1.5i_GT_%28AH%29.jpg"
  },
  {
    "id": "gen-civic-4",
    "model_id": "mdl-civic",
    "generation_code": "4th Gen (EF/ED)",
    "canonical_name": "4th Generation",
    "slug": "gen-4",
    "production_start": 1987,
    "production_end": 1991,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/1990_Honda_Civic_ED6_1.5_GL_3-door_hatchback_%282011-06-15%29_01.jpg/1280px-1990_Honda_Civic_ED6_1.5_GL_3-door_hatchback_%282011-06-15%29_01.jpg"
  },
  {
    "id": "gen-civic-5",
    "model_id": "mdl-civic",
    "generation_code": "5th Gen (EG/EH)",
    "canonical_name": "5th Generation",
    "slug": "gen-5",
    "production_start": 1991,
    "production_end": 1995,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/1992-1995_Honda_Civic_VTi_hatchback_%282015-12-28%29_01.jpg/1280px-1992-1995_Honda_Civic_VTi_hatchback_%282015-12-28%29_01.jpg"
  },
  {
    "id": "gen-civic-6",
    "model_id": "mdl-civic",
    "generation_code": "6th Gen (EK/EJ)",
    "canonical_name": "6th Generation",
    "slug": "gen-6",
    "production_start": 1995,
    "production_end": 2000,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/1998_Honda_Civic_CXi_3-door_hatchback_%282010-09-19%29_01.jpg/1280px-1998_Honda_Civic_CXi_3-door_hatchback_%282010-09-19%29_01.jpg"
  },
  {
    "id": "gen-civic-7",
    "model_id": "mdl-civic",
    "generation_code": "7th Gen (EP/ES)",
    "canonical_name": "7th Generation",
    "slug": "gen-7",
    "production_start": 2000,
    "production_end": 2005,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2004_Honda_Civic_%28EP3%29_Type_R_3-door_hatchback_%282015-10-24%29_01.jpg/1280px-2004_Honda_Civic_%28EP3%29_Type_R_3-door_hatchback_%282015-10-24%29_01.jpg"
  },
  {
    "id": "gen-civic-8",
    "model_id": "mdl-civic",
    "generation_code": "8th Gen (FD/FN/FK)",
    "canonical_name": "8th Generation",
    "slug": "gen-8",
    "production_start": 2005,
    "production_end": 2011,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2007_Honda_Civic_Type_R_2.0_Front.jpg/1280px-2007_Honda_Civic_Type_R_2.0_Front.jpg"
  },
  {
    "id": "gen-civic-9",
    "model_id": "mdl-civic",
    "generation_code": "9th Gen (FB/FK)",
    "canonical_name": "9th Generation",
    "slug": "gen-9",
    "production_start": 2011,
    "production_end": 2015,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2012_Honda_Civic_Ti_1.8_Front.jpg/1280px-2012_Honda_Civic_Ti_1.8_Front.jpg"
  },
  {
    "id": "gen-civic-10",
    "model_id": "mdl-civic",
    "generation_code": "10th Gen (FC/FK)",
    "canonical_name": "10th Generation",
    "slug": "gen-10",
    "production_start": 2015,
    "production_end": 2021,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2017_Honda_Civic_Type_R_GT_VTEC_2.0_Front.jpg/1280px-2017_Honda_Civic_Type_R_GT_VTEC_2.0_Front.jpg"
  },
  {
    "id": "gen-civic-11",
    "model_id": "mdl-civic",
    "generation_code": "11th Gen (FE/FL)",
    "canonical_name": "11th Generation",
    "slug": "gen-11",
    "production_start": 2021,
    "production_end": null,
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/2023_Honda_Civic_Type_R_%28FL5%29_Front.jpg/1280px-2023_Honda_Civic_Type_R_%28FL5%29_Front.jpg"
  }
];
export const TEST_VARIANTS: VehicleVariant[] = [
  {
    "id": "v-civic-1200",
    "generation_id": "gen-civic-1",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-1200",
    "variant_name": "1200 3-door",
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Honda_Civic_CVCC.jpg/1280px-Honda_Civic_CVCC.jpg",
    "canonical_engine_id": "eng-eb1",
    "engine": {
      "displacement_cc": 1170,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 50
    }
  },
  {
    "id": "v-civic-1500",
    "generation_id": "gen-civic-2",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-1500",
    "variant_name": "1500 3-door",
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Honda_Civic_arriving_Schaffen-Diest_2018.jpg/1280px-Honda_Civic_arriving_Schaffen-Diest_2018.jpg",
    "canonical_engine_id": "eng-ed1",
    "engine": {
      "displacement_cc": 1488,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 70
    }
  },
  {
    "id": "v-civic-si-ah",
    "generation_id": "gen-civic-3",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-si-ah",
    "variant_name": "Si (AH)",
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Honda_Civic_1.5i_GT_%28AH%29.jpg/1280px-Honda_Civic_1.5i_GT_%28AH%29.jpg",
    "canonical_engine_id": "eng-ew3",
    "engine": {
      "displacement_cc": 1488,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 91
    }
  },
  {
    "id": "v-civic-sir-ef9",
    "generation_id": "gen-civic-4",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-sir-ef9",
    "variant_name": "SiR (EF9)",
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/1990_Honda_Civic_ED6_1.5_GL_3-door_hatchback_%282011-06-15%29_01.jpg/1280px-1990_Honda_Civic_ED6_1.5_GL_3-door_hatchback_%282011-06-15%29_01.jpg",
    "canonical_engine_id": "eng-b16a",
    "engine": {
      "displacement_cc": 1595,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 158
    }
  },
  {
    "id": "v-civic-sir-eg6",
    "generation_id": "gen-civic-5",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-sir-eg6",
    "variant_name": "SiR II (EG6)",
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/1992-1995_Honda_Civic_VTi_hatchback_%282015-12-28%29_01.jpg/1280px-1992-1995_Honda_Civic_VTi_hatchback_%282015-12-28%29_01.jpg",
    "canonical_engine_id": "eng-b16a2",
    "engine": {
      "displacement_cc": 1595,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 160
    }
  },
  {
    "id": "v-civic-type-r-ek9",
    "generation_id": "gen-civic-6",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-type-r-ek9",
    "variant_name": "Type R (EK9)",
    "technical_identifiers": ["EK9"],
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/1998_Honda_Civic_Type_R.jpg/1280px-1998_Honda_Civic_Type_R.jpg",
    "canonical_engine_id": "eng-b16b",
    "engine": {
      "displacement_cc": 1595,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 182
    }
  },
  {
    "id": "v-civic-type-r-ep3",
    "generation_id": "gen-civic-7",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-type-r-ep3",
    "variant_name": "Type R (EP3)",
    "technical_identifiers": ["EP3"],
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2004_Honda_Civic_%28EP3%29_Type_R_3-door_hatchback_%282015-10-24%29_01.jpg/1280px-2004_Honda_Civic_%28EP3%29_Type_R_3-door_hatchback_%282015-10-24%29_01.jpg",
    "canonical_engine_id": "eng-k20a2",
    "engine": {
      "displacement_cc": 1998,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 200
    }
  },
  {
    "id": "v-civic-si-fg2",
    "generation_id": "gen-civic-8",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-si-fg2",
    "variant_name": "Si Coupe (FG2)",
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Honda_Civic_Si_Coupe_--_08-28-2009.jpg/1280px-Honda_Civic_Si_Coupe_--_08-28-2009.jpg",
    "canonical_engine_id": "eng-k20z3",
    "engine": {
      "displacement_cc": 1998,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 197
    }
  },
  {
    "id": "v-civic-type-r-fd2",
    "generation_id": "gen-civic-8",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-type-r-fd2",
    "variant_name": "Type R Sedan (FD2)",
    "technical_identifiers": ["FD2"],
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2007_Honda_Civic_Type_R_2.0_Front.jpg/1280px-2007_Honda_Civic_Type_R_2.0_Front.jpg",
    "canonical_engine_id": "eng-k20a",
    "engine": {
      "displacement_cc": 1998,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 222
    }
  },
  {
    "id": "v-civic-type-r-fk2",
    "generation_id": "gen-civic-9",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-type-r-fk2",
    "variant_name": "Type R (FK2)",
    "technical_identifiers": ["FK2"],
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Honda_Civic_Type_R_%28FK2%29_Front_View.jpg/1280px-Honda_Civic_Type_R_%28FK2%29_Front_View.jpg",
    "canonical_engine_id": "eng-k20c1",
    "engine": {
      "displacement_cc": 1996,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Turbocharged",
      "power_hp": 306
    }
  },
  {
    "id": "v-civic-type-r-fk8",
    "generation_id": "gen-civic-10",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-type-r-fk8",
    "variant_name": "Type R (FK8)",
    "technical_identifiers": ["FK8"],
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2017_Honda_Civic_Type_R_GT_VTEC_2.0_Front.jpg/1280px-2017_Honda_Civic_Type_R_GT_VTEC_2.0_Front.jpg",
    "canonical_engine_id": "eng-k20c1",
    "engine": {
      "displacement_cc": 1996,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Turbocharged",
      "power_hp": 306
    }
  },
  {
    "id": "v-civic-type-r-fl5",
    "generation_id": "gen-civic-11",
    "manufacturer_id": "mkr-honda",
    "manufacturer_name": "Honda",
    "model_name": "Civic",
    "slug": "civic-type-r-fl5",
    "variant_name": "Type R (FL5)",
    "technical_identifiers": ["FL5"],
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true,
    "hero_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/2023_Honda_Civic_Type_R_%28FL5%29_Front.jpg/1280px-2023_Honda_Civic_Type_R_%28FL5%29_Front.jpg",
    "canonical_engine_id": "eng-k20c1",
    "engine": {
      "displacement_cc": 1996,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Turbocharged",
      "power_hp": 315
    }
  }
];
export const TEST_CANONICAL_ENGINES: CanonicalEngine[] = [
  {
    "id": "eng-eb1",
    "slug": "eb1",
    "canonical_name": "EB1 1.2L",
    "engine_code": "EB1",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1170,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 50
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-ed1",
    "slug": "ed1",
    "canonical_name": "ED1 1.5L",
    "engine_code": "ED1",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1488,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 70
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-ew3",
    "slug": "ew3",
    "canonical_name": "EW3 1.5L",
    "engine_code": "EW3",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1488,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 91
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-b16a",
    "slug": "b16a",
    "canonical_name": "B16A 1.6L",
    "engine_code": "B16A",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1595,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 158
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-b16a2",
    "slug": "b16a2",
    "canonical_name": "B16A2 1.6L",
    "engine_code": "B16A2",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1595,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 160
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-b16b",
    "slug": "b16b",
    "canonical_name": "B16B 1.6L",
    "engine_code": "B16B",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1595,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 182
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-k20a2",
    "slug": "k20a2",
    "canonical_name": "K20A2 2.0L",
    "engine_code": "K20A2",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1998,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 200
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-k20z3",
    "slug": "k20z3",
    "canonical_name": "K20Z3 2.0L",
    "engine_code": "K20Z3",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1998,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 197
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-k20a",
    "slug": "k20a",
    "canonical_name": "K20A 2.0L",
    "engine_code": "K20A",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1998,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Naturally Aspirated",
      "power_hp": 222
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  },
  {
    "id": "eng-k20c1",
    "slug": "k20c1",
    "canonical_name": "K20C1 2.0L Turbo",
    "engine_code": "K20C1",
    "manufacturer_id": "mkr-honda",
    "specs": {
      "displacement_cc": 1996,
      "cylinders": 4,
      "architecture": "Inline",
      "aspiration": "Turbocharged",
      "power_hp": 306
    },
    "data_status": "demo",
    "catalogue_status": "PUBLISHED",
    "is_ui_fixture": true
  }
];
