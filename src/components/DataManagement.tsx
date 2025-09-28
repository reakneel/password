import React, { useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { PasswordEntry } from '../types';
import { exportData, importData } from '../utils/storage';

interface DataManagementProps {
  entries: PasswordEntry[];
  onImport: (entries: PasswordEntry[]) => void;
  onClearAll: () => void;
}

export function DataManagement({ entries, onImport, onClearAll }: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        const importedEntries = importData(data);
        if (confirm(`即将导入 ${importedEntries.length} 条记录。这将替换当前所有数据。确定继续？`)) {
          onImport(importedEntries);
          alert('导入成功！');
        }
      } catch (error) {
        alert('导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('确定要清除所有密码数据吗？此操作不可撤销！')) {
      onClearAll();
      alert('所有数据已清除');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
          <div>
            <h4 className="font-medium text-green-900">导出数据</h4>
            <p className="text-sm text-green-700">将所有密码数据导出为JSON文件进行备份</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={entries.length === 0}
          >
            <Download className="w-4 h-4" />
            <span>导出</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md">
          <div>
            <h4 className="font-medium text-blue-900">导入数据</h4>
            <p className="text-sm text-blue-700">从备份文件恢复密码数据</p>
          </div>
          <button
            onClick={handleImportClick}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>导入</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-red-50 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">清除所有数据</h4>
              <p className="text-sm text-red-700">永久删除所有存储的密码数据</p>
            </div>
          </div>
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            disabled={entries.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            <span>清除</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}