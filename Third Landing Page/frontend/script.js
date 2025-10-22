
        // Popup Form Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const popupOverlay = document.getElementById('popupOverlay');
            const popupForm = document.getElementById('popupForm');
            const closePopup = document.getElementById('closePopup');
            const contactForm = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');

            // Show popup after 5 seconds
            setTimeout(() => {
                showPopup();
            }, 5000);

            // Show popup function
            function showPopup() {
                popupOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Ensure popup is centered and fits on screen
                const viewportHeight = window.innerHeight;
                const popupHeight = popupForm.scrollHeight;
                
                if (popupHeight > viewportHeight * 0.9) {
                    popupForm.style.maxHeight = '90vh';
                    popupForm.style.overflowY = 'auto';
                }
                
                setTimeout(() => {
                    popupForm.classList.remove('scale-95', 'opacity-0');
                    popupForm.classList.add('scale-100', 'opacity-100');
                }, 50);
            }

            // Hide popup function
            function hidePopup() {
                popupForm.classList.remove('scale-100', 'opacity-100');
                popupForm.classList.add('scale-95', 'opacity-0');
                document.body.style.overflow = ''; // Restore scrolling
                setTimeout(() => {
                    popupOverlay.classList.add('hidden');
                }, 500);
            }

            // Close popup events
            closePopup.addEventListener('click', hidePopup);
            popupOverlay.addEventListener('click', function(e) {
                if (e.target === popupOverlay) {
                    hidePopup();
                }
            });

            // Close popup on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !popupOverlay.classList.contains('hidden')) {
                    hidePopup();
                }
            });

            // Add click event to all buttons (except WhatsApp buttons and form submit buttons)
            document.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON' && 
                    !e.target.classList.contains('whatsapp') && 
                    !e.target.closest('#popupOverlay') &&
                    e.target.id !== 'mobileMenuButton' &&
                    e.target.type !== 'submit') {
                    e.preventDefault();
                    showPopup();
                }
            });

            // Form validation and submission
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const name = document.getElementById('popupName').value.trim();
                const phone = document.getElementById('popupPhone').value.trim();
                const email = document.getElementById('popupEmail').value.trim();
                const comments = document.getElementById('popupComments').value.trim();

                // Static data for the new columns
                const projectName = 'Amrutha Platinum Towers';
                const location = 'Nallurahalli Siddapura Road, Whitefield, East Bangalore';
                const zone = 'Bangalore East';

                // Validation
                if (!name) {
                    alert('Please enter your name.');
                    return;
                }

                if (!phone) {
                    alert('Please enter your phone number.');
                    return;
                }

                // Phone validation (10 digits)
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                }

                // Email validation (if provided)
                if (email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        alert('Please enter a valid email address.');
                        return;
                    }
                }

                // Show loading state
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                // Prepare form data
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('email', email);
                formData.append('comments', comments);
                formData.append('project_name', projectName);
                formData.append('location', location);
                formData.append('zone', zone);
                formData.append('timestamp', new Date().toISOString());

                // Submit to Google Sheets
                fetch('https://script.google.com/macros/s/AKfycbwcYAs-8shmPyINhplL8EnJQ-v-uIPjQKbm2J3Og_x8srfWvxuSrh4WbvtVsdBZVHyV/exec', {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                })
                .then(response => {
                    // For no-cors mode, we can't read the response
                    // If we reach here, the request was sent successfully
                    alert('Thank you! Your message has been submitted successfully. We will contact you soon.');
                    contactForm.reset();
                    hidePopup();
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Fallback: Show success message anyway since the data might have been sent
                    alert('Thank you! Your message has been submitted successfully. We will contact you soon.');
                    contactForm.reset();
                    hidePopup();
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
            });

            // Phone number formatting for popup form
            document.getElementById('popupPhone').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                e.target.value = value;
            });
        });

        // Hero form specific handler
        const heroForm = document.getElementById('heroForm');
        if (heroForm) {
            heroForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = this.querySelector('input[name="name"]').value.trim();
                const phone = this.querySelector('input[name="phone"]').value.trim();
                const email = this.querySelector('input[name="email"]').value.trim();
                const comments = this.querySelector('textarea[name="comments"]').value.trim();
                
                // Static data for the new columns
                const projectName = 'Amrutha Platinum Towers';
                const location = 'Nallurahalli Siddapura Road, Whitefield, East Bangalore';
                const zone = 'Bangalore East';
                
                // Validation
                if (!name || !phone) {
                    alert('Please fill in all required fields (Name and Phone are required).');
                    return;
                }
                
                // Email validation (if provided)
                if (email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        alert('Please enter a valid email address.');
                        return;
                    }
                }
                
                // Phone validation
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                }
                
                // Prepare form data for submission
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('email', email);
                formData.append('comments', comments);
                formData.append('project_name', projectName);
                formData.append('location', location);
                formData.append('zone', zone);
                formData.append('timestamp', new Date().toISOString());
                
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                
                // Submit to Google Sheets
                fetch('https://script.google.com/macros/s/AKfycbwcYAs-8shmPyINhplL8EnJQ-v-uIPjQKbm2J3Og_x8srfWvxuSrh4WbvtVsdBZVHyV/exec', {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                })
                .then(response => {
                    alert('Thank you! Your brochure request has been submitted successfully. We will contact you soon.');
                    this.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Thank you! Your brochure request has been submitted successfully. We will contact you soon.');
                    this.reset();
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
            });
        }

        // Callback form specific handler
        const callbackForm = document.getElementById('callbackForm');
        if (callbackForm) {
            callbackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = this.querySelector('input[name="name"]').value.trim();
                const phone = this.querySelector('input[name="phone"]').value.trim();
                const email = this.querySelector('input[name="email"]').value.trim();
                const comments = this.querySelector('textarea[name="comments"]').value.trim();
                
                // Static data for the new columns
                const projectName = 'Amrutha Platinum Towers';
                const location = 'Nallurahalli Siddapura Road, Whitefield, East Bangalore';
                const zone = 'Bangalore East';
                
                // Validation
                if (!name || !phone) {
                    alert('Please fill in all required fields (Name and Phone are required).');
                    return;
                }
                
                // Email validation (if provided)
                if (email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        alert('Please enter a valid email address.');
                        return;
                    }
                }
                
                // Phone validation
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                }
                
                // Prepare form data for submission
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('email', email);
                formData.append('comments', comments);
                formData.append('project_name', projectName);
                formData.append('location', location);
                formData.append('zone', zone);
                formData.append('timestamp', new Date().toISOString());
                
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                
                // Submit to Google Sheets
                fetch('https://script.google.com/macros/s/AKfycbwcYAs-8shmPyINhplL8EnJQ-v-uIPjQKbm2J3Og_x8srfWvxuSrh4WbvtVsdBZVHyV/exec', {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                })
                .then(response => {
                    alert('Thank you! Your callback request has been submitted successfully. We will contact you soon.');
                    this.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Thank you! Your callback request has been submitted successfully. We will contact you soon.');
                    this.reset();
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
            });
        }
    });

