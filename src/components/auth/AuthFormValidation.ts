
export interface FormErrors {
  [key: string]: string;
}

export const validateAuthForm = (
  email: string, 
  password: string, 
  fullName?: string, 
  isSignUp = false
): FormErrors => {
  const errors: FormErrors = {};
  
  if (!email.trim()) {
    errors.email = 'Email harus diisi';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Format email tidak valid';
  }
  
  if (!password) {
    errors.password = 'Password harus diisi';
  } else if (password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
  }
  
  if (isSignUp && fullName !== undefined && !fullName.trim()) {
    errors.fullName = 'Nama lengkap harus diisi';
  }
  
  return errors;
};
