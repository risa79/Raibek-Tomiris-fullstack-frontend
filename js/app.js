"use strict";

/* ==========================================
   SKILLSWAP — JAVASCRIPT
========================================== */

const STORAGE_KEYS = {
    profile: "skillswap_profile",
    offers: "skillswap_offers",
    requests: "skillswap_requests"
};

const CATEGORIES = {
    programming: "💻 Программирование",
    languages: "🌍 Иностранные языки",
    design: "🎨 Дизайн",
    science: "📊 Наука и аналитика",
    other: "✨ Другое"
};

/* ==========================================
   ДЕМОНСТРАЦИОННЫЕ ПРЕДЛОЖЕНИЯ
========================================== */

const demoOffers = [
    {
        id: "demo-1",
        author: "Александр",
        university: "Satbayev University",
        title: "Python с нуля",
        category: "programming",
        wanted: "Английский язык",
        description: "Помогу разобраться с Python, переменными, циклами и функциями. Ищу партнёра для разговорной практики английского.",
        createdAt: "2026-10-01T10:00:00",
        demo: true
    },
    {
        id: "demo-2",
        author: "Мария",
        university: "КазНУ",
        title: "Разговорный английский",
        category: "languages",
        wanted: "Основы веб-разработки",
        description: "Помогу улучшить разговорный английский и подготовиться к собеседованиям. Хочу научиться создавать сайты.",
        createdAt: "2026-10-02T12:00:00",
        demo: true
    },
    {
        id: "demo-3",
        author: "Данияр",
        university: "SDU University",
        title: "UI/UX дизайн в Figma",
        category: "design",
        wanted: "JavaScript",
        description: "Научу создавать интерфейсы мобильных приложений и сайтов. Взамен хочу изучить JavaScript.",
        createdAt: "2026-10-03T09:00:00",
        demo: true
    },
    {
        id: "demo-4",
        author: "Алина",
        university: "Satbayev University",
        title: "Математика и статистика",
        category: "science",
        wanted: "Английский язык",
        description: "Объясню основы статистики, вероятности и анализа данных простым языком.",
        createdAt: "2026-10-04T15:00:00",
        demo: true
    },
    {
        id: "demo-5",
        author: "Руслан",
        university: "AITU",
        title: "HTML и CSS",
        category: "programming",
        wanted: "Графический дизайн",
        description: "Помогу сверстать первый адаптивный сайт. Хочу научиться работать с графикой.",
        createdAt: "2026-10-05T11:00:00",
        demo: true
    },
    {
        id: "demo-6",
        author: "Айгерим",
        university: "КазНУ",
        title: "Японский язык для начинающих",
        category: "languages",
        wanted: "Python",
        description: "Помогу выучить хирагану, катакану и базовые японские выражения.",
        createdAt: "2026-10-06T14:00:00",
        demo: true
    }
];

/* ==========================================
   РАБОТА С LOCALSTORAGE
========================================== */

function loadData(key, fallback) {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return fallback;
        }

        return JSON.parse(raw);
    } catch (error) {
        console.error("Ошибка чтения localStorage:", error);
        return fallback;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Ошибка сохранения:", error);
        alert("Не удалось сохранить данные в браузере.");
        return false;
    }
}

function getProfile() {
    return loadData(STORAGE_KEYS.profile, {
        name: "",
        university: "",
        bio: ""
    });
}

function getMyOffers() {
    const offers = loadData(STORAGE_KEYS.offers, []);

    return Array.isArray(offers) ? offers : [];
}

function getAllOffers() {
    return [...getMyOffers(), ...demoOffers];
}

/* ==========================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
========================================== */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

function getInitial(name) {
    return (String(name || "С").trim().charAt(0) || "С").toUpperCase();
}

