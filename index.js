document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Mobile Menu Toggle
  // ==========================================
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });
  }



  // ==========================================
  // 3. Biodiversité Tabs
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Update active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update active content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetTab) {
          content.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // 4. Photo Gallery Filter
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      
      // Update active filter button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          // Force a tiny reflow for transition effect
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ==========================================
  // 5. Lightbox Modal for Photo Gallery
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  // Re-evaluate visible items for navigation
  function updateActiveGalleryItems() {
    activeGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateActiveGalleryItems();
      currentGalleryIndex = activeGalleryItems.indexOf(item);
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    const src = item.getAttribute('data-src');
    const caption = item.getAttribute('data-caption');
    
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  function showNextImage() {
    updateActiveGalleryItems();
    if (activeGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
    openLightbox(activeGalleryItems[currentGalleryIndex]);
  }

  function showPrevImage() {
    updateActiveGalleryItems();
    if (activeGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    openLightbox(activeGalleryItems[currentGalleryIndex]);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close when clicking outside the content
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // ==========================================
  // 6. Navigation Active Links Highlight on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollActiveHighlight = () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for navbar height
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', scrollActiveHighlight);

  // ==========================================
  // 7. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    // Add default reveal style
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ==========================================
  // 8. Contact Form Mock Submission
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Create a premium notification message
      const alertDiv = document.createElement('div');
      alertDiv.style.position = 'fixed';
      alertDiv.style.bottom = '20px';
      alertDiv.style.right = '20px';
      alertDiv.style.background = 'var(--accent-emerald)';
      alertDiv.style.color = '#white';
      alertDiv.style.padding = '16px 24px';
      alertDiv.style.borderRadius = 'var(--border-radius-sm)';
      alertDiv.style.boxShadow = 'var(--box-shadow-premium)';
      alertDiv.style.zIndex = '3000';
      alertDiv.style.fontFamily = 'var(--font-title)';
      alertDiv.style.fontWeight = '600';
      alertDiv.style.animation = 'fadeIn 0.3s ease';
      alertDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> Merci ${name} ! Votre message a été simulé avec succès.`;
      
      document.body.appendChild(alertDiv);
      contactForm.reset();
      
      setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(20px)';
        alertDiv.style.transition = 'var(--transition-smooth)';
        setTimeout(() => { alertDiv.remove(); }, 300);
      }, 4000);
    });
  }
});
