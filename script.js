// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Chart.js for data visualization
function createCrowdingChart() {
    const canvas = document.getElementById('crowdingChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(139, 69, 19, 0.8)');
    gradient.addColorStop(1, 'rgba(139, 69, 19, 0.1)');

    // Draw inverse U curve
    ctx.beginPath();
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    
    for (let x = 0; x <= 200; x++) {
        const xNorm = x / 200; // Normalize to 0-1
        const y = 150 - (50 + 40 * Math.sin(Math.PI * xNorm)); // Inverse U shape
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Fill area under curve
    ctx.lineTo(200, 150);
    ctx.lineTo(0, 150);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Noto Sans JP';
    ctx.textAlign = 'center';
    ctx.fillText('1', 20, 160);
    ctx.fillText('3', 100, 160);
    ctx.fillText('5', 180, 160);
    
    ctx.save();
    ctx.translate(10, 75);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('集中度', 0, 0);
    ctx.restore();
}

function createExperimentChart() {
    const canvas = document.getElementById('experimentChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Chart data
    const data = [
        { label: '35dB', value: 75, color: '#87CEEB' },
        { label: '55dB', value: 82, color: '#8B4513' },
        { label: '75dB', value: 73, color: '#DC143C' }
    ];
    
    const barWidth = 80;
    const barSpacing = 40;
    const startX = 50;
    const maxHeight = 200;
    const maxValue = Math.max(...data.map(d => d.value));

    // helper: draw text with subtle background to avoid overlapping/garbling
    function drawTextWithBg(text, x, y) {
        const paddingX = 6;
        const paddingY = 3;
        const metrics = ctx.measureText(text);
        const textW = metrics.width;
        const textH = 16; // approximate height
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const rx = x - textW / 2 - paddingX;
        const ry = y - textH / 2 - paddingY;
        const rw = textW + paddingX * 2;
        const rh = textH + paddingY * 2;
        const r = 6;
        ctx.moveTo(rx + r, ry);
        ctx.arcTo(rx + rw, ry, rx + rw, ry + rh, r);
        ctx.arcTo(rx + rw, ry + rh, rx, ry + rh, r);
        ctx.arcTo(rx, ry + rh, rx, ry, r);
        ctx.arcTo(rx, ry, rx + rw, ry, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.fillText(text, x, y);
        ctx.restore();
    }
    
    // Draw bars
    data.forEach((item, index) => {
        const x = startX + index * (barWidth + barSpacing);
        const height = (item.value / maxValue) * maxHeight;
        const y = 250 - height;
        
        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, height);
        
        // Add value label (with background to improve legibility)
        ctx.font = 'bold 16px Noto Sans JP, sans-serif';
        drawTextWithBg(item.value + '%', x + barWidth / 2, y - 14);
        
        // Add axis label
        ctx.font = '14px Noto Sans JP, sans-serif';
        ctx.fillStyle = '#333';
        ctx.fillText(item.label, x + barWidth/2, 285);
    });
    
    // Add title (slightly higher to avoid overlap)
    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 20px Noto Sans JP, sans-serif';
    ctx.fillText('準実験結果：正答率', 200, 22);
    
    // Add significance indicators (moved lower)
    const sigY = 80;
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX + barWidth/2, sigY);
    ctx.lineTo(startX + barWidth + barSpacing + barWidth/2, sigY);
    ctx.stroke();
    
    ctx.fillStyle = '#8B4513';
    ctx.font = '12px Noto Sans JP, sans-serif';
    ctx.fillText('p < .01', 200, sigY - 10);
}

// Animate numbers on scroll
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate specific elements
            if (entry.target.classList.contains('hero-stats')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    createCrowdingChart();
    createExperimentChart();
    
    // Add animation classes
    const animateElements = document.querySelectorAll('.hero-stats, .method-card, .result-card, .implication-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Tooltip functionality
    const diagramNodes = document.querySelectorAll('.diagram-node');
    diagramNodes.forEach(node => {
        const tooltip = node.getAttribute('data-tooltip');
        if (tooltip) {
            node.addEventListener('mouseenter', (e) => {
                const tooltipEl = document.createElement('div');
                tooltipEl.className = 'tooltip';
                tooltipEl.textContent = tooltip;
                tooltipEl.style.cssText = `
                    position: absolute;
                    background: rgba(44, 24, 16, 0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                    pointer-events: none;
                    top: ${e.pageY - 40}px;
                    left: ${e.pageX + 10}px;
                `;
                document.body.appendChild(tooltipEl);
                
                node.addEventListener('mouseleave', () => {
                    tooltipEl.remove();
                });
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('すべての項目を入力してください。');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('お問い合わせありがとうございます。\n後日ご連絡いたします。');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const cafeScene = document.querySelector('.cafe-scene');
    
    if (hero && cafeScene) {
        const rate = scrolled * -0.5;
        cafeScene.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #8B4513, #A0522D);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'メインコンテンツにスキップ';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #8B4513;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1002;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
});
