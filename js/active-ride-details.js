  restrictPageAccess({ onlyDriver: true });

  document.addEventListener('DOMContentLoaded', function() {

    const params = new URLSearchParams(window.location.search);
    const rideId = params.get('id');
    if (!rideId) {
      window.location.href = 'D_index.html';
      return;
    }

    const btnComplete = document.getElementById('btn-complete');
    const btnReject   = document.getElementById('btn-reject');

    [btnComplete, btnReject].forEach(btn => {
      btn.disabled = true;
      btn.classList.add('btn-secondary');
    });

    async function fetchData() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/backend/api/driver/ride/passenger/details/${rideId}/`,
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
          showAlert('error', '❌ Failed to fetch rider details:', response.statusText);
          return;
        }

        const data = await response.json();
        displayData(data);
        setupButtons(data);
      } catch (error) {
        showAlert('error','❌ Error fetching rider details:', error);
      }
    }

    function displayData(data) {
      console.log(data)
      document.getElementById('passenger-name').innerText = `${data.first_name} ${data.last_name}`;
      document.getElementById('passenger-phone').innerText = data.phone;
      document.getElementById('passenger-email').innerText = data.email;
      document.getElementById('passengerImg').src = data.profile_picture;

      document.getElementById('seats-taken').innerText = data.seat_taken;
      const payBadge = document.getElementById('payment-status');
      payBadge.innerText = data.has_paid ? 'Paid' : 'Unpaid';
      payBadge.className = data.has_paid
        ? 'h5 mb-0 badge bg-success'
        : 'h5 mb-0 badge bg-danger';

        const statusBadge = document.getElementById('ride-status');
        const st = data.status;

        let text, cls;
        switch (st) {
          case 'pending':
            text = 'Pending';
            cls  = 'h5 mb-0 badge bg-warning';  // yellow
            break;
          case 'ongoing':
            text = 'Ongoing';
            cls  = 'h5 mb-0 badge bg-primary';  // blue
            break;
          case 'completed':
            text = 'Completed';
            cls  = 'h5 mb-0 badge bg-secondary'; // gray
            break;
          case 'rejected':
            text = 'Rejected';
            cls  = 'h5 mb-0 badge bg-danger';   // red
            break;
          default:
            text = 'Unknown';
            cls  = 'h5 mb-0 badge bg-light';
        }

        statusBadge.innerText  = text;
        statusBadge.className  = cls;

      document.getElementById('payment-method').innerHTML =
        `<i class="fas fa-credit-card me-2"></i>${capitalize(data.payment_method)}`;

      document.getElementById('special-request').innerText = data.special_request || '—';
    }

    function setupButtons(data) {
      const actionable = data.is_actionable;
      btnComplete.disabled = !actionable;
      btnReject.disabled   = !actionable;

      [btnComplete, btnReject].forEach(btn => {
        btn.classList.toggle('btn-secondary', !actionable);
        if (btn.id === 'btn-complete') {
          btn.classList.toggle('btn-success', actionable);
        } else {
          btn.classList.toggle('btn-danger', actionable);
        }
      });

      if (actionable) {
        btnComplete.addEventListener('click', () => updateStatus(data.id, 'completed'));
        btnReject.addEventListener('click', () => updateStatus(data.id, 'rejected'));
      }
    }

    async function updateStatus(passengerId, newStatus) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/backend/api/driver/ride/passenger/details/${passengerId}/`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );
        if (response.status === 401) {
          window.location.href = 'auth.html';
          return;
        }
        if (!response.ok) {
          showAlert('error', '❌ Failed to fetch update:', response.statusText);
          return;
        }
        const updated = await response.json();

        // Update badge and disable buttons
        const badge = document.getElementById('ride-status');
        badge.innerText = capitalize(updated.status);
        badge.className = updated.status === 'completed'
          ? 'h5 mb-0 badge bg-secondary'
          : 'h5 mb-0 badge bg-danger';

        [btnComplete, btnReject].forEach(btn => {
          btn.disabled = true;
          btn.classList.remove('btn-success','btn-danger');
          btn.classList.add('btn-secondary');
        });

        showAlert('success', `✅ Status changed to "${updated.status}".`);
      } catch (err) {
        console.error('Error updating status:', err);
        showAlert('error','❌ Failed to update status. Please try again.');
      }
    }

    function capitalize(str) {
      if (!str) return '';
      return str[0].toUpperCase() + str.slice(1);
    }

    // 9. Hover animations (unchanged)
    document.querySelectorAll('.hover-effect').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('animate__animated', 'animate__pulse');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('animate__animated', 'animate__pulse');
      });
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
      item.addEventListener('click', () => item.classList.toggle('active'));
    });

    fetchData();
  });
