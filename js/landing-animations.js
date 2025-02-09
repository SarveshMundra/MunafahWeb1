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
    // ===============================================
    // 1. SETUP AND ELEMENT SELECTION
    // ===============================================
    
    // Get all feature cards and convert NodeList to Array for easier manipulation
    // This looks for elements with class 'feature-card'
    const cards = gsap.utils.toArray('.feature-card');
    
    // ===============================================
    // 2. PIN SETUP - Keeps section fixed while scrolling
    // ===============================================
    
    // This makes the features section stay fixed while we scroll through it
    // Without this, the section would scroll normally
    ScrollTrigger.create({
        trigger: '.features-section',    // The section that triggers the pin
        start: 'top top',               // Pin starts when section's top hits viewport's top
        end: '+=300%',                  // Pin ends after scrolling 3 full viewport heights
        pin: true                       // Enables the pin effect
    });

    // ===============================================
    // 3. CARD INITIALIZATION
    // ===============================================
    
    // Set up each card's initial state
    cards.forEach((card, index) => {
        // Make card visible (removes initial hidden state from CSS)
        card.classList.add('gsap-initialized');
        
        // Set starting positions for cards:
        // - First card (index 0) starts visible in center
        // - Other cards start off-screen to the right
        gsap.set(card, {
            xPercent: index === 0 ? 0 : 100,  // 0 = center, 100 = off-screen right
            opacity: index === 0 ? 1 : 0      // First card visible, others invisible
        });

        // Get heading elements within this card
        const headings = card.querySelectorAll('.heading-left, .heading-right');
        
        // Set initial state for headings - start below their final position and invisible
        gsap.set(headings, {
            y: -250,          // Start 50 pixels below final position
            opacity: 0      // Start invisible
        });
    });

    // ===============================================
    // 4. MAIN ANIMATION TIMELINE
    // ===============================================
    
    // Create the main timeline that controls all animations
    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-section',    // Section that triggers the animation
            start: 'top 70%',               // Start at the top of the section
            end: '+=100%',                  // End after scrolling 3 full heights
            scrub: 1,                       // Smooth animation with 1 second catch-up
            
            // This function runs every time the scroll position updates
            onUpdate: (self) => {
                // Calculate which card should be visible based on scroll position
                const progress = self.progress;           // 0 to 1 (scroll progress)
                const currentCardIndex = Math.floor(progress * 3); // Convert to 0, 1, or 2
                
                // Update heading animations for all cards
                cards.forEach((card, index) => {
                    // Get headings for this card
                    const headings = card.querySelectorAll('.heading-left, .heading-right');
                    
                    if (index === currentCardIndex) {
                        // If this is the current card, animate headings in
                        gsap.to(headings, {
                            y: 0,               // Move to final position
                            opacity: 1,         // Fade in
                            duration: 1,      // Animation takes 0.5 seconds
                            stagger: 0.5,       // 0.2 second delay between each heading
                            ease: 'power2.out'  // Smooth easing function
                        });
                    } else {
                        // If not current card, reset headings to initial state
                        gsap.set(headings, {
                            y: -250,
                            opacity: 0
                        });
                    }
                });
            }
        }
    });

    // ===============================================
    // 5. CARD TRANSITION ANIMATIONS
    // ===============================================
    
    // Set up transitions between cards
    cards.forEach((card, i) => {
        // Skip first card since it starts visible
        if (i !== 0) {
            // Add pause before transition (adjust this value to change pause length)
            mainTl.to({}, { duration: 0.5 });

            // Create the transition animation
            mainTl
                // Move previous card out to the left
                .to(cards[i - 1], {
                    xPercent: -100,     // Move off-screen left
                    opacity: 0,         // Fade out
                    duration: 1         // Animation duration
                })
                // Move current card in from the right
                .to(card, {
                    xPercent: 0,        // Move to center
                    opacity: 1,         // Fade in
                    duration: 1         // Animation duration
                }, '<');                // '<' means start at same time as previous animation

            // Add pause after transition (adjust this value to change pause length)
            mainTl.to({}, { duration: 0.5 });
        }
    });
}



// ===============================================
// CUSTOMIZATION GUIDE
// ===============================================
// To modify the animations, here are the key values you can adjust:
//
// 1. Card Transition Speed:
//    Find: duration: 1
//    This controls how long it takes for cards to slide in/out
//
// 2. Pause Duration:
//    Find: duration: 0.5 (in the pause sections)
//    This controls how long the animation pauses between transitions
//
// 3. Heading Animation Speed:
//    Find: duration: 0.5 (in the onUpdate section)
//    This controls how fast the headings animate in
//
// 4. Heading Stagger:
//    Find: stagger: 0.2
//    This controls the delay between left and right heading animations
//
// 5. Initial Heading Position:
//    Find: y: 50
//    This controls how far below their final position the headings start
//
// 6. Scroll Smoothness:
//    Find: scrub: 1
//    Lower values = faster response to scroll, higher = smoother but more delay

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