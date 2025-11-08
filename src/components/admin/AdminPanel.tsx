import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Coins, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  CreditCard,
  Wallet,
  Activity,
  Globe,
  Server,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { coldWalletSystem } from '@/lib/coldWalletSystem';

interface AdvancedAdminPanelProps {
  user: any;
}

const AdvancedAdminPanel: React.FC<AdvancedAdminPanelProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [tokenRequests, setTokenRequests] = useState<any[]>([]);
  const [tokenDistributions, setTokenDistributions] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [distributionAmount, setDistributionAmount] = useState(0);
  const [distributionReason, setDistributionReason] = useState('');
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [networkAddresses, setNetworkAddresses] = useState<any>({});
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTokens: 100_000_000_000_000, // 100 Trilyon
    circulatingSupply: 0,
    pendingRequests: 0,
    systemUptime: 0,
    serverLoad: 0,
    databaseSize: 0
  });

  // Load real data from Supabase
  const handleVerifyTransaction = async (transactionId: string, verified: boolean) => {
    try {
      await coldWalletSystem.verifyTransaction(
        transactionId,
        user.id,
        verified,
        verified ? 'İşlem onaylandı' : 'İşlem reddedildi'
      );
      
      // Listeyi güncelle
      loadData();
      
      toast.success(verified ? 'İşlem onaylandı' : 'İşlem reddedildi');
    } catch (err) {
      console.error('İşlem doğrulama hatası:', err);
      toast.error('İşlem doğrulanırken bir hata oluştu');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*');

        // Fetch cold wallet data
        const pendingTxs = await coldWalletSystem.getPendingTransactions();
        const networkAddrs = await coldWalletSystem.getNetworkAddresses();
          .from('profiles')
          .select('*');
        
        if (userError) throw userError;
        setUsers(userData || []);

        // Fetch token requests and distributions
        const [tokenReqResponse, tokenDistResponse] = await Promise.all([
          supabase
            .from('token_requests')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('coin_distribution_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        if (tokenReqResponse.error) throw tokenReqResponse.error;
        if (tokenDistResponse.error) throw tokenDistResponse.error;

        setTokenRequests(tokenReqResponse.data || []);
        setTokenDistributions(tokenDistResponse.data || []);

        // Calculate system stats
        const activeUsers = userData?.filter(u => u.last_active_at > new Date(Date.now() - 24*60*60*1000).toISOString()).length || 0;
        const totalCoins = systemStats.totalTokens;
        const circulatingSupply = tokenDistResponse.data?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

        const totalCoins = 100_000_000_000_000; // 100 Trilyon
        const circulatingSupply = tokenDistribution?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

        setSystemStats({
          totalUsers: userData?.length || 0,
          activeUsers,
          totalTokens: totalCoins,
          circulatingSupply,
          pendingRequests: tokenReqResponse.data?.filter(t => t.status === 'pending').length || 0,
          systemUptime: 99.9, // Could be fetched from a monitoring service
          serverLoad: Math.floor(Math.random() * 30) + 20, // Could be fetched from server metrics
          databaseSize: Math.floor(Math.random() * 5) + 1 // Could be fetched from DB stats
        });
      } catch (err) {
        console.error('Error loading admin data:', err);
        toast.error('Failed to load some admin data');
      }
    };

    loadData();
    
    // Set up real-time subscriptions
    const usersSubscription = supabase
      .channel('admin-panel-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'token_requests' }, loadData)
      .subscribe();

    return () => {
      usersSubscription.unsubscribe();
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleApproveToken = (requestId: number) => {
    setTokenRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' }
          : req
      )
    );
    toast.success('Token purchase approved!');
  };

  const handleRejectToken = (requestId: number) => {
    setTokenRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' }
          : req
      )
    );
    toast.success('Token purchase rejected!');
  };

  const handleDistributeCoins = async (userId: string, amount: number, reason: string) => {
    try {
      const { error } = await supabase.from('coin_distribution_history').insert([
        {
          user_id: userId,
          amount,
          transaction_type: 'credit',
          description: reason,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      // Update user's coin balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ coin_balance: supabase.raw('coin_balance + ?', [amount]) })
        .match({ id: userId });

      if (updateError) throw updateError;

      toast.success('Coin dağıtımı başarıyla gerçekleştirildi');
      
      // Refresh data
      loadData();
    } catch (err) {
      toast.error('Coin dağıtımı sırasında bir hata oluştu');
      console.error(err);
    }
  };

  const handleUserStatusChange = (userId: number, newStatus: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      )
    );
    toast.success(`User status updated to ${newStatus}!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'suspended': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'suspended': return XCircle;
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredRequests = tokenRequests.filter(req => {
    const matchesSearch = req.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400">Comprehensive system management and oversight</p>
        </div>
        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          <Shield className="h-4 w-4 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Toplam Üyeler', value: systemStats.totalUsers.toLocaleString(), change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
          { title: 'Aktif Üyeler', value: systemStats.activeUsers.toLocaleString(), change: '+8%', icon: UserCheck, color: 'from-green-500 to-emerald-500' },
          { title: 'Toplam Coin', value: totalCoins.toLocaleString(), icon: Coins, color: 'from-yellow-500 to-amber-500' },
          { title: 'Dağıtılan Coin', value: circulatingSupply.toLocaleString(), icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
          { title: 'Pending Requests', value: systemStats.pendingRequests.toString(), change: '+5', icon: Clock, color: 'from-orange-500 to-red-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-black/30 border-white/20 hover:bg-black/40 transition-all duration-200">
              <CardContent className="p-6">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center", stat.color)}>
                  {React.createElement(stat.icon, { className: "h-6 w-6 text-white" })}
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-green-400">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-black/30 border border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-white/20">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:bg-white/20">
            <Coins className="h-4 w-4 mr-2" />
            Token Requests
          </TabsTrigger>
          <TabsTrigger value="coins" className="data-[state=active]:bg-white/20">
            <Coins className="h-4 w-4 mr-2" />
            Coin Yönetimi
          </TabsTrigger>
          <TabsTrigger value="cold-wallet" className="data-[state=active]:bg-white/20">
            <Wallet className="h-4 w-4 mr-2" />
            Soğuk Cüzdan
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-white/20">
            <Server className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-green-400 font-semibold">{systemStats.systemUptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Server Load</span>
                  <span className="text-yellow-400 font-semibold">{systemStats.serverLoad}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Database Size</span>
                  <span className="text-blue-400 font-semibold">{systemStats.databaseSize} GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Connections</span>
                  <span className="text-purple-400 font-semibold">1,247</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New user registration', user: 'user@example.com', time: '2 min ago', type: 'user' },
                    { action: 'Token purchase approved', user: 'trader@example.com', time: '5 min ago', type: 'token' },
                    { action: 'Large trade executed', user: 'whale@example.com', time: '8 min ago', type: 'trade' },
                    { action: 'System backup completed', user: 'System', time: '15 min ago', type: 'system' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        activity.type === 'user' ? 'bg-blue-400' :
                        activity.type === 'token' ? 'bg-orange-400' :
                        activity.type === 'trade' ? 'bg-green-400' : 'bg-purple-400'
                      )} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.action}</p>
                        <p className="text-xs text-gray-400">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-black/30 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.map((user) => {
                  const StatusIcon = getStatusIcon(user.status);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.email}</p>
                          <p className="text-sm text-gray-400">
                            Joined {user.joinDate} • Last active {user.lastActive}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-white">${user.balance.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{user.tokens} OMNI99</p>
                        </div>
                        
                        <Badge className={cn("px-2 py-1", getStatusColor(user.status))}>
                          {React.createElement(StatusIcon, { className: "h-3 w-3 mr-1" })}
                          {user.status}
                        </Badge>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {user.status === 'active' ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Token Requests Tab */}
        <TabsContent value="tokens" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Token Purchase Requests</CardTitle>
              <p className="text-gray-400">Review and approve OMNI99 token purchases</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <Coins className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{request.email}</p>
                          <p className="text-sm text-gray-400">
                            {request.amount} tokens • ${request.total.toFixed(2)} • {request.date}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={cn("px-2 py-1", getStatusColor(request.status))}>
                          {React.createElement(StatusIcon, { className: "h-3 w-3 mr-1" })}
                          {request.status}
                        </Badge>
                        
                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveToken(request.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectToken(request.id)}
                              className="border-red-500 text-red-400 hover:bg-red-500/20"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coins Tab */}
        <TabsContent value="coins" className="space-y-6">
          {/* Coin Overview */}
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Coins className="h-5 w-5 mr-2 text-yellow-400" />
                Coin Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Toplam Arz</p>
                  <p className="text-2xl font-bold text-white">{systemStats.totalTokens.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Dağıtılan</p>
                  <p className="text-2xl font-bold text-white">{systemStats.circulatingSupply.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Kalan</p>
                  <p className="text-2xl font-bold text-white">{(systemStats.totalTokens - systemStats.circulatingSupply).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Dağıtım %</p>
                  <p className="text-2xl font-bold text-white">{((systemStats.circulatingSupply / systemStats.totalTokens) * 100).toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Distributions */}
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
                Son Dağıtımlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Coin Dağıtım Formu */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white mb-4 font-medium">Manuel Coin Dağıtımı</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Kullanıcı</label>
                    <select 
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
                      onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                      <option value="">Kullanıcı seçin</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Miktar</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
                      placeholder="Coin miktarı"
                      onChange={(e) => setDistributionAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Açıklama</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
                      placeholder="Dağıtım nedeni"
                      onChange={(e) => setDistributionReason(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      onClick={() => handleDistributeCoins(selectedUserId, distributionAmount, distributionReason)}
                      disabled={!selectedUserId || !distributionAmount || !distributionReason}
                      className="w-full"
                    >
                      Coin Dağıt
                    </Button>
                  </div>
                </div>
              </div>

              <h3 className="text-white mb-4 font-medium">Son Dağıtımlar</h3>
              <div className="space-y-4">
                {tokenDistributions?.map((dist, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Coins className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{dist.user_email}</p>
                        <p className="text-sm text-gray-400">
                          {dist.amount.toLocaleString()} coin • {new Date(dist.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={dist.transaction_type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {dist.transaction_type === 'credit' ? 'Dağıtım' : 'Geri Alım'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cold Wallet Tab */}
        <TabsContent value="cold-wallet" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-blue-400" />
                Bekleyen İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTransactions?.map((tx, index) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white">{tx.userEmail}</p>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {tx.network}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Miktar: {tx.amount} {tx.network}</p>
                          <p>Coin: {tx.coinAmount.toLocaleString()}</p>
                          <p className="font-mono text-xs">TX: {tx.txHash || 'Bekliyor'}</p>
                          <p className="font-mono text-xs">Adres: {tx.walletAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleVerifyTransaction(tx.id, true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Onayla
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleVerifyTransaction(tx.id, false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reddet
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingTransactions?.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Bekleyen işlem yok</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ağ Adresleri */}
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-400" />
                Ağ Adresleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(networkAddresses).map(([network, info]) => (
                  <div key={network} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {network}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Min: {info.minAmount} {network}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-white break-all">
                      {info.address}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Oran: 1 {network} = {info.coinRate.toLocaleString()} Coin
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">System Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-gray-400">
                  <Server className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>System monitoring dashboard</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-gray-400">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Database administration tools</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 mt-20">
                <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>System configuration panel</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAdminPanel;