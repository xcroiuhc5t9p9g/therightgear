import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Activity, Users, Database, FileText, CheckCircle, RefreshCw, Key, FileCheck, 
  ExternalLink, Zap, AlertTriangle, Plus, Upload, Search, Edit3, Trash2, Eye, Check, X, 
  Download, Tag, ArrowRight, Star, Sliders, Image as ImageIcon, Globe, Sparkles, Layers, 
  CheckCircle2, Server, Lock, UserPlus, Shield, UserCheck, ShieldAlert, Settings, Mail,
  LayoutList, ArrowUp, ArrowDown, RotateCcw, Link2
} from 'lucide-react';
import { UserRole, VehicleVariant, HomeSlide } from '../types';
import { fetchHealth, extractVehicleDataFromWeb } from '../services/api';
import { Locale, translations } from '../data/translations';
import { unifiedVehicleStore } from '../services/unifiedVehicleStore';
import { userManagementStore, AppUser } from '../services/userManagementStore';
import { footerStore, FooterSection, FooterLink } from '../services/footerStore';

interface AdminPageProps {
  locale: Locale;
  activeRole: UserRole;
  setActiveRole?: (r: UserRole) => void;
  onNavigate: (page: string, slug?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ locale, activeRole, setActiveRole, onNavigate }) => {
  const t = translations[locale];
  const [health, setHealth] = useState<any>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  // Role Capabilities Logic
  const isAdmin = activeRole === 'super_admin';
  const isEditor = activeRole === 'editor' || activeRole === 'editor' || isAdmin;

  // Active Admin Console Sub-Navigation
  const [activeTab, setActiveTab] = useState<'database' | 'users' | 'slideshow' | 'footer' | 'system'>('database');

  // Footer Store State & Management
  const [footerSections, setFooterSections] = useState<FooterSection[]>(footerStore.getSections());
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [targetSectionIdForLink, setTargetSectionIdForLink] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkFormData, setLinkFormData] = useState<{
    label: string;
    pageKey: string;
    url: string;
    isExternal: boolean;
  }>({
    label: '',
    pageKey: 'market',
    url: '',
    isExternal: false
  });

  // Unified Store state
  const [vehicles, setVehicles] = useState<VehicleVariant[]>(unifiedVehicleStore.getAll());
  const [homeSlides, setHomeSlides] = useState<HomeSlide[]>(unifiedVehicleStore.getHomeSlides());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // User Management State
  const [managedUsers, setManagedUsers] = useState<AppUser[]>(userManagementStore.getAll());
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'editor' as UserRole,
    companyOrTitle: 'Redazione Contenuti'
  });

  // Modals state (Vehicle CRUD & Batch Import)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Partial<VehicleVariant> | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<'ai_web' | 'file_upload'>('ai_web');
  const [aiQuery, setAiQuery] = useState('Ferrari SF90 XX Stradale 2024\nPorsche 911 GT3 RS 2023\nAlfa Romeo 33 Stradale 2024');
  const [selectedProvider, setSelectedProvider] = useState<string>('gemini_google_search');
  const [isExtracting, setIsExtracting] = useState(false);
  const [groundingSources, setGroundingSources] = useState<{ title: string; uri: string }[]>([]);
  const [architectureNotice, setArchitectureNotice] = useState<string | null>(null);

  const [rawImportText, setRawImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);

  // Email Test Dispatch State
  const [testEmailRecipient, setTestEmailRecipient] = useState('riccardo.monaco@gmail.com');
  const [testEmailResult, setTestEmailResult] = useState<{ status: string; message: string } | null>(null);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/v1/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: testEmailRecipient })
      });
      const data = await res.json();
      setTestEmailResult({
        status: data.success ? 'success' : 'info',
        message: data.message || data.error || 'Risposta ricevuta dal server.'
      });
    } catch (err: any) {
      setTestEmailResult({
        status: 'error',
        message: err.message
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  useEffect(() => {
    async function loadHealth() {
      const data = await fetchHealth();
      setHealth(data);
    }
    loadHealth();

    // Subscriptions
    const unsubscribeVehicles = unifiedVehicleStore.subscribe(() => {
      setVehicles(unifiedVehicleStore.getAll());
      setHomeSlides(unifiedVehicleStore.getHomeSlides());
    });

    const unsubscribeUsers = userManagementStore.subscribe(() => {
      setManagedUsers(userManagementStore.getAll());
    });

    const unsubscribeFooter = footerStore.subscribe(() => {
      setFooterSections([...footerStore.getSections()]);
    });

    return () => {
      unsubscribeVehicles();
      unsubscribeUsers();
      unsubscribeFooter();
    };
  }, []);

  const showNotification = (msg: string) => {
    setActionStatus(msg);
    setTimeout(() => setActionStatus(null), 4000);
  };

  // Footer CRUD Handlers
  const handleCreateFooterSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    footerStore.addSection(newSectionTitle.trim());
    showNotification(`New footer section "${newSectionTitle}" added!`);
    setNewSectionTitle('');
    setIsAddSectionOpen(false);
  };

  const handleUpdateSectionTitleSave = (sectionId: string) => {
    if (!editingSectionTitle.trim()) return;
    footerStore.updateSectionTitle(sectionId, editingSectionTitle.trim());
    showNotification(`Footer section updated to "${editingSectionTitle}"!`);
    setEditingSectionId(null);
  };

  const handleDeleteFooterSection = (sectionId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete section "${title}" and all its links?`)) {
      footerStore.deleteSection(sectionId);
      showNotification(`Section "${title}" deleted.`);
    }
  };

  const handleOpenAddLinkModal = (sectionId: string) => {
    setTargetSectionIdForLink(sectionId);
    setEditingLinkId(null);
    setLinkFormData({
      label: 'New Page Link',
      pageKey: 'market',
      url: '',
      isExternal: false
    });
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLinkModal = (sectionId: string, link: FooterLink) => {
    setTargetSectionIdForLink(sectionId);
    setEditingLinkId(link.id);
    setLinkFormData({
      label: link.label,
      pageKey: link.pageKey || 'custom',
      url: link.url || '',
      isExternal: !!link.isExternal
    });
    setIsLinkModalOpen(true);
  };

  const handleSaveFooterLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSectionIdForLink || !linkFormData.label.trim()) {
      alert('Please provide a valid link label.');
      return;
    }

    if (editingLinkId) {
      footerStore.updateLink(targetSectionIdForLink, editingLinkId, {
        label: linkFormData.label,
        pageKey: linkFormData.pageKey !== 'custom' ? linkFormData.pageKey : undefined,
        url: linkFormData.pageKey === 'custom' ? linkFormData.url : undefined,
        isExternal: linkFormData.isExternal
      });
      showNotification(`Link "${linkFormData.label}" updated!`);
    } else {
      footerStore.addLink(targetSectionIdForLink, {
        label: linkFormData.label,
        pageKey: linkFormData.pageKey !== 'custom' ? linkFormData.pageKey : undefined,
        url: linkFormData.pageKey === 'custom' ? linkFormData.url : undefined,
        isExternal: linkFormData.isExternal
      });
      showNotification(`Link "${linkFormData.label}" added to footer!`);
    }

    setIsLinkModalOpen(false);
  };

  const handleDeleteFooterLink = (sectionId: string, linkId: string, label: string) => {
    footerStore.deleteLink(sectionId, linkId);
    showNotification(`Link "${label}" removed.`);
  };

  const handleResetFooterToDefaults = () => {
    if (window.confirm('Reset all footer links to original default structure?')) {
      footerStore.resetToDefault();
      showNotification('Footer links restored to defaults!');
    }
  };

  // Action: Toggle "In Primo Piano" for a vehicle
  const handleToggleInPrimoPiano = (id: string, name: string) => {
    const isNowFeatured = unifiedVehicleStore.toggleInPrimoPiano(id);
    showNotification(
      isNowFeatured
        ? `"${name}" impostato come "IN PRIMO PIANO" nella Homepage!`
        : `"${name}" rimosso da "IN PRIMO PIANO".`
    );
  };

  // Action: Save single slide update
  const handleUpdateSlide = (index: number, updatedField: Partial<HomeSlide>) => {
    unifiedVehicleStore.updateHomeSlide(index, updatedField);
    showNotification(`Slide ${index + 1} della Homepage aggiornata con successo!`);
  };

  // Filtered vehicles in Back-office database
  const filteredVehicles = vehicles.filter(v => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      v.manufacturer_name.toLowerCase().includes(q) ||
      v.model_name.toLowerCase().includes(q) ||
      v.variant_name.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'imported') return v.data_status === 'imported' || v.data_status === 'provisional';
    if (statusFilter === 'verified') return v.data_status === 'verified' || v.data_status === 'licensed';
    return true;
  });

  // Action: Publish vehicle to live Market
  const handlePublishVehicle = (id: string) => {
    const published = unifiedVehicleStore.publish(id);
    if (published) {
      showNotification(`Veicolo "${published.manufacturer_name} ${published.model_name}" pubblicato con successo nel Market!`);
    }
  };

  // Action: Delete vehicle (Admin only restriction)
  const handleDeleteVehicle = (id: string, name: string) => {
    if (!isAdmin) {
      alert('Azione Riservata: Solo gli Amministratori di Sistema hanno il permesso di eliminare definitivamente i record dalla Banca Dati.');
      return;
    }
    if (window.confirm(`Sei sicuro di voler eliminare definitivamente "${name}" dalla Banca Dati?`)) {
      unifiedVehicleStore.delete(id);
      showNotification(`Veicolo "${name}" eliminato dalla Banca Dati.`);
    }
  };

  // Action: Open Edit modal
  const handleOpenEdit = (v: VehicleVariant) => {
    setEditingVehicle({ ...v });
    setIsEditModalOpen(true);
  };

  // Action: Open New Vehicle modal
  const handleOpenNew = () => {
    setEditingVehicle({
      id: `v-${Date.now()}`,
      slug: `auto-${Date.now()}`,
      manufacturer_name: 'Ferrari',
      model_name: 'Nuovo Modello',
      variant_name: 'Specifica Standard',
      category: 'Supercar',
      model_year_from: 2024,
      data_status: 'imported',
      hero_image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
    });
    setIsEditModalOpen(true);
  };

  // Save edited or new vehicle
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || !editingVehicle.manufacturer_name || !editingVehicle.model_name) {
      alert('Inserire Produttore e Modello.');
      return;
    }

    if (editingVehicle.id && unifiedVehicleStore.getByIdOrSlug(editingVehicle.id)) {
      unifiedVehicleStore.update(editingVehicle.id, editingVehicle as VehicleVariant);
      showNotification(`Veicolo "${editingVehicle.manufacturer_name} ${editingVehicle.model_name}" aggiornato!`);
    } else {
      unifiedVehicleStore.add(editingVehicle as VehicleVariant);
      showNotification(`Nuovo veicolo "${editingVehicle.manufacturer_name} ${editingVehicle.model_name}" aggiunto alla Banca Dati!`);
    }

    setIsEditModalOpen(false);
    setEditingVehicle(null);
  };

  // Run AI / Multi-Source Web Extraction via Server API
  const handleRunAiExtraction = async () => {
    if (!aiQuery.trim()) {
      alert('Inserisci almeno un modello o query di ricerca auto.');
      return;
    }
    setIsExtracting(true);
    setImportError(null);
    setArchitectureNotice(null);
    setGroundingSources([]);

    const res = await extractVehicleDataFromWeb(aiQuery, selectedProvider);
    setIsExtracting(false);

    if (!res.success) {
      setImportError(res.error || 'Estrazione web fallita.');
      return;
    }

    if (res.architecture_notice) {
      setArchitectureNotice(res.architecture_notice);
    }

    if (res.groundingSources) {
      setGroundingSources(res.groundingSources);
    }

    if (res.records && res.records.length > 0) {
      setImportPreview(res.records);
      showNotification(`Estratti con successo ${res.records.length} record completi da fonti trasparenti e ufficiali!`);
    } else {
      setImportError('Nessun record identificato per la ricerca inserita.');
    }
  };

  // Parse CSV or JSON import
  const handleParseImport = () => {
    setImportError(null);
    try {
      if (importFormat === 'json') {
        const parsed = JSON.parse(rawImportText);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        setImportPreview(arr);
      } else {
        const lines = rawImportText.trim().split('\n');
        if (lines.length < 2) {
          throw new Error('CSV deve contenere una riga di intestazione ed almeno una riga dati.');
        }
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((h, idx) => {
            obj[h] = vals[idx] || '';
          });
          result.push({
            manufacturer_name: obj.manufacturer || obj.produttore || obj.brand || 'Auto Importata',
            model_name: obj.model || obj.modello || 'Modello',
            variant_name: obj.variant || obj.variante || 'Standard',
            category: obj.category || 'Supercar',
            model_year_from: Number(obj.year || obj.anno) || 2020,
            production_total: Number(obj.production || obj.unita) || 500,
            hero_image_url: obj.image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
            data_status: 'imported'
          });
        }
        setImportPreview(result);
      }
    } catch (e: any) {
      setImportError(`Errore Formato: ${e.message}`);
      setImportPreview([]);
    }
  };

  // Commit batch import
  const handleExecuteImport = () => {
    if (importPreview.length === 0) return;
    const res = unifiedVehicleStore.importBatch(importPreview);
    showNotification(`Importazione completata! ${res.importedCount} nuovi record aggiunti alla Banca Dati.`);
    setIsImportModalOpen(false);
    setRawImportText('');
    setImportPreview([]);
  };

  // Handle file uploads
  const handleDataFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setRawImportText(text);
          if (file.name.endsWith('.json')) {
            setImportFormat('json');
          } else if (file.name.endsWith('.csv')) {
            setImportFormat('csv');
          }
          showNotification(`File "${file.name}" caricato da PC. Clicca "Verifica & Anteprima Dati".`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleVehicleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Seleziona un file immagine valido (PNG, JPG, WebP, GIF).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && editingVehicle) {
          setEditingVehicle({ ...editingVehicle, hero_image_url: result });
          showNotification('Immagine veicolo caricata con successo!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleImport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const sample = [
        {
          manufacturer_name: 'Alfa Romeo',
          model_name: '33 Stradale',
          variant_name: '33 Stradale V6 Twin-Turbo 620 CV',
          category: 'Limited Series',
          model_year_from: 2024,
          production_total: 33,
          hero_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop',
          data_status: 'imported'
        },
        {
          manufacturer_name: 'Lancia',
          model_name: 'Delta S4',
          variant_name: 'Stradale Group B Homologation',
          category: 'Homologation Special',
          model_year_from: 1985,
          production_total: 200,
          hero_image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
          data_status: 'imported'
        }
      ];
      setRawImportText(JSON.stringify(sample, null, 2));
    } else {
      const csv = `manufacturer,model,variant,category,year,production\nMaserati,MC12,MC12 Stradale,Hypercar,2004,50\nFerrari,Monza SP2,Barchetta V12,Limited Series,2019,499`;
      setRawImportText(csv);
    }
  };

  // User Management Actions (Admin only)
  const handleUpdateUserRole = (userId: string, newRole: UserRole, name: string) => {
    if (!isAdmin) {
      alert('Modifica Riservata: Solo l\'Amministratore di Sistema può cambiare i ruoli degli utenti.');
      return;
    }
    userManagementStore.updateUserRole(userId, newRole);
    showNotification(`Ruolo dell'utente "${name}" aggiornato a "${newRole.toUpperCase()}".`);
  };

  const handleToggleUserPermission = (userId: string, perm: 'canPublish' | 'canDelete' | 'canImportMassive' | 'canManageUsers', name: string) => {
    if (!isAdmin) {
      alert('Modifica Riservata: Solo l\'Amministratore di Sistema può modificare i permessi specifici degli utenti.');
      return;
    }
    userManagementStore.toggleUserPermission(userId, perm);
    showNotification(`Permesso "${perm}" modificato per "${name}".`);
  };

  const handleToggleUserStatus = (userId: string, name: string) => {
    if (!isAdmin) {
      alert('Modifica Riservata: Solo l\'Amministratore di Sistema può attivare o sospendere gli utenti.');
      return;
    }
    const updated = userManagementStore.toggleUserStatus(userId);
    showNotification(`Stato di "${name}" cambiato a "${updated?.status.toUpperCase()}".`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newUser.fullName || !newUser.email) {
      alert('Inserire Nome Completo ed Email.');
      return;
    }
    userManagementStore.addUser({
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      companyOrTitle: newUser.companyOrTitle || 'Membro Staff',
      status: 'active',
      canPublish: newUser.role === 'super_admin' || newUser.role === 'editor',
      canDelete: newUser.role === 'super_admin',
      canImportMassive: newUser.role === 'super_admin' || newUser.role === 'editor',
      canManageUsers: newUser.role === 'super_admin'
    });
    showNotification(`Nuovo utente "${newUser.fullName}" aggiunto con ruolo ${newUser.role.toUpperCase()}!`);
    setIsAddUserModalOpen(false);
    setNewUser({ fullName: '', email: '', role: 'editor', companyOrTitle: 'Redazione Contenuti' });
  };

  // Filtered Users List
  const filteredUsers = managedUsers.filter(u => {
    const q = userSearch.toLowerCase();
    const matchesQ = u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.companyOrTitle && u.companyOrTitle.toLowerCase().includes(q));
    if (!matchesQ) return false;
    if (userRoleFilter === 'ALL') return true;
    return u.role === userRoleFilter;
  });

  // Access Control Guard for non-admin / non-editor users
  if (!isAdmin && !isEditor) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-[#121520] rounded-2xl border border-red-500/40 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center text-red-400 mx-auto">
          <Lock className="w-8 h-8 text-rose-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Restricted Administrator Access</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            The Administration Console and Database Management Operations (CRUD) are protected and restricted to authorized administrators.
          </p>
        </div>

        <div className="p-4 bg-[#171b28] rounded-xl border border-[#252d42] text-xs text-left space-y-2 max-w-md mx-auto">
          <div className="text-red-400 font-bold uppercase text-[10px] tracking-wider">Current Session</div>
          <div className="flex justify-between text-slate-300">
            <span>Active Role:</span>
            <span className="font-bold uppercase text-amber-400">{activeRole === 'visitor' ? 'Guest / Unregistered' : activeRole}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>CRUD Privileges:</span>
            <span className="font-bold text-rose-400">DISABLED (Protected)</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          

          <button
            onClick={() => onNavigate('register')}
            className="px-5 py-2.5 rounded-xl bg-[#1c2232] hover:bg-[#283248] text-slate-200 font-bold text-xs border border-[#2d3852] transition-all cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-sky-400" />
            <span>Sign In / Register</span>
          </button>

          <button
            onClick={() => onNavigate('market')}
            className="px-5 py-2.5 rounded-xl bg-[#171b28] hover:bg-[#20273a] text-slate-300 font-bold text-xs border border-[#252d42] transition-all cursor-pointer"
          >
            Return to Public Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Simulation Role Switcher Bar (Test Mode) */}
      <div className="bg-[#121520] p-4 rounded-2xl border border-[#283248] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isAdmin ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Active Session Role:</span>
              <span className={`text-xs font-black uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                isAdmin 
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300' 
                  : isEditor 
                  ? 'bg-purple-950/80 border-purple-500/50 text-purple-300' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {activeRole === 'super_admin' ? 'Administrator (Admin)' : activeRole === 'editor' ? 'Editor' : activeRole.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isAdmin 
                ? 'Full privileges enabled: user RBAC management, record deletion, API configuration, and live publishing.' 
                : 'Editorial privileges: edit vehicle sheets and import data. Deletion and role management disabled.'}
            </p>
          </div>
        </div>

        {/* Quick Role Toggle Switcher */}
        {setActiveRole && (
          <div className="flex items-center space-x-1.5 bg-[#171b28] p-1.5 rounded-xl border border-[#262f44]">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono">Test Role:</span>
            <button
              onClick={() => { setActiveRole('super_admin'); showNotification('Activated Role: ADMINISTRATOR (Admin)'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'super_admin' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => { setActiveRole('editor'); showNotification('Activated Role: EDITOR'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'editor' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => { setActiveRole('corporate_user'); showNotification('Activated Role: DEALER'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'corporate_user' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dealer
            </button>
          </div>
        )}
      </div>

      {/* Main Admin Console Header */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-400 mb-1">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Console Unificata di Amministrazione & Back-Office</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Pannello Controllo Gestione Sito</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestisci la banca dati veicoli, l'area utenti & permessi RBAC, lo slideshow e i connettori di sistema in un'unica navigazione coordinata.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenNew}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-all cursor-pointer shadow-lg shadow-red-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Veicolo</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1d2436] hover:bg-[#28324a] text-slate-100 border border-[#2e3a54] text-xs font-bold transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-red-400" />
            <span>Importa Massivo (AI / File)</span>
          </button>
        </div>
      </div>

      {/* System Status Feedback Notification */}
      {actionStatus && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionStatus}</span>
        </div>
      )}

      {/* Main Administration Navigation Menu / Tabs */}
      <div className="bg-[#121520] p-2 rounded-2xl border border-[#23293a] flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'database', label: `Database & Vehicles (${vehicles.length})`, icon: Database, badge: 'CRUD' },
          { id: 'users', label: `User & RBAC (${managedUsers.length})`, icon: Users, badge: isAdmin ? 'ADMIN AREA' : 'READ ONLY' },
          { id: 'slideshow', label: 'Homepage Slideshow', icon: Sliders, badge: 'MEDIA' },
          { id: 'footer', label: 'Footer Links & Navigation', icon: LayoutList, badge: 'CRUD' },
          { id: 'system', label: 'System & Logs', icon: Server, badge: 'CONFIG' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-extrabold'
                  : 'bg-[#161a26] text-slate-300 hover:bg-[#1f2638] border border-[#23293a]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isActive ? 'bg-black/30 text-white' : 'bg-[#22293b] text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BANCA DATI & VEICOLI (CRUD & IMPORT)               */}
      {/* ========================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          
          {/* Search and Filters */}
          <div className="bg-[#121520] p-4 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca record per produttore, modello o variante..."
                className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400">Stato Record:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#171b28] text-xs text-red-300 font-bold px-3 py-2 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="ALL">Tutti i Record ({vehicles.length})</option>
                <option value="imported">Importati / In Revisione</option>
                <option value="verified">Pubblicati nel Market</option>
              </select>
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161a26] text-slate-400 uppercase tracking-wider font-mono border-b border-[#232a3d]">
                    <th className="p-3.5 font-bold">Veicolo & Immagine</th>
                    <th className="p-3.5 font-bold">Categoria</th>
                    <th className="p-3.5 font-bold">Anno</th>
                    <th className="p-3.5 font-bold">In Primo Piano</th>
                    <th className="p-3.5 font-bold">Stato Banca Dati</th>
                    <th className="p-3.5 font-bold text-right">Azioni Gestione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2434]">
                  {filteredVehicles.map((v) => {
                    const isPublished = v.data_status === 'verified' || v.data_status === 'licensed';
                    return (
                      <tr key={v.id} className="hover:bg-[#171c2b] transition-colors">
                        
                        {/* Vehicle Info */}
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <img
                              src={v.hero_image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&auto=format&fit=crop'}
                              alt={v.model_name}
                              className="w-12 h-9 object-cover rounded-lg border border-[#283248] shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                <span>{v.manufacturer_name} {v.model_name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{v.variant_name}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#182030] text-slate-300 border border-[#28324a]">
                            {v.category || 'Supercar'}
                          </span>
                        </td>

                        {/* Year */}
                        <td className="p-3.5 font-mono text-slate-300">
                          {v.model_year_from || 2024}
                        </td>

                        {/* In Primo Piano Toggle */}
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleInPrimoPiano(v.id, `${v.manufacturer_name} ${v.model_name}`)}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              v.in_primo_piano
                                ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 hover:bg-amber-900/60'
                                : 'bg-[#181d2a] text-slate-400 border-[#263046] hover:text-white'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${v.in_primo_piano ? 'fill-amber-400 text-amber-400' : ''}`} />
                            <span>{v.in_primo_piano ? 'In Evidenza' : 'Includi'}</span>
                          </button>
                        </td>

                        {/* Data Status */}
                        <td className="p-3.5">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                            isPublished
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}>
                            {isPublished ? 'PUBBLICATO' : 'IN REVISIONE'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {/* View Detail Page */}
                            <button
                              onClick={() => onNavigate('detail', v.slug)}
                              title="Vedi Scheda Pubblica"
                              className="p-1.5 rounded-lg bg-[#181d2a] hover:bg-[#232a3d] text-slate-300 border border-[#28324a] cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(v)}
                              title="Modifica Record"
                              className="p-1.5 rounded-lg bg-[#181d2a] hover:bg-amber-950/60 text-amber-300 border border-[#28324a] hover:border-amber-500/40 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Publish Button */}
                            {!isPublished && (
                              <button
                                onClick={() => handlePublishVehicle(v.id)}
                                title="Pubblica nel Market"
                                className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Button (Enforced Admin Permission) */}
                            <button
                              onClick={() => handleDeleteVehicle(v.id, `${v.manufacturer_name} ${v.model_name}`)}
                              disabled={!isAdmin}
                              title={isAdmin ? "Elimina Definitivamente" : "Riservato agli Amministratori di Sistema"}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isAdmin
                                  ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-500/40 cursor-pointer'
                                  : 'bg-[#181d2a] text-slate-600 border-[#222838] opacity-50 cursor-not-allowed'
                              }`}
                            >
                              {isAdmin ? <Trash2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GESTIONE UTENTI & PERMESSI RBAC                     */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Header Banner for User Management Area */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-red-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Area Apposita Gestione Accessi & Ruoli Staff</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Gestione Utenti, Editor & Amministratori (RBAC)</h2>
              <p className="text-xs text-slate-400 mt-1">
                L'Amministratore può abilitare o revocare privilegi a Editor e Redattori, assegnare ruoli aziendali e configurare permessi granolari.
              </p>
            </div>

            {isAdmin ? (
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-all cursor-pointer shadow-lg shadow-red-600/20 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Aggiungi Utente / Editor</span>
              </button>
            ) : (
              <div className="p-2.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Modalità Lettura Redattore: La modifica ruoli è riservata agli Amministratori.</span>
              </div>
            )}
          </div>

          {/* Role Comparison Matrix Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121520] border border-rose-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-300 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Amministratore (Admin)</span>
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-bold">FULL ACCESS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Controllo totale della piattaforma: gestione ruoli e permessi utenti, cancellazione record, pubblicazione diretta e configurazione chiavi API.
              </p>
            </div>

            <div className="p-4 bg-[#121520] border border-purple-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-300 font-mono flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-purple-400" />
                  <span>Redattore (Editor)</span>
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-bold">CONTENT EDIT</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Gestione ed estrazione massiva schede tecniche auto, inserimento specifiche, modifica slideshow e revisione record provvisori.
              </p>
            </div>

            <div className="p-4 bg-[#121520] border border-emerald-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-300 font-mono flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Dealer / Corporate / User</span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">EXTERNAL</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Accesso alla vetrina concessionaria, consultazione intelligence di mercato, gestione annunci marketplace e garagisti privati.
              </p>
            </div>
          </div>

          {/* Interactive CRUD Operations & Roles Matrix */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232a3d] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-400" />
                  <span>Matrice di Navigazione Permessi CRUD Gestionali per Ruolo</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Panoramica chiara ed intuitiva delle azioni gestionali autorizzate per ogni tipologia di utente nel sistema.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                SISTEMA RBAC ATTIVO
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#171b28] text-slate-300 uppercase font-mono border-b border-[#262f44]">
                    <th className="p-3 font-bold">Azione / Operazione CRUD</th>
                    <th className="p-3 font-bold text-center text-rose-400">🔴 Admin</th>
                    <th className="p-3 font-bold text-center text-purple-400">🟣 Editor</th>
                    <th className="p-3 font-bold text-center text-amber-400">🟢 Dealer</th>
                    <th className="p-3 font-bold text-center text-sky-400">🔵 Utente Privato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2434] text-[11px]">
                  <tr className="hover:bg-[#171c2b]">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CREATE: Aggiunta Nuovi Veicoli / Schede</span>
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Diretto</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Bozza</td>
                    <td className="p-3 text-center text-slate-500">Solo Inserzioni Proprietarie</td>
                    <td className="p-3 text-center text-slate-500">✘ Non Autorizzato</td>
                  </tr>

                  <tr className="hover:bg-[#171c2b]">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>READ: Consultazione Banca Dati & Market</span>
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Completo</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Completo</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Completo</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Completo</td>
                  </tr>

                  <tr className="hover:bg-[#171c2b]">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>UPDATE: Modifica Specifiche Dati / Slideshow</span>
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Tutti i Record</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Schede e Slideshow</td>
                    <td className="p-3 text-center text-slate-500">Solo Proprio Inventario</td>
                    <td className="p-3 text-center text-slate-500">Solo Proprio Profilo</td>
                  </tr>

                  <tr className="hover:bg-[#171c2b]">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>DELETE: Eliminazione Definitiva Record</span>
                    </td>
                    <td className="p-3 text-center text-rose-400 font-bold">✓ Esclusivo Admin</td>
                    <td className="p-3 text-center text-slate-500">✘ Necessita Admin</td>
                    <td className="p-3 text-center text-slate-500">✘ Necessita Admin</td>
                    <td className="p-3 text-center text-slate-500">✘ Non Autorizzato</td>
                  </tr>

                  <tr className="hover:bg-[#171c2b]">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span>IMPORT: Batch Import AI (Gemini Web Scraper)</span>
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Illimitato</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ Abilitato</td>
                    <td className="p-3 text-center text-slate-500">✘ Non Autorizzato</td>
                    <td className="p-3 text-center text-slate-500">✘ Non Autorizzato</td>
                  </tr>

                  <tr className="hover:bg-[#171c2b]">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                      <span>MANAGE USERS: Gestione Account, Ruoli & Permessi</span>
                    </td>
                    <td className="p-3 text-center text-rose-400 font-bold">✓ Esclusivo Admin</td>
                    <td className="p-3 text-center text-slate-500">Solo Lettura Staff</td>
                    <td className="p-3 text-center text-slate-500">✘ Nessun Accesso</td>
                    <td className="p-3 text-center text-slate-500">✘ Nessun Accesso</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Users List Filters */}
          <div className="bg-[#121520] p-4 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cerca utente per nome, email o qualifica..."
                className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400">Filtra Ruolo:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-[#171b28] text-xs text-red-300 font-bold px-3 py-2 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="ALL">Tutti gli Utenti ({managedUsers.length})</option>
                <option value="admin">Amministratori (Admin)</option>
                <option value="editor">Redattori (Editor)</option>
                <option value="dealer">Concessionari (Dealer)</option>
                <option value="registered_user">Utenti Registrati</option>
              </select>
            </div>
          </div>

          {/* User Management Table */}
          <div className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161a26] text-slate-400 uppercase tracking-wider font-mono border-b border-[#232a3d]">
                    <th className="p-3.5 font-bold">Utente & Profilo</th>
                    <th className="p-3.5 font-bold">Ruolo Assegnato</th>
                    <th className="p-3.5 font-bold">Permessi Granulari (Abilitazioni)</th>
                    <th className="p-3.5 font-bold">Stato Account</th>
                    <th className="p-3.5 font-bold text-right">Gestione Amministratore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2434]">
                  {filteredUsers.map((usr) => {
                    const isUserAdmin = usr.role === 'super_admin';
                    const isUserEditor = usr.role === 'editor';
                    return (
                      <tr key={usr.id} className="hover:bg-[#171c2b] transition-colors">
                        
                        {/* Avatar & Name */}
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#182030] border border-[#28324a] flex items-center justify-center font-bold text-slate-200 shrink-0 overflow-hidden">
                              {usr.avatarUrl ? (
                                <img src={usr.avatarUrl} alt={usr.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <span>{usr.fullName.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{usr.fullName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{usr.email}</div>
                              {usr.companyOrTitle && (
                                <div className="text-[10px] text-red-300 font-medium">{usr.companyOrTitle}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Selector / Display */}
                        <td className="p-3.5">
                          {isAdmin ? (
                            <select
                              value={usr.role}
                              onChange={(e) => handleUpdateUserRole(usr.id, e.target.value as UserRole, usr.fullName)}
                              className="bg-[#181d2b] text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#283248] text-white focus:outline-none focus:border-red-500 cursor-pointer"
                            >
                              <option value="admin">🔴 Amministratore (Admin)</option>
                              <option value="editor">🟣 Redattore (Editor)</option>
                              <option value="dealer">🟢 Concessionario (Dealer)</option>
                              <option value="registered_user">🔵 Utente Registrato</option>
                              <option value="premium_user">⭐ Utente Subscribed</option>
                            </select>
                          ) : (
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded font-mono ${
                              isUserAdmin ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                              isUserEditor ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {usr.role.toUpperCase()}
                            </span>
                          )}
                        </td>

                        {/* Granular Permission Badges */}
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1.5">
                            
                            {/* Can Delete */}
                            <button
                              onClick={() => handleToggleUserPermission(usr.id, 'canDelete', usr.fullName)}
                              disabled={!isAdmin}
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                                usr.canDelete
                                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                                  : 'bg-[#181d2a] text-slate-500 border-[#22293b]'
                              }`}
                            >
                              <span>Eliminazione</span>
                              {usr.canDelete ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                            </button>

                            {/* Can Publish */}
                            <button
                              onClick={() => handleToggleUserPermission(usr.id, 'canPublish', usr.fullName)}
                              disabled={!isAdmin}
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                                usr.canPublish
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                  : 'bg-[#181d2a] text-slate-500 border-[#22293b]'
                              }`}
                            >
                              <span>Pubblicazione</span>
                              {usr.canPublish ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                            </button>

                            {/* Can Import */}
                            <button
                              onClick={() => handleToggleUserPermission(usr.id, 'canImportMassive', usr.fullName)}
                              disabled={!isAdmin}
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                                usr.canImportMassive
                                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                                  : 'bg-[#181d2a] text-slate-500 border-[#22293b]'
                              }`}
                            >
                              <span>Import AI</span>
                              {usr.canImportMassive ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                            </button>

                          </div>
                        </td>

                        {/* Account Status */}
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            usr.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          }`}>
                            {usr.status.toUpperCase()}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleToggleUserStatus(usr.id, usr.fullName)}
                              disabled={!isAdmin}
                              title={isAdmin ? "Attiva/Sospendi Utente" : "Riservato ad Amministratore"}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                isAdmin
                                  ? usr.status === 'active'
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900 cursor-pointer'
                                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900 cursor-pointer'
                                  : 'bg-[#181d2a] text-slate-600 border-[#222838] opacity-50 cursor-not-allowed'
                              }`}
                            >
                              {usr.status === 'active' ? 'Sospendi' : 'Riattiva'}
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CONTENUTI & SLIDESHOW HOMEPAGE                     */}
      {/* ========================================================= */}
      {activeTab === 'slideshow' && (
        <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-red-400 mb-1">
              <Sliders className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Gestione Editoriale Contenuti In Evidenza</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Slideshow Dinamico Homepage (3 Slides)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Modifica i testi, le immagini di sfondo ed i link di destinazione visualizzati nell'hero slideshow della pagina principale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {homeSlides.map((slide, idx) => (
              <div key={slide.id || idx} className="bg-[#171b28] border border-[#252e42] rounded-2xl p-4 flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#23293a] pb-2">
                    <span className="text-xs font-extrabold text-red-400 font-mono">SLIDE #{idx + 1}</span>
                    <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">LIVE</span>
                  </div>

                  {/* Preview Banner */}
                  <div className="relative h-28 rounded-xl overflow-hidden border border-[#283248]">
                    <img
                      src={slide.bgImage}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] text-red-300 font-bold uppercase">{slide.badge}</span>
                      <h4 className="text-xs font-extrabold text-white truncate">{slide.title}</h4>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Etichetta / Badge</label>
                      <input
                        type="text"
                        value={slide.badge}
                        onChange={(e) => {
                          const newSlides = [...homeSlides];
                          newSlides[idx] = { ...newSlides[idx], badge: e.target.value };
                          setHomeSlides(newSlides);
                        }}
                        className="w-full bg-[#121520] text-white p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Titolo Principale</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const newSlides = [...homeSlides];
                          newSlides[idx] = { ...newSlides[idx], title: e.target.value };
                          setHomeSlides(newSlides);
                        }}
                        className="w-full bg-[#121520] text-white p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Sottotitolo / Descrizione</label>
                      <textarea
                        rows={3}
                        value={slide.subtitle}
                        onChange={(e) => {
                          const newSlides = [...homeSlides];
                          newSlides[idx] = { ...newSlides[idx], subtitle: e.target.value };
                          setHomeSlides(newSlides);
                        }}
                        className="w-full bg-[#121520] text-slate-200 p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Testo Pulsante CTA</label>
                      <input
                        type="text"
                        value={slide.ctaText}
                        onChange={(e) => {
                          const newSlides = [...homeSlides];
                          newSlides[idx] = { ...newSlides[idx], ctaText: e.target.value };
                          setHomeSlides(newSlides);
                        }}
                        className="w-full bg-[#121520] text-white p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Sezione Sito di Destinazione</label>
                      <select
                        value={slide.ctaPage}
                        onChange={(e) => {
                          const newSlides = [...homeSlides];
                          newSlides[idx] = { ...newSlides[idx], ctaPage: e.target.value };
                          setHomeSlides(newSlides);
                        }}
                        className="w-full bg-[#121520] text-red-300 font-bold p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs cursor-pointer"
                      >
                        <option value="market">Market Section / Search</option>
                        <option value="register">User Registration / Roles</option>
                        <option value="graph">Car DNA & Historical Network</option>
                        <option value="catalog">Model Catalog</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">URL Immagine di Sfondo</label>
                      <input
                        type="text"
                        value={slide.bgImage}
                        onChange={(e) => {
                          const newSlides = [...homeSlides];
                          newSlides[idx] = { ...newSlides[idx], bgImage: e.target.value };
                          setHomeSlides(newSlides);
                        }}
                        className="w-full bg-[#121520] text-slate-300 p-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 text-xs font-mono truncate"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateSlide(idx, homeSlides[idx])}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Salva Slide #{idx + 1}</span>
                </button>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: FOOTER LINKS & NAVIGATION MANAGEMENT (CRUD)          */}
      {/* ========================================================= */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-red-400 mb-1">
                <LayoutList className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Footer Navigation & Links Management (CRUD)</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Footer Link Columns & Structure</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Add, edit, reorder, or delete footer sections and navigation links. Changes reflect live on the website footer with instant dynamic copyright updates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAddSectionOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-red-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Footer Column</span>
              </button>

              <button
                onClick={handleResetFooterToDefaults}
                className="px-4 py-2.5 rounded-xl bg-[#1d2436] hover:bg-[#28324a] text-slate-300 border border-[#2e3a54] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121520] border border-[#23293a] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase block">Footer Columns</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">{footerSections.length}</span>
              </div>
              <LayoutList className="w-8 h-8 text-red-500/80" />
            </div>

            <div className="p-4 bg-[#121520] border border-[#23293a] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase block">Total Active Links</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {footerSections.reduce((sum, sec) => sum + sec.links.length, 0)}
                </span>
              </div>
              <Link2 className="w-8 h-8 text-sky-500/80" />
            </div>

            <div className="p-4 bg-[#121520] border border-[#23293a] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase block">Copyright Owner</span>
                <span className="text-base font-bold text-amber-300 font-mono mt-1 block">© {new Date().getFullYear()} The Right Gear</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-500/80" />
            </div>
          </div>

          {/* Add New Section Inline Modal Card */}
          {isAddSectionOpen && (
            <form onSubmit={handleCreateFooterSection} className="p-5 bg-[#171c2b] border border-red-500/40 rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#293248] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-400" />
                  <span>Create New Footer Section / Column Header</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddSectionOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">Section Title / Column Name *</label>
                <input
                  type="text"
                  required
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g. Services, Community, Partner Programs..."
                  className="w-full bg-[#10131e] border border-[#283248] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddSectionOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#222a3d] text-slate-300 font-bold text-xs hover:bg-[#2b354d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Create Section
                </button>
              </div>
            </form>
          )}

          {/* Sections List */}
          <div className="space-y-6">
            {footerSections.map((section, secIdx) => (
              <div key={section.id} className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
                {/* Section Header with Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#23293a] pb-4">
                  {editingSectionId === section.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingSectionTitle}
                        onChange={(e) => setEditingSectionTitle(e.target.value)}
                        className="bg-[#181e2e] border border-red-500/60 rounded-xl px-3 py-1.5 text-white font-bold text-sm outline-none"
                      />
                      <button
                        onClick={() => handleUpdateSectionTitleSave(section.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSectionId(null)}
                        className="px-3 py-1.5 rounded-lg bg-[#222a3d] text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-[#1a2030] border border-[#2a344d] text-red-400 font-mono text-xs font-bold flex items-center justify-center">
                        {secIdx + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-white tracking-tight">{section.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-[#181d2c] px-2 py-0.5 rounded border border-[#242c42]">
                        {section.links.length} links
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => footerStore.moveSection(section.id, 'up')}
                      disabled={secIdx === 0}
                      className="p-1.5 rounded-lg bg-[#171b28] hover:bg-[#20273a] text-slate-300 disabled:opacity-30 border border-[#252d42] cursor-pointer"
                      title="Move Column Left / Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => footerStore.moveSection(section.id, 'down')}
                      disabled={secIdx === footerSections.length - 1}
                      className="p-1.5 rounded-lg bg-[#171b28] hover:bg-[#20273a] text-slate-300 disabled:opacity-30 border border-[#252d42] cursor-pointer"
                      title="Move Column Right / Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingSectionId(section.id);
                        setEditingSectionTitle(section.title);
                      }}
                      className="p-1.5 rounded-lg bg-[#171b28] hover:bg-[#20273a] text-sky-400 border border-[#252d42] cursor-pointer"
                      title="Edit Column Title"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFooterSection(section.id, section.title)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/30 cursor-pointer"
                      title="Delete Entire Column Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenAddLinkModal(section.id)}
                      className="ml-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                {/* Section Links Table / Card Grid */}
                {section.links.length === 0 ? (
                  <div className="py-6 text-center border-2 border-dashed border-[#23293a] rounded-xl text-xs text-slate-500">
                    No links in this column yet. Click "Add Link" above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.links.map((link, linkIdx) => (
                      <div
                        key={link.id}
                        className="p-3 bg-[#161a26] border border-[#232a3d] rounded-xl flex items-center justify-between gap-3 group hover:border-[#323d57] transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                            <span className="text-slate-200">{link.label}</span>
                            {link.isExternal && <ExternalLink className="w-3 h-3 text-sky-400 shrink-0" />}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                            {link.pageKey ? `Page: ${link.pageKey}` : link.url || 'Smooth Scroll'}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => footerStore.moveLink(section.id, link.id, 'up')}
                            disabled={linkIdx === 0}
                            className="p-1 rounded bg-[#1f2638] hover:bg-[#2a344c] text-slate-300 disabled:opacity-20 cursor-pointer text-[10px]"
                            title="Move Link Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => footerStore.moveLink(section.id, link.id, 'down')}
                            disabled={linkIdx === section.links.length - 1}
                            className="p-1 rounded bg-[#1f2638] hover:bg-[#2a344c] text-slate-300 disabled:opacity-20 cursor-pointer text-[10px]"
                            title="Move Link Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleOpenEditLinkModal(section.id, link)}
                            className="p-1 rounded bg-[#1f2638] hover:bg-[#2a344c] text-sky-400 cursor-pointer"
                            title="Edit Link"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteFooterLink(section.id, link.id, link.label)}
                            className="p-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-400 cursor-pointer"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Adding or Editing Footer Link */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121520] border border-[#2b354d] rounded-2xl max-w-md w-full p-6 space-y-5 text-slate-200 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-red-400" />
                <span>{editingLinkId ? 'Edit Footer Link' : 'Add New Footer Link'}</span>
              </h3>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFooterLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Link Display Text *</label>
                <input
                  type="text"
                  required
                  value={linkFormData.label}
                  onChange={(e) => setLinkFormData({ ...linkFormData, label: e.target.value })}
                  placeholder="e.g. Verified Catalog, Market Reports..."
                  className="w-full bg-[#181e2e] border border-[#2a344d] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Page / Destination *</label>
                <select
                  value={linkFormData.pageKey}
                  onChange={(e) => setLinkFormData({ ...linkFormData, pageKey: e.target.value })}
                  className="w-full bg-[#181e2e] border border-[#2a344d] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                >
                  <option value="market">Marketplace & Verified Catalog (market)</option>
                  <option value="listings">Dealer & Auction Listings (listings)</option>
                  <option value="graph">Knowledge Graph Inspector (graph)</option>
                  <option value="ai-advisor">AI Advisor Consultant (ai-advisor)</option>
                  <option value="compare">Vehicle Comparison Tool (compare)</option>
                  <option value="editorial">Editorial & Deep Dives (editorial)</option>
                  <option value="watchlist">My Saved Watchlist (watchlist)</option>
                  <option value="home">Homepage (home)</option>
                  <option value="admin">Admin Console (admin)</option>
                  <option value="register">Register / Sign In (register)</option>
                  <option value="profile">User Profile Settings (profile)</option>
                  <option value="custom">Custom External / Custom URL</option>
                </select>
              </div>

              {linkFormData.pageKey === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Custom URL / Path</label>
                  <input
                    type="text"
                    value={linkFormData.url}
                    onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                    placeholder="https://... or /custom-page"
                    className="w-full bg-[#181e2e] border border-[#2a344d] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chkExternal"
                  checked={linkFormData.isExternal}
                  onChange={(e) => setLinkFormData({ ...linkFormData, isExternal: e.target.checked })}
                  className="rounded bg-[#181e2e] border-[#2a344d] text-red-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="chkExternal" className="text-xs text-slate-300 font-bold cursor-pointer">
                  Mark as external link (shows external arrow icon)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#222a3d] text-slate-300 font-bold text-xs hover:bg-[#2b354d] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                >
                  {editingLinkId ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SISTEMA, CONFIGURAZIONE API & LOGS                 */}
      {/* ========================================================= */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          
          {/* Health & Engine Status */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#23293a] pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Stato Server, API & Health Check</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Diagnostica in tempo reale sui servizi backend Cloud Run ed Express.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold font-mono">
                {health ? 'STATUS 200 OK' : 'CONNESSIONE IN CORSO...'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#171b28] border border-[#262f44] rounded-xl">
                <span className="text-slate-400 block mb-1 font-bold">Uptime Backend Express</span>
                <span className="text-white font-mono text-sm font-bold">{health?.uptime ? `${Math.round(health.uptime)} seconds` : 'Active'}</span>
              </div>
              <div className="p-3 bg-[#171b28] border border-[#262f44] rounded-xl">
                <span className="text-slate-400 block mb-1 font-bold">Gemini AI API Integration</span>
                <span className="text-emerald-400 font-mono text-sm font-bold">Enabled (Google Grounding)</span>
              </div>
              <div className="p-3 bg-[#171b28] border border-[#262f44] rounded-xl">
                <span className="text-slate-400 block mb-1 font-bold">Commercial Provider Architecture</span>
                <span className="text-amber-300 font-mono text-sm font-bold">Ready for Commercial APIs (CarQuery / Vincario)</span>
              </div>
            </div>
          </div>

          {/* Email Service & Domain Activation Setup Card */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232a3d] pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <span>Servizio Email Transactional & Stato Dominio</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Invio automatizzato email di conferma registrazione e attivazione account per <span className="font-mono text-red-300 font-bold">therightgear.app</span> via Firebase Identity Platform.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>DOMINIO VERIFICATO</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              {/* Verified Domain Status Summary */}
              <div className="p-4 bg-[#171b28] border border-emerald-500/30 rounded-xl space-y-3">
                <div className="font-bold text-white text-xs flex items-center justify-between text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Infrastruttura DNS & Provider</span>
                  </span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-mono">STATUS: Verified</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed font-mono bg-[#0c0e17] p-3 rounded-lg border border-[#202738]">
                  <div className="flex justify-between"><span className="text-slate-500">Dominio:</span> <span className="text-white font-bold">therightgear.app</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">DNS Provider:</span> <span className="text-sky-400">Cloudflare</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Email Delivery:</span> <span className="text-amber-400">Ireland (eu-west-1)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">DKIM / SPF:</span> <span className="text-emerald-400">✓ Verificati</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Sender Ufficiale:</span> <span className="text-red-300">noreply@therightgear.app</span></div>
                </div>
              </div>

              {/* Live Test Email Trigger */}
              <div className="p-4 bg-[#171b28] border border-[#262f44] rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5 text-sky-300 mb-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>Test Inserimento & Collaudo Inviante</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Invia una email di prova per verificare il recapito in posta in arrivo dal mittente <strong className="text-slate-200 font-mono">noreply@therightgear.app</strong>.
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="la-tua-email@dominio.com"
                      className="flex-1 px-3 py-2 bg-[#0c0e17] border border-[#242b3f] rounded-lg text-white text-xs font-mono focus:border-sky-500 outline-none"
                    />
                    <button
                      onClick={handleSendTestEmail}
                      disabled={isSendingTestEmail}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSendingTestEmail ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                      <span>Invia Test</span>
                    </button>
                  </div>
                </div>

                {testEmailResult && (
                  <div className={`p-2.5 rounded-lg border text-[11px] font-mono mt-2 ${
                    testEmailResult.status === 'success' 
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                      : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  }`}>
                    {testEmailResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Google Cloud Multi-App Hosting Strategy (The Right Gear + Presidium) */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232a3d] pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  <span>Hosting Unificato Google Cloud Platform (The Right Gear + Presidium)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analisi architetturale per far girare entrambe le App/Siti su infrastruttura Google Cloud con costi minimi e massima scalabilità.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2.5 py-1 rounded-full">
                STIMA COSTI: ~0€ - 5€/MESE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#171b28] border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-300 font-mono">OPZIONE 1 (RACCOMANDATA)</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-bold">SERVERLESS</span>
                </div>
                <h3 className="font-bold text-white">Google Cloud Run</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Ogni app (The Right Gear e Presidium) viene impacchettata in un piccolo container Docker.
                </p>
                <div className="pt-2 text-[10px] text-emerald-300 font-mono space-y-1">
                  <div>✓ 2 Milioni di richieste/mese GRATIS</div>
                  <div>✓ Scala a ZERO quando non c'è traffico (0€ fisso)</div>
                  <div>✓ SSL automatico & Custom Domain via Cloudflare</div>
                </div>
              </div>

              <div className="p-4 bg-[#171b28] border border-sky-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sky-300 font-mono">OPZIONE 2</span>
                  <span className="text-[9px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded font-bold">STATIC + API</span>
                </div>
                <h3 className="font-bold text-white">Firebase Hosting + Cloud Run</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  I file statici React/Vite vengono distribuiti gratuitamente sulla CDN Edge globale di Firebase.
                </p>
                <div className="pt-2 text-[10px] text-sky-300 font-mono space-y-1">
                  <div>✓ CDN globale ultra-veloce gratuita</div>
                  <div>✓ Rewrite automatico verso Cloud Run per le API</div>
                  <div>✓ Gestione certificati SSL automatica</div>
                </div>
              </div>

              <div className="p-4 bg-[#171b28] border border-amber-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-300 font-mono">OPZIONE 3</span>
                  <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-bold">MONOLITE VPS</span>
                </div>
                <h3 className="font-bold text-white">Google Compute Engine (GCE)</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Un'unica VM e2-micro o e2-small con Docker e Nginx reverse proxy che instrada i due domini.
                </p>
                <div className="pt-2 text-[10px] text-amber-300 font-mono space-y-1">
                  <div>✓ e2-micro inclusa nel Free Tier GCP</div>
                  <div>✓ Costo fisso prevedibile (~$0-12/mese)</div>
                  <div>⚠ Richiede manutenzione sistemistica manuale</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Audit Logs */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Registro Operazioni & Audit Logs</span>
            </h2>
            <div className="space-y-2">
              {[
                { time: '2026-08-05 10:55:12', user: 'Admin Riccardo Monaco', action: 'CAMBIO_PERMESSO_USER', details: 'Abilitato diritto di importazione massiva AI per Elena Rinaldi (Editor).' },
                { time: '2026-08-05 10:12:00', user: 'Redattore Elena Rinaldi', action: 'BATCH_IMPORT_GEMINI', details: 'Estratti 3 nuovi record auto completi con fonti Google Grounding.' },
                { time: '2026-08-05 09:45:22', user: 'System Import', action: 'UPDATE_SPEC_ENGINE', details: 'Sincronizzati dati tecnici della Ferrari SF90 XX Stradale.' }
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-[#171b28] border border-[#252e42] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-red-300 flex items-center gap-2">
                      <span>{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">da {log.user}</span>
                    </div>
                    <div className="text-slate-300 mt-0.5">{log.details}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: EDIT / CREATE VEHICLE RECORD                      */}
      {/* ========================================================= */}
      {isEditModalOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121520] border border-[#283248] rounded-2xl p-6 w-full max-w-2xl space-y-4 my-8 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-[#22293a] pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-red-400" />
                <span>Gestisci Record Banca Dati</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#1a202c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Produttore (Manufacturer) *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.manufacturer_name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, manufacturer_name: e.target.value })}
                    className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Nome Modello *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.model_name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model_name: e.target.value })}
                    className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Variante / Edizione</label>
                <input
                  type="text"
                  value={editingVehicle.variant_name || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, variant_name: e.target.value })}
                  className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Categoria</label>
                  <select
                    value={editingVehicle.category || 'Supercar'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as any })}
                    className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Supercar">Supercar</option>
                    <option value="Hypercar">Hypercar</option>
                    <option value="Youngtimer">Youngtimer</option>
                    <option value="Historic Classic">Historic Classic</option>
                    <option value="Homologation Special">Homologation Special</option>
                    <option value="Limited Series">Limited Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Anno Inizio Produzione</label>
                  <input
                    type="number"
                    value={editingVehicle.model_year_from || 2020}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model_year_from: Number(e.target.value) })}
                    className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Produzione Totale (Unità)</label>
                  <input
                    type="number"
                    value={editingVehicle.production_total || 500}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, production_total: Number(e.target.value) })}
                    className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-[#181d2b] border border-[#283248] rounded-xl">
                <label className="block text-slate-300 font-bold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-red-400">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carica Immagine Veicolo da PC</span>
                  </span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVehicleImageUpload}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 file:cursor-pointer cursor-pointer border border-[#283248] rounded-lg bg-[#121520] p-1"
                />
                <div className="pt-1">
                  <label className="block text-slate-400 mb-1 font-bold text-[11px]">Oppure URL Immagine Esterna (Hero Image)</label>
                  <input
                    type="url"
                    value={editingVehicle.hero_image_url || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, hero_image_url: e.target.value })}
                    className="w-full bg-[#121520] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500 text-xs font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* In Primo Piano Checkbox */}
              <div className="p-3 bg-[#181d2b] border border-[#283248] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className={`w-4 h-4 ${editingVehicle.in_primo_piano ? 'text-red-400 fill-amber-400' : 'text-slate-400'}`} />
                  <div>
                    <span className="font-bold text-white text-xs block">Mostra in Primo Piano nella Homepage</span>
                    <span className="text-[10px] text-slate-400">Inserisce questa scheda vettura nell'elenco in evidenza sotto lo slideshow.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!editingVehicle.in_primo_piano}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, in_primo_piano: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[#22293a] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1b212f] text-slate-300 font-bold hover:bg-[#252d40]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold hover:bg-red-500 shadow-md"
                >
                  Salva Scheda Veicolo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: BATCH IMPORT & MULTI-SOURCE EXTRACTION          */}
      {/* ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121520] border border-[#283248] rounded-2xl p-6 w-full max-w-3xl space-y-4 my-8 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-[#22293a] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-400" />
                  <span>Importazione Massiva Dati Auto</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Estrazione automatica da fonti web e API con predisposizione per architetture enterprise.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#1a202c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center space-x-2 border-b border-[#23293a] pb-3">
              <button
                onClick={() => { setImportTab('ai_web'); setImportError(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  importTab === 'ai_web'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-[#181e2e] text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Ricerca Web & Gemini API (Fonti Live)</span>
              </button>

              <button
                onClick={() => { setImportTab('file_upload'); setImportError(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  importTab === 'file_upload'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-[#181e2e] text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>File Locale (CSV / JSON)</span>
              </button>
            </div>

            {/* TAB 1: AI / WEB EXTRACTION */}
            {importTab === 'ai_web' && (
              <div className="space-y-4">
                
                {/* Provider Architecture Selector */}
                <div className="p-3 bg-[#171c2b] border border-[#283248] rounded-xl space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <Server className="w-4 h-4" />
                      <span>Connettore Provider API / Fonte Dati</span>
                    </span>
                    <span className="text-[10px] bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-mono">
                      Architettura Pluggable
                    </span>
                  </label>

                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full bg-[#121520] border border-[#283248] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  >
                    <option value="gemini_google_search">🌐 Gemini 3.6 Flash + Google Grounding (Fonti Autorevoli Web Gratuite)</option>
                    <option value="free_automotive_datasets">📚 Catalog Open Datasets (Wikipedia / Public Specs)</option>
                    <option value="paid_carquery_api">🔌 CarQuery Enterprise API (Integrazione Commerciale Pronta)</option>
                    <option value="paid_mobile_de_api">🔌 Mobile.de Market API (Integrazione Commerciale Pronta)</option>
                    <option value="paid_vincario_vin_api">🔌 Vincario VIN Decoder Registry (Integrazione Commerciale Pronta)</option>
                  </select>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Default attivo: ricerca e strutturazione automatica di schede complete tramite Gemini e fonti web pubbliche. Selezionando un provider commerciale, l'architettura è predisposta per accogliere le chiavi API di produzione negli ambienti aziendali.
                  </p>
                </div>

                {/* Input query list */}
                <div>
                  <label className="block text-slate-300 text-xs font-bold mb-1">
                    Elenco Veicoli da Importare (uno per riga o descrizioni libere):
                  </label>
                  <textarea
                    rows={4}
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Es: Ferrari SF90 XX Stradale 2024&#10;Porsche 911 GT3 RS 2023&#10;Alfa Romeo 33 Stradale 2024"
                    className="w-full bg-[#171c2b] border border-[#283248] rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunAiExtraction}
                    disabled={isExtracting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Ricerca & Estrazione in corso da Fonti Web...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Estrai & Genera Schede Veicoli</span>
                      </>
                    )}
                  </button>

                  {importPreview.length > 0 && (
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ✓ {importPreview.length} Schede Pronte
                    </span>
                  )}
                </div>

                {/* Architecture Notice Banner */}
                {architectureNotice && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Integrazione API Commerciale Ready</span>
                      <p className="text-[11px] text-amber-300/80 leading-snug">{architectureNotice}</p>
                    </div>
                  </div>
                )}

                {/* Grounding Citations */}
                {groundingSources.length > 0 && (
                  <div className="p-3 bg-[#171c2b] border border-[#283248] rounded-xl space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-red-400" />
                      <span>Fonti Web Autorevoli Verificate (Citations Grounding)</span>
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {groundingSources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-red-300 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded hover:bg-red-900/50 transition-colors flex items-center gap-1"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: FILE UPLOAD (CSV / JSON) */}
            {importTab === 'file_upload' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-400">Formato File:</span>
                    <button
                      onClick={() => setImportFormat('json')}
                      className={`px-3 py-1 rounded-lg font-bold ${importFormat === 'json' ? 'bg-red-600 text-white' : 'bg-[#1a202c] text-slate-300'}`}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => setImportFormat('csv')}
                      className={`px-3 py-1 rounded-lg font-bold ${importFormat === 'csv' ? 'bg-red-600 text-white' : 'bg-[#1a202c] text-slate-300'}`}
                    >
                      CSV
                    </button>
                  </div>

                  <button
                    onClick={() => loadSampleImport(importFormat)}
                    className="text-red-400 hover:underline font-bold"
                  >
                    Carica Esempio Demo ({importFormat.toUpperCase()})
                  </button>
                </div>

                <div className="p-3 bg-[#171c2b] border border-[#283248] rounded-xl space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <Upload className="w-4 h-4" />
                      <span>Seleziona File da PC (.json / .csv)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Lettura automatica del file locale</span>
                  </label>
                  <input
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={handleDataFileUpload}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 file:cursor-pointer cursor-pointer border border-[#283248] rounded-lg bg-[#121520] p-1"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">Oppure Incolla / Modifica Testo:</label>
                  <textarea
                    rows={5}
                    value={rawImportText}
                    onChange={(e) => setRawImportText(e.target.value)}
                    placeholder={importFormat === 'json' ? 'Incolla qui un array JSON di veicoli...' : 'Incolla qui i dati CSV con riga header (manufacturer,model,variant,category,year,production)...'}
                    className="w-full bg-[#171c2b] border border-[#283248] rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleParseImport}
                    className="px-4 py-2 rounded-xl bg-[#1d2538] hover:bg-[#27324c] text-red-300 border border-red-500/30 font-bold text-xs"
                  >
                    Verifica & Anteprima Dati File
                  </button>

                  {importPreview.length > 0 && (
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ✓ {importPreview.length} Record Pronti per l'importazione
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Error Message if any */}
            {importError && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                {importError}
              </div>
            )}

            {/* Preview Table */}
            {importPreview.length > 0 && (
              <div className="bg-[#171c2b] rounded-xl p-3 border border-[#283248] max-h-56 overflow-y-auto space-y-2">
                <div className="flex items-center justify-between border-b border-[#232a3a] pb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Anteprima Record Estratti ({importPreview.length})
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">Stato: Pronti per il salvataggio</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {importPreview.map((rec, idx) => (
                    <div key={idx} className="p-2.5 bg-[#121520] rounded-xl border border-[#222a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{rec.manufacturer_name} {rec.model_name}</span>
                          <span className="text-slate-400 text-xs font-normal">({rec.variant_name})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-3 mt-0.5">
                          <span>Anno: <strong className="text-slate-200">{rec.model_year_from || 2024}</strong></span>
                          {rec.power_hp && <span>Potenza: <strong className="text-amber-400">{rec.power_hp} CV</strong></span>}
                          {rec.production_total && <span>Unità: <strong className="text-slate-200">{rec.production_total}</strong></span>}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 font-mono self-start sm:self-center">
                        {rec.category || 'Supercar'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#22293a] flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1b212f] text-slate-300 font-bold hover:bg-[#252d40] text-xs"
              >
                Annulla
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={importPreview.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400 shadow-md text-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salva Tutti ({importPreview.length}) nella Banca Dati</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD NEW STAFF USER (ADMIN ONLY)                 */}
      {/* ========================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121520] border border-[#283248] rounded-2xl p-6 w-full max-w-md space-y-4 my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#22293a] pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-red-400" />
                <span>Aggiungi Nuovo Utente o Editor Staff</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#1a202c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Es. Mario Rossi"
                  className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Indirizzo Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="mario.rossi@automotive-intel.com"
                  className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ruolo Iniziale *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500 font-bold"
                >
                  <option value="editor">🟣 Redattore (Editor)</option>
                  <option value="admin">🔴 Amministratore (Admin)</option>
                  <option value="dealer">🟢 Concessionario (Dealer)</option>
                  <option value="registered_user">🔵 Utente Registrato Base</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Azienda / Ruolo Operativo</label>
                <input
                  type="text"
                  value={newUser.companyOrTitle}
                  onChange={(e) => setNewUser({ ...newUser, companyOrTitle: e.target.value })}
                  placeholder="Es. Redattore Senior o Scuderia Modena"
                  className="w-full bg-[#181d2b] border border-[#283248] rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 border-t border-[#22293a] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1b212f] text-slate-300 font-bold hover:bg-[#252d40]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold hover:bg-red-500 shadow-md"
                >
                  Crea Utente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
