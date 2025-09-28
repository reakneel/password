import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { GeneratorOptions } from '../types';
import { generatePassword, calculatePasswordStrength, getStrengthColor, getStrengthBgColor } from '../utils/passwordGenerator';
import { useClipboard } from '../hooks/useClipboard';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

export function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false
  });

  const { copyToClipboard, copied } = useClipboard();
  const strength = password ? calculatePasswordStrength(password) : 'weak';

  useEffect(() => {
    generateNewPassword();
  }, [options]);

  const generateNewPassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    onPasswordGenerated?.(newPassword);
  };

  const handleOptionChange = (key: keyof GeneratorOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    copyToClipboard(password);
  };

  const strengthPercentage = {
    'weak': 20,
    'fair': 40,
    'good': 60,
    'strong': 80,
    'very-strong': 100
  }[strength];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">密码生成器</h2>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生成的密码
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            title="复制密码"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={generateNewPassword}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="重新生成"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600">密码强度</span>
            <span className={`text-xs font-medium capitalize ${getStrengthColor(strength)}`}>
              {strength === 'very-strong' ? '非常强' : 
               strength === 'strong' ? '强' :
               strength === 'good' ? '良好' :
               strength === 'fair' ? '一般' : '弱'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthBgColor(strength)}`}
              style={{ width: `${strengthPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Generator Options */}
      <div className="space-y-4">
        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            长度: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={options.length}
            onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">大写字母 (A-Z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">小写字母 (a-z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">数字 (0-9)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">符号 (!@#$...)</span>
          </label>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">排除相似字符 (0, O, 1, l, I, |)</span>
        </label>
      </div>
    </div>
  );
}