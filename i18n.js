// ===== TRANSLATION DICTIONARY =====
// Add new text here: same key in both "en" and "ka".
// Anything on the page with a matching data-i18n attribute gets swapped automatically.
const TRANSLATIONS = {
    en: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.contact": "Contact",
        "nav.news": "News",
        "nav.menuLabel": "Toggle navigation menu",

        "logo.src": "images/logo.png",
        "logo.alt": "Human Capital Development Group",

        "title.home": "Home | Human Capital Development Group",
        "title.about": "About | Human Capital Development Group",
        "title.services": "Services | Human Capital Development Group",
        "title.contact": "Contact | Human Capital Development Group",
        "title.news": "News | Human Capital Development Group",

        "meta.home": "Human Capital Development Group offers comprehensive human capital development services to organizations and individuals in Georgia and abroad.",
        "meta.about": "Learn about Human Capital Development Group, a team of professionals making the impossible possible for organizations and individuals in Georgia and abroad.",
        "meta.services": "Institutional reform support, long-term strategies, international cooperation, education, projects and research. Explore our services.",
        "meta.contact": "Contact Human Capital Development Group in Tbilisi, Georgia. Call +995 599 33 44 17 or send us a message.",
        "meta.news": "Latest news and announcements from Human Capital Development Group.",

        "hero.h1": "Welcome to Human Capital Development Group",
        "hero.p": "A team of dedicated professionals delivering comprehensive human capital development services to organizations and individuals across Georgia and abroad. Bring us the challenge — we'll make it possible.",
        "hero.btn": "View Our Services",

        "features.quality.title": "✔ Quality Work",
        "features.quality.desc": "We take pride in delivering top-quality results for every client.",
        "features.pricing.title": "✔ Affordable Pricing",
        "features.pricing.desc": "Competitive rates without compromising on excellence.",
        "features.customer.title": "✔ Customer Focused",
        "features.customer.desc": "Your satisfaction is our number one priority.",

        "about.h1": "About Us",
        "about.p1": "The Human Capital Development Group is a group of professionals ready to offer comprehensive, multifaceted or specific services to organizations and individuals of any legal form in Georgia and abroad. All kinds of services related to the development of the most important capital - human capital.",
        "about.p2": "For us, the word “impossible” does not exist. The main thing is the customer’s desire and a team of professionals will make the impossible possible.",

        "services.h1": "Our services include (but are not limited to) the following areas:",
        "services.s1.desc": "Support for institutional reform or changes in organizations",
        "services.s2.desc": "Development of long-term strategies and action plans",
        "services.s3.desc": "Promotion of international relations and cooperation",
        "services.s4.desc": "Support for international and transnational education",
        "services.s5.desc": "Involvement and participation in international projects",
        "services.s6.desc": "International and local studies",

        "contact.h1": "Contact Us",
        "contact.addressLabel": "📍 Address:",
        "contact.addressValue": "Tbilisi, Georgia",
        "contact.phoneLabel": "📞 Phone:",
        "contact.phoneValue": "+995 599 33 44 17",
        "contact.emailLabel": "✉️ Email:",
        "contact.emailValue": "hcdgroupge@gmail.com",
        "contact.hoursLabel": "🕐 Hours:",
        "contact.hoursValue": "Mon–Fri, 9am – 6pm",
        "contact.facebookLabel": "Facebook:",
        "contact.facebookValue": "Visit our Facebook page",
        "contact.form.name": "Your Name",
        "contact.form.email": "Your Email",
        "contact.form.subject": "Subject",
        "contact.form.message": "Your Message...",
        "contact.form.messageLabel": "Your Message",
        "contact.form.submit": "Send Message",
        "contact.form.sending": "Sending...",
        "contact.form.thanks": "Thank you! Your message has been sent. We'll get back to you soon.",
        "contact.form.error": "Something went wrong. Please try again or email us directly.",

        "news.h1": "News",
        "news.latest": "Latest news",
        "news.all": "All news",
        "news.loading": "Loading news…",
        "news.empty": "No news yet.",
        "news.error": "Couldn't load the news. Please try again later.",
        "news.readMore": "Read more →",
        "news.prev": "Previous news",
        "news.next": "Next news",
        "news.back": "← All news",
        "news.notFound": "This news post wasn't found.",

        "footer.text": "© 2026 Human Capital Development Group. All rights reserved.",

        "lang.toggle": "ქართული"
    },
    ka: {
        "nav.home": "მთავარი",
        "nav.about": "ჩვენ შესახებ",
        "nav.services": "სერვისები",
        "nav.contact": "კონტაქტი",
        "nav.news": "სიახლეები",
        "nav.menuLabel": "ნავიგაციის მენიუს გადართვა",

        "logo.src": "images/logo-ka.png",
        "logo.alt": "ადამიანური კაპიტალის განვითარების ჯგუფი",

        "title.home": "მთავარი | ადამიანური კაპიტალის განვითარების ჯგუფი",
        "title.about": "ჩვენ შესახებ | ადამიანური კაპიტალის განვითარების ჯგუფი",
        "title.services": "სერვისები | ადამიანური კაპიტალის განვითარების ჯგუფი",
        "title.contact": "კონტაქტი | ადამიანური კაპიტალის განვითარების ჯგუფი",
        "title.news": "სიახლეები | ადამიანური კაპიტალის განვითარების ჯგუფი",

        "meta.home": "ადამიანური კაპიტალის განვითარების ჯგუფი სთავაზობს ორგანიზაციებსა და ფიზიკურ პირებს ყოვლისმომცველ მომსახურებას ადამიანური კაპიტალის განვითარების სფეროში საქართველოსა და მის ფარგლებს გარეთ.",
        "meta.about": "გაიგეთ მეტი ადამიანური კაპიტალის განვითარების ჯგუფის შესახებ — პროფესიონალთა გუნდი, რომელიც შეუძლებელს შესაძლებელს ხდის.",
        "meta.services": "ინსტიტუციური რეფორმის მხარდაჭერა, გრძელვადიანი სტრატეგიები, საერთაშორისო თანამშრომლობა, განათლება, პროექტები და კვლევები. გაეცანით ჩვენს სერვისებს.",
        "meta.contact": "დაგვიკავშირდით თბილისში, საქართველო. დაგვირეკეთ +995 599 33 44 17 ნომერზე ან გამოგვიგზავნეთ შეტყობინება.",
        "meta.news": "ადამიანური კაპიტალის განვითარების ჯგუფის უახლესი სიახლეები და ანონსები.",

        "hero.h1": "მოგესალმებით ადამიანური კაპიტალის განვითარების ჯგუფში",
        "hero.p": "პროფესიონალთა გუნდი, რომელიც სთავაზობს ორგანიზაციებსა და ფიზიკურ პირებს ყოვლისმომცველ მომსახურებას ადამიანური კაპიტალის განვითარების სფეროში საქართველოსა და მის ფარგლებს გარეთ. დაგვანახეთ გამოწვევა და ჩვენ შევძლებთ შეუძლებლის შესაძლებლად ქცევას.",
        "hero.btn": "იხილეთ ჩვენი სერვისები",

        "features.quality.title": "✔ ხარისხიანი მუშაობა",
        "features.quality.desc": "ჩვენ ვამაყობთ, რომ ყველა კლიენტს მაღალხარისხიან შედეგებს ვთავაზობთ.",
        "features.pricing.title": "✔ ხელმისაწვდომი ფასები",
        "features.pricing.desc": "კონკურენტული ფასები ხარისხზე დათმობის გარეშე.",
        "features.customer.title": "✔ კლიენტზე ორიენტირებული",
        "features.customer.desc": "თქვენი კმაყოფილება ჩვენი მთავარი პრიორიტეტია.",

        "about.h1": "ჩვენ შესახებ",
        "about.p1": "ადამიანური კაპიტალის განვითარების ჯგუფი წარმოადგენს პროფესიონალთა ერთობას, რომელიც მზადაა ყოვლისმომცველი, მრავალმხრივი თუ კონკრეტული მომსახურება შესთავაზოს საქართველოსა და მის ფარგლებს გარეთ არსებულ ნებისმიერი სამართლებრივი ფორმის ორგანიზაციებსა და ინდივიდებს. ყველანაირი მომსახურება, რომელიც დაკავშირებულია ყველაზე მნიშვნელოვანი კაპიტალის - ადამიანური კაპიტალის განსავითარებლად.",
        "about.p2": "ჩვენთვის სიტყვა „შეუძლებელია“ არ არსებობს. მთავარია დამკვეთის სურვილი და პროფესიონალთა გუნდი შეუძლებელს შესაძლებელს გახდის.",

        "services.h1": "ჩვენი მომსახურება მოიცავს (თუმცა არ შემოიფარგლება) შემდეგ სფეროებს",
        "services.s1.desc": "ორგანიზაციების ინსტიტუციური რეფორმისა თუ ცვლილებების მხარდაჭერა",
        "services.s2.desc": "გრძელვადიანი სტრატეგიებისა და სამოქმედო გეგმების შემუშავება",
        "services.s3.desc": "საერთაშორისო კავშირებისა და თანამშრომლობის ხელშეწყობა",
        "services.s4.desc": "საერთაშორისო და ტრანსნაციონალური განათლების მხარდაჭერა",
        "services.s5.desc": "საერთაშორისო პროექტებში ჩართვა და მონაწილეობა",
        "services.s6.desc": "საერთაშორისო და ადგილობრივი კვლევები",

        "contact.h1": "დაგვიკავშირდით",
        "contact.addressLabel": "📍 მისამართი:",
        "contact.addressValue": "თბილისი, საქართველო",
        "contact.phoneLabel": "📞 ტელეფონი:",
        "contact.phoneValue": "+995 599 33 44 17",
        "contact.emailLabel": "✉️ ელფოსტა:",
        "contact.emailValue": "hcdgroupge@gmail.com",
        "contact.hoursLabel": "🕐 სამუშაო საათები:",
        "contact.hoursValue": "ორშ–პარ, 09:00 – 18:00",
        "contact.facebookLabel": "Facebook:",
        "contact.facebookValue": "ეწვიეთ ჩვენს Facebook გვერდს",
        "contact.form.name": "თქვენი სახელი",
        "contact.form.email": "თქვენი ელფოსტა",
        "contact.form.subject": "თემა",
        "contact.form.message": "თქვენი შეტყობინება...",
        "contact.form.messageLabel": "თქვენი შეტყობინება",
        "contact.form.submit": "შეტყობინების გაგზავნა",
        "contact.form.sending": "იგზავნება...",
        "contact.form.thanks": "გმადლობთ! თქვენი შეტყობინება გაიგზავნა. მალე დაგიკავშირდებით.",
        "contact.form.error": "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა ან მოგვწერეთ პირდაპირ ელფოსტაზე.",

        "news.h1": "სიახლეები",
        "news.latest": "უახლესი სიახლეები",
        "news.all": "ყველა სიახლე",
        "news.loading": "სიახლეები იტვირთება…",
        "news.empty": "სიახლეები ჯერ არ არის.",
        "news.error": "სიახლეების ჩატვირთვა ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით.",
        "news.readMore": "სრულად წაკითხვა →",
        "news.prev": "წინა სიახლე",
        "news.next": "შემდეგი სიახლე",
        "news.back": "← ყველა სიახლე",
        "news.notFound": "სიახლე ვერ მოიძებნა.",

        "footer.text": "© 2026 ადამიანური კაპიტალის განვითარების ჯგუფი. ყველა უფლება დაცულია.",

        "lang.toggle": "English"
    }
};

