import React, { useState, useEffect, createContext, useContext, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Users, Zap, Menu, X, Shield, Clock, Headphones as HeadphonesIcon, CreditCard, Facebook, MessageCircle, Quote, Mail, Phone, MapPin, ShoppingCart, Globe, CheckCircle, Gift } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import * as TabsPrimitive from "@radix-ui/react-tabs";

// Helper: cn (for merging Tailwind classes)
function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Helper: Smooth Scroll
const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// --- Custom Icon Components ---

const ImageIcon = ({ src, className, alt }) => (
    <img src={src} className={className} alt={alt} />
);

const IconLibrary = {
    Instagram: (props) => <ImageIcon src="https://i.ibb.co/d0tMTzr/icons8-instagram-logo-96.png" alt="Instagram Icon" {...props} />,
    TikTok: (props) => <ImageIcon src="https://i.ibb.co/wrpC9Yp/icons8-tiktok-logo-94.png" alt="TikTok Icon" {...props} />,
    Snapchat: (props) => <ImageIcon src="https://i.ibb.co/rRL5FWX/icons8-snapchat-48.png" alt="Snapchat Icon" {...props} />,
    Youtube: (props) => <ImageIcon src="https://i.ibb.co/67JZKpT/icons8-youtube-logo-94.png" alt="YouTube Icon" {...props} />,
    Twitter: (props) => <ImageIcon src="https://i.ibb.co/yVz6Qz4/icons8-x-logo-96.png" alt="X Icon" {...props} />,
    Whatsapp: (props) => <ImageIcon src="https://i.ibb.co/4jX3bJj/icons8-whatsapp-96.png" alt="Whatsapp Icon" {...props} />,
    Facebook: (props) => <ImageIcon src="https://i.ibb.co/VvW0y7d/icons8-facebook-logo-94.png" alt="Facebook Icon" {...props} />,
    MessageCircle: MessageCircle,
    Users: Users,
    Zap: Zap,
    Shield: Shield,
    Clock: Clock,
    Headphones: HeadphonesIcon,
    CreditCard: CreditCard,
    CheckCircle: CheckCircle,
    ShoppingCart: ShoppingCart,
    Star: Star,
    Globe: Globe,
    Quote: Quote,
    Mail: Mail,
    Phone: Phone,
    MapPin: MapPin,
    Gift: Gift,
    ArrowLeft: ArrowLeft,
    Menu: Menu,
    X: X,
};


// --- 3D Icon Wrapper ---
const Icon3D = ({ children, color }) => (
    <div className="icon-3d-wrapper" style={{ '--icon-color': color }}>
        {children}
    </div>
);


// --- UI Components (Toast, Button, Tabs) ---

// Toast Logic (use-toast.js)
const TOAST_LIMIT = 1;
let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}
const toastStore = {
  state: { toasts: [] },
  listeners: [],
  getState: () => toastStore.state,
  setState: (nextState) => {
    toastStore.state = typeof nextState === 'function' ? nextState(toastStore.state) : { ...toastStore.state, ...nextState };
    toastStore.listeners.forEach(listener => listener(toastStore.state));
  },
  subscribe: (listener) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter(l => l !== listener);
    };
  }
};
const toast = ({ ...props }) => {
  const id = generateId();
  const update = (props) => toastStore.setState((state) => ({ ...state, toasts: state.toasts.map((t) => t.id === id ? { ...t, ...props } : t) }));
  const dismiss = () => toastStore.setState((state) => ({ ...state, toasts: state.toasts.filter((t) => t.id !== id) }));
  toastStore.setState((state) => ({ ...state, toasts: [{ ...props, id, dismiss }, ...state.toasts].slice(0, TOAST_LIMIT) }));
  return { id, dismiss, update };
};
function useToast() {
  const [state, setState] = useState(toastStore.getState());
  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setState);
    return unsubscribe;
  }, []);
  useEffect(() => {
    const timeouts = state.toasts.map((t) => {
      if (t.duration === Infinity) return null;
      return setTimeout(() => t.dismiss(), t.duration || 5000);
    }).filter(Boolean);
    return () => timeouts.forEach(clearTimeout);
  }, [state.toasts]);
  return { toast, toasts: state.toasts };
}

