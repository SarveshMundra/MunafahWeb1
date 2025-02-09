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
    // Get all feature cards
    const cards = gsap.utils.toArray('.feature-card');
    
    // Pin setup with adjusted scroll length
    ScrollTrigger.create({
        trigger: '.features-section',
        start: 'top top',
        end: '+=200%',  // Reduced from 300% to 200% to decrease extra scroll space
        pin: true,
        anticipatePin: 1  // Helps prevent jittery pin behavior
    });

    // Initialize cards
    cards.forEach((card, index) => {
        card.classList.add('gsap-initialized');
        
        // Set initial positions
        gsap.set(card, {
            xPercent: index === 0 ? 0 : 100,
            opacity: index === 0 ? 1 : 0
        });

        // Initialize headings
        const headings = card.querySelectorAll('.heading-left, .heading-right');
        gsap.set(headings, {
            y: 50,
            opacity: 0
        });
    });

    // Main timeline
    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top top',
            end: '+=200%',
            scrub: 1.5,  // Increased from 1 to 1.5 for smoother transitions
            onUpdate: (self) => {
                // Calculate current card based on scroll progress
                const progress = self.progress;
                const currentCardIndex = Math.floor(progress * 2);  // Adjusted for 3 cards
                
                // Update headings
                cards.forEach((card, index) => {
                    const headings = card.querySelectorAll('.heading-left, .heading-right');
                    
                    if (index === currentCardIndex) {
                        gsap.to(headings, {
                            y: 0,
                            opacity: 1,
                            duration: 0.75,  // Slightly increased duration
                            stagger: 0.3,    // Increased stagger for more noticeable effect
                            ease: 'power2.out'
                        });
                    } else {
                        gsap.to(headings, {
                            y: 50,
                            opacity: 0,
                            duration: 0.5
                        });
                    }
                });
            }
        }
    });

    // Card transitions with longer pauses
    cards.forEach((card, i) => {
        if (i !== 0) {
            // Add longer pause before transition
            mainTl.to({}, { duration: 1 });  // Increased pause duration

            // Transition animation
            mainTl
                .to(cards[i - 1], {
                    xPercent: -100,
                    opacity: 0,
                    duration: 1.5  // Increased duration
                })
                .to(card, {
                    xPercent: 0,
                    opacity: 1,
                    duration: 1.5  // Increased duration
                }, '<');

            // Add longer pause after transition
            mainTl.to({}, { duration: 1 });  // Increased pause duration
        }
    });
}

// ANIMATION ADJUSTMENT GUIDE:
// 1. Heading starting position: Change y: -250 (bigger number = starts higher)
// 2. Heading animation timing: Adjust duration: 0.75 in the heading animation
// 3. Delay between headings: Change stagger: 0.8 (bigger = more delay)
// 4. Overall smoothness: Adjust scrub: 1.5 (bigger = smoother but more delay)
// 5. Section pauses: Change duration: 1 in the pause sections
// 6. Card transition speed: Modify duration: 1.5 in the card transitions



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