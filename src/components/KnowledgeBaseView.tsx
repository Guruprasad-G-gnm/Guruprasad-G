import React, { useState, useMemo } from 'react';
import { useHelpdesk } from '../context/HelpdeskContext';
import { KnowledgeArticle, TicketCategory, Department } from '../types';
import {
  BookOpen,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  ShieldCheck,
  Tag,
  Building,
  Clock,
  User,
  X,
  FileText,
  Sparkles,
  Database,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { vectorStore, VectorProvider } from '../services/vector/vectorStore';
import { semanticSearch, SemanticSearchResult } from '../services/knowledge/semanticSearchService';

export const KnowledgeBaseView: React.FC = () => {
  const {
    knowledgeBase,
    addKBArticle,
    updateKBArticle,
    deleteKBArticle,
    currentUser,
  } = useHelpdesk();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSemanticMode, setIsSemanticMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(knowledgeBase[0]?.id || null);
  const [vectorProvider, setVectorProvider] = useState<VectorProvider>(vectorStore.getActiveProvider());

  // Sources Modal state
  const [viewingSourceArticle, setViewingSourceArticle] = useState<KnowledgeArticle | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'IT / Wi-Fi' as TicketCategory,
    department: 'IT Services' as Department,
    summary: '',
    content: '',
    sourceReference: 'University Academic Regulations Handbook (2025-2026), Section 1.0',
    author: currentUser.name,
    tags: 'policy, campus, procedure',
    contactDesk: 'Central Helpdesk Extension',
  });

  const categories = [
    'ALL',
    'IT / Wi-Fi',
    'Transport',
    'Hostel',
    'Fees & Finance',
    'Examination',
    'Security',
    'Library',
    'Scholarship',
    'Certificates',
    'Other',
  ];

  const collegeDepartments: Department[] = [
    'IT Services',
    'Finance & Accounts',
    'Transport Division',
    'Hostel Administration',
    'Examination Cell',
    'Campus Security',
    'Estate & Maintenance',
    'Student Services',
    'Central Library',
    'Academic Affairs',
  ];

  const semanticSampleQueries = [
    'I haven\'t received my hostel room allocation yet.',
    'Need temporary internet access for my laptop in CSE block',
    'Bus arriving 30 minutes late at gate 3 morning shift',
    'Fee payment deducted from bank but no receipt generated',
    'Admit card photo missing for midterms tomorrow',
    'Streetlight broken and sparking near girls hostel walkway',
  ];

  // Perform Semantic Search or Keyword Search
  const { filteredArticles, semanticResults } = useMemo(() => {
    if (!searchQuery.trim()) {
      const filtered = knowledgeBase.filter((doc) => {
        if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
        return true;
      });
      return { filteredArticles: filtered, semanticResults: [] as SemanticSearchResult[] };
    }

    if (isSemanticMode) {
      const sResults = semanticSearch.search(searchQuery, knowledgeBase, 8, 0.15);
      const filtered = sResults
        .filter((sr) => selectedCategory === 'ALL' || sr.article.category === selectedCategory)
        .map((sr) => sr.article);

      return { filteredArticles: filtered, semanticResults: sResults };
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = knowledgeBase.filter((doc) => {
        if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
        const match =
          doc.title.toLowerCase().includes(q) ||
          doc.summary.toLowerCase().includes(q) ||
          doc.content.toLowerCase().includes(q) ||
          doc.id.toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q));
        return match;
      });
      return { filteredArticles: filtered, semanticResults: [] as SemanticSearchResult[] };
    }
  }, [knowledgeBase, searchQuery, selectedCategory, isSemanticMode]);

  const activeArticle = knowledgeBase.find((d) => d.id === selectedArticleId) || filteredArticles[0];

  const handleProviderChange = (prov: VectorProvider) => {
    setVectorProvider(prov);
    vectorStore.setActiveProvider(prov);
  };

  const handleOpenAddModal = () => {
    setEditingArticleId(null);
    setFormData({
      title: '',
      category: 'IT / Wi-Fi',
      department: 'IT Services',
      summary: '',
      content: '',
      sourceReference: 'University Academic Regulations Handbook (2025-2026), Section 1.0',
      author: currentUser.name,
      tags: 'policy, campus, procedure',
      contactDesk: 'Central Helpdesk Extension',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: KnowledgeArticle) => {
    setEditingArticleId(article.id);
    setFormData({
      title: article.title,
      category: article.category,
      department: article.department,
      summary: article.summary,
      content: article.content,
      sourceReference: article.sourceReference,
      author: article.author,
      tags: article.tags.join(', '),
      contactDesk: article.contactDesk,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this verified knowledge document?')) {
      deleteKBArticle(id);
      if (selectedArticleId === id) {
        setSelectedArticleId(null);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);

    if (editingArticleId) {
      updateKBArticle(editingArticleId, {
        title: formData.title,
        category: formData.category,
        department: formData.department,
        summary: formData.summary,
        content: formData.content,
        sourceReference: formData.sourceReference,
        tags: tagsArray,
        contactDesk: formData.contactDesk,
      });
    } else {
      addKBArticle({
        title: formData.title,
        category: formData.category,
        department: formData.department,
        summary: formData.summary,
        content: formData.content,
        sourceReference: formData.sourceReference,
        author: formData.author,
        tags: tagsArray,
        contactDesk: formData.contactDesk,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>RAG Knowledge Base & Regulations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Knowledge Base & Semantic Search
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official procedures, department policies, and verified rules that ground our AI agents
            strictly with zero synthetic hallucinations.
          </p>
        </div>

        {/* Vector DB Architecture Selector & Add Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700">
            <Database className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-semibold text-slate-800">Vector Engine:</span>
            <select
              value={vectorProvider}
              onChange={(e) => handleProviderChange(e.target.value as VectorProvider)}
              className="bg-transparent font-mono text-[11px] font-bold text-sky-800 focus:outline-none cursor-pointer"
            >
              <option value="Local (Demo In-Memory)">Local (In-Memory)</option>
              <option value="Pinecone">Pinecone</option>
              <option value="Supabase Vector">Supabase Vector</option>
              <option value="Qdrant">Qdrant</option>
              <option value="Weaviate">Weaviate</option>
            </select>
          </div>

          {(currentUser.role === 'admin' || currentUser.role === 'officer') && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Verified Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Semantic Search Box and Mode Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isSemanticMode
                  ? 'Ask natural questions (e.g. "I haven\'t received my hostel room allocation yet")...'
                  : 'Search keyword regulations, procedures, tags...'
              }
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSemanticMode(!isSemanticMode)}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isSemanticMode
                  ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSemanticMode ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>{isSemanticMode ? 'Semantic Search Active' : 'Keyword Search'}</span>
            </button>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Natural Query Sample Chips for Semantic Search */}
        {isSemanticMode && (
          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Try Natural Semantic Queries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {semanticSampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(query)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-all ${
                    searchQuery === query
                      ? 'bg-sky-100 border-sky-400 text-sky-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Index List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span>Verified Knowledge Documents ({filteredArticles.length})</span>
            {isSemanticMode && searchQuery && (
              <span className="text-sky-700 font-mono font-bold lowercase">
                vector ranking active
              </span>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center text-xs text-amber-900 space-y-2">
              <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="font-bold text-amber-950">
                Relevant campus information was not found. Please contact the appropriate department.
              </p>
              <p className="text-[11px] text-amber-700">
                To prevent hallucinations, our AI agents do not invent policies or phone numbers when knowledge is absent.
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isSelected = activeArticle?.id === article.id;
              const semanticMatch = semanticResults.find((sr) => sr.article.id === article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-100 bg-sky-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-sky-800">
                      {article.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {semanticMatch && (
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {semanticMatch.similarityScore}% Match
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {article.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-1.5">
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                    <span className="font-medium text-slate-600">{article.department}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingSourceArticle(article);
                        }}
                        className="text-sky-700 hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <Info className="w-3 h-3" />
                        <span>View Sources</span>
                      </button>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Document Reader (7 cols) */}
        <div className="lg:col-span-7">
          {!activeArticle ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Select an article from the left to read verified procedures.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Document Header */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-extrabold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                      {activeArticle.id}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      {activeArticle.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Official University Directive</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingSourceArticle(activeArticle)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-sky-600" />
                      <span>View Sources</span>
                    </button>

                    {(currentUser.role === 'admin' || currentUser.role === 'officer') && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(activeArticle)}
                          className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Document"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(activeArticle.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {activeArticle.title}
                </h2>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">Summary:</span>
                  {activeArticle.summary}
                </div>
              </div>

              {/* Source Reference & Contact Desk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block mb-0.5">
                    Official Statutory Source:
                  </span>
                  <p className="text-slate-700 font-medium">{activeArticle.sourceReference}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block mb-0.5">
                    Responsible Contact Desk:
                  </span>
                  <p className="text-slate-700 font-mono">{activeArticle.contactDesk}</p>
                </div>
              </div>

              {/* Document Prose Content */}
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Mandated Guidelines & Standard Operating Procedures:
                </span>
                <div className="whitespace-pre-line p-4 bg-slate-50/40 rounded-xl border border-slate-100 font-sans">
                  {activeArticle.content}
                </div>
              </div>

              {/* Tags & Metadata Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {activeArticle.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div>
                  Authored by <span className="font-medium text-slate-600">{activeArticle.author}</span> · {activeArticle.department}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW SOURCES MODAL */}
      {viewingSourceArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Verified Campus Source Grounding</h3>
              </div>
              <button
                onClick={() => setViewingSourceArticle(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Document Name
                </span>
                <p className="font-bold text-slate-900">{viewingSourceArticle.title}</p>
                <span className="text-[10px] font-mono text-sky-700">{viewingSourceArticle.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Department
                  </span>
                  <p className="font-semibold text-slate-800">{viewingSourceArticle.department}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Last Updated Date
                  </span>
                  <p className="font-semibold text-slate-800">{viewingSourceArticle.lastUpdated}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Relevant Section
                </span>
                <p className="font-mono text-sky-900 bg-sky-50 p-2 rounded-lg border border-sky-200">
                  {viewingSourceArticle.sourceReference}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Responsible Official Desk
                </span>
                <p className="text-slate-700">{viewingSourceArticle.contactDesk}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Strict Anti-Hallucination Policy: All AI agent resolutions citationally link to this official entry. No unverified campus claims are rendered.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingSourceArticle(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingArticleId ? 'Edit Knowledge Base Document' : 'Add New Verified Campus Document'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Campus Wi-Fi & Eduroam Access Policy"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as TicketCategory })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {categories
                      .filter((c) => c !== 'ALL')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Responsible Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value as Department })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {collegeDepartments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Brief Summary (for AI agent search index) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Concise overview of what this policy covers..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Statutory Handbook Source Reference *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sourceReference}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceReference: e.target.value })
                  }
                  placeholder="e.g. University IT Network Regulations Handbook (2025-2026), Section 4.2"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Responsible Contact Desk / Helpdesk Ext. *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactDesk}
                  onChange={(e) => setFormData({ ...formData, contactDesk: e.target.value })}
                  placeholder="e.g. IT Helpdesk (Tech Tower 104) Ext. 4020"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mandated Guidelines & Standard Operating Procedures *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full step-by-step guidelines and directives..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs resize-y"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Search Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="wifi, eduroam, network, credentials, portal"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  {editingArticleId ? 'Save Changes' : 'Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
