/**
 * Mello Website - JavaScript
 * Modern interactions, i18n, animations
 */

const SUPPORTED_LOCALES = ['nl', 'en', 'es', 'fr', 'it'];
const DEFAULT_LOCALE = 'nl';

/**
 * Detect preferred locale from browser or localStorage
 */
function getLocale() {
    const stored = typeof localStorage !== 'undefined' && localStorage.getItem('mello-locale');
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
    const browser = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const code = browser.split('-')[0];
    if (SUPPORTED_LOCALES.includes(code)) return code;
    const match = (navigator.languages || []).find(lang => SUPPORTED_LOCALES.includes(lang.split('-')[0]));
    if (match) return match.split('-')[0];
    return DEFAULT_LOCALE;
}

/**
 * Get nested value from object by path (e.g. "hero.tagline")
 */
function getTranslation(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current == null || typeof current !== 'object') return undefined;
        current = current[key];
    }
    return current;
}

/**
 * Apply translations to the page
 */
function applyTranslations(locale) {
    if (typeof translations === 'undefined' || !translations[locale]) return;
    const t = translations[locale];
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getTranslation(t, key);
        if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = getTranslation(t, key);
        if (value != null) el.placeholder = value;
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.getAttribute('data-i18n-alt');
        const value = getTranslation(t, key);
        if (value != null) el.alt = value;
    });
    const tagline = getTranslation(t, 'hero.tagline');
    if (tagline) document.title = `Mello — ${tagline}`;
    const langLabel = getTranslation(t, 'nav.langLabel');
    const langEl = document.querySelector('.nav-lang');
    if (langEl && langLabel) langEl.setAttribute('aria-label', langLabel);
    updateLangSelector(locale);
}

function updateLangSelector(activeLocale) {
    const select = document.getElementById('nav-lang-select');
    if (select && SUPPORTED_LOCALES.includes(activeLocale)) select.value = activeLocale;
}

function initLangSelector() {
    const select = document.getElementById('nav-lang-select');
    if (!select) return;
    select.addEventListener('change', () => {
        const locale = select.value;
        if (!SUPPORTED_LOCALES.includes(locale)) return;
        if (typeof localStorage !== 'undefined') localStorage.setItem('mello-locale', locale);
        applyTranslations(locale);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const locale = getLocale();
    applyTranslations(locale);
    initLangSelector();
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    initFormHandler();
});

/**
 * Header background effect on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let ticking = false;
    
    const updateHeader = () => {
        const scrolled = window.scrollY > 50;
        header.style.boxShadow = scrolled 
            ? '0 4px 20px rgba(47, 58, 68, 0.08)' 
            : 'none';
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Fade-in animations on scroll using Intersection Observer
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const animatedElements = document.querySelectorAll(
        '.feature-card, .highlight, .about-card, .contact-wrapper, .download-card, .section-header'
    );
    
    if (animatedElements.length === 0) return;
    
    // Add initial styles
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add stagger effect for grid items
                    const parent = entry.target.parentElement;
                    const siblings = parent?.querySelectorAll('.feature-card, .highlight');
                    
                    if (siblings && siblings.length > 1) {
                        const index = Array.from(siblings).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 80}ms`;
                    }
                    
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        }
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Contact form handler – AJAX submit, succesbericht zonder pagina te verlaten
 */
function initFormHandler() {
    const form = document.querySelector('.contact-form');
    const successEl = document.getElementById('form-success-message');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.form-button');
        const honeypot = form.querySelector('.form-honeypot');
        
        // Honeypot: als dit veld is ingevuld, is het waarschijnlijk een bot
        if (honeypot && honeypot.value.trim() !== '') {
            form.reset();
            return;
        }
        
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Verzenden...</span>';
        button.disabled = true;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.ok) {
                form.classList.add('form-hidden');
                if (successEl) {
                    successEl.hidden = false;
                    successEl.focus({ preventScroll: true });
                }
            } else {
                button.innerHTML = originalText;
                button.disabled = false;
                if (data.error) {
                    alert(data.error || 'Er ging iets mis. Probeer het later opnieuw.');
                }
            }
        } catch (err) {
            button.innerHTML = originalText;
            button.disabled = false;
            alert('Er ging iets mis. Controleer je internetverbinding en probeer het opnieuw.');
        }
    });
}

/**
 * Analytics tracking placeholder
 */
document.querySelectorAll('.app-store-badge').forEach(button => {
    button.addEventListener('click', () => {
        console.log('App Store button clicked');
        // Add your analytics here, e.g.:
        // gtag('event', 'click', { event_category: 'CTA', event_label: 'App Store' });
    });
});
