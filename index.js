const root = document.documentElement;
const state = {
    theme: localStorage.getItem("nasarax-theme") || "light",
    user: JSON.parse(localStorage.getItem("nasarax-user") || "null"),
    bookings: JSON.parse(localStorage.getItem("nasarax-bookings") || "[]"),
    filter: "All",
    selectedCar: null,
    hours: 4,
    admin: sessionStorage.getItem("nasarax-admin") === "true"
};

const pickupStations = [
    { region: "Greater Accra", stations: ["Kotoka International Airport — Accra", "Accra Central — Accra", "Airport City — Accra", "Tema Community 1 — Tema"] },
    { region: "Ashanti", stations: ["Adum — Kumasi", "Kumasi Airport — Kumasi", "Ahodwo — Kumasi"] },
    { region: "Northern", stations: ["Tamale Central — Tamale", "Tamale Airport — Tamale", "Lamashegu — Tamale"] },
    { region: "Western", stations: ["Sekondi-Takoradi Central — Sekondi-Takoradi", "Takoradi Airport — Takoradi", "Market Circle — Takoradi"] },
    { region: "Eastern", stations: ["Koforidua Central — Koforidua", "Koforidua Technical University Area — Koforidua", "Aburi — Aburi"] },
    { region: "Central", stations: ["Cape Coast Central — Cape Coast", "Cape Coast Stadium — Cape Coast", "Kotokraba — Cape Coast"] },
    { region: "Volta", stations: ["Ho Central — Ho", "Ho Airport Area — Ho", "Hohoe Central — Hohoe"] },
    { region: "Bono", stations: ["Sunyani Central — Sunyani", "Sunyani Airport Area — Sunyani", "Fiapre — Sunyani"] },
    { region: "Bono East", stations: ["Techiman Central — Techiman", "Techiman Market Area — Techiman", "Kintampo Central — Kintampo"] },
    { region: "Ahafo", stations: ["Goaso Central — Goaso", "Goaso Municipal Area — Goaso"] },
    { region: "Western North", stations: ["Sefwi Wiawso Central — Sefwi Wiawso", "Bibiani Central — Bibiani"] },
    { region: "Oti", stations: ["Dambai Central — Dambai", "Nkwanta Central — Nkwanta"] },
    { region: "Savannah", stations: ["Damongo Central — Damongo", "Bole Central — Bole"] },
    { region: "North East", stations: ["Nalerigu Central — Nalerigu", "Walewale Central — Walewale"] },
    { region: "Upper East", stations: ["Bolgatanga Central — Bolgatanga", "Bolgatanga Airport Area — Bolgatanga", "Navrongo Central — Navrongo"] },
    { region: "Upper West", stations: ["Wa Central — Wa", "Wa Airport Area — Wa", "Lawra Central — Lawra"] }
];

