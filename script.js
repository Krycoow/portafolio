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

document.addEventListener('DOMContentLoaded', () => {
    addStaggeredAnimations();
    animateOnScroll();
    initMatrixGlow();
    initTiltCards();
    initHeroParallax();
    initButtonRipples();
    parallaxEffect();

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