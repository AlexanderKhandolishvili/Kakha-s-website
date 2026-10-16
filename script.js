// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const statusEl = document.getElementById('formStatus');

    // Shows a message under the Send button. type is "success", "error" or "" (clears it).
    function showStatus(type, text) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = type ? 'form-status ' + type : 'form-status';
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const lang = (typeof getSavedLang === 'function') ? getSavedLang() : 'ka';
        const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : null;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = dict && dict['contact.form.sending'] ? dict['contact.form.sending'] : 'Sending...';
        showStatus('', '');

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('Submission failed');
                // FormSubmit can answer HTTP 200 with success:"false" (e.g. when the
                // form has not been activated yet), so check the JSON body too.
                return response.json().catch(() => ({}));
            })
            .then(data => {
                if (data && (data.success === false || data.success === 'false')) {
                    throw new Error(data.message || 'Submission failed');
                }
                const thanksMsg = dict ? dict['contact.form.thanks'] : "Thank you! Your message has been sent. We'll get back to you soon.";
                showStatus('success', thanksMsg);
                contactForm.reset();
            })
            .catch(() => {
                const errorMsg = dict && dict['contact.form.error']
                    ? dict['contact.form.error']
                    : 'Something went wrong. Please try again or email us directly.';
                showStatus('error', errorMsg);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
    });
}
