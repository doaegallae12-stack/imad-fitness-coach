document.addEventListener('DOMContentLoaded', () => {

    // 0. Particle Background Animation
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle { constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(57, 255, 20, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(57, 255, 20, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            animationId = requestAnimationFrame(animate);
        }

        init();
        animate();
    }

    // 1. Mobile Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. WhatsApp Dynamic Link Generation
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const goalSelect = document.getElementById('goal');

    function updateWhatsAppLink() {
        const goal = goalSelect.value;
        const phone = '212721587115';
        const message = encodeURIComponent(`Hi Imad, I just checked your website and I'm interested in starting the ${goal} program. Let's work!`);
        whatsappBtn.href = `https://wa.me/${phone}?text=${message}`;
    }

    goalSelect.addEventListener('change', updateWhatsAppLink);
    updateWhatsAppLink(); // Init

    // 5. Form Submission Simulation
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const btn = contactForm.querySelector('button[type="submit"]');

        // Visual feedback
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.style.background = '#00C851';
            btn.innerText = `Thanks, ${name}! I'll contact you soon.`;
            contactForm.reset();

            setTimeout(() => {
                btn.style.background = '';
                btn.innerText = originalText;
                btn.disabled = false;
            }, 5000);
        }, 1500);
    });

    // 6. Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-target'));
                animateCount(target, value);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    function animateCount(el, target) {
        let current = 0;
        const duration = 2000;
        const start = performance.now();
        const prefix = el.innerText.includes('+') ? '+' : (el.innerText.includes('-') ? '-' : '');
        const suffix = el.innerText.includes('%') ? '%' : '';

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(easedProgress * target);

            el.innerText = `${prefix}${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = `${prefix}${target}${suffix}`;
            }
        }
        requestAnimationFrame(update);
    }

    document.querySelectorAll('.stat-value').forEach(stat => statsObserver.observe(stat));

    // 7. Before/After Slider Interaction
    const sliderContainer = document.querySelector('.comparison-container');
    const sliderHandle = document.querySelector('.slider-handle');
    const afterImg = document.querySelector('.img-after');

    if (sliderContainer && sliderHandle && afterImg) {
        const moveSlider = (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - rect.left;

            // Constrain
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percent = (x / rect.width) * 100;

            sliderHandle.style.left = `${percent}%`;
            afterImg.style.clipPath = `inset(0 0 0 ${percent}%)`;
        };

        sliderContainer.addEventListener('mousemove', moveSlider);
        sliderContainer.addEventListener('touchmove', (e) => {
            if (e.cancelable) e.preventDefault();
            moveSlider(e);
        }, { passive: false });
    }

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 9. Parallax Effect for Hero Section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = heroSection.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    // 10. Smooth Reveal Animation with Stagger Effect
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe grid containers for staggered animations
    document.querySelectorAll('.services-grid, .matrix-grid, .testimonials-grid, .pricing-grid, .gallery-grid').forEach(grid => {
        staggerObserver.observe(grid);
    });

    // 11. Tilt Effect on Cards
    const cards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // 12. Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #39FF14, #2db50f);
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });

    // 13. Add Ripple Effect to Buttons
    const buttons = document.querySelectorAll('.neon-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(57, 255, 20, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation to CSS dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // 14. Animate Hero Buttons on Hover
    const heroButtons = document.querySelectorAll('.hero-buttons .neon-btn');
    heroButtons.forEach((btn, index) => {
        btn.addEventListener('mouseenter', () => {
            btn.style.animation = 'scaleIn 0.3s ease-out';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.animation = '';
        });
    });

    // 15. Create Animated Green Dots
    function createAnimatedDots() {
        const dotsCount = 20;
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            
            dot.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(57, 255, 20, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${startX}px;
                top: ${startY}px;
                pointer-events: none;
                z-index: -1;
                animation: moveDot${i} ${duration}s ease-in-out ${delay}s infinite;
                box-shadow: 0 0 ${size * 2}px rgba(57, 255, 20, 0.3);
            `;
            
            document.body.appendChild(dot);
            
            // Create unique animation for each dot
            const style = document.createElement('style');
            const endX = Math.random() * window.innerWidth;
            const endY = Math.random() * window.innerHeight;
            const midX = Math.random() * window.innerWidth;
            const midY = Math.random() * window.innerHeight;
            
            style.textContent = `
                @keyframes moveDot${i} {
                    0% {
                        transform: translate(0, 0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    50% {
                        transform: translate(${midX - startX}px, ${midY - startY}px);
                        opacity: 0.6;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${endX - startX}px, ${endY - startY}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createAnimatedDots();
});