function generateId() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `offer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function showMessage(message) {
    alert(message);
}

/* ==========================================
   МОБИЛЬНОЕ МЕНЮ
========================================== */

function initMobileMenu() {
    const toggle = document.getElementById("menuToggle");
    const links = document.getElementById("navLinks");

    if (!toggle || !links) {
        return;
    }

    toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");

        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute(
            "aria-label",
            isOpen ? "Закрыть меню" : "Открыть меню"
        );

        toggle.textContent = isOpen ? "✕" : "☰";
    });

    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "☰";
        });
    });
}

/* ==========================================
   СТРАНИЦА ПРОФИЛЯ
========================================== */

function initProfilePage() {
    const profileForm = document.getElementById("profileForm");
    const offerForm = document.getElementById("offerForm");

    if (!profileForm || !offerForm) {
        return;
    }

    const profile = getProfile();

    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileUniversity").value =
        profile.university || "";
    document.getElementById("profileBio").value = profile.bio || "";

    updateProfileDisplay();
    renderMyOffers();

    /* Сохранение профиля */

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedProfile = {
            name: document.getElementById("profileName").value.trim(),
            university: document.getElementById("profileUniversity").value.trim(),
            bio: document.getElementById("profileBio").value.trim()
        };

        if (!updatedProfile.name) {
            showMessage("Пожалуйста, укажи своё имя.");
            return;
        }

        if (saveData(STORAGE_KEYS.profile, updatedProfile)) {
            updateProfileDisplay();
            showMessage("Профиль успешно сохранён!");
        }
    });

    /* Создание предложения */

    offerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const currentProfile = getProfile();

        if (!currentProfile.name.trim()) {
            showMessage("Сначала сохрани своё имя в профиле.");
            document.getElementById("profileName").focus();
            return;
        }

        const title = document.getElementById("offerTitle").value.trim();
        const category = document.getElementById("offerCategory").value;
        const wanted = document.getElementById("offerWanted").value.trim();
        const description = document.getElementById("offerDescription").value.trim();

        if (!title || !category || !wanted || !description) {
            showMessage("Заполни все поля предложения.");
            return;
        }

        const newOffer = {
            id: generateId(),
            author: currentProfile.name,
            university: currentProfile.university || "Студент SkillSwap",
            title,
            category,
            wanted,
            description,
            createdAt: new Date().toISOString(),
            demo: false
        };

        const offers = getMyOffers();

        offers.unshift(newOffer);

        if (saveData(STORAGE_KEYS.offers, offers)) {
            offerForm.reset();
            renderMyOffers();

            showMessage(
                "Предложение опубликовано! Теперь оно доступно в каталоге."
            );
        }
    });
}

function updateProfileDisplay() {
    const profile = getProfile();

    const displayName = document.getElementById("profileDisplayName");
    const avatar = document.getElementById("profileAvatar");

    if (displayName) {
        displayName.textContent = profile.name || "Студент SkillSwap";
    }

    if (avatar) {
        avatar.textContent = getInitial(profile.name);
    }
}

function renderMyOffers() {
    const list = document.getElementById("myOffersList");
    const empty = document.getElementById("myOffersEmpty");
    const count = document.getElementById("profileOffersCount");

    if (!list || !empty) {
        return;
    }

    const offers = getMyOffers();

    if (count) {
        count.textContent = offers.length;
    }

    list.innerHTML = "";

    empty.hidden = offers.length > 0;

    offers.forEach((offer) => {
        const item = document.createElement("div");

        item.className = "my-offer-item";

        item.innerHTML = `
            <div class="my-offer-info">
                <h3>${escapeHTML(offer.title)}</h3>

                <p>
                    ${escapeHTML(CATEGORIES[offer.category] || "Другое")}
                    · Хочу изучить:
                    ${escapeHTML(offer.wanted)}
                </p>
            </div>

            <div class="my-offer-actions">
                <button
                    type="button"
                    class="btn-danger"
                    data-delete-id="${escapeHTML(offer.id)}">
                    Удалить
                </button>
            </div>
        `;

        list.appendChild(item);
    });
}

function initDeleteOffers() {
    const list = document.getElementById("myOffersList");

    if (!list) {
        return;
    }

    list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-delete-id]");

        if (!button) {
            return;
        }

        const id = button.dataset.deleteId;

        const confirmed = confirm(
            "Ты действительно хочешь удалить это предложение?"
        );

        if (!confirmed) {
            return;
        }

        const updatedOffers = getMyOffers().filter(
            (offer) => String(offer.id) !== id
        );

        if (saveData(STORAGE_KEYS.offers, updatedOffers)) {
            renderMyOffers();
        }
    });
}

/* ==========================================
   СТРАНИЦА КАТАЛОГА
========================================== */

let currentCategory = "all";

function initOffersPage() {
    const grid = document.getElementById("offersGrid");

    if (!grid) {
        return;
    }

    const searchInput = document.getElementById("searchInput");
    const filters = document.getElementById("categoryFilters");
    const sortSelect = document.getElementById("sortSelect");
    const resetButton = document.getElementById("resetFilters");

    renderOffers();

    /* Поиск */

    searchInput?.addEventListener("input", renderOffers);

    /* Фильтрация */

    filters?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-category]");

        if (!button) {
            return;
        }

        currentCategory = button.dataset.category;

        filters.querySelectorAll(".filter-btn").forEach((filter) => {
            filter.classList.toggle(
                "active",
                filter === button
            );
        });

        renderOffers();
    });

    /* Сортировка */

    sortSelect?.addEventListener("change", renderOffers);

    /* Сброс */

    resetButton?.addEventListener("click", () => {
        searchInput.value = "";
        sortSelect.value = "newest";
        currentCategory = "all";

        filters.querySelectorAll(".filter-btn").forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.category === "all"
            );
        });

        renderOffers();
    });

    /* Открытие модального окна */

    grid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-exchange-id]");

        if (!button) {
            return;
        }

        openExchangeModal(button.dataset.exchangeId);
    });

    initExchangeModal();
}

function renderOffers() {
    const grid = document.getElementById("offersGrid");

    if (!grid) {
        return;
    }

    const search = (
        document.getElementById("searchInput")?.value || ""
    ).trim().toLowerCase();

    const sort = document.getElementById("sortSelect")?.value || "newest";

    let offers = getAllOffers();

    /* Поиск по нескольким полям */

    offers = offers.filter((offer) => {
        const searchableText = [
            offer.author,
            offer.university,
            offer.title,
            offer.wanted,
            offer.description,
            CATEGORIES[offer.category]
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(search);

        const matchesCategory =
            currentCategory === "all" ||
            offer.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    /* Сортировка */

    if (sort === "az") {
        offers.sort((a, b) =>
            a.title.localeCompare(b.title, "ru")
        );
    } else {
        offers.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    /* Количество результатов */

    const resultsCount = document.getElementById("resultsCount");

    if (resultsCount) {
        resultsCount.textContent =
            `Найдено предложений: ${offers.length}`;
    }

    /* Пустой результат */

    const emptyState = document.getElementById("emptyState");

    if (emptyState) {
        emptyState.hidden = offers.length > 0;
    }

    /* Создание карточек */

    grid.innerHTML = offers.map(createOfferCard).join("");
}

function createOfferCard(offer) {
    const category = CATEGORIES[offer.category] || "✨ Другое";

    return `
        <article class="offer-card">

            <div class="offer-card-header">

                <div class="offer-avatar">
                    ${escapeHTML(getInitial(offer.author))}
                </div>

                <div class="offer-author">
                    <h3>${escapeHTML(offer.author)}</h3>
                    <p>${escapeHTML(offer.university)}</p>
                </div>

            </div>

            <span class="offer-category">
                ${escapeHTML(category)}
            </span>

            <span class="offer-skill-label">
                МОГУ НАУЧИТЬ
            </span>

            <h3 class="offer-skill-title">
                ${escapeHTML(offer.title)}
            </h3>

            <div class="offer-exchange">

                <span class="offer-exchange-icon">⇄</span>

                <div>
                    <p>Хочу изучить взамен</p>
                    <strong>${escapeHTML(offer.wanted)}</strong>
                </div>

            </div>

            <p class="offer-description">
                ${escapeHTML(offer.description)}
            </p>

            <button
                type="button"
                class="btn btn-primary"
                data-exchange-id="${escapeHTML(offer.id)}">
                Предложить обмен →
            </button>

        </article>
    `;
}

/* ==========================================
   МОДАЛЬНОЕ ОКНО ОБМЕНА
========================================== */

function openExchangeModal(offerId) {
    const modal = document.getElementById("exchangeModal");
    const selectedOffer = getAllOffers().find(
        (offer) => String(offer.id) === offerId
    );

    if (!modal || !selectedOffer) {
        return;
    }

    document.getElementById("selectedOfferId").value = offerId;

    document.getElementById("modalDescription").textContent =
        `Ты предлагаешь обмен студенту ${selectedOffer.author}. ` +
        `Он предлагает «${selectedOffer.title}» ` +
        `и хочет изучить «${selectedOffer.wanted}».`;

    const profile = getProfile();

    document.getElementById("exchangeName").value = profile.name || "";

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    document.getElementById("exchangeName").focus();
}

function closeExchangeModal() {
    const modal = document.getElementById("exchangeModal");

    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.style.overflow = "";

    document.getElementById("exchangeForm")?.reset();
}

function initExchangeModal() {
    const modal = document.getElementById("exchangeModal");
    const form = document.getElementById("exchangeForm");

    if (!modal || !form) {
        return;
    }

    document.getElementById("closeModal")?.addEventListener(
        "click",
        closeExchangeModal
    );

    document.getElementById("cancelExchange")?.addEventListener(
        "click",
        closeExchangeModal
    );

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeExchangeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeExchangeModal();
        }
    });

    /* Отправка заявки */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const offerId = document.getElementById("selectedOfferId").value;

        const request = {
            id: generateId(),
            offerId,
            name: document.getElementById("exchangeName").value.trim(),
            skill: document.getElementById("exchangeSkill").value.trim(),
            message: document.getElementById("exchangeMessage").value.trim(),
            createdAt: new Date().toISOString()
        };

        if (!request.name || !request.skill || !request.message) {
            showMessage("Пожалуйста, заполни все поля.");
            return;
        }

        const requests = loadData(STORAGE_KEYS.requests, []);

        const updatedRequests = Array.isArray(requests)
            ? requests
            : [];

        updatedRequests.push(request);

        if (saveData(STORAGE_KEYS.requests, updatedRequests)) {
            closeExchangeModal();

            showMessage(
                "Заявка сохранена!\n\n" +
                "Это демонстрационная версия SkillSwap. " +
                "Заявка хранится только в твоём браузере " +
                "и пока не отправляется другому студенту."
            );
        }
    });
}

/* ==========================================
   ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();

    initProfilePage();
    initDeleteOffers();

    initOffersPage();
});