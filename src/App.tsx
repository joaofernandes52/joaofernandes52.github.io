import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Mail, ExternalLink, Download, ArrowRight, Briefcase, User, Code, FileText, Menu, X, GraduationCap, Moon, Sun } from 'lucide-react';

import { BackgroundLight } from './components/ui/background-snippets';
import { Marquee } from './components/ui/marquee';
import { EditTool } from './components/EditTool';

const OLD_CODE = `while awake:
    write_code()
    if has_bugs():
        cry_a_little()
`;

const NEW_CODE = `while alive:
    coffee()
    code()
    try: ship()
    except: coffee()
`;

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '', botcheck: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string>('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  useEffect(() => {
    const renderWidget = () => {
      if (turnstileRef.current && (window as any).turnstile && !turnstileWidgetId.current) {
        turnstileWidgetId.current = (window as any).turnstile.render(turnstileRef.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
          theme: isDarkMode ? 'dark' : 'light',
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        });
      }
    };
    (window as any).onloadTurnstileCallback = renderWidget;
    if ((window as any).turnstile) renderWidget();
  }, [isDarkMode]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.botcheck) return;
    const lastSubmit = parseInt(localStorage.getItem('contact_rate') || '0');
    if (Date.now() - lastSubmit < 60000) {
      setFormError(`Too many requests. Wait ${Math.ceil((60000 - (Date.now() - lastSubmit)) / 1000)}s.`);
      setFormStatus('error');
      return;
    }
    if (!turnstileToken) {
      setFormError('Please complete the security check.');
      setFormStatus('error');
      return;
    }
    setFormStatus('submitting');
    setFormError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus('success');
        setContactForm({ name: '', email: '', subject: '', message: '', botcheck: '' });
        localStorage.setItem('contact_rate', Date.now().toString());
        if (turnstileWidgetId.current) {
          (window as any).turnstile?.reset(turnstileWidgetId.current);
          setTurnstileToken('');
        }
      } else {
        throw new Error(data.message || 'Failed to send.');
      }
    } catch (err) {
      setFormStatus('error');
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      if (turnstileWidgetId.current) {
        (window as any).turnstile?.reset(turnstileWidgetId.current);
        setTurnstileToken('');
      }
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home', icon: User },
    { name: 'About', href: '#about', icon: FileText },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Education', href: '#education', icon: GraduationCap },
    { name: 'Projects', href: '#projects', icon: Code },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      return;
    }
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 w-full overflow-x-hidden relative">
      <div className="fixed inset-0 flex pointer-events-none z-[-2]">
         <BackgroundLight />
      </div>
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900 shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className={`flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto`}>
          <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white relative z-10">
            J F .
          </a>
          
          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-2 relative z-10">
            {navLinks.map((link, i) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`px-4 py-2 rounded-full text-[15px] font-medium transition-all hover:bg-neutral-100/80 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 ${activeSection === link.href.substring(1) ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Social Links Desktop */}
          <div className="hidden md:flex items-center space-x-3 relative z-10">
             <button 
               onClick={() => setIsDarkMode(!isDarkMode)} 
               className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 p-1.5 rounded-full transition-colors"
               aria-label="Toggle dark mode"
             >
               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
             </button>
             <a href="https://www.linkedin.com/in/joaofernandes351/" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 p-1.5 rounded-full transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
             </a>
            <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 p-1.5 rounded-full transition-colors" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2 relative z-10 p-1 px-2">
            <button 
               onClick={() => setIsDarkMode(!isDarkMode)} 
               className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1"
               aria-label="Toggle dark mode"
             >
               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
             className="fixed inset-0 z-40 bg-[#fafafa] dark:bg-[#0a0a0a] pt-24 px-6 md:hidden flex flex-col"
          >
            <ul className="flex flex-col space-y-6 text-xl font-semibold mb-12">
              {navLinks.map((link, i) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`flex items-center gap-4 ${activeSection === link.href.substring(1) ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}
                  >
                    <span className="font-mono text-sm text-neutral-800/50 dark:text-neutral-200/50">0{i+1}.</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-6 border-t border-neutral-200 dark:border-neutral-900 pt-8 mt-auto mb-12">
              <a href="https://www.linkedin.com/in/joaofernandes351/" target="_blank" rel="noreferrer" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="mailto:joaofernandes351@gmail.com" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24 space-y-32 relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-[70vh] flex flex-col justify-center scroll-mt-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1"
            >
              <div className="font-mono text-neutral-900 dark:text-neutral-300 mb-4 tracking-widest text-sm">Hello, World. I am</div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                João Fernandes
              </h1>
              <h2 className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-medium mb-8 max-w-2xl leading-relaxed text-justify">
                Software Engineer & Junior AI Engineer crafting modern, fast, and intelligent experiences.
              </h2>
              
              <div className="flex flex-wrap items-center gap-4">
                <a 
                  href="#projects" 
                  onClick={(e) => scrollToSection(e, '#projects')}
                  className="inline-flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border border-neutral-900 dark:border-white px-6 py-3 rounded-md font-mono text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  View Projects
                </a>
                <a 
                  href="#" 
                  onClick={(e) => scrollToSection(e, '#')}
                  className="inline-flex items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 px-6 py-3 rounded-md font-mono text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors gap-2"
                >
                  <Download className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                  Download CV
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 w-full lg:max-w-[480px] lg:ml-auto"
            >
               <EditTool 
                 state="completed"
                 variant="edit"
                 filePath="developer.py"
                 oldContent={OLD_CODE}
                 newContent={NEW_CODE}
               />
            </motion.div>
            
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 dark:text-neutral-400 font-mono text-xl">01.</span> About me
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
              <div className="space-y-6">
                <p className="text-justify">
                  I'm focused on building digital products that not only work perfectly but also deliver real value to the project. I like to act as a bridge between design and engineering, ensuring interfaces are accessible, responsive, and easy to use.
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-6">Technical Skills</h3>
                <div className="w-full overflow-hidden">
                  <Marquee fade fadeAmount={10}>
                    {[
                      { name: 'JavaScript', slug: 'javascript' },
                      { name: 'TypeScript', slug: 'typescript' },
                      { name: 'React', slug: 'react' },
                      { name: 'Next.js', slug: 'nextdotjs' },
                      { name: 'Node.js', slug: 'nodedotjs' },
                      { name: 'Tailwind CSS', slug: 'tailwindcss' },
                      { name: 'PostgreSQL', slug: 'postgresql' },
                      { name: 'Git', slug: 'git' },
                      { name: 'Figma', slug: 'figma' },
                      { name: 'Docker', slug: 'docker' },
                    ].map((skill) => (
                      <span key={skill.name} className="mx-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 px-4 py-2 flex items-center gap-2 rounded-md font-mono text-xs shadow-none font-medium hover:border-neutral-800/30 dark:hover:border-neutral-600/50 hover:text-neutral-900 dark:hover:text-white group transition-colors duration-300">
                        <img 
                          src={skill.slug === 'csharp' ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg` : skill.slug === 'java' ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg` : `https://cdn.simpleicons.org/${skill.slug}`} 
                          alt={`${skill.name} logo`} 
                          loading="lazy"
                          className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 dark:brightness-0 dark:invert opacity-80 group-hover:opacity-100"
                        />
                        {skill.name}
                      </span>
                    ))}
                  </Marquee>
                  <Marquee fade fadeAmount={10} direction="right" className="mt-4">
                    {[
                      { name: 'C#', slug: 'csharp' },
                      { name: 'Java', slug: 'java' },
                      { name: 'Supabase', slug: 'supabase' },
                      { name: 'Python', slug: 'python' },
                      { name: 'GraphQL', slug: 'graphql' },
                      { name: 'Jest', slug: 'jest' },
                      { name: 'Cypress', slug: 'cypress' },
                      { name: 'Vite', slug: 'vite' },
                    ].map((skill) => (
                      <span key={skill.name} className="mx-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 px-4 py-2 flex items-center gap-2 rounded-md font-mono text-xs shadow-none font-medium hover:border-neutral-800/30 dark:hover:border-neutral-600/50 hover:text-neutral-900 dark:hover:text-white group transition-colors duration-300">
                        <img 
                          src={skill.slug === 'csharp' ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg` : skill.slug === 'java' ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg` : `https://cdn.simpleicons.org/${skill.slug}`} 
                          alt={`${skill.name} logo`} 
                          loading="lazy"
                          className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 dark:brightness-0 dark:invert opacity-80 group-hover:opacity-100"
                        />
                        {skill.name}
                      </span>
                    ))}
                  </Marquee>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 dark:text-neutral-400 font-mono text-xl">02.</span> Professional Experience
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="space-y-12">
              {[
                {
                  period: 'Oct 2025 – Present',
                  duration: '8 months',
                  role: 'Junior AI Engineer',
                  company: 'Datamentors',
                  logo: '/logos/datamentors.jpeg',
                  initials: 'DM',
                  description: 'Santa Cruz, Madeira, Portugal',
                  skills: ['Internship']
                },
                {
                  period: 'Jun 2025 – Aug 2025',
                  duration: '3 months',
                  role: 'Full-Stack Developer',
                  company: 'University of Madeira',
                  logo: '/logos/uma.jpeg',
                  initials: 'UMa',
                  description: 'Funchal, Madeira, Portugal',
                  skills: ['Internship']
                },
                {
                  period: 'Jul 2022',
                  duration: '1 month',
                  role: 'Full-Stack Developer - Summer Internship',
                  company: 'ARDITI - Regional Agency for the Development of Research, Technology and Innovation',
                  logo: '/logos/arditi.jpeg',
                  initials: 'AR',
                  description: 'Funchal, Madeira, Portugal',
                  skills: ['Internship']
                }
              ].map((job, index) => (
                <div key={index} className="relative pl-8 md:pl-0">
                  <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                    <div className="mb-2 md:mb-0 md:text-right select-none pt-2 flex flex-wrap items-center md:items-end md:justify-start gap-2 md:gap-1 md:flex-col">
                      <div className="font-mono text-[13px] text-neutral-500 tracking-wide uppercase whitespace-nowrap">{job.period}</div>
                      {job.duration && (
                         <>
                           <div className="text-neutral-300 md:hidden">•</div>
                           <div className="text-xs text-neutral-400">{job.duration}</div>
                         </>
                      )}
                    </div>

                    <div className="md:col-span-4 pb-8 md:pb-0 relative group">
                      <div className="flex items-start gap-4 mb-5 border-l-2 border-neutral-200 dark:border-neutral-800 pl-6 -ml-6 pb-2">
                        <img src={job.logo} alt={`Company logo ${job.company}`} className="w-12 h-12 rounded object-cover border border-neutral-200 dark:border-neutral-800 shrink-0 " onError={(e) => { const t = e.currentTarget; t.style.display='none'; const fb = t.nextElementSibling as HTMLElement; if(fb) fb.style.display='flex'; }} /><div style={{display:'none'}} className="w-12 h-12 rounded border border-neutral-200 dark:border-neutral-800 shrink-0 bg-neutral-100 dark:bg-neutral-800 items-center justify-center font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400">{job.initials}</div>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-2">{job.role}</h3>
                          <p className="text-neutral-900 dark:text-neutral-300 font-mono text-sm">{job.company}</p>
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{job.description}</p>
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                             {job.skills.map((skill, i) => (
                               <span key={i} className="font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 px-3 py-1.5 text-xs rounded border border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
                                 {skill}
                               </span>
                             ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 dark:text-neutral-400 font-mono text-xl">03.</span> Academic Education
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="space-y-12">
              {[
                {
                  period: 'Sep 2024 – Jun 2026',
                  degree: "Master's degree, Computer Engineering",
                  school: 'University of Madeira',
                  logo: '/logos/uma.jpeg',
                  initials: 'UMa',
                },
                {
                  period: 'Oct 2023 – Jun 2024',
                  degree: 'Erasmus',
                  school: 'Faculty of Electrical Engineering and Computer Science, University of Maribor',
                  logo: '/logos/maribor.jpeg',
                  initials: 'UM',
                },
                {
                  period: 'Oct 2020 – Jul 2024',
                  degree: "Bachelor's degree, Computer Engineering",
                  school: 'University of Madeira',
                  logo: '/logos/uma.jpeg',
                  initials: 'UMa',
                },
                {
                  period: 'Sep 2016 – Jul 2019',
                  degree: 'Professional Secondary Education, IT Equipment Management Technician',
                  school: 'Francisco Franco Secondary School',
                  logo: '/logos/francisco_franco.svg',
                  initials: 'FF',
                }
              ].map((edu, index) => (
                <div key={index} className="relative pl-8 md:pl-0">
                  <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                    <div className="mb-2 md:mb-0 md:text-right select-none pt-2">
                      <span className="font-mono text-[13px] text-neutral-500 tracking-wide uppercase whitespace-nowrap">{edu.period}</span>
                    </div>

                    <div className="md:col-span-4 pb-8 md:pb-0 relative group">
                      <div className="flex items-start gap-4 mb-2 border-l-2 border-neutral-200 dark:border-neutral-800 pl-6 -ml-6 pb-2">
                        <img src={edu.logo} alt={`Logo of ${edu.school}`} className="w-12 h-12 rounded object-cover border border-neutral-200 dark:border-neutral-800 shrink-0" onError={(e) => { const t = e.currentTarget; t.style.display='none'; const fb = t.nextElementSibling as HTMLElement; if(fb) fb.style.display='flex'; }} /><div style={{display:'none'}} className="w-12 h-12 rounded border border-neutral-200 dark:border-neutral-800 shrink-0 bg-neutral-100 dark:bg-neutral-800 items-center justify-center font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400">{edu.initials}</div>
                        <div className="pt-0.5">
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-2">{edu.degree}</h3>
                          <p className="text-neutral-900 dark:text-neutral-300 font-mono text-sm">{edu.school}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-32 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 dark:text-neutral-400 font-mono text-xl">04.</span> Featured Projects
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2 py-12 flex justify-center items-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50">
                <span className="text-neutral-500 font-mono text-lg flex items-center gap-2">
                   <Code className="h-5 w-5" /> Soon...
                </span>
              </div>
              {/*
              {[
                {
                  title: 'FinTech Dashboard Master',
                  description: 'Complete financial reporting platform, interactive charts using machine learning to predict revenue based on simulated data.',
                  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
                  link: '#',
                  github: '#',
                  tags: ['React', 'Chart.js', 'Tailwind']
                },
                {
                  title: 'B2B E-Commerce Pro',
                  description: 'Optimized B2B system focused on large volume purchases, ultra-fast search, and dynamic generation of quotes and PDF invoices.',
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500',
                  link: '#',
                  github: '#',
                  tags: ['Next.js', 'PostgreSQL', 'Stripe']
                },
                {
                  title: 'SaaS Analytics Tool',
                  description: 'Dedicated tool for startups to measure customer retention through analytical heatmaps and shareable dashboards.',
                  image: 'https://images.unsplash.com/photo-1552508744-1696d4464960?auto=format&fit=crop&q=80&w=800&h=500',
                  link: '#',
                  github: '#',
                  tags: ['Vue 3', 'Firebase', 'D3.js']
                },
                {
                  title: 'Agile Task Manager',
                  description: 'Kanban style application built to demonstrate optimistic network updates, offline support, and high performance drag and drop.',
                  image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800&h=500',
                  link: '#',
                  github: '#',
                  tags: ['React', 'TypeScript', 'Zustand']
                }
              ].map((project, index) => (
                <div key={index} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden group hover:border-neutral-800/30 dark:hover:border-neutral-600/50 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl pt-1">
                  <div className="relative overflow-hidden aspect-video bg-[#fafafa] dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-neutral-900/5 dark:bg-white/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                       <a href={project.link} className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors flex items-center gap-2 group/link">
                         {project.title}
                         <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 -translate-y-1 -translate-x-1 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all text-neutral-900 dark:text-neutral-300" />
                       </a>
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-mono font-medium text-neutral-900 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-5 mt-auto">
                       <a href={project.github} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 flex items-center gap-1.5 transition-colors">
                         <Github className="h-4 w-4" /> Source code
                       </a>
                    </div>
                  </div>
                </div>
              ))
              */}
            </div>
            
            <div className="mt-12 flex justify-center">
              <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="inline-flex items-center text-neutral-900 dark:text-white font-mono text-sm border-b border-transparent hover:border-neutral-900 dark:hover:border-white pb-0.5 transition-all group">
                View all on GitHub
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-32 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 dark:text-neutral-400 font-mono text-xl">05.</span> Contact
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg mb-8">
                  Have a project in mind or just want to chat? Fill out the form and I'll get back to you as soon as possible.
                </p>
                <a href="mailto:joaofernandes351@gmail.com" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-mono text-sm">
                  <Mail className="h-4 w-4" />
                  joaofernandes351@gmail.com
                </a>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                {/* Honeypot — bots fill this, humans don't */}
                <input
                  type="text"
                  name="botcheck"
                  value={contactForm.botcheck}
                  onChange={e => setContactForm(f => ({ ...f, botcheck: e.target.value }))}
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                      placeholder="João Fernandes"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={contactForm.subject}
                    onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                    placeholder="Project proposal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <div ref={turnstileRef} />

                {formStatus === 'error' && (
                  <p className="text-red-500 text-sm font-mono">{formError}</p>
                )}
                {formStatus === 'success' && (
                  <p className="text-green-600 dark:text-green-400 text-sm font-mono">Message sent successfully! I'll get back to you soon.</p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className="w-full inline-flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border border-neutral-900 dark:border-white px-6 py-3 rounded-md font-mono text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#fafafa] dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-900 py-12 px-6">
        <div className="max-w-6xl mx-auto md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-neutral-400 dark:text-neutral-500 font-mono text-xs">
            © {new Date().getFullYear()} João Fernandes.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/in/joaofernandes351/" target="_blank" rel="noreferrer" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="mailto:joaofernandes351@gmail.com" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
