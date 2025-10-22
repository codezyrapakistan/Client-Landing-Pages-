
document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp URL for all buttons
    const whatsappURL = "https://api.whatsapp.com/send?phone=9632870766&text=I%27m%20interested%20in%20Prestige%20Raintree%20Park.%20Share%20me%20the%20details.";

    // Get popup elements
    const popupOverlay = document.getElementById('popupOverlay');

    // Select all buttons with the 'whatsapp-btn' class
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');

    whatsappButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Open the existing enquiry popup instead of directly going to WhatsApp
        if (popupOverlay) {
            popupOverlay.classList.remove('hidden');
        }
      });
    });
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');

    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });

    closeMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });

    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
    
    const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // Auto-open popup after 4 seconds
    setTimeout(() => {
        if (popupOverlay) {
            popupOverlay.classList.remove('hidden');
        }
    }, 4000);

    // Open popup when button is clicked
    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            popupOverlay.classList.remove('hidden');
        });
    }

    // Close popup when close button is clicked
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            popupOverlay.classList.add('hidden');
        });
    }

    // Close popup when clicking outside
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.add('hidden');
            }
        });
    }
    
    // Handle form submissions
    const enquiryForm = document.getElementById('enquiryForm');
    const siteVisitForm = document.getElementById('siteVisitForm');
    const mobileSiteVisitForm = document.getElementById('mobileSiteVisitForm');

    // Function to show loading state on submit button
    function showLoading(button) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
            </div>
        `;
        return originalText;
    }

    // Function to hide loading state on submit button
    function hideLoading(button, originalText) {
        button.disabled = false;
        button.innerHTML = originalText;
    }

    // Function to submit form data to Google Apps Script
    async function submitFormData(formData, form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = showLoading(submitButton);
        
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyO5mH71iXk-L_QYUdCdvyiKEPiFVES8rqk9NOFIirNPRRA_9pN-X5ymNAe76YAIsyn/exec', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                hideLoading(submitButton, originalText);
                alert('Thank you! Your enquiry has been submitted successfully. We will contact you soon.');
                form.reset();
                
                // Get customer details for WhatsApp message
                const name = formData.get('name') || '';
                const phone = formData.get('phone') || '';
                
                // Create personalized WhatsApp message
                let message = "Hi, I'm interested in Prestige Raintree Park. Share me the details.";
                if (name && phone) {
                    message = `Hi, I'm ${name} and my mobile number is ${phone}. I'm interested in Prestige Raintree Park. Please share me the details.`;
                }
                
                // Hide popup if it's the enquiry form
                if (form.id === 'enquiryForm' && popupOverlay) {
                    popupOverlay.classList.add('hidden');
                }
                
                // Redirect to WhatsApp after a short delay for all forms
                setTimeout(() => {
                    const encodedMessage = encodeURIComponent(message);
                    const customWhatsAppURL = `https://api.whatsapp.com/send?phone=9632870766&text=${encodedMessage}`;
                    window.open(customWhatsAppURL, '_blank');
                }, 1000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            hideLoading(submitButton, originalText);
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again or contact us directly.');
        }
    }

    // Handle enquiry form submission (popup)
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(enquiryForm);
            
            // Add timestamp
            formData.append('timestamp', new Date().toISOString());
            
            submitFormData(formData, enquiryForm);
        });
    }

    // Handle site visit form submission (desktop sidebar)
    if (siteVisitForm) {
        siteVisitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(siteVisitForm);
            
            // Add timestamp
            formData.append('timestamp', new Date().toISOString());
            
            submitFormData(formData, siteVisitForm);
        });
    }

    // Handle mobile site visit form submission
    if (mobileSiteVisitForm) {
        mobileSiteVisitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(mobileSiteVisitForm);
            
            // Add timestamp
            formData.append('timestamp', new Date().toISOString());
            
            submitFormData(formData, mobileSiteVisitForm);
        });
    }
    
    // Handle WhatsApp buttons - direct WhatsApp redirect (not popup)
    const whatsAppButtons = document.querySelectorAll('.fab.fa-whatsapp');
    whatsAppButtons.forEach(button => {
        const parentElement = button.closest('.whatsapp-btn');
        if (parentElement) {
            // Remove the whatsapp-btn class to prevent popup
            parentElement.classList.remove('whatsapp-btn');
            
            // Add direct WhatsApp functionality
            parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                const message = "Hi, I'm interested in Prestige Raintree Park. Share me the details.";
                const encodedMessage = encodeURIComponent(message);
                const whatsAppURL = `https://api.whatsapp.com/send?phone=9632870766&text=${encodedMessage}`;
                window.open(whatsAppURL, '_blank');
            });
        }
    });
});
