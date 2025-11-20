const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Stagger animation delays per component group
const addStaggeredAnimations = () => {
    const groups = [
        { selector: '.skills-grid .skill-card', step: 0.08 },
        { selector: '.projects-grid .project-card', step: 0.12 },
        { selector: '.badge-card', step: 0.1 },
        { selector: '.about-stats .stat', step: 0.1 },
        { selector: '.contact-item', step: 0.12 }
    ];

    groups.forEach(({ selector, step }) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.dataset.animateDelay = (index * step).toFixed(2);
        });
    });
};

// Reveal elements on scroll with custom delays
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-card, .about-text, .contact-item, .project-card, .badge-card, .stat, .about-visual, .hero-visual, .depth-block');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.18 });

    elements.forEach((element, index) => {
        const delay = element.dataset.animateDelay ?? (index * 0.07).toFixed(2);
        element.classList.add('animate-on-scroll');
        element.style.transitionDelay = `${delay}s`;
        observer.observe(element);
    });
};

// Parallax layers for hero glows and grid
const parallaxEffect = () => {
    const heroGrid = document.querySelector('.hero-grid');
    const glowA = document.querySelector('.hero-glow-a');
    const glowB = document.querySelector('.hero-glow-b');
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;

    if (heroGrid) {
        heroGrid.style.transform = `translateY(${scrolled * 0.12}px) translateZ(-400px)`;
    }
    if (glowA) {
        glowA.style.transform = `translate3d(0, ${scrolled * 0.18}px, 0)`;
    }
    if (glowB) {
        glowB.style.transform = `translate3d(0, ${scrolled * -0.08}px, 0)`;
    }
};

// Soft glow animation for matrix lines
const initMatrixGlow = () => {
    const lines = document.querySelectorAll('.matrix-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('glow');
        }, index * 420);
    });
};

// 3D tilt interaction for cards
const initTiltCards = () => {
    const tiltCards = document.querySelectorAll('.tilt-card[data-tilt]');

    tiltCards.forEach(card => {
        const rotateLimit = parseFloat(card.dataset.tiltMax || '14');
        let animationFrame = null;

        const resetTransform = () => {
            card.style.transition = 'transform 0.35s ease';
            card.style.setProperty('--tilt-rotateX', '0deg');
            card.style.setProperty('--tilt-rotateY', '0deg');
            card.style.setProperty('--tilt-translateZ', '0px');
        };

        const updateTransform = (event) => {
            const rect = card.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            const rotateY = clamp(((offsetX / rect.width) - 0.5) * rotateLimit * 2, -rotateLimit, rotateLimit);
            const rotateX = clamp(((offsetY / rect.height) - 0.5) * rotateLimit * -2, -rotateLimit, rotateLimit);

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = requestAnimationFrame(() => {
                card.style.transition = 'transform 0.12s ease-out';
                card.style.setProperty('--tilt-rotateX', `${rotateX}deg`);
                card.style.setProperty('--tilt-rotateY', `${rotateY}deg`);
                card.style.setProperty('--tilt-translateZ', '35px');
            });
        };

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.18s ease-out';
        });

        card.addEventListener('mousemove', updateTransform);
        card.addEventListener('mouseleave', () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            resetTransform();
        });

        resetTransform();
    });
};