const cars = [
    { id: "rr", name: "Range Rover Sport", type: "SUV", fuel: "Hybrid", transmission: "Automatic", efficiency: "8.2 km/L", price: 60, available: true, image: "https://images.unsplash.com/photo-1753030148276-75f09f40e6d9?auto=format&fit=crop&fm=jpg&q=88&w=1800" },
    { id: "bmwx7", name: "BMW X7", type: "SUV", fuel: "Petrol", transmission: "Automatic", efficiency: "9.1 km/L", price: 75, available: true, image: "https://images.unsplash.com/photo-1702139146880-ef1f99c256af?auto=format&fit=crop&fm=jpg&q=88&w=1800" },
    { id: "sclass", name: "Mercedes S-Class", type: "Sedan", fuel: "Petrol", transmission: "Automatic", efficiency: "10.2 km/L", price: 85, available: false, image: "https://images.unsplash.com/photo-1764089859662-7b4773dff85b?auto=format&fit=crop&fm=jpg&q=88&w=1800" },
    { id: "cad", name: "Cadillac Escalade", type: "SUV", fuel: "Petrol", transmission: "Automatic", efficiency: "7.7 km/L", price: 90, available: true, image: "https://www.dubicars.com/images/b1f93a/w_1300x760/gta-used-cars-trading-1/a63e14c2-77bb-4788-b079-d600e8d412ca.jpeg" },
    { id: "cam", name: "Toyota Camry", type: "Sedan", fuel: "Hybrid", transmission: "Automatic", efficiency: "6.2 km/L", price: 55, available: true, image: "assets/cam.webp" },
    { id: "crv", name: "Honda CR-V", type: "SUV", fuel: "Petrol", transmission: "Automatic", efficiency: "8.2 km/L", price: 60, available: true, image: "https://images.unsplash.com/photo-1748581702243-fce35f5fb1b9?auto=format&fit=crop&fm=jpg&q=88&w=1800" },
    { id: "rav", name: "Toyota RAV4", type: "SUV", fuel: "Hybrid", transmission: "Automatic", efficiency: "6.1 km/L", price: 50, available: false, image: "assets/rav.webp" },
    { id: "defender", name: "Land Rover Defender", type: "SUV", fuel: "Petrol", transmission: "Automatic", efficiency: "8.7 km/L", price: 78, available: true, image: "https://images.unsplash.com/photo-1753030148276-75f09f40e6d9?auto=format&fit=crop&fm=jpg&q=88&w=1800" },
    { id: "bmw7", name: "BMW 7 Series", type: "Sedan", fuel: "Hybrid", transmission: "Automatic", efficiency: "9.8 km/L", price: 82, available: true, image: "https://vehicle-images.carscommerce.inc/aceb-18003996/WBA33EH01TCX04309/thumbnails/large/d1647fdcfa1a1ac53b7eebeaca0c0e66.jpg" }
];

