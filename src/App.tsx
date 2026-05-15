import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Mail, ExternalLink, Download, ArrowRight, Briefcase, User, Code, FileText, Menu, X, GraduationCap } from 'lucide-react';

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

  const navLinks = [
    { name: 'Home', href: '#home', icon: User },
    { name: 'About', href: '#about', icon: FileText },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Education', href: '#education', icon: GraduationCap },
    { name: 'Projects', href: '#projects', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-600 font-sans selection:bg-neutral-900 selection:text-neutral-900 w-full overflow-x-hidden relative">
      <div className="fixed inset-0 flex pointer-events-none z-[-2]">
         <BackgroundLight />
      </div>
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className={`flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto`}>
          <a href="#home" className="text-xl font-bold tracking-tight text-neutral-900 relative z-10">
            J F .
          </a>
          
          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-2 relative z-10">
            {navLinks.map((link, i) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className={`px-4 py-2 rounded-full text-[15px] font-medium transition-all hover:bg-neutral-100/80 hover:text-neutral-900 flex items-center gap-1.5 ${activeSection === link.href.substring(1) ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600'}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Social Links Desktop */}
          <div className="hidden md:flex items-center space-x-3 relative z-10">
             <a href="https://www.linkedin.com/in/joaofernandes351/" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 p-1.5 rounded-full transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 p-1.5 rounded-full transition-colors" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-neutral-600 hover:text-neutral-900 transition-colors relative z-10 p-1 px-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#fafafa] pt-24 px-6 md:hidden flex flex-col"
          >
            <ul className="flex flex-col space-y-6 text-xl font-semibold mb-12">
              {navLinks.map((link, i) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 ${activeSection === link.href.substring(1) ? 'text-neutral-900' : 'text-neutral-700'}`}
                  >
                    <span className="font-mono text-sm text-neutral-800/50">0{i+1}.</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-6 border-t border-neutral-200 pt-8 mt-auto mb-12">
              <a href="https://www.linkedin.com/in/joaofernandes351/" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="mailto:joaofernandes351@gmail.com" className="text-neutral-500 hover:text-neutral-900 transition-colors">
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
              <div className="font-mono text-neutral-900 mb-4 tracking-widest text-sm">Hello, World. I am</div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-6">
                João Fernandes
              </h1>
              <h2 className="text-xl md:text-2xl text-neutral-600 font-medium mb-8 max-w-2xl leading-relaxed">
                Software Engineer & Junior AI Engineer crafting modern, fast, and intelligent web experiences.
              </h2>
              
              <div className="flex flex-wrap items-center gap-4">
                <a 
                  href="#projects" 
                  className="inline-flex items-center justify-center bg-neutral-900 text-white border border-neutral-900 px-6 py-3 rounded-md font-mono text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  View Projects
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center bg-white text-neutral-900 border border-neutral-200 px-6 py-3 rounded-md font-mono text-sm font-medium hover:bg-neutral-50 transition-colors gap-2"
                >
                  <Download className="h-4 w-4 text-neutral-800" />
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
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 font-mono text-xl">01.</span> About me
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 text-neutral-600 leading-relaxed text-lg">
              <div className="space-y-6">
                <p>
                  I'm focused on building digital products that not only work perfectly but also deliver real value to the project. I like to act as a bridge between design and engineering, ensuring interfaces are accessible, responsive, and easy to use.
                </p>
                <p>
                  Currently, I specialize in the <strong className="text-neutral-900 font-medium">React / Next.js / TypeScript</strong> ecosystem, but I adapt easily to new technologies and tools according to business needs. 
                </p>
              </div>
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 mb-6">Technical Skills</h3>
                <div className="w-full">
                  <Marquee fade fadeAmount={20}>
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
                      <span key={skill.name} className="mx-2 bg-white border border-neutral-200 text-neutral-600 px-4 py-2 flex items-center gap-2 rounded-md font-mono text-xs shadow-none font-medium hover:border-neutral-800/30 hover:text-neutral-900 group transition-colors duration-300">
                        <img 
                          src={`https://cdn.simpleicons.org/${skill.slug}`} 
                          alt={`${skill.name} logo`} 
                          loading="lazy"
                          className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                        />
                        {skill.name}
                      </span>
                    ))}
                  </Marquee>
                  <Marquee fade fadeAmount={20} direction="right" className="mt-4">
                    {[
                      { name: 'Supabase', slug: 'supabase' },
                      { name: 'Python', slug: 'python' },
                      { name: 'AWS', slug: 'amazonaws' },
                      { name: 'GraphQL', slug: 'graphql' },
                      { name: 'Redux', slug: 'redux' },
                      { name: 'Zustand', slug: 'zustand' },
                      { name: 'Jest', slug: 'jest' },
                      { name: 'Cypress', slug: 'cypress' },
                      { name: 'Vite', slug: 'vite' },
                      { name: 'Webpack', slug: 'webpack' },
                    ].map((skill) => (
                      <span key={skill.name} className="mx-2 bg-white border border-neutral-200 text-neutral-600 px-4 py-2 flex items-center gap-2 rounded-md font-mono text-xs shadow-none font-medium hover:border-neutral-800/30 hover:text-neutral-900 group transition-colors duration-300">
                        <img 
                          src={`https://cdn.simpleicons.org/${skill.slug}`} 
                          alt={`${skill.name} logo`} 
                          loading="lazy"
                          className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
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
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 font-mono text-xl">02.</span> Professional Experience
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
                  logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQEzbpAB4qegnw/company-logo_100_100/company-logo_100_100/0/1658827782433/datamentors_logo?e=1780531200&v=beta&t=oHlz0Bm4HB_dRa4D5vhTQPVuB8FEWVO93n2bCrYmZus',
                  description: 'Santa Cruz, Madeira, Portugal',
                  skills: ['Internship']
                },
                {
                  period: 'Jul 2022',
                  duration: '1 month',
                  role: 'Full-Stack Developer - Summer Internship',
                  company: 'ARDITI - Regional Agency for the Development of Research, Technology and Innovation',
                  logo: 'https://media.licdn.com/dms/image/v2/D560BAQGgqdUEp4jZUA/company-logo_100_100/B56ZXN4VuIGUAc-/0/1742915854062/arditi_pt_logo?e=1780531200&v=beta&t=Q-VN1jFC3nHVMQMCz3dy1eg2qNo9EfjpBcuKlifRs6A',
                  description: 'Funchal, Madeira, Portugal',
                  skills: ['Internship']
                }
              ].map((job, index) => (
                <div key={index} className="relative pl-8 md:pl-0">
                  <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                    <div className="mb-2 md:mb-0 md:text-right select-none pt-2 flex flex-wrap items-center md:items-start md:justify-end gap-2 md:gap-1 md:flex-col">
                      <div className="font-mono text-[13px] text-neutral-500 tracking-wide uppercase">{job.period}</div>
                      {job.duration && (
                         <>
                           <div className="text-neutral-300 md:hidden">•</div>
                           <div className="text-xs text-neutral-400">{job.duration}</div>
                         </>
                      )}
                    </div>
                    
                    <div className="md:col-span-4 pb-8 md:pb-0 relative group">
                      <div className="flex items-start gap-4 mb-5 border-l-2 border-neutral-200 pl-6 -ml-6 pb-2">
                        <img src={job.logo} alt={`Company logo ${job.company}`} className="w-12 h-12 rounded object-cover border border-neutral-200 shrink-0 " />
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 leading-tight mb-2">{job.role}</h3>
                          <p className="text-neutral-900 font-mono text-sm">{job.company}</p>
                        </div>
                      </div>
                      <p className="text-neutral-600 leading-relaxed mb-6">{job.description}</p>
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                             {job.skills.map((skill, i) => (
                               <span key={i} className="font-mono bg-neutral-100 text-neutral-800 px-3 py-1.5 text-xs rounded border border-neutral-200 transition-colors duration-300">
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
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 font-mono text-xl">03.</span> Academic Education
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="space-y-12">
              {[
                {
                  period: 'Sep 2024 – Jun 2026',
                  degree: "Master's degree, Computer Engineering",
                  school: 'University of Madeira',
                  logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQGZ0svm8mSUQw/company-logo_100_100/company-logo_100_100/0/1630496843625/universidade_da_madeira_logo?e=1780531200&v=beta&t=VMYX-YANwM2ygfUPParBNXw6F1An7rdSP9J88KOHRxw',
                },
                {
                  period: 'Oct 2023 – Jun 2024',
                  degree: 'Erasmus',
                  school: 'Faculty of Electrical Engineering and Computer Science, University of Maribor',
                  logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQF4nujCeXK4pw/company-logo_100_100/company-logo_100_100/0/1630487242933?e=1780531200&v=beta&t=VzDGXrg5tVxs6KseM6YW76vtccCU-06jYsPy6aKNcvw',
                },
                {
                  period: 'Oct 2020 – Jul 2024',
                  degree: "Bachelor's degree, Computer Engineering",
                  school: 'University of Madeira',
                  logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQGZ0svm8mSUQw/company-logo_100_100/company-logo_100_100/0/1630496843625/universidade_da_madeira_logo?e=1780531200&v=beta&t=VMYX-YANwM2ygfUPParBNXw6F1An7rdSP9J88KOHRxw',
                },
                {
                  period: 'Sep 2016 – Jul 2019',
                  degree: 'Professional Secondary Education, IT Equipment Management Technician',
                  school: 'Francisco Franco Secondary School',
                  logo: 'https://seeschools.com/assets/img/clients/logo_francisco_franco.svg',
                }
              ].map((edu, index) => (
                <div key={index} className="relative pl-8 md:pl-0">
                  <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                    <div className="mb-2 md:mb-0 md:text-right select-none pt-2">
                      <span className="font-mono text-[13px] text-neutral-500 tracking-wide uppercase">{edu.period}</span>
                    </div>
                    
                    <div className="md:col-span-4 pb-8 md:pb-0 relative group">
                      <div className="flex items-start gap-4 mb-2 border-l-2 border-neutral-200 pl-6 -ml-6 pb-2">
                        <img src={edu.logo} alt={`Logo of ${edu.school}`} className="w-12 h-12 rounded object-cover border border-neutral-200 shrink-0" />
                        <div className="pt-0.5">
                          <h3 className="text-xl font-bold text-neutral-900 leading-tight mb-2">{edu.degree}</h3>
                          <p className="text-neutral-900 font-mono text-sm">{edu.school}</p>
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
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="text-neutral-900 font-mono text-xl">04.</span> Featured Projects
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
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
                <div key={index} className="bg-white rounded-xl border border-neutral-200 overflow-hidden group hover:border-neutral-800/30 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl pt-1">
                  <div className="relative overflow-hidden aspect-video bg-[#fafafa] border-b border-neutral-200">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                       <a href={project.link} className="hover:text-neutral-900 transition-colors flex items-center gap-2 group/link">
                         {project.title}
                         <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 -translate-y-1 -translate-x-1 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all text-neutral-900" />
                       </a>
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-mono font-medium text-neutral-900 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200 pt-5 mt-auto">
                       <a href={project.github} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
                         <Github className="h-4 w-4" /> Source code
                       </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="inline-flex items-center text-neutral-900 font-mono text-sm border-b border-transparent hover:border-neutral-900 pb-0.5 transition-all group">
                View all on GitHub
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#fafafa] border-t border-neutral-200 py-12 px-6">
        <div className="max-w-6xl mx-auto md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-neutral-400 font-mono text-xs">
            © {new Date().getFullYear()} João Fernandes. Designed & built with React & Tailwind.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/in/joaofernandes351/" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/joaofernandes52" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="mailto:joaofernandes351@gmail.com" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
