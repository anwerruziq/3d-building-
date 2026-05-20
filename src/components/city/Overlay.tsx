import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "./CityScene";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const links = [
    { label: "الجولة", href: "#" },
    { label: "مشاريعنا", href: "#projects" },
    { label: "خدماتنا", href: "#services" },
    { label: "تواصل معنا", href: "#contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-transparent backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-5 flex justify-between items-center transition-all">
        {/* Logo */}
        <div className="font-display font-bold text-xl tracking-[0.2em] text-white flex flex-col leading-none" style={{ textShadow: "0 0 10px rgba(255,255,255,0.2)" }}>
          <span className="text-primary text-[10px] md:text-xs tracking-[0.4em] mb-1 font-mono uppercase">Horizon</span>
          <span>ESTATES</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center">
          {links.map((link, i) => (
            <a 
              key={i} 
              href={link.href} 
              className="group relative font-mono text-xs text-white/70 hover:text-white transition-colors uppercase tracking-[0.15em]"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
            </a>
          ))}
          <a href="#contact" className="ml-4 border border-primary/30 hover:border-primary px-6 py-2.5 rounded-full font-mono text-xs tracking-widest text-primary transition-all hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(191,161,95,0.2)]">
            احجز موعداً
          </a>
        </div>

        {/* Mobile Hamburger (Custom Animated) */}
        <button 
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-end gap-1.5 z-[70] focus:outline-none group" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-8 group-hover:w-6"}`} />
          <span className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-6"}`} />
          <span className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-4 group-hover:w-8"}`} />
        </button>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[55] bg-black/95 backdrop-blur-3xl flex flex-col justify-center items-center transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none delay-200"}`}
      >
        <div className="flex flex-col items-center gap-8 w-full px-6">
          {links.map((link, i) => (
            <a 
              key={i} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className={`font-display text-2xl sm:text-3xl text-white tracking-widest transition-all duration-500 transform hover:text-primary ${isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${isOpen ? 100 + i * 100 : 0}ms` }}
            >
              {link.label}
            </a>
          ))}
          
          <div 
            className={`mt-12 flex flex-col items-center gap-6 transition-all duration-500 transform ${isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            style={{ transitionDelay: `${isOpen ? 500 : 0}ms` }}
          >
            <div className="w-12 h-[1px] bg-primary/30" />
            <a href="#contact" onClick={() => setIsOpen(false)} className="text-primary font-mono tracking-widest text-sm uppercase border border-primary/20 px-8 py-3 rounded-full hover:bg-primary/10 transition-colors">
              تواصل مع المبيعات
            </a>
            <div className="flex gap-8 mt-2 text-white/40 text-xs font-mono tracking-wider">
              <a href="#" className="hover:text-primary transition-colors">IG</a>
              <a href="#" className="hover:text-primary transition-colors">TW</a>
              <a href="#" className="hover:text-primary transition-colors">IN</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Overlay({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>;
}) {
  const [progress, setProgress] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [introVisible, setIntroVisible] = useState(true);
  const [introAnimated, setIntroAnimated] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevProgress = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const tourHeight = SECTIONS.length * el.clientHeight;
      const p = tourHeight > 0 ? Math.min(1, el.scrollTop / tourHeight) : 0;
      scrollRef.current = p;
      setProgress(p);
      prevProgress.current = p;

      if (idleTimer.current) clearTimeout(idleTimer.current);

      if (p < 0.08) {
        setIntroVisible(false);
        setIntroAnimated(false);
        idleTimer.current = setTimeout(() => {
          setIntroVisible(true);
          setTimeout(() => setIntroAnimated(true), 30);
        }, 700);
      } else {
        setIntroVisible(false);
        setIntroAnimated(false);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(() => {
      setIntroVisible(true);
      setTimeout(() => setIntroAnimated(true), 80);
    }, 300);
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [scrollRef]);

  return (
    <>
      <NavBar />

      {/* Intro Company Name */}
      <div
        className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center px-4"
        style={{
          visibility: introVisible ? "visible" : "hidden",
          opacity: introAnimated ? 1 : 0,
          transform: introAnimated ? "translateY(0px) scale(1)" : "translateY(30px) scale(0.94)",
          transition: introAnimated
            ? "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)"
            : "none",
        }}
      >
        <h1
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.1em] md:tracking-[0.15em] text-white text-center leading-tight"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.5), 0 0 40px var(--primary)" }}
        >
          الأفق العقارية
        </h1>
        <div
          className="bg-primary mt-4 md:mt-6 mb-3 md:mb-4"
          style={{
            height: "1px",
            width: introAnimated ? "8rem" : "0rem",
            boxShadow: "0 0 15px var(--primary)",
            transition: "width 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s",
          }}
        />
        <p
          className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] text-primary/80 uppercase animate-pulse text-center"
          style={{
            opacity: introAnimated ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          اسحب للاستكشاف
        </p>
      </div>

      {/* Bottom label */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 z-20 py-2 md:py-3 font-mono text-[8px] md:text-[10px] tracking-widest text-primary/60 text-center whitespace-nowrap">
        الأفق العقارية · جولة افتراضية للمشروع
      </div>

      {/* Scroll indicator on mobile */}
      <div className="md:hidden pointer-events-none fixed right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
        <div className="w-0.5 h-16 bg-primary/20 rounded-full overflow-hidden">
          <div
            className="w-full bg-primary rounded-full transition-all duration-300"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Scrollable layer */}
      <div ref={scrollerRef} className="fixed inset-0 z-10 overflow-y-scroll overflow-x-hidden pt-20">
        {SECTIONS.map((s, i) => (
          <div key={i} className="h-screen w-full pointer-events-none" />
        ))}
        <div className="h-screen" />

        {/* Content after 3D tour */}
        <div className="relative z-20 bg-background/95 backdrop-blur-md border-t border-primary/20 pointer-events-auto">
          <ProjectsSection />
          <ServicesSection />
          <ContactSection />
          <FooterSection />
        </div>
      </div>
    </>
  );
}

function ProjectsSection() {
  const projects = [
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      name: "برج الأفق السكني",
      type: "مجمع سكني فاخر",
    },
    {
      src: "https://images.unsplash.com/photo-1535868463750-c78d9543614f?auto=format&fit=crop&w=800&q=80",
      name: "مجمع النخيل التجاري",
      type: "مركز تجاري متكامل",
    },
    {
      src: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=800&q=80",
      name: "فلل الواحة",
      type: "فلل سكنية راقية",
    },
    {
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      name: "المركز الذهبي",
      type: "مساحات مكتبية عالمية",
    },
  ];
  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      <div className="mb-10 md:mb-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4 uppercase tracking-widest neon-text">
          مشاريعنا السابقة
        </h2>
        <p className="font-mono text-xs sm:text-sm text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          اكتشف أحدث مشاريع الأفق العقارية، حيث تلتقي الفخامة بالتصميم العصري.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
        {projects.map((p, i) => (
          <div
            key={i}
            className="group relative aspect-video overflow-hidden rounded-lg border border-primary/20 bg-black"
          >
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10 pointer-events-none" />
            <img
              src={p.src}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
              <h3 className="font-mono text-sm sm:text-base md:text-lg font-bold text-white mb-0.5 md:mb-1">
                {p.name}
              </h3>
              <p className="font-mono text-[10px] sm:text-xs text-primary/80">{p.type}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    { title: "إدارة الأملاك", desc: "خدمات إدارة متكاملة للحفاظ على قيمة عقاراتك وتعظيم العوائد." },
    { title: "التطوير العقاري", desc: "بناء وتطوير مجمعات سكنية وتجارية بمواصفات عالمية." },
    { title: "الاستشارات الهندسية", desc: "تصاميم معمارية فريدة تجمع بين الجمال والعملية." },
    { title: "الوساطة والاستثمار", desc: "فرص استثمارية مدروسة تضمن لك أفضل العوائد في السوق." },
  ];
  return (
    <section id="services" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-primary/10 scroll-mt-20">
      <div className="mb-10 md:mb-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4 uppercase tracking-widest neon-text">
          خدماتنا العقارية
        </h2>
        <p className="font-mono text-xs sm:text-sm text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          نقدم حلولاً متكاملة تلبي تطلعاتك الاستثمارية والسكنية.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map((s, i) => (
          <div
            key={i}
            className="glass p-4 md:p-6 rounded-lg border border-primary/20 hover:border-primary/60 transition-colors group"
          >
            <div className="text-primary font-mono text-lg md:text-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform inline-block">
              0{i + 1}//
            </div>
            <h3 className="font-mono text-base md:text-lg font-bold text-white mb-1 md:mb-2">{s.title}</h3>
            <p className="font-mono text-[11px] md:text-xs text-foreground/60 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-3xl mx-auto border-t border-primary/10 scroll-mt-20">
      <div className="mb-8 md:mb-12 text-center">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4 uppercase tracking-widest neon-text">
          تواصل معنا
        </h2>
        <p className="font-mono text-xs sm:text-sm text-foreground/60 leading-relaxed">
          فريق المبيعات جاهز للرد على استفساراتك حول مشاريعنا.
        </p>
      </div>
      <form className="flex flex-col gap-4 md:gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="font-mono text-[10px] md:text-xs text-primary/80 uppercase tracking-widest">
            الاسم الكريم
          </label>
          <input
            type="text"
            className="bg-black/50 border border-primary/30 rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-primary transition-colors w-full"
            placeholder="أدخل اسمك"
          />
        </div>
        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="font-mono text-[10px] md:text-xs text-primary/80 uppercase tracking-widest">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            className="bg-black/50 border border-primary/30 rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-primary transition-colors w-full"
            placeholder="user@horizon.estates"
          />
        </div>
        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="font-mono text-[10px] md:text-xs text-primary/80 uppercase tracking-widest">
            الرسالة أو الاستفسار
          </label>
          <textarea
            rows={4}
            className="bg-black/50 border border-primary/30 rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-none w-full"
            placeholder="اكتب رسالتك هنا..."
          />
        </div>
        <button className="mt-2 md:mt-4 bg-primary/20 hover:bg-primary/40 border border-primary text-primary font-mono py-3 md:py-4 rounded tracking-[0.15em] md:tracking-[0.2em] transition-all hover:shadow-[0_0_20px_var(--primary)] uppercase text-sm md:text-base">
          إرسال الطلب
        </button>
      </form>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-primary/20 bg-black/50 py-10 md:py-12 px-4 md:px-6 text-center">
      <div className="font-display text-base md:text-lg tracking-[0.3em] text-primary/90 mb-3 md:mb-4">
        HORIZON<span className="text-secondary"> ESTATES</span>
      </div>
      <p className="font-mono text-[11px] md:text-xs text-foreground/50 mb-6 md:mb-8 max-w-md mx-auto leading-relaxed">
        شريكك الموثوق في عالم التطوير العقاري. نبني المستقبل معاً.
      </p>
      <div className="flex justify-center gap-4 md:gap-6 font-mono text-xs text-primary/60 flex-wrap">
        <a href="#" className="hover:text-primary transition-colors">TWITTER</a>
        <a href="#" className="hover:text-primary transition-colors">INSTAGRAM</a>
        <a href="#" className="hover:text-primary transition-colors">LINKEDIN</a>
      </div>
      <div className="mt-8 md:mt-12 font-mono text-[9px] md:text-[10px] text-foreground/30">
        © 2026 الأفق للتطوير العقاري. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

