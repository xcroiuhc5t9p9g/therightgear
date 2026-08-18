export interface FooterLink {
  id: string;
  label: string;
  pageKey?: string; // e.g. 'home', 'market', 'graph', 'compare', 'ai-advisor', 'listings', 'editorial', 'watchlist', 'register', 'profile', 'super_admin'
  url?: string;
  isExternal?: boolean;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

const DEFAULT_FOOTER_SECTIONS: FooterSection[] = [
  {
    id: 'sec-catalogue',
    title: 'CATALOGUE',
    links: [
      { id: 'lnk-market', label: 'Market Intelligence', pageKey: 'market' },
    ],
  },
  {
    id: 'sec-about',
    title: 'ABOUT',
    links: [
      { id: 'lnk-about', label: 'About The Right Gear', pageKey: 'about' },
      { id: 'lnk-methodology', label: 'Methodology', pageKey: 'methodology' },
      { id: 'lnk-contact', label: 'Contact', pageKey: 'contact' },
      { id: 'lnk-privacy', label: 'Privacy Policy', pageKey: 'privacy' },
      { id: 'lnk-terms', label: 'Terms of Use', pageKey: 'terms' },
    ],
  }
];

const LOCAL_STORAGE_KEY = 'the_right_gear_footer_sections_v1';

class FooterStore {
  private sections: FooterSection[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.sections = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored footer links', e);
    }
    this.sections = [...DEFAULT_FOOTER_SECTIONS];
  }

  private saveToStorage() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.sections));
    } catch (e) {
      console.warn('Failed to save footer links to storage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getSections(): FooterSection[] {
    return this.sections;
  }

  public addSection(title: string): FooterSection {
    const newSec: FooterSection = {
      id: `sec-${Date.now()}`,
      title,
      links: []
    };
    this.sections.push(newSec);
    this.saveToStorage();
    return newSec;
  }

  public updateSectionTitle(sectionId: string, title: string) {
    const sec = this.sections.find(s => s.id === sectionId);
    if (sec) {
      sec.title = title;
      this.saveToStorage();
    }
  }

  public deleteSection(sectionId: string) {
    this.sections = this.sections.filter(s => s.id !== sectionId);
    this.saveToStorage();
  }

  public moveSection(sectionId: string, direction: 'up' | 'down') {
    const index = this.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= this.sections.length) return;

    const temp = this.sections[index];
    this.sections[index] = this.sections[targetIdx];
    this.sections[targetIdx] = temp;
    this.saveToStorage();
  }

  public addLink(sectionId: string, linkData: Omit<FooterLink, 'id'>): FooterLink | null {
    const sec = this.sections.find(s => s.id === sectionId);
    if (!sec) return null;
    const newLink: FooterLink = {
      id: `lnk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...linkData
    };
    sec.links.push(newLink);
    this.saveToStorage();
    return newLink;
  }

  public updateLink(sectionId: string, linkId: string, linkData: Partial<Omit<FooterLink, 'id'>>) {
    const sec = this.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const link = sec.links.find(l => l.id === linkId);
    if (link) {
      Object.assign(link, linkData);
      this.saveToStorage();
    }
  }

  public deleteLink(sectionId: string, linkId: string) {
    const sec = this.sections.find(s => s.id === sectionId);
    if (!sec) return;
    sec.links = sec.links.filter(l => l.id !== linkId);
    this.saveToStorage();
  }

  public moveLink(sectionId: string, linkId: string, direction: 'up' | 'down') {
    const sec = this.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const index = sec.links.findIndex(l => l.id === linkId);
    if (index === -1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sec.links.length) return;

    const temp = sec.links[index];
    sec.links[index] = sec.links[targetIdx];
    sec.links[targetIdx] = temp;
    this.saveToStorage();
  }

  public resetToDefault() {
    this.sections = JSON.parse(JSON.stringify(DEFAULT_FOOTER_SECTIONS));
    this.saveToStorage();
  }
}

export const footerStore = new FooterStore();
