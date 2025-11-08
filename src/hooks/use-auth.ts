import { useState, useEffect } from 'react';import { useState } from 'react';

import { z } from 'zod';import { z } from 'zod';

import { supabase } from '@/lib/supabase';import { supabase } from '@/lib/supabase';

import { INITIAL_ADMIN } from '@/lib/config/trading';import { INITIAL_ADMIN } from '@/lib/config/trading';

import { toast } from 'sonner';import { toast } from 'sonner';



// User types// Kullanıcı tipleri

export type UserRole = 'admin' | 'user';export type UserRole = 'admin' | 'user';



export interface UserProfile {export interface UserProfile {

  id: string;  id: string;

  email: string;  email: string;

  first_name: string;  first_name: string;

  last_name: string;  last_name: string;

  phone: string;  phone: string;

  country: string;  country: string;

  role: UserRole;  role: UserRole;

  is_verified: boolean;  is_verified: boolean;

  created_at: string;  created_at: string;

  coin_balance: number;  coin_balance: number;

  last_login: string;  last_login: string;

}}



// Form schemas// Form şemaları

const loginSchema = z.object({const loginSchema = z.object({

  email: z.string().email('Enter a valid email address'),  email: z.string().email('Geçerli bir e-posta adresi girin'),

  password: z.string().min(6, 'Password must be at least 6 characters'),  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),

  rememberMe: z.boolean().optional()  rememberMe: z.boolean().optional()

});});



const registrationSchema = z.object({const registrationSchema = z.object({

  email: z.string().email('Enter a valid email address'),  email: z.string().email('Geçerli bir e-posta adresi girin'),

  password: z  password: z

    .string()    .string()

    .min(8, 'Password must be at least 8 characters')    .min(8, 'Şifre en az 8 karakter olmalıdır')

    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')    .regex(/[A-Z]/, 'En az bir büyük harf olmalıdır')

    .regex(/[a-z]/, 'Must contain at least one lowercase letter')    .regex(/[a-z]/, 'En az bir küçük harf olmalıdır')

    .regex(/[0-9]/, 'Must contain at least one number')    .regex(/[0-9]/, 'En az bir rakam olmalıdır')

    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character'),    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'En az bir özel karakter olmalıdır'),

  confirmPassword: z.string(),  confirmPassword: z.string(),

  firstName: z.string().min(2, 'First name must be at least 2 characters'),  firstName: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),

  lastName: z.string().min(2, 'Last name must be at least 2 characters'),  lastName: z.string().min(2, 'Soyisim en az 2 karakter olmalıdır'),

  phone: z.string().min(10, 'Enter a valid phone number'),  phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),

  country: z.string().min(2, 'Select a country'),  country: z.string().min(2, 'Ülke seçin'),

  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),  acceptTerms: z.boolean().refine(val => val === true, 'Kullanım koşullarını kabul etmelisiniz'),

  walletAddress: z.string().min(30, 'Enter a valid wallet address').optional()  walletAddress: z.string().min(30, 'Geçerli bir cüzdan adresi girin').optional()

}).refine(data => data.password === data.confirmPassword, {}).refine(data => data.password === data.confirmPassword, {

  message: 'Passwords do not match',  message: 'Şifreler eşleşmiyor',

  path: ['confirmPassword']  path: ['confirmPassword']

});});



