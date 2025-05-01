restrictPageAccess({
    onlyDriver: true,
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    const container = document.getElementById('rides-container');
    const modal = new bootstrap.Modal(document.getElementById('rideModal'));

    async function fetchData() {
      try {
        const response = await fetch(
          `${BASE_URL}/driver/ride/requests/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 401) {
          window.location.href = 'auth.html';
          return;
        }
        if (!response.ok) {
          showAlert('error', '❌ Error loading rides:', response.statusText);
          return;
        }

        const data = await response.json();
        displayData(data);
      } catch (error) {
        showAlert('error','❌ Error loading rides:', error);
      }
    }

    function displayData(rides) {
      loading.style.display = 'none'; // ✅ hide spinner
      if (rides.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No rides available.</p>';
        return;
      }
        container.innerHTML = rides.map(ride => `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card ride-card h-100" 
                     data-bs-toggle="modal" 
                     data-bs-target="#rideModal"
                     onclick="updateModal(${JSON.stringify(ride).replace(/"/g, '&quot;')})">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <i class="fas fa-map-marker-alt text-danger me-2"></i>
                            <h5 class="card-title mb-0">${ride.departure}</h5>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <i class="fas fa-flag-checkered text-success me-2"></i>
                            <h5 class="card-title mb-0">${ride.destination}</h5>
                        </div>
                        <div class="row g-2">
                            <div class="col-6">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-clock text-warning me-2"></i>
                                    <span class="text-mute small">${new Date(ride.date_of_departure).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-coins text-info me-2"></i>
                                    <span class="text-success fw-bold">₦${ride.budget_price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.updateModal = function(ride) {
      document.getElementById('user-avatar').src = ride.user.profile_picture || 'https://via.placeholder.com/150';
      document.getElementById('user-name').textContent = `${ride.user.first_name} ${ride.user.last_name}`;
      document.getElementById('user-email').textContent = ride.user.email || 'N/A';
      document.getElementById('user-phone').textContent = ride.user.phone || 'Not provided';
  
      document.getElementById('modal-departure').textContent = ride.departure;
      document.getElementById('modal-destination').textContent = ride.destination;
      document.getElementById('modal-date').textContent = new Date(ride.date_of_departure).toLocaleString();
      document.getElementById('modal-budget').textContent = `₦${ride.budget_price}`;
      document.getElementById('modal-payment').textContent = ride.payment_method || 'Not specified';
      document.getElementById('modal-request').textContent = ride.special_request || 'None';
  };
  


    fetchData()
});