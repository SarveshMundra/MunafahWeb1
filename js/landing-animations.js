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
    
    // Pin setup with modified trigger points
    ScrollTrigger.create({
        trigger: '.features-section',
        start: 'top top',   // When the top of features section hits the top of viewport
        end: '+=300%',    // ADJUST: Total scroll length
        pin: true,
        markers: true,
        anticipatePin: 1
    });

    // Initialize cards
    cards.forEach((card, index) => {
        card.classList.add('gsap-initialized');
        
        // Set initial card positions
        gsap.set(card, {
            xPercent: index === 0 ? 0 : 100,
            opacity: index === 0 ? 1 : 0
        });

        // Initialize headings - Set their starting position FROM TOP
        const headings = card.querySelectorAll('.heading-left, .heading-right');
        gsap.set(headings, {
            y: -250,  // ADJUST: Negative value makes it start from top
            opacity: 0
        });
    });

    // Main timeline with modified trigger points
    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top 40%',  // When the top of features section hits the center of viewport
            end: '+=300%',
            scrub: 5,     // ADJUST: Smoothness of animation (0.5 to 2.0)
            onUpdate: (self) => {
                const progress = self.progress;
                // Calculate current card index (0, 1, or 2)
                const currentCardIndex = Math.floor(progress * 2);
                
                // Animate headings with modified trigger point
                cards.forEach((card, index) => {
                    const headings = card.querySelectorAll('.heading-left, .heading-right');
                    
                    if (index === currentCardIndex) {
                        // Start animation immediately when card becomes active
                        gsap.to(headings, {
                            y: 0,           // Move to original position
                            opacity: 1,
                            duration: 2,   // ADJUST: Speed of heading animation

                            ease: 'power3.out',  // ADJUST: Animation easing
                            // Immediate animation
                            immediateRender: true
                        });
                    } else {
                        // Reset headings position to top
                        gsap.to(headings, {
                            y: -250,        // ADJUST: Should match initial y value
                            opacity: 0,
                            duration: 0.8
                        });
                    }
                });
            }
        }
    });

    // Card transitions
    cards.forEach((card, i) => {
        if (i !== 0) {
            // Pre-transition pause for card 2 & 3. 
            mainTl.to({}, { 
                duration: 5  // ADJUST: Pause length before transition
            });

            // Card transition animation higher the number slower the card moves in and out of view.
            mainTl
                .to(cards[i - 1], {
                    xPercent: -100,
                    opacity: 0,
                    duration: 15
                })
                .to(card, {
                    xPercent: 0,
                    opacity: 1,
                    duration: 15
                }, '<');  // Synchronize animations

            // Post-transition pause
            mainTl.to({}, { 
                duration: 5 // ADJUST: Pause length after transition
            });
        } else {
            // Adjust the pre-transition pause for the first card
            mainTl.to({}, { 
                duration: 6  // Increase pause length before transition for the first card
            });

            // Adjust the post-transition pause for the first card
            mainTl.to({}, { 
                duration: 6  // Increase pause length after transition for the first card
            });
        }
    });
}

// Animation Adjustment Guide:
// 1. Starting Position: Change y: -250 to adjust how far from top headings start
// 2. Animation Speed: Modify duration: 1.2 for heading animations
// 3. Heading Delay: Adjust stagger: 0.8 for time between headings
// 4. Overall Smoothness: Change scrub: 1.5 (higher = smoother but more delayed)
// 5. Transition Timing: Modify duration: 1.2 in pause sections
// 6. Card Animation: Adjust duration: 1.5 in card transitions




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