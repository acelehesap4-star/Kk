import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Kullanıcı bilgilerini al
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      await fetchUser();
      router.push('/dashboard');
    } catch (error) {
      throw new Error('Giriş başarısız');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        email,
        password
      });

      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      await fetchUser();
      router.push('/dashboard');
    } catch (error) {
      throw new Error('Kayıt başarısız');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}