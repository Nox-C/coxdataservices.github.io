// Main JavaScript for Art Deco Theme

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    const navHeight = nav.offsetHeight;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('nav ul').classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes(href.replace('.html', '')) && href !== 'index.html')) {
            link.classList.add('active');
        }
    });

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };

    // Initialize animations
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Add decorative elements
    addDecorativeElements();
});

// Add decorative Art Deco elements
function addDecorativeElements() {
    const decoElements = [
        { type: 'circle', size: '150px', color: 'var(--primary)', opacity: '0.1', top: '15%', left: '5%' },
        { type: 'square', size: '100px', color: 'var(--accent)', opacity: '0.1', top: '25%', right: '5%', rotate: '45deg' },
        { type: 'line', width: '80px', height: '2px', color: 'var(--primary)', top: '40%', left: '10%', rotate: '45deg' },
        { type: 'circle', size: '80px', color: 'var(--accent)', opacity: '0.1', bottom: '20%', right: '8%' },
        { type: 'square', size: '60px', color: 'var(--primary)', opacity: '0.1', bottom: '30%', left: '7%', rotate: '30deg' }
    ];

    decoElements.forEach((el, index) => {
        const deco = document.createElement('div');
        deco.className = 'deco-element';
        deco.style.position = 'fixed';
        deco.style.pointerEvents = 'none';
        deco.style.zIndex = '-1';
        deco.style.opacity = el.opacity || '0.1';
        deco.style.animation = `float ${6 + index}s ease-in-out infinite`;
        
        if (el.top) deco.style.top = el.top;
        if (el.bottom) deco.style.bottom = el.bottom;
        if (el.left) deco.style.left = el.left;
        if (el.right) deco.style.right = el.right;
        if (el.rotate) deco.style.transform = `rotate(${el.rotate})`;

        if (el.type === 'circle') {
            deco.style.width = el.size;
            deco.style.height = el.size;
            deco.style.borderRadius = '50%';
            deco.style.background = el.color;
        } 
        else if (el.type === 'square') {
            deco.style.width = el.size;
            deco.style.height = el.size;
            deco.style.background = el.color;
        }
        else if (el.type === 'line') {
            deco.style.width = el.width || '100px';
            deco.style.height = el.height || '2px';
            deco.style.background = el.color;
        }

        document.body.appendChild(deco);
    });
}

// Page transition effect
function navigateTo(url) {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Add this to your HTML links for smooth page transitions
// <a href="page.html" onclick="navigateTo(this.href); return false;">Link</a>
