
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus } from 'lucide-react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { FormErrors } from './AuthFormValidation';

interface AuthTabsProps {
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
  onSignIn: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
  onClearErrors: () => void;
  onClearError: (field: string) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
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
  onSignIn,
  onSignUp,
  onClearErrors,
  onClearError,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Autentikasi</CardTitle>
        <CardDescription>
          Masuk ke akun Anda atau buat akun baru
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full" onValueChange={onClearErrors}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              <LogIn className="w-4 h-4 mr-2" />
              Masuk
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="w-4 h-4 mr-2" />
              Daftar
            </TabsTrigger>
          </TabsList>

          {errors.general && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <TabsContent value="signin">
            <SignInForm
              email={email}
              password={password}
              showPassword={showPassword}
              loading={loading}
              errors={errors}
              onEmailChange={onEmailChange}
              onPasswordChange={onPasswordChange}
              onTogglePassword={onTogglePassword}
              onSubmit={onSignIn}
              onClearError={onClearError}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm
              email={email}
              password={password}
              fullName={fullName}
              showPassword={showPassword}
              loading={loading}
              errors={errors}
              onEmailChange={onEmailChange}
              onPasswordChange={onPasswordChange}
              onFullNameChange={onFullNameChange}
              onTogglePassword={onTogglePassword}
              onSubmit={onSignUp}
              onClearError={onClearError}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
