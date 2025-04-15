// LOGOUT LOGIC
document.getElementById('logoutUser').addEventListener('click', function() {
    RemoveAccessFromLocalStorage()
    showAlert("success","✅ Logout successful! ")
    setTimeout(() => {
        window.location.href = "auth.html";
    }, 2000);
});


document.getElementById('RegUser').addEventListener('click', function() {
    RemoveAccessFromLocalStorage()
    window.location.href = "auth.html";
});


// FETCH USER DETAILS
const first_name = localStorage.getItem('e_travel_first_name');
const profilePicture = localStorage.getItem('e_travel_profilePicture');
const token = localStorage.getItem('e_travel_token');


if (first_name) {
    document.getElementById('first_name').innerHTML = '@' +first_name;
}
if (profilePicture) {
    document.getElementById('profilePic').src = profilePicture;
}else{
    document.getElementById('profilePic').src = "/img/l8.jpeg";
}

if (token === null){
    document.getElementById('ChangePassword').style.display = "none";
    document.getElementById('logoutUser').style.display = "none";
    document.getElementById('RegUser').style.display = "block";
}else{
    document.getElementById('RegUser').style.display = "none";
}


// DROPDOWN LOGIC
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.querySelector('.avatar');
    const dropdown = document.getElementById('userDropdown');

    avatar.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); 

        })
    })

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-toggle')) {
            dropdown.style.display = 'none';
        }
    });
});





// Dark Mode Toggle
const toggleBtn = document.getElementById('darkModeToggle');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDark = localStorage.getItem('darkMode');
if (isDark === null) {
    isDark = prefersDarkMode;
} else {
    isDark = isDark === 'true';
}
document.body.classList.toggle('dark-mode', isDark);
toggleBtn.textContent = isDark ? '🌞' : '🌙';
toggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    toggleBtn.textContent = isDark ? '🌞' : '🌙';
});


function showAlert(type, message) {
    const alertBox = document.getElementById("customAlert");
    const alertContent = document.getElementById("alertContent");
    const alertProgress = document.getElementById("alertProgress");

    alertContent.textContent = message;

    // Apply type-based color
    let bgColor;
    switch (type) {
        case 'success':
            bgColor = 'var(--success)';
            break;
        case 'info':
            bgColor = 'var(--info)';
            break;
        case 'error':
            bgColor = 'var(--error)';
            break;
        default:
            bgColor = '#ccc';
    }

    alertProgress.style.background = bgColor;

    // Show alert
    alertBox.classList.add("active");

    // Auto-close after 6 seconds
    setTimeout(closeAlert, 6000);
}

function closeAlert() {
    document.getElementById("customAlert").classList.remove("active");
}




