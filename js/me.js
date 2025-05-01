document.addEventListener('DOMContentLoaded', function() {
    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/api/user/get-request/profile/', {
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
                showAlert('error', '❌ Failed to fetch profile info:', response.statusText);
                return;
            }
    
            const data = await response.json();
            
            displayData(data);
        } catch (error) {
            showAlert('error','❌ Error fetching profile info:', error);
        }
    }

    function displayData(data){
    // User Info
    document.getElementById('profileName').innerText = `${data.first_name} ${data.last_name}`;
    document.getElementById('profileEmail').innerText = data.email;
    document.getElementById('profilePhone').innerText = data.phone;
    document.getElementById('profilePicture').src = data.profile_picture;

    }


    // Populate transactions
    // const tbody = document.querySelector('#transactionTable tbody');
    // userData.transactions.forEach(transaction => {
    //     const row = document.createElement('tr');
    //     row.innerHTML = `
    //         <td>${transaction.date}</td>
    //         <td>${transaction.description}</td>
    //         <td class="${transaction.amount > 0 ? 'text-success' : 'text-danger'}">
    //             $${Math.abs(transaction.amount).toFixed(2)}
    //         </td>
    //         <td><span class="badge bg-${getStatusClass(transaction.status)}">${transaction.status}</span></td>
    //     `;
    //     tbody.appendChild(row);
    // });


    // Open modal on edit button click
  document.querySelector('.btn.btn-primary').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
  });

  // Handle form submission
  document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const field = document.getElementById('field').value;
    const newValue = document.getElementById('newValue').value;
    const reason = document.getElementById('reason').value;
    try {
        const response = await fetch('http://127.0.0.1:8000/admins/api/user/get-request/profile/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ field, value: newValue, reason }),
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            modal.hide();

            document.getElementById('editProfileForm').reset();
        showAlert('success','✅ Update submitted successfully!');
        } else {
        showAlert('error','❌ Failed to submit update.');
        }
    } catch (error) {
        showAlert('error','❌ Failed to submit update.');
    }


    });

  fetchData()


  document.getElementById('PLogoutUser').addEventListener('click', function() {
    RemoveAccessFromLocalStorage()
    showAlert("success","✅ Logout successful! ")
    setTimeout(() => {
        window.location.href = "auth.html";
    }, 2000);
});



})