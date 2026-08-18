import { VehicleVariant, HomeSlide } from '../types';
import { catalogueRepository } from './catalogueRepository';

const STORAGE_KEY = 'unified_vehicle_repository_v2';
const SLIDES_STORAGE_KEY = 'unified_home_slides_v1';

export const DEFAULT_SLIDES: HomeSlide[] = [
  {
    id: 'slide-1',
    badge: 'Dynamic Registration',
    title: 'Automotive Passion & Intelligence',
    subtitle: 'Access the certified historical database. Register as a Private Collector to manage your garage or as a Professional Operator (Dealer / Auctions).',
    ctaText: 'Create Account (Private or Dealer)',
    ctaPage: 'register',
    bgImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop',
    accentColor: 'from-red-600/25 to-slate-950/70'
  },
  {
    id: 'slide-2',
    badge: 'Auction Financial Analytics',
    title: 'Top Gainers, Losers & Auction Volumes',
    subtitle: 'Monitor annual appreciation across over 300 models. Aggregated historical data in real-time from Monterey, Paris, and Como auctions.',
    ctaText: 'Explore Market Analytics',
    ctaPage: 'market',
    bgImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop',
    accentColor: 'from-emerald-500/20 to-slate-900/60'
  },
  {
    id: 'slide-3',
    badge: 'Car DNA & Historical Network',
    title: 'Engineers, Designers & Coachbuilders',
    subtitle: 'Discover the network of historical relationships connecting Nicola Materazzi, Pininfarina, Gordon Murray, and automotive icons.',
    ctaText: 'Explore its DNA',
    ctaPage: 'graph',
    bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop',
    accentColor: 'from-blue-500/20 to-purple-950/60'
  }
];

function loadInitialSlides(): HomeSlide[] {
  try {
    const saved = localStorage.getItem(SLIDES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 3) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading home slides:', e);
  }
  return DEFAULT_SLIDES;
}

