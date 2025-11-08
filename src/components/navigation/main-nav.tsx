import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

export function MainNav() {
  const location = useLocation();

  const navItems = [
    {
      href: '/',
      label: 'Ana Sayfa'
    },
    {
      href: '/trading/binance',
      label: 'Trading'
    },
    {
      href: '/wallet',
      label: 'Cüzdan'
    },
    {
      href: '/profile',
      label: 'Profilim'
    }
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            location.pathname === item.href
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}