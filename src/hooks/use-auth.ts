import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { INITIAL_ADMIN } from '@/lib/config/trading';
import { toast } from 'sonner';

// Kullanıcı tipleri
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  coin_balance: number;
  last_login: string;
}

// Form şemaları
const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  rememberMe: z.boolean().optional()
});

const registrationSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'En az bir büyük harf olmalıdır')
    .regex(/[a-z]/, 'En az bir küçük harf olmalıdır')
    .regex(/[0-9]/, 'En az bir rakam olmalıdır')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'En az bir özel karakter olmalıdır'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyisim en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  country: z.string().min(2, 'Ülke seçin'),
  acceptTerms: z.boolean().refine(val => val === true, 'Kullanım koşullarını kabul etmelisiniz'),
  walletAddress: z.string().min(30, 'Geçerli bir cüzdan adresi girin').optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword']
});

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Mevcut oturum durumunu kontrol et
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setCurrentUser(profile as UserProfile);
          }
        }
      } catch (err) {
        console.error('Oturum kontrolü hatası:', err);
      }
    };

    checkSession();

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser(profile as UserProfile);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (formData: z.infer<typeof loginSchema>) => {
    const { email, password, rememberMe } = formData;
    setLoading(true);
    setError(null);

    try {
      // Demo admin girişi kontrolü
      if (email === INITIAL_ADMIN.email && password === INITIAL_ADMIN.password) {
        // Supabase'de admin hesabı yoksa oluştur
        const { data: existingUser } = await supabase
          .from('profiles')
          .select()
          .eq('email', INITIAL_ADMIN.email)
          .single();

        if (!existingUser) {
          const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email: INITIAL_ADMIN.email,
            password: INITIAL_ADMIN.password
          });

          if (signUpError) throw signUpError;

          if (user) {
            await supabase.from('profiles').insert([
              {
                id: user.id,
                email: INITIAL_ADMIN.email,
                role: 'admin',
                is_verified: true,
                created_at: new Date().toISOString()
              }
            ]);
          }
        }
      }

      // Normal giriş işlemi
      // Login işlemi
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Oturum süresini ayarla
          expiresIn: rememberMe ? '30d' : '1d'
        }
      });

      // Son giriş tarihini güncelle
      if (data?.user) {
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .match({ id: data.user.id });

      if (error) throw error;

      // Profil bilgilerini getir
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profile?.is_verified) {
        toast.success('Başarıyla giriş yapıldı!');
        return { user: data.user, profile };
      } else {
        throw new Error('Hesabınız henüz onaylanmamış. Lütfen e-posta onayınızı tamamlayın.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: z.infer<typeof registrationSchema>) => {
    setLoading(true);
    setError(null);

    try {
      // Form validasyonu
      await registrationSchema.parseAsync(formData);

      // Kullanıcı kaydı
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (signUpError) throw signUpError;

      if (!user) throw new Error('Kullanıcı kaydı başarısız');

      // Profil oluşturma
      await supabase.from('profiles').insert([
        {
          id: user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          role: 'user',
          is_verified: false,
          coin_balance: 0,
          wallet_address: formData.walletAddress,
          created_at: new Date().toISOString(),
          last_login: null
        }
      ]);

      toast.success('Kayıt başarılı! Lütfen e-posta adresinizi onaylayın.');
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Başarıyla çıkış yapıldı');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Çıkış yapılırken bir hata oluştu';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Şifre sıfırlama işlemi başarısız';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    resetPassword,
    loading,
    error,
    currentUser
  };
};

export type { z };