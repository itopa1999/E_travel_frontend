document.addEventListener("DOMContentLoaded", function () {
document.querySelector(".login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const password = formData.get("password");

    if (password.length < 8) {
        showAlert("info","ℹ️ Password must be at least 8 characters long.");
        return;
    }

    const loginButton = document.getElementById("loginBtn");
    const loginSpinner = document.getElementById("loginSpinner");

    loginButton.disabled = true;
    loginSpinner.classList.remove("d-none");

    try {
        const response = await fetch("http://127.0.0.1:8000/admins/api/user/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        loginButton.disabled = false;
        loginSpinner.classList.add("d-none");

        const data = await response.json();

        if (!response.ok) {
            showAlert('error','❌ '+ data.error || "❌ Something went wrong! Please try again.");
            return;
        }
        localStorage.setItem("e_travel_token", data.access);
        localStorage.setItem("e_travel_user_id", data.id);
        localStorage.setItem("e_travel_is_driver", data.is_driver);
        localStorage.setItem("e_travel_is_client", data.is_client);
        localStorage.setItem("e_travel_first_name", data.first_name);
        localStorage.setItem("e_travel_profilePicture", data.profile_pic);
        document.querySelector(".login-form").reset();

        if (data.is_driver){
            window.location.href = "D_index.html";
        }else if (data.is_client){
            window.location.href = "index.html";
        }else{
            showAlert('error', "❌ Sorry, we can't no account type please login again or create an account");;
        }
        


    } catch (error) {
        showAlert('error', "❌ Server is not responding. Please try again later.");
    } finally {
        loginButton.disabled = false;
        loginSpinner.classList.add("d-none");
    }

});

let selectedPlan = null;
document.querySelector(".register-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const password = formData.get("password");
    const fullName = formData.get("full_name");
    if (password.length < 8) {
        showAlert("info","ℹ️ Password must be at least 8 characters long.");
        return;
    }
    if (!isValidFullName(fullName)) {
        showAlert("info","ℹ️ Invalid full name! Please enter a valid name.");
        return;
    }

    driverCheck = document.getElementById('driverTerms')
    clientCheck = document.getElementById('clienTerms')

    if(!driverCheck.checked && !clientCheck.checked){
        showAlert("info","ℹ️ As Driver or Client condition must be check");
        return;
    }

    if(driverCheck.checked && clientCheck.checked){
        showAlert("info","ℹ️ As Driver or Client both condition cannot be check");
        return;
    }

    termCheck = document.getElementById('terms')
    if(!termCheck.checked){
        showAlert("info","ℹ️ Terms and Condition must be check");
        return;
    }

    if (driverCheck.checked && !selectedPlan) {
        const modal = new bootstrap.Modal(document.getElementById('subscriptionModal'));
        modal.show();

        document.querySelectorAll('#subscriptionModal button[data-plan]').forEach(btn => {
            btn.addEventListener('click', function () {
                selectedPlan = this.getAttribute('data-plan');
                selectedPrice = parseInt(this.getAttribute('data-price'));
                modal.hide();
                document.querySelector(".register-form").dispatchEvent(new Event('submit'));
            }, { once: true }); // ensure it only fires once
        });

        return;
    }
    if (selectedPlan && selectedPrice) {
        formData.append("subscription_plan", selectedPlan);
        formData.append("subscription_price", selectedPrice);
    }

    formData.append("is_driver", driverCheck.checked);
    formData.append("is_client", clientCheck.checked);



    const signUpButton = document.getElementById("signUpBtn");
    const signUpSpinner = document.getElementById("signUpSpinner");

    signUpButton.disabled = true;
    signUpSpinner.classList.remove("d-none");

    try {
        const response = await fetch("http://127.0.0.1:8000/admins/api/user/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        const data = await response.json();

        console.log(data)

        signUpButton.disabled = false;
        signUpSpinner.classList.add("d-none");

        if (!response.ok) {
            showAlert('error','❌ ' + data.error || "❌ Something went wrong! Please try again.");
            return;
        }

        document.querySelector(".register-form").reset();

        if (response.status === 201) {
            showAlert('success', '✅ ' + data.message);
            localStorage.setItem("e_travel_email", data.email);
            setTimeout(() => {
                window.location.href = "verify-token.html";
            }, 4000);
        }

        else if (response.status === 200 && data.checkout_url) {
            showAlert('info', '🔄 Redirecting to payment...');
            setTimeout(() => {
                window.location.href = data.checkout_url;
            }, 1500);
        }
        
        

    } catch (error) {
        showAlert('error',"❌ Server is not responding. Please try again later.");
    }finally {
        signUpButton.disabled = false;
        signUpSpinner.classList.add("d-none");
    }
});


function isValidFullName(fullName) {
    fullName = fullName.trim();

    const nameRegex = /^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/;

    return nameRegex.test(fullName) && fullName.split(/\s+/).length >= 1;
}





const tabs = document.querySelectorAll('.auth-tab');
const forms = document.querySelectorAll('.form-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active classes
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));

        // Add active classes
        tab.classList.add('active');
        const formId = tab.dataset.form;
        document.getElementById(`${formId}Form`).classList.add('active');
    });
});

});