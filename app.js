// Storage Key
const STORAGE_KEY = 'skill_swap_board_posts_v1';

// Initial Mock Swaps
const initialPosts = [
  {
    id: '1',
    type: 'OFFER',
    name: 'Aman Verma',
    contact: 'aman.verma@email.com',
    offer: 'Python & Web Scraping',
    want: 'Spoken English & Communication',
    category: 'Programming',
    mode: 'Online (Zoom / Meet)',
    notes: 'Can teach Python from zero to writing automated scrapers. Looking to improve conversational English.'
  },
  {
    id: '2',
    type: 'REQUEST',
    name: 'Priya Patel',
    contact: 'Instagram: @priyapatel_art',
    offer: 'Figma & UI/UX Design Basics',
    want: 'Acoustic Guitar Lessons',
    category: 'Music',
    mode: 'Hybrid (Both)',
    notes: 'Have 2 years experience as a UI designer. Want to learn acoustic guitar chords on weekends.'
  },
  {
    id: '3',
    type: 'OFFER',
    name: 'Arjun Das',
    contact: 'WhatsApp: +91 98765 43210',
    offer: 'Conversational French (A1-B1)',
    want: 'Excel & Data Dashboards',
    category: 'Languages',
    mode: 'Online (Zoom / Meet)',
    notes: 'Lived in France for 2 years. Willing to trade French lessons for advanced Excel tips.'
  }
];

let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialPosts;
let currentTypeFilter = 'ALL';

// DOM Elements
const cardsGrid = document.getElementById('cards-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const typeButtons = document.querySelectorAll('.type-btn');

// Modal Elements
const swapModal = document.getElementById('swap-modal');
const swapForm = document.getElementById('swap-form');
const contactModal = document.getElementById('contact-modal');
const contactInfoDisplay = document.getElementById('contact-info-display');

// Stat DOM
const statAll = document.getElementById('stat-all');
const statOffers = document.getElementById('stat-offers');
const statRequests = document.getElementById('stat-requests');

// Save to LocalStorage
function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Render Dashboard & Cards
function renderPosts() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  // Stats calculation
  const offerCount = posts.filter(p => p.type === 'OFFER').length;
  const requestCount = posts.filter(p => p.type === 'REQUEST').length;

  statAll.textContent = posts.length;
  statOffers.textContent = offerCount;
  statRequests.textContent = requestCount;

  // Filter posts
  const filtered = posts.filter(post => {
    const matchesType = (currentTypeFilter === 'ALL') || (post.type === currentTypeFilter);
    const matchesCategory = (selectedCategory === 'ALL') || (post.category === selectedCategory);
    const matchesSearch = 
      post.offer.toLowerCase().includes(query) ||
      post.want.toLowerCase().includes(query) ||
      post.name.toLowerCase().includes(query);

    return matchesType && matchesCategory && matchesSearch;
  });

  cardsGrid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  filtered.forEach(post => {
    const isOffer = post.type === 'OFFER';
    const card = document.createElement('div');
    card.className = 'swap-card';

    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="badge ${isOffer ? 'badge-offer' : 'badge-request'}">
            <i class="fa-solid ${isOffer ? 'fa-arrow-up-right-from-square' : 'fa-arrow-down-left-and-up-right-to-spread'}"></i>
            ${isOffer ? 'Skill Offered' : 'Skill Requested'}
          </span>
          <span class="card-category">${post.category}</span>
        </div>

        <div class="author-info">
          <div class="author-avatar">${post.name.charAt(0).toUpperCase()}</div>
          <div class="author-name">${post.name}</div>
        </div>

        <div class="exchange-box">
          <div class="exchange-row">
            <span class="tag-badge tag-offer">TEACHES</span>
            <strong>${post.offer}</strong>
          </div>
          <div class="exchange-row">
            <span class="tag-badge tag-want">WANTS</span>
            <strong>${post.want}</strong>
          </div>
        </div>

        <p class="card-notes">${post.notes || 'No extra notes provided.'}</p>
      </div>

      <div class="card-footer">
        <span class="mode-tag"><i class="fa-solid fa-location-dot"></i> ${post.mode}</span>
        <div style="display:flex; align-items:center; gap: 8px;">
          <button class="btn btn-connect" onclick="showContact('${post.name}', '${post.contact}')">
            <i class="fa-regular fa-comment-dots"></i> Connect
          </button>
          <button class="btn-delete" title="Delete post" onclick="deletePost('${post.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    cardsGrid.appendChild(card);
  });
}

// Open Modal
window.openModal = function() {
  swapForm.reset();
  swapModal.classList.remove('hidden');
};

// Close Modal
window.closeModal = function() {
  swapModal.classList.add('hidden');
};

// Contact Modal Handling
window.showContact = function(name, contact) {
  contactInfoDisplay.innerHTML = `<div>${name}</div><div style="font-size: 1.15rem; margin-top: 5px;">${contact}</div>`;
  contactModal.classList.remove('hidden');
};

window.closeContactModal = function() {
  contactModal.classList.add('hidden');
};

// Delete Post
window.deletePost = function(id) {
  if (confirm('Kya aap sure hain is post ko delete karna chahte hain?')) {
    posts = posts.filter(post => post.id !== id);
    savePosts();
    renderPosts();
  }
};

// Add Post Submit
swapForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const type = document.querySelector('input[name="post-type"]:checked').value;
  const name = document.getElementById('user-name').value.trim();
  const contact = document.getElementById('user-contact').value.trim();
  const offer = document.getElementById('offered-skill').value.trim();
  const want = document.getElementById('wanted-skill').value.trim();
  const category = document.getElementById('skill-category').value;
  const mode = document.getElementById('swap-mode').value;
  const notes = document.getElementById('post-notes').value.trim();

  const newPost = {
    id: Date.now().toString(),
    type,
    name,
    contact,
    offer,
    want,
    category,
    mode,
    notes
  };

  posts.unshift(newPost);
  savePosts();
  renderPosts();
  closeModal();
});

// Type Filter Buttons (ALL, OFFER, REQUEST)
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTypeFilter = btn.dataset.type;
    renderPosts();
  });
});

// Event Listeners for Filters
searchInput.addEventListener('input', renderPosts);
categoryFilter.addEventListener('change', renderPosts);

// Initial Load
renderPosts();