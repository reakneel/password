import React, { useState } from 'react';
import { CreditCard as Edit2, Trash2, Copy, Check, Eye, EyeOff, Globe } from 'lucide-react';
import { PasswordEntry as IPasswordEntry } from '../types';
import { useClipboard } from '../hooks/useClipboard';
import { calculatePasswordStrength, getStrengthColor } from '../utils/passwordGenerator';

interface PasswordEntryProps {
  entry: IPasswordEntry;
  onEdit: (entry: IPasswordEntry) => void;
  onDelete: (id: string) => void;
}

export function PasswordEntry({ entry, onEdit, onDelete }: PasswordEntryProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { copyToClipboard, copied } = useClipboard();
  const strength = calculatePasswordStrength(entry.password);

  const handleCopyPassword = () => {
    copyToClipboard(entry.password);
  };

  const handleCopyUsername = () => {
    copyToClipboard(entry.username);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {entry.category}
            </span>
          </div>
          {entry.website && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
              <Globe className="w-4 h-4" />
              <a
                href={entry.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {entry.website}
              </a>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Username */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">用户名</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={entry.username}
            readOnly
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50"
          />
          <button
            onClick={handleCopyUsername}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="复制用户名"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-gray-500">密码</label>
          <span className={`text-xs font-medium capitalize ${getStrengthColor(strength)}`}>
            {strength === 'very-strong' ? '非常强' : 
             strength === 'strong' ? '强' :
             strength === 'good' ? '良好' :
             strength === 'fair' ? '一般' : '弱'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={entry.password}
            readOnly
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 font-mono"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title={showPassword ? '隐藏密码' : '显示密码'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopyPassword}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="复制密码"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Notes */}
      {entry.notes && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">备注</label>
          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">{entry.notes}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="text-xs text-gray-400 flex justify-between">
        <span>创建: {entry.createdAt.toLocaleDateString()}</span>
        <span>更新: {entry.updatedAt.toLocaleDateString()}</span>
      </div>
    </div>
  );
}