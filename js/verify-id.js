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

      console.log('Form submitted successfully with the following values:');
      console.table(formData);

      try {
        const response = await fetch('http://127.0.0.1:8000/backend/api/driver/id/verification/process/', {
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
            showAlert('error', '❌ Submission failed: ' + errorData.detail || response.statusText);
            return;
        }

        const data = await response.json();
        console.log('✅ Submission successful:', data);
        showAlert('success', '✅ Form submitted successfully!');
    } catch (error) {
        console.error('❌ Submission error:', error);
        showAlert('error', '❌ Network error occurred.');
    }
  
      
  }

  // Initial UI setup
  showStep(currentStep);