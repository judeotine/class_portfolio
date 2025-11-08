(function() {
    'use strict';
    const nav = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const yearElement = document.getElementById('year');

    function init() {
        updateYear();
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initActiveNavigation();
        initFormValidation();
        initHeaderScroll();
        initBackToTop();
        initTestimonialsCarousel();
    }

    function updateYear() {
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    function initMobileMenu() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = nav.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px 100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        const animatedElements = document.querySelectorAll(
            '.portfolio-card, .service-card, .timeline__item, .tech-item, .testimonial-card, .article-card'
        );
        
        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            const container = el.closest('.portfolio__grid, .services__grid, .timeline, .tech-stack-categories, .articles__grid');
            if (container) {
                const siblings = Array.from(container.children);
                const itemIndex = siblings.indexOf(el);
                el.style.transitionDelay = `${Math.min(itemIndex * 0.05, 0.3)}s`;
            }
            observer.observe(el);
        });
    }

    function initActiveNavigation() {
        function updateActiveNav() {
            const scrollY = window.pageYOffset;
            const headerHeight = nav.offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveNav();
                    ticking = false;
                });
                ticking = true;
            }
        });

        updateActiveNav();
    }

    function initHeaderScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
            
            lastScroll = currentScroll;
        });
    }

    function initTestimonialsCarousel() {
        const track = document.getElementById('testimonials-track');
        const prevBtn = document.getElementById('testimonials-prev');
        const nextBtn = document.getElementById('testimonials-next');
        const indicatorsContainer = document.getElementById('testimonials-indicators');
        
        if (!track || !prevBtn || !nextBtn) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let autoPlayInterval = null;

        function createIndicators() {
            if (!indicatorsContainer) return;
            
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const indicator = document.createElement('button');
                indicator.className = 'testimonials__indicator';
                if (i === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }

        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.testimonials__indicator');
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        function goToSlide(index) {
            if (index < 0 || index >= totalCards) return;
            
            currentIndex = index;
            track.scrollTo({
                left: cards[index].offsetLeft,
                behavior: 'smooth'
            });
            
            updateIndicators();
            updateButtons();
        }

        function updateButtons() {
        }

        function nextSlide() {
            if (currentIndex < totalCards - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(totalCards - 1);
            }
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });

        const carousel = track.closest('.testimonials__carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }

        track.addEventListener('scroll', () => {
            const scrollPosition = track.scrollLeft;
            const cardWidth = cards[0].offsetWidth;
            const newIndex = Math.round(scrollPosition / cardWidth);
            
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalCards) {
                currentIndex = newIndex;
                updateIndicators();
                updateButtons();
            }
        });

        createIndicators();
        updateButtons();
        startAutoPlay();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });
    }

    function initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;

        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    toggleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        });

        toggleBackToTop();
    }

    function initFormValidation() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const phone = formData.get('phone').trim();
            const message = formData.get('message').trim();
            const company = formData.get('company')?.trim() || '';

            formMessage.className = 'form__message';
            formMessage.textContent = '';

            let isValid = true;
            let errorMessage = '';

            if (!name || name.length < 2) {
                isValid = false;
                errorMessage = 'Please enter a valid name (at least 2 characters).';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            } else if (!isValidPhone(phone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            } else if (!message || message.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a message (at least 10 characters).';
            }

            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const formDataToSend = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    return response.json().then(data => {
                        if (data.errors) {
                            showFormMessage(data.errors.map(error => error.message).join(', '), 'error');
                        } else {
                            showFormMessage('There was a problem sending your message. Please try again.', 'error');
                        }
                    });
                }
            })
            .catch(error => {
                showFormMessage('There was a problem sending your message. Please try again later.', 'error');
                console.error('Form submission error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });

        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });

            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        field.classList.remove('error');

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
        } else if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
        } else if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
        }

        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = 'var(--color-error)';
        } else {
            field.style.borderColor = '';
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form__message ${type}`;
        formMessage.style.display = 'block';

        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            });
        } else {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });

        if (navMenu) {
            const focusableElements = navMenu.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            navMenu.addEventListener('keydown', function(e) {
                if (!navMenu.classList.contains('active')) return;

                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }

    function initPerformanceOptimizations() {
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function() {
                if (originalScrollHandler) {
                    originalScrollHandler();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initLazyLoading();
            initKeyboardNavigation();
            initPerformanceOptimizations();
        });
    } else {
        init();
        initLazyLoading();
        initKeyboardNavigation();
        initPerformanceOptimizations();
    }

    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });

})();