// ===== SAFE STORAGE =====
// localStorage can throw (some private-browsing modes, blocked cookies).
// These helpers make sure that never breaks the page.
function getSavedLang() {
    try {
        return localStorage.getItem("site-lang") || "ka";
    } catch (e) {
        return "ka";
    }
}

function saveLang(lang) {
    try {
        localStorage.setItem("site-lang", lang);
    } catch (e) {
        /* ignore: the language just won't be remembered */
    }
}

// ===== LANGUAGE ENGINE =====
function applyLanguage(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    document.documentElement.lang = lang === "ka" ? "ka" : "en";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
        const key = el.getAttribute("data-i18n-aria-label");
        if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    document.querySelectorAll("[data-i18n-content]").forEach(el => {
        const key = el.getAttribute("data-i18n-content");
        if (dict[key] !== undefined) el.setAttribute("content", dict[key]);
    });

    const titleKey = document.body.getAttribute("data-i18n-title");
    if (titleKey && dict[titleKey]) document.title = dict[titleKey];

    const toggleBtn = document.getElementById("lang-toggle");
    if (toggleBtn) toggleBtn.textContent = dict["lang.toggle"];

    const logoImg = document.querySelector(".logo-img");
    if (logoImg) {
        if (dict["logo.src"]) logoImg.src = dict["logo.src"];
        if (dict["logo.alt"]) logoImg.alt = dict["logo.alt"];
    }

    saveLang(lang);
    document.documentElement.classList.remove("i18n-pending");
}

function initLanguage() {
    applyLanguage(getSavedLang());

    const toggleBtn = document.getElementById("lang-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            // The page's own lang attribute is the source of truth,
            // so the toggle still works even if storage is unavailable.
            applyLanguage(document.documentElement.lang === "ka" ? "en" : "ka");
        });
    }
}

document.addEventListener("DOMContentLoaded", initLanguage);