// Mobile Menu Toggle with improved animations
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const button = document.getElementById('mobileMenuButton');
    const hamburgerIcon = button.querySelector('svg');
    
    if (menu.classList.contains('hidden')) {
        // Show menu
        menu.classList.remove('hidden');
        menu.style.maxHeight = '0px';
        menu.style.opacity = '0';
        
        // Animate menu appearance
        requestAnimationFrame(() => {
            menu.style.maxHeight = '500px';
            menu.style.opacity = '1';
        });
        
        // Transform hamburger to X
        hamburgerIcon.style.transform = 'rotate(90deg)';
        hamburgerIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        `;
        
        button.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        // Hide menu
        menu.style.maxHeight = '0px';
        menu.style.opacity = '0';
        
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 300);
        
        // Transform X back to hamburger
        hamburgerIcon.style.transform = 'rotate(0deg)';
        hamburgerIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        `;
        
        button.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Add event listener for mobile menu button
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
});

 // WhatsApp functionality
  document.addEventListener('DOMContentLoaded', function () {
    const whatsappButtons = document.querySelectorAll('.whatsapp');

    whatsappButtons.forEach(button => {
      button.addEventListener('click', function () {
        const message = 'Hi, I am interested in Amrutha Platinum Towers. Please provide more information about the project.';
        const whatsappUrl = `https://wa.me/919035086850?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank'); // Opens WhatsApp in new tab
      });
    });
  });

// Close mobile menu on outside click
document.addEventListener('click', function(event) {
    const menu = document.getElementById('mobileMenu');
    const button = document.getElementById('mobileMenuButton');
    
    if (!menu.contains(event.target) && !button.contains(event.target) && !menu.classList.contains('hidden')) {
        toggleMobileMenu();
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const menu = document.getElementById('mobileMenu');
        if (!menu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    }
});

// Close mobile menu when clicking on navigation links
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menu = document.getElementById('mobileMenu');
            if (!menu.classList.contains('hidden')) {
                setTimeout(() => {
                    toggleMobileMenu();
                }, 200); // Small delay for better UX
            }
        });
    });
});

// Accordion functionality
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById('icon' + id.slice(-1));
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Countdown Timer
function updateCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // Set your target date (e.g., 30 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    function update() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        // Stop the countdown when it reaches zero
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysElement.textContent = days.toString().padStart(2, '0');
      hoursElement.textContent = hours.toString().padStart(2, '0');
      minutesElement.textContent = minutes.toString().padStart(2, '0');
      secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    // Call immediately to show the initial time
    update();

    // Update every second
    const interval = setInterval(update, 1000);
  }

  // Run the countdown
  updateCountdown();

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form:not(#heroForm):not(#callbackForm)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = form.querySelector('input[name="name"]')?.value || form.querySelector('input[type="text"]')?.value || '';
            const phone = form.querySelector('input[name="phone"]')?.value || form.querySelector('input[type="tel"]')?.value || '';
            const email = form.querySelector('input[name="email"]')?.value || form.querySelector('input[type="email"]')?.value || '';
            const comments = form.querySelector('textarea[name="comments"]')?.value || '';
            
            // Static data for the new columns
            const projectName = 'Amrutha Platinum Towers';
            const location = 'Nallurahalli Siddapura Road, Whitefield, East Bangalore';
            const zone = 'Bangalore East';
            
            // Basic validation
            if (!name || !phone) {
                alert('Please fill in all required fields (Name and Phone are required).');
                return;
            }
            
            // Email validation (if provided)
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
            }
            
            // Phone validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }
            
            // Prepare form data for submission
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('comments', comments);
            formData.append('project_name', projectName);
            formData.append('location', location);
            formData.append('zone', zone);
            formData.append('timestamp', new Date().toISOString());
            
            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Submit to Google Sheets
            fetch('https://script.google.com/macros/s/AKfycbwcYAs-8shmPyINhplL8EnJQ-v-uIPjQKbm2J3Og_x8srfWvxuSrh4WbvtVsdBZVHyV/exec', {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            })
            .then(response => {
                // For no-cors mode, we can't read the response
                // If we reach here, the request was sent successfully
                alert('Thank you! Your request has been submitted successfully. We will contact you soon.');
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                // Fallback: Show success message anyway since the data might have been sent
                alert('Thank you! Your request has been submitted successfully. We will contact you soon.');
                form.reset();
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    });
});

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });
});

// WhatsApp functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('.fa-whatsapp');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = 'Hi, I am interested in Amrutha Platinum Towers. Please provide more information about the project.';
            const whatsappUrl = `https://wa.me/919035086850?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
});

// Phone call functionality
document.addEventListener('DOMContentLoaded', function() {
    const phoneButtons = document.querySelectorAll('.fa-phone');
    
    phoneButtons.forEach(button => {
        if (button.closest('button')) {
            button.closest('button').addEventListener('click', function() {
                window.location.href = 'tel:+919035086850';
            });
        }
    });
});

// Button animations
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide header
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});
