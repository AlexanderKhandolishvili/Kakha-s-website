// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    const setMenu = (open) => {
        navLinks.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
    };

    hamburger.addEventListener('click', () => {
        setMenu(!navLinks.classList.contains('open'));
    });

    // Close with the Escape key, or by tapping anywhere outside the menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) setMenu(false);
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const statusEl = document.getElementById('formStatus');

    // Shows a message under the Send button. type is "success", "error" or "" (clears it).
    const showStatus = (type, text) => {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = type ? 'form-status ' + type : 'form-status';
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const lang = (typeof getSavedLang === 'function') ? getSavedLang() : 'ka';
        const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : null;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = (dict && dict['contact.form.sending']) || 'Sending...';
        showStatus('', '');

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Submission failed');
                // FormSubmit can answer HTTP 200 with success:"false" (e.g. when the
                // form has not been activated yet), so check the JSON body too.
                return response.json().catch(() => ({}));
            })
            .then((data) => {
                if (data && (data.success === false || data.success === 'false')) {
                    throw new Error(data.message || 'Submission failed');
                }
                showStatus('success', (dict && dict['contact.form.thanks'])
                    || "Thank you! Your message has been sent. We'll get back to you soon.");
                contactForm.reset();
            })
            .catch(() => {
                showStatus('error', (dict && dict['contact.form.error'])
                    || 'Something went wrong. Please try again or email us directly.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
    });
}
