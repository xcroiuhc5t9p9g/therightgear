import re

with open("src/services/catalogueRepository.ts", "r") as f:
    content = f.read()

func_code = """
  // --- CANONICAL ROUTING ---
  public getCanonicalEntityUrl(type: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT', ids: { makerId?: string, modelId?: string, generationId?: string, variantId?: string }): string {
    if (type === 'MAKER' && ids.makerId) {
      const m = this.makers.find(mk => mk.id === ids.makerId);
      return m ? `/brands/${m.slug}` : '';
    }
    if (type === 'MODEL' && ids.modelId) {
      const mod = this.models.find(m => m.id === ids.modelId);
      const mak = mod ? this.makers.find(m => m.id === mod.maker_id) : undefined;
      if (mak && mod) return `/cars/${mak.slug}/${mod.slug}`;
    }
    if (type === 'GENERATION' && ids.generationId) {
      const gen = this.generations.find(g => g.id === ids.generationId);
      const mod = gen ? this.models.find(m => m.id === gen.model_id) : undefined;
      const mak = mod ? this.makers.find(m => m.id === mod.maker_id) : undefined;
      if (mak && mod && gen) return `/cars/${mak.slug}/${mod.slug}/${gen.slug}`;
    }
    if (type === 'VARIANT' && ids.variantId) {
      const varnt = this.variants.find(v => v.id === ids.variantId);
      const gen = varnt ? this.generations.find(g => g.id === varnt.generation_id) : undefined;
      const mod = gen ? this.models.find(m => m.id === gen.model_id) : undefined;
      const mak = mod ? this.makers.find(m => m.id === mod.maker_id) : undefined;
      if (mak && mod && gen && varnt) return `/cars/${mak.slug}/${mod.slug}/${gen.slug}/${varnt.slug}`;
    }
    return '';
  }
"""

if "getCanonicalEntityUrl" not in content:
    content = content.replace("public search(query: string)", func_code + "\n  public search(query: string)")

content = re.sub(r'url: `/brands/\$\{m.slug\}`', 'url: this.getCanonicalEntityUrl(\'MAKER\', { makerId: m.id })', content)
content = re.sub(r'url: `/cars/\$\{maker.slug\}/\$\{m.slug\}`', 'url: this.getCanonicalEntityUrl(\'MODEL\', { modelId: m.id })', content)
content = re.sub(r'url: `/cars/\$\{maker.slug\}/\$\{model.slug\}/\$\{g.slug\}`', 'url: this.getCanonicalEntityUrl(\'GENERATION\', { generationId: g.id })', content)
content = re.sub(r'url: `/cars/\$\{maker.slug\}/\$\{model.slug\}/\$\{generation.slug\}/\$\{v.slug\}`', 'url: this.getCanonicalEntityUrl(\'VARIANT\', { variantId: v.id })', content)


with open("src/services/catalogueRepository.ts", "w") as f:
    f.write(content)
