document.addEventListener('DOMContentLoaded', () => {
    
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
});
