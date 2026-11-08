/* Haven House Service Navigation Assistant prototype.
   This is client-side demonstration logic only; it does not contact a server.
*/

document.addEventListener("DOMContentLoaded", function () {
    const yearElements = document.querySelectorAll("[data-year]");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = siteNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    const assistantPanel = document.getElementById("assistant-panel");
    const openAssistantButtons = document.querySelectorAll("[data-open-assistant]");
    const closeAssistantButton = document.querySelector(".assistant-close");
    const assistantForm = document.getElementById("assistant-form");
    const assistantInput = document.getElementById("assistant-input");
    const assistantMessages = document.getElementById("assistant-messages");
    const quickReplyButtons = document.querySelectorAll("[data-question]");

    function openAssistant() {
        if (!assistantPanel) {
            return;
        }

        assistantPanel.hidden = false;

        if (assistantInput) {
            assistantInput.focus();
        }
    }

    function closeAssistant() {
        if (assistantPanel) {
            assistantPanel.hidden = true;
        }
    }

    openAssistantButtons.forEach(function (button) {
        button.addEventListener("click", openAssistant);
    });

    if (closeAssistantButton) {
        closeAssistantButton.addEventListener("click", closeAssistant);
    }

    function addMessage(text, className) {
        if (!assistantMessages) {
            return;
        }

        const message = document.createElement("div");
        message.className = "message " + className;
        message.textContent = text;
        assistantMessages.appendChild(message);
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }

    function isSafetyConcern(text) {
        const normalized = text.toLowerCase();

        const safetyPatterns = [
            /suicid/,
            /kill myself/,
            /hurt myself/,
            /self[- ]?harm/,
            /end my life/,
            /not safe/,
            /being abused/,
            /domestic violence/,
            /sexual assault/,
            /in immediate danger/,
            /someone is hurting me/,
            /crisis/,
            /want to die/
        ];

        return safetyPatterns.some(function (pattern) {
            return pattern.test(normalized);
        });
    }

    function getApprovedNavigationAnswer(question) {
        const text = question.toLowerCase();

        if (/(accommodation|housing|shelter|place to stay|homeless)/.test(text)) {
            return "Accommodation support: Haven House's service pathway may help you ask about housing-related support and safe accommodation options. Availability and eligibility must be confirmed directly with authorised staff. Visit the Services page for general next steps.";
        }

        if (/(social work|social worker|practical support|referral)/.test(text)) {
            return "Social work: You can ask the service team about practical support, referrals, and whether an appointment is needed. Visit the Services page for general navigation information.";
        }

        if (/(wellbeing|psycholog|mental health|counselling)/.test(text)) {
            return "Wellbeing support: Contact the organisation directly to ask what psychological or wellbeing services are currently available, whether a referral is required, and how to arrange an enquiry.";
        }

        if (/(ndis|disability)/.test(text)) {
            return "NDIS navigation: Ask an authorised staff member which NDIS-related services are offered and whether eligibility or referral requirements apply. This assistant cannot determine eligibility.";
        }

        if (/(chaplain|spiritual|faith)/.test(text)) {
            return "Chaplaincy: You can ask staff whether personal, spiritual, or reflective support is available and what approach the service takes.";
        }

        if (/(job|employment|work|career)/.test(text)) {
            return "Jobs and employment: Ask the service team about current employment guidance, skills support, and any eligibility or appointment requirements.";
        }

        if (/(faq|frequently asked|common question)/.test(text)) {
            return "You can read common questions on the FAQs page. It explains this prototype, service navigation, privacy limitations, and why crisis-related concerns need direct human support.";
        }

        if (/(contact|phone|email|address|opening hours|hours)/.test(text)) {
            return "Please use the Contact page for guidance. Official phone numbers, email addresses, service hours, and location details must be verified with Haven House before this prototype is published.";
        }

        if (/(hello|hi|hey|good morning|good afternoon)/.test(text)) {
            return "Hello. I can help you explore accommodation, social work, wellbeing, NDIS navigation, chaplaincy, employment, FAQs, or contact guidance. What would you like to know?";
        }

        return "I can provide navigation from the approved topics available in this prototype, but I may not have an answer to that question. Please browse the Services or FAQs page, or contact authorised Haven House staff for accurate information.";
    }

    function handleQuestion(question) {
        const cleanedQuestion = question.trim();

        if (!cleanedQuestion) {
            return;
        }

        addMessage(cleanedQuestion, "user-message");

        if (isSafetyConcern(cleanedQuestion)) {
            addMessage(
                "Please seek direct human support now. This assistant cannot assess emergencies or provide crisis counselling. If you or someone else is in immediate danger, contact local emergency services or a verified crisis support service immediately. Do not wait for a response from this website. Use the Contact page only for general contact guidance.",
                "assistant-message handoff-message"
            );
            return;
        }

        addMessage(getApprovedNavigationAnswer(cleanedQuestion), "assistant-message");
    }

    if (assistantForm && assistantInput) {
        assistantForm.addEventListener("submit", function (event) {
            event.preventDefault();
            handleQuestion(assistantInput.value);
            assistantInput.value = "";
            assistantInput.focus();
        });
    }

    quickReplyButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const question = button.getAttribute("data-question") || "";
            openAssistant();
            handleQuestion(question);
        });
    });

    const contactForm = document.getElementById("contact-form");
    const contactFeedback = document.getElementById("contact-feedback");

    if (contactForm && contactFeedback) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const topic = document.getElementById("contact-topic").value;
            const message = document.getElementById("contact-message").value.trim();

            if (!topic || !message) {
                contactFeedback.textContent = "Please choose a topic and enter a general question.";
                return;
            }

            contactFeedback.textContent =
                "Your message has not been sent or saved. This is a front-end demo. Please use verified official contact details to contact the organisation.";
        });
    }
});

