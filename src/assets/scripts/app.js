import "invokers-polyfill";
import "./share.js"; 
// import "../../../node_modules/@11ty/is-land/is-land.js"; 
import Konami from 'konami';
import { initializeCarbonComponents } from './components/carbon-components.js';

const desktopWidth = 992;

export const externalLinks = () => {
  document.querySelectorAll('a[rel="external"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      window.open(link.href);
    });
  });
};

export const smoothScroll = () => {
  document.querySelectorAll('.scroll[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (link.getAttribute('href') !== '#') {
        document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
};

export const toggleNav = (button, elem, masthead) => {
  const toggleButton = document.querySelector(button);
  if (!toggleButton) return;
  const menu = document.querySelector(elem);
  const header = document.querySelector(masthead);

  window.subscribers = [];
  const defaultState = { status: 'closed', enabled: false };
  const state = new Proxy(defaultState, {
    set(state, key, value) {
      const oldState = { ...state };
      state[key] = value;
      window.subscribers.forEach(callback => callback(state, oldState));
      return state;
    }
  });

  const observer = new ResizeObserver(([{ contentRect, target }]) => {
    state.enabled = contentRect.width <= desktopWidth;
    target.setAttribute('data-enabled', state.enabled);
  });
  observer.observe(header);

  toggleButton.addEventListener('click', () => {
    const open = JSON.parse(toggleButton.getAttribute('aria-expanded'));
    state.status = open ? 'closed' : 'open';
    toggleButton.setAttribute('aria-expanded', !open);
    menu.setAttribute('status', state.status);
    header.classList.toggle('masthead-is-open');
    document.body.classList.toggle('nav-open');
    document.documentElement.style.setProperty('--submenu-offset', menu.offsetHeight + header.offsetHeight + 'px');
  });

  window.addEventListener('keydown', event => {
    if (!event.key.includes('Escape')) return;
    toggleButton.setAttribute('aria-expanded', 'false');
    header.classList.remove('masthead-is-open');
    document.body.classList.remove('nav-open');
    state.status = 'closed';
    menu.setAttribute('status', state.status);
  });
};

export const toggleTheme = () => {
  const themeSwitcher = document.getElementById("theme-switcher");
  const switchTheme = theme => {
    if (theme === "light") {
      document.documentElement.dataset.colorScheme = "light";
      localStorage.setItem("mode", "light");
      document.getElementById("theme-light").checked = true;
    } else if (theme === "dark") {
      document.documentElement.dataset.colorScheme = "dark";
      localStorage.setItem("mode", "dark");
      document.getElementById("theme-dark").checked = true;
    } else {
      delete document.documentElement.dataset.colorScheme;
      localStorage.removeItem("mode");
      document.getElementById("theme-light").checked = true;
    }
  };
  themeSwitcher.classList.add("visible");
  switchTheme(localStorage.getItem("mode"));
  document.getElementById("theme-light").addEventListener("click", () => switchTheme("light"));
  document.getElementById("theme-dark").addEventListener("click", () => switchTheme("dark"));
};

export const subMenu = (elem, masthead) => {
  const menu = document.querySelector(elem);
  if (!menu) return;
  const header = document.querySelector(masthead);
  const submenus = menu.querySelectorAll('.menu-item-has-children');

  const observer = new ResizeObserver(([{ contentRect }]) => {
    submenus.forEach(el => {
      const open = JSON.parse(el.querySelector('a').getAttribute('aria-expanded'));
      if (contentRect.width >= desktopWidth) {
        el.addEventListener("mouseenter", () => {
          document.querySelectorAll('.menu-open').forEach(nav => {
            if (nav !== el) {
              nav.classList.remove('menu-open');
              nav.querySelector('a').setAttribute('aria-expanded', 'false');
            }
          });
          el.querySelector('a').setAttribute('aria-expanded', !open);
          el.classList.toggle('menu-open');
          el.querySelector('.sub-menu').removeAttribute('hidden');
          document.body.classList.add('masthead-expanded');
        });
        el.addEventListener("mouseleave", () => {
          el.querySelector('a').setAttribute('aria-expanded', 'false');
          el.classList.remove('menu-open');
          el.querySelector('.sub-menu').setAttribute('hidden', '');
          document.body.classList.remove('masthead-expanded');
        });
        window.addEventListener('keydown', event => {
          if (!event.key.includes('Escape')) return;
          document.body.classList.remove('masthead-expanded');
          el.querySelector('a').setAttribute('aria-expanded', 'false');
          el.classList.remove('menu-open');
          el.querySelector('.sub-menu').setAttribute('hidden', '');
        });
      }
    });
  });
  observer.observe(header);

  submenus.forEach(el => {
    const activatingA = el.querySelector('a');
    const btn = document.createElement('button');
    btn.className = "button-show-subnav";
    btn.innerHTML = `<span>show sub menu for "${activatingA.text}"</span>`;
    activatingA.insertAdjacentElement('afterend', btn);

    btn.addEventListener("click", event => {
      submenus.forEach(sub => {
        if (sub.classList.contains('current-menu-item') || sub.classList.contains('current-menu-ancestor')) {
          sub.classList.remove('current-menu-item', 'current-menu-ancestor');
        }
      });
      el.classList.toggle('menu-open');
      document.querySelectorAll('.menu-open').forEach(nav => {
        if (nav !== el) nav.classList.remove('menu-open');
      });
      if (el.classList.contains('menu-open')) {
        el.querySelector('a').setAttribute('aria-expanded', "true");
        btn.setAttribute('aria-expanded', "true");
        el.querySelector('.sub-menu').removeAttribute('hidden');
      } else {
        el.querySelector('a').setAttribute('aria-expanded', "false");
        btn.setAttribute('aria-expanded', "false");
        el.querySelector('.sub-menu').setAttribute('hidden', '');
      }
      event.preventDefault();
    });
  });
};

export const cardClick = elem => {
  document.querySelectorAll(elem).forEach(card => {
    const link = card.querySelector('.dgwltd-card__link');
    if (!link) return;
    card.addEventListener("click", event => {
      if (!window.getSelection().toString()) {
        window.location = link.href;
      }
    });
  });
};

export const konami = elem => {
  const easterEgg = new Konami("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
};

export class TextareaHandler {
  constructor(elem) {
    document.querySelectorAll(elem).forEach(textarea => {
      textarea.setAttribute('rows', 4);
      this.update(textarea);
    });
  }
  isScrolling(textarea) {
    return textarea.scrollHeight > textarea.clientHeight;
  }
  grow(textarea) {
    let clientHeight = textarea.clientHeight;
    let rows = this.rows(textarea);
    while (this.isScrolling(textarea)) {
      rows++;
      textarea.rows = rows;
      const newClientHeight = textarea.clientHeight;
      if (newClientHeight === clientHeight) break;
      clientHeight = newClientHeight;
    }
  }
  shrink(textarea) {
    let clientHeight = textarea.clientHeight;
    const minRows = parseInt(textarea.dataset.minRows);
    let rows = this.rows(textarea);
    while (!this.isScrolling(textarea) && rows > minRows) {
      rows--;
      textarea.rows = Math.max(rows, minRows);
      if (textarea.clientHeight === clientHeight) break;
      if (this.isScrolling(textarea)) {
        this.grow(textarea);
        break;
      }
    }
  }
  update(textarea) {
    if (this.isScrolling(textarea)) {
      this.grow(textarea);
    } else {
      this.shrink(textarea);
    }
  }
  rows(textarea) {
    return textarea.rows || parseInt(textarea.dataset.minRows);
  }
}

// Init
// import { externalLinks, smoothScroll } from './app.js';

// On load
document.addEventListener("DOMContentLoaded", () => {
  externalLinks();
  smoothScroll();
  toggleNav('#nav-toggle', '#nav-primary', '#masthead');
  toggleTheme();
  subMenu('#nav-primary', '#masthead');
  cardClick('.dgwltd-card');
  new TextareaHandler('textarea');
  konami();
  // initializeCarbonComponents();
  
});