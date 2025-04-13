if (token === null){
    showAlert("error",'❌ Authorized request');
    RemoveAccessFromLocalStorage()
    setTimeout(() => {
        window.location.href = "auth.html";
    }, 3000);
      
}



// Sample data - replace with actual data from your backend
const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    transactions: [
        { date: "2023-09-15", description: "Premium Subscription", amount: 49.99, status: "Completed" },
        { date: "2023-08-28", description: "Wallet Top-up", amount: 100.00, status: "Completed" },
        { date: "2023-07-12", description: "Service Fee", amount: -9.99, status: "Processed" }
    ]
};

// Populate user data
document.addEventListener('DOMContentLoaded', function() {
    // User Info
    document.getElementById('fullName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('userPhone').textContent = userData.phone;

    // Populate transactions
    const tbody = document.querySelector('#transactionTable tbody');
    userData.transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td class="${transaction.amount > 0 ? 'text-success' : 'text-danger'}">
                $${Math.abs(transaction.amount).toFixed(2)}
            </td>
            <td><span class="badge bg-${getStatusClass(transaction.status)}">${transaction.status}</span></td>
        `;
        tbody.appendChild(row);
    });
});

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'completed': return 'success';
        case 'processed': return 'primary';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
}
