import React, { useState, useMemo } from 'react';
import { Plus, Lock, Shield, Key, Database } from 'lucide-react';
import { PasswordGenerator } from './components/PasswordGenerator';
import { PasswordEntry } from './components/PasswordEntry';
import { EntryForm } from './components/EntryForm';
import { SearchAndFilter } from './components/SearchAndFilter';
import { DataManagement } from './components/DataManagement';
import { usePasswordManager } from './hooks/usePasswordManager';
import { PasswordEntry as IPasswordEntry } from './types';

type ActiveTab = 'generator' | 'vault' | 'data';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IPasswordEntry | undefined>();
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { entries, loading, addEntry, updateEntry, deleteEntry, clearAllEntries, importEntries } = usePasswordManager();

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = entries.map(entry => entry.category);
    return [...new Set(cats)].sort();
  }, [entries]);

  // Filter entries based on search and category
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchTerm || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.website?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || entry.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [entries, searchTerm, selectedCategory]);

  const handleSaveEntry = (entryData: Omit<IPasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, entryData);
    } else {
      addEntry(entryData);
    }
  };

  const handleEditEntry = (entry: IPasswordEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(undefined);
    setGeneratedPassword('');
  };

  const handleUseGeneratedPassword = () => {
    setActiveTab('vault');
    handleAddNew();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">密码管理器</h1>
            </div>
            
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('generator')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'generator'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>生成器</span>
              </button>
              
              <button
                onClick={() => setActiveTab('vault')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'vault'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>密码库</span>
                {entries.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {entries.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('data')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'data'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>数据</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generator' && (
          <div className="max-w-2xl mx-auto">
            <PasswordGenerator 
              onPasswordGenerated={(password) => {
                setGeneratedPassword(password);
              }} 
            />
            
            {generatedPassword && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleUseGeneratedPassword}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>使用此密码创建新条目</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">我的密码库</h2>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>添加密码</span>
              </button>
            </div>

            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {entries.length === 0 ? '暂无密码' : '未找到匹配的密码'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {entries.length === 0 
                    ? '开始添加您的第一个密码条目'
                    : '尝试调整搜索条件或筛选选项'
                  }
                </p>
                {entries.length === 0 && (
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加第一个密码</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEntries.map(entry => (
                  <PasswordEntry
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEditEntry}
                    onDelete={deleteEntry}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'data' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">数据管理</h2>
            <DataManagement
              entries={entries}
              onImport={importEntries}
              onClearAll={clearAllEntries}
            />
          </div>
        )}
      </main>

      {/* Entry Form Modal */}
      {showForm && (
        <EntryForm
          entry={editingEntry}
          generatedPassword={generatedPassword}
          onSave={handleSaveEntry}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;