document.addEventListener("DOMContentLoaded", function () {
    // Inject Search Modal
    const searchModalHTML = `
    <div class="modal fade" id="SearchModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close modal-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="input-container">
                        <i class="bi bi-geo-alt input-icon"></i>
                        <input type="text" class="search-input" placeholder="Location">
                    </div>
                    <div class="input-container">
                        <i class="bi bi-flag input-icon"></i>
                        <input type="text" class="search-input" placeholder="Destination">
                    </div>
                    <div class="input-container mt-4">
                        <div class="d-flex flex-column w-100">
                            <div class="price-range-container">
                                <input type="range" class="price-range" min="0" max="100000" value="50000">
                                <div class="d-flex justify-content-between mt-1">
                                    <small class="text-mute">₦0</small>
                                    <small class="text-mute">₦100,000</small>
                                </div>
                            </div>
                            <span class="price-value">₦50,000</span>
                        </div>
                    </div>
                    <div class="cars-options"></div>
                    <div class="search-options">
                        <button type="button" id="postBtn" class="btn search-button-main">
                            Search →
                            <span class="spinner-border spinner-border-sm d-none" id="postSpinner" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    const searchWrapper = document.createElement("div");
    searchWrapper.innerHTML = searchModalHTML;
    document.body.appendChild(searchWrapper);

    // Inject Request Modal
    const requestModalHTML = `
    <div class="modal fade" id="RequestModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close modal-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="input-container">
                        <i class="bi bi-geo-alt input-icon"></i>
                        <input type="text" class="search-input" placeholder="Location">
                    </div>
                    <div class="input-container">
                        <i class="bi bi-flag input-icon"></i>
                        <input type="text" class="search-input" placeholder="Destination">
                    </div>
                    <div class="input-container mt-4">
                        <div class="d-flex flex-column w-100">
                            <div class="price-range-container">
                                <input type="range" class="price-range" min="0" max="100000" value="50000">
                                <div class="d-flex justify-content-between mt-1">
                                    <small class="text-mute">₦0</small>
                                    <small class="text-mute">₦100,000</small>
                                </div>
                            </div>
                            <span class="price-value">₦50,000</span>
                        </div>
                    </div>
                    <div class="input-container mt-5">
                        <i class="bi bi-calendar-check input-icon"></i>
                        <input type="date" class="search-input" placeholder="Departure Date">
                        <span class="text-mute"><b>Departure Date</b></span>
                    </div>
                    <div class="cars-options"></div>
                    <div class="search-options">
                        <button type="button" id="postBtn" class="btn search-button-main">
                            Send Request →
                            <span class="spinner-border spinner-border-sm d-none" id="postSpinner" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    const requestWrapper = document.createElement("div");
    requestWrapper.innerHTML = requestModalHTML;
    document.body.appendChild(requestWrapper);

    // Now DOM has modals, populate categories
    const categories = {
        results: [
            { id: 1, name: "Electronics" },
            { id: 2, name: "Clothing" },
            { id: 3, name: "Home & Kitchen" },
            { id: 4, name: "Books" },
            { id: 5, name: "Toys & Games" },
            { id: 6, name: "Beauty & Health" },
            { id: 7, name: "Sports & Outdoors" }
        ]
    };

    document.querySelectorAll(".cars-options").forEach((container, containerIndex) => {
        container.innerHTML = "";
        categories.results.forEach((category, index) => {
            const carsElement = document.createElement("div");
            carsElement.innerHTML = `
                <input type="radio" name="cars-${containerIndex}" id="cars-${containerIndex}-${category.id}" class="cars-radio" value="${category.id}" ${index === 0 ? "checked" : ""}>
                <label for="cars-${containerIndex}-${category.id}" class="cars-label">🚗 ${category.name}</label>
            `;
            container.appendChild(carsElement);
        });
    });

    // Range input value update
    document.querySelectorAll('.price-range').forEach(range => {
        const valueDisplay = range.closest('.price-range-container').nextElementSibling;
        range.addEventListener('input', (e) => {
            const value = parseInt(e.target.value).toLocaleString();
            valueDisplay.textContent = `₦${value}`;
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.querySelector('#SearchModal #postBtn');
    const searchSpinner = document.querySelector('#SearchModal #postSpinner');

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            const modal = document.querySelector('#SearchModal');

            const location = modal.querySelector('input[placeholder="Location"]').value.trim();
            const destination = modal.querySelector('input[placeholder="Destination"]').value.trim();
            const price = modal.querySelector('.price-range').value;
            const category = modal.querySelector('input[name^="cars-"]:checked').name;

            const payload = {
                location,
                destination,
                price,
                category
            };

            window.location.href = `search.html?location=${payload.location}&destination=${payload.destination}&price=${payload.price}&category=${payload.category}`;

            console.log('SearchModal Data:', payload);
            searchSpinner.classList.remove('d-none');
            searchBtn.disabled = true;

            // Simulate sending (remove this part in real app)
            setTimeout(() => {
                searchSpinner.classList.add('d-none');
                searchBtn.disabled = false;
            }, 1000);
        });
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const requestBtn = document.querySelector('#RequestModal #postBtn');
    const requestSpinner = document.querySelector('#RequestModal #postSpinner');
    
    if (requestBtn) {
        requestBtn.addEventListener('click', function () {
            if (token === null){
                showAlert("error",'❌ Authorized request');
                RemoveAccessFromLocalStorage()
                setTimeout(() => {
                    window.location.href = "auth.html";
                }, 3000);
        return;

            }
            const modal = document.querySelector('#RequestModal');

            const location = modal.querySelector('input[placeholder="Location"]').value.trim();
            const destination = modal.querySelector('input[placeholder="Destination"]').value.trim();
            const price = modal.querySelector('.price-range').value;
            const departureDate = modal.querySelector('input[type="date"]').value;
            const category = modal.querySelector('input[name^="cars-"]:checked').value;

            const payload = {
                location,
                destination,
                price,
                departure_date: departureDate,
                category
            };

            console.log('RequestModal Data:', payload);

            // Optionally send to backend
            requestSpinner.classList.remove('d-none');
            requestBtn.disabled = true;

            // Simulate sending (remove this part in real app)
            setTimeout(() => {
                requestSpinner.classList.add('d-none');
                requestBtn.disabled = false;
                alert('Request submitted!');
            }, 1000);
        });
    }
});







function showChangePasswordModal() {
    let existingModal = document.getElementById("changePasswordModal");
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal HTML dynamically
    let modalHTML = `
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-mute">Change Password</h5>
                    <button type="button" class="btn-close modal-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="mb-3">
                            <label for="oldPassword" class="form-label text-mute">Old Password</label>
                            <input type="password" name='password' class="form-control" id="oldPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="newPassword" class="form-label text-mute">New Password</label>
                            <input type="password"  name='password1' class="form-control" id="newPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label text-mute">Confirm Password</label>
                            <input type="password"  name='password2' class="form-control" id="confirmPassword" required>
                        </div>
                        <button type="submit" id="changePasswordBtn" class="btn btn-primary w-100" >Change Password → 
                            <span class="spinner-border spinner-border-sm d-none" id="changePasswordSpinnerBtn" role="status" aria-hidden="true"></span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>`;

    // Append modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Show the modal
    let modal = new bootstrap.Modal(document.getElementById("changePasswordModal"));
    modal.show();

    // Add submit event listener for the form
    document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        if (token === null){
            showAlert("error",'❌ Authorized request');
            RemoveAccessFromLocalStorage()
            setTimeout(() => {
                window.location.href = "auth.html";
            }, 3000);
        return;
        }
        const formData = new FormData(this);
        const password = formData.get("password");
        const password1 = formData.get("password1");
        const password2 = formData.get("password2");
        
        if (password.length < 8 || password1.length < 8 || password2.length < 8) {
            showAlert("error","❌ Password must be at least 8 characters long.");
            return;
        }

        if (password1 !== password2) {
            showAlert("error","❌ New Password and Confirm Password do not match.");
            return;
        }

        const changePasswordButton = document.getElementById("changePasswordBtn");
        const changePasswordSpinner = document.getElementById("changePasswordSpinnerBtn");

        changePasswordButton.disabled = true;
        changePasswordSpinner.classList.remove("d-none");

        try {
            
            const response = await fetch("http://127.0.0.1:8000/admins/api/user/change/password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(Object.fromEntries(formData.entries()))
            });
           

            const data = await response.json();
            console.log(data)
            changePasswordButton.disabled = false;
            changePasswordSpinner.classList.add("d-none");

            if (response.status === 401) {
                showAlert("error",'❌ Authorized request');
                RemoveAccessFromLocalStorage()
                setTimeout(() => {
                    window.location.href = "auth.html";
                }, 3000);
        return;
            }

            if (!response.ok) {
                showAlert("error",'❌ ' + data.error || "error","❌ Something went wrong! Please try again.");
                return;
            }

            

            RemoveAccessFromLocalStorage()

            showAlert("success",'✅ ' + data.message);

            setTimeout(() => {
                window.location.href = "auth.html";
            }, 3000);
        return;

        } catch (error) {
            showAlert("error","❌ Server is not responding. Please try again later.");
        }finally {
            changePasswordButton.disabled = false;
            changePasswordSpinner.classList.add("d-none");
        }
    });
}

