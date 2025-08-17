document.addEventListener('DOMContentLoaded', function() {
    // Initialize parallax effect if library is available
    const scene = document.getElementById('scene');
    if (typeof Parallax !== 'undefined') {
        const parallaxInstance = new Parallax(scene);
    } else {
        // Fallback for when parallax library isn't available
        console.log('Parallax library not available, using fallback');
        // Add simple parallax effect with mouse movement
        document.addEventListener('mousemove', function(e) {
            const layers = document.querySelectorAll('.parallax-layer');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            layers.forEach((layer, index) => {
                const depth = 0.1 * (index + 1);
                const moveX = mouseX * depth * 50;
                const moveY = mouseY * depth * 50;
                layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
    
    // Animation for page load
    setTimeout(() => {
        document.querySelector('.admin-container').classList.add('visible');
    }, 100);
    
    // Set card animation delays
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
    
    // Anime.js animations
    anime({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [50, 0],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: 300
    });
    
    anime({
        targets: '.hero-subtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: 500
    });
    
    anime({
        targets: '.hero-line',
        width: [0, 50],
        easing: 'easeInOutQuad',
        duration: 800,
        delay: 800
    });
    
    anime({
        targets: '.hero-dot',
        scale: [0, 1],
        opacity: [0, 1],
        easing: 'easeOutBack',
        duration: 600,
        delay: 1000
    });
    
    // Scroll animations
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Parallax effect for hero section
        document.querySelector('.hero-content').style.transform = `translateY(${scrollY * 0.3}px)`;
        
        // Animate elements when they come into view
        animateOnScroll();
    });
    
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .developer-info, .admin-access');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('in-view');
            }
        });
    }
    
    // Initial check for elements in view
    setTimeout(animateOnScroll, 100);
    
    // Back to dashboard button
    const backButton = document.getElementById('back-to-dashboard');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Create transition element
            const transition = document.createElement('div');
            transition.classList.add('page-transition');
            document.body.appendChild(transition);
            
            // Navigate back after animation
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        });
    }
    
    // Form submission
    const accessForm = document.getElementById('access-request-form');
    if (accessForm) {
        accessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                message: document.getElementById('message').value
            };
            
            // Show success message (in a real app, this would send data to a server)
            accessForm.innerHTML = `
                <div class="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-success)">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h4>Request Submitted</h4>
                    <p>Thank you for your interest! We'll review your request and contact you soon.</p>
                </div>
            `;
        });
    }
});