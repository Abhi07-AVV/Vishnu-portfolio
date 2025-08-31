// Portfolio Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = 80; // Account for fixed header
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Skills 3D Cloud Positioning
    function initSkillsCloud() {
        const skillsCloud = document.querySelector('.skills-cloud');
        const skillItems = document.querySelectorAll('.skill-item');
        
        if (!skillsCloud || skillItems.length === 0) return;
        
        const cloudRect = skillsCloud.getBoundingClientRect();
        const centerX = cloudRect.width / 2;
        const centerY = cloudRect.height / 2;
        const radius = Math.min(150, Math.min(centerX, centerY) - 50);
        
        skillItems.forEach((item, index) => {
            const angle = (index / skillItems.length) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * radius - item.offsetWidth / 2;
            const y = centerY + Math.sin(angle) * radius - item.offsetHeight / 2;
            const z = Math.sin(angle * 2) * 50;
            
            item.style.left = x + 'px';
            item.style.top = y + 'px';
            item.style.transform = `translateZ(${z}px)`;
            item.style.setProperty('--z-pos', z + 'px');
            
            // Add floating animation with different delays
            item.style.animation = `skillFloat 6s ease-in-out infinite`;
            item.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Add CSS for skill floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes skillFloat {
            0%, 100% { 
                transform: translateZ(var(--z-pos, 0px)) translateY(0px) rotateX(0deg); 
            }
            50% { 
                transform: translateZ(var(--z-pos, 0px)) translateY(-10px) rotateX(5deg); 
            }
        }
    `;
    document.head.appendChild(style);

    // Scroll-based animations and effects
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Update CSS custom property for scroll-based animations
        document.documentElement.style.setProperty('--scroll-y', scrollY + 'px');
        
        // Hero section parallax and 3D cube rotation
        const hero = document.querySelector('.hero');
        const cube = document.querySelector('.cube');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && cube) {
            const heroRect = hero.getBoundingClientRect();
            const scrollPercent = Math.max(0, Math.min(1, -heroRect.top / windowHeight));
            
            // Rotate cube based on scroll
            const baseRotation = scrollPercent * 180;
            cube.style.transform = `rotateX(${baseRotation}deg) rotateY(${baseRotation * 1.5}deg)`;
            
            // Fade out hero content on scroll
            if (heroContent) {
                heroContent.style.opacity = Math.max(0, 1 - scrollPercent * 2);
                heroContent.style.transform = `translateY(${scrollPercent * 100}px)`;
            }
        }
        
        // Animate elements on scroll into view
        const animatedElements = document.querySelectorAll('.about-bio, .project-card, .skills-title');
        animatedElements.forEach(element => {
            const elementRect = element.getBoundingClientRect();
            const elementTop = elementRect.top;
            const elementVisible = elementTop < windowHeight - 100;
            
            if (elementVisible && !element.classList.contains('animate-in')) {
                element.classList.add('animate-in');
                element.style.animation = 'slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            }
        });
        
        // Update navigation active state
        updateActiveNavLink();
    }

    // Add slide in animation
    const slideInStyle = document.createElement('style');
    slideInStyle.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .about-bio,
        .project-card,
        .skills-title {
            opacity: 0;
        }
        
        .animate-in {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(slideInStyle);

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Project cards enhanced interaction - removed problematic mouse tilt
    function initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            // Simple hover effect without conflicting with CSS flip
            card.addEventListener('mouseenter', function() {
                // Add a subtle glow effect
                this.style.filter = 'drop-shadow(0 20px 60px rgba(107, 70, 193, 0.4))';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.filter = 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))';
            });
        });
    }

    // Contact form handling
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                // Basic validation
                if (!name || !email || !message) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Simulate form submission
                const submitBtn = this.querySelector('.btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Message sent successfully!', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add notification styles
        const notificationStyle = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        
        notification.style.cssText = notificationStyle;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
        } else {
            notification.style.background = 'linear-gradient(45deg, var(--portfolio-gradient-start), var(--portfolio-gradient-end))';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Skills cloud interaction
    function initSkillsInteraction() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Pause floating animation and add hover effect
                this.style.animationPlayState = 'paused';
                
                // Add glow effect to other skills
                skillItems.forEach(otherItem => {
                    if (otherItem !== this) {
                        otherItem.style.opacity = '0.3';
                        otherItem.style.filter = 'blur(1px)';
                    }
                });
            });
            
            item.addEventListener('mouseleave', function() {
                // Resume animation
                this.style.animationPlayState = 'running';
                
                // Remove effects from other skills
                skillItems.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                    otherItem.style.filter = 'none';
                });
            });
        });
    }

    // Parallax effect for background elements
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-background, .about');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Navigation background opacity based on scroll
    function updateNavigation() {
        const nav = document.querySelector('.nav');
        const scrollY = window.scrollY;
        
        if (nav) {
            const opacity = Math.min(0.95, Math.max(0.8, scrollY / 100));
            nav.style.background = `rgba(26, 26, 46, ${opacity})`;
        }
    }

    // Throttle scroll events for better performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize all functionality
    function init() {
        initSkillsCloud();
        initProjectCards();
        initContactForm();
        initSkillsInteraction();
        
        // Add scroll event listeners with throttling
        const throttledScrollHandler = throttle(() => {
            handleScroll();
            updateNavigation();
            initParallaxEffects();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', throttledScrollHandler);
        
        // Handle window resize
        window.addEventListener('resize', throttle(() => {
            initSkillsCloud();
        }, 250));
        
        // Initial calls
        handleScroll();
        updateNavigation();
        
        // Add loading animation completion
        document.body.classList.add('loaded');
    }

    // Add loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body:not(.loaded) * {
            animation-play-state: paused !important;
        }
        
        body.loaded {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(loadingStyle);

    // Initialize everything
    init();

    // Add some visual enhancements
    const enhancementStyle = document.createElement('style');
    enhancementStyle.textContent = `
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--portfolio-bg);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, var(--portfolio-gradient-start), var(--portfolio-gradient-end));
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            opacity: 0.8;
        }
        
        /* Selection styling */
        ::selection {
            background: var(--portfolio-accent);
            color: white;
        }
        
        /* Focus styles for accessibility */
        *:focus-visible {
            outline: 2px solid var(--portfolio-accent);
            outline-offset: 2px;
        }
        
        /* Smooth transitions for all interactive elements */
        button, a, .skill-item, .project-card, .social-link {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Enhanced project card effects */
        .project-card {
            filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
    `;
    document.head.appendChild(enhancementStyle);
    
});

// Additional utility functions for enhanced user experience
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Preload critical images and resources
function preloadResources() {
    const imagesToPreload = [];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload on page load
window.addEventListener('load', preloadResources);