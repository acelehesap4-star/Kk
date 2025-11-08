import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        toast.success('Kayıt başarılı! Lütfen giriş yapın.');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(isLogin ? 'Giriş başarısız!' : 'Kayıt başarısız!');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Trading Platform
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Gelişmiş trading platformu ile piyasaları takip edin, 
              analizler yapın ve işlemlerinizi güvenle gerçekleştirin.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle>Hoş Geldiniz</CardTitle>
              <CardDescription>
                {isLogin
                  ? 'Hesabınıza giriş yapın'
                  : 'Yeni bir hesap oluşturun'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? 'login' : 'register'} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="login"
                    onClick={() => setIsLogin(true)}
                  >
                    Giriş
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    onClick={() => setIsLogin(false)}
                  >
                    Kayıt
                  </TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ad</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              firstName: e.target.value
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Soyad</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              lastName: e.target.value
                            }))
                          }
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}