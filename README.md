import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as IconLibrary from 'lucide-react';
import { ToastProvider, ToastViewport, Toaster, Button, Tabs, TabsList, TabsTrigger, TabsContent, useToast } from '@/components/ui';
import Logo from '@/components/Logo';
import Hero from '@/components/Hero';
import FeaturedPackages from '@/components/FeaturedPackages';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';

const scrollTo = id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function App() {
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = useMemo(() => [
    { name: 'الرئيسية', id: 'hero' },
    { name: 'الباقات الأكثر طلباً', id: 'featured-packages' },
    { name: 'خدماتنا', id: 'services' },
    { name: 'جميع الباقات', id: 'pricing' },
    { name: 'لماذا نحن', id: 'features' },
    { name: 'أرقامنا', id: 'stats' },
    { name: 'آراء العملاء', id: 'testimonials' },
    { name: 'من مدونتنا', id: 'blog' },
    { name: 'اتصل بنا', id: 'contact' }
  ], []);

  const handleLogin = useCallback(() => {
    toast({ title: '🚧 الميزة تحت التطوير.' });
  }, [toast]);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <ToastProvider>
      <div className="font-['Cairo'] bg-main text-white min-h-screen">
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 w-full z-50 glass-effect shadow"
          role="banner"
        >
          <div className="container mx-auto flex items-center justify-between p-4">
            <button onClick={() => scrollTo('hero')} className="focus:outline-none">
              <Logo className="h-10 w-10" />
            </button>
            <nav className="hidden md:flex space-x-6" aria-label="Main nav">
              {navItems.map(item => (
                <Button key={item.id} variant="link" onClick={() => scrollTo(item.id)}>
                  {item.name}
                </Button>
              ))}
            </nav>
            <div className="hidden md:flex space-x-4">
              <Button variant="ghost" onClick={handleLogin}>تسجيل الدخول</Button>
              <Button onClick={handleLogin} className="btn-primary">إنشاء حساب</Button>
            </div>
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setMenuOpen(open => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <IconLibrary.X size={24} /> : <IconLibrary.Menu size={24} />}
            </button>
          </div>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                ref={menuRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-gray-900"
                aria-label="Mobile nav"
              >
                <ul className="p-4 space-y-3">
                  {navItems.map(item => (
                    <li key={item.id}>
                      <Button
                        variant="link"
                        onClick={() => { scrollTo(item.id); setMenuOpen(false); }}
                        className="w-full text-right"
                      >
                        {item.name}
                      </Button>
                    </li>
                  ))}
                  <li className="pt-4 space-y-2">
                    <Button variant="ghost" fullWidth onClick={handleLogin}>تسجيل الدخول</Button>
                    <Button fullWidth onClick={handleLogin} className="btn-primary">إنشاء حساب</Button>
                  </li>
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>
        <main className="pt-20">
          <Hero />
          <FeaturedPackages />
          <Services />
          <Pricing />
          <Features />
          <Stats />
          <Testimonials />
          <Blog />
        </main>
        <Footer />
        <ToastViewport />
        <Toaster />
      </div>
    </ToastProvider>
  );
}
