document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- Typewriter Effect ---
    const typeElements = document.querySelectorAll('.typewriter-trigger');
    const typeCycle = (el) => {
        const texts = JSON.parse(el.getAttribute('data-texts'));
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const handleTyping = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                el.innerText = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                el.innerText = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before next
            }

            setTimeout(handleTyping, typeSpeed);
        };

        handleTyping();
    };

    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeCycle(entry.target);
                typeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    typeElements.forEach(el => typeObserver.observe(el));

    // --- Dynamic Navbar Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = () => {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    };

    if (hamburger) hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // --- Magnetic Button Effect ---
    const magneticBtns = document.querySelectorAll('.btn, .buy-btn, .filter-btn, .carousel-nav-btn, .filter-tab');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // --- Counter Animation for About Page ---
    const counters = document.querySelectorAll('.stat-number, .stat-vibe .number');
    const runCounter = (el) => {
        const text = el.innerText;
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        let count = 0;
        const duration = 2000; // 2 seconds
        const steps = 50;
        const increment = target / steps;
        const interval = duration / steps;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                el.innerText = Math.ceil(count) + suffix;
                setTimeout(updateCount, interval);
            } else {
                el.innerText = target + suffix;
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // --- Elite Mouse Parallax for About Hero ---
    const aboutHero = document.querySelector('.about-hero');
    if (aboutHero) {
        const heroImg = aboutHero.querySelector('.hero-image');
        aboutHero.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
            if (heroImg) {
                heroImg.style.transform = `translate(${xPos}px, ${yPos}px) scale(1.05)`;
            }
        });

        aboutHero.addEventListener('mouseleave', () => {
            if (heroImg) {
                heroImg.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    }

    // --- 3D Infinite Carousel Logic (Enhanced with Stochastic Filtering) ---
    const carousels = document.querySelectorAll('.carousel-3d-section');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-3d-track');
        let allItems = Array.from(carousel.querySelectorAll('.carousel-3d-item'));
        const prevBtn = carousel.querySelector('.prev-3d');
        const nextBtn = carousel.querySelector('.next-3d');
        const dotContainer = carousel.querySelector('.carousel-dots');
        const filterTabs = carousel.querySelectorAll('.filter-tab');

        if (!track || allItems.length === 0) return;

        let currentIndex = 0;
        let visibleItems = [...allItems];
        let autoPlay;

        function updateCarousel() {
            visibleItems.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'prev-hidden', 'next-hidden', 'shuffling');

                if (index === currentIndex) {
                    item.classList.add('active');
                } else if (index === (currentIndex - 1 + visibleItems.length) % visibleItems.length) {
                    item.classList.add('prev');
                } else if (index === (currentIndex + 1) % visibleItems.length) {
                    item.classList.add('next');
                } else {
                    const diff = index - currentIndex;
                    if (diff < 0 || (currentIndex === 0 && index === visibleItems.length - 1)) {
                        item.classList.add('prev-hidden');
                    } else {
                        item.classList.add('next-hidden');
                    }
                }
            });

            if (dotContainer) {
                dotContainer.innerHTML = '';
                visibleItems.forEach((_, i) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === currentIndex) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateCarousel();
                        resetAutoPlay();
                    });
                    dotContainer.appendChild(dot);
                });
            }
        }

        function filterCategory(category) {
            carousel.setAttribute('data-theme', category);

            // Random Shuffle Animation Initiation
            visibleItems.forEach(item => item.classList.add('shuffling'));

            setTimeout(() => {
                visibleItems = allItems.filter(item => {
                    const match = category === 'all' || item.getAttribute('data-category') === category;
                    if (match) {
                        item.classList.remove('filtered-out');
                    } else {
                        item.classList.add('filtered-out');
                    }
                    return match;
                });

                currentIndex = 0;
                updateCarousel();

                // Entrance animation for visible items
                visibleItems.forEach((item, i) => {
                    item.style.animationDelay = `${i * 0.1}s`;
                });
            }, 300);
        }

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterCategory(tab.getAttribute('data-filter'));
            });
        });

        const nextSlide = () => {
            if (visibleItems.length === 0) return;
            currentIndex = (currentIndex + 1) % visibleItems.length;
            updateCarousel();
        };

        const prevSlide = () => {
            if (visibleItems.length === 0) return;
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            updateCarousel();
        };

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

        function resetAutoPlay() {
            clearInterval(autoPlay);
            autoPlay = setInterval(nextSlide, 3500);
        }

        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => resetAutoPlay());

        // Page-specific initialization
        const pageCategory = document.body.getAttribute('data-page-category');
        if (pageCategory) {
            // Wait for items to be ready
            setTimeout(() => {
                const targetTab = Array.from(filterTabs).find(t => t.getAttribute('data-filter') === pageCategory);
                if (targetTab) targetTab.click();
            }, 100);
        }

        resetAutoPlay();
        updateCarousel();
    });

    // --- Hero Product Fan-Out Auto-Cycle ---
    const fanOutContainer = document.querySelector('.product-fan-out');
    if (fanOutContainer) {
        const items = fanOutContainer.querySelectorAll('.fan-item');
        let currentFeaturedIndex = 0;
        let cycleInterval;

        const cycleFeatured = () => {
            items.forEach(item => item.classList.remove('is-featured'));
            items[currentFeaturedIndex].classList.add('is-featured');
            currentFeaturedIndex = (currentFeaturedIndex + 1) % items.length;
        };

        const startCycle = () => {
            if (cycleInterval) clearInterval(cycleInterval);
            cycleInterval = setInterval(cycleFeatured, 4000); // Relaxed 4s timing
            cycleFeatured(); // Trigger first one immediately
        };

        const stopCycle = () => {
            clearInterval(cycleInterval);
            items.forEach(item => item.classList.remove('is-featured'));
        };

        // Start cycling once the container is active/visible
        const fanObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCycle();
                } else {
                    stopCycle();
                }
            });
        }, { threshold: 0.1 });

        fanObserver.observe(fanOutContainer);
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- Footer Reveal Observer ---
    const footerColumns = document.querySelectorAll('.footer-column');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay based on index for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 150);
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    footerColumns.forEach(column => footerObserver.observe(column));

    // --- Celebratory About Popup Logic ---
    window.createConfetti = () => {
        const container = document.getElementById('confettiContainer');
        if (!container) return;

        const colors = ['#C5A059', '#FFE4E1', '#FFF5F7', '#FFD1DC', '#D4AF37', '#F4DCA1', '#E6E6FA'];
        const particlesPerSide = 125;

        const spawnParticles = (isLeft) => {
            for (let i = 0; i < particlesPerSide; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti-particle');

                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 6 + 4;
                const isCircle = Math.random() > 0.5;

                confetti.style.backgroundColor = color;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                if (isCircle) confetti.style.borderRadius = '50%';

                confetti.style.bottom = '-10px';
                confetti.style.left = isLeft ? '-10px' : 'auto';
                confetti.style.right = isLeft ? 'auto' : '-10px';

                const rndX = Math.random();
                const rndY = Math.random();
                const rndR = (Math.random() - 0.5) * 1440;

                confetti.style.setProperty('--rnd-x', rndX);
                confetti.style.setProperty('--rnd-y', rndY);
                confetti.style.setProperty('--rnd-r', `${rndR}deg`);

                const duration = 1.5 + Math.random() * 2.5;
                const delay = Math.random() * 0.4;
                confetti.style.animation = `${isLeft ? 'confettiBurstLeft' : 'confettiBurstRight'} ${duration}s ${delay}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;

                container.appendChild(confetti);
                setTimeout(() => confetti.remove(), (duration + delay) * 1000);
            }
        };

        spawnParticles(true);
        spawnParticles(false);
    };

    window.triggerAboutCelebration = (e) => {
        if (e) e.preventDefault();
        createConfetti();
        setTimeout(() => {
            const modal = document.getElementById('brandModal');
            if (modal) modal.classList.add('active');
        }, 500);
    };

    window.closeAboutModal = () => {
        const modal = document.getElementById('brandModal');
        if (modal) modal.classList.remove('active');
    };

    // Attach to About links
    document.querySelectorAll('a[href="about.html"], .split-narrative').forEach(el => {
        el.addEventListener('click', (e) => {
            // Only trigger if we are on the about page or the element is the narrative section
            if (window.location.pathname.includes('about.html') || el.classList.contains('split-narrative')) {
                triggerAboutCelebration(e);
            }
        });
    });

    // --- Auto-Trigger on About Page Load ---
    if (window.location.pathname.includes('about.html')) {
        // Delay slightly for visual impact after entrance animations
        setTimeout(() => {
            if (window.createConfetti) createConfetti();
        }, 800);
    }
});
