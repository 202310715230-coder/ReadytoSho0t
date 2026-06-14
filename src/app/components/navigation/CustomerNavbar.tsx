"use client";

import { useState, useEffect } from 'react';
import { Menu, X, Camera, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "../ui/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export function CustomerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Membaca status login dan role pengguna secara dinamis setiap ada perpindahan rute
  useEffect(() => {
    const sessionString = localStorage.getItem('user_session');
    if (sessionString) {
      try {
        const userSession = JSON.parse(sessionString);
        setIsLoggedIn(true);
        // Mengambil role (toleransi huruf besar/kecil dari PHP)
        setUserRole((userSession.role || userSession.role_name || 'customer').toLowerCase());
      } catch (e) {
        console.error("Gagal membaca session", e);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location]);

  const handleHashNavigation = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Katalog', path: '/catalog', isHash: false },
    { name: 'Cara Sewa', path: '#cara-sewa', isHash: true },
    { name: 'Kontak', path: '#kontak', isHash: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background border-b-4 border-foreground shadow-[0_4px_0_0_rgba(61,35,35,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform shadow-[3px_3px_0_0_rgba(61,35,35,1)]">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground tracking-tighter uppercase italic ml-1">
              ReadyTo<span className="text-primary">Sh0t</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    {link.isHash ? (
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "cursor-pointer border-transparent bg-transparent hover:bg-secondary/20 font-bold uppercase text-xs"
                        )}
                        onClick={(e) => handleHashNavigation(e, link.path)}
                      >
                        <a href={link.path}>{link.name}</a>
                      </NavigationMenuLink>
                    ) : (
                      <Link to={link.path}>
                        <NavigationMenuLink
                          asChild
                          active={location.pathname === link.path}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "border-transparent bg-transparent font-bold uppercase text-xs",
                            location.pathname === link.path && "text-primary underline decoration-4 underline-offset-4"
                          )}
                        >
                          <span>{link.name}</span>
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* PERBAIKAN TOMBOL POJOK KANAN (DESKTOP) */}
            <Link 
              to={!isLoggedIn ? "/login" : userRole === 'admin' ? "/admin/dashboard" : "/profile"} 
              className="ml-4 flex items-center gap-2 px-5 py-2 bg-secondary border-2 border-foreground text-foreground font-black uppercase text-xs shadow-[3px_3px_0_0_rgba(61,35,35,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {!isLoggedIn ? (
                <>
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </>
              ) : userRole === 'admin' ? (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-card border-2 border-foreground p-2 text-foreground shadow-[2px_2px_0_0_rgba(61,35,35,1)]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-background border-b-4 border-foreground p-3 sm:p-6 shadow-2xl z-[90]"
            >
              <div className="flex flex-col space-y-3 sm:space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={link.isHash ? (e) => handleHashNavigation(e, link.path) : () => { navigate(link.path); setIsMenuOpen(false); }}
                    className="text-left text-lg sm:text-2xl font-black uppercase italic text-foreground border-b-2 border-foreground/10 pb-2 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                ))}

                {/* PERBAIKAN TOMBOL POJOK KANAN (MOBILE) */}
                <Link
                  to={!isLoggedIn ? "/login" : userRole === 'admin' ? "/admin/dashboard" : "/profile"}
                  className="flex items-center justify-center gap-3 w-full py-3 sm:py-4 bg-primary text-white font-black uppercase italic border-2 border-foreground shadow-[4px_4px_0_0_rgba(61,35,35,1)] text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {!isLoggedIn ? (
                    <>
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Login</span>
                    </>
                  ) : userRole === 'admin' ? (
                    <>
                      <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Dashboard Admin</span>
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Profile Saya</span>
                    </>
                  )}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}