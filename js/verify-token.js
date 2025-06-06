// Function to get query parameters from the URL
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function() {
    const message = getQueryParameter('message');

    if (message) {
        console.log("Displaying alert for message: " + message);
        if (message === "1") {
            showAlert('success', '✅  Account created successfully. Please check your email for verification.');
        }

    }
};


 document.getElementById("tokenForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let otpInputs = document.querySelectorAll(".otp-input");
    let otpCode = parseInt(Array.from(otpInputs).map(input => input.value).join(""), 10);

    if (isNaN(otpCode) || otpCode.toString().length !== 6) {
        showAlert("info","ℹ️ Please enter a valid 6-digit verification code.");
        return;
    }

    const verifyButton = document.getElementById("verifyBtn");
    const verifySpinner = document.getElementById("verifySpinner");

    verifyButton.disabled = true;
    verifySpinner.classList.remove("d-none");

    try {
        const response = await fetch("http://127.0.0.1:8000/admins/api/user/verify/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: otpCode })
        });

        const data = await response.json();
        verifyButton.disabled = false;
        verifySpinner.classList.add("d-none");

        if (!response.ok) {
            showAlert('error','❌' + data.error || "❌ Something went wrong! Please try again.");
            return;
        }
        localStorage.setItem("e_travel_token", data.e_travel);
        localStorage.setItem("e_travel_user_id", data.id);
        localStorage.setItem("e_travel_is_driver", data.is_driver);
        localStorage.setItem("e_travel_is_client", data.is_client);
        localStorage.setItem("e_travel_first_name", data.first_name);
        localStorage.setItem("e_travel_profilePicture", data.profile_pic);
        showAlert('success','✅ ' +data.message);
        localStorage.removeItem('e_travel_email');

        if (data.is_driver){
            setTimeout(() => {
                window.location.href = "D_index.html";
            }, 3000);
        }else if (data.is_client){
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }else{
            showAlert('error', "❌ Sorry, we can't no account type please login again or create an account");;
        }

        


    } catch (error) {
        showAlert('error',"❌ Server is not responding. Please try again later.");
    }finally {
        verifyButton.disabled = false;
        verifySpinner.classList.add("d-none");
    }
});

async function resendToken(element){
    const email = localStorage.getItem("e_travel_email") || getQueryParameter('email');;
    if(email === null || email === undefined){
        showAlert("info","ℹ️ cannot find email, please contact support");
        return;
    }

    const originalText = element.innerHTML;

    element.innerHTML = '<span class="spinner"></span> Sending...';
    element.disabled = true; 

    try {
        const response = await fetch("http://127.0.0.1:8000/admins/api/user/resend/verification/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        element.innerHTML = originalText;
        element.disabled = false;
        if (!response.ok) {
            showAlert('error','❌ ' + data.error || "❌ Something went wrong! Please try again.");
            return;
        }
        showAlert('success','✅ ' +data.message);
        
    } catch (error) {
        showAlert('error',"❌ Server is not responding. Please try again later.");
    }finally {
        element.innerHTML = originalText;
        element.disabled = false;
    } 

}

const inputs = document.querySelectorAll('#tokenForm input');
// OTP Input Handling
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && !input.value) {
            inputs[index - 1].focus();
        }
    });
});