// Add the event listener to the "Change Password" dropdown item
document.getElementById("ChangePassword").addEventListener("click", showChangePasswordModal);


function RemoveAccessFromLocalStorage(){
    localStorage.removeItem("e_travel_token");
    localStorage.removeItem("e_travel_first_name");
    localStorage.removeItem("e_travel_profilePicture");
    localStorage.removeItem("e_travel_user_id");
    localStorage.setItem("e_travel_is_driver", false);
    localStorage.setItem("e_travel_is_client", false);
}


const isDriver = localStorage.getItem("e_travel_is_driver") === "true";

  const driverNavItems = `
    <a href="D_index.html" class="mobile-nav-item active">
        <i class="fas fa-home"></i>
        <span>Home</span>
    </a>
    <a href="client-bookings.html" class="mobile-nav-item">
        <i class="fas bi-car-front-fill"></i>
        <span>Client Bookings</span>
    </a>
    <a href="earnings.html" class="mobile-nav-item">
        <i class="fas bi-wallet"></i>
        <span>Earnings</span>
    </a>
    
    <a href="me.html" class="mobile-nav-item">
        <i class="fas fa-user"></i>
        <span>Profile</span>
    </a>
    <a href="support.html" class="mobile-nav-item">
        <i class="fas fa-envelope"></i>
        <span>Support</span>
    </a>
  `;

  const clientNavItems = `
    <a href="#" class="mobile-nav-item active">
        <i class="fas fa-home"></i>
        <span>Home</span>
    </a>
    <a href="#!" class="mobile-nav-item" data-bs-toggle="modal" data-bs-target="#SearchModal">
        <i class="fas bi bi-search"></i>
        <span>Search</span>
    </a>
    <a href="#!" data-bs-toggle="modal" data-bs-target="#RequestModal" class="mobile-nav-item">
        <i class="fas bi-car-front-fill"></i>
        <span>Request</span>
    </a>
    <a href="me.html" class="mobile-nav-item">
        <i class="fas fa-user"></i>
        <span>Profile</span>
    </a>
    <a href="support.html" class="mobile-nav-item">
        <i class="fas fa-envelope"></i>
        <span>Support</span>
    </a>
  `;

  document.getElementById("mobile-nav-items").innerHTML = isDriver ? driverNavItems : clientNavItems;


