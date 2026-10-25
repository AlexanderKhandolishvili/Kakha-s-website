// ===== NEWS (public side) =====
// Reads the posts from Firestore through its public REST address, so the
// visitor's browser doesn't need to download the whole Firebase library.
// Used by three pages:
//   index.html   -> has <div id="latestNews"> : the 5 newest posts as a slider, shortened
//   news.html    -> has <div id="newsList">   : the latest posts, shortened
//   article.html -> has <article id="articleBox"> : ONE post in full (article.html?id=...)
// A shortened card ends with a "read more" link to that post's own page.
// Each post is saved with two photos: "image" (the full one, used only on the post's
// own page) and "thumb" (a small copy, used on the cards). The lists ask Firestore for
// the thumbnail only, so the home page never downloads the big photos.
(function () {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg) return;

    const listEl = document.getElementById('newsList');
    const latestEl = document.getElementById('latestNews');
    const articleEl = document.getElementById('articleBox');
    if (!listEl && !latestEl && !articleEl) return;

    const statusEl = document.getElementById('newsStatus');
    const section = document.getElementById('latestNewsSection');
    const SITE_NAME = 'ადამიანური კაპიტალის განვითარების ჯგუფი';
    const DB_URL = 'https://firestore.googleapis.com/v1/projects/' + cfg.projectId + '/databases/(default)/documents';
    const KEY = '?key=' + encodeURIComponent(cfg.apiKey);

    // Shows a short message ("Loading...", "No news yet.") using the translation
    // dictionary. The data-i18n attribute lets the language button re-translate it.
    function setStatus(key) {
        if (!statusEl) return;
        if (!key) {
            statusEl.removeAttribute('data-i18n');
            statusEl.textContent = '';
            return;
        }
        statusEl.setAttribute('data-i18n', key);
        const dict = (typeof TRANSLATIONS !== 'undefined' && typeof getSavedLang === 'function')
            ? TRANSLATIONS[getSavedLang()] : null;
        statusEl.textContent = (dict && dict[key]) || '';
    }

    // Text of a translation key in the visitor's current language
    function t(key) {
        const dict = (typeof TRANSLATIONS !== 'undefined' && typeof getSavedLang === 'function')
            ? TRANSLATIONS[getSavedLang()] : null;
        return (dict && dict[key]) || '';
    }

    // Firestore wraps every value in its type, e.g. { stringValue: "..." }
    function readValue(field) {
        if (!field) return '';
        if (field.stringValue !== undefined) return field.stringValue;
        if (field.timestampValue !== undefined) return field.timestampValue;
        return '';
    }

    function parsePost(doc) {
        const f = doc.fields || {};
        return {
            id: doc.name ? doc.name.split('/').pop() : '',
            title: readValue(f.title),
            text: readValue(f.text),
            image: readValue(f.image),
            thumb: readValue(f.thumb),
            date: readValue(f.date)
        };
    }

    // Georgian month names are written out here instead of relying on the browser's
    // locale data, so every visitor sees the same date. The date is shifted to
    // Tbilisi time (UTC+4) so a late-evening post doesn't show the wrong day.
    const MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
        'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

    function formatDate(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return '';
        const tbilisi = new Date(d.getTime() + 4 * 60 * 60 * 1000);
        return tbilisi.getUTCDate() + ' ' + MONTHS[tbilisi.getUTCMonth()] + ', ' + tbilisi.getUTCFullYear();
    }

    // How many characters of a post show on a card before it is cut off with "…"
    const EXCERPT_LENGTH = 160;

    function excerpt(text) {
        const flat = text.replace(/\s+/g, ' ').trim();
        if (flat.length <= EXCERPT_LENGTH) return flat;
        const cut = flat.slice(0, EXCERPT_LENGTH);
        const space = cut.lastIndexOf(' ');
        return cut.slice(0, space > EXCERPT_LENGTH * 0.6 ? space : EXCERPT_LENGTH) + '…';
    }

    function isImage(src) {
        return Boolean(src) && src.indexOf('data:image/') === 0;
    }

    function postUrl(post) {
        return 'article.html?id=' + encodeURIComponent(post.id);
    }

    // ----- a short card (home page and news page) -----
    // Everything is inserted with textContent (never innerHTML), so nothing typed
    // into a post can ever run as code on the site.
    function buildCard(post) {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.lang = 'ka'; // posts are written in Georgian whatever language the site is in

        if (isImage(post.thumb)) {
            const imgLink = document.createElement('a');
            imgLink.className = 'news-img-link';
            imgLink.href = postUrl(post);
            imgLink.tabIndex = -1;
            imgLink.setAttribute('aria-hidden', 'true');
            const img = document.createElement('img');
            img.className = 'news-img';
            img.src = post.thumb;
            img.alt = '';
            img.loading = 'lazy';
            imgLink.appendChild(img);
            card.appendChild(imgLink);
        }

        const body = document.createElement('div');
        body.className = 'news-body';

        const dateText = formatDate(post.date);
        if (dateText) {
            const time = document.createElement('time');
            time.className = 'news-date';
            time.dateTime = post.date;
            time.textContent = dateText;
            body.appendChild(time);
        }

        const title = document.createElement(listEl ? 'h2' : 'h3');
        const titleLink = document.createElement('a');
        titleLink.href = postUrl(post);
        titleLink.textContent = post.title;
        title.appendChild(titleLink);
        body.appendChild(title);

        const text = document.createElement('div');
        text.className = 'news-text';
        text.textContent = excerpt(post.text);
        body.appendChild(text);

        const more = document.createElement('a');
        more.className = 'news-more';
        more.href = postUrl(post);
        more.setAttribute('data-i18n', 'news.readMore'); // the language button re-translates it
        more.textContent = t('news.readMore');
        body.appendChild(more);

        card.appendChild(body);
        return card;
    }

    // ----- the home page slider -----
    // The cards sit in a row that scrolls sideways and "snaps" so one card always rests
    // in the middle; the arrows, the dots, the keyboard arrows and a finger swipe all
    // just scroll that row. The card nearest the middle is marked "is-active" (full
    // size), and its neighbours are shown smaller and faded.
    function initCarousel(track) {
        const prev = document.getElementById('newsPrev');
        const next = document.getElementById('newsNext');
        const dotsEl = document.getElementById('newsDots');
        const carousel = document.getElementById('newsCarousel');
        const cards = Array.prototype.slice.call(track.children);
        if (!prev || !next || !dotsEl || !carousel || cards.length === 0) return;

        const single = cards.length < 2;
        carousel.classList.toggle('is-single', single);
        dotsEl.hidden = single;

        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let active = 0;

        function scrollToCard(i, instant) {
            const card = cards[i];
            track.scrollTo({
                left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
                behavior: (instant || reduceMotion) ? 'auto' : 'smooth'
            });
        }

        function goTo(i) {
            scrollToCard(Math.max(0, Math.min(cards.length - 1, i)));
        }

        const dots = cards.map((card, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', String(i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
            return dot;
        });

        function setActive(i) {
            active = i;
            cards.forEach((card, n) => card.classList.toggle('is-active', n === i));
            dots.forEach((dot, n) => {
                dot.classList.toggle('is-active', n === i);
                if (n === i) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
            prev.disabled = i === 0;
            next.disabled = i === cards.length - 1;
        }

        // Works out which card is nearest the middle (runs at most once per frame while scrolling)
        let waiting = false;
        function updateActive() {
            waiting = false;
            const middle = track.scrollLeft + track.clientWidth / 2;
            let best = 0;
            let bestDistance = Infinity;
            cards.forEach((card, n) => {
                const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    best = n;
                }
            });
            if (best !== active) setActive(best);
        }

        track.addEventListener('scroll', () => {
            if (!waiting) {
                waiting = true;
                requestAnimationFrame(updateActive);
            }
        }, { passive: true });

        prev.addEventListener('click', () => goTo(active - 1));
        next.addEventListener('click', () => goTo(active + 1));

        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
        });

        // Keep the current card in the middle if the window is resized
        window.addEventListener('resize', () => scrollToCard(active, true));

        scrollToCard(0, true);
        setActive(0);
    }

    // ----- the list: newest posts first -----
    async function loadList() {
        const target = listEl || latestEl;
        const limit = listEl ? 12 : 5;
        setStatus('news.loading');

        const query = {
            structuredQuery: {
                // "select" = only these fields: the full-size photo stays behind
                select: { fields: ['title', 'text', 'thumb', 'date'].map((name) => ({ fieldPath: name })) },
                from: [{ collectionId: 'news' }],
                orderBy: [{ field: { fieldPath: 'date' }, direction: 'DESCENDING' }],
                limit: limit
            }
        };

        try {
            const response = await fetch(DB_URL + ':runQuery' + KEY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);

            const rows = await response.json();
            // An empty result comes back as [{ readTime: ... }] with no document in it
            const posts = rows.filter((row) => row.document).map((row) => parsePost(row.document))
                .filter((post) => post.title && post.id);

            target.textContent = '';
            if (posts.length === 0) {
                // Home page: keep the whole section hidden until the first post exists
                setStatus(listEl ? 'news.empty' : '');
                return;
            }

            setStatus('');
            posts.forEach((post) => target.appendChild(buildCard(post)));
            if (section) section.hidden = false; // must be visible before the slider can measure the cards
            if (latestEl) initCarousel(latestEl);
        } catch (err) {
            // Home page: stay silent so a hiccup never shows an error to visitors
            setStatus(listEl ? 'news.error' : '');
        }
    }

    // ----- one post in full (article.html?id=...) -----
    function showArticle(post) {
        articleEl.textContent = '';
        articleEl.lang = 'ka';

        if (isImage(post.image)) {
            const img = document.createElement('img');
            img.className = 'article-img';
            img.src = post.image;
            img.alt = '';
            articleEl.appendChild(img);
        }

        const dateText = formatDate(post.date);
        if (dateText) {
            const time = document.createElement('time');
            time.className = 'news-date';
            time.dateTime = post.date;
            time.textContent = dateText;
            articleEl.appendChild(time);
        }

        const title = document.createElement('h1');
        title.className = 'article-title';
        title.textContent = post.title;
        articleEl.appendChild(title);

        const text = document.createElement('div');
        text.className = 'news-text article-text';
        text.textContent = post.text;
        articleEl.appendChild(text);

        document.title = post.title + ' | ' + SITE_NAME;
        articleEl.hidden = false;
    }

    async function loadArticle() {
        const id = new URLSearchParams(window.location.search).get('id') || '';
        // Firestore ids are letters and digits only; anything else can't be a real post
        if (!/^[A-Za-z0-9]{1,64}$/.test(id)) {
            setStatus('news.notFound');
            return;
        }

        setStatus('news.loading');
        try {
            const response = await fetch(DB_URL + '/news/' + id + KEY);
            if (response.status === 404) {
                setStatus('news.notFound');
                return;
            }
            if (!response.ok) throw new Error('HTTP ' + response.status);

            const post = parsePost(await response.json());
            if (!post.title) {
                setStatus('news.notFound');
                return;
            }
            setStatus('');
            showArticle(post);
        } catch (err) {
            setStatus('news.error');
        }
    }

    if (articleEl) loadArticle();
    else loadList();
})();