export type LoginForm = z.infer<typeof loginSchema>;export const useAuth = () => {

export type RegistrationForm = z.infer<typeof registrationSchema>;  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

export const useAuth = () => {  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);  useEffect(() => {

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);    // Mevcut oturum durumunu kontrol et

    const checkSession = async () => {

  useEffect(() => {      try {

    // Check current session        const { data: { session }, error } = await supabase.auth.getSession();

    const checkSession = async () => {        

      try {        if (error) throw error;

        const { data: { session }, error } = await supabase.auth.getSession();

                if (session?.user) {

        if (error) throw error;          const { data: profile } = await supabase

            .from('profiles')

        if (session?.user) {            .select('*')

          const { data: profile } = await supabase            .eq('id', session.user.id)

            .from('profiles')            .single();

            .select('*')

            .eq('id', session.user.id)          if (profile) {

            .single();            setCurrentUser(profile as UserProfile);

          }

          if (profile) {        }

            setCurrentUser(profile as UserProfile);      } catch (err) {

          }        console.error('Oturum kontrolü hatası:', err);

        }      }

      } catch (err) {    };

        console.error('Session check error:', err);

      }    checkSession();

    };

    // Oturum değişikliklerini dinle

    checkSession();    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (session?.user) {

    // Listen for auth changes        const { data: profile } = await supabase

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {          .from('profiles')

      if (session?.user) {          .select('*')

        const { data: profile } = await supabase          .eq('id', session.user.id)

          .from('profiles')          .single();

          .select('*')

          .eq('id', session.user.id)        if (profile) {

          .single();          setCurrentUser(profile as UserProfile);

        }

        if (profile) {      } else {

          setCurrentUser(profile as UserProfile);        setCurrentUser(null);

        }      }

      } else {    });

        setCurrentUser(null);

      }    return () => {

    });      subscription.unsubscribe();

    };

    return () => {  }, []);

      subscription.unsubscribe();

    };  const login = async (formData: z.infer<typeof loginSchema>) => {

  }, []);    const { email, password, rememberMe } = formData;

    setLoading(true);

  const login = async (formData: LoginForm) => {    setError(null);

    const { email, password, rememberMe } = formData;

    setLoading(true);    try {

    setError(null);      // Demo admin girişi kontrolü

      if (email === INITIAL_ADMIN.email && password === INITIAL_ADMIN.password) {

    try {        // Supabase'de admin hesabı yoksa oluştur

      // Check for demo admin login        const { data: existingUser } = await supabase

      if (email === INITIAL_ADMIN.email && password === INITIAL_ADMIN.password) {          .from('profiles')

        // Create admin account if it doesn't exist          .select()

        const { data: existingUser } = await supabase          .eq('email', INITIAL_ADMIN.email)

          .from('profiles')          .single();

          .select()

          .eq('email', INITIAL_ADMIN.email)        if (!existingUser) {

          .single();          const { data: { user }, error: signUpError } = await supabase.auth.signUp({

            email: INITIAL_ADMIN.email,

        if (!existingUser) {            password: INITIAL_ADMIN.password

          const { data: { user }, error: signUpError } = await supabase.auth.signUp({          });

            email: INITIAL_ADMIN.email,

            password: INITIAL_ADMIN.password          if (signUpError) throw signUpError;

          });

          if (user) {

          if (signUpError) throw signUpError;            await supabase.from('profiles').insert([

              {

          if (user) {                id: user.id,

            await supabase.from('profiles').insert([                email: INITIAL_ADMIN.email,

              {                role: 'admin',

                id: user.id,                is_verified: true,

                email: INITIAL_ADMIN.email,                created_at: new Date().toISOString()

                role: 'admin',              }

                is_verified: true,            ]);

                created_at: new Date().toISOString()          }

              }        }

            ]);      }

          }

        }      // Normal giriş işlemi

      }      // Login işlemi

      const { data, error } = await supabase.auth.signInWithPassword({

      // Normal login        email,

      const { data, error } = await supabase.auth.signInWithPassword({        password,

        email,        options: {

        password,          // Oturum süresini ayarla

        options: {          expiresIn: rememberMe ? '30d' : '1d'

          expiresIn: rememberMe ? '30d' : '1d'        }

        }      });

      });

      // Son giriş tarihini güncelle

      if (error) throw error;      if (data?.user) {

        await supabase

      // Update last login          .from('profiles')

      if (data?.user) {          .update({ last_login: new Date().toISOString() })

        await supabase          .match({ id: data.user.id });

          .from('profiles')

          .update({ last_login: new Date().toISOString() })      if (error) throw error;

          .match({ id: data.user.id });

      // Profil bilgilerini getir

        // Get profile data      const { data: profile } = await supabase

        const { data: profile } = await supabase        .from('profiles')

          .from('profiles')        .select('*')

          .select('*')        .eq('id', data.user?.id)

          .eq('id', data.user.id)        .single();

          .single();

      if (profile?.is_verified) {

        if (profile?.is_verified) {        toast.success('Başarıyla giriş yapıldı!');

          toast.success('Successfully logged in!');        return { user: data.user, profile };

          setCurrentUser(profile as UserProfile);      } else {

          return { user: data.user, profile };        throw new Error('Hesabınız henüz onaylanmamış. Lütfen e-posta onayınızı tamamlayın.');

        } else {      }

          throw new Error('Account not verified. Please complete email verification.');    } catch (err) {

        }      const message = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu';

      }      setError(message);

      toast.error(message);

      return null;      return null;

    } catch (err) {    } finally {

      const message = err instanceof Error ? err.message : 'Login failed';      setLoading(false);

      setError(message);    }

      toast.error(message);  };

      return null;

    } finally {  const register = async (formData: z.infer<typeof registrationSchema>) => {

      setLoading(false);    setLoading(true);

    }    setError(null);

  };

    try {

  const register = async (formData: RegistrationForm) => {      // Form validasyonu

    setLoading(true);      await registrationSchema.parseAsync(formData);

    setError(null);

      // Kullanıcı kaydı

    try {      const { data: { user }, error: signUpError } = await supabase.auth.signUp({

      // Form validation        email: formData.email,

      await registrationSchema.parseAsync(formData);        password: formData.password

      });

      // Create user

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({      if (signUpError) throw signUpError;

        email: formData.email,

        password: formData.password      if (!user) throw new Error('Kullanıcı kaydı başarısız');

      });

      // Profil oluşturma

      if (signUpError) throw signUpError;      await supabase.from('profiles').insert([

        {

      if (!user) throw new Error('User registration failed');          id: user.id,

          email: formData.email,

      // Create profile          first_name: formData.firstName,

      await supabase.from('profiles').insert([          last_name: formData.lastName,

        {          phone: formData.phone,

          id: user.id,          country: formData.country,

          email: formData.email,          role: 'user',

          first_name: formData.firstName,          is_verified: false,

          last_name: formData.lastName,          coin_balance: 0,

          phone: formData.phone,          wallet_address: formData.walletAddress,

          country: formData.country,          created_at: new Date().toISOString(),

          role: 'user',          last_login: null

          is_verified: false,        }

          coin_balance: 0,      ]);

          wallet_address: formData.walletAddress,

          created_at: new Date().toISOString(),      toast.success('Kayıt başarılı! Lütfen e-posta adresinizi onaylayın.');

          last_login: null      return user;

        }    } catch (err) {

      ]);      const message = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu';

      setError(message);

      toast.success('Registration successful! Please verify your email.');      toast.error(message);

      return user;      return null;

    } catch (err) {    } finally {

      const message = err instanceof Error ? err.message : 'Registration failed';      setLoading(false);

      setError(message);    }

      toast.error(message);  };

      return null;

    } finally {  const logout = async () => {

      setLoading(false);    setLoading(true);

    }    try {

  };      const { error } = await supabase.auth.signOut();

      if (error) throw error;

  const logout = async () => {      toast.success('Başarıyla çıkış yapıldı');

    setLoading(true);    } catch (err) {

    try {      const message = err instanceof Error ? err.message : 'Çıkış yapılırken bir hata oluştu';

      const { error } = await supabase.auth.signOut();      setError(message);

      if (error) throw error;      toast.error(message);

      setCurrentUser(null);    } finally {

      toast.success('Successfully logged out');      setLoading(false);

    } catch (err) {    }

      const message = err instanceof Error ? err.message : 'Logout failed';  };

      setError(message);

      toast.error(message);  const resetPassword = async (email: string) => {

    } finally {    setLoading(true);

      setLoading(false);    try {

    }      const { error } = await supabase.auth.resetPasswordForEmail(email);

  };      if (error) throw error;

      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');

  const resetPassword = async (email: string) => {    } catch (err) {

    setLoading(true);      const message = err instanceof Error ? err.message : 'Şifre sıfırlama işlemi başarısız';

    try {      setError(message);

      const { error } = await supabase.auth.resetPasswordForEmail(email);      toast.error(message);

      if (error) throw error;    } finally {

      toast.success('Password reset link sent to your email');      setLoading(false);

    } catch (err) {    }

      const message = err instanceof Error ? err.message : 'Password reset failed';  };

      setError(message);

      toast.error(message);  return {

    } finally {    login,

      setLoading(false);    register,

    }    logout,

  };    resetPassword,

    loading,

  return {    error,

    login,    currentUser

    register,  };

    logout,};

    resetPassword,

    loading,export type { z };
    error,
    currentUser
  };
};

export type { z };