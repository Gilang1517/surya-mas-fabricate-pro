
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { FormErrors } from './AuthFormValidation';

interface SignUpFormProps {
  email: string;
  password: string;
  fullName: string;
  showPassword: boolean;
  loading: boolean;
  errors: FormErrors;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onFullNameChange: (fullName: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearError: (field: string) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  password,
  fullName,
  showPassword,
  loading,
  errors,
  onEmailChange,
  onPasswordChange,
  onFullNameChange,
  onTogglePassword,
  onSubmit,
  onClearError,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="signup-name">Nama Lengkap</Label>
        <Input
          id="signup-name"
          type="text"
          value={fullName}
          onChange={(e) => {
            onFullNameChange(e.target.value);
            if (errors.fullName) onClearError('fullName');
          }}
          placeholder="Masukkan nama lengkap"
          disabled={loading}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (errors.email) onClearError('email');
          }}
          placeholder="nama@contoh.com"
          disabled={loading}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              onPasswordChange(e.target.value);
              if (errors.password) onClearError('password');
            }}
            placeholder="Masukkan password (minimal 6 karakter)"
            minLength={6}
            disabled={loading}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Daftar'}
      </Button>
    </form>
  );
};
