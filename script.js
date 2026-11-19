// ==========================================
// 0. GLOBAL: DARK MODE & HEADER DINAMIC (pe toate paginile)
// ==========================================
(function initGlobalUI() {
    // 1. Aplică tema salvată imediat
    // Adaugă automat favicon pe toate paginile
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%232a9d8f'><path d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/></svg>";
    document.head.appendChild(favicon);
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    const navActions = document.querySelector('.navbar .d-flex');
    if (navActions) {
        navActions.classList.add('align-items-center', 'gap-2');

        // 2. Injectează butonul de Dark Mode în header
        const themeBtn = document.createElement('button');
        themeBtn.type = 'button';
        themeBtn.className = 'btn btn-theme-toggle';
        themeBtn.setAttribute('aria-label', 'Schimbă tema');
        themeBtn.innerHTML = savedTheme === 'dark'
            ? '<i class="bi bi-sun-fill"></i>'
            : '<i class="bi bi-moon-stars-fill"></i>';

        themeBtn.addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
            }
        });

        navActions.prepend(themeBtn);

        // 3. Header dinamic (Avatar + Nume când ești logat)
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const profileBtn = navActions.querySelector('a[href="profil.html"]');
        if (currentUser && profileBtn) {
            const defaultAvatar = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4';
            const avatarUrl = currentUser.avatar || defaultAvatar;
            const firstName = currentUser.name.split(' ')[0];
            profileBtn.classList.add('d-flex', 'align-items-center', 'gap-2');
            profileBtn.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="nav-avatar"><span>${firstName}</span>`;
        }
    }
})();

// ==========================================
// 1. LOGICA PENTRU PAGINA CATALOG (catalog.html)
// ==========================================
const filterForm = document.getElementById('filterForm');

if (filterForm) {
    // Adaugă automat ?id=1 ... ?id=14 la cardurile inițiale
    document.querySelectorAll('.event-item').forEach((item, index) => {
        const link = item.querySelector('a[href="detalii.html"]');
        if (link) link.href = `detalii.html?id=${index + 1}`;
    });

    const eventsList = document.getElementById('eventsList');
    const searchInput = document.getElementById('searchInput');
    const domainFilter = document.getElementById('domainFilter');
    const cityFilter = document.getElementById('cityFilter');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const proposeForm = document.getElementById('proposeForm');

    const domainLabels = {
        mediu: 'Mediu',
        ecologizare: 'Ecologizare',
        animale: 'Animale',
        educatie: 'Educație',
        social: 'Social',
        sanatate: 'Sănătate'
    };

    const cityLabels = {
        timisoara: 'Timișoara',
        resita: 'Reșița',
        arad: 'Arad'
    };

    const domainImages = {
        mediu: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
        ecologizare: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
        animale: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
        educatie: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
        social: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
        sanatate: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
    };

    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function ensureCityInFilter(cityKey, cityDisplay) {
        if (!cityKey || !cityDisplay) return;
        const exists = Array.from(cityFilter.options).some(opt => opt.value === cityKey);
        if (!exists) {
            const opt = document.createElement('option');
            opt.value = cityKey;
            opt.textContent = cityDisplay;
            cityFilter.appendChild(opt);
        }
    }

    function createEventCard(ev) {
        const col = document.createElement('div');
        col.className = 'col-12 col-lg-6 event-item';
        col.dataset.domain = ev.domain;
        col.dataset.city = ev.city;
        const displayCity = ev.location || cityLabels[ev.city] || ev.city;

        col.innerHTML = `
            <article class="card cause-card h-100">
                <div class="row g-0 h-100">
                    <div class="col-md-5">
                        <img src="${ev.img}" class="catalog-img w-100 h-100" alt="${ev.title}">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body d-flex flex-column h-100">
                            <span class="badge badge-category align-self-start mb-2">${ev.category}</span>
                            <h3 class="card-title h5">${ev.title}</h3>
                            <p class="card-text small">${ev.desc1}</p>
                            <p class="cause-meta mt-auto mb-3"><i class="bi bi-calendar-event me-1"></i>${ev.date} &bull; ${displayCity}</p>
                            <a href="detalii.html?id=${ev.id}" class="btn btn-outline-primary-custom btn-sm">Vezi detalii</a>
                        </div>
                    </div>
                </div>
            </article>
        `;
        return col;
    }

    // Încarcă cauzele propuse de utilizatori din localStorage
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    customEvents.forEach(ev => {
        ensureCityInFilter(ev.city, ev.location);
        eventsList.prepend(createEventCard(ev));
    });

    function filterEvents() {
        const query = normalizeText(searchInput.value.trim());
        const selectedDomain = domainFilter.value;
        const selectedCity = cityFilter.value;
        const eventItems = document.querySelectorAll('.event-item');
        let visibleCount = 0;

        eventItems.forEach(item => {
            const title = normalizeText(item.querySelector('.card-title').textContent);
            const description = normalizeText(item.querySelector('.card-text').textContent);
            const domain = item.dataset.domain;
            const city = item.dataset.city;

            const matchesSearch = query === '' || title.includes(query) || description.includes(query);
            const matchesDomain = selectedDomain === 'all' || domain === selectedDomain;
            const matchesCity = selectedCity === 'all' || city === selectedCity;

            if (matchesSearch && matchesDomain && matchesCity) {
                item.classList.remove('d-none');
                visibleCount++;
            } else {
                item.classList.add('d-none');
            }
        });

        resultsCount.textContent = visibleCount;
        noResults.classList.toggle('d-none', visibleCount > 0);

        const hasActiveFilters = query !== '' || selectedDomain !== 'all' || selectedCity !== 'all';
        resetFiltersBtn.classList.toggle('d-none', !hasActiveFilters);
    }

    searchInput.addEventListener('input', filterEvents);
    domainFilter.addEventListener('change', filterEvents);
    cityFilter.addEventListener('change', filterEvents);

    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterEvents();
    });

    resetFiltersBtn.addEventListener('click', function() {
        searchInput.value = '';
        domainFilter.value = 'all';
        cityFilter.value = 'all';
        filterEvents();
    });

    // Formular Propune o cauză (cu poză opțională și oraș dinamic)
    if (proposeForm) {
        function saveAndRenderEvent(imgSrc) {
            const domain = document.getElementById('propDomain').value;
            const cityDisplay = document.getElementById('propCity').value.trim();
            const cityKey = normalizeText(cityDisplay);

            const newEvent = {
                id: 'custom-' + Date.now(),
                title: document.getElementById('propTitle').value.trim(),
                domain: domain,
                category: domainLabels[domain],
                city: cityKey,
                org: document.getElementById('propOrg').value.trim(),
                date: document.getElementById('propDate').value.trim(),
                location: cityDisplay,
                duration: '3 ore (+50 XP)',
                spotsLeft: 20,
                spotsTotal: 20,
                img: imgSrc || domainImages[domain],
                desc1: document.getElementById('propDesc').value.trim(),
                desc2: 'Cauză propusă de comunitatea VolunteerHub. Toate detaliile organizatorice vor fi comunicate participanților înscriși.'
            };

            try {
                const saved = JSON.parse(localStorage.getItem('customEvents') || '[]');
                saved.push(newEvent);
                localStorage.setItem('customEvents', JSON.stringify(saved));
            } catch (err) {
                alert('Imaginea este prea mare pentru stocarea locală. Încearcă o poză mai mică (sub 1-2 MB) sau lasă câmpul gol.');
                return;
            }

            ensureCityInFilter(cityKey, cityDisplay);
            eventsList.prepend(createEventCard(newEvent));
            proposeForm.reset();

            const modalEl = document.getElementById('proposeModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();

            filterEvents();
        }

        proposeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('propImage');
            const file = fileInput ? fileInput.files[0] : null;

            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    saveAndRenderEvent(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                saveAndRenderEvent(null);
            }
        });
    }

    filterEvents();
}

// ==========================================
// 2. LOGICA PENTRU PAGINA DETALII (detalii.html)
// ==========================================
const enrollBtn = document.getElementById('enrollBtn');

if (enrollBtn) {
    const eventsData = {
        1: {
            title: "Plantare de copaci - Timișoara",
            category: "Mediu",
            org: "ONG Verde Timișoara",
            date: "24 Octombrie, 09:00",
            location: "Parcul Central, Timișoara",
            duration: "4 ore (+60 XP)",
            spotsLeft: 14,
            spotsTotal: 40,
            img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
            desc1: "Alătură-te echipei ONG Verde pentru plantarea a 300 de puieți în zona Parcului Central și extinderea spațiilor verzi din oraș.",
            desc2: "Uneltele de plantat, mănușile și puieții sunt asigurate de organizatori. Nu este necesară experiență anterioară."
        },
        2: {
            title: "Ecologizare Malul Begăi",
            category: "Ecologizare",
            org: "Asociația Banatul Verde",
            date: "2 Noiembrie, 09:30",
            location: "Splaiul T. Vladimirescu, Timișoara",
            duration: "3 ore (+50 XP)",
            spotsLeft: 12,
            spotsTotal: 30,
            img: "images/raulbega.jpg",
            desc1: "Ne strângem pe malul Begăi pentru o acțiune de curățenie și colectare selectivă pe tronsonul dintre Podul Decebal și Parcul Alpinet.",
            desc2: "Toate materialele necesare (mănuși de protecție, saci biodegradabili pe culori și apă) sunt asigurate de organizatori."
        },
        3: {
            title: "Ajutor la Adăpostul de Animale",
            category: "Animale",
            org: "Asociația Speranța Reșița",
            date: "9 Noiembrie, 10:00",
            location: "Adăpostul Speranța, Reșița",
            duration: "3 ore (+50 XP)",
            spotsLeft: 8,
            spotsTotal: 20,
            img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80",
            desc1: "Avem nevoie de voluntari iubitori de animale pentru plimbarea câinilor, hrănire și organizarea spațiilor de joacă.",
            desc2: "Vei lucra sub îndrumarea îngrijitorilor adăpostului și vei ajuta la socializarea cățeilor pregătiți pentru adopție."
        },
        4: {
            title: "Atelier de teme pentru copii",
            category: "Educație",
            org: "Fundația Viitorul Copiilor",
            date: "16 Noiembrie, 14:00",
            location: "Centrul Educațional, Timișoara",
            duration: "2 ore (+40 XP)",
            spotsLeft: 6,
            spotsTotal: 15,
            img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
            desc1: "Ajutăm elevii din clasele primare la teme de matematică, limba română și jocuri educative într-un mediu prietenos.",
            desc2: "Materialele didactice și fișele de lucru sunt pregătite de coordonatorii centrului."
        },
        5: {
            title: "Pachete alimentare pentru seniori",
            category: "Social",
            org: "Asociația Împreună pentru Comunitate",
            date: "21 Noiembrie, 10:00",
            location: "Zona Elisabetin, Timișoara",
            duration: "3 ore (+50 XP)",
            spotsLeft: 10,
            spotsTotal: 25,
            img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80",
            desc1: "Pregătim și distribuim pachete cu alimente de bază către persoanele vârstnice singure din cartierele Timișoarei.",
            desc2: "Ne întâlnim la depozitul asociației pentru sortare, apoi echipele de câte 2 voluntari livrează pachetele."
        },
        6: {
            title: "Ecologizare Lacul Secu",
            category: "Ecologizare",
            org: "Eco Caraș-Severin",
            date: "23 Noiembrie, 09:00",
            location: "Lacul Secu, Reșița",
            duration: "4 ore (+65 XP)",
            spotsLeft: 15,
            spotsTotal: 35,
            img: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
            desc1: "Strângem deșeurile de pe malurile Lacului Secu și montăm panouri de informare ecologică pentru turiști.",
            desc2: "Transportul din centrul Reșiței până la lac este asigurat cu microbuzul asociației."
        },
        7: {
            title: "Campanie de donare de sânge",
            category: "Sănătate",
            org: "Crucile Roșii Studențești",
            date: "25 Noiembrie, 08:30",
            location: "Campus Universitar, Timișoara",
            duration: "4 ore (+60 XP)",
            spotsLeft: 9,
            spotsTotal: 20,
            img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80",
            desc1: "Căutăm voluntari pentru îndrumarea donatorilor, distribuirea materialelor informative și gestionarea zonei de odihnă.",
            desc2: "Activitatea se desfășoară împreună cu personalul Centrului Regional de Transfuzie Sanguină."
        },
        8: {
            title: "Târg de adopții și îngrijire pisici",
            category: "Animale",
            org: "Asociația Prietenii Blănoșilor",
            date: "28 Noiembrie, 11:00",
            location: "Parcul Eminescu, Arad",
            duration: "3 ore (+45 XP)",
            spotsLeft: 7,
            spotsTotal: 15,
            img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80",
            desc1: "Organizăm un târg de adopții responsabile pentru pisici salvate și oferim informații vizitatorilor despre îngrijirea lor.",
            desc2: "Voluntarii vor ajuta la amenajarea standului, supravegherea pisicilor și completarea fișelor de adopție."
        },
        9: {
            title: "Inițiere digitală pentru vârstnici",
            category: "Educație",
            org: "Conectăm Generații",
            date: "30 Noiembrie, 15:00",
            location: "Biblioteca Județeană, Reșița",
            duration: "2 ore (+40 XP)",
            spotsLeft: 5,
            spotsTotal: 12,
            img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
            desc1: "Îi învățăm pe seniori cum să folosească smartphone-ul, să facă apeluri video cu familia și să se ferească de fraude online.",
            desc2: "Fiecare voluntar lucrează 1-la-1 cu 1 sau 2 participanți, într-o atmosferă relaxată."
        },
        10: {
            title: "Reîmpădurire Pădurea Verde",
            category: "Mediu",
            org: "Inițiativa Verde Banat",
            date: "5 Decembrie, 09:00",
            location: "Pădurea Verde, Timișoara",
            duration: "4 ore (+65 XP)",
            spotsLeft: 18,
            spotsTotal: 45,
            img: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80",
            desc1: "Acțiune de weekend pentru plantarea de stejari tineri și îngrijirea zonei forestiere de la marginea orașului.",
            desc2: "Se recomandă bocanci sau încălțăminte impermeabilă; ceaiul cald și gustările sunt din partea casei."
        },
        11: {
            title: "Colectare haine și jucării de iarnă",
            category: "Social",
            org: "Zâmbet de Iarnă Arad",
            date: "7 Decembrie, 10:00",
            location: "Centrul Civic, Arad",
            duration: "3 ore (+50 XP)",
            spotsLeft: 11,
            spotsTotal: 25,
            img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
            desc1: "Sortăm și împachetăm donațiile de haine groase, ghete și jucării pentru copiii din satele județului Arad.",
            desc2: "Activitatea are loc în interior, într-un spațiu încălzit pus la dispoziție de partenerii locali."
        },
        12: {
            title: "Curățenie pe traseele din Semenic",
            category: "Ecologizare",
            org: "Prietenii Munților Banatului",
            date: "12 Decembrie, 08:30",
            location: "Platoul Semenic, Reșița",
            duration: "5 ore (+80 XP)",
            spotsLeft: 10,
            spotsTotal: 25,
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
            desc1: "Igienizăm potecile turistice și verificăm marcajele montane împreună cu voluntarii salvamontiști.",
            desc2: "Echipamentul de munte (geacă de vânt și bocanci) este obligatoriu."
        },
        13: {
            title: "Atelier de prim ajutor în școli",
            category: "Sănătate",
            org: "Voluntarii pentru Viață",
            date: "14 Decembrie, 11:00",
            location: "Colegiul Național, Arad",
            duration: "3 ore (+55 XP)",
            spotsLeft: 6,
            spotsTotal: 14,
            img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
            desc1: "Sprijinim paramedicii în demonstrațiile practice de prim ajutor dedicate elevilor de liceu.",
            desc2: "Vei ajuta la organizarea manechinelor de antrenament și la coordonarea grupelor de elevi."
        },
        14: {
            title: "Meditații la informatică pentru liceeni",
            category: "Educație",
            org: "Code4Future Timișoara",
            date: "19 Decembrie, 16:00",
            location: "Hub Educațional, Timișoara",
            duration: "2 ore (+45 XP)",
            spotsLeft: 4,
            spotsTotal: 10,
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
            desc1: "Oferim sprijin gratuit elevilor de clasa a XII-a care se pregătesc pentru examenul de bacalaureat și admiterea la facultate.",
            desc2: "Ideal pentru studenți din domenii tehnice care vor să explice algoritmi, C++ sau baze de date."
        }
    };

    // Adaugă și cauzele propuse de utilizatori
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    customEvents.forEach(ev => {
        eventsData[ev.id] = ev;
    });

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id') || '2';
    const currentEvent = eventsData[eventId] || eventsData[2];

    document.title = `VolunteerHub - ${currentEvent.title}`;
    document.getElementById('eventImg').src = currentEvent.img;
    document.getElementById('eventImg').alt = currentEvent.title;
    document.getElementById('eventCategory').textContent = currentEvent.category;
    document.getElementById('eventTitle').textContent = currentEvent.title;
    document.getElementById('eventOrg').textContent = currentEvent.org;
    document.getElementById('eventDate').textContent = currentEvent.date;
    document.getElementById('eventLocation').textContent = currentEvent.location;
    document.getElementById('eventDuration').textContent = currentEvent.duration;
    document.getElementById('spotsLeft').textContent = currentEvent.spotsLeft;
    document.getElementById('spotsTotal').textContent = currentEvent.spotsTotal;
    document.getElementById('eventDesc1').textContent = currentEvent.desc1;
    document.getElementById('eventDesc2').textContent = currentEvent.desc2;
    document.getElementById('enrolledTitle').textContent = currentEvent.title;

    const enrollMessage = document.getElementById('enrollMessage');
    const spotsLeftEl = document.getElementById('spotsLeft');

    // Blocare înscriere dublă dacă utilizatorul e deja înscris
    const existingEnrolled = JSON.parse(localStorage.getItem('enrolledEvents') || '[]');
    if (existingEnrolled.some(e => e.title === currentEvent.title)) {
        enrollBtn.disabled = true;
        enrollBtn.classList.remove('btn-accent');
        enrollBtn.classList.add('btn-success');
        enrollBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Ești deja înscris ✓';
        spotsLeftEl.textContent = Math.max(0, currentEvent.spotsLeft - 1);
    }

    enrollBtn.addEventListener('click', function() {
        enrollBtn.disabled = true;
        enrollBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Ești înscris!';
        spotsLeftEl.textContent = Math.max(0, currentEvent.spotsLeft - 1);
        enrollMessage.classList.remove('d-none');

        const enrolled = JSON.parse(localStorage.getItem('enrolledEvents') || '[]');
        if (!enrolled.some(e => e.title === currentEvent.title)) {
            enrolled.push({
                title: currentEvent.title,
                date: currentEvent.date,
                location: currentEvent.location,
                category: currentEvent.category
            });
            localStorage.setItem('enrolledEvents', JSON.stringify(enrolled));
        }

        setTimeout(function() {
            window.location.href = 'profil.html';
        }, 1500);
    });
}

// ==========================================
// 3. LOGICA PENTRU PAGINA PROFIL & CONT (profil.html)
// ==========================================
const authSection = document.getElementById('authSection');
const profileSection = document.getElementById('profileSection');

if (authSection && profileSection) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authAlert = document.getElementById('authAlert');
    const logoutBtn = document.getElementById('logoutBtn');

    const enrolledList = document.getElementById('enrolledList');
    const noEnrolledMsg = document.getElementById('noEnrolledMsg');
    const activeEnrollCount = document.getElementById('activeEnrollCount');
    const statHours = document.getElementById('statHours');
    const statXP = document.getElementById('statXP');

    function showAuthAlert(message, type) {
        authAlert.textContent = message;
        authAlert.className = `alert alert-${type}`;
    }

    function renderEnrolledEvents() {
        const enrolled = JSON.parse(localStorage.getItem('enrolledEvents') || '[]');
        activeEnrollCount.textContent = enrolled.length;
        statHours.textContent = enrolled.length * 3;
        statXP.textContent = `${enrolled.length * 50} XP`;
        enrolledList.innerHTML = '';

        if (enrolled.length === 0) {
            noEnrolledMsg.classList.remove('d-none');
            return;
        }

        noEnrolledMsg.classList.add('d-none');

        enrolled.forEach((ev, index) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6';
            col.innerHTML = `
                <div class="profile-card p-4 h-100 d-flex flex-column">
                    <span class="badge badge-category align-self-start mb-2">${ev.category}</span>
                    <h3 class="h5 mb-2">${ev.title}</h3>
                    <p class="cause-meta mb-3">
                        <i class="bi bi-calendar-event me-1"></i>${ev.date}<br>
                        <i class="bi bi-geo-alt me-1"></i>${ev.location}
                    </p>
                    <button type="button" class="btn btn-outline-danger btn-sm mt-auto align-self-start remove-enroll-btn" data-index="${index}">
                        <i class="bi bi-x-circle me-1"></i>Anulează înscrierea
                    </button>
                </div>
            `;
            enrolledList.appendChild(col);
        });

        document.querySelectorAll('.remove-enroll-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = Number(this.dataset.index);
                const updated = JSON.parse(localStorage.getItem('enrolledEvents') || '[]');
                updated.splice(idx, 1);
                localStorage.setItem('enrolledEvents', JSON.stringify(updated));
                renderEnrolledEvents();
            });
        });
    }

    function updateProfileView() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            authSection.classList.add('d-none');
            profileSection.classList.remove('d-none');

            document.getElementById('profileName').textContent = currentUser.name;
            document.getElementById('profileCity').textContent = currentUser.city;
            document.getElementById('profileEmail').textContent = currentUser.email;
            document.getElementById('profileBio').textContent =
                currentUser.bio || 'Voluntar implicat în comunitatea locală.';

            const defaultAvatar = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4';
            const userAvatar = currentUser.avatar || defaultAvatar;
            document.getElementById('profileAvatar').src = userAvatar;

            document.querySelectorAll('.avatar-option').forEach(img => {
                img.classList.toggle('selected', img.src === userAvatar);
            });

            renderEnrolledEvents();
        } else {
            authSection.classList.remove('d-none');
            profileSection.classList.add('d-none');
        }
    }

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const city = document.getElementById('regCity').value.trim();
        const bio = document.getElementById('regBio').value.trim();
        const password = document.getElementById('regPassword').value;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            showAuthAlert('Există deja un cont cu acest email. Încearcă să te autentifici.', 'danger');
            return;
        }

        const newUser = { name, email, city, bio, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        window.location.reload();
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (!foundUser) {
            showAuthAlert('Email sau parolă incorectă. Dacă nu ai cont, apasă pe „Creează cont”.', 'danger');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.reload();
    });

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.reload();
    });

    document.querySelectorAll('.avatar-option').forEach(img => {
        img.addEventListener('click', function() {
            const selectedSrc = this.src;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) return;

            currentUser.avatar = selectedSrc;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.map(u => u.email === currentUser.email ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            const navAvatar = document.querySelector('.nav-avatar');
            if (navAvatar) navAvatar.src = selectedSrc;

            updateProfileView();
        });
    });

    updateProfileView();
}

// ==========================================
// 4. LOGICA PENTRU PAGINA RECOMPENSE (recompense.html)
// ==========================================
const badgesGrid = document.getElementById('badgesGrid');

if (badgesGrid) {
    const xpProgressBar = document.getElementById('xpProgressBar');
    const currentXPText = document.getElementById('currentXPText');
    const nextLevelText = document.getElementById('nextLevelText');
    const availableXPEl = document.getElementById('availableXP');
    const rewardLevelBadge = document.getElementById('rewardLevelBadge');
    const rewardAlert = document.getElementById('rewardAlert');

    function updateRewardsView() {
        const enrolled = JSON.parse(localStorage.getItem('enrolledEvents') || '[]');
        const claimedRewards = JSON.parse(localStorage.getItem('claimedRewards') || '[]');

        const totalXP = enrolled.length * 50;
        const spentXP = claimedRewards.reduce((sum, r) => sum + r.cost, 0);
        const availableXP = Math.max(0, totalXP - spentXP);

        const level = Math.floor(totalXP / 100) + 1;
        const nextLevelXP = level * 100;
        const progressPercent = Math.min(100, ((totalXP % 100) / 100) * 100);

        rewardLevelBadge.textContent = `Nivel ${level} • Voluntar Activ`;
        xpProgressBar.style.width = `${progressPercent}%`;
        currentXPText.textContent = `${totalXP} XP acumulați`;
        nextLevelText.textContent = `Următorul nivel: ${nextLevelXP} XP`;
        availableXPEl.textContent = `${availableXP} XP`;

        document.querySelectorAll('.badge-card').forEach(card => {
            const req = Number(card.dataset.reqEvents);
            const statusBadge = card.querySelector('.status-badge');

            if (enrolled.length >= req) {
                card.classList.add('unlocked');
                statusBadge.textContent = 'Deblocat';
                statusBadge.className = 'badge status-badge bg-success';
            } else {
                card.classList.remove('unlocked');
                statusBadge.textContent = `Necesită ${req} ${req === 1 ? 'eveniment' : 'evenimente'}`;
                statusBadge.className = 'badge status-badge bg-secondary';
            }
        });

        document.querySelectorAll('.claim-reward-btn').forEach(btn => {
            const id = btn.dataset.id;
            const cost = Number(btn.dataset.cost);
            const isClaimed = claimedRewards.some(r => r.id === id);

            if (isClaimed) {
                btn.disabled = true;
                btn.textContent = 'Revendicat ✓';
                btn.className = 'btn btn-success btn-sm mt-auto claim-reward-btn';
            } else if (availableXP < cost) {
                btn.disabled = true;
                btn.textContent = `Ai nevoie de ${cost} XP`;
            } else {
                btn.disabled = false;
                btn.textContent = `Revendică (${cost} XP)`;
            }
        });
    }

    document.querySelectorAll('.claim-reward-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const cost = Number(this.dataset.cost);
            const name = this.dataset.name;

            const claimed = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
            if (!claimed.some(r => r.id === id)) {
                claimed.push({ id, cost, name });
                localStorage.setItem('claimedRewards', JSON.stringify(claimed));

                rewardAlert.textContent = `Felicitări! Ai revendicat recompensa „${name}”.`;
                rewardAlert.className = 'alert alert-success mb-4';
                updateRewardsView();
            }
        });
    });

    updateRewardsView();
}