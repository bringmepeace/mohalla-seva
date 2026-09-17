/**
 * MOHALLA SEVA - SUPER ADMIN DASHBOARD CONTROLLER
 * Slidebar tabs: Dashboard, Report Management, Volunteers, Donations.
 * Features live countdown timer (dd:hh:mm:ss), non-repeating feeds,
 * budgeting forms, and transparent modal backdrops.
 */

class MohallaAdminController {
  constructor() {
    this.currentFeed = 'feedcontainer';
    this.map = null;
    this.issues = [];
    this.volunteers = [];
    this.donations = [];
    this.countdownInterval = null;
  }

  async init() {
    this.setupSlidebar();
    this.initAdminMap();
    await this.loadAdminData();
    this.setupModals();
    this.startLiveCountdown();
    this.renderReports();
    this.renderVolunteers();
    this.renderDonations();
  }

  setupSlidebar() {
    const tabs = document.querySelectorAll('.slidebar > div[class]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('slidebaroption'));
        tab.classList.add('slidebaroption');

        // Hide all feeds
        document.querySelectorAll('.mainshow').forEach(f => f.classList.add('hidden'));

        // Show target feed
        const feedClass = tab.dataset.feed;
        const target = document.querySelector(`.${feedClass}`);
        if (target) target.classList.remove('hidden');

        if (feedClass === 'feedcontainer' && this.map) {
          setTimeout(() => this.map.invalidateSize(), 200);
        }
      });
    });
  }

  initAdminMap() {
    const mapEl = document.getElementById('admin-live-map');
    if (!mapEl) return;

    this.map = L.map('admin-live-map').setView([23.3441, 85.3096], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add ward markers
    const samplePoints = [
      { coords: [23.3455, 85.3110], title: 'Sector 4 Garbage Dump', status: 'PENDING', color: '#dc2626' },
      { coords: [23.3420, 85.3080], title: 'School Road Pothole', status: 'ASSIGNED', color: '#153D74' },
      { coords: [23.3460, 85.3090], title: 'Overbridge Street Lights', status: 'RESOLVED', color: '#2E6A63' },
      { coords: [23.3719, 85.3084], title: 'Upper Bazar Drainage', status: 'PENDING', color: '#dc2626' }
    ];

    samplePoints.forEach(p => {
      const pin = L.divIcon({
        html: `<div style="background:${p.color}; width:24px; height:24px; border-radius:50%; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">●</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker(p.coords, { icon: pin }).bindPopup(`<strong>${p.title}</strong><br>Status: ${p.status}`).addTo(this.map);
    });
  }

  async loadAdminData() {
    this.issues = [
      {
        id: 'iss_1',
        title: 'Overflowing Garbage Container at Sector 4 Market',
        category: 'Sanitation',
        ward: 12,
        address: 'Opposite Daily Market, Ward 12, Ranchi',
        reportedBy: 'Priyanshi Sharma',
        description: 'Municipal dumpster overflowing for 4 days creating severe foul smell in market.',
        status: 'ASSIGNED',
        assignedNGO: 'Clean Delhi & Ranchi Foundation',
        deadline: new Date(Date.now() + 3600000 * 36).toISOString(),
        image: 'assets/streetview.jpg',
        materials: [
          { item: 'Heavy Gloves (10 Pairs)', cost: 2500 },
          { item: 'Industrial Waste Sacks (50)', cost: 1500 }
        ],
        rewards: 1000,
        donors: [
          { name: 'Rohan Verma', amount: 1500, time: '10m ago' },
          { name: 'Amit Gupta', amount: 2000, time: '2h ago' }
        ]
      },
      {
        id: 'iss_2',
        title: 'Hazardous Open Crater Pothole on School Road',
        category: 'Infrastructure',
        ward: 12,
        address: 'Near Girls High School, Ward 12, Ranchi',
        reportedBy: 'Thakur Pratap',
        description: '2-foot deep crater dangerous for school buses and cyclists.',
        status: 'ASSIGNED',
        assignedNGO: 'Clean Delhi & Ranchi Foundation',
        deadline: new Date(Date.now() + 3600000 * 18).toISOString(),
        image: 'assets/bothactive.png',
        materials: [
          { item: 'Cold Asphalt Mix (5 Bags)', cost: 4500 },
          { item: 'Gravel & Tar Emulsion', cost: 3000 }
        ],
        rewards: 1500,
        donors: [
          { name: 'Sanjay Jha', amount: 3000, time: '1h ago' }
        ]
      },
      {
        id: 'iss_3',
        title: 'Defective Pedestrian Pathway Street Lights',
        category: 'Safety',
        ward: 12,
        address: 'Overbridge Walkway, Ward 12, Ranchi',
        reportedBy: 'Ananya Iyer',
        description: 'Five sodium vapor lights burnt out.',
        status: 'RESOLVED',
        assignedNGO: 'Suraksha Citizens Forum',
        deadline: new Date(Date.now() - 3600000 * 12).toISOString(),
        image: 'assets/streetview.jpg',
        materials: [
          { item: 'LED Street Luminaires 60W (5)', cost: 8500 }
        ],
        rewards: 1200,
        donors: [
          { name: 'Dr. Sunita Rao', amount: 5000, time: '1d ago' }
        ]
      }
    ];

    this.volunteers = [
      { name: 'Rohan Verma', ward: 12, skills: ['Sanitation', 'Plumber'], xp: 380, contributions: 8, avatar: 'assets/boyinshirt.jpg' },
      { name: 'Thakur Pratap', ward: 12, skills: ['Electrician', 'Communication'], xp: 450, contributions: 12, avatar: 'assets/spiderman.jpg' },
      { name: 'Ananya Iyer', ward: 4, skills: ['Painter', 'Teaching'], xp: 290, contributions: 6, avatar: 'assets/defaultpic.jpg' },
      { name: 'Priya Patel', ward: 12, skills: ['Management', 'Sanitation'], xp: 850, contributions: 22, avatar: 'assets/andrew.jpg' }
    ];

    this.donations = [
      { id: 'DON-901', donor: 'Rohan Verma', ward: 12, campaign: 'Rajkriti School Study Kits', amount: 1500, mode: 'UPI', date: '2 mins ago' },
      { id: 'DON-902', donor: 'Amit Gupta', ward: 12, campaign: 'Sector 4 Garbage Dump Cleanup', amount: 2000, mode: 'NetBanking', date: '1 hour ago' },
      { id: 'DON-903', donor: 'Sanjay Jha', ward: 4, campaign: 'School Road Pothole Tarmac', amount: 3000, mode: 'UPI QR', date: '3 hours ago' },
      { id: 'DON-904', donor: 'Dr. Sunita Rao', ward: 7, campaign: 'Solar LED Lighting Installation', amount: 5000, mode: 'Card', date: '1 day ago' }
    ];
  }

  setupModals() {
    const backdrop = document.getElementById('admin-blackshade');
    const modal = document.getElementById('admin-issue-modal');
    const closeBtn = document.getElementById('btn-close-admin-modal');

    const closeModal = () => {
      if (backdrop) backdrop.classList.remove('active');
      if (modal) modal.classList.remove('active');
    };

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
  }

  startLiveCountdown() {
    this.countdownInterval = setInterval(() => {
      document.querySelectorAll('[data-deadline]').forEach(el => {
        const deadlineStr = el.dataset.deadline;
        const diff = new Date(deadlineStr).getTime() - Date.now();

        if (diff <= 0) {
          el.innerHTML = `<span style="color:#dc2626;">EXPIRED / OVERDUE</span>`;
        } else {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diff / (1000 * 60)) % 60);
          const s = Math.floor((diff / 1000) % 60);

          el.innerHTML = `<span>⏱ ${d}d ${h}h ${m}m ${s}s remaining</span>`;
        }
      });
    }, 1000);
  }

  renderReports() {
    const container = document.getElementById('admin-reports-grid');
    if (!container) return;

    container.innerHTML = this.issues.map(issue => `
      <div class="admin-report-card" onclick="window.adminController.openIssueModal('${issue.id}')">
        <div>
          <div class="report-meta-row">
            <span>Ward ${issue.ward} • ${issue.category}</span>
            <span style="color:${issue.status === 'RESOLVED' ? '#16a34a' : '#2563eb'};">${issue.status}</span>
          </div>
          <h4 class="report-card-title">${issue.title}</h4>
          <p style="font-size:0.85rem; color:#64748b; margin:4px 0 10px 0;">${issue.address}</p>
          <div class="live-countdown-badge" data-deadline="${issue.deadline}">
            <span>⏱ Calculating...</span>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:#94a3b8; border-top:1px solid #f8fafc; padding-top:8px;">
          <span>NGO: ${issue.assignedNGO}</span>
          <span style="color:#2563eb; font-weight:700;">Inspect Dossier →</span>
        </div>
      </div>
    `).join('');
  }

  openIssueModal(id) {
    const issue = this.issues.find(i => i.id === id);
    if (!issue) return;

    const backdrop = document.getElementById('admin-blackshade');
    const modal = document.getElementById('admin-issue-modal');
    const body = document.getElementById('admin-modal-body');

    const totalMaterials = issue.materials.reduce((sum, m) => sum + m.cost, 0);
    const totalRequired = totalMaterials + issue.rewards;

    body.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
        <div>
          <h4 style="margin:0 0 6px 0; font-size:1.15rem; color:#0f172a;">${issue.title}</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:12px;">Reported by ${issue.reportedBy} • ${issue.address}</p>
          <img src="${issue.image}" style="width:100%; height:200px; object-fit:cover; border-radius:10px; margin-bottom:12px;">
          <p style="font-size:0.9rem; color:#334155;">${issue.description}</p>
        </div>

        <div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-bottom:12px;">
            <h5 style="margin:0 0 8px 0; font-size:0.88rem; text-transform:uppercase; color:#64748b;">Itemized Project Budget</h5>
            ${issue.materials.map(m => `
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                <span>${m.item}</span>
                <strong>₹${m.cost.toLocaleString()}</strong>
              </div>
            `).join('')}
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px; color:#16a34a;">
              <span>Volunteer Honorarium Reward</span>
              <strong>₹${issue.rewards.toLocaleString()}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight:800; border-top:1px solid #cbd5e1; padding-top:6px; margin-top:6px;">
              <span>Total Project Budget</span>
              <span style="color:#006324;">₹${totalRequired.toLocaleString()}</span>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
            <h5 style="margin:0 0 8px 0; font-size:0.88rem; text-transform:uppercase; color:#64748b;">Citizen Donors (${issue.donors.length})</h5>
            ${issue.donors.map(d => `
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                <span>${d.name} (${d.time})</span>
                <strong style="color:#006324;">₹${d.amount.toLocaleString()}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
    modal.classList.add('active');
  }

  renderVolunteers() {
    const tbody = document.getElementById('volunteers-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.volunteers.map(v => `
      <tr>
        <td>
          <div class="volunteer-user-cell">
            <img src="${v.avatar}" alt="${v.name}" onerror="this.src='assets/defaultpic.jpg'">
            <span>${v.name}</span>
          </div>
        </td>
        <td>Ward ${v.ward}</td>
        <td>
          ${v.skills.map(s => `<span class="skill-tag-badge">${s}</span>`).join('')}
        </td>
        <td><strong style="color:#16a34a;">${v.xp} XP</strong></td>
        <td>${v.contributions} Missions</td>
        <td>
          <button style="padding:6px 12px; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; border-radius:6px; font-weight:700; cursor:pointer;" onclick="alert('Assigned mission alert dispatched to ${v.name}!')">
            Deploy Task
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderDonations() {
    const tbody = document.getElementById('donations-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.donations.map(d => `
      <tr>
        <td><strong>${d.id}</strong></td>
        <td>${d.donor}</td>
        <td>Ward ${d.ward}</td>
        <td>${d.campaign}</td>
        <td><strong style="color:#006324;">₹${d.amount.toLocaleString()}</strong></td>
        <td>${d.mode}</td>
        <td>${d.date}</td>
        <td><span style="background:#dcfce7; color:#15803d; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:10px;">SUCCESS</span></td>
      </tr>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.adminController = new MohallaAdminController();
  window.adminController.init();
});
