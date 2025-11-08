import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentForm } from '@/components/ui/PaymentForm';
import UserProfile from '@/components/ui/UserProfile';
import { User, Wallet, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/auth');
    }
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (err) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  if (loading || !currentUser) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto p-6">
        {/* Üst Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Hoş geldiniz, {currentUser.first_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>

        {/* Ana İçerik */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/30 border border-white/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/20">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-white/20">
              <Wallet className="h-4 w-4 mr-2" />
              Yeni Ödeme
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfile user={currentUser} />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentForm user={currentUser} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12 text-gray-400">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ayarlar yakında eklenecek</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}