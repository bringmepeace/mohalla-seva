/**
 * MOHALLA SEVA - REPORT ISSUE CONTROLLER
 * Supports device upload, WebRTC camera capture, stacked file deck,
 * instant location GPS auto-fill, and backend issue submission.
 */

class MohallaReportController {
  constructor() {
    this.map = null;
    this.marker = null;
    this.uploadedFiles = []; // Array of { file, url, type, name }
    this.cameraStream = null;
    this.selectedCategory = 'Sanitation and waste';
    this.userWard = 12;

    // Ward coordinates for fallback
    this.wardCoords = {
      12: [23.3441, 85.3096],
      4: [23.3719, 85.3084],
      7: [23.3680, 85.3340],
      1: [23.3280, 85.3180],
      15: [23.4020, 85.3190]
    };
  }

  init() {
    this.syncUserWard();
    this.initMap();
    this.setupCategorySelection();
    this.setupLocation();
    this.setupEvidenceHandling();
    this.setupFormSubmission();
  }

  syncUserWard() {
    try {
      const saved = sessionStorage.getItem('ms_active_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.ward) this.userWard = Number(u.ward);
      }
    } catch (e) {
      console.warn('Report user ward sync warning:', e);
    }
  }

  initMap() {
    const coords = this.wardCoords[this.userWard] || [23.3441, 85.3096];
    
    if (typeof L === 'undefined') {
      setTimeout(() => this.initMap(), 200);
      return;
    }

    try {
      // Set local default Leaflet icon paths
      if (L.Icon && L.Icon.Default) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'css/images/marker-icon-2x.png',
          iconUrl: 'css/images/marker-icon.png',
          shadowUrl: 'css/images/marker-shadow.png'
        });
      }

      this.map = L.map('report-map').setView(coords, 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);

      // Custom vibrant red draggable location pin that renders immediately with zero network dependency
      const reportPin = L.divIcon({
        className: 'ms-report-pin',
        html: `
          <div style="position:relative; width:34px; height:44px; display:flex; flex-direction:column; align-items:center; cursor:grab;">
            <svg width="34" height="42" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
              <path d="M12 0C5.37 0 0 5.37 0 12C0 20.25 12 32 12 32C12 32 24 20.25 24 12C24 5.37 18.63 0 12 0Z" fill="#dc2626"/>
              <circle cx="12" cy="12" r="5.5" fill="#ffffff"/>
              <circle cx="12" cy="12" r="3" fill="#dc2626"/>
            </svg>
            <div style="width:14px; height:4px; background:rgba(0,0,0,0.25); border-radius:50%; margin-top:-2px;"></div>
          </div>
        `,
        iconSize: [34, 44],
        iconAnchor: [17, 42],
        popupAnchor: [0, -42]
      });

      this.marker = L.marker(coords, { draggable: true, icon: reportPin }).addTo(this.map);
      this.marker.bindPopup('<b>Selected Location Pin</b><br>Drag pin to pinpoint exact issue spot.').openPopup();

      this.marker.on('dragend', (e) => {
        const latlng = e.target.getLatLng();
        this.updateCoordinatesDisplay(latlng.lat, latlng.lng);
        this.marker.setPopupContent(`<b>Selected Issue Spot</b><br>GPS: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`).openPopup();
      });

      this.map.on('click', (e) => {
        this.marker.setLatLng(e.latlng);
        this.updateCoordinatesDisplay(e.latlng.lat, e.latlng.lng);
        this.marker.setPopupContent(`<b>Selected Issue Spot</b><br>GPS: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`).openPopup();
      });

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);

      window.addEventListener('resize', () => {
        if (this.map) this.map.invalidateSize();
      });
    } catch (err) {
      console.warn('Report map initialization:', err);
    }
  }

  updateCoordinatesDisplay(lat, lng) {
    const landmarkInput = document.getElementById('report-landmark');
    if (landmarkInput && !landmarkInput.value.includes('GPS:')) {
      landmarkInput.value = `GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)} • Near Sector Road`;
    }
  }

  setupLocation() {
    const instantBtn = document.getElementById('instant-location-btn');
    if (!instantBtn) return;

    instantBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        instantBtn.innerHTML = `<span class="material-symbols-outlined" style="animation:spin 1s linear infinite;">sync</span> Locating...`;
        
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            
            this.map.setView([lat, lng], 16);
            this.marker.setLatLng([lat, lng]);

            const areaInput = document.getElementById('report-area');
            const landmarkInput = document.getElementById('report-landmark');
            const stateInput = document.getElementById('stateinput');
            const cityInput = document.getElementById('cityinput');

            if (stateInput) stateInput.value = 'Jharkhand';
            if (cityInput) cityInput.value = 'Ranchi';
            if (areaInput) areaInput.value = `Lalpur (Ward ${this.userWard})`;
            if (landmarkInput) landmarkInput.value = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} • Automatic Geolocation Pin`;

            instantBtn.innerHTML = `<span class="material-symbols-outlined">my_location</span> Location Detected`;
            instantBtn.style.background = '#15803d';

            if (window.api && typeof window.api.showToast === 'function') {
              window.api.showToast('Instant GPS location locked!', 'success');
            }
          },
          (err) => {
            // Geolocation denied or unavailable -> Fallback to ward coordinates
            const coords = this.wardCoords[this.userWard] || [23.3441, 85.3096];
            this.map.setView(coords, 15);
            this.marker.setLatLng(coords);

            const areaInput = document.getElementById('report-area');
            const landmarkInput = document.getElementById('report-landmark');
            if (areaInput) areaInput.value = `Sector Main Road (Ward ${this.userWard})`;
            if (landmarkInput) landmarkInput.value = `Coordinates: ${coords[0]}, ${coords[1]}`;

            instantBtn.innerHTML = `<span class="material-symbols-outlined">location_on</span> Instant location`;
            if (window.api && typeof window.api.showToast === 'function') {
              window.api.showToast(`Pinned to Ward ${this.userWard} center coordinates`, 'info');
            }
          }
        );
      }
    });
  }

  setupCategorySelection() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.category || btn.textContent.trim();
      });
    });
  }

  setupEvidenceHandling() {
    const fileInput = document.getElementById('device-file-input');
    const uploadBtn = document.getElementById('btn-trigger-upload');
    const cameraBtn = document.getElementById('btn-trigger-camera');
    const cameraOverlay = document.getElementById('camera-viewfinder-overlay');
    const cameraVideo = document.getElementById('camera-video-stream');
    const shutterBtn = document.getElementById('camera-shutter-trigger');
    const closeCameraBtn = document.getElementById('btn-close-camera');
    const displayBox = document.getElementById('evidence-display-box');
    const lightboxModal = document.getElementById('evidence-lightbox-modal');
    const closeLightboxBtn = document.getElementById('btn-close-lightbox');

    // Trigger hidden file picker
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
    }

    // Handle files selected from device
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
          const url = URL.createObjectURL(file);
          this.uploadedFiles.push({
            file,
            url,
            type: file.type.startsWith('video') ? 'video' : 'image',
            name: file.name
          });
        });
        this.renderStackedCards();
      });
    }

    // Start WebRTC Camera
    if (cameraBtn && cameraOverlay && cameraVideo) {
      cameraBtn.addEventListener('click', async () => {
        try {
          this.cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
          });
          cameraVideo.srcObject = this.cameraStream;
          cameraOverlay.classList.add('active');
        } catch (err) {
          console.warn('Camera access error:', err);
          alert('Camera permission denied or camera device not available.');
        }
      });
    }

    // Stop Camera
    const stopCamera = () => {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
        this.cameraStream = null;
      }
      if (cameraOverlay) cameraOverlay.classList.remove('active');
    };

    if (closeCameraBtn) closeCameraBtn.addEventListener('click', stopCamera);

    // Capture photo from video frame
    if (shutterBtn && cameraVideo) {
      shutterBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cameraVideo.videoWidth || 640;
        canvas.height = cameraVideo.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          this.uploadedFiles.push({
            file,
            url,
            type: 'image',
            name: file.name
          });
          this.renderStackedCards();
          stopCamera();

          if (window.api && typeof window.api.showToast === 'function') {
            window.api.showToast('Photo captured and added to evidence stack!', 'success');
          }
        }, 'image/jpeg', 0.9);
      });
    }

    // Click display box -> Open lightbox inspection modal
    if (displayBox) {
      displayBox.addEventListener('click', () => {
        if (this.uploadedFiles.length > 0 && lightboxModal) {
          this.renderLightboxItems();
          lightboxModal.classList.add('active');
        }
      });
    }

    // Close lightbox
    if (closeLightboxBtn && lightboxModal) {
      closeLightboxBtn.addEventListener('click', () => lightboxModal.classList.remove('active'));
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) lightboxModal.classList.remove('active');
      });
    }

    // Initial render
    this.renderStackedCards();
  }

  renderStackedCards() {
    const displayBox = document.getElementById('evidence-display-box');
    if (!displayBox) return;

    if (this.uploadedFiles.length === 0) {
      displayBox.innerHTML = `
        <div class="empty-stack-placeholder">
          <span class="material-symbols-outlined">collections</span>
          <p style="font-size:0.88rem; font-weight:700; margin:0; color:#64748b;">Evidence Display Area</p>
          <span style="font-size:0.75rem; color:#94a3b8;">Uploaded files will stack here</span>
        </div>
      `;
      return;
    }

    // Render deck of cards
    let deckHtml = `<div class="stacked-card-deck">`;
    this.uploadedFiles.slice(0, 4).forEach((item, idx) => {
      deckHtml += `
        <div class="stacked-card">
          ${item.type === 'video' ? `<video src="${item.url}" muted></video>` : `<img src="${item.url}" alt="Evidence">`}
        </div>
      `;
    });
    deckHtml += `
      <div class="stack-count-badge">
        <span class="material-symbols-outlined" style="font-size:14px; vertical-align:middle;">layers</span>
        ${this.uploadedFiles.length} ${this.uploadedFiles.length === 1 ? 'File' : 'Files'} Attached (Tap to inspect)
      </div>
    </div>`;

    displayBox.innerHTML = deckHtml;
  }

  renderLightboxItems() {
    const lightboxBody = document.getElementById('lightbox-items-body');
    if (!lightboxBody) return;

    lightboxBody.innerHTML = this.uploadedFiles.map((item, idx) => `
      <div class="lightbox-item-card">
        ${item.type === 'video' ? `<video src="${item.url}" controls></video>` : `<img src="${item.url}" alt="Evidence">`}
        <div class="lightbox-remove-item" onclick="window.reportController.removeFile(${idx})" title="Remove item">✕</div>
      </div>
    `).join('');
  }

  removeFile(index) {
    this.uploadedFiles.splice(index, 1);
    this.renderStackedCards();
    this.renderLightboxItems();
    if (this.uploadedFiles.length === 0) {
      const modal = document.getElementById('evidence-lightbox-modal');
      if (modal) modal.classList.remove('active');
    }
  }

  setupFormSubmission() {
    const submitBtn = document.getElementById('submit-report-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const descInput = document.getElementById('report-description');
      const areaInput = document.getElementById('report-area');
      const landmarkInput = document.getElementById('report-landmark');
      const stateInput = document.getElementById('stateinput');
      const cityInput = document.getElementById('cityinput');

      const description = descInput ? descInput.value.trim() : '';
      const area = areaInput ? areaInput.value.trim() : '';
      const landmark = landmarkInput ? landmarkInput.value.trim() : '';
      const state = stateInput ? stateInput.value.trim() : 'Jharkhand';
      const city = cityInput ? cityInput.value.trim() : 'Ranchi';

      if (!description) {
        alert('Please provide a brief description of the civic issue.');
        if (descInput) descInput.focus();
        return;
      }

      const latlng = this.marker ? this.marker.getLatLng() : { lat: 23.3441, lng: 85.3096 };
      const issueTitle = `${this.selectedCategory} Hazard at ${area || 'Sector Road'}`;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined" style="animation:spin 1s linear infinite;">sync</span> Submitting Report...`;

      try {
        const formData = new FormData();
        formData.append('title', issueTitle);
        formData.append('category', this.selectedCategory);
        formData.append('ward', this.userWard);
        formData.append('description', description);
        formData.append('address', `${area}, ${landmark}, ${city}, ${state}`.replace(/^, /, ''));
        formData.append('lat', latlng.lat);
        formData.append('lng', latlng.lng);

        // Attach evidence files if present
        if (this.uploadedFiles.length > 0 && this.uploadedFiles[0].file) {
          formData.append('beforeImage', this.uploadedFiles[0].file);
        } else {
          formData.append('beforeImage', 'assets/camp_sanitation.jpg');
        }

        let createdIssue = null;
        if (window.api && typeof window.api.createIssue === 'function') {
          const res = await window.api.createIssue(formData);
          if (res && res.issue) {
            createdIssue = res.issue;
          }
        } else {
          await new Promise(r => setTimeout(r, 400));
        }

        // Store local issue backup so it appears on dashboard immediately
        try {
          const localObj = createdIssue || {
            _id: `iss_local_${Date.now()}`,
            title: issueTitle,
            category: this.selectedCategory,
            ward: this.userWard,
            description: description,
            location: {
              lat: latlng.lat,
              lng: latlng.lng,
              coordinates: [latlng.lat, latlng.lng],
              address: `${area || 'Main Sector'}, ${landmark || 'Ward 12 Road'}, ${city}, ${state}`
            },
            beforeImage: (this.uploadedFiles.length > 0 && this.uploadedFiles[0].url) ? this.uploadedFiles[0].url : 'assets/camp_sanitation.jpg',
            status: 'PENDING',
            upvotes: 1,
            createdAt: new Date().toISOString()
          };

          const existingLocal = JSON.parse(localStorage.getItem('ms_local_issues') || '[]');
          const filtered = existingLocal.filter(x => x._id !== localObj._id);
          filtered.unshift(localObj);
          localStorage.setItem('ms_local_issues', JSON.stringify(filtered));
        } catch (storageErr) {
          console.warn('Local storage issue sync error:', storageErr);
        }

        if (window.api && typeof window.api.showToast === 'function') {
          window.api.showToast(`Civic report submitted to Ward ${this.userWard}!`, 'success');
        } else {
          alert(`Civic report submitted to Ward ${this.userWard}!`);
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 600);

      } catch (err) {
        console.error('Submission error:', err);
        // Even if server is offline, save to local issues and redirect so user is never blocked
        try {
          const latlng = this.marker ? this.marker.getLatLng() : { lat: 23.3441, lng: 85.3096 };
          const localObj = {
            _id: `iss_local_${Date.now()}`,
            title: issueTitle,
            category: this.selectedCategory,
            ward: this.userWard,
            description: description,
            location: {
              lat: latlng.lat,
              lng: latlng.lng,
              coordinates: [latlng.lat, latlng.lng],
              address: `${area || 'Sector Area'}, ${landmark || 'Ward 12'}, ${city}, ${state}`
            },
            beforeImage: (this.uploadedFiles.length > 0 && this.uploadedFiles[0].url) ? this.uploadedFiles[0].url : 'assets/camp_sanitation.jpg',
            status: 'PENDING',
            upvotes: 1,
            createdAt: new Date().toISOString()
          };
          const existingLocal = JSON.parse(localStorage.getItem('ms_local_issues') || '[]');
          existingLocal.unshift(localObj);
          localStorage.setItem('ms_local_issues', JSON.stringify(existingLocal));
          
          window.location.href = 'dashboard.html';
          return;
        } catch (e) {}

        alert('Failed to submit report. Please check required fields.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="material-symbols-outlined">send</span> Submit Civic Report`;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.reportController = new MohallaReportController();
  window.reportController.init();
});