/* ---- Added: contact details, site search and login prototype ---- */
document.addEventListener("DOMContentLoaded", function () {
    renderContactDetails();
    setupSiteSearch();
    setupLoginPrototype();
});

function renderContactDetails() {
    const info = window.HAVEN_HOUSE_CONTACT || {};
    const items = [
        { label: "Address", value: info.address, kind: "text" },
        { label: "Mobile", value: info.mobile, kind: "tel" },
        { label: "Email", value: info.email, kind: "mailto" }
    ];

    document.querySelectorAll("[data-contact-details]").forEach(function (container) {
        const list = document.createElement("dl");
        list.className = "contact-list";

        items.forEach(function (item) {
            const term = document.createElement("dt");
            term.textContent = item.label;

            const detail = document.createElement("dd");
            const value = (item.value || "").trim();

            if (!value) {
                detail.textContent = "To be added by Haven House";
                detail.className = "contact-empty";
            } else if (item.kind === "tel") {
                const link = document.createElement("a");
                link.href = "tel:" + value.replace(/[^+\d]/g, "");
                link.textContent = value;
                detail.appendChild(link);
            } else if (item.kind === "mailto") {
                const link = document.createElement("a");
                link.href = "mailto:" + value;
                link.textContent = value;
                detail.appendChild(link);
            } else {
                detail.textContent = value;
            }

            list.append(term, detail);
        });

        container.replaceChildren(list);
    });
}

const SITE_SEARCH_INDEX = [
    { title: "Accommodation support", url: "services.html#accommodation", keywords: "accommodation housing shelter place to stay homeless" },
    { title: "Social work", url: "services.html#social-work", keywords: "social work social worker practical support referral" },
    { title: "Psychological and wellbeing support", url: "services.html#wellbeing", keywords: "wellbeing mental health psychological counselling" },
    { title: "NDIS navigation", url: "services.html#ndis", keywords: "ndis disability" },
    { title: "Chaplaincy and personal support", url: "services.html#chaplaincy", keywords: "chaplaincy spiritual faith personal reflective" },
    { title: "Jobs and employment", url: "services.html#jobs", keywords: "jobs employment work career skills" },
    { title: "All services", url: "services.html", keywords: "services support pathways" },
    { title: "FAQs", url: "faq.html", keywords: "faq questions common help" },
    { title: "Contact", url: "contact.html", keywords: "contact phone email address hours details" }
];

