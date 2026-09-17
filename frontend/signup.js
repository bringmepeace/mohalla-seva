/**
 * MOHALLA SEVA - SIGNUP & ONBOARDING CONTROLLER
 * Professional role toggle between Citizen and Super Admin,
 * seamless demo accounts, and complete onboarding data persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  const userToggle = document.getElementById('userselected');
  const adminToggle = document.getElementById('adminselected');
  const emailInput = document.getElementById('emailinput');
  const passInput = document.getElementById('passinput');
  const signinForm = document.getElementById('signinform');
  const formContent = document.getElementById('formcontent');
  const onboardingForm = document.getElementById('onboarding');
  const createAccBtn = document.getElementById('createacc');
  const skillsBoxes = document.querySelectorAll('.skillsbox');

  let activeRole = 'CITIZEN';

  // Toggle Role Selector
  if (userToggle && adminToggle) {
    userToggle.addEventListener('click', () => {
      activeRole = 'CITIZEN';
      userToggle.classList.add('controlstyle');
      adminToggle.classList.remove('controlstyle');
      if (emailInput) emailInput.value = 'thakur@gmail.com';
      if (passInput) passInput.value = 'pass123';
    });

    adminToggle.addEventListener('click', () => {
      activeRole = 'SUPER_ADMIN';
      adminToggle.classList.add('controlstyle');
      userToggle.classList.remove('controlstyle');
      if (emailInput) emailInput.value = 'admin@gmail.com';
      if (passInput) passInput.value = 'operator';
    });
  }

  // Skills selection
  skillsBoxes.forEach(skill => {
    skill.addEventListener('click', () => {
      skill.classList.toggle('skillsboxstyle');
    });
  });

  // Open Registration from Login
  if (createAccBtn) {
    createAccBtn.addEventListener('click', () => {
      signinForm.style.display = 'none';
      formContent.style.display = 'flex';
    });
  }

  // Handle Registration Submit -> Go to Onboarding
  if (formContent) {
    formContent.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('emailfill').value.trim();
      const pass = document.getElementById('passfill').value;
      const confirm = document.getElementById('confirmfill').value;

      if (pass !== confirm) {
        alert('Password and Confirm Password must match.');
        return;
      }

      localStorage.setItem('reg_email', email);
      localStorage.setItem('reg_pass', pass);

      formContent.style.display = 'none';
      onboardingForm.style.display = 'flex';
    });
  }

  // Handle Onboarding Profile Submit -> Go to Dashboard
  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fname = document.getElementById('fname').value.trim();
      const lname = document.getElementById('lname').value.trim();
      const age = document.getElementById('age').value;
      const profession = document.getElementById('profess').value.trim();
      const state = document.getElementById('statefill').value.trim();
      const city = document.getElementById('cityfill').value.trim();
      const ward = document.getElementById('wardfill').value;

      const user = {
        name: `${fname} ${lname}`,
        email: localStorage.getItem('reg_email') || 'newuser@gmail.com',
        role: 'CITIZEN',
        ward: Number(ward) || 12,
        city: city || 'Ranchi',
        state: state || 'Jharkhand',
        age: Number(age) || 21,
        profession: profession || 'Resident',
        avatar: 'assets/spiderman.jpg'
      };

      sessionStorage.setItem('ms_active_user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    });
  }

  // Handle Login Submit
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();
      const pass = passInput.value;

      // Admin Login Check
      if (
        (email === 'admin@gmail.com' && pass === 'operator') ||
        (email === 'joginder@gmail.com' && pass === 'admin123') ||
        (email === 'admin@mohallaseva.gov.in' && pass === 'admin123') ||
        activeRole === 'SUPER_ADMIN'
      ) {
        const adminUser = {
          name: 'Joginder Pathak',
          email: 'joginder@gmail.com',
          role: 'SUPER_ADMIN',
          ward: 12,
          city: 'Ranchi',
          state: 'Jharkhand',
          profession: 'Municipal Officer',
          age: 44,
          avatar: 'assets/admin.jpg'
        };
        sessionStorage.setItem('ms_active_user', JSON.stringify(adminUser));
        window.location.href = 'admin.html';
        return;
      }

      // Citizen Login Check
      const citizenUser = {
        name: 'Thakur Pratap',
        email: email || 'thakur@gmail.com',
        role: 'CITIZEN',
        ward: 12,
        city: 'Ranchi',
        state: 'Jharkhand',
        profession: 'Student',
        age: 21,
        avatar: 'assets/spiderman.jpg'
      };
      sessionStorage.setItem('ms_active_user', JSON.stringify(citizenUser));
      window.location.href = 'dashboard.html';
    });
  }
});
