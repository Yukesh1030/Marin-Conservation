/**
 * Marine Conservation Website - Main JavaScript Logic
 * Premium interactive features and smooth animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Hide Page Loader
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500); // Small delay for premium feel
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500);
    }
  }

  // 3. Navbar Solid Background on Scroll
  const header = document.querySelector('.header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  if (header) {
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run on startup
  }

  // 4. Active Page Navbar Indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 5. Mobile Navigation Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });

    // Close menu when clicking a link
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    });
  }

  // 6. Scroll Reveal Animations (using Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom-in');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 7. Statistics Count-Up Counter
  const counters = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * target);
            
            el.innerText = currentValue.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.innerText = target.toLocaleString() + suffix;
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    // Fallback
    counters.forEach(c => {
      const target = c.getAttribute('data-target');
      const suffix = c.getAttribute('data-suffix') || '';
      c.innerText = parseInt(target, 10).toLocaleString() + suffix;
    });
  }

  // 8. FAQ Accordion Interaction
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close other active FAQs in the same section
      const siblingItems = item.parentElement.querySelectorAll('.faq-item');
      siblingItems.forEach(sib => {
        if (sib !== item && sib.classList.contains('active')) {
          sib.classList.remove('active');
          sib.querySelector('.faq-content').style.height = '0px';
        }
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.height = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.height = '0px';
      }
    });
  });

  // 9. Species Gallery Modal Popup (for marine-life.html)
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('speciesModal');
  if (galleryCards.length > 0 && modal) {
    const modalImg = modal.querySelector('.modal-img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalTag = modal.querySelector('.modal-tag');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalClose = modal.querySelector('.modal-close');

    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const bgUrl = card.querySelector('.gallery-card-img').style.backgroundImage;
        const title = card.getAttribute('data-title');
        const tag = card.getAttribute('data-tag');
        const desc = card.getAttribute('data-desc');

        if (modalImg) modalImg.style.backgroundImage = bgUrl;
        if (modalTitle) modalTitle.innerText = title;
        if (modalTag) modalTag.innerText = tag;
        if (modalDesc) modalDesc.innerText = desc;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // 10. Progress Bars Animation (for conservation-projects.html)
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if ('IntersectionObserver' in window && progressBars.length > 0) {
    const progressObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-width');
          el.style.width = target + '%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    progressBars.forEach(bar => progressObserver.observe(bar));
  } else {
    // Fallback
    progressBars.forEach(b => {
      b.style.width = b.getAttribute('data-width') + '%';
    });
  }

  // 11. Form Submissions Redirections (Except login and signup)
  document.querySelectorAll('form').forEach(form => {
    if (form.id === 'loginForm' || form.id === 'signupForm') return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.checkValidity()) {
        window.location.href = '404.html';
      } else {
        form.reportValidity();
      }
    });
  });

  // 12. Floating Bubbles Generator
  const bubbleContainer = document.getElementById('bubble-container');
  if (bubbleContainer) {
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      
      const size = Math.random() * 20 + 8; // Size: 8px to 28px
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      
      bubble.style.left = Math.random() * 100 + '%';
      
      // Delay and duration
      const duration = Math.random() * 8 + 8; // 8s to 16s
      bubble.style.animationDuration = duration + 's';
      
      bubbleContainer.appendChild(bubble);
      
      // Remove bubble after animation ends
      setTimeout(() => {
        bubble.remove();
      }, duration * 1000);
    };

    // Create a bubble every 600ms
    setInterval(createBubble, 600);
  }

  // 13. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 14. Toast Notification Manager
  window.showToast = function(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'glass-light';
    toast.style.color = '#E0F2FE';
    toast.style.border = '1px solid rgba(0, 180, 216, 0.4)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '30px';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.style.transform = 'translateY(50px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.innerHTML = `<i data-lucide="bell" style="width:16px; height:16px; stroke:#00B4D8;"></i> ${message}`;

    container.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  // 15. Dashboard Drawer Toggles
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (mobileMenuToggle && sidebar) {
    const openSidebar = () => {
      sidebar.classList.add('active');
      if (sidebarOverlay) sidebarOverlay.classList.add('active');
    };

    const closeSidebar = () => {
      sidebar.classList.remove('active');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    };

    mobileMenuToggle.addEventListener('click', openSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // 16. Dynamic Navbar Login/Dashboard Button
  const navAuthItem = document.getElementById('navAuthItem');
  if (navAuthItem) {
    if (localStorage.getItem('stackly_logged_in') === 'true') {
      const role = localStorage.getItem('stackly_user_role');
      const dashboardUrl = role === 'seller' ? './sellerdashboard.html' : './customerdashboard.html';
      navAuthItem.innerHTML = `<a href="${dashboardUrl}" class="btn nav-btn" style="background: linear-gradient(135deg, var(--sea-green), var(--accent));">Login</a>`;
    } else {
      navAuthItem.innerHTML = `<a href="./login.html" class="btn nav-btn">Login</a>`;
    }
  }

  // 17. Letter Reveal Animation Splitter
  window.initLetterReveal = function(element) {
    if (!element) return;
    const text = element.textContent.trim();
    element.innerHTML = '';
    element.classList.add('letter-reveal-anim');
    
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${index * 30}ms`;
      element.appendChild(span);
    });
    
    setTimeout(() => {
      element.classList.add('active');
    }, 100);
  };

  // 18. Scramble Text Effect
  window.scrambleText = function(element, duration = 1200) {
    if (!element) return;
    const originalText = element.getAttribute('data-scramble') || element.textContent.trim();
    element.setAttribute('data-scramble', originalText);
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let start = null;
    
    function randomChar() {
      return chars[Math.floor(Math.random() * chars.length)];
    }
    
    function update(timestamp) {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      
      if (progress < 1) {
        const length = originalText.length;
        let scrambled = '';
        for (let i = 0; i < length; i++) {
          if (originalText[i] === ' ') {
            scrambled += ' ';
          } else if (i < length * progress) {
            scrambled += originalText[i];
          } else {
            scrambled += randomChar();
          }
        }
        element.textContent = scrambled;
        requestAnimationFrame(update);
      } else {
        element.textContent = originalText;
      }
    }
    requestAnimationFrame(update);
  };

  // Trigger animations on load
  document.querySelectorAll('.letter-reveal-trigger').forEach(el => {
    window.initLetterReveal(el);
  });

  document.querySelectorAll('.scramble-trigger').forEach(el => {
    window.scrambleText(el);
  });
});
