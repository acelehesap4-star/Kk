import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, TrendingUp, Settings } from 'lucide-react';

interface NavbarProps {
  onAdminClick?: () => void;
  isAdmin?: boolean;
}

export const Navbar = memo(({ onAdminClick, isAdmin }: NavbarProps) => {
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
          ? 'bg-card/80 backdrop-blur-2xl border-b border-primary/30 shadow-xl shadow-primary/10'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-2xl shadow-primary/30 ring-2 ring-primary/30 backdrop-blur-xl transition-all duration-300 group-hover:ring-primary/60 group-hover:shadow-primary/50">
              <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-2xl font-black tracking-tighter text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                KK TRADING
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Trading Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && onAdminClick && (
              <Button
                onClick={onAdminClick}
                variant="outline"
                size="sm"
                className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            {isAdmin && onAdminClick && (
              <Button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
