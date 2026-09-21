// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// ===== CONTACT FORM SUBMIT ALERT =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const lang = localStorage.getItem('site-lang') || 'en';
        const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : null;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('Submission failed');
                const thanksMsg = dict ? dict['contact.form.thanks'] : "Thank you! Your message has been sent. We'll get back to you soon.";
                alert(thanksMsg);
                contactForm.reset();
            })
            .catch(() => {
                const errorMsg = dict && dict['contact.form.error']
                    ? dict['contact.form.error']
                    : 'Something went wrong. Please try again or email us directly.';
                alert(errorMsg);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
    });
}