import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { DataAssertion, UserRole } from '../types';
import { fetchAssertions } from '../services/api';
import { Locale, translations } from '../data/translations';

interface EditorialPageProps {
  locale: Locale;
  activeRole: UserRole;
  onNavigate: (page: string) => void;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({ locale, activeRole, onNavigate }) => {
  const t = translations[locale];
  const [assertions, setAssertions] = useState<DataAssertion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAssertions();
      setAssertions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAction = (id: string, status: 'verified' | 'disputed') => {
    setAssertions(prev => prev.map(a => a.id === id ? { ...a, verification_status: status } : a));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 mb-1">
            <FileCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Data Governance & Provenance Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{t.assertion_queue_title}</h1>
          <p className="text-xs text-slate-400">
            Editorial console for approving data assertions extracted from factory archives and auction records.
          </p>
        </div>
      </div>

      {/* Assertions Table */}
      <div className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-[#171b29] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#23293a]">
            <tr>
              <th className="p-3">ID & Entity</th>
              <th className="p-3">Attribute</th>
              <th className="p-3">Raw Value</th>
              <th className="p-3">Normalized Value</th>
              <th className="p-3">Certified Source</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Validation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2333]">
            {assertions.map((ast) => (
              <tr key={ast.id} className="hover:bg-[#181c2b] transition-colors">
                <td className="p-3 font-mono-numbers">
                  <span className="font-bold text-white">{ast.entity_id}</span>
                  <div className="text-[10px] text-slate-500">{ast.entity_type}</div>
                </td>
                <td className="p-3 font-semibold text-red-400">{ast.attribute_name}</td>
                <td className="p-3 text-slate-300 font-mono-numbers">{ast.raw_value}</td>
                <td className="p-3 text-white font-bold font-mono-numbers">{ast.normalized_value} {ast.unit || ''}</td>
                <td className="p-3 text-slate-400">{ast.source_name}</td>
                <td className="p-3 font-mono-numbers">
                  <span className="font-bold text-emerald-400">{ast.confidence_score}%</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ast.verification_status === 'verified'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {ast.verification_status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1">
                  <button
                    onClick={() => handleAction(ast.id, 'verified')}
                    className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Approve Assertion"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(ast.id, 'disputed')}
                    className="p-1.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Dispute Assertion"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
