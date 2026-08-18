export interface UiPersonFixture {
  slug: string;
  canonical_name: string;
  roles: string[];
  short_profile: string;
  portrait_url: string;
  related_organizations?: Array<{
    canonical_name: string;
    slug: string;
    type: string;
  }>;
  related_machines?: Array<{
    canonical_name: string;
    maker: string;
    maker_slug: string;
    model_slug: string;
    type: string;
    production_range?: string;
    generations_count?: number;
  }>;
  related_generations?: Array<{
    canonical_name: string;
    maker_slug: string;
    model_slug: string;
    gen_slug: string;
    type: string;
  }>;
}

export const PERSON_FIXTURES: Record<string, UiPersonFixture> = {
  'soichiro-honda': {
    slug: 'soichiro-honda',
    canonical_name: 'Soichiro Honda',
    roles: ['Founder', 'Engineer'],
    short_profile: 'Honda co-founder and engineering leader connected to the original Civic vision.',
    portrait_url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Honda_Souichiro_zaikai_1964.jpg',
    related_organizations: [
      {
        canonical_name: 'Honda',
        slug: 'honda',
        type: 'brands'
      }
    ],
    related_machines: [
      {
        canonical_name: 'Honda Civic',
        maker: 'Honda',
        maker_slug: 'honda',
        model_slug: 'civic',
        type: 'model',
        production_range: '1972 — Present',
        generations_count: 11
      }
    ],
    related_generations: [
      {
        canonical_name: 'Honda Civic · 1st Generation',
        maker_slug: 'honda',
        model_slug: 'civic',
        gen_slug: 'gen-1',
        type: 'generation'
      }
    ]
  }
};
