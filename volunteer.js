/**
 * MOHALLA SEVA - VOLUNTEER & NGO CONTROLLER
 * Features:
 * 1. Initial stage: Right pane starts with a clean, executive empty prompt (no clutter).
 * 2. 12 Authentic Indian Accredited NGOs with real internet photos and realistic projects.
 * 3. Left sidebar directory: No mention of Ward on cards.
 * 4. "Apply to join" opens professional executive application form:
 *    - Personal Details (Full Name, Email, Age)
 *    - Service Role & Capabilities
 *    - Site Mobility Comfort
 *    - Schedule: Free Time Range (From Time to To Time) & Available Days (Monday to Sunday in proper order)
 * 5. Applied NGOs are listed under "My NGO" tab.
 */

class MohallaVolunteerController {
  constructor() {
    this.ngos = [];
    this.currentNGO = null;
    this.currentStage = 'empty'; // 'empty' | 'description' | 'form' | 'success'
    this.filterTab = 'all'; // 'all' | 'my'
    this.searchQuery = '';
    this.currentUser = null;
    this.joinedNgoIds = new Set();
    this.applications = {}; // map of ngoId -> application details
  }

  async init() {
    this.syncUser();
    await this.loadNGOs();
    this.setupEventListeners();
    this.renderNGOList();
    
    // Right side starts EMPTY in the initial stage
    this.currentNGO = null;
    this.currentStage = 'empty';
    this.renderMainStage();
  }

  syncUser() {
    try {
      const saved = sessionStorage.getItem('ms_active_user');
      if (saved) {
        this.currentUser = JSON.parse(saved);
      } else {
        this.currentUser = { 
          id: 'demo_thakur', 
          name: 'Thakur Pratap', 
          email: 'thakur@gmail.com', 
          ward: 12, 
          age: 21,
          role: 'CITIZEN' 
        };
      }

      // Load applied/joined NGOs from localStorage
      const savedJoined = localStorage.getItem('ms_joined_ngos');
      if (savedJoined) {
        const arr = JSON.parse(savedJoined);
        arr.forEach(id => this.joinedNgoIds.add(id));
      }

      const savedApps = localStorage.getItem('ms_volunteer_applications');
      if (savedApps) {
        this.applications = JSON.parse(savedApps);
      }
    } catch (e) {
      console.warn('Volunteer user sync error:', e);
    }
  }

