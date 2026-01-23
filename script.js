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
    const counters = document.querySelectorAll('.stat-number');
    const runCounter = (el) => {
        const target = parseInt(el.innerText);
        let count = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (count < target) {
                count += increment;
                el.innerText = Math.ceil(count) + (el.id === 'experience-counter' ? '+' : '');
                setTimeout(updateCount, 40);
            } else {
                el.innerText = target + (el.id === 'experience-counter' ? '+' : '');
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
});