// Unified store initialization helper
function loadInitialVehicles(): VehicleVariant[] {
  let list: VehicleVariant[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {
    console.error('Error loading vehicles from localStorage:', e);
  }
  if (!list || list.length === 0) {
    list = catalogueRepository.getAllVariants().vehicles;
  }

  // Ensure default in_primo_piano values exist if none were explicitly set
  const hasInPrimoPiano = list.some(v => v.in_primo_piano === true);
  if (!hasInPrimoPiano) {
    list = list.map((v, idx) => ({
      ...v,
      // Mark Hero tier vehicles or first 6 vehicles in primo piano
      in_primo_piano: v.tier === 'Hero' || idx < 6
    }));
  }

  return list;
}

class UnifiedVehicleStore {
  private vehicles: VehicleVariant[];
  private slides: HomeSlide[];
  private listeners: (() => void)[] = [];

  constructor() {
    this.vehicles = loadInitialVehicles();
    this.slides = loadInitialSlides();
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.vehicles));
      localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(this.slides));
    } catch (e) {
      console.error('Failed to save data to localStorage:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  public getAll(): VehicleVariant[] {
    return [...this.vehicles];
  }

  public getPublished(): VehicleVariant[] {
    return this.vehicles.filter(v => v.data_status !== 'provisional' && v.data_status !== 'imported');
  }

  public getInPrimoPiano(): VehicleVariant[] {
    return this.vehicles.filter(v => v.in_primo_piano === true);
  }

  public toggleInPrimoPiano(id: string): boolean {
    const v = this.vehicles.find(item => item.id === id || item.slug === id);
    if (v) {
      v.in_primo_piano = !v.in_primo_piano;
      this.save();
      return v.in_primo_piano;
    }
    return false;
  }

  public getHomeSlides(): HomeSlide[] {
    return [...this.slides];
  }

  public updateHomeSlide(index: number, updatedData: Partial<HomeSlide>): HomeSlide | null {
    if (index < 0 || index >= this.slides.length) return null;
    this.slides[index] = {
      ...this.slides[index],
      ...updatedData
    };
    this.save();
    return this.slides[index];
  }

  public addHomeSlide(slide: Omit<HomeSlide, 'id'> & { id?: string }): HomeSlide {
    const newSlide: HomeSlide = {
      id: slide.id || `slide-${Date.now()}`,
      badge: slide.badge || 'News',
      title: slide.title || 'Nuovo Titolo Slide',
      subtitle: slide.subtitle || 'Descrizione personalizzata per la slide.',
      ctaText: slide.ctaText || 'Scopri di più',
      ctaPage: slide.ctaPage || 'market',
      bgImage: slide.bgImage || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop',
      accentColor: slide.accentColor || 'from-red-600/25 to-slate-950/70'
    };
    this.slides.push(newSlide);
    this.save();
    return newSlide;
  }

  public deleteHomeSlide(indexOrId: number | string): boolean {
    if (this.slides.length <= 1) {
      console.warn('Cannot delete the last remaining slide.');
      return false;
    }
    if (typeof indexOrId === 'number') {
      if (indexOrId >= 0 && indexOrId < this.slides.length) {
        this.slides.splice(indexOrId, 1);
        this.save();
        return true;
      }
    } else {
      const idx = this.slides.findIndex(s => s.id === indexOrId);
      if (idx !== -1) {
        this.slides.splice(idx, 1);
        this.save();
        return true;
      }
    }
    return false;
  }

  public moveHomeSlide(fromIndex: number, toIndex: number): boolean {
    if (fromIndex < 0 || fromIndex >= this.slides.length) return false;
    if (toIndex < 0 || toIndex >= this.slides.length) return false;
    const [moved] = this.slides.splice(fromIndex, 1);
    this.slides.splice(toIndex, 0, moved);
    this.save();
    return true;
  }

  public setHomeSlides(slides: HomeSlide[]) {
    if (Array.isArray(slides) && slides.length > 0) {
      this.slides = slides;
      this.save();
    }
  }

  public getByIdOrSlug(idOrSlug: string): VehicleVariant | undefined {
    return this.vehicles.find(v => v.id === idOrSlug || v.slug === idOrSlug);
  }

  public add(vehicle: VehicleVariant): VehicleVariant {
    const exists = this.vehicles.some(v => v.id === vehicle.id || v.slug === vehicle.slug);
    if (exists) {
      vehicle.id = `${vehicle.id}-${Date.now()}`;
      vehicle.slug = `${vehicle.slug}-${Date.now()}`;
    }
    this.vehicles.unshift(vehicle);
    this.save();
    return vehicle;
  }

  public update(id: string, updatedData: Partial<VehicleVariant>): VehicleVariant | null {
    const index = this.vehicles.findIndex(v => v.id === id || v.slug === id);
    if (index === -1) return null;

    this.vehicles[index] = {
      ...this.vehicles[index],
      ...updatedData,
    };
    this.save();
    return this.vehicles[index];
  }

  public delete(id: string): boolean {
    const prevLength = this.vehicles.length;
    this.vehicles = this.vehicles.filter(v => v.id !== id && v.slug !== id);
    if (this.vehicles.length !== prevLength) {
      this.save();
      return true;
    }
    return false;
  }

  public publish(id: string): VehicleVariant | null {
    return this.update(id, {
      data_status: 'verified',
    });
  }

  public importBatch(newRecords: VehicleVariant[]): { importedCount: number; errors: string[] } {
    const errors: string[] = [];
    let count = 0;

    newRecords.forEach((rec, idx) => {
      if (!rec.manufacturer_name || !rec.model_name) {
        errors.push(`Record #${idx + 1}: Manca il Produttore o il Nome Modello.`);
        return;
      }

      const id = rec.id || `v-imported-${Date.now()}-${idx}`;
      const slug = rec.slug || `${rec.manufacturer_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${rec.model_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${idx}`;

      const formatted: VehicleVariant = {
        steering_side: 'LHD',
        limited_edition: true,
        numbered_series: false,
        gallery_images: [rec.hero_image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop'],
        price_history: [],
        designers: [],
        engineers: [],
        coachbuilders: [],
        assembly_plant: 'Italy',
        estimated_surviving_units: rec.production_total ? Math.round(rec.production_total * 0.8) : 80,
        historical_summary: `${rec.manufacturer_name} ${rec.model_name} ${rec.variant_name || ''}. High performance sports record.`,
        key_milestones: ['Database Import'],
        market_stats: {
          median_price_eur: 250000,
          highest_auction_eur: 450000,
          lowest_auction_eur: 180000,
          auction_volume_annual: 5,
          price_trend_5yr_pct: 12,
        },
        ...rec,
        id,
        slug,
        generation_id: rec.generation_id || `gen-${id}`,
        manufacturer_id: rec.manufacturer_id || `m-${rec.manufacturer_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        manufacturer_name: rec.manufacturer_name,
        model_name: rec.model_name,
        variant_name: rec.variant_name || `${rec.model_name} Standard Spec`,
        tier: rec.tier || 'Discovery',
        category: rec.category || 'Supercar',
        market_code: rec.market_code || 'EUR-SPEC',
        model_year_from: Number(rec.model_year_from) || 1990,
        model_year_to: rec.model_year_to ? Number(rec.model_year_to) : undefined,
        body_style: rec.body_style || 'Coupé',
        production_total: rec.production_total ? Number(rec.production_total) : 100,
        data_status: rec.data_status || 'imported',
        hero_image_url: rec.hero_image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop',
        engine: rec.engine || {
          id: `eng-${id}`,
          manufacturer_id: `m-${rec.manufacturer_name.toLowerCase()}`,
          engine_code: 'STD-ENGINE',
          family_name: `${rec.manufacturer_name} Powertrain`,
          architecture: 'V8',
          cylinders: 8,
          displacement_cc: 3000,
          aspiration: 'Naturally Aspirated',
          fuel_type: 'Petrol',
          power_kw: 300,
          power_hp: 408,
          torque_nm: 450,
        },
        transmission: rec.transmission || {
          id: `trans-${id}`,
          name: 'Manual Transmission',
          type: 'Manual',
          gears: 6,
          manufacturer: rec.manufacturer_name,
          drivetrain: 'RWD',
        },
        specs: rec.specs || {
          kerb_weight_kg: 1350,
          length_mm: 4400,
          width_mm: 1900,
          height_mm: 1200,
          wheelbase_mm: 2500,
          top_speed_kph: 280,
          acceleration_0_100: 4.5,
          power_to_weight_hp_ton: 300,
          fuel_capacity_l: 80,
        },
        scores: rec.scores || {
          collector_score: {
            overall_score: 85,
            rarity_weight: 80,
            historical_relevance: 85,
            desirability: 88,
            originality_typical: 90,
            technical_relevance: 85,
            brand_recognizability: 90,
            community_culture: 82,
          },
          investment_score: {
            overall_score: 82,
            market_trend: 80,
            liquidity: 75,
            supply_scarcity: 85,
            international_demand: 88,
            inverse_volatility: 80,
            inverse_maintenance_cost: 70,
            comparable_stability: 82,
          },
          rarity_score: 85,
          confidence_level: 'High',
        },
      } as VehicleVariant;

      this.vehicles.unshift(formatted);
      count++;
    });

    if (count > 0) {
      this.save();
    }

    return { importedCount: count, errors };
  }

  public resetToDefault() {
    this.vehicles = catalogueRepository.getAllVariants().vehicles;
    this.save();
  }
}

export const unifiedVehicleStore = new UnifiedVehicleStore();
