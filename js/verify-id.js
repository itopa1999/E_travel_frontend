restrictPageAccess({
    onlyDriver: true,
  });


  let currentStep = 1;
  const totalSteps = 3;

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  // Create Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.textContent = 'Submit';
  submitBtn.className = "verify-button";
  submitBtn.style.display = 'none';
  submitBtn.onclick = submitForm;
  document.querySelector('.form-navigation').appendChild(submitBtn);

  function updateStepper() {
      document.querySelectorAll('.step').forEach((step, index) => {
          step.classList.toggle('active', index + 1 === currentStep);
      });
  }

  function showStep(stepNumber) {
      // Hide all form steps
      document.querySelectorAll('.form-step').forEach(step => {
          step.classList.remove('active');
      });

      // Show the current step
      document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

      // Stepper UI update
      updateStepper();

      // Toggle buttons
      prevBtn.disabled = stepNumber === 1;
      nextBtn.style.display = stepNumber < totalSteps ? 'block' : 'none';
      submitBtn.style.display = stepNumber === totalSteps ? 'block' : 'none';
  }

  function validateStep(stepNumber) {
      const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
      const inputs = currentStepElement.querySelectorAll('input, select');

      for (let input of inputs) {
          if (!input.checkValidity()) {
              input.reportValidity();
              return false;
          }
      }
      return true;
  }

  function nextStep() {
      if (!validateStep(currentStep)) return;

      if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
      }
  }

  function prevStep() {
      if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
      }
  }

  function handleFilePreview(input, previewId) {
      const preview = document.getElementById(previewId);
      const file = input.files[0];

      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
          }
          reader.readAsDataURL(file);
      }
  }

  document.getElementById('selfie').addEventListener('change', function () {
      handleFilePreview(this, 'selfiePreview');
  });

  document.getElementById('driver_licenses').addEventListener('change', function () {
      handleFilePreview(this, 'licensePreview');
  });

  async function submitForm() {
      if (!validateStep(currentStep)) return;
    

      const formData = new FormData();
      const inputs = document.querySelectorAll('#multiStepForm input, #multiStepForm select');
      
      inputs.forEach(input => {
        if (input.type === 'file') {
            if (input.files.length > 0) {
                formData.append(input.id, input.files[0]);
            }
        } else {
            formData.append(input.id, input.value);
        }
    });

    console.table(formData)


      try {
        const response = await fetch(`${BASE_URL}/driver/id/verification/process/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.status === 401) {
            window.location.href = 'auth.html';
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error submitting form:', errorData);
            showAlert('error', '❌ Submission failed: ' + errorData.error || response.statusText);
            return;
        }
        console.table(formData)
        showAlert('success', '✅ Form submitted successfully!');
    } catch (error) {
        console.error('❌ Submission error:', error);
        showAlert('error', '❌ Network error occurred.');
    }
  
      
  }

  // Initial UI setup
  showStep(currentStep);



async function GetIdInfo() {
    try {
        const response = await fetch(`${BASE_URL}/driver/info/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            window.location.href = 'auth.html';
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            showAlert('error', '❌ Cannot get details: ' + errorData.error || response.statusText);
            return;
        }

        const data = await response.json();
        DisplayData(data)
    } catch (error) {
        showAlert('error', '❌ Network error occurred.');
    }
}

function DisplayData(data) {
    // Ride Info
    document.getElementById('departure').value = data.ride.departure || '';
    document.getElementById('destination').value = data.ride.destination || '';
    document.getElementById('date_of_departure').value = data.ride.date_of_departure
        ? new Date(data.ride.date_of_departure).toISOString().slice(0, 16)
        : '';
    document.getElementById('price_per_seat').value = data.ride.price_per_seat || '';

    // Vehicle Info
    document.getElementById('vehicle_name').value = data.vehicle.vehicle_name || '';
    document.getElementById('vehicle_type').value = data.vehicle.vehicle_type || '';
    document.getElementById('seating_capacity').value = data.vehicle.seating_capacity || '';
    document.getElementById('plate_no').value = data.vehicle.plate_no || '';
    document.getElementById('vehicle_color').value = data.vehicle.vehicle_color || '';

    // Identity Info
    document.getElementById('ID_no').value = data.identity.ID_no || '';

    // Preview files if needed (optional)
    if (data.identity.selfie) {
        document.getElementById('selfiePreview').innerHTML = `<img src="${data.identity.selfie}" alt="Selfie" width="100">`;
    }

    if (data.identity.driver_licenses) {
        document.getElementById('licensePreview').innerHTML = `<img src="${data.identity.driver_licenses}" alt="License" width="100">`;
    }
}


GetIdInfo()



const vehicleData = {
    "Sedan": [
        { "model": "Toyota Corolla", "seating_capacity": 5 },
        { "model": "Toyota Camry", "seating_capacity": 5 },
        { "model": "Honda Accord", "seating_capacity": 5 },
        { "model": "Hyundai Elantra", "seating_capacity": 5 },
        { "model": "Nissan Altima", "seating_capacity": 5 },
        { "model": "Kia Rio", "seating_capacity": 5 },
        { "model": "Peugeot 406", "seating_capacity": 5 },
        { "model": "Volkswagen Passat", "seating_capacity": 5 }
    ],
    "SUV": [
        { "model": "Toyota RAV4", "seating_capacity": 5 },
        { "model": "Toyota Highlander", "seating_capacity": 7 },
        { "model": "Honda CR-V", "seating_capacity": 5 },
        { "model": "Ford Explorer", "seating_capacity": 7 },
        { "model": "Lexus RX 350", "seating_capacity": 5 },
        { "model": "Mitsubishi Pajero", "seating_capacity": 7 },
        { "model": "Hyundai Santa Fe", "seating_capacity": 7 },
        { "model": "Nissan Pathfinder", "seating_capacity": 7 }
    ],
    "Van": [
        { "model": "Toyota Sienna", "seating_capacity": 7 },
        { "model": "Honda Odyssey", "seating_capacity": 7 },
        { "model": "Toyota Hiace Bus", "seating_capacity": 15 },
        { "model": "Ford Transit", "seating_capacity": 15 },
        { "model": "Nissan Urvan", "seating_capacity": 14 }
    ]
};

// Populate type datalist
const vehicleTypeList = document.getElementById('vehicleTypeList');
Object.keys(vehicleData).forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    vehicleTypeList.appendChild(option);
});

document.getElementById('vehicle_type').addEventListener('change', function () {
    const selectedType = this.value;
    const modelList = document.getElementById('vehicleModelList');
    modelList.innerHTML = ""; // Clear old models

    if (vehicleData[selectedType]) {
        vehicleData[selectedType].forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.model;
            modelList.appendChild(option);
        });
    }

    document.getElementById('vehicle_model').value = '';
    document.getElementById('seating_capacity').value = '';
});

document.getElementById('vehicle_model').addEventListener('change', function () {
    const selectedModel = this.value;
    const selectedType = document.getElementById('vehicle_type').value;

    if (vehicleData[selectedType]) {
        const match = vehicleData[selectedType].find(v => v.model === selectedModel);
        if (match) {
            document.getElementById('seating_capacity').value = match.seating_capacity;
        } else {
            document.getElementById('seating_capacity').value = '';
        }
    }
});


const colorInput = document.getElementById('vehicle_color');
const colorPicker = document.getElementById('color_picker');

// When user picks a color, update the text field
colorPicker.addEventListener('input', () => {
    colorInput.value = colorPicker.value;
});

// When user types a hex color manually, update the color picker
colorInput.addEventListener('input', () => {
    const val = colorInput.value;
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
        colorPicker.value = val;
    }
});