// Toast Components (toast.jsx)
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport ref={ref} className={cn('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]', className)} {...props} />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva('data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full', {
	variants: { variant: { default: 'bg-background border', destructive: 'group destructive border-destructive bg-destructive text-destructive-foreground'}},
	defaultVariants: { variant: 'default' },
});
const Toast = forwardRef(({ className, variant, ...props }, ref) => (
	<ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
));
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastClose = forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close ref={ref} className={cn('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600', className)} toast-close="" {...props}>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Toaster Component (toaster.jsx)
function Toaster() {
	const { toasts } = useToast();
	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, ...props }) => {
                const { dismiss, ...rest } = props;
				return (
					<Toast key={id} {...rest}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}

// Button Component (button.jsx)
const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', {
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline',
		},
		size: { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' },
	},
	defaultVariants: { variant: 'default', size: 'default' },
});
const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? "div" : 'button';
	return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

// Tabs Components (tabs.jsx)
const Tabs = TabsPrimitive.Root;
const TabsList = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("inline-flex h-12 items-center justify-center rounded-lg bg-white/10 p-1 text-gray-300", className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#8851a5] data-[state=active]:text-white data-[state=active]:shadow-md", className)} {...props} />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// --- Page Components ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
      { name: 'الرئيسية', id: 'hero' }, 
      { name: 'الباقات الأكثر طلباً', id: 'featured-packages' }, 
      { name: 'جميع الباقات', id: 'pricing' }, 
      { name: 'خدماتنا', id: 'services' }, 
      { name: 'آراء العملاء', id: 'testimonials' }, 
      { name: 'اتصل بنا', id: 'contact' }
    ];

  const handleLogin = () => {
    toast({ title: "🚧 ميزة تسجيل الدخول قيد التطوير حالياً." });
  };
  
  const handleMobileNavClick = (id) => {
      handleScroll(id);
      setIsMenuOpen(false);
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 w-full z-50 glass-effect"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/c075c580cb355c5921e07d83b1d6d21e.png" alt="Boostly Logo" className="h-20" />
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <motion.button key={item.id} onClick={() => handleScroll(item.id)} className="text-white hover:text-[#e462a2] transition-colors duration-300 font-medium" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                {item.name}
              </motion.button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Button variant="ghost" onClick={handleLogin} className="text-white hover:bg-white/20">تسجيل الدخول</Button>
            <Button onClick={handleLogin} className="btn-primary">إنشاء حساب</Button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <IconLibrary.X className="h-6 w-6" /> : <IconLibrary.Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => handleMobileNavClick(item.id)} className="text-white hover:text-[#e462a2] transition-colors duration-300 text-right">
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" onClick={handleLogin} className="text-white hover:bg-white/20">تسجيل الدخول</Button>
                <Button onClick={handleLogin} className="btn-primary">إنشاء حساب</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="pt-48 pb-32 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <motion.h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <span className="gradient-text">Boostly</span>
              <br />
              <span className="text-white">الخدمة الأسرع والأكثر ثقة في الكويت</span>
            </motion.h1>
            <motion.p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
             عزز تواجدك الرقمي مع Boostly! نقدم متابعين ولايكات ومشاهدات من حسابات عربية حقيقية لجميع المنصات. خدماتنا مصممة خصيصاً لتكون الأفضل في السوق الكويتي.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <Button onClick={() => handleScroll('pricing')} className="btn-primary text-lg px-8 py-4">ابدأ الآن <IconLibrary.ArrowLeft className="mr-2 h-5 w-5" /></Button>
              <Button variant="outline" onClick={() => handleScroll('services')} className="btn-secondary text-lg px-8 py-4">شاهد الخدمات</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturedPackages = () => {
    const featuredPackages = [
        { platform: 'instagram', name: 'باقة الاكسبلور', price: '15 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/1a2c39aa7df057af2eaf8925dba091f2.png' },
        { platform: 'tiktok', name: 'باقة الاكسبلور', price: '10 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/073aed0e2c2ad9c3155817e8630ee041.png' }
    ];

    const handlePlanSelect = (platform, planName, price) => {
        const message = `أهلاً Boostly،\n\nأود طلب الباقة التالية:\n- المنصة: *${platform}*\n- الباقة: *${planName}*\n- السعر: *${price}*\n\nالرجاء تأكيد الطلب.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/96560930205?text=${encodedMessage}`, '_blank');
    };

    const handleFreeTrial = (platform, planName) => {
        const message = `أهلاً Boostly،\n\nأرغب في الحصول على تجربة مجانية للباقة التالية:\n- المنصة: *${platform}*\n- الباقة: *${planName}*\n\nشكرًا لكم.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/96560930205?text=${encodedMessage}`, '_blank');
    };

    return (
        <section id="featured-packages" className="py-20 px-4 bg-white/5">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6"><span className="gradient-text">الباقات الأكثر طلباً</span></h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">ابدأ فوراً مع باقاتنا الأكثر شعبية وفعالية في الكويت.</p>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {featuredPackages.map((plan, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="pricing-card-v2 group flex flex-col">
                            <div className="relative mb-4"><img src={plan.image} alt={plan.name} className="rounded-lg w-full h-auto transition-transform duration-300 group-hover:scale-105" /></div>
                            <div className="p-4 text-center flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name} ({plan.platform})</h3>
                                <p className="text-2xl font-bold gradient-text mb-4">{plan.price}</p>
                                <div className="mt-auto space-y-2">
                                    <Button onClick={() => handlePlanSelect(plan.platform, plan.name, plan.price)} className="w-full btn-primary flex items-center gap-2">
                                        <IconLibrary.Whatsapp className="h-5 w-5" />
                                        اطلب عبر واتساب
                                    </Button>
                                    <Button onClick={() => handleFreeTrial(plan.platform, plan.name)} variant="outline" className="w-full btn-secondary flex items-center gap-2">
                                        <IconLibrary.Gift size={16} /> اطلب تجربة مجانية
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const Services = () => {
    const services = [
        { icon: 'Instagram', name: 'Instagram', description: 'متابعين، لايكات، مشاهدات، تعليقات' },
        { icon: 'TikTok', name: 'TikTok', description: 'متابعين، لايكات، مشاهدات، مشاركات' },
        { icon: 'Snapchat', name: 'Snapchat', description: 'مشاهدات، متابعين، فلاتر، إعلانات' },
        { icon: 'Facebook', name: 'Facebook', description: 'صفحات، مجموعات، لايكات، مشاركات' },
        { icon: 'Youtube', name: 'YouTube', description: 'مشتركين، مشاهدات، لايكات، تعليقات' },
        { icon: 'Twitter', name: 'Twitter', description: 'متابعين، لايكات، ريتويت، تعليقات' },
    ];

    return (
        <section id="services" className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6"><span className="gradient-text">خدماتنا</span> المتميزة</h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">نقدم خدمات شاملة لجميع منصات التواصل الاجتماعي بجودة عالية وأسعار منافسة</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const IconComponent = IconLibrary[service.icon];
                        return (
                            <motion.div key={service.name} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} className="service-card group flex flex-col items-center text-center p-8 rounded-2xl">
                                <IconComponent className="h-16 w-16" />
                                <h3 className="text-2xl font-bold mt-4 mb-3 text-white">{service.name}</h3>
                                <p className="text-gray-300 mb-6 flex-grow">{service.description}</p>
                                <Button onClick={() => handleScroll('pricing')} className="w-full btn-primary mt-auto">اكتشف الباقات</Button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const Pricing = () => {
    const pricingData = {
        instagram: [
            { name: '10,000 متابع', price: '8 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/d7576c6886c0904bfe01650589647c1f.png' },
            { name: '1,000 مشاهدات لايف', price: '5 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/81d5d20bea04d26736a5b6a4f59a4ed1.png' }
        ],
        tiktok: [
            { name: 'باقة المشاهير', price: '12 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/d95e097b400a52c548b0ffe01b834270.png' },
            { name: '10,000 متابع', price: '7 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/927ace3ba71bb1834e38bdbb26e26d02.png' },
            { name: 'الباقة المليونية', price: '20 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/3ba90e2de808a0b0891601224815fc75.png' },
            { name: 'باقة الانتشار الاقوى', price: '10 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/f5e6ac39ac1a9e9fb15df08e2c2cbf72.png' },
            { name: '10,000 مشاهدات لايف', price: '10 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/f8cf58275066420ac851be45ed2c4ae5.png' }
        ],
        snapchat: [
            { name: '1,000 متابع', price: '25 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/2a68258ab968489ac1991f10aea39919.png' },
            { name: '1,000 مشاهدات ستوري', price: '7 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/f92c6aaeab45ac4db76a9fb5b9abd578.png' }
        ],
        youtube: [
            { name: '1,000 مشترك', price: '12 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/616a461c2284c9c6a48ecc11c2e9edc0.png' }
        ],
        x: [{ name: '10,000 لايك', price: '6 د.ك', image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/f7fe0f047b4fab806ab62708b9902281.png' }]
    };
    const platformIcons = { instagram: IconLibrary.Instagram, tiktok: IconLibrary.TikTok, snapchat: IconLibrary.Snapchat, youtube: IconLibrary.Youtube, x: IconLibrary.Twitter };
    
    const handlePlanSelect = (platform, planName, price) => {
        const message = `أهلاً Boostly،\n\nأود طلب الباقة التالية:\n- المنصة: *${platform}*\n- الباقة: *${planName}*\n- السعر: *${price}*\n\nالرجاء تأكيد الطلب.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/96560930205?text=${encodedMessage}`, '_blank');
    };

    const handleFreeTrial = (platform, planName) => {
        const message = `أهلاً Boostly،\n\nأرغب في الحصول على تجربة مجانية للباقة التالية:\n- المنصة: *${platform}*\n- الباقة: *${planName}*\n\nشكرًا لكم.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/96560930205?text=${encodedMessage}`, '_blank');
    };

    const handleCustomPlanSelect = () => {
        const message = `أهلاً Boostly،\n\nأود الاستفسار عن باقة مخصصة. الرجاء تزويدي بالتفاصيل.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/96560930205?text=${encodedMessage}`, '_blank');
    };

    return (
        <section id="pricing" className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6"><span className="gradient-text">جميع الباقات</span></h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">اختر الباقة التي تناسب احتياجاتك وميزانيتك من بين أفضل الخدمات في الكويت.</p>
                </motion.div>
                <Tabs defaultValue="instagram" className="w-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-12">
                            {Object.keys(pricingData).map((platform) => {
                                const Icon = platformIcons[platform];
                                return (
                                <TabsTrigger key={platform} value={platform} className="capitalize flex items-center gap-2"><Icon className="h-5 w-5" />{platform}</TabsTrigger>
                            )})}
                        </TabsList>
                    </motion.div>
                    {Object.entries(pricingData).map(([platform, plans]) => (
                        <TabsContent key={platform} value={platform}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {plans.map((plan, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, y: 50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="pricing-card-v2 group flex flex-col">
                                        <div className="relative mb-4"><img src={plan.image} alt={plan.name} className="rounded-lg w-full h-auto transition-transform duration-300 group-hover:scale-105" /></div>
                                        <div className="p-4 text-center flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                            <p className="text-2xl font-bold gradient-text mb-4">{plan.price}</p>
                                            <div className="mt-auto space-y-2">
                                                <Button onClick={() => handlePlanSelect(platform, plan.name, plan.price)} className="w-full btn-primary flex items-center gap-2">
                                                    <IconLibrary.Whatsapp className="h-5 w-5" />
                                                    اطلب عبر واتساب
                                                </Button>
                                                <Button onClick={() => handleFreeTrial(platform, plan.name)} variant="outline" className="w-full btn-secondary flex items-center gap-2">
                                                    <IconLibrary.Gift size={16} /> اطلب تجربة مجانية
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} viewport={{ once: true }} className="text-center mt-16">
                    <p className="text-gray-200 mb-4">هل تحتاج باقة مخصصة؟</p>
                    <Button onClick={handleCustomPlanSelect} variant="outline" className="btn-secondary">تواصل معنا للحصول على عرض مخصص</Button>
                </motion.div>
            </div>
        </section>
    );
};

const Features = () => {
    const features = [
        { icon: 'Zap', title: 'الأسرع في الكويت', description: 'نضمن لك بداية تنفيذ الخدمة خلال دقائق من تأكيد الطلب.', color: 'text-[#f69980]', shadowColor: '#f69980' },
        { icon: 'Shield', title: 'الأكثر ثقة وأماناً', description: 'حماية كاملة لحسابك مع ضمان عدم الحظر أو النقصان.', color: 'text-green-400', shadowColor: '#4ade80' },
        { icon: 'CheckCircle', title: 'حسابات عربية حقيقية', description: 'جميع المتابعين والتفاعلات من حسابات عربية وخليجية حقيقية ونشطة.', color: 'text-[#8851a5]', shadowColor: '#8851a5' },
        { icon: 'Users', title: 'الجودة الأفضل', description: 'نقدم متابعين وتفاعلات عالية الجودة لضمان نمو طبيعي ومستدام.', color: 'text-[#e462a2]', shadowColor: '#e462a2' },
        { icon: 'Headphones', title: 'دعم فني احترافي', description: 'فريق دعم متخصص على مدار الساعة لحل جميع استفساراتك.', color: 'text-[#8851a5]', shadowColor: '#8851a5' },
        { icon: 'CreditCard', title: 'دفع آمن وسهل', description: 'طرق دفع متعددة وآمنة لتسهيل عملية الشراء.', color: 'text-sky-400', shadowColor: '#38bdf8' },
    ];
    return (
        <section id="features" className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">لماذا <span className="gradient-text">نحن الأفضل في الكويت؟</span></h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">نتميز بالجودة والسرعة والأمان في تقديم خدمات السوشال ميديا</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = IconLibrary[feature.icon];
                        return (
                            <motion.div key={feature.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} className="feature-card text-center group p-8">
                                <div className="flex justify-center mb-6">
                                    <Icon3D color={feature.shadowColor}>
                                        <IconComponent className={`h-10 w-10 ${feature.color}`} />
                                    </Icon3D>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const Stats = () => {
    const stats = [
        { icon: 'Users', number: '50,000+', label: 'عميل راضي', color: 'text-[#e462a2]', shadowColor: '#e462a2' },
        { icon: 'ShoppingCart', number: '500,000+', label: 'طلب مكتمل', color: 'text-green-400', shadowColor: '#4ade80' },
        { icon: 'Star', number: '4.9/5', label: 'تقييم العملاء', color: 'text-[#f69980]', shadowColor: '#f69980' },
        { icon: 'Globe', number: '100+', label: 'دولة نخدمها', color: 'text-[#8851a5]', shadowColor: '#8851a5' }
    ];
    return (
        <section id="stats" className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6"><span className="gradient-text">أرقامنا</span> تتحدث عنا</h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">إنجازات حقيقية وثقة عملائنا هي أكبر دليل على جودة خدماتنا</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const IconComponent = IconLibrary[stat.icon];
                        return (
                            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} className="text-center glass-effect rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <Icon3D color={stat.shadowColor}>
                                        <IconComponent className={`h-8 w-8 ${stat.color}`} />
                                    </Icon3D>
                                </div>
                                <motion.div className={`text-4xl font-bold mb-2 ${stat.color}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: index * 0.2 }} viewport={{ once: true }}>{stat.number}</motion.div>
                                <div className="text-gray-300 font-medium">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const testimonials = [
        { name: 'أحمد العلي', title: 'صاحب متجر إلكتروني', quote: 'شغلكم عجيب وسريع! والله فرَق معاي التفاعل بالانستغرام بأيام. أنصح فيكم وبقوة حق كل أهل الكويت.', rating: 5, avatar: 'https://placehold.co/100x100/e462a2/ffffff?text=AC' },
        { name: 'فاطمة الكندري', title: 'مؤثرة على تيك توك', quote: 'بالبداية كنت خايفة، بس الصراحة النتائج طلعت خيال! والدعم الفني ما قصّروا معاي كلش، جاوبوا على كل شي. مشكورين وايد.', rating: 5, avatar: 'https://placehold.co/100x100/8851a5/ffffff?text=FK' },
        { name: 'يوسف المطيري', title: 'مدير تسويق', quote: 'أضبط SMM بالكويت تعاملت وياه. أسعارهم زينة والمتابعين صج جودتهم عالية. صج فادونا بحملتنا الإعلانية ونجحناها.', rating: 5, avatar: 'https://placehold.co/100x100/f69980/ffffff?text=YM' }
    ];
    return (
        <section id="testimonials" className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">ماذا يقول <span className="gradient-text">عملاؤنا في الكويت؟</span></h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">آراء حقيقية من عملائنا الذين وثقوا بنا لتعزيز تواجدهم الرقمي.</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }} className="testimonial-card rounded-2xl p-8 flex flex-col">
                            <IconLibrary.Quote className="w-10 h-10 text-[#8851a5] mb-4" />
                            <p className="text-gray-300 mb-6 flex-grow">"{testimonial.quote}"</p>
                            <div className="flex items-center mt-auto">
                                <img className="w-12 h-12 rounded-full object-cover ml-4" alt={testimonial.name} src={testimonial.avatar} />
                                <div className="flex-grow">
                                    <p className="font-bold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-amber-400">
                                  <span>خمس نجوم</span>
                                  <IconLibrary.Star className="w-5 h-5 text-amber-400 fill-current" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Blog = () => {
    const articles = [
        { title: 'كيف تزيد متابعين انستغرام في الكويت؟ 10 استراتيجيات فعالة لعام 2025', excerpt: 'دليل شامل لزيادة المتابعين الحقيقيين والمتفاعلين على حسابك في انستغرام داخل السوق الكويتي.' },
        { title: 'أسرار نجاح حملات تيك توك الإعلانية في الكويت', excerpt: 'تعلم كيف تستهدف الجمهور الكويتي بشكل صحيح على تيك توك وتحقق أفضل النتائج لحملاتك.' },
        { title: 'لماذا Boostly هو خيارك الأول لخدمات السوشيال ميديا في الكويت؟', excerpt: 'مقارنة شاملة توضح لماذا نعتبر الأسرع والأكثر ثقة في تقديم خدمات الدعم لمنصات التواصل الاجتماعي.' },
        { title: '5 أخطاء شائعة تدمر حسابك على انستغرام وكيفية تجنبها', excerpt: 'اكتشف الأخطاء التي قد ترتكبها وتؤثر سلباً على نمو حسابك في الكويت وكيفية تصحيحها.' },
        { title: 'دليل المبتدئين لاستخدام سناب شات للأعمال في الكويت', excerpt: 'خطوات عملية للشركات الكويتية للاستفادة من منصة سناب شات للوصول إلى عملائها بفعالية.' },
        { title: 'أفضل أوقات النشر على انستغرام وتيك توك في الكويت لزيادة التفاعل', excerpt: 'تحليل لأفضل الأوقات التي يكون فيها الجمهور الكويتي نشطاً لضمان وصول منشوراتك لأكبر عدد ممكن.' },
    ];
    return (
        <section id="blog" className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">من مدونتنا: <span className="gradient-text">نصائح للسوق الكويتي</span></h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">مقالات متخصصة لمساعدتك على النجاح في عالم التسويق الرقمي في الكويت.</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} className="blog-card rounded-2xl overflow-hidden flex flex-col group">
                             <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-3 text-white flex-grow">{article.title}</h3>
                                <p className="text-gray-300 mb-6">{article.excerpt}</p>
                                <Button onClick={() => toast({ title: '🚧 المقال الكامل قيد الإعداد!' })} className="btn-secondary mt-auto">اقرأ المزيد <IconLibrary.ArrowLeft className="mr-2 h-4 w-4" /></Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const socialLinks = [
        { icon: 'Whatsapp', name: 'whatsapp', url: 'https://wa.me/96560930205' },
        { icon: 'Instagram', name: 'instagram', url: 'https://www.instagram.com/boostly_kw?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
        { icon: 'TikTok', name: 'tiktok', url: 'https://www.tiktok.com/@boostly_kw?_t=ZS-8xXvkGcSE1B&_r=1' },
    ];
    const navLinks = [{ name: 'الرئيسية', id: 'hero' }, { name: 'الأسعار', id: 'pricing' }, { name: 'الخدمات', id: 'services' }, { name: 'آراء العملاء', id: 'testimonials' }, { name: 'المدونة', id: 'blog' }, { name: 'اتصل بنا', id: 'contact' }];
    const policyLinks = ['سياسة الخصوصية', 'شروط الاستخدام', 'سياسة الاسترداد'];

    return (
        <footer id="contact" className="bg-black/40 py-16 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        <div className="flex items-center mb-6"><img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/0c66925f-f5b2-40eb-b414-4ab75f1d1af6/c075c580cb355c5921e07d83b1d6d21e.png" alt="Boostly Logo" className="h-14" /></div>
                        <p className="text-gray-300 mb-6 leading-relaxed">Boostly: منصة رائدة في تقديم خدمات السوشال ميديا عالية الجودة في الكويت بأسعار منافسة وخدمة عملاء متميزة.</p>
                        <div className="flex space-x-4 space-x-reverse">
                            {socialLinks.map((social) => {
                                const IconComponent = IconLibrary[social.icon];
                                return (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                                    <IconComponent className="h-5 w-5" />
                                </a>
                            )})}
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}>
                        <span className="text-xl font-bold text-white mb-6 block">روابط سريعة</span>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (<li key={link.id}><button onClick={() => handleScroll(link.id)} className="text-gray-300 hover:text-[#e462a2] transition-colors duration-300">{link.name}</button></li>))}
                        </ul>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                        <span className="text-xl font-bold text-white mb-6 block">خدماتنا</span>
                        <ul className="space-y-3">
                            {['Instagram', 'TikTok', 'Snapchat', 'Facebook', 'YouTube', 'Twitter'].map((service) => (<li key={service}><button onClick={() => handleScroll('services')} className="text-gray-300 hover:text-[#e462a2] transition-colors duration-300">{service}</button></li>))}
                        </ul>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
                        <span className="text-xl font-bold text-white mb-6 block">تواصل معنا</span>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 space-x-reverse"><IconLibrary.Mail className="h-5 w-5 text-[#8851a5]" /><span className="text-gray-300">info@boostly.com.kw</span></div>
                            <div className="flex items-center space-x-3 space-x-reverse"><IconLibrary.Phone className="h-5 w-5 text-[#8851a5]" /><span className="text-gray-300">+965 60930205</span></div>
                            <div className="flex items-center space-x-3 space-x-reverse"><IconLibrary.MapPin className="h-5 w-5 text-[#8851a5]" /><span className="text-gray-300">مدينة الكويت، الكويت</span></div>
                        </div>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }} className="border-t border-white/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 mb-4 md:mb-0">© 2025 Boostly. جميع الحقوق محفوظة.</p>
                        <div className="flex space-x-6 space-x-reverse">
                            {policyLinks.map((link) => (<button key={link} onClick={() => toast({ title: '🚧 سيتم إضافة هذه الصفحة قريباً!' })} className="text-gray-400 hover:text-[#e462a2] transition-colors duration-300 text-sm">{link}</button>))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};


// --- Main App Component ---

export default function App() {
  return (
    <>
        <style>{`
        :root {
            --bg-color: #170e39;
            --color-purple: #8851a5;
            --color-pink: #e462a2;
            --color-orange: #f69980;
        }
        body {
            background-color: var(--bg-color);
        }
        .bg-main {
            background-color: var(--bg-color);
        }
        .gradient-text {
            background-image: linear-gradient(to right, var(--color-purple), var(--color-pink), var(--color-orange));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        .btn-primary {
            background-image: linear-gradient(to right, var(--color-purple) 0%, var(--color-pink) 50%, var(--color-orange) 100%);
            background-size: 200% auto;
            color: white;
            border: none;
            transition: background-position 0.5s;
        }
        .btn-primary:hover {
            background-position: right center;
        }
        .btn-secondary {
            border-color: var(--color-purple);
            color: var(--color-purple);
            background-color: transparent;
        }
        .btn-secondary:hover {
            background-color: var(--color-purple);
            color: white;
        }
        .glass-effect {
            background: rgba(23, 14, 57, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .testimonial-card, .blog-card, .service-card, .feature-card, .pricing-card-v2 {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }
        .icon-3d-wrapper {
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));
        }
        .icon-3d-wrapper > svg, .icon-3d-wrapper > img {
            filter: drop-shadow(0 1px 1px var(--icon-color));
        }
        `}</style>
        <div className="min-h-screen bg-main text-white font-['Cairo']">
        <Header />
        <main>
            <Hero />
            <FeaturedPackages />
            <Features />
            <Services />
            <Pricing />
            <Stats />
            <Testimonials />
            <Blog />
        </main>
        <Footer />
        <Toaster />
        </div>
    </>
  );
}