const demoBookings = [
    { code: "NX-7K2QA", name: "Sarah T.", vehicle: "Range Rover Sport", hours: 8, total: 504, status: "Confirmed", date: "Tomorrow", image: "assets/Range Rover Sport.webp" },
    { code: "NX-3M9ZD", name: "John M.", vehicle: "BMW 3 Series", hours: 5, total: 341, status: "Pending", date: "28 Sep", image: "assets/bmw.webp" },
    { code: "NX-8P4WE", name: "Emily K.", vehicle: "Toyota RAV4", hours: 24, total: 1260, status: "Completed", date: "12 Sep", image: "assets/rav.webp" }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const money = value => `GH₵${Math.round(value).toLocaleString()}`;

function initials(name = "NasaraX User") {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join("");
}

function applyTheme() {
    root.dataset.theme = state.theme;
    $("#theme-toggle i").className = state.theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function renderFleet(container, list = cars) {
    if (!container) return;

    container.innerHTML = list.map((car, index) => `
        <article class="fleet-card ${car.available ? "is-available" : "is-unavailable"}">
            <div class="fleet-image">
                <img src="${car.image}" alt="${car.name}" loading="lazy" onerror="this.src='assets/cam.webp'">
                <span class="fleet-number">${String(index + 1).padStart(2, "0")}</span>
                <span class="availability-badge ${car.available ? "available" : "unavailable"}">
                    <i class="fa-solid ${car.available ? "fa-circle-check" : "fa-clock"}"></i>
                    ${car.available ? "Available now" : "Currently unavailable"}
                </span>
            </div>
            <div class="fleet-content">
                <div>
                    <div class="fleet-title-row"><h3>${car.name}</h3><span class="availability-dot ${car.available ? "available" : "unavailable"}" title="${car.available ? "Available" : "Unavailable"}"></span></div>
                    <div class="fleet-meta">
                        <span>${car.type}</span>
                        <span>${car.transmission}</span>
                        <span>${car.fuel}</span>
                        <span>${car.efficiency}</span>
                    </div>
                </div>
                <div class="fleet-bottom">
                    <div class="fleet-price"><strong>${money(car.price)}</strong><small> / hour</small></div>
                    <button class="reserve-button ${car.available ? "" : "disabled"}" data-book="${car.id}" ${car.available ? "" : "disabled"}>${car.available ? "Reserve" : "Unavailable"} <i class="fa-solid ${car.available ? "fa-arrow-right" : "fa-lock"}"></i></button>
                </div>
            </div>
        </article>
    `).join("");
}

function setupFleet() {
    renderFleet($("#home-fleet"), cars.slice(0, 4));
    renderFleet($("#client-fleet"), cars.slice(0, 3));
    renderFleet($("#client-browse-grid"), cars);
    renderFleet($("#admin-fleet"), cars);
    renderFleet($("#fleet-grid"), cars);

    const filters = ["All", "SUV", "Sedan", "Hybrid"];
    $("#fleet-filters").innerHTML = filters.map(filter => `<button class="${filter === "All" ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("");

    $("#fleet-filters").addEventListener("click", event => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        state.filter = button.dataset.filter;
        $$("#fleet-filters button").forEach(item => item.classList.toggle("active", item === button));
        renderFleet($("#fleet-grid"), filteredCars());
    });

    $("#fleet-search").addEventListener("input", () => renderFleet($("#fleet-grid"), filteredCars()));

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-book]");
        if (button) openBooking(button.dataset.book || cars[0].id);
    });
}

function filteredCars() {
    const query = ($("#fleet-search")?.value || "").trim().toLowerCase();

    return cars.filter(car => {
        const matchesFilter = state.filter === "All" || car.type === state.filter || car.fuel === state.filter;
        const matchesSearch = !query || car.name.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });
}

function setupQuickSearch() {
    $("#quick-search").addEventListener("submit", event => {
        event.preventDefault();
        const date = $("#quick-date").value;
        if (date) sessionStorage.setItem("nasarax-search-date", date);
        location.hash = "#/vehicles";
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $("#quick-date").value = tomorrow.toISOString().slice(0, 10);
}

function renderSelectedBookingCar() {
    const car = state.selectedCar || cars[0];

    $("#selected-car").innerHTML = `
        <img src="${car.image}" alt="${car.name}">
        <div><strong>${car.name}</strong><span>${car.type} · ${car.transmission} · ${money(car.price)} / hour</span></div>
    `;

    $("#booking-car").value = car.id;
    updateBookingPrice();
}

function openBooking(carId) {
    const car = cars.find(item => item.id === carId) || cars[0];

    if (!car.available) {
        showToast(`${car.name} is currently unavailable. Choose another vehicle.`);
        return;
    }

    if (!state.user) {
        sessionStorage.setItem("nasarax-pending-car", car.id);
        location.hash = "#/login";
        showToast("Sign in to continue with a demo booking.");
        return;
    }

    state.selectedCar = car;
    state.hours = 4;
    renderSelectedBookingCar();

    $("#booking-name").value = state.user.name || "";
    $("#booking-phone").value = state.user.phone || "";
    updateBookingPrice();

    const date = sessionStorage.getItem("nasarax-search-date");
    if (date) $("#booking-date").value = date;

    $("#booking-form").classList.remove("hidden-panel");
    $("#booking-success").classList.add("hidden-panel");
    $("#booking-overlay").classList.add("is-open");
    $("#booking-overlay").setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeBooking() {
    $("#booking-overlay").classList.remove("is-open");
    $("#booking-overlay").setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

function updateBookingPrice() {
    if (!state.selectedCar) return;
    const total = state.selectedCar.price * state.hours * 1.05;
    $("#hours-value").textContent = state.hours;
    $("#price-hours").textContent = `${state.hours} hour${state.hours === 1 ? "" : "s"}`;
    $("#price-total").textContent = money(total);
}

function completeBooking(event) {
    event.preventDefault();

    const booking = {
        code: `NX-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        name: $("#booking-name").value,
        vehicle: state.selectedCar.name,
        hours: state.hours,
        total: Math.round(state.selectedCar.price * state.hours * 1.05),
        status: "Confirmed",
        date: $("#booking-date").value,
        pickup: $("#booking-location").value,
        image: state.selectedCar.image
    };

    state.bookings.unshift(booking);
    localStorage.setItem("nasarax-bookings", JSON.stringify(state.bookings));
    $("#booking-code").textContent = booking.code;
    $("#booking-form").classList.add("hidden-panel");
    $("#booking-success").classList.remove("hidden-panel");
    updateDashboard();
}

function setupPickupStations() {
    const markup = pickupStations.map(group => `
        <optgroup label="${group.region} Region">
            ${group.stations.map(station => `<option value="${station}">${station}</option>`).join("")}
        </optgroup>
    `).join("");

    const bookingSelect = $("#booking-location");
    const profileSelect = $("#profile-pickup");

    if (bookingSelect) bookingSelect.innerHTML = markup;
    if (profileSelect) profileSelect.innerHTML = markup;
}

function setupBooking() {
    setupPickupStations();
    $("#booking-car").innerHTML = cars.map(car => `<option value="${car.id}" ${car.available ? "" : "disabled"}>${car.name} · ${money(car.price)}/hr · ${car.available ? "Available" : "Unavailable"}</option>`).join("");

    $("#booking-car").addEventListener("change", event => {
        const car = cars.find(item => item.id === event.target.value);
        if (!car) return;
        state.selectedCar = car;
        renderSelectedBookingCar();
    });

    $("#close-booking").addEventListener("click", closeBooking);
    $("#booking-overlay").addEventListener("click", event => {
        if (event.target === $("#booking-overlay")) closeBooking();
    });

    $("#hours-minus").addEventListener("click", () => {
        state.hours = Math.max(1, state.hours - 1);
        updateBookingPrice();
    });

    $("#hours-plus").addEventListener("click", () => {
        state.hours = Math.min(72, state.hours + 1);
        updateBookingPrice();
    });

    $("#booking-form").addEventListener("submit", completeBooking);
}

function setupAuth() {
    $("#login-form").addEventListener("submit", event => {
        event.preventDefault();

        const email = $("#login-email").value.trim();
        const password = $("#login-password").value;

        if (!email || !password) return;

        state.user = {
            name: email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()),
            email
        };

        localStorage.setItem("nasarax-user", JSON.stringify(state.user));
        showToast("Demo login successful. No real account was created.");
        location.hash = "#/";
    });

    $("#signup-form").addEventListener("submit", event => {
        event.preventDefault();

        state.user = {
            name: $("#signup-name").value.trim(),
            email: $("#signup-email").value.trim()
        };

        localStorage.setItem("nasarax-user", JSON.stringify(state.user));
        showToast("Demo profile created. Welcome to NasaraX.");
        location.hash = "#/";
    });

    $("#password-toggle").addEventListener("click", () => {
        const input = $("#login-password");
        const visible = input.type === "text";
        input.type = visible ? "password" : "text";
        $("#password-toggle i").className = visible ? "fa-regular fa-eye" : "fa-regular fa-eye-slash";
    });
}

function setupNavigation() {
    $("#theme-toggle").addEventListener("click", () => {
        state.theme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("nasarax-theme", state.theme);
        applyTheme();
    });

    $("#menu-toggle").addEventListener("click", () => {
        $(".nav-shell").classList.toggle("menu-open");
    });

    $("#site-header").classList.remove("scrolled");
    window.addEventListener("scroll", () => {
        $("#site-header").classList.toggle("scrolled", window.scrollY > 12);
    });

    document.addEventListener("click", event => {
        if (event.target.closest(".main-nav a")) $(".nav-shell").classList.remove("menu-open");
    });
}

function renderUser() {
    const user = state.user;

    if (!user) {
        $("#login-link").textContent = "Sign in";
        $("#login-link").setAttribute("href", "#/login");
        return;
    }

    $("#login-link").textContent = "Workspace";
    $("#login-link").setAttribute("href", "#/workspace");

    $("#sidebar-user").innerHTML = `
        <span class="mini-avatar">${initials(user.name)}</span>
        <span>${user.name}</span>
    `;

    $("#profile-avatar").textContent = initials(user.name);
    $("#profile-name").value = user.name || "";
    $("#profile-email").value = user.email || "";
    $("#profile-phone").value = user.phone || "";
    if ($("#profile-pickup")) $("#profile-pickup").value = user.pickup || pickupStations[0].stations[0];
}

function updateDashboard() {
    renderUser();

    const latest = state.bookings[0] || {
        vehicle: "Range Rover Sport",
        date: "Tomorrow",
        hours: 8,
        total: 504,
        status: "Confirmed",
        image: "assets/Range Rover Sport.webp",
        code: "NX-7K2QA"
    };

    $("#stat-upcoming").textContent = state.bookings.length + 1;

    $("#next-booking").innerHTML = `
        <div class="booking-preview">
            <img src="${latest.image}" alt="${latest.vehicle}">
            <div><h4>${latest.vehicle}</h4><p>${latest.date || "Upcoming"} · ${latest.hours} hours · ${latest.code}</p><small><i class="fa-solid fa-location-dot"></i> ${latest.pickup || "Accra Central — Accra"}</small></div>
            <div class="booking-status"><span class="status">${latest.status}</span><strong>${money(latest.total)}</strong></div>
        </div>
    `;

    const bookings = state.bookings.length ? state.bookings : demoBookings;
    $("#booking-list").innerHTML = bookings.map(booking => `
        <div class="booking-row">
            <img src="${booking.image}" alt="${booking.vehicle}">
            <div><span class="booking-code">${booking.code}</span><h4>${booking.vehicle}</h4><p>${booking.date || "Upcoming"} · ${booking.hours} hours</p><small><i class="fa-solid fa-location-dot"></i> ${booking.pickup || "Accra Central — Accra"}</small></div>
            <div class="booking-status"><span class="status">${booking.status}</span><strong>${money(booking.total)}</strong></div>
        </div>
    `).join("");

    renderUser();
}

function switchClientTab(tab) {
    const panels = {
        overview: $("#client-overview"),
        bookings: $("#client-bookings"),
        profile: $("#client-profile"),
        browse: $("#client-browse")
    };

    Object.values(panels).forEach(panel => panel.classList.add("hidden-panel"));
    (panels[tab] || panels.overview).classList.remove("hidden-panel");

    $$("[data-client-tab]").forEach(link => link.classList.toggle("active", link.dataset.clientTab === tab));
}

function setupClientDashboard() {
    $$("[data-client-tab]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const tab = link.dataset.clientTab;
            history.pushState({}, "", tab === "overview" ? "#/" : `#/${tab}`);
            switchClientTab(tab);
        });
    });

    $("#logout-link").addEventListener("click", event => {
        event.preventDefault();
        state.user = null;
        localStorage.removeItem("nasarax-user");
        sessionStorage.removeItem("nasarax-pending-car");
        state.selectedCar = null;
        history.replaceState(null, "", "#/");
        route();
        showToast("You have been signed out completely.");
    });

    $("#profile-form").addEventListener("submit", event => {
        event.preventDefault();
        state.user.name = $("#profile-name").value.trim();
        state.user.email = $("#profile-email").value.trim();
        state.user.phone = $("#profile-phone").value.trim();
        state.user.pickup = $("#profile-pickup").value;
        localStorage.setItem("nasarax-user", JSON.stringify(state.user));
        renderUser();
        showToast("Profile changes saved in this demo.");
    });

    updateDashboard();
}

