document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Logic ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 1500); // Premium pause
        });
    }

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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

    // Create Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/Hide Back to Top Button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar .uppertab a, .mobile-nav-links a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
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

    // --- Magnetic Button Effect (Disabled on Touch) ---
    if (!isTouchDevice) {
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
    }

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

    // --- Elite Mouse Parallax for About Hero (Disabled on Touch) ---
    const aboutHero = document.querySelector('.about-hero');
    if (aboutHero && !isTouchDevice) {
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

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoPlay);
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetAutoPlay();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
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

    // --- Celebratory About Popup Logic (Powered by canvas-confetti) ---
    window.typeBirthdayTagline = () => {
        const text = "Innovation, Trust and Quality";
        const el = document.getElementById('birthdayTypewriter');
        if (!el) return;

        el.innerText = "";
        let i = 0;

        const type = () => {
            if (i < text.length) {
                el.innerText += text.charAt(i);
                i++;
                setTimeout(type, 60); // Type speed
            }
        };
        type();
    };

    window.triggerAboutCelebration = () => {

        const modal = document.getElementById('brandModal');
        if (!modal || modal.classList.contains('active')) return;

        // No confetti on home page as per request
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('shirji-bhen-MKR-care/');
        if (!isHomePage) {
            startContinuousConfetti();
        }

        modal.classList.add('active');
        setTimeout(window.typeBirthdayTagline, 300);
    };

    window.navigateToAbout = () => {
        sessionStorage.setItem('founderMessageSeenOnEntry', 'true');
        window.location.href = 'about.html';
    };

    window.closeAboutModal = () => {
        const modal = document.getElementById('brandModal');
        if (modal) {
            modal.classList.remove('active');
            stopContinuousConfetti();
        }
    };

    // Auto-trigger on About Page entry
    if (window.location.pathname.includes('about.html')) {
        // Reduced delay for better UX and visibility
        setTimeout(() => {
            triggerAboutCelebration();
        }, 1000); // 1 second delay
    }

    // --- Legacy Typewriter Trigger (Normal Screen) ---
    const legacySection = document.querySelector('.legacy-celebration');
    if (legacySection) {
        const legacyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(window.typeBirthdayTagline, 500);
                    legacyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        legacyObserver.observe(legacySection);
    }
    // --- Scroll Progress Bar ---
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // --- Sidebar Scroll-Spy (Oral Care Page) ---
    if (window.location.pathname.includes('oral.html')) {
        const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
        const sections = document.querySelectorAll('section[id]');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    sidebarLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        const spyObserver = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => spyObserver.observe(section));
    }

    // --- Tilt Interaction for Content Images (Disabled on Touch) ---
    if (!isTouchDevice) {
        const contentImages = document.querySelectorAll('.content-img, .highlight-img, .nutrition-img');
        contentImages.forEach(img => {
            img.addEventListener('mousemove', (e) => {
                const rect = img.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }
    // --- Owner Modal & Continuous Confetti Logic ---
    let confettiInterval;

    window.startContinuousConfetti = () => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        confettiInterval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            // We want it to be truly continuous until closed, so we don't strictly stop based on timeLeft
            // but we use timeLeft to vary the intensity if we want. For now, let's just keep it going.

            confetti({
                ...defaults,
                particleCount: 5,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#C5A059', '#FFE4E1', '#FFF5F7', '#FFD1DC', '#D4AF37']
            });
            confetti({
                ...defaults,
                particleCount: 5,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#C5A059', '#FFE4E1', '#FFF5F7', '#FFD1DC', '#D4AF37']
            });
        }, 200);
    };

    window.stopContinuousConfetti = () => {
        if (confettiInterval) {
            clearInterval(confettiInterval);
        }
    };

    // --- Distributor Form Validation ---
    const partnerForm = document.querySelector('.partner-form');
    if (partnerForm) {
        partnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = partnerForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerText;

            // Simple validation feedback
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your interest! Our team will contact you shortly.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                partnerForm.reset();
            }, 1500);
        });
    }

    // --- Glow-Path Timeline Scroll Logic ---
    const timelineWrapper = document.querySelector('.glow-timeline-wrapper');
    const timelineLine = document.querySelector('.timeline-glow-line');
    const milestoneItems = document.querySelectorAll('.milestone-item');

    if (timelineWrapper && timelineLine) {
        window.addEventListener('scroll', () => {
            const rect = timelineWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the timeline is scrolled into view
            let scrollPercent = 0;
            if (rect.top < windowHeight) {
                const totalHeight = rect.height;
                const distanceScrolled = windowHeight - rect.top;
                scrollPercent = Math.min(100, Math.max(0, (distanceScrolled / totalHeight) * 100));
            }
            timelineWrapper.style.setProperty('--scroll-percent', `${scrollPercent}%`);

            // Active milestone pulsing
            milestoneItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < windowHeight * 0.7 && itemRect.bottom > windowHeight * 0.3) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    }

    // --- Liquid Product Archive Filtering ---
    window.filterElite = (category, event) => {
        const grid = document.getElementById('elite-product-list');
        if (!grid) return;

        const cards = grid.querySelectorAll('.elite-product-card');
        const buttons = document.querySelectorAll('.filter-luxury-btn');
        const slider = document.querySelector('.filter-aura-slider');

        // Move the slider
        if (event && slider) {
            const btn = event.currentTarget;
            slider.style.width = `${btn.offsetWidth}px`;
            slider.style.left = `${btn.offsetLeft}px`;
        }

        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        if (event) event.currentTarget.classList.add('active');

        // Liquid Transition
        cards.forEach((card) => {
            card.classList.add('liquid-exit');

            setTimeout(() => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.remove('liquid-exit');
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 400);
        });
    };

    // Initialize Filter Slider position on Products page
    if (window.location.pathname.includes('products.html')) {
        setTimeout(() => {
            const activeBtn = document.querySelector('.filter-luxury-btn.active');
            const slider = document.querySelector('.filter-aura-slider');
            if (activeBtn && slider) {
                slider.style.width = `${activeBtn.offsetWidth}px`;
                slider.style.left = `${activeBtn.offsetLeft}px`;
            }
        }, 500);
    }
});

// Blog Category Filtering
document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.textContent;

            blogCards.forEach(card => {
                const tag = card.querySelector('.blog-tag').textContent;
                if (category === 'All Articles' || tag === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
});
