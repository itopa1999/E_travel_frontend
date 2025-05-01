restrictPageAccess({ onlyDriver: true });

document.addEventListener('DOMContentLoaded', function() {

    async function fetchData() {
        try {
          const response = await fetch(
            `${BASE_URL}/driver/earning/summary/`,
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
        } catch (error) {
          showAlert('error','❌ Error fetching rider details:', error);
        }
      }
  
      function displayData(data) {
        document.getElementById("earnings-today").innerText = `₦${data.trans_summary.today}`;
        document.getElementById("earnings-week").innerText = `₦${data.trans_summary.week}`;
        document.getElementById("earnings-month").innerText = `₦${data.trans_summary.month}`;
        document.getElementById('totalEarnings').innerText = `₦${data.wallet_balance}`;

        // Populate transaction table
        const tbody = document.getElementById("transactionTableBody");
        tbody.innerHTML = "";

        data.trans_history.forEach(tx => {
            const tr = document.createElement("tr");
            tr.style.cursor = 'pointer';
            tr.setAttribute('data-bs-toggle', 'modal');
            tr.setAttribute('data-bs-target', '#transactionModal');
            tr.addEventListener("click", () => showTransactionDetails(tx));

            tr.innerHTML = `
                <td data-label="Date">${new Date(tx.date).toLocaleDateString()}</td>
                <td data-label="Description">${tx.description}</td>
                <td data-label="Amount" class="text-end text-${tx.tran_type === 'debit' ? 'danger' : 'success'}">₦${tx.amount}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function showTransactionDetails(tx) {
        const modalBody = document.getElementById("transactionDetails");
        modalBody.innerHTML = `
            <p><strong>Amount:</strong> ₦${tx.amount}</p>
            <p><strong>Description:</strong> ${tx.description}</p>
            <p><strong>Type:</strong> ${tx.tran_type}</p>
            <p><strong>Reference:</strong> ${tx.ref}</p>
            <p><strong>Date:</strong> ${new Date(tx.date).toLocaleString()}</p>
        `;
    }

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
  
      

      fetchData()

})