const nav = document.getElementById("role-based-nav");

if (isDriver) {
    nav.innerHTML = `
        <a href="D_index.html" class="nav-link-custom">
            <i class="fas fa-home me-3"></i>Home
        </a>
        <a href="client-booking.html" class="nav-link-custom">
            <i class="fas fa-user me-3"></i>Client Bookings
        </a>
        <a href="earnings.html" class="nav-link-custom">
            <i class="fas bi-wallet me-3"></i>Earnings
        </a>
        <a href="me.html" class="nav-link-custom">
            <i class="fas fa-user me-3"></i>Profile
        </a>
        <a href="support.html" class="nav-link-custom">
            <i class="fas fa-envelope me-3"></i>Support
        </a>
    `;
} else {
    nav.innerHTML = `
        <a href="#" class="nav-link-custom">
            <i class="fas fa-home me-3"></i>Home
        </a>
        <a href="#!" class="nav-link-custom" data-bs-toggle="modal" data-bs-target="#SearchModal">
            <i class="fas fa-search me-3"></i>Search for a Ride
        </a>
        <a href="me.html" class="nav-link-custom">
            <i class="fas fa-user me-3"></i>Profile
        </a>
        <a href="support.html" class="nav-link-custom">
            <i class="fas fa-envelope me-3"></i>Support
        </a>
        <button class="request-button" data-bs-toggle="modal" data-bs-target="#RequestModal">
            Request for a Ride
        </button>
    `;
}



  function restrictPageAccess(options) {
    const isClient = localStorage.getItem("e_travel_is_client") === "true";
    const isDriver = localStorage.getItem("e_travel_is_driver") === "true";

    if (options.onlyDriver && !isDriver) {
        window.location.href = options.redirectTo || "index.html";
    }

    if (options.onlyClient && !isClient) {
        window.location.href = options.redirectTo || "D_index.html";
    }
}