function renderAdminBookings() {
    const rows = demoBookings.map(booking => `
        <tr>
            <td>${booking.code}</td>
            <td>${booking.name}</td>
            <td>${booking.vehicle}</td>
            <td>${booking.hours}h</td>
            <td>${money(booking.total)}</td>
            <td><span class="status">${booking.status}</span></td>
        </tr>
    `).join("");

    $("#admin-bookings-table").innerHTML = `<table class="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Duration</th><th>Total</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`;
    $("#admin-bookings-full").innerHTML = `<table class="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Duration</th><th>Total</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function setupAdminDashboard() {
    $$("[data-admin-tab]").forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.dataset.adminTab;
            $$("[id^='admin-']").forEach(panel => {
                if (panel.id !== "admin-app") panel.classList.add("hidden-panel");
            });
            $(`#admin-${tab}`).classList.remove("hidden-panel");
            $$("[data-admin-tab]").forEach(item => item.classList.toggle("active", item === button));
            $("#admin-title").textContent = tab === "overview" ? "Fleet overview" : tab.charAt(0).toUpperCase() + tab.slice(1);
        });
    });

    renderAdminBookings();
}

function route() {
    renderUser();
    const raw = location.hash.replace(/^#\/?/, "") || "home";
    const adminRoute = raw.startsWith("admin/");
    const authRoute = raw === "login" || raw === "signup";
    const clientRoutes = ["browse", "bookings", "profile", "workspace"];
    const loggedInClientRoute = state.user && (raw === "home" || clientRoutes.includes(raw));

    $("#site-header").style.display = adminRoute || authRoute || loggedInClientRoute ? "none" : "";
    $(".site-footer").style.display = authRoute || adminRoute || loggedInClientRoute ? "none" : "";
    $("#public-app").style.display = adminRoute || loggedInClientRoute ? "none" : "";
    $("#client-app").classList.remove("is-active");
    $("#admin-app").classList.remove("is-active");

    $$(".page").forEach(page => page.classList.remove("is-active"));

    if (adminRoute) {
        if (raw === "admin/login" || raw === "admin/signup") {
            state.admin = true;
            sessionStorage.setItem("nasarax-admin", "true");
            location.hash = "#/admin";
            return;
        }

        if (!state.admin) {
            location.hash = "#/admin/login";
            return;
        }

        $("#admin-app").classList.add("is-active");
        return;
    }

    if (state.user && (raw === "browse" || raw === "bookings" || raw === "profile" || raw === "workspace")) {
        $("#public-app").style.display = "none";
        $("#client-app").classList.add("is-active");
        switchClientTab(raw === "workspace" ? "overview" : raw);
        updateDashboard();
        return;
    }

    if (state.user && raw === "home") {
        $("#public-app").style.display = "none";
        $("#client-app").classList.add("is-active");
        switchClientTab("overview");
        updateDashboard();
        return;
    }

    $("#public-app").style.display = "";
    const pageName = raw.split("/")[0];
    const page = $(`.page[data-page="${pageName}"]`) || $(`.page[data-page="home"]`);
    page.classList.add("is-active");

    $$(".main-nav a[data-nav]").forEach(link => link.classList.toggle("active", link.dataset.nav === pageName));
    window.scrollTo({ top: 0, behavior: "smooth" });

}


function setupCaseStudy() {
    const tabs = $$(".comparison-tab");
    const grid = $("#comparison-grid");

    if (!tabs.length || !grid) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const mode = tab.dataset.comparison;
            tabs.forEach(item => {
                const active = item === tab;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-selected", active ? "true" : "false");
            });

            grid.classList.remove("show-before", "show-after");
            if (mode === "before") grid.classList.add("show-before");
            if (mode === "after") grid.classList.add("show-after");
        });
    });
}

function setupProfileFallback() {
    if (!state.user) return;

    const pendingCar = sessionStorage.getItem("nasarax-pending-car");
    if (pendingCar && location.hash === "#/") {
        sessionStorage.removeItem("nasarax-pending-car");
        setTimeout(() => openBooking(pendingCar), 200);
    }
}

applyTheme();
setupNavigation();
setupFleet();
setupQuickSearch();
setupBooking();
setupAuth();
setupClientDashboard();
setupAdminDashboard();
setupCaseStudy();
renderUser();

window.addEventListener("hashchange", route);
window.addEventListener("popstate", route);

route();
setupProfileFallback();
