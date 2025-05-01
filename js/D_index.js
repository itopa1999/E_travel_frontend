restrictPageAccess({
    onlyDriver: true,
  });

  async function fetchData() {
    try {
        const response = await fetch(`${BASE_URL}/driver/dashboard/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 401) {
            window.location.href = 'auth.html';
            return;
        }

        if (!response.ok) {
            showAlert('error', '❌ Failed to fetch dashboard info:', response.statusText);
            return;
        }

        const data = await response.json();
        
        displayData(data);
    } catch (error) {
        showAlert('error','❌ Error fetching dashboard info:', error);
    }
}

function displayData(data){
    const isIdVerified = data.isIdVerified
    const alertDiv = document.getElementById('idAlert');
    
    if (!isIdVerified) {
        alertDiv.style.display = 'block';
    } else {
        alertDiv.style.display = 'none';
    }

    document.getElementById("totalEarnings").textContent = `₦${data.wallet_balance.toLocaleString()}`;
    document.getElementById("completedRides").textContent = data.ride_summary.completed;
    document.getElementById("pendingRequests").textContent = data.ride_summary.pending;
    document.getElementById("averageRating").textContent = data.average_rating.toFixed(1);

    document.getElementById("summaryToday").textContent = `₦${data.trans_summary.today.toLocaleString()}`;
    document.getElementById("summaryWeek").textContent = `₦${data.trans_summary.week.toLocaleString()}`;
    document.getElementById("summaryMonth").textContent = `₦${data.trans_summary.month.toLocaleString()}`;

    const tbody = document.getElementById('activeRequests');
    
    data.active_rides.forEach(ride  => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Route">
                <div>${ride.departure}</div>
                <small class="text-muted">to ${ride.destination}</small>
            </td>
            <td data-label="Type">Passenger</td>
            <td data-label="Distance">12km</td>
            <td data-label="Fare">₦${ride.price}</td>
            <td data-label="Status">
                  <span class="bg-pending">  Pending </span>
            </td>
            <td data-label="Action">
                <button class="btn btn-sm btn-success me-2">Accept</button>
                <button class="btn btn-sm btn-danger">Decline</button>
            </td>
        `;

        row.style.cursor = "pointer";
        row.onclick = () => {
            window.location.href = `active-ride-details.html?id=${ride.id}`;
        };

        tbody.appendChild(row);

    });

        
        const reviewsList = document.getElementById("list-group");
        reviewsList.innerHTML = "";

        

        data.ratings.forEach(r => {
            const item = document.createElement("div");
            item.className = "list-group-item";
            item.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="me-3">${"⭐".repeat(r.rating)}</div>
                    <small class="text-muted">"${r.comment}"</small>
                </div>
            `;
            reviewsList.appendChild(item);
        });

    

    const onlineToggle = document.getElementById('onlineToggle');
    const toggleLabel = document.getElementById('toggleLabel');

    function updateToggleState() {
        if (!isIdVerified){
            onlineToggle.checked = false;
            onlineToggle.disabled = true;
            toggleLabel.classList.add('text-mute');
            toggleLabel.textContent = 'Offline (ID Not Verified)';
        } else {
            onlineToggle.disabled = false;
            onlineToggle.checked = data.availability;
            toggleLabel.classList.remove('text-muted');
            toggleLabel.textContent = data.availability ? 'Online' : 'Offline';
        }
    }
    updateToggleState();

    // Optional: Add event listener if you need real-time updates
    onlineToggle.addEventListener('change', async (e) => {
        if (isIdVerified) {
            const previousState = data.availability;
            data.availability = e.target.checked;
            toggleLabel.textContent = data.availability ? 'Online' : 'Offline';
    
            try {
                const response = await fetch(`${BASE_URL}/driver/update/availability/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    window.location.href = 'auth.html';
                    return;
                }
    
                if (!response.ok) {
                    showAlert('error','❌ Failed to update availability');
                    // Revert UI if request fails
                    data.availability = previousState;
                    onlineToggle.checked = previousState;
                    toggleLabel.textContent = previousState ? 'Online' : 'Offline';
                    return;
                }
    
                const result = await response.json();
                showAlert('success', `✅ Availability updated: ${result.is_available ? 'Online' : 'Offline'}`);
    
            } catch (error) {
                // Revert UI if request fails
                data.availability = previousState;
                onlineToggle.checked = previousState;
                toggleLabel.textContent = previousState ? 'Online' : 'Offline';
                showAlert('error','❌ Failed to update availability. Please try again.');
            }
        }
    });
}


fetchData();
document.getElementById('payoutForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const bank = document.getElementById('bank').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const totalEarningsText = document.getElementById('totalEarnings').textContent;
    const availableAmount = parseFloat(totalEarningsText.replace(/[₦,]/g, ''));

    const errorSpan = document.getElementById('amountError');

    if (amount > availableAmount) {
        errorSpan.textContent = `❌ You can only withdraw up to ₦${availableAmount.toLocaleString()}`;
        return;
    } else {
        errorSpan.textContent = '';
    }

    try {
        const response = await fetch(`${BASE_URL}/driver/withdrawal/process/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, bank, accountNumber }),
        });

        if (response.status === 401) {
            window.location.href = 'auth.html';
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            showAlert('error', `❌ ${data.detail || 'Withdrawal failed.'}`);
            return;
        }

        showAlert('success', `✅ ${data.detail || 'Withdrawal successful!'}`);

        // Close modal
        const modalEl = document.getElementById('payoutModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        fetchData()


    } catch (err) {
        console.error("Error during withdrawal:", err);
        showAlert('error', '❌ Something went wrong. Please try again.');
    }
});