function searchSiteIndex(query) {
    const terms = query.toLowerCase().split(/\s+/).filter(function (term) {
        return term.length >= 2;
    });
    if (!terms.length) {
        return [];
    }

    return SITE_SEARCH_INDEX
        .map(function (entry) {
            const haystack = (entry.title + " " + entry.keywords).toLowerCase();
            const score = terms.filter(function (term) {
                return haystack.includes(term);
            }).length;
            return { entry: entry, score: score };
        })
        .filter(function (result) {
            return result.score > 0;
        })
        .sort(function (a, b) {
            return b.score - a.score;
        })
        .map(function (result) {
            return result.entry;
        });
}

function setupSiteSearch() {
    const form = document.querySelector("[data-site-search]");
    if (!form) {
        return;
    }

    const input = form.querySelector("input");
    const list = form.querySelector(".search-results");

    function showResults() {
        const query = input.value.trim();
        list.replaceChildren();

        if (!query) {
            list.hidden = true;
            return [];
        }

        const results = searchSiteIndex(query).slice(0, 5);
        list.hidden = false;

        if (!results.length) {
            const empty = document.createElement("li");
            empty.className = "search-empty";
            empty.textContent = "No matching pages. Try 'accommodation', 'wellbeing' or 'contact'.";
            list.appendChild(empty);
            return results;
        }

        results.forEach(function (result) {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = result.url;
            link.textContent = result.title;
            item.appendChild(link);
            list.appendChild(item);
        });

        return results;
    }

    input.addEventListener("input", showResults);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const results = showResults();
        if (results.length) {
            window.location.href = results[0].url;
        }
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            list.hidden = true;
            input.blur();
        }
    });

    document.addEventListener("click", function (event) {
        if (!form.contains(event.target)) {
            list.hidden = true;
        }
    });
}

function setupLoginPrototype() {
    const form = document.getElementById("login-form");
    const feedback = document.getElementById("login-feedback");

    if (!form || !feedback) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        feedback.textContent = "Login is not connected in this prototype. Nothing has been sent or stored.";
    });
}


/* ---- Added: role-aware login, sign up, staff assignments ---- */
document.addEventListener("DOMContentLoaded", function () {
    setupRoleNotes();
    setupSignupPrototype();
    renderStaffRoles();
});

function setupRoleNotes() {
    const role = new URLSearchParams(window.location.search).get("role");

    document.querySelectorAll("[data-role-show]").forEach(function (element) {
        const target = element.getAttribute("data-role-show");
        element.hidden = !(target === "any" || target === role);
    });
}

function setupSignupPrototype() {
    const form = document.getElementById("signup-form");
    const feedback = document.getElementById("signup-feedback");

    if (!form || !feedback) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("signup-confirm").value;

        if (password !== confirm) {
            feedback.textContent = "The passwords do not match. Please try again.";
            return;
        }

        feedback.textContent = "Sign up is not connected in this prototype. No account has been created or stored.";
    });
}

function renderStaffRoles() {
    const body = document.querySelector("[data-staff-roles]");
    const roles = window.HAVEN_HOUSE_STAFF_ROLES || [];

    if (!body) {
        return;
    }

    body.replaceChildren();

    roles.forEach(function (item) {
        const row = document.createElement("tr");

        const roleCell = document.createElement("th");
        roleCell.scope = "row";
        roleCell.textContent = item.role;

        const responsibilityCell = document.createElement("td");
        responsibilityCell.textContent = item.responsibility;

        const nameCell = document.createElement("td");
        const backupCell = document.createElement("td");
        fillName(nameCell, item.name);
        fillName(backupCell, item.backup);

        row.append(roleCell, responsibilityCell, nameCell, backupCell);
        body.appendChild(row);
    });
}

function fillName(cell, value) {
    const text = (value || "").trim();
    if (text) {
        cell.textContent = text;
    } else {
        cell.textContent = "Not yet assigned";
        cell.className = "contact-empty";
    }
}
