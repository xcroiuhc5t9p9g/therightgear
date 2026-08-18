with open("src/services/catalogueRepository.ts", "r") as f:
    content = f.read()

search_code = """
  // --- SEARCH ---
  public search(query: string): any[] {
    const qLower = query.toLowerCase().trim();
    if (qLower.length < 2) return [];

    const results: any[] = [];
    
    // Makers
    this.makers.filter(m => m.canonical_name.toLowerCase().includes(qLower)).forEach(m => {
      results.push({
        id: m.id,
        title: m.canonical_name,
        type: 'MAKER',
        url: `/brands/${m.slug}`,
        makerSlug: m.slug,
        thumbnail: m.logo_url
      });
    });

    // Models
    this.models.filter(m => m.canonical_name.toLowerCase().includes(qLower)).forEach(m => {
      const maker = this.makers.find(mk => mk.id === m.maker_id);
      if (maker) {
        results.push({
          id: m.id,
          title: `${maker.canonical_name} ${m.canonical_name}`,
          type: 'MODEL',
          url: `/cars/${maker.slug}/${m.slug}`,
          makerSlug: maker.slug,
          modelSlug: m.slug
        });
      }
    });

    // Generations
    this.generations.filter(g => g.canonical_name.toLowerCase().includes(qLower) || g.generation_code.toLowerCase().includes(qLower)).forEach(g => {
      const model = this.models.find(m => m.id === g.model_id);
      if (model) {
        const maker = this.makers.find(mk => mk.id === model.maker_id);
        if (maker) {
          results.push({
            id: g.id,
            title: `${maker.canonical_name} ${model.canonical_name} · ${g.generation_code}`,
            type: 'GENERATION',
            url: `/cars/${maker.slug}/${model.slug}/${g.slug}`,
            makerSlug: maker.slug,
            modelSlug: model.slug,
            generationSlug: g.slug
          });
        }
      }
    });

    // Variants
    this.variants.filter(v => v.variant_name.toLowerCase().includes(qLower)).forEach(v => {
      const generation = this.generations.find(g => g.id === v.generation_id);
      if (generation) {
        const model = this.models.find(m => m.id === generation.model_id);
        if (model) {
          const maker = this.makers.find(mk => mk.id === model.maker_id);
          if (maker) {
            results.push({
              id: v.id,
              title: `${maker.canonical_name} ${model.canonical_name} · ${generation.generation_code} · ${v.variant_name}`,
              type: 'VARIANT',
              url: `/cars/${maker.slug}/${model.slug}/${generation.slug}/${v.slug}`,
              makerSlug: maker.slug,
              modelSlug: model.slug,
              generationSlug: generation.slug,
              variantSlug: v.slug,
              thumbnail: v.hero_image
            });
          }
        }
      }
    });

    return results.slice(0, 8);
  }
"""

if "// --- SEARCH ---" not in content:
    content = content.replace("export class CatalogueRepository {", "export class CatalogueRepository {" + search_code)
    
with open("src/services/catalogueRepository.ts", "w") as f:
    f.write(content)
