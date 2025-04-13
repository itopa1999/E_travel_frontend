document.addEventListener("DOMContentLoaded", function () {

const rides = [
    {
        from: "Central Park",
        to: "Times Square",
        time: "2024-03-20T14:30",
        price: 18.75,
        seats: 3,
        tags: ['available', 'cheap'],
        theme: 'theme-purple'
    },
    {
        from: "Central Park",
        to: "Times Square",
        time: "2024-03-20T14:30",
        price: 18.75,
        seats: 3,
        tags: ['available', 'cheap'],
        theme: 'theme-blue'
    },
    {
        from: "Central Park",
        to: "Times Square",
        time: "2024-03-20T14:30",
        price: 18.75,
        seats: 3,
        tags: ['available', 'cheap'],
        theme: 'theme-green'
    }
];

function createTags(tags) {
    return tags.map(tag => {
        const cls = {
            'available': 'available-tag',
            'cheap': 'cheap-tag',
            'fast': 'fast-tag'
        }[tag];
        return `<span class="tag ${cls}">${tag}</span>`;
    }).join('');
}


function createRideCard(ride) {
    return `
        <div class="col-lg-6">
            <div class="ride-card card">
                <div class="route-animation">
                    <div class="route-dots"></div>
                    <i class="bi bi-car-front-fill car-icon"></i>
                    <span class="point-label point-a">${ride.from}</span>
                    <span class="point-label point-b">${ride.to}</span>
                </div>

                <div class="detail-item ${ride.theme}">
                    <i class="bi bi-clock me-2"></i>
                    ${new Date(ride.time).toLocaleTimeString()}
                    <span class="ms-auto">Seats: ${ride.seats}</span>
                </div>

                <div class="detail-item ${ride.theme}">
                    <i class="bi bi-geo-alt me-2"></i>
                    Distance: ${(Math.random()*15+5).toFixed(2)} km
                </div>

                <div class="d-flex justify-content-between align-items-center p-3">
                    <div class="d-flex align-items-center">
                        <span class="fare-badge">$${ride.price.toFixed(2)}</span>
                        ${createTags(ride.tags)}
                    </div>
                    <a href="booking.html" class="btn ${ride.theme.replace('theme', 'btn-outline')}">
                        <i class="bi bi-bookmark-check me-2"></i>Book
                    </a>
                </div>
            </div>
        </div>
    `;
}

document.getElementById('rides-container').innerHTML = rides.map(createRideCard).join('');









// Feed switching functionality
const feedTabs = document.querySelectorAll('.feed-tab');
const feedContents = document.querySelectorAll('.feed-content');

feedTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active classes
        feedTabs.forEach(t => t.classList.remove('active'));
        feedContents.forEach(c => c.classList.remove('active'));

        // Add active classes
        this.classList.add('active');
        const feedType = this.dataset.feed;
        document.getElementById(`${feedType}-feed`).classList.add('active');
    });
});




document.querySelector(".myRequest").addEventListener('click', () => {
    if (token === null){
        showAlert("error",'❌ Authorized request');
        RemoveAccessFromLocalStorage()
        setTimeout(() => {
            window.location.href = "auth.html";
        }, 3000);
        return;
    }
});



});