  async loadNGOs() {
    // 12 Authentic, Accredited Indian Civic NGOs with Real Internet Imagery
    this.ngos = [
      {
        _id: 'ngo_1',
        name: 'Goonj',
        category: 'Civic Relief & Material Dignity',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1000&auto=format&fit=crop&q=80',
        memberCount: 142,
        projectsCount: 38,
        expansionRegion: 'Ward 4 (Upper Bazar) & Ward 15 (Kanke)',
        whatTheyDo: 'Goonj channels urban surplus materials as a development resource for rural and mohalla development. We operate Dignity for Work campaigns where community residents build local infrastructure, desilt drains, and construct pathways in exchange for comprehensive family dignity kits.',
        areasWorked: [
          'Sector 4 Market: Collected and sorted 2,400 kg of urban surplus clothes and distributed 350 family kits',
          'Ward 12 Slum Corridor: Rebuilt a 150m pedestrian walking culvert using community participatory labor',
          'Krishna Nagar: Set up a local cloth recycling center producing biodegradable menstrual pads and cotton mats',
          'Overbridge Slum Shelter: Supplied heavy winter blankets and dry ration kits during cold waves'
        ],
        expansionPlans: 'Establishing 2 permanent citizen collection centers in Upper Bazar and partnering with 15 housing societies in Ward 15 to collect reusable household textiles and books.'
      },
      {
        _id: 'ngo_2',
        name: 'Sulabh Sanitation Mission',
        category: 'Sanitation and waste',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1000&auto=format&fit=crop&q=80',
        memberCount: 118,
        projectsCount: 45,
        expansionRegion: 'Ward 1 (Doranda) & Ward 7 (Lalpur)',
        whatTheyDo: 'Sulabh Sanitation Mission pioneers public community sanitation, mechanized waste recycling, and bio-gas energy recovery. We clear persistent open garbage dumping spots, unclog municipal storm drains, and maintain hygienic public facilities across Ward 12.',
        areasWorked: [
          'Daily Market Complex: Renovated and maintaining 3 clean public sanitation blocks with continuous running water',
          'Sector 4 Market Corner: Cleared 18 persistent waste dumping spots and converted the lane into an organic garden',
          'Overbridge Drain Corridor: De-silted 600 meters of concrete stormwater drainage ahead of monsoon rains',
          'Ward 12 Commercial Belt: Deployed 40 dual-stream waste segregation bins for wet and dry segregation'
        ],
        expansionPlans: 'Deploying 2 high-power electric drain vacuum units to Lalpur and Doranda and setting up community bio-composters in 6 municipal wards.'
      },
      {
        _id: 'ngo_3',
        name: 'Pratham Education Foundation',
        category: 'Education & Child Literacy',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80',
        memberCount: 94,
        projectsCount: 32,
        expansionRegion: 'Ward 4 (Upper Bazar) & Slum Clusters',
        whatTheyDo: 'Pratham is committed to ensuring every child in the community learns well. We conduct community Read India remedial learning camps, run neighborhood mobile libraries, and train mothers in early childhood developmental activities.',
        areasWorked: [
          'Rajkriti Primary School: Conducted 45-day remedial Hindi and Math literacy camps for 140 elementary students',
          'Krishna Nagar Basti: Established 4 community study circles with volunteer mentors and reading material',
          'Sector 3 Community Library: Distributed 250 school kits containing notebooks, geometry boxes, and storybooks',
          'Ward 12 Anganwadis: Trained 35 mothers in foundational learning and playful numeracy'
        ],
        expansionPlans: 'Expanding after-school learning circles to 8 low-income settlements in Ward 4 and launching volunteer weekend reading clubs in public parks.'
      },
      {
        _id: 'ngo_4',
        name: 'Robin Hood Army',
        category: 'Food Rescue & Zero Hunger',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1000&auto=format&fit=crop&q=80',
        memberCount: 160,
        projectsCount: 52,
        expansionRegion: 'Ranchi Station Belt & Ward 15',
        whatTheyDo: 'A volunteer-driven organization that collects surplus food from restaurants and weddings to serve hungry and homeless families. We also run Robin Hood Academy to teach foundational literacy to street children on weekends.',
        areasWorked: [
          'Overbridge Night Shelter: Served over 8,500 freshly cooked, nutritious meals during evening food drives',
          'Daily Market Crossing: Rescued daily surplus bread and produce from 14 bakeries and distributed to slum residents',
          'Ward 12 Sunday Academy: Taught 65 underprivileged children basic English, maths, and hygiene habits',
          'Station Approach Road: Distributed hot nutritious khichdi and boiled eggs during winter weekends'
        ],
        expansionPlans: 'Setting up 2 new food rescue routes near Ranchi Railway Station and enrolling 100 children into formal government schools this academic year.'
      },
      {
        _id: 'ngo_5',
        name: 'Chintan Environmental Action Group',
        category: 'Environment & Waste Segregation',
        ward: 7,
        logo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80',
        memberCount: 86,
        projectsCount: 28,
        expansionRegion: 'Harmu Riverfront & Commercial Hubs',
        whatTheyDo: 'Chintan partners with informal waste pickers to create clean, green, and sustainable mohallas. We manage dry waste collection, organize e-waste collection drives, and protect waste workers from hazardous dumping practices.',
        areasWorked: [
          'Sector 4 Market: Integrated 42 informal waste pickers with official ID cards, protective gloves, and health insurance',
          'Harmu Canal Bank: Organized 6 plastic interception cleanups, removing 4.5 tons of floating plastic waste',
          'Lalpur Sector 7: Established neighborhood decentralized dry-waste sorting hub processing 2 tons daily',
          'Ward 12 Residential Societies: Conducted 20 door-to-door workshops on wet waste home composting'
        ],
        expansionPlans: 'Introducing a mohalla-wide electronic waste collection kiosk and expanding plastic recovery along the Harmu River corridor.'
      },
      {
        _id: 'ngo_6',
        name: 'Swechha India',
        category: 'Urban Ecology & Tree Plantation',
        ward: 7,
        logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&auto=format&fit=crop&q=80',
        memberCount: 78,
        projectsCount: 24,
        expansionRegion: 'Ward 12 Municipal Parks & Riverbank',
        whatTheyDo: 'Swechha engages young citizens in urban greening, building indigenous tree canopies using the Miyawaki method, restoring municipal parks, and organizing neighborhood air-quality awareness campaigns.',
        areasWorked: [
          'Old Bus Stand Corridor: Planted and secured 150 indigenous Neem & Peepal saplings with metal protective guards',
          'Birsa Public Park: Restored a neglected corner into an aromatic herbal biodiversity garden',
          'Ward 7 Green Belt: Led 8 weekend community park cleanups and established 4 leaf-composting pits',
          'Lalpur College Area: Conducted interactive ecological workshops on urban heat island reduction'
        ],
        expansionPlans: 'Planting a dense 500-sapling native urban forest on an unused municipal plot in Ward 12 and setting up rooftop rainwater harvesting demonstration units.'
      },
      {
        _id: 'ngo_7',
        name: 'HelpAge India',
        category: 'Health & Senior Citizen Care',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1000&auto=format&fit=crop&q=80',
        memberCount: 68,
        projectsCount: 35,
        expansionRegion: 'Ward 4 (Upper Bazar) & Ward 15 (Kanke)',
        whatTheyDo: 'HelpAge India advocates for the rights and health of disadvantaged elderly citizens. We provide free mobile medical care, assist with pension verifications, distribute thermal blankets, and operate companion helplines.',
        areasWorked: [
          'Ward 12 Community Hall: Organised 12 free geriatric health camps with free blood pressure, sugar, and vision checks',
          'Sector 4 Senior Colony: Distributed 200 heavy thermal blankets and wellness medicines to destitute seniors',
          'Doorstep Medicine Program: Assigned volunteers to deliver monthly chronic medications to 60 bedridden elders',
          'Pension Verification Desk: Guided 180 elderly widows and citizens through digital life-certificate portals'
        ],
        expansionPlans: 'Deploying a dedicated Mobile Medical Unit van equipped with basic physiotherapy to Ward 4 and Ward 15.'
      },
      {
        _id: 'ngo_8',
        name: 'Smile Foundation',
        category: 'Healthcare & Girl Child Support',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1000&auto=format&fit=crop&q=80',
        memberCount: 92,
        projectsCount: 30,
        expansionRegion: 'Ward 1 (Doranda) & Ward 4',
        whatTheyDo: 'Smile Foundation brings education and healthcare directly to underprivileged children and families through Smile on Wheels mobile clinics, remedial bridge courses, and vocational skill workshops.',
        areasWorked: [
          'Krishna Nagar Slum: Mobile clinic treated 420 mothers and children, providing free vitamins and pediatric care',
          'Ward 12 Girls School: Handed out 150 comprehensive stationery kits and sponsored 25 bright student scholarships',
          'Skill Training Center: Trained 40 local youth in retail operations and basic computer applications',
          'Municipal Dispensary: Conducted 6 child immunization awareness drives with municipal nurses'
        ],
        expansionPlans: 'Expanding mobile dispensary visits to 4 low-income colonies in Doranda and adding nutritional food kits for malnourished toddlers.'
      },
      {
        _id: 'ngo_9',
        name: 'SEWA Bharat',
        category: 'Women & Children Safety',
        ward: 12,
        logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1000&auto=format&fit=crop&q=80',
        memberCount: 110,
        projectsCount: 41,
        expansionRegion: 'Ward 7 (Lalpur) & Ward 4 (Upper Bazar)',
        whatTheyDo: 'SEWA Bharat organizes informal female workers, vendors, and domestic staff. We conduct street safety audits, identify broken lighting along pedestrian pathways, organize self-defense camps, and provide community mediation.',
        areasWorked: [
          'Overbridge Walkway: Audited 45 streetlights and facilitated 15 solar LED light installations on dark alleys',
          'Sector 2 Vendor Zone: Secured safe vending spaces and sanitary facilities for 85 women vegetable sellers',
          'Ward 12 Community Hall: Conducted certified self-defense and martial arts training for 300 adolescent girls',
          'Safe Transit Patrol: Mobilized volunteer buddy escorts for women commuting home from evening shifts'
        ],
        expansionPlans: 'Establishing 2 permanent women safety and legal aid helpdesks in Upper Bazar and Lalpur market crossroads.'
      },
      {
        _id: 'ngo_10',
        name: 'Teach For India',
        category: 'Education & Classroom Fellowship',
        ward: 4,
        logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80',
        memberCount: 64,
        projectsCount: 18,
        expansionRegion: 'Ward 12 Municipal Schools',
        whatTheyDo: 'Teach For India recruits passionate youth fellows to teach full-time in under-resourced schools, ensuring every child receives high quality education, critical thinking skills, and extracurricular mentorship.',
        areasWorked: [
          'Upper Bazar Govt High School: Deployed 6 fellows across grades 3-8, increasing student attendance by 30%',
          'Ward 4 Library Project: Built a 500-book reading corner and student science experiment desk',
          'Spoken English & Coding: Conducted daily interactive language and foundational computer sessions',
          'Parent-Teacher Forums: Organized monthly community meetings to boost parental involvement in education'
        ],
        expansionPlans: 'Partnering with 3 government elementary schools in Ward 12 to deploy 12 new full-time volunteer fellows.'
      },
      {
        _id: 'ngo_11',
        name: 'Child Rights and You (CRY)',
        category: 'Child Rights & Health',
        ward: 1,
        logo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80',
        memberCount: 88,
        projectsCount: 27,
        expansionRegion: 'Ward 12 & Ward 7 Settlements',
        whatTheyDo: 'CRY works on ground to eradicate child labor, prevent school dropouts, ensure complete childhood immunization, and provide safe play environments for children in slum settlements.',
        areasWorked: [
          'Doranda Railway Margin: Successfully rescued 28 child workers and re-enrolled them in formal schooling',
          'Ward 1 Health Center: Assisted municipal healthcare workers in tracking complete vaccinations for 150 infants',
          'Community Child Safety: Created 2 traffic-free, secure neighborhood play yards with play equipment',
          'Nutritional Care: Supplied balanced daily supplements to 80 severely underweight toddlers'
        ],
        expansionPlans: 'Launching a Mohalla Child Protection Committee in Ward 12 and setting up creative weekend hobby hubs.'
      },
      {
        _id: 'ngo_12',
        name: 'Nanhi Kali',
        category: 'Girl Child Education',
        ward: 15,
        logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
        memberCount: 72,
        projectsCount: 21,
        expansionRegion: 'Ward 12 & Ward 4 Corridors',
        whatTheyDo: 'Project Nanhi Kali provides comprehensive support to underprivileged girl children from grades 1 through 10, ensuring they complete 10 years of formal schooling with strong math, language, and digital competency.',
        areasWorked: [
          'Kanke Road Basti: Sponsored 110 girls with complete school kits, customized workbooks, and uniforms',
          'Academic Support Centers: Ran daily 2-hour remedial classes led by trained local community tutors',
          'Menstrual Hygiene Education: Conducted dignity and sanitary napkin awareness workshops for 240 adolescent girls',
          'Digital Classrooms: Equipped 40 girls with interactive digital tablets for self-paced STEM learning'
        ],
        expansionPlans: 'Sponsoring 150 girls across Ward 12 low-income families and setting up an evening digital learning center.'
      }
    ];
  }

