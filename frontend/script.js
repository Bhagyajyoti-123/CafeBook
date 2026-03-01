// Auto-fill userId from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedId = localStorage.getItem("userId");
    if (savedId) {
        const userIdInput = document.getElementById("userId");
        if (userIdInput) userIdInput.value = savedId;
    }
});

// --- Signup ---
function signupUser() {
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !role || !email || !password) {
        document.getElementById("signupOutput").innerText = "Please fill all fields.";
        return;
    }

    fetch("http://localhost:8081/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, password })
    })
    .then(r => r.text())
    .then(text => {
        document.getElementById("signupOutput").innerText = text;
        if (text.toLowerCase().includes("success")) {
            setTimeout(() => window.location.href = "login.html", 1000);
        }
    })
    .catch(() => document.getElementById("signupOutput").innerText = "Network error during signup.");
}

// --- Login ---
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("loginOutput").innerText = "Please enter email and password.";
        return;
    }

    fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(r => r.text())
    .then(text => {
        const outputDiv = document.getElementById("loginOutput");
        if (text.toLowerCase().includes("success")) {
            outputDiv.innerText = "Login successful! Redirecting...";
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        } else {
            outputDiv.innerHTML = `${text}<br><a href="signup.html">Don't have an account? Sign up here</a>`;
        }
    })
    .catch(() => document.getElementById("loginOutput").innerText = "Network error during login.");
}

// --- Recharge Wallet ---
function rechargeWallet() {
    const userId = parseInt(document.getElementById("userId").value);
    const amount = parseFloat(document.getElementById("walletAmount").value);

    if (!userId || isNaN(amount) || amount <= 0) {
        document.getElementById("rechargeOutput").innerText = "Please enter a valid user ID and amount.";
        return;
    }

    fetch(`http://localhost:8081/api/users/recharge/${userId}?amount=${amount}`, { method: "POST" })
    .then(r => r.text())
    .then(text => {
        document.getElementById("rechargeOutput").innerText = text;
        checkBalance();
    })
    .catch(() => document.getElementById("rechargeOutput").innerText = "Network error during recharge.");
}

// --- Membership ---
function activateMembership() {
    const userId = parseInt(document.getElementById("userId").value);
    if (!userId) {
        document.getElementById("membershipOutput").innerText = "Please enter a valid user ID.";
        return;
    }

    fetch(`http://localhost:8081/api/users/activate/${userId}`, { method: "POST" })
    .then(r => r.text())
    .then(text => {
        document.getElementById("membershipOutput").innerText = text;
        checkBalance();
    })
    .catch(() => document.getElementById("membershipOutput").innerText = "Network error during membership activation.");
}

function deactivateMembership() {
    const userId = parseInt(document.getElementById("userId").value);
    if (!userId) {
        document.getElementById("membershipOutput").innerText = "Please enter a valid user ID.";
        return;
    }

    fetch(`http://localhost:8081/api/users/deactivate/${userId}`, { method: "POST" })
    .then(r => r.text())
    .then(text => {
        document.getElementById("membershipOutput").innerText = text;
        checkBalance();
    })
    .catch(() => document.getElementById("membershipOutput").innerText = "Network error during membership deactivation.");
}

// --- Balance ---
function checkBalance() {
    const userId = parseInt(document.getElementById("userId").value);
    if (!userId) {
        document.getElementById("balanceOutput").innerText = "Please enter a valid user ID.";
        return;
    }

    fetch(`http://localhost:8081/api/users/${userId}`)
    .then(r => { if (!r.ok) throw new Error("User not found"); return r.json(); })
    .then(user => {
        document.getElementById("balanceOutput").innerText =
            `Name: ${user.name}\nWallet Balance: ₹${user.walletBalance}\nMembership: ${user.membershipStatus ? "Active" : "Inactive"}`;
        localStorage.setItem("userId", user.userId);
    })
    .catch(() => document.getElementById("balanceOutput").innerText = "Error fetching balance.");
}

// --- Booking ---
function bookCafe() {
    const userId = parseInt(document.getElementById("userId").value);
    const cafeName = document.getElementById("cafeName").value;
    const amount = parseFloat(document.getElementById("bookingAmount").value);

    if (!userId || !cafeName || isNaN(amount) || amount <= 0) {
        document.getElementById("bookingOutput").innerText = "Please enter valid details (User ID, Café Name, Amount).";
        return;
    }

    fetch("http://localhost:8081/api/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cafeName, amount })
    })
    .then(r => r.text())
    .then(text => {
        document.getElementById("bookingOutput").innerText = text;
        checkBalance();
    })
    .catch(() => document.getElementById("bookingOutput").innerText = "Network error during booking.");
}

function getUserBookings() {
    const userId = parseInt(document.getElementById("userId").value);
    if (!userId) {
        document.getElementById("bookingOutput").innerText = "Please enter a valid user ID.";
        return;
    }

    fetch(`http://localhost:8081/api/bookings/user/${userId}`)
    .then(r => { if (!r.ok) throw new Error("User not found"); return r.json(); })
    .then(bookings => {
        let output = "Bookings:\n";
        bookings.forEach(b => {
            output += `Cafe: ${b.cafeName}, Amount: ₹${b.amount}\n`;
        });
        document.getElementById("bookingOutput").innerText = output;
    })
    .catch(() => document.getElementById("bookingOutput").innerText = "Error fetching bookings.");
}

// --- Logout ---
function logoutUser() {
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}