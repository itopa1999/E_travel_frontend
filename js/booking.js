restrictPageAccess({
    onlyClient: true,
  });
document.addEventListener('DOMContentLoaded', function() {

    


    // Initialize seats
    const seatGrid = document.getElementById('seatGrid');
    const totalPriceElement = document.getElementById('totalPrice');
    const availableSeatsElement = document.getElementById('availableSeats');
    let selectedSeats = 0;
    const seatPrice = 500;

    // Generate seat layout (example: 4 rows of 2-3-2 seating)
    const seatLayout = [1, 2, 0, 3, 4, 5, 0, 6, 7];
    seatLayout.forEach((seat, index) => {
        const seatBtn = document.createElement('button');
        seatBtn.className = 'seat-btn btn btn-outline-primary col-3 mb-2';
        
        if(seat === 0) {
            seatBtn.className += ' invisible';
            seatGrid.appendChild(seatBtn);
            return;
        }

        seatBtn.innerHTML = seat;
        seatBtn.type = 'button';
        
        // Mark some seats as occupied (example)
        if(seat === 3 || seat === 5) {
            seatBtn.className += ' occupied';
            seatBtn.disabled = true;
        }

        seatBtn.addEventListener('click', function() {
            if(!this.classList.contains('occupied')) {
                this.classList.toggle('selected');
                selectedSeats = document.querySelectorAll('.seat-btn.selected').length;
                totalPriceElement.textContent = `₹${selectedSeats * seatPrice}`;
                availableSeatsElement.textContent = 4 - selectedSeats; // Update available seats
            }
        });
        
        seatGrid.appendChild(seatBtn);
    });

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if(selectedSeats > 0) {
            new bootstrap.Modal(document.getElementById('successModal')).show();
        } else {
            alert('Please select at least one seat!');
        }
    });
});