// Hero pointer based parallax
const initHeroParallax = () => {
    const hero = document.querySelector('.hero');
    const scene = document.querySelector('.hero-scene');
    const chips = document.querySelectorAll('.floating-chip');

    if (!hero || !scene) return;

    const chipSettings = Array.from(chips).map((chip, index) => ({
        element: chip,
        depth: parseFloat(chip.dataset.depth || 80),
        speed: parseFloat(chip.dataset.speed || (0.7 + index * 0.18)),
        amplitude: 10 + index * 4,
        phase: index * 0.65
    }));

    const mouseOffset = { x: 0, y: 0 };

    const animateChips = () => {
        const time = performance.now() / 1000;

        chipSettings.forEach(({ element, depth, speed, amplitude, phase }) => {
            const waveX = Math.cos(time * speed + phase) * amplitude;
            const waveY = Math.sin(time * speed + phase) * amplitude;
            const offsetX = waveX + mouseOffset.x * amplitude * 18;
            const offsetY = waveY + mouseOffset.y * amplitude * -18;

            element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${depth}px)`;
        });

        requestAnimationFrame(animateChips);
    };

    animateChips();

    const updateScene = (event) => {
        const rect = hero.getBoundingClientRect();
        const ratioX = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.6, 0.6);
        const ratioY = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.6, 0.6);

        scene.style.transform = `rotateX(${ratioY * -10}deg) rotateY(${ratioX * 14}deg)`;
        mouseOffset.x = ratioX;
        mouseOffset.y = ratioY;
    };

    const resetScene = () => {
        scene.style.transform = 'rotateX(0deg) rotateY(0deg)';
        mouseOffset.x = 0;
        mouseOffset.y = 0;
    };

    hero.addEventListener('mousemove', updateScene);
    hero.addEventListener('mouseleave', resetScene);
    resetScene();
};

// Add ripple effect to buttons
const initButtonRipples = () => {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
};

// Translation System
const translations = {
    es: {
        'meta.title': 'Mi Portafolio - Desarrollador Frontend',
        'hero.eyebrow': 'Frontend • UI Experimenter',
        'hero.greeting': 'Hola, soy',
        'hero.subtitle': 'Desarrollador Frontend apasionado por crear experiencias digitales inmersivas. Con 19 años y varios meses de experiencia estudiando programación, me especializo en interfaces modernas con JavaScript, HTML, CSS y React. Busco transformar ideas en productos web brutalistas, vivos y tridimensionales que eleven la experiencia de usuario.',
        'hero.specialties.label': 'Especialidades',
        'hero.specialties.value': 'React • UI • Animaciones',
        'hero.experience.label': 'Experiencia',
        'hero.experience.value': '6+ meses build mode',
        'hero.viewProjects': 'Ver proyectos',
        'hero.contact': 'Contactar',
        'hero.profile.title': 'Desarrollador Frontend • 19 años',
        'hero.profile.tag': 'Microinteracciones',
        'about.title': 'Sobre mí',
        'about.subtitle': 'Conoce un poco más sobre mi trayectoria',
        'about.description1': 'Soy un desarrollador frontend de 19 años con varios meses de experiencia estudiando programación. Mi pasión por la tecnología me ha llevado a especializarme en el desarrollo de interfaces de usuario modernas y funcionales.',
        'about.description2': 'Me enfoco en crear soluciones web que no solo se vean bien, sino que también ofrezcan una experiencia de usuario excepcional. Mi objetivo es seguir creciendo como desarrollador y contribuir a proyectos innovadores.',
        'about.stat.years': 'Años',
        'about.stat.months': 'Meses estudiando',
        'about.stat.technologies': 'Tecnologías',
        'projects.title': 'Proyectos',
        'projects.subtitle': 'Algunos de mis trabajos destacados',
        'projects.zion.description': 'Agencia de Marketing Digital desarrollada con tecnologías web modernas. Proyecto completo que incluye diseño responsivo, animaciones CSS avanzadas, formularios de contacto funcionales y optimización para motores de búsqueda. Desarrollado colaborativamente con enfoque en UX/UI profesional.',
        'projects.zion.feature1': 'Diseño responsivo',
        'projects.zion.feature2': 'Formularios funcionales',
        'projects.zion.feature3': 'Animaciones CSS',
        'projects.zion.feature4': 'UX/UI profesional',
        'projects.zion.feature5': 'Desarrollo colaborativo',
        'projects.zion.feature6': 'Control de versiones Git',
        'projects.geez.description': 'Experiencia web inmersiva para una agencia cultural europea. Integré un mapa 3D interactivo, animaciones controladas por scroll y consumo de datos en tiempo real para eventos y artistas.',
        'projects.geez.feature1': 'Parallax y cámaras 3D',
        'projects.geez.feature2': 'Dark mode brutalista',
        'projects.geez.feature3': 'Integración con APIs culturales',
        'projects.geez.feature4': 'Optimización de performance',
        'projects.amen.description': 'Plataforma de transmisiones y mentoring para creadores. Construí dashboards 3D, sistema de membresías y automatización de emails personalizados para cada comunidad.',
        'projects.amen.feature1': 'Paneles 3D en tiempo real',
        'projects.amen.feature2': 'Autenticación y roles',
        'projects.amen.feature3': 'Automatización con Supabase',
        'projects.amen.feature4': 'Integración con Stripe',
        'projects.comingSoon.title': 'Próximamente',
        'projects.comingSoon.subtitle': 'Más proyectos en desarrollo',
        'projects.new.title': 'Nuevos Proyectos',
        'projects.new.description': 'Actualmente trabajando en nuevos proyectos que incluirán React, aplicaciones web más complejas y proyectos de desarrollo móvil.',
        'projects.new.feature1': 'En desarrollo',
        'projects.new.feature2': 'React + Node.js',
        'projects.new.feature3': 'Aplicaciones móviles',
        'projects.viewProject': 'Ver Proyecto',
        'projects.code': 'Código',
        'skills.title': 'Habilidades',
        'skills.subtitle': 'Herramientas y lenguajes que utilizo',
        'skills.tools.title': 'Herramientas',
        'skills.languages.title': 'Lenguajes & Frameworks',
        'contact.title': 'Contacto',
        'contact.subtitle': '¿Tienes un proyecto en mente? ¡Hablemos!',
        'footer.rights': 'Todos los derechos reservados.'
    },
    en: {
        'meta.title': 'My Portfolio - Frontend Developer',
        'hero.eyebrow': 'Frontend • UI Experimenter',
        'hero.greeting': 'Hello, I\'m',
        'hero.subtitle': 'Frontend Developer passionate about creating immersive digital experiences. At 19 years old with several months of experience studying programming, I specialize in modern interfaces with JavaScript, HTML, CSS and React. I seek to transform ideas into brutalist, vibrant and three-dimensional web products that elevate the user experience.',
        'hero.specialties.label': 'Specialties',
        'hero.specialties.value': 'React • UI • Animations',
        'hero.experience.label': 'Experience',
        'hero.experience.value': '6+ months build mode',
        'hero.viewProjects': 'View projects',
        'hero.contact': 'Contact',
        'hero.profile.title': 'Frontend Developer • 19 years old',
        'hero.profile.tag': 'Microinteractions',
        'about.title': 'About me',
        'about.subtitle': 'Learn a bit more about my journey',
        'about.description1': 'I am a 19-year-old frontend developer with several months of experience studying programming. My passion for technology has led me to specialize in developing modern and functional user interfaces.',
        'about.description2': 'I focus on creating web solutions that not only look good, but also offer an exceptional user experience. My goal is to continue growing as a developer and contribute to innovative projects.',
        'about.stat.years': 'Years',
        'about.stat.months': 'Months studying',
        'about.stat.technologies': 'Technologies',
        'projects.title': 'Projects',
        'projects.subtitle': 'Some of my featured work',
        'projects.zion.description': 'Digital Marketing Agency developed with modern web technologies. Complete project that includes responsive design, advanced CSS animations, functional contact forms and search engine optimization. Collaboratively developed with a focus on professional UX/UI.',
        'projects.zion.feature1': 'Responsive design',
        'projects.zion.feature2': 'Functional forms',
        'projects.zion.feature3': 'CSS animations',
        'projects.zion.feature4': 'Professional UX/UI',
        'projects.zion.feature5': 'Collaborative development',
        'projects.zion.feature6': 'Git version control',
        'projects.geez.description': 'Immersive web experience for a European cultural agency. I integrated an interactive 3D map, scroll-controlled animations and real-time data consumption for events and artists.',
        'projects.geez.feature1': 'Parallax and 3D cameras',
        'projects.geez.feature2': 'Brutalist dark mode',
        'projects.geez.feature3': 'Integration with cultural APIs',
        'projects.geez.feature4': 'Performance optimization',
        'projects.amen.description': 'Streaming and mentoring platform for creators. I built 3D dashboards, membership system and personalized email automation for each community.',
        'projects.amen.feature1': 'Real-time 3D panels',
        'projects.amen.feature2': 'Authentication and roles',
        'projects.amen.feature3': 'Supabase automation',
        'projects.amen.feature4': 'Stripe integration',
        'projects.comingSoon.title': 'Coming soon',
        'projects.comingSoon.subtitle': 'More projects in development',
        'projects.new.title': 'New Projects',
        'projects.new.description': 'Currently working on new projects that will include React, more complex web applications and mobile development projects.',
        'projects.new.feature1': 'In development',
        'projects.new.feature2': 'React + Node.js',
        'projects.new.feature3': 'Mobile applications',
        'projects.viewProject': 'View Project',
        'projects.code': 'Code',
        'skills.title': 'Skills',
        'skills.subtitle': 'Tools and languages I use',
        'skills.tools.title': 'Tools',
        'skills.languages.title': 'Languages & Frameworks',
        'contact.title': 'Contact',
        'contact.subtitle': 'Have a project in mind? Let\'s talk!',
        'footer.rights': 'All rights reserved.'
    }
};

// Get current language from localStorage or default to Spanish
let currentLang = localStorage.getItem('language') || 'es';

// Function to translate the page
const translatePage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    document.getElementById('html-lang').lang = lang;
    
    // Update title
    document.title = translations[lang]['meta.title'];
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// Initialize language selector
const initLanguageSelector = () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            translatePage(lang);
        });
    });
    
    // Set initial language
    translatePage(currentLang);
};

document.addEventListener('DOMContentLoaded', () => {
    addStaggeredAnimations();
    animateOnScroll();
    initMatrixGlow();
    initTiltCards();
    initHeroParallax();
    initButtonRipples();
    parallaxEffect();
    initLanguageSelector();

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxEffect();
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Inject ripple CSS once
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);