/**
 * MOHALLA SEVA - CIVIC PROGRESS & FIELD RESOLUTION CONTROLLER
 * Features:
 * 1. De-redditized, clean civic interface.
 * 2. Left sidebar:
 *    - Categories Filter Box (Sanitation, Health, Infrastructure, Environment, Education, Safety, All)
 *    - 12 Real Accredited NGOs: Clicking filters the feed to posts completed by that NGO.
 * 3. Top "create post" box removed (regular users cannot post directly).
 * 4. Recent Posts retained with real image thumbnails.
 * 5. Top Ward Contributors retained without score numbers.
 * 6. Thumbs up upvote button, comments drawer, and share actions.
 */

class MohallaProgressFeed {
  constructor() {
    this.posts = [];
    this.ngos = [];
    this.currentUser = null;
    this.selectedCategory = 'all';
    this.selectedNgoId = null;
  }

  init() {
    this.syncUser();
    this.loadNGOs();
    this.loadSamplePosts();
    this.setupEventListeners();
    this.renderNgoSidebar();
    this.renderPosts();
    this.renderRightSidebar();
  }

  syncUser() {
    try {
      const saved = sessionStorage.getItem('ms_active_user');
      if (saved) this.currentUser = JSON.parse(saved);
      else this.currentUser = { name: 'Thakur Pratap', ward: 12, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' };
    } catch (e) {
      console.warn('Progress user sync error:', e);
    }
  }

  loadNGOs() {
    this.ngos = [
      { id: 'ngo_1', name: 'Goonj', category: 'Civic Relief', logo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100' },
      { id: 'ngo_2', name: 'Sulabh Sanitation Mission', category: 'Sanitation', logo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100' },
      { id: 'ngo_3', name: 'Pratham Education Foundation', category: 'Education', logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100' },
      { id: 'ngo_4', name: 'Robin Hood Army', category: 'Zero Hunger', logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100' },
      { id: 'ngo_5', name: 'Chintan Environmental Group', category: 'Environment', logo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=100' },
      { id: 'ngo_6', name: 'Swechha India', category: 'Environment', logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100' },
      { id: 'ngo_7', name: 'HelpAge India', category: 'Health', logo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=100' },
      { id: 'ngo_8', name: 'Smile Foundation', category: 'Health', logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100' },
      { id: 'ngo_9', name: 'SEWA Bharat', category: 'Safety', logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
      { id: 'ngo_10', name: 'Teach For India', category: 'Education', logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=100' },
      { id: 'ngo_11', name: 'Child Rights and You (CRY)', category: 'Child Care', logo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100' },
      { id: 'ngo_12', name: 'Nanhi Kali', category: 'Education', logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100' }
    ];
  }

  loadSamplePosts() {
    this.posts = [
      {
        id: 'post_1',
        ngoId: 'ngo_2',
        ngoName: 'Sulabh Sanitation Mission',
        ngoLogo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100',
        category: 'Sanitation',
        ward: 12,
        timeAgo: '2 hours ago',
        title: 'Sector 4 Market Chronic Garbage Spot Completely Cleared & Sanitized',
        description: 'Our rapid response sanitation squad deployed heavy sweepers and hydraulic suction to clear 4 tons of accumulated waste opposite Daily Market. Installed 4 dual-stream segregation bins and disinfected the area with lime powder.',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=900&auto=format&fit=crop&q=80',
        upvotes: 412,
        commentsCount: 24,
        userVoted: false,
        comments: [
          { author: 'Thakur Pratap (Resident)', text: 'Walked by this spot an hour ago, completely clean and odor-free now! Superb work by Sulabh team.' },
          { author: 'Sunita Mishra', text: 'Please ensure local fruit vendors do not dump crates here again.' }
        ]
      },
      {
        id: 'post_2',
        ngoId: 'ngo_9',
        ngoName: 'SEWA Bharat',
        ngoLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
        category: 'Safety',
        ward: 12,
        timeAgo: '6 hours ago',
        title: '15 High-Lumen Solar LED Streetlights Commissioned on Overbridge Pedestrian Alley',
        description: 'Following a safety audit with local women workers, SEWA Bharat technicians completed the installation of 15 standalone solar LED streetlights with infrared motion detectors along the pedestrian footpath, eliminating dark safety hazards.',
        image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?w=900&auto=format&fit=crop&q=80',
        upvotes: 295,
        commentsCount: 16,
        userVoted: false,
        comments: [
          { author: 'Pooja Verma', text: 'This was desperately needed for college students returning from tuition in the evening. Thank you!' }
        ]
      },
      {
        id: 'post_3',
        ngoId: 'ngo_3',
        ngoName: 'Pratham Education Foundation',
        ngoLogo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100',
        category: 'Education',
        ward: 12,
        timeAgo: '1 day ago',
        title: 'Rajkriti Vikas Primary School: 50 Comprehensive Study Kits & Reading Bags Handed Over',
        description: 'Our education volunteers concluded the 30-day foundational literacy camp by distributing comprehensive study kits containing notebooks, geometry sets, drawing supplies, and Hindi reading storybooks to 50 elementary students.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop&q=80',
        upvotes: 348,
        commentsCount: 19,
        userVoted: false,
        comments: [
          { author: 'Master Ramesh (Headmaster)', text: 'The students are overjoyed. Attendance in remedial reading has surged to 96%.' }
        ]
      },
      {
        id: 'post_4',
        ngoId: 'ngo_6',
        ngoName: 'Swechha India',
        ngoLogo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100',
        category: 'Environment',
        ward: 7,
        timeAgo: '2 days ago',
        title: '150 Native Neem & Peepal Trees Planted Along Old Bus Stand Avenue',
        description: 'In partnership with mohalla shopkeepers, Swechha volunteers planted 150 indigenous shade trees fitted with protective metal tree guards. Each shop has adopted 2 saplings with an agreement for daily watering.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop&q=80',
        upvotes: 276,
        commentsCount: 12,
        userVoted: false,
        comments: [
          { author: 'Alok Roy', text: 'Adopted 2 trees right outside my bookstore. Excellent community ownership initiative.' }
        ]
      },
      {
        id: 'post_5',
        ngoId: 'ngo_1',
        ngoName: 'Goonj',
        ngoLogo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100',
        category: 'Infrastructure',
        ward: 12,
        timeAgo: '2 days ago',
        title: 'Hazardous School Road Pothole Crater Restored in 24 Hours',
        description: 'Using cold mix bituminous asphalt and mechanical compactors, the 2-foot road crater on Girls High School road has been leveled and sealed, ensuring smooth passage for school buses and pedestrians.',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        upvotes: 382,
        commentsCount: 15,
        userVoted: false,
        comments: [
          { author: 'Rakesh Ranjan', text: 'School bus commute is smooth again. Prompt execution!' }
        ]
      },
      {
        id: 'post_6',
        ngoId: 'ngo_7',
        ngoName: 'HelpAge India',
        ngoLogo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=100',
        category: 'Health',
        ward: 12,
        timeAgo: '3 days ago',
        title: 'Ward 12 Senior Citizen Free Medical & Geriatric Vision Screening Camp',
        description: 'Our Mobile Medical Unit treated 120 senior citizens at Krishna Nagar Community Hall. Distributed free prescription reading glasses to 48 seniors and chronic hypertension medicines for 3 months.',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=900&auto=format&fit=crop&q=80',
        upvotes: 215,
        commentsCount: 11,
        userVoted: false,
        comments: [
          { author: 'Kavita Singh', text: 'My elderly father got his eyes checked and received glasses free of cost. Immense gratitude.' }
        ]
      },
      {
        id: 'post_7',
        ngoId: 'ngo_4',
        ngoName: 'Robin Hood Army',
        ngoLogo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100',
        category: 'Health',
        ward: 12,
        timeAgo: '4 days ago',
        title: '500 Fresh Nutritious Meals Distributed Across Overbridge Night Shelter',
        description: 'Volunteers collected surplus nutritious meals from 3 wedding banquet halls and served hot dinner packs to shelter residents and daily wage laborers with zero food wastage.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=80',
        upvotes: 330,
        commentsCount: 18,
        userVoted: false,
        comments: [
          { author: 'Manish Anand', text: 'The Robin Hood Army spirit is unmatched. Proud of our city chapter!' }
        ]
      },
      {
        id: 'post_8',
        ngoId: 'ngo_5',
        ngoName: 'Chintan Environmental Group',
        ngoLogo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=100',
        category: 'Environment',
        ward: 7,
        timeAgo: '5 days ago',
        title: 'Harmu Riverfront Cleanliness Drive: 3.2 Tons of Plastic Intercepted',
        description: 'Chintan volunteer squads equipped with protective boots and collection bags removed 3.2 tons of single-use polyethylene bags and bottles from the riverbank, diverting them to accredited recycling units.',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900&auto=format&fit=crop&q=80',
        upvotes: 264,
        commentsCount: 9,
        userVoted: false,
        comments: [
          { author: 'Vivek Soren', text: 'Harmu canal looks cleaner than it has in years. Let us keep it trash-free.' }
        ]
      }
    ];
  }

  setupEventListeners() {
    // Categories Filter Buttons
    const categoryBtns = document.querySelectorAll('.category-filter-item');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.category || 'all';
        this.updateFilterStatusUI();
        this.renderPosts();
      });
    });
  }

  renderNgoSidebar() {
    const list = document.getElementById('ngo-filter-list');
    if (!list) return;

    list.innerHTML = this.ngos.map(ngo => {
      const isSelected = this.selectedNgoId === ngo.id;
      return `
        <div class="ngo-sidebar-item ${isSelected ? 'active' : ''}" onclick="window.redditFeed.filterByNgo('${ngo.id}')">
          <img src="${ngo.logo}" class="ngo-sidebar-avatar" alt="${ngo.name}" onerror="this.src='https://images.unsplash.com/photo-1593113598332-cd288d649433?w=50'">
          <div class="ngo-sidebar-info">
            <span class="ngo-sidebar-name">${ngo.name}</span>
            <span class="ngo-sidebar-sub">${ngo.category}</span>
          </div>
          <span class="material-symbols-outlined ngo-sidebar-icon">arrow_forward_ios</span>
        </div>
      `;
    }).join('');
  }

  filterByNgo(ngoId) {
    this.selectedNgoId = (this.selectedNgoId === ngoId) ? null : ngoId; // toggle
    this.renderNgoSidebar();
    this.updateFilterStatusUI();
    this.renderPosts();
  }

  resetNgoFilter() {
    this.selectedNgoId = null;
    this.renderNgoSidebar();
    this.updateFilterStatusUI();
    this.renderPosts();
  }

  clearAllFilters() {
    this.selectedCategory = 'all';
    this.selectedNgoId = null;
    const catBtns = document.querySelectorAll('.category-filter-item');
    catBtns.forEach(b => {
      if (b.dataset.category === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });
    this.renderNgoSidebar();
    this.updateFilterStatusUI();
    this.renderPosts();
  }

  updateFilterStatusUI() {
    const heading = document.getElementById('active-filter-heading');
    const sub = document.getElementById('active-filter-sub');
    const clearBtn = document.getElementById('feed-clear-filters-btn');

    let activeNgo = this.ngos.find(n => n.id === this.selectedNgoId);

    if (activeNgo && this.selectedCategory !== 'all') {
      if (heading) heading.textContent = `${activeNgo.name} • ${this.selectedCategory} Updates`;
      if (sub) sub.textContent = `Showing verified field resolutions in ${this.selectedCategory} by ${activeNgo.name}`;
      if (clearBtn) clearBtn.style.display = 'inline-flex';
    } else if (activeNgo) {
      if (heading) heading.textContent = `${activeNgo.name} Field Projects`;
      if (sub) sub.textContent = `Showing all verified civic work executed by ${activeNgo.name}`;
      if (clearBtn) clearBtn.style.display = 'inline-flex';
    } else if (this.selectedCategory !== 'all') {
      if (heading) heading.textContent = `${this.selectedCategory} Civic Progress`;
      if (sub) sub.textContent = `Showing verified community updates under ${this.selectedCategory}`;
      if (clearBtn) clearBtn.style.display = 'inline-flex';
    } else {
      if (heading) heading.textContent = `Verified NGO Civic Progress`;
      if (sub) sub.textContent = `Showing verified field projects and before/after resolutions`;
      if (clearBtn) clearBtn.style.display = 'none';
    }
  }

  renderPosts() {
    const feedContainer = document.getElementById('reddit-posts-feed');
    if (!feedContainer) return;

    let filtered = this.posts;

    // Filter by NGO if selected
    if (this.selectedNgoId) {
      filtered = filtered.filter(p => p.ngoId === this.selectedNgoId);
    }

    // Filter by Category if selected
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes(this.selectedCategory.toLowerCase());
      });
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div class="feed-empty-state">
          <span class="material-symbols-outlined" style="font-size:48px; color:#94a3b8; margin-bottom:8px;">folder_off</span>
          <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin:0 0 6px 0;">No Updates Found</h3>
          <p style="font-size:0.88rem; color:#64748b; margin:0 0 16px 0;">No verified progress reports match the current filter criteria.</p>
          <button type="button" class="apply-back-btn" onclick="window.redditFeed.clearAllFilters()">
            Clear Filters & View All
          </button>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(p => `
      <div class="civic-post-card" id="card-${p.id}">
        
        <!-- Post Top Meta Header (De-redditized) -->
        <div class="civic-post-meta">
          <img src="${p.ngoLogo}" class="civic-post-ngo-logo" alt="${p.ngoName}" onerror="this.src='https://images.unsplash.com/photo-1593113598332-cd288d649433?w=50'">
          <div class="civic-post-ngo-info">
            <div class="civic-ngo-title-row">
              <span class="civic-ngo-name">${p.ngoName}</span>
              <span class="material-symbols-outlined civic-verified-icon" title="Accredited Partner">verified</span>
              <span class="civic-category-pill">${p.category}</span>
            </div>
            <div class="civic-post-subtext">
              <span>Ward ${p.ward || 12}</span>
              <span>•</span>
              <span>${p.timeAgo}</span>
              <span>•</span>
              <span style="color:#15803d; font-weight:600;">Verified Ground Work</span>
            </div>
          </div>
        </div>

        <!-- Post Content -->
        <div class="civic-post-body">
          <h3 class="civic-post-title">${p.title}</h3>
          <p class="civic-post-desc">${p.description}</p>
        </div>

        <!-- Media Attachment -->
        ${p.image ? `
        <div class="civic-post-media">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>` : ''}

        <!-- Post Action Buttons (Clean Civic Engagement) -->
        <div class="civic-post-actions">
          <button type="button" class="civic-action-btn ${p.userVoted ? 'active' : ''}" onclick="window.redditFeed.toggleUpvote('${p.id}')">
            <span class="material-symbols-outlined" style="font-size:18px;">thumb_up</span>
            <span id="vote-count-${p.id}">${p.upvotes}</span>
            <span>Applaud</span>
          </button>

          <button type="button" class="civic-action-btn" onclick="window.redditFeed.toggleComments('${p.id}')">
            <span class="material-symbols-outlined" style="font-size:18px;">chat_bubble</span>
            <span>${p.commentsCount} Comments</span>
          </button>

          <button type="button" class="civic-action-btn" onclick="window.redditFeed.sharePost('${p.id}')">
            <span class="material-symbols-outlined" style="font-size:18px;">share</span>
            <span>Share</span>
          </button>
        </div>

        <!-- Comments Drawer -->
        <div class="civic-comments-drawer" id="comments-drawer-${p.id}">
          <div class="comment-input-row">
            <input type="text" id="comment-input-${p.id}" placeholder="Write a community comment or feedback...">
            <button type="button" class="comment-post-btn" onclick="window.redditFeed.addComment('${p.id}')">Post</button>
          </div>
          <div class="comments-stream" id="comments-list-${p.id}">
            ${p.comments.map(c => `
              <div class="civic-comment-bubble">
                <span class="comment-author">${c.author}</span>
                <p class="comment-text">${c.text}</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `).join('');
  }

  toggleUpvote(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.userVoted) {
      post.upvotes -= 1;
      post.userVoted = false;
    } else {
      post.upvotes += 1;
      post.userVoted = true;
    }

    const countEl = document.getElementById(`vote-count-${postId}`);
    if (countEl) countEl.textContent = post.upvotes;

    const card = document.getElementById(`card-${postId}`);
    if (card) {
      const btn = card.querySelector('.civic-action-btn');
      if (btn) {
        if (post.userVoted) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    }
  }

  toggleComments(postId) {
    const drawer = document.getElementById(`comments-drawer-${postId}`);
    if (drawer) drawer.classList.toggle('open');
  }

  addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input || !input.value.trim()) return;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const author = `${this.currentUser?.name || 'Resident'} (Ward 12)`;
    post.comments.unshift({ author, text: input.value.trim() });
    post.commentsCount += 1;
    input.value = '';

    this.renderPosts();
    const drawer = document.getElementById(`comments-drawer-${postId}`);
    if (drawer) drawer.classList.add('open');
  }

  sharePost(postId) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    if (window.api && typeof window.api.showToast === 'function') {
      window.api.showToast('Post link copied to clipboard!', 'info');
    } else {
      alert('Post link copied to clipboard!');
    }
  }

  renderRightSidebar() {
    const leaderContainer = document.getElementById('reddit-leaderboard');
    if (!leaderContainer) return;

    // Top Ward Contributors with roles and no points per user instructions
    const leaders = [
      { name: 'Thakur Pratap', role: 'Active Resident', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { name: 'Priya Patel', role: 'Volunteer Squad Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { name: 'Rohan Verma', role: 'Ward Coordinator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'Ananya Iyer', role: 'Community Auditor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
      { name: 'Dr. Sunita Rao', role: 'Civic Health Champion', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }
    ];

    leaderContainer.innerHTML = leaders.map(l => `
      <div class="civic-contributor-row">
        <img src="${l.avatar}" class="contributor-avatar" alt="${l.name}">
        <div class="contributor-info">
          <span class="contributor-name">${l.name}</span>
          <span class="contributor-role">${l.role}</span>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.redditFeed = new MohallaProgressFeed();
  window.redditFeed.init();
});
