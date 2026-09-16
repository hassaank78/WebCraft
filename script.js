document.addEventListener('DOMContentLoaded', () => {


    // 2. Form Submission via FormSubmit (AJAX API)
    const contactForm = document.getElementById('contact-form');
    const formCard = document.getElementById('form-card');
    const successCard = document.getElementById('success-card');
    const submitBtn = document.getElementById('submit-btn');

    const recipientEmail = "hassankhan4408@gmail.com";

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Clear previous errors
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const nameWrapper = document.getElementById('name-wrapper') || nameInput.parentElement;
        const phoneWrapper = document.getElementById('phone-wrapper') || phoneInput.parentElement;
        const nameError = document.getElementById('name-error');
        const phoneError = document.getElementById('phone-error');

        nameWrapper.classList.remove('error');
        phoneWrapper.classList.remove('error');
        if (nameError) nameError.classList.remove('visible');
        if (phoneError) phoneError.classList.remove('visible');

        let isValid = true;

        // Custom Validation: Name (only letters and spaces, min 3 letters) to prevent random spam text
        const nameVal = nameInput.value.trim();
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;
        if (!nameRegex.test(nameVal)) {
            nameWrapper.classList.add('error');
            if (nameError) {
                nameError.textContent = 'Please enter a valid name (letters only, min 3 characters).';
                nameError.classList.add('visible');
            }
            isValid = false;
        }

        // Custom Validation: Phone (India and UAE mobile numbers)
        const rawPhoneVal = phoneInput.value.trim();
        const cleanPhone = rawPhoneVal.replace(/[\s()-]/g, '');
        let normalizedPhone = cleanPhone;
        let phoneCountry = cleanPhone.length === 9 ? 'UAE' : 'India';

        if (normalizedPhone.startsWith('+971')) {
            normalizedPhone = normalizedPhone.substring(4);
            phoneCountry = 'UAE';
        } else if (normalizedPhone.startsWith('971')) {
            normalizedPhone = normalizedPhone.substring(3);
            phoneCountry = 'UAE';
        } else if (normalizedPhone.startsWith('+91')) {
            normalizedPhone = normalizedPhone.substring(3);
        } else if (normalizedPhone.startsWith('91') && normalizedPhone.length === 12) {
            normalizedPhone = normalizedPhone.substring(2);
        } else if (normalizedPhone.startsWith('0') && normalizedPhone.length === 10) {
            normalizedPhone = normalizedPhone.substring(1);
            phoneCountry = 'UAE';
        }

        const validMobile = phoneCountry === 'UAE'
            ? /^\d{9}$/.test(normalizedPhone)
            : /^[6-9]\d{9}$/.test(normalizedPhone);

        if (!/^\d+$/.test(normalizedPhone)) {
            phoneWrapper.classList.add('error');
            if (phoneError) {
                phoneError.textContent = 'Mobile number should contain only digits.';
                phoneError.classList.add('visible');
            }
            isValid = false;
        } else if (!validMobile) {
            phoneWrapper.classList.add('error');
            if (phoneError) {
                phoneError.textContent = phoneCountry === 'UAE'
                    ? 'Enter a valid UAE mobile number (9 digits excluding country code).'
                    : 'Enter a valid Indian mobile number (10 digits, excluding country code).';
                phoneError.classList.add('visible');
            }
            isValid = false;
        }
        if (!isValid) return;

        // Change button state to loading
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';
        submitBtn.disabled = true;

        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            const jsonResponse = await response.json();

            if (response.ok) {
                showSuccessState();
            } else {
                console.error('Error submitting form:', jsonResponse.message);
                alert(jsonResponse.message || "Something went wrong! Please try again.");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert("Network error occurred. Please try again.");
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function showSuccessState() {
        // Add a nice fade out to the form, then show success
        formCard.style.transition = 'opacity 0.3s ease';
        formCard.style.opacity = '0';

        setTimeout(() => {
            formCard.classList.add('hidden');
            successCard.classList.remove('hidden');
        }, 300);
    }
});
