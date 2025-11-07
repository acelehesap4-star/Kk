import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  TrendingUp, 
  Settings, 
  Bell, 
  User, 
  Wallet,
  BarChart3,
  Globe,
  Zap,
  Shield
} from 'lucide-react';

export const Navbar = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-3xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
          : 'bg-black/70 backdrop-blur-xl border-b border-cyan-500/10'
      }`}
    >
      <div className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 shadow-2xl shadow-cyan-500/30 ring-1 ring-cyan-500/40 backdrop-blur-xl transition-all duration-300 group-hover:ring-cyan-400/60 group-hover:shadow-cyan-400/40">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/0 to-cyan-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
                NEXUS TRADE
              </h1>
              <p className="text-[9px] font-semibold text-cyan-400/60 uppercase tracking-widest">
                Pro Trading Suite
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                <Globe className="h-4 w-4 mr-2" />
                Markets
              </Button>
              <Button variant="ghost" size="sm" className="text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" className="text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                <Wallet className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-cyan-500/20">
              <Button variant="ghost" size="sm" className="relative text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
              <Button variant="ghost" size="sm" className="text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-cyan-400" />
            ) : (
              <Menu className="h-5 w-5 text-cyan-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in border-t border-cyan-500/20">
            <Button variant="ghost" className="w-full justify-start text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10">
              <Globe className="h-4 w-4 mr-3" />
              Markets
            </Button>
            <Button variant="ghost" className="w-full justify-start text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10">
              <TrendingUp className="h-4 w-4 mr-3" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10">
              <Wallet className="h-4 w-4 mr-3" />
              Portfolio
            </Button>
            <div className="border-t border-cyan-500/20 pt-3">
              <Button variant="ghost" className="w-full justify-start text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10">
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10">
                <User className="h-4 w-4 mr-3" />
                Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
