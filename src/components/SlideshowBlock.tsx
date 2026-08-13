import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight, 
  Edit3, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon,
  ExternalLink,
  Upload
} from 'lucide-react';
import { HomeSlide, UserRole } from '../types';
import { unifiedVehicleStore } from '../services/unifiedVehicleStore';

interface SlideshowBlockProps {
  activeRole?: UserRole;
  onNavigate: (page: string, slug?: string) => void;
  className?: string;
}

const PRESET_GRADIENTS = [
  { label: 'Racing Red (Default)', value: 'from-red-600/25 to-slate-950/70' },
  { label: 'Emerald Gold', value: 'from-emerald-500/20 to-slate-900/60' },
  { label: 'Deep Blue & Purple', value: 'from-blue-500/20 to-purple-950/60' },
  { label: 'Midnight Crimson', value: 'from-rose-500/20 to-slate-950/70' },
  { label: 'Carbon & Slate', value: 'from-slate-700/30 to-slate-950/80' },
];

const PRESET_IMAGES = [
  { label: 'Ferrari F40 / Red Supercar', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop' },
  { label: 'Porsche 911 / Classic Silver', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop' },
  { label: 'Lamborghini / Dark Aesthetic', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop' },
  { label: 'Vintage GT / Italian Racing', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1600&auto=format&fit=crop' },
];

export const SlideshowBlock: React.FC<SlideshowBlockProps> = ({
  activeRole = 'visitor',
  onNavigate,
  className = ''
}) => {
  const canManage = activeRole === 'super_admin' || activeRole === 'editor';

  // Store state for slides
  const [slides, setSlides] = useState<HomeSlide[]>(unifiedVehicleStore.getHomeSlides());
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modals state
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [slideFormData, setSlideFormData] = useState<Partial<HomeSlide>>({});
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = unifiedVehicleStore.subscribe(() => {
      setSlides(unifiedVehicleStore.getHomeSlides());
    });
    return unsubscribe;
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (slides.length === 0 || isManagerOpen || isEditModalOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isManagerOpen, isEditModalOpen]);

  // Handle current slide fallback
  const activeSlideIndex = currentSlide < slides.length ? currentSlide : 0;
  const activeSlide = slides[activeSlideIndex] || slides[0];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Open Slide Form for editing or creating
  const handleOpenEditor = (index: number | null) => {
    if (index !== null && slides[index]) {
      setEditingIndex(index);
      setSlideFormData({ ...slides[index] });
    } else {
      setEditingIndex(null);
      setSlideFormData({
        badge: 'Featured',
        title: 'New Automotive Highlight',
        subtitle: 'Enter description and details of the slide here.',
        ctaText: 'Explore Section',
        ctaPage: 'market',
        bgImage: PRESET_IMAGES[0].url,
        accentColor: PRESET_GRADIENTS[0].value
      });
    }
    setIsEditModalOpen(true);
  };

  // Handle local PC image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WebP, GIF).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSlideFormData(prev => ({ ...prev, bgImage: result }));
          showNotification('Image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Slide Form
  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideFormData.title || !slideFormData.bgImage) {
      alert('Please enter at least a title and a valid background URL.');
      return;
    }

    if (editingIndex !== null) {
      unifiedVehicleStore.updateHomeSlide(editingIndex, slideFormData);
      showNotification(`Slide ${editingIndex + 1} updated successfully!`);
    } else {
      unifiedVehicleStore.addHomeSlide(slideFormData as any);
      showNotification('New slide created and added to slideshow!');
    }

    setIsEditModalOpen(false);
  };

  // Delete Slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('Cannot delete the last remaining slide in the slideshow.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete Slide ${index + 1}?`)) {
      unifiedVehicleStore.deleteHomeSlide(index);
      if (currentSlide >= slides.length - 1) {
        setCurrentSlide(Math.max(0, slides.length - 2));
      }
      showNotification(`Slide ${index + 1} deleted.`);
    }
  };

  // Move Slide
  const handleMoveSlide = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= slides.length) return;
    unifiedVehicleStore.moveHomeSlide(fromIndex, toIndex);
    setCurrentSlide(toIndex);
  };

  if (!activeSlide) return null;

  return (
    <div className={`relative ${className}`}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* SLIDESHOW HERO BANNER */}
      <section className="relative rounded-2xl overflow-hidden border border-[#232a3d] bg-slate-950 min-h-[420px] flex items-end p-6 sm:p-8 lg:p-10 shadow-2xl transition-all group">
        
        {/* Background Image with Overlay Gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activeSlide.bgImage} 
            alt={activeSlide.title} 
            className="w-full h-full object-cover object-center filter brightness-[0.55] transition-all duration-1000 ease-in-out scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/70 to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-r ${activeSlide.accentColor || 'from-red-600/25 to-slate-950/70'}`} />
        </div>

        {/* ADMIN / EDITOR OVERLAY BAR (Top Right) */}
        {canManage && (
          <div className="absolute top-4 right-4 z-30 flex flex-wrap items-center gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 px-3 rounded-2xl border border-red-500/40 shadow-xl">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/30 uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>{activeRole.toUpperCase()} Management</span>
            </span>

            <button
              onClick={() => handleOpenEditor(activeSlideIndex)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Quick edit visible slide"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Slide</span>
            </button>

            <button
              onClick={() => setIsManagerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-red-600/20 uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Manage Slideshow</span>
            </button>
          </div>
        )}

        {/* Slide Content */}
        <div className="relative z-10 max-w-2xl space-y-4 animate-fadeIn">
          {activeSlide.badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeSlide.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {activeSlide.title}
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed drop-shadow">
            {activeSlide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            <button
              onClick={() => onNavigate(activeSlide.ctaPage || 'market')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-600/20 transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>{activeSlide.ctaText || 'Explore'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slideshow Controls & Indicators */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex space-x-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlideIndex === idx ? 'w-6 bg-red-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* MODAL 1: SLIDESHOW MANAGER (Admin & Editor) */}
      {isManagerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121522] border border-[#23293a] rounded-3xl w-full max-w-4xl p-6 space-y-6 shadow-2xl my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#202738] pb-4">
              <div>
                <div className="flex items-center space-x-2 text-red-400 mb-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Homepage & Market Slideshow Manager</span>
                </div>
                <h3 className="text-xl font-black text-white">Slideshow Editor Panel ({slides.length} Slides)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Administrators and Editors can edit, add, reorder, and remove slides in real-time.
                </p>
              </div>

              <button
                onClick={() => setIsManagerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Action Toolbar */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">
                Active slides in store: <strong className="text-red-400">{slides.length}</strong>
              </span>

              <button
                onClick={() => handleOpenEditor(null)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider shadow-lg shadow-red-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Slide</span>
              </button>
            </div>

            {/* Slide List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1 pr-2">
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id || idx}
                  className={`bg-[#171b28] border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                    activeSlideIndex === idx ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-[#262f44]'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top Info */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-red-400 font-bold">SLIDE #{idx + 1}</span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 truncate max-w-[120px]">
                        ID: {slide.id}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[#2a344a] bg-slate-900">
                      <img 
                        src={slide.bgImage} 
                        alt="" 
                        className="w-full h-full object-cover filter brightness-[0.7]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                        <span className="text-[9px] text-red-300 font-bold uppercase tracking-wider">{slide.badge}</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{slide.title}</h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-[#22293b] flex items-center justify-between gap-1">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditor(idx)}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSlide(idx)}
                        disabled={slides.length <= 1}
                        className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-30 cursor-pointer transition-all"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#202738] flex justify-end">
              <button
                onClick={() => setIsManagerOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Manager
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: SINGLE SLIDE FORM EDITOR */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121522] border border-[#23293a] rounded-3xl w-full max-w-2xl p-6 space-y-5 shadow-2xl my-8 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-[#202738] pb-3">
              <div className="flex items-center space-x-2 text-red-400">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-lg font-extrabold text-white">
                  {editingIndex !== null ? `Edit Slide #${editingIndex + 1}` : 'Create New Slide'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              
              {/* Image Preview */}
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-[#2b354d] bg-slate-900">
                {slideFormData.bgImage ? (
                  <img src={slideFormData.bgImage} alt="" className="w-full h-full object-cover filter brightness-[0.7]" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <ImageIcon className="w-8 h-8" />
                    <span>No image selected</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] text-red-300 font-bold uppercase">{slideFormData.badge || 'BADGE PREVIEW'}</span>
                  <h4 className="text-sm font-extrabold text-white truncate">{slideFormData.title || 'Slide Title'}</h4>
                </div>
              </div>

              {/* Preset Image Selector & File Upload from PC */}
              <div className="space-y-3 p-3 rounded-2xl bg-[#171b28] border border-[#262f44]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222a3d] pb-2">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-red-400" />
                    <span>Upload Image from PC (Desktop/Laptop)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Accepts PNG, JPG, WEBP, GIF</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 file:cursor-pointer cursor-pointer border border-[#2b354d] rounded-xl bg-slate-900/60 p-1"
                  />
                </div>

                <div className="pt-1">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                    <span>Or Select an HD Preset Image:</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSlideFormData(prev => ({ ...prev, bgImage: img.url }))}
                        className={`p-1.5 rounded-xl border text-[10px] font-bold truncate text-left transition-all cursor-pointer ${
                          slideFormData.bgImage === img.url
                            ? 'border-red-500 bg-red-500/10 text-red-300'
                            : 'border-[#262f44] bg-slate-900/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge & Title Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Badge Label (Top)</label>
                  <input
                    type="text"
                    required
                    value={slideFormData.badge || ''}
                    onChange={e => setSlideFormData(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full bg-[#171b28] text-white p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 font-mono text-xs"
                    placeholder="e.g. Dynamic Registration"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Main Title</label>
                  <input
                    type="text"
                    required
                    value={slideFormData.title || ''}
                    onChange={e => setSlideFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#171b28] text-white p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs font-bold"
                    placeholder="e.g. Automotive Passion & Intelligence"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={slideFormData.subtitle || ''}
                  onChange={e => setSlideFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-[#171b28] text-slate-200 p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs leading-relaxed"
                  placeholder="Brief description of features or highlights..."
                />
              </div>

              {/* CTA Text & Destination Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">CTA Button Text</label>
                  <input
                    type="text"
                    required
                    value={slideFormData.ctaText || ''}
                    onChange={e => setSlideFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                    className="w-full bg-[#171b28] text-white p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs"
                    placeholder="e.g. Create Account"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Destination Page Section</label>
                  <select
                    value={slideFormData.ctaPage || 'market'}
                    onChange={e => setSlideFormData(prev => ({ ...prev, ctaPage: e.target.value }))}
                    className="w-full bg-[#171b28] text-red-300 font-bold p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs cursor-pointer"
                  >
                    <option value="market">Market & Database</option>
                    <option value="register">User Registration (Private or Dealer)</option>
                    <option value="graph">Historical Knowledge Graph</option>
                    <option value="catalog">Model Catalog</option>
                    <option value="dealer_marketplace">Dealer & Auction Marketplace</option>
                    <option value="ai_advisor">AI Advisor Consultant</option>
                  </select>
                </div>
              </div>

              {/* Background Image Custom URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Custom Image URL (HD Background)</label>
                <input
                  type="url"
                  required
                  value={slideFormData.bgImage || ''}
                  onChange={e => setSlideFormData(prev => ({ ...prev, bgImage: e.target.value }))}
                  className="w-full bg-[#171b28] text-slate-300 p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs font-mono"
                  placeholder="https://..."
                />
              </div>

              {/* Accent Color Gradient */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Overlay Gradient Shade</label>
                <select
                  value={slideFormData.accentColor || PRESET_GRADIENTS[0].value}
                  onChange={e => setSlideFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-full bg-[#171b28] text-slate-200 p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs cursor-pointer"
                >
                  {PRESET_GRADIENTS.map((g, idx) => (
                    <option key={idx} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-[#202738] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingIndex !== null ? 'Save Changes' : 'Create Slide'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
