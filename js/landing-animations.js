// Register GSAP ScrollTrigger Plugin
gsap.registerPlugin(ScrollTrigger);

const styleElement = document.createElement('style');
styleElement.textContent = `
    .feature-card {
        visibility: hidden;
    }
    .feature-card.gsap-initialized {
        visibility: visible;
    }
`;
document.head.appendChild(styleElement);

// Mouse tracking variables
let mouseX = 0;
let mouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Hero Section Animations
function initHeroAnimations() {
    // Create timeline for letters animation
    const timeline = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // Animate each letter
    const letters = document.querySelectorAll('#hero-title .letter');
    letters.forEach((letter, index) => {
        timeline.to(letter, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            delay: index * 0.1 // Delay each letter for typing effect
        }, index * 0.1); // Start each animation after delay
    });

    // Animate tagline after letters
    timeline.to("#hero-tagline", {
        y: 50,
        opacity: 1,
        duration: 1.5
    });

    // Video scroll animation
    gsap.to(".background-video-container", {
        scrollTrigger: {
            trigger: ".features-section",
            start: "top bottom", // Start when features section hits bottom of viewport
            end: "top top", // End when features section reaches top of viewport
            scrub: 1, // Smooth scrubbing
            //    markers: true // Remove this in production, helpful for debugging
        },
        y: "0", // This ensures video stays in view
        scale: 1, // Optional: slight scale effect
        opacity: 1 // Optional: slight fade effect
    });

    // Orb animations
    const orb1 = document.querySelector('.orb-1');
    gsap.to(orb1, {
        duration: 0.2,
        repeat: -1,
        repeatRefresh: true,
        onUpdate: function () {
            const orbRect = orb1.getBoundingClientRect();
            const maxX = window.innerWidth - orbRect.width;
            const maxY = window.innerHeight - orbRect.height;
            const targetX = mouseX - (orbRect.width / 2);
            const targetY = mouseY - (orbRect.height / 2);

            gsap.to(orb1, {
                x: targetX,
                y: targetY,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    // Orb-2 animation
    gsap.to(".orb-2", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        },
        y: 100,
        x: 50
    });
}




function initFeaturesAnimations() {
    // 3. Get all our feature cards
    const cards = gsap.utils.toArray('.feature-card');
    
    // 4. Pin the entire features section
    ScrollTrigger.create({
        trigger: '.features-section',
        start: 'top top',      // Pin when section reaches top
        end: '+=300%',         // Continue for 3 full scrolls
        pin: true,             // Enable pinning
        anticipatePin: 1       // Prepare for pinning slightly early
    });
    
    // 5. Initialize all cards
    cards.forEach((card, index) => {
        // Make card visible once GSAP initializes it
        card.classList.add('gsap-initialized');
        
        // Set initial positions
        gsap.set(card, {
            xPercent: index === 0 ? 0 : 100,  // First card visible, others off-screen right
            opacity: index === 0 ? 1 : 0,      // First card visible, others invisible
            zIndex: 10 - index                 // Stack cards properly
        });

        // Set initial heading positions based on screen size
        const headingLeft = card.querySelector('.heading-left');
        const headingRight = card.querySelector('.heading-right');
        
        if (window.innerWidth > 768) {
            // Desktop: headings start off-screen vertically
            gsap.set(headingLeft, { y: -100, opacity: 0 });
            gsap.set(headingRight, { y: 100, opacity: 0 });
        } else {
            // Mobile: headings start closer to center
            gsap.set(headingLeft, { y: -50, opacity: 0 });
            gsap.set(headingRight, { y: 50, opacity: 0 });
        }
    });

    // 6. Create the main animation timeline
    const featuresTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top 50%',    // Start animations when section is 50% in view
            end: '+=300%',       // End after 3 full scrolls
            scrub: 1,            // Smooth scrolling animation
            onUpdate: self => {
                // Calculate which card should be visible
                const progress = self.progress;
                const totalCards = cards.length;
                const segmentLength = 1 / (totalCards - 1);
                const currentIndex = Math.floor(progress / segmentLength);
                
                // Animate headings for current card
                const currentCard = cards[currentIndex];
                if (currentCard) {
                    const headingLeft = currentCard.querySelector('.heading-left');
                    const headingRight = currentCard.querySelector('.heading-right');

                    // Animate headings based on screen size
                    gsap.to(headingLeft, {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    gsap.to(headingRight, {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        delay: 0.2,
                        ease: "power2.out"
                    });
                }
            }
        }
    });

    // 7. Add initial pause before first transition
    featuresTl.to({}, { duration: 0.5 });

    // 8. Create transitions between cards
    cards.forEach((card, i) => {
        if (i > 0) {  // Skip first card as it's already visible
            // Slide out previous card to the left
            featuresTl.to(cards[i - 1], {
                xPercent: -100,
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut'
            });

            // Slide in current card from the right
            featuresTl.to(card, {
                xPercent: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.inOut'
            }, '<');  // '<' means start at same time as previous animation

            // Add a pause after transition
            featuresTl.to({}, { duration: 0.5 });
        }
    });

    // 9. Handle window resizing
    window.addEventListener('resize', () => {
        cards.forEach(card => {
            const headingLeft = card.querySelector('.heading-left');
            const headingRight = card.querySelector('.heading-right');
            
            // Reset positions based on screen size
            if (window.innerWidth > 768) {
                gsap.set([headingLeft, headingRight], { y: 0 });
            } else {
                gsap.set([headingLeft, headingRight], { x: 0 });
            }
        });
    });
}


function initCrossPlatformAnimations() {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#platforms", // Assuming this is the section ID
            start: "top center", // Adjust as needed
            toggleActions: "play reverse play reverse"
        }
    });

    timeline
        .to("#platform-heading", {
            y: 50,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out"
        })
        .to("#platform-tagline", {
            y: 50,
            opacity: 1,
            duration: 1.5,
            delay: 0.5,
            ease: "power3.out"
        }); // Overlap with the previous animation by 1 second
        // .fromTo(".platform-video", {
        //     scale: 0.5
        // }, {
        //     scale: 1,
        //     duration: 1.5,
        //     ease: "power3.out"
        // }, "-=1"); // Overlap with the previous animation by 1 second
}




// Initialize all animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize animations

    initHeroAnimations();

    setupGrid(); // This is from grid-setup.js

    initFeaturesAnimations();

    initCrossPlatformAnimations();
});


// Make functions available globally
window.initHeroAnimations = initHeroAnimations;
window.initFeaturesAnimations = initFeaturesAnimations;
window.initCrossPlatformAnimations = initCrossPlatformAnimations;

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});