  setupEventListeners() {
    // Search Bar
    const searchInput = document.getElementById('ngo-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderNGOList();
      });
    }

    // Toggles: All NGO vs My NGO
    const btnAll = document.getElementById('toggle-all-ngo');
    const btnMy = document.getElementById('toggle-my-ngo');

    if (btnAll) {
      btnAll.addEventListener('click', () => {
        this.filterTab = 'all';
        btnAll.classList.add('active');
        if (btnMy) btnMy.classList.remove('active');
        this.renderNGOList();
      });
    }

    if (btnMy) {
      btnMy.addEventListener('click', () => {
        this.filterTab = 'my';
        btnMy.classList.add('active');
        if (btnAll) btnAll.classList.remove('active');
        this.renderNGOList();
      });
    }
  }

  renderNGOList() {
    const container = document.getElementById('ngo-cards-list');
    if (!container) return;

    let filtered = this.ngos.filter(ngo => {
      const matchSearch = ngo.name.toLowerCase().includes(this.searchQuery) ||
                          (ngo.category || '').toLowerCase().includes(this.searchQuery);
      if (!matchSearch) return false;

      if (this.filterTab === 'my') {
        const id = ngo._id || ngo.id;
        return this.joinedNgoIds.has(id);
      }
      return true;
    });

    if (filtered.length === 0) {
      if (this.filterTab === 'my') {
        container.innerHTML = `
          <div style="text-align:center; padding: 2.5rem 1rem; color:#64748b;">
            <span class="material-symbols-outlined" style="font-size:36px; color:#94a3b8;">volunteer_activism</span>
            <p style="font-size:0.88rem; font-weight:600; margin:8px 0 4px;">No Joined NGOs Yet</p>
            <p style="font-size:0.78rem; color:#94a3b8; margin:0;">Switch to "All NGO", select an organization, and click "Apply to Join".</p>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div style="text-align:center; padding: 2rem 1rem; color:#94a3b8;">
            <span class="material-symbols-outlined" style="font-size:36px;">search_off</span>
            <p style="font-size:0.88rem; font-weight:600; margin:6px 0 0 0;">No NGOs found</p>
          </div>
        `;
      }
      return;
    }

    // Render cards: NO WARD NUMBER and NO "Applied" badge per user instruction
    container.innerHTML = filtered.map(ngo => {
      const id = ngo._id || ngo.id;
      const isActive = this.currentNGO && (this.currentNGO._id === id || this.currentNGO.id === id);

      return `
        <div class="ngo-directory-card ${isActive ? 'active' : ''}" onclick="window.volunteerController.selectNGO('${id}')">
          <img src="${ngo.logo}" class="ngo-card-avatar" alt="${ngo.name}" onerror="this.src='https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100'">
          <div class="ngo-card-content">
            <h4 class="ngo-card-name">${ngo.name}</h4>
            <div class="ngo-card-meta">
              <span>${ngo.category || 'Civic'}</span>
            </div>
          </div>
          <span class="material-symbols-outlined ngo-active-arrow">chevron_right</span>
        </div>
      `;
    }).join('');
  }

  selectNGO(id) {
    this.currentNGO = this.ngos.find(n => (n._id === id || n.id === id));
    if (!this.currentNGO) return;

    this.currentStage = 'description';
    this.renderNGOList();
    this.renderMainStage();
  }

  showApplyForm() {
    if (!this.currentNGO) return;
    this.currentStage = 'form';
    this.renderMainStage();
  }

  cancelApplyForm() {
    this.currentStage = 'description';
    this.renderMainStage();
  }

  renderMainStage() {
    const stage = document.getElementById('ngo-main-stage');
    if (!stage) return;

    // 1. Initial Empty Stage (Clean, minimal, executive layout - unprofessional lines removed)
    if (this.currentStage === 'empty' || !this.currentNGO) {
      stage.innerHTML = `
        <div class="volunteer-empty-stage">
          <div class="empty-stage-illustration">
            <span class="material-symbols-outlined" style="font-size:56px; color:#153D74;">diversity_3</span>
          </div>
          <h2 class="empty-stage-title">Select an Organization</h2>
          <p class="empty-stage-subtitle">
            Choose an accredited NGO from the directory on the left to view their mission, initiatives, and submit an application to join.
          </p>
        </div>
      `;
      return;
    }

    const ngo = this.currentNGO;
    const ngoId = ngo._id || ngo.id;
    const appData = this.applications[ngoId];

    // 2. Application Form Stage (hides description)
    // Ordered strictly per user requirement:
    // 1. Full Name, 2. Email ID, 3. Age, 4. What you can serve for NGO, 5. Comfortable to move to NGO working site?, 6. Time Range & Days
    if (this.currentStage === 'form') {
      const uName = this.currentUser?.name || 'Thakur Pratap';
      const uEmail = this.currentUser?.email || 'thakur@gmail.com';
      const uAge = this.currentUser?.age || 21;

      stage.innerHTML = `
        <div class="volunteer-apply-pane">
          <!-- Header Bar -->
          <div class="apply-header-bar">
            <div>
              <h2 style="margin:0 0 4px 0; font-size:1.35rem; color:#0f172a; font-weight:700;">Volunteer Application</h2>
              <span style="font-size:0.82rem; color:#64748b;">Applying to: <strong style="color:#153D74;">${ngo.name}</strong> • ${ngo.category}</span>
            </div>
            <button type="button" class="apply-back-btn" onclick="window.volunteerController.cancelApplyForm()">
              <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
              Back to NGO Overview
            </button>
          </div>

          <!-- Professional Application Form -->
          <form id="volunteer-application-form" class="apply-form-layout" onsubmit="window.volunteerController.handleFormSubmit(event)">
            
            <!-- Section 1: Personal Details -->
            <div class="apply-section-card">
              <div class="apply-section-header">
                <span class="material-symbols-outlined" style="color:#153D74; font-size:20px;">person</span>
                <h4>Personal Details</h4>
              </div>
              <div class="apply-form-grid">
                <!-- 1. Full Name -->
                <div class="apply-field-group">
                  <label for="apply-name">Full Name *</label>
                  <input type="text" id="apply-name" value="${uName}" placeholder="Enter your full name" required>
                </div>

                <!-- 2. Email Address -->
                <div class="apply-field-group">
                  <label for="apply-email">Email Address *</label>
                  <input type="email" id="apply-email" value="${uEmail}" placeholder="you@example.com" required>
                </div>

                <!-- 3. Age -->
                <div class="apply-field-group">
                  <label for="apply-age">Age (Years) *</label>
                  <input type="number" id="apply-age" value="${uAge}" min="14" max="99" placeholder="e.g. 21" required>
                </div>
              </div>
            </div>

            <!-- Section 2: Role & Contribution -->
            <div class="apply-section-card">
              <div class="apply-section-header">
                <span class="material-symbols-outlined" style="color:#2E6A63; font-size:20px;">handshake</span>
                <h4>Service Role & Capabilities</h4>
              </div>
              <div class="apply-form-grid">
                <!-- 4. What they can serve for NGO -->
                <div class="apply-field-group full-width">
                  <label for="apply-service">What can you serve for this NGO? *</label>
                  <select id="apply-service" required>
                    <option value="Field Volunteer & Cleanliness Drives">Field Volunteer & On-ground Drives</option>
                    <option value="Community Awareness & Resident Mobilization">Community Awareness & Rallies</option>
                    <option value="Teaching, Tutoring & Digital Literacy">Teaching, Tutoring & Child Mentorship</option>
                    <option value="First-Aid, Health & Geriatric Care">First-Aid, Health Camps & Senior Care</option>
                    <option value="Social Media, Photography & Outreach">Social Media, Photography & Digital Outreach</option>
                    <option value="Logistics, Surveying & Coordination">Logistics, Surveying & Ground Coordination</option>
                    <option value="General Volunteer Support">General Civic Volunteer Assistance</option>
                  </select>
                </div>

                <div class="apply-field-group full-width">
                  <label for="apply-skills">Specific Skills or Relevant Experience (Optional)</label>
                  <textarea id="apply-skills" rows="2" placeholder="e.g. Experience with waste segregation, youth tutoring, photography, or logistics..."></textarea>
                </div>
              </div>
            </div>

            <!-- Section 3: Site Mobility Comfort -->
            <div class="apply-section-card">
              <div class="apply-section-header">
                <span class="material-symbols-outlined" style="color:#ea580c; font-size:20px;">location_on</span>
                <h4>Site Mobility Comfort</h4>
              </div>
              <div class="apply-field-group full-width">
                <label style="margin-bottom:8px;">Are you comfortable to move to the NGO working site? *</label>
                <div class="mobility-options-list">
                  <label class="mobility-radio-card active">
                    <input type="radio" name="mobility" value="Yes, fully comfortable to travel to field project sites" checked>
                    <span><strong>Yes, fully comfortable</strong> — Ready to travel to designated field sites across the ward</span>
                  </label>
                  <label class="mobility-radio-card">
                    <input type="radio" name="mobility" value="Within my ward only (Ward 12 area)">
                    <span><strong>Within my ward only</strong> — Prefer field drives within 2–3 km of my neighborhood</span>
                  </label>
                  <label class="mobility-radio-card">
                    <input type="radio" name="mobility" value="Remote / Digital support only">
                    <span><strong>Remote / Digital support only</strong> — Coordinate online, handle communications, or data entry</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Section 4: Schedule & Availability -->
            <div class="apply-section-card">
              <div class="apply-section-header">
                <span class="material-symbols-outlined" style="color:#153D74; font-size:20px;">schedule</span>
                <h4>Schedule & Availability</h4>
              </div>
              
              <!-- Checkable Time Boxes (Click anywhere on box to check/uncheck) -->
              <div class="apply-field-group full-width">
                <label>Available Time Slots (Click boxes to select your free hours) *</label>
                <div class="time-boxes-grid">
                  <label class="time-box-item active">
                    <input type="checkbox" name="timeSlots" value="Morning (8:00 AM – 12:00 PM)" checked>
                    <div class="time-box-content">
                      <span class="time-box-title">Morning Slot</span>
                      <span class="time-box-time">8:00 AM – 12:00 PM</span>
                    </div>
                  </label>
                  <label class="time-box-item">
                    <input type="checkbox" name="timeSlots" value="Afternoon (12:00 PM – 4:00 PM)">
                    <div class="time-box-content">
                      <span class="time-box-title">Afternoon Slot</span>
                      <span class="time-box-time">12:00 PM – 4:00 PM</span>
                    </div>
                  </label>
                  <label class="time-box-item">
                    <input type="checkbox" name="timeSlots" value="Evening (4:00 PM – 8:00 PM)">
                    <div class="time-box-content">
                      <span class="time-box-title">Evening Slot</span>
                      <span class="time-box-time">4:00 PM – 8:00 PM</span>
                    </div>
                  </label>
                  <label class="time-box-item">
                    <input type="checkbox" name="timeSlots" value="Flexible / Full Day (9:00 AM – 5:00 PM)">
                    <div class="time-box-content">
                      <span class="time-box-title">Flexible / Full Day</span>
                      <span class="time-box-time">9:00 AM – 5:00 PM</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Custom Time Range Picker -->
              <div class="apply-field-group full-width" style="margin-bottom:6px;">
                <label style="font-size:0.78rem; color:#64748b; font-weight:600;">Custom Time Range (optional exact hours):</label>
                <div class="time-range-picker-row">
                  <div class="time-picker-item">
                    <span class="time-picker-label">From:</span>
                    <div class="time-input-wrap">
                      <span class="material-symbols-outlined">schedule</span>
                      <input type="time" id="apply-time-from" value="08:00" onchange="window.volunteerController.updateTimeDuration()">
                    </div>
                  </div>
                  
                  <div class="time-range-separator">
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </div>

                  <div class="time-picker-item">
                    <span class="time-picker-label">To:</span>
                    <div class="time-input-wrap">
                      <span class="material-symbols-outlined">schedule</span>
                      <input type="time" id="apply-time-to" value="12:00" onchange="window.volunteerController.updateTimeDuration()">
                    </div>
                  </div>

                  <div class="time-duration-chip" id="time-duration-chip">
                    <span class="material-symbols-outlined" style="font-size:16px;">timer</span>
                    <span id="time-duration-text">4 hours (08:00 AM – 12:00 PM)</span>
                  </div>
                </div>
              </div>

              <!-- Available Days in PROPER CHRONOLOGICAL ORDER: Monday to Sunday -->
              <div class="apply-field-group full-width">
                <label>Which days are you free? (Click boxes to select days) *</label>
                <div class="days-chips-row">
                  <label class="day-chip-label">
                    <input type="checkbox" name="days" value="Monday"> Monday
                  </label>
                  <label class="day-chip-label">
                    <input type="checkbox" name="days" value="Tuesday"> Tuesday
                  </label>
                  <label class="day-chip-label">
                    <input type="checkbox" name="days" value="Wednesday"> Wednesday
                  </label>
                  <label class="day-chip-label">
                    <input type="checkbox" name="days" value="Thursday"> Thursday
                  </label>
                  <label class="day-chip-label">
                    <input type="checkbox" name="days" value="Friday"> Friday
                  </label>
                  <label class="day-chip-label active">
                    <input type="checkbox" name="days" value="Saturday" checked> Saturday
                  </label>
                  <label class="day-chip-label active">
                    <input type="checkbox" name="days" value="Sunday" checked> Sunday
                  </label>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="apply-actions-row">
              <button type="submit" class="apply-submit-confirm-btn">
                <span class="material-symbols-outlined">send</span>
                Submit Volunteer Application
              </button>
              <button type="button" class="apply-cancel-btn" onclick="window.volunteerController.cancelApplyForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      `;

      this.setupFormRadioListeners();
      this.updateTimeDuration();
      return;
    }

    // 3. Success Confirmation Stage
    if (this.currentStage === 'success') {
      stage.innerHTML = `
        <div class="volunteer-success-pane">
          <div class="success-check-badge">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <h2 style="margin:0 0 8px 0; color:#0f172a; font-size:1.45rem;">Application Successfully Submitted!</h2>
          <p style="color:#475569; font-size:0.95rem; max-width:500px; line-height:1.55; margin:0 0 1.5rem 0;">
            Thank you, <strong>${appData?.name || this.currentUser?.name || 'Citizen'}</strong>! Your volunteer profile has been received by <strong>${ngo.name}</strong>. The coordinator will contact you at <em>${appData?.email || this.currentUser?.email}</em>.
          </p>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.25rem 1.5rem; text-align:left; max-width:440px; width:100%; margin-bottom:1.5rem; font-size:0.88rem;">
            <div style="margin-bottom:6px;"><strong>Role:</strong> ${appData?.service || 'Field Volunteer'}</div>
            <div style="margin-bottom:6px;"><strong>Site Mobility:</strong> ${appData?.mobility || 'Field Sites'}</div>
            <div style="margin-bottom:6px;"><strong>Time Range:</strong> ${appData?.timeSlot || '09:00 AM – 01:00 PM'}</div>
            <div><strong>Available Days:</strong> ${(appData?.days || ['Saturday', 'Sunday']).join(', ')}</div>
          </div>
          <button type="button" class="apply-trigger-btn" onclick="window.volunteerController.cancelApplyForm()" style="background:#153D74;">
            <span class="material-symbols-outlined">description</span>
            View NGO Overview
          </button>
        </div>
      `;
      return;
    }

    // 4. Detailed Description View Stage (What they do, current members, areas worked, expansion region, and Apply button)
    stage.innerHTML = `
      <div class="ngo-overview-pane">
        <!-- Banner Card -->
        <div class="overview-banner-card">
          <img src="${ngo.logo}" class="overview-banner-logo" alt="${ngo.name}" onerror="this.src='https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100'">
          <div class="overview-banner-info">
            <h2>${ngo.name}</h2>
            <p>${ngo.category || 'Civic Welfare'} • Community Partner</p>
          </div>
        </div>

        <!-- 3-Stats Highlights Row -->
        <div class="overview-stats-grid">
          <div class="overview-stat-card">
            <div class="overview-stat-icon">
              <span class="material-symbols-outlined">groups</span>
            </div>
            <div class="overview-stat-info">
              <span class="stat-label">Current Strength</span>
              <span class="stat-val">${ngo.memberCount} Active Members</span>
            </div>
          </div>

          <div class="overview-stat-card">
            <div class="overview-stat-icon" style="background:#ecfdf5; color:#16a34a;">
              <span class="material-symbols-outlined">task_alt</span>
            </div>
            <div class="overview-stat-info">
              <span class="stat-label">Past Completed</span>
              <span class="stat-val">${ngo.projectsCount || 20}+ Civic Drives</span>
            </div>
          </div>

          <div class="overview-stat-card">
            <div class="overview-stat-icon" style="background:#fffbeb; color:#d97706;">
              <span class="material-symbols-outlined">travel_explore</span>
            </div>
            <div class="overview-stat-info">
              <span class="stat-label">Expansion Region</span>
              <span class="stat-val" style="font-size:0.92rem;">${ngo.expansionRegion || 'Target Neighborhoods'}</span>
            </div>
          </div>
        </div>

        <!-- What This NGO Does -->
        <div class="overview-section-box">
          <h3>
            <span class="material-symbols-outlined" style="color:#153D74;">info</span>
            What This NGO Does
          </h3>
          <p>${ngo.whatTheyDo}</p>
        </div>

        <!-- Current Members Strength -->
        <div class="overview-section-box">
          <h3>
            <span class="material-symbols-outlined" style="color:#2E6A63;">diversity_3</span>
            Active Members & Field Volunteer Strength
          </h3>
          <p>
            Currently operating with <strong>${ngo.memberCount} enrolled citizen volunteers</strong>. 
            Field squads include certified ground coordinators, youth volunteers, and technical leads organized for rapid civic response.
          </p>
        </div>

        <!-- Areas Worked In -->
        <div class="overview-section-box">
          <h3>
            <span class="material-symbols-outlined" style="color:#16a34a;">verified</span>
            Areas and Projects Worked In
          </h3>
          <ul>
            ${(ngo.areasWorked || []).map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <!-- Regions Planned for Expansion -->
        <div class="overview-section-box">
          <h3>
            <span class="material-symbols-outlined" style="color:#ea580c;">near_me</span>
            Regions Planned for Expansion
          </h3>
          <p>${ngo.expansionPlans}</p>
        </div>

        <!-- Apply to Join Button Action Footer -->
        <div class="overview-action-footer">
          <button type="button" class="apply-trigger-btn" onclick="window.volunteerController.showApplyForm()">
            <span class="material-symbols-outlined">how_to_reg</span>
            Apply to Join
          </button>
        </div>
      </div>
    `;
  }

  setTimePreset(from, to) {
    const inputFrom = document.getElementById('apply-time-from');
    const inputTo = document.getElementById('apply-time-to');
    if (inputFrom && inputTo) {
      inputFrom.value = from;
      inputTo.value = to;
      this.updateTimeDuration();
    }
  }

  updateTimeDuration() {
    const fromVal = document.getElementById('apply-time-from')?.value || '09:00';
    const toVal = document.getElementById('apply-time-to')?.value || '13:00';
    const durationText = document.getElementById('time-duration-text');
    if (!durationText) return;

    const [h1, m1] = fromVal.split(':').map(Number);
    const [h2, m2] = toVal.split(':').map(Number);
    let diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // handle wrap around

    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    let durStr = '';
    if (hours > 0 && mins > 0) durStr = `${hours}h ${mins}m`;
    else if (hours > 0) durStr = `${hours} hours`;
    else durStr = `${mins} mins`;

    durationText.textContent = `${durStr} (${this.formatTime12h(fromVal)} – ${this.formatTime12h(toVal)})`;
  }

  formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const adjustedHour = h % 12 === 0 ? 12 : h % 12;
    const paddedMinute = String(m).padStart(2, '0');
    return `${adjustedHour}:${paddedMinute} ${period}`;
  }

  setupFormRadioListeners() {
    // Mobility Cards Selection
    const mobilityCards = document.querySelectorAll('.mobility-radio-card');
    mobilityCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const input = card.querySelector('input[type="radio"]');
        if (e.target !== input) {
          e.preventDefault();
          if (input) input.checked = true;
        }
        mobilityCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (input) input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    // Setup checkable boxes (both time boxes and day chips)
    // Clicking ANYWHERE on the box toggles the checkbox and immediately updates the active style
    const checkableBoxes = document.querySelectorAll('.time-box-item, .day-chip-label');
    checkableBoxes.forEach(box => {
      const input = box.querySelector('input[type="checkbox"]');
      if (!input) return;

      // Ensure initial active class matches checked state
      if (input.checked) box.classList.add('active');
      else box.classList.remove('active');

      box.addEventListener('click', (e) => {
        // If clicking directly on the checkbox input, update class after native toggle
        if (e.target === input) {
          if (input.checked) box.classList.add('active');
          else box.classList.remove('active');
          return;
        }

        // When clicking on the box (text, padding, label area), prevent browser double-toggle
        e.preventDefault();
        input.checked = !input.checked;
        if (input.checked) box.classList.add('active');
        else box.classList.remove('active');
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (!this.currentNGO) return;

    const ngoId = this.currentNGO._id || this.currentNGO.id;
    const name = document.getElementById('apply-name')?.value?.trim() || this.currentUser?.name;
    const email = document.getElementById('apply-email')?.value?.trim() || this.currentUser?.email;
    const age = document.getElementById('apply-age')?.value || 21;
    const service = document.getElementById('apply-service')?.value || 'Field Volunteer';
    const skills = document.getElementById('apply-skills')?.value?.trim() || '';

    const mobilityInput = document.querySelector('input[name="mobility"]:checked');
    const mobility = mobilityInput ? mobilityInput.value : 'Yes, fully comfortable';

    const checkedTimeSlots = Array.from(document.querySelectorAll('input[name="timeSlots"]:checked')).map(cb => cb.value);
    const timeFrom = document.getElementById('apply-time-from')?.value || '08:00';
    const timeTo = document.getElementById('apply-time-to')?.value || '12:00';
    const timeSlot = checkedTimeSlots.length > 0 
      ? checkedTimeSlots.join(', ') 
      : `${this.formatTime12h(timeFrom)} – ${this.formatTime12h(timeTo)}`;

    const checkedDays = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value);

    const appData = {
      ngoId,
      ngoName: this.currentNGO.name,
      name,
      email,
      age: Number(age),
      service,
      skills,
      mobility,
      timeFrom,
      timeTo,
      timeSlot,
      days: checkedDays.length > 0 ? checkedDays : ['Saturday', 'Sunday'],
      appliedAt: new Date().toISOString()
    };

    // 1. Save application
    this.applications[ngoId] = appData;
    localStorage.setItem('ms_volunteer_applications', JSON.stringify(this.applications));

    // 2. Mark as joined/applied in localStorage (shows under "My NGO" tab)
    this.joinedNgoIds.add(ngoId);
    localStorage.setItem('ms_joined_ngos', JSON.stringify(Array.from(this.joinedNgoIds)));

    // 3. Switch to confirmation view
    this.currentStage = 'success';
    this.renderNGOList();
    this.renderMainStage();

    if (window.api && typeof window.api.showToast === 'function') {
      window.api.showToast(`Application submitted to ${this.currentNGO.name}!`, 'success');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.volunteerController = new MohallaVolunteerController();
  window.volunteerController.init();
});
