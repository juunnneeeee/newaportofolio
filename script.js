/* ==========================================================================
   MONOCHROMATIC BENTO GRID PORTFOLIO SCRIPTS
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initializing Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. Ambient Follow Cursor Glow & Bento Card Border Tracker
       ========================================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    const bentoCards = document.querySelectorAll('.bento-card');

    document.addEventListener('mousemove', (e) => {
        // Move the large background glow
        if (cursorGlow) {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }
    });

    // Provide cards with internal cursor coordinate tracking for CSS hover radial light
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    /* ==========================================================================
       2. Dynamic Timezone Clock (Tokyo / GMT+9)
       ========================================================================== */
    const localTimeEl = document.getElementById('localTime');

    function updateTime() {
        if (!localTimeEl) return;
        const options = {
            timeZone: 'Asia/Tokyo',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        localTimeEl.textContent = formatter.format(new Date());
    }

    updateTime();
    setInterval(updateTime, 1000);

    /* ==========================================================================
       3. Light & Dark Theme Switcher with LocalStorage Persistence
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;

    // Check localStorage or device preference for theme initialization
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        // Default to dark-theme
        body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('portfolio-theme', 'light-theme');
            } else {
                body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('portfolio-theme', 'dark-theme');
            }
        });
    }

    /* ==========================================================================
       4. Bespoke Draggable & Button-Navigated Carousel Slider
       ========================================================================== */
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselProgress = document.getElementById('carouselProgress');
    const carouselViewport = document.getElementById('carouselViewport');
    const slides = document.querySelectorAll('.carousel-slide');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // Update slides position and fill indicator width
    function updateCarousel() {
        if (!carouselTrack || !carouselProgress) return;
        carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        // Update progress bar
        const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;
        carouselProgress.style.width = `${progressPercentage}%`;
    }

    // Initialize progress bar
    updateCarousel();

    if (carouselPrev && carouselNext) {
        carouselPrev.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });

        carouselNext.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateCarousel();
        });
    }

    // Touch and Drag Interactions for Carousel
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    if (carouselViewport) {
        // Mouse Events
        carouselViewport.addEventListener('mousedown', dragStart);
        carouselViewport.addEventListener('mousemove', dragMove);
        carouselViewport.addEventListener('mouseup', dragEnd);
        carouselViewport.addEventListener('mouseleave', dragEnd);

        // Touch Events
        carouselViewport.addEventListener('touchstart', dragStart);
        carouselViewport.addEventListener('touchmove', dragMove);
        carouselViewport.addEventListener('touchend', dragEnd);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function dragStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        carouselTrack.style.transition = 'none'; // Temporarily disable transiton for direct feedback
    }

    function dragMove(event) {
        if (!isDragging) return;
        const currentPositionX = getPositionX(event);
        const diffX = currentPositionX - startX;
        
        // Calculate dynamic drag translation
        const viewportWidth = carouselViewport.offsetWidth;
        const baseTranslate = -currentSlideIndex * viewportWidth;
        const finalTranslate = baseTranslate + diffX;
        
        carouselTrack.style.transform = `translateX(${finalTranslate}px)`;
    }

    function dragEnd(event) {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

        const currentPositionX = event.type.includes('mouse') ? event.pageX : event.changedTouches[0].clientX;
        const diffX = currentPositionX - startX;
        const dragThreshold = 100; // minimal drag pixel width to switch slides

        if (diffX < -dragThreshold && currentSlideIndex < totalSlides - 1) {
            currentSlideIndex += 1;
        } else if (diffX > dragThreshold && currentSlideIndex > 0) {
            currentSlideIndex -= 1;
        }
        
        updateCarousel();
    }

    /* ==========================================================================
       5. Awwwards-style Cursor-Tracking Image Reveal
       ========================================================================== */
    const projectRows = document.querySelectorAll('.project-row');
    const floatingPreview = document.getElementById('floatingPreview');
    const floatingPreviewImg = document.getElementById('floatingPreviewImg');

    let mouseCoords = { x: 0, y: 0 };
    let previewCoords = { x: 0, y: 0 };
    const lerpRate = 0.15; // Fluidity factor (lower = smoother/more lag)

    // Log the current raw mouse coordinates globally
    document.addEventListener('mousemove', (e) => {
        mouseCoords.x = e.clientX;
        mouseCoords.y = e.clientY;
    });

    // Linear interpolation loop to render trailing image follower
    function renderPreviewFollower() {
        if (floatingPreview) {
            previewCoords.x += (mouseCoords.x - previewCoords.x) * lerpRate;
            previewCoords.y += (mouseCoords.y - previewCoords.y) * lerpRate;
            
            floatingPreview.style.left = `${previewCoords.x}px`;
            floatingPreview.style.top = `${previewCoords.y}px`;
        }
        requestAnimationFrame(renderPreviewFollower);
    }
    
    // Start drawing loop
    renderPreviewFollower();

    projectRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const previewSrc = row.getAttribute('data-image');
            if (floatingPreviewImg && previewSrc) {
                floatingPreviewImg.src = previewSrc;
            }
            if (floatingPreview) {
                floatingPreview.classList.add('visible');
            }
        });

        row.addEventListener('mouseleave', () => {
            if (floatingPreview) {
                floatingPreview.classList.remove('visible');
            }
        });
    });

    /* ==========================================================================
       6. Intersection Observer Stat Counter Animations
       ========================================================================== */
    const statValues = document.querySelectorAll('.stat-value');

    const statObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                const targetValue = parseInt(targetEl.getAttribute('data-count'), 10);
                let currentVal = 0;
                const duration = 1500; // total animation time in ms
                const intervalTime = 30; // ms per step
                const totalSteps = duration / intervalTime;
                const increment = targetValue / totalSteps;

                const counterTimer = setInterval(() => {
                    currentVal += increment;
                    if (currentVal >= targetValue) {
                        targetEl.textContent = targetValue + (targetValue === 100 ? '%' : '+');
                        clearInterval(counterTimer);
                    } else {
                        targetEl.textContent = Math.ceil(currentVal);
                    }
                }, intervalTime);

                observer.unobserve(targetEl); // Trigger once
            }
        });
    }, statObserverOptions);

    statValues.forEach(stat => {
        statObserver.observe(stat);
    });

    /* ==========================================================================
       7. Interactive Contact Email Copy Clipboard Widget
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailText = document.getElementById('emailText');
    const copyIcon = document.getElementById('copyIcon');

    if (copyEmailBtn && emailText && copyIcon) {
        const originalText = emailText.textContent;
        
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(originalText)
                .then(() => {
                    // Update state to success feedback
                    copyEmailBtn.classList.add('copied');
                    emailText.textContent = 'COPIED TO CLIPBOARD!';
                    
                    // Re-render check icon temporarily
                    copyIcon.setAttribute('data-lucide', 'check');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }

                    // Reset button back to original state
                    setTimeout(() => {
                        copyEmailBtn.classList.remove('copied');
                        emailText.textContent = originalText;
                        copyIcon.setAttribute('data-lucide', 'copy');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }, 2000);
                })
                .catch(err => {
                    console.error('Clipboard copy failed: ', err);
                });
        });
    }
});
