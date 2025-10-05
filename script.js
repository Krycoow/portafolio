// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate skill bars on scroll
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
};

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-card, .about-text, .contact-item, .project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Download CV functionality
const downloadCV = () => {
    // Create a simple CV content (you can replace this with actual CV data)
    const cvContent = `
DANIEL DOS SANTOS
DESARROLLADOR FRONTEND

Información Personal:
- Nombre: Daniel Dos Santos
- Edad: 19 años
- Ubicación: [Tu ubicación]
- Email: [Tu email]
- Teléfono: [Tu teléfono]

Resumen Profesional:
Desarrollador frontend apasionado con varios meses de experiencia estudiando programación. 
Especializado en crear interfaces de usuario modernas y funcionales utilizando tecnologías 
como JavaScript, HTML, CSS y React. Mi objetivo es transformar ideas creativas en soluciones 
web funcionales y atractivas que brinden una experiencia de usuario excepcional.

Habilidades Técnicas:
- JavaScript (Intermedio)
- HTML5 (Avanzado)
- CSS3 (Intermedio)
- React (Intermedio)
- Kotlin (Básico)
- Visual Studio Code (Experto)

Educación:
- Autodidacta en desarrollo frontend
- Cursos online en programación web
- Práctica continua en proyectos personales

Proyectos:
- Agencia de Marketing Digital (Zion Marketing) - GitHub: github.com/Krycoow/Agencia-De-Marketing
- Portafolio personal (este sitio web)
- [Agrega tus otros proyectos aquí]

Contacto:
- Email: [Tu email]
- LinkedIn: [Tu LinkedIn]
- GitHub: [Tu GitHub]
    `;

    // Create and download the CV file
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV_Desarrollador_Frontend.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

// Add click event to download CV button
document.getElementById('download-cv').addEventListener('click', (e) => {
    e.preventDefault();
    downloadCV();
});

// Message storage system
const saveMessage = (name, email, message) => {
    const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    const newMessage = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        date: new Date().toLocaleString('es-ES'),
        read: false
    };
    messages.push(newMessage);
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));
    return newMessage;
};

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        // Save message
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            saveMessage(name, email, message);
            alert('¡Mensaje enviado! Te contactaré pronto.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Update message counter if admin panel exists
            updateMessageCounter();
        }, 2000);
    });
}

// Parallax effect for hero section
const parallaxEffect = () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
};

// Typing animation for code lines
const typingAnimation = () => {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.animation = 'typing 2s ease-in-out infinite';
        }, index * 500);
    });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateSkillBars();
    animateOnScroll();
    typingAnimation();
    
    // Add scroll event listener for parallax
    window.addEventListener('scroll', parallaxEffect);
    
    // Add scroll event listener for navbar background
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
});

// Add hover effects to skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
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
