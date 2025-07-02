function showMessage() {
    document.getElementById('message').textContent = 'Mobile Number: 0785957049';
    document.getElementById('message2').textContent = 'Email: pandukawijesinghe@gmail.com';
}

// === Dark/Light Mode Toggle ===
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;
function setDarkMode(enabled) {
    if (enabled) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}
if (localStorage.getItem('darkMode') === 'true') setDarkMode(true);
themeToggle.addEventListener('click', () => {
    setDarkMode(!body.classList.contains('dark-mode'));
});

// === Theme Color Picker ===
const colorPicker = document.getElementById('accent-color-picker');
const paletteLabel = document.querySelector('label[for="accent-color-picker"]');
function setAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}
if (localStorage.getItem('accentColor')) {
    setAccentColor(localStorage.getItem('accentColor'));
    colorPicker.value = localStorage.getItem('accentColor');
}
colorPicker.addEventListener('input', (e) => setAccentColor(e.target.value));
paletteLabel.addEventListener('click', () => colorPicker.click());

// === Hamburger Menu ===
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 800) navLinks.classList.remove('open');
});

// === Login/Logout Modal & State ===
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.getElementById('close-login');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
function setLoggedIn(username) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loginModal.style.display = 'none';
}
function setLoggedOut() {
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('username');
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
}
if (localStorage.getItem('loggedIn') === 'true') setLoggedIn(localStorage.getItem('username'));
else setLoggedOut();
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    loginError.textContent = '';
});
closeLogin.addEventListener('click', () => loginModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
});
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (username === 'user' && password === 'pass') {
        setLoggedIn(username);
    } else {
        loginError.textContent = 'Invalid username or password (try user/pass)';
    }
});
logoutBtn.addEventListener('click', setLoggedOut);

// === Contact Form Validation & Persistence ===
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message-input');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateForm() {
    let valid = true;
    if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required.';
        valid = false;
    } else {
        nameError.textContent = '';
    }
    if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Enter a valid email.';
        valid = false;
    } else {
        emailError.textContent = '';
    }
    if (!messageInput.value.trim()) {
        messageError.textContent = 'Message is required.';
        valid = false;
    } else {
        messageError.textContent = '';
    }
    return valid;
}
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        localStorage.setItem('contactForm', JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        }));
        contactForm.reset();
        alert('Message sent! (Saved to localStorage for demo)');
    }
});
// Load saved form data
const savedForm = localStorage.getItem('contactForm');
if (savedForm) {
    const data = JSON.parse(savedForm);
    nameInput.value = data.name;
    emailInput.value = data.email;
    messageInput.value = data.message;
}

// === Projects Table: Search, Sort, Export ===
const projectSearch = document.getElementById('project-search');
const sortSelect = document.getElementById('sort-select');
const exportBtn = document.getElementById('export-btn');
const projectsTable = document.getElementById('projects-table');
function getProjects() {
    return Array.from(projectsTable.querySelectorAll('tbody tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            row,
            project: cells[0].textContent,
            year: cells[1].textContent,
            status: cells[2].textContent
        };
    });
}
function filterProjects() {
    const query = projectSearch.value.toLowerCase();
    getProjects().forEach(({row, project, year, status}) => {
        row.style.display =
            project.toLowerCase().includes(query) ||
            year.toLowerCase().includes(query) ||
            status.toLowerCase().includes(query)
            ? '' : 'none';
    });
}
projectSearch.addEventListener('input', filterProjects);
function sortProjects() {
    const sortBy = sortSelect.value;
    if (!sortBy) return;
    const projects = getProjects();
    projects.sort((a, b) => {
        if (sortBy === 'year') return b.year.localeCompare(a.year);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
    });
    const tbody = projectsTable.querySelector('tbody');
    projects.forEach(({row}) => tbody.appendChild(row));
}
sortSelect.addEventListener('change', sortProjects);
// Export to CSV
exportBtn.addEventListener('click', () => {
    const rows = Array.from(projectsTable.querySelectorAll('tr'));
    const csv = rows.map(row =>
        Array.from(row.children).map(cell => '"' + cell.textContent.replace(/"/g, '""') + '"').join(',')
    ).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.csv';
    a.click();
    URL.revokeObjectURL(url);
});

// === Animate Buttons on Click ===
document.querySelectorAll('.animated-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 300);
    });
});
