// Подключение функционала "Чертоги Фрилансера"
import stickySidebar from "sticky-sidebar";
import { bodyLock, bodyLockToggle, bodyUnlock, debounce, getDigFromString, getRandomString, isMobile } from "./functions.js";
// Подключение списка активных модулей
import { mhzModules } from "./modules.js";
import PincodeInput from 'pincode-input'
import { formValidate } from "./forms/forms.js";
import Inputmask from "inputmask";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
// import 'pincode-input/dist/pincode-input.min.css'

document.addEventListener('DOMContentLoaded', () => {
  const headerSearch = document.querySelector('[data-header-search]');
  if (headerSearch) {
    headerSearchActions(headerSearch);
  }

  const headerCatalog = document.querySelector('[data-catalog-header]');
  if (headerCatalog) {
    headerCatalogActions(headerCatalog);
  }

  const pininputs = document.querySelectorAll('[class*="__pininput"]');
  if (pininputs.length) {
    pininputsInit(pininputs)
  }

  setMaxHeight('.categories__slide span');
  setMaxHeight('.chapters__item span');
  setMaxHeight('.product-slide__name', '.productslider');

  const cartFull = document.querySelector('[data-full-cart]');
  if (cartFull) {
    checkCartClearBtnVisible(cartFull);
    mhzFullCartActions(cartFull)
  }

  const comparsionParent = document.querySelector('[data-comparsion]');
  if (comparsionParent) {
    new MhzComparsion(comparsionParent)
  }

  setProductsButtons();

  document.oncontextmenu = (e) => disablecontext(e, 'Вы не можете сохранять изображения с этого сайта.')
})

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-header-catalog-btn]')) {
    document.documentElement.classList.toggle('catalog-open');
    bodyLockToggle();
  }
  if (e.target.closest('[data-filter-button]')) {
    document.documentElement.classList.toggle('filters-open');
    bodyLockToggle(10);
    if (!document.querySelector('.filters-productlisting__backdrop')) {
      const div = document.createElement('div');
      div.classList.add('filters-productlisting__backdrop');
      div.setAttribute('data-filter-button', '');
      document.body.appendChild(div);
    }
  }

  if (e.target.closest('.menu-top-header__link')) {
    onTopHeaderLinkClick(e.target.closest('.menu-top-header__link'), e);
  }

  if (e.target.closest('.menu-top-header__back')) {
    const items = document.querySelectorAll('.menu-top-header__item');
    if (items.length) {
      items.forEach(item => item.classList.remove('_active'));
    }
  }
  if (e.target.closest('.catalog-header__back')) {
    const items = document.querySelectorAll('.catalog-header__content');
    const links = document.querySelectorAll('.catalog-header__link');
    if (items.length) {
      items.forEach(item => {
        item.classList.remove('_active');
        item.hidden = true;
      });
    }
    if (links.length) {
      links.forEach(link => link.classList.remove('_active'))
    }
  }

  // const productAction = e.target.closest('[data-comparsion-btn]') || e.target.closest('[data-fav-btn]');
  // if (productAction) {
  //   e.preventDefault();
  //   productAction.classList.toggle('_active')
  // }

  if (e.target.closest('[data-fav-btn]')) {
    favComparsionBtnAction(e.target.closest('[data-fav-btn]'), 'favorite')
  }
  if (e.target.closest('[data-comparsion-btn]')) {
    favComparsionBtnAction(e.target.closest('[data-comparsion-btn]'), 'comparsion')
  }

  if (e.target.closest('[data-add2basket-btn]')) {
    onAddToBasketClick(e.target.closest('[data-add2basket-btn]'))
  }

  if (e.target.closest('[data-full-cart-clear]')) {
    delCheckedFromCart()
  }

  checkCatalog(e)
})

document.addEventListener('formSent', (e) => {
  const { form, responseResult, formData } = e.detail;

  if (form.closest('.authPopup')) {
    authActions(form, responseResult, formData);
  }

  let jsonResponse = null;
  try {
    jsonResponse = typeof responseResult === 'string' ? JSON.parse(responseResult) : responseResult;
  } catch (error) {
    console.warn(error);
  }

  if (jsonResponse) {
    handleResponsePopup(jsonResponse);
  }
})

document.addEventListener('watcherCallback', (e) => {
  const { target, isIntersecting } = e.detail.entry;

  if (target.closest('.sidebar-cartfull')) {
    const cartFixed = document.querySelector('.cartfull__fixed');
    if (!cartFixed) return;

    isIntersecting ? cartFixed.classList.add('_hide') : cartFixed.classList.remove('_hide')
  }
})

document.addEventListener('change', (e) => {
  if (e.target.closest('.cartfull [data-services]')) {
    onBasketServicesChange(e.target.closest('.cartfull [data-services]'), e.target)
  }

  if (e.target.closest('#checkout-cartfull [data-basket-onchange]')) {
    onBasketChange()
  }
})

window.addEventListener('load', () => {
  if (document.querySelector('[data-filters]')) {
    setFiltersPosition(document.querySelector('[data-filters]'))
  }

  if (document.querySelector('.sidebar-productfull')) {
    const sidebar = new stickySidebar(document.querySelector('.sidebar-productfull'), {
      innerWrapperSelector: '.sidebar-productfull__inner',
      containerSelector: '.productfull__container',
      bottomSpacing: 30,
      topSpacing: 30,
      minWidth: 992
    })
  }
})

window.addEventListener('scroll', (e) => {
  document.body.style.setProperty('--scrollY', `${window.scrollY}px`);
})

window.addEventListener('resize', () => {
  setMaxHeight('.categories__slide span');
  setMaxHeight('.product-slide__name', '.productslider');
})


function headerSearchActions(headerSearch) {
  const input = headerSearch.querySelector('[data-header-search-input]');
  const dropdown = document.querySelector('[data-header-search-dropdown]');

  if (!input||!dropdown) return;

  input.addEventListener('focusin', () => {
    dropdown.hidden = false;
  })
  input.addEventListener('blur', () => {
    setTimeout(() => {
      dropdown.hidden = true;
    }, 0);
  })
}

function headerCatalogActions(headerCatalog) {
  const links = headerCatalog.querySelectorAll('[data-catalog-header-link]');
  const contents = headerCatalog.querySelectorAll('[data-catalog-header-content]');
  if (!links.length||!contents.length) return;

  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const id = link.getAttribute('data-catalog-header-link');
      links.forEach(link => link.getAttribute('data-catalog-header-link') == id ? link.classList.add('_active') : link.classList.remove('_active'))
      contents.forEach(content => content.hidden = content.getAttribute('data-catalog-header-content') != id)
    })
    link.addEventListener('click', (e) => {
      const menuBody = link.closest('.menu__body');

      if (menuBody) {
        menuBody.scrollTo(0, 0)
      }

      if (isMobile.any()) {
        e.preventDefault();
      }
      const id = link.getAttribute('data-catalog-header-link');
      links.forEach(link => link.getAttribute('data-catalog-header-link') == id ? link.classList.add('_active') : link.classList.remove('_active'))
      contents.forEach(content => {
        if (content.getAttribute('data-catalog-header-content') == id) {
          content.hidden = false;
          content.classList.add('_active');
        } else {
          content.hidden = true;
          content.classList.remove('_active');
        }
      })
    })
  });
}

function onTopHeaderLinkClick(target, event) {
  const item = target.closest('.menu-top-header__item');
  const dropdown = item?.querySelector('.menu-top-header__dropdown');
  const menuBody = target.closest('.menu__body');

  if (!dropdown) return;

  event.preventDefault();

  if (!dropdown.innerHTML.includes(target.textContent.trim())) {
    const clone = target.cloneNode(true);
    clone.removeAttribute('class');
    clone.classList.add('menu-top-header__sublink');
    dropdown.append(clone)
  }

  item.classList.add('_active');

  if (menuBody) {
    menuBody.scrollTo(0, 0)
  }
}

function checkCatalog(e) {
  const catalogTarget = e.target.closest('[data-catalog-header]')
  const catalogBtnTarget = e.target.closest('[data-header-catalog-btn]')

  if (catalogTarget||catalogBtnTarget) return;

  document.documentElement.classList.remove('catalog-open');
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock();
  }
}

function setMaxHeight(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.removeProperty('--min-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.max(...heights);
  
    els.forEach(el => el.style.setProperty('--min-height', `${max}px`));
  })
}

function setMinHeight(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.remoiveProperty('--max-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.min(...heights);
  
    els.forEach(el => el.style.setProperty('--max-height', `${max}px`));
  })
}

function pininputsInit(pininputs) {
  pininputs.forEach(pininput => {
    const className = `pininput_${getRandomString(16)}`;
    pininput.classList.add(className)
    pininput.pininput = new PincodeInput(`.${className}`, {
      count: 4,
      secure: false,
      onInput: (value) => {
        onPinInputInput(value, pininput)
      }
    })
  })
}

function onPinInputInput(value, input) {
  const authPinElement = input?.closest('form')?.querySelector('[name="auth_pin"]');
  if (!authPinElement) return;

  authPinElement.value = value;
}

function setFiltersPosition(filtersEl) {
  const sidebar = new stickySidebar(filtersEl, {
    innerWrapperSelector: '.filters-productlisting__body',
    bottomSpacing: 30,
    topSpacing: 30,
    minWidth: 992
  })
}

window.mhzFullCartActions = (cartFull) =>  {
  const oneCheckboxes = cartFull?.querySelectorAll('[data-full-cart-checkone]');
  const allCheckbox = cartFull?.querySelector('[data-full-cart-checkall]');

  if (!oneCheckboxes?.length || !allCheckbox) return

  allCheckbox.addEventListener('change', () => {
    oneCheckboxes.forEach(oneCheckbox => oneCheckbox.checked = allCheckbox.checked);
    checkCartClearBtnVisible(cartFull);
  })

  cartFull.addEventListener('change', (e) => {
    checkCartClearBtnVisible(cartFull);
    const array = [...oneCheckboxes];
    if (!array.includes(e.target)) return;

    for (let index = 0; index < array.length; index++) {
      const oneCheckbox = array[index];
      if (!oneCheckbox.checked) {
        allCheckbox.checked = false;
        return
      }
    }

    allCheckbox.checked = true;
  })
}

window.checkCartClearBtnVisible = (cartFull = document.querySelector('[data-full-cart]')) => {
  if (!cartFull) return;
  const btn = document.querySelector('[data-full-cart-clear]');
  if (!btn) return;

  const oneCheckboxes = cartFull?.querySelectorAll('[data-full-cart-checkone]:checked');
  btn.hidden = oneCheckboxes.length <= 0;
}

class MhzComparsion {
  parent = null;
  md1 = matchMedia('(width < 1280px)');
  md3 = matchMedia('(width < 680px)');
  needArrows = false;

  constructor(parent) {
    if (!parent) return;

    this.parent = parent;
    this.init();
  }

  init() {
    this.getEls();

    if (!this.items.length) return;
    this.createFlyHead();
    this.checkArrows();
    this.checkFlyHead();
    this.setHandlers();
  }

  getEls() {
    this.head = this.parent.querySelector('[data-comparsion-head]');
    this.body = this.parent.querySelector('[data-comparsion-body]');
    this.items = this.parent.querySelectorAll('[data-comparsion-item]');
    this.addEl = this.parent.querySelector('[data-comparsion-add]');
  }

  createFlyHead() {
    this.flyHead = document.querySelector('[data-comparsion-flyhead]');
    if (!this.flyHead) {
      this.flyHead = document.createElement('div');
      this.flyHead.className = 'comparsion__flyhead flyhead-comparsion _hide';
      this.flyHead.setAttribute('data-comparsion-flyhead', '')
    }

    let itemsHtml = this.createFlyHeadItems();

    this.flyAdd = document.createElement('div');
    this.flyAdd.className = 'flyhead-comparsion__add';
    this.flyAdd.setAttribute('data-comparsion-fly-add', '');
    this.flyAdd.innerHTML = `<i>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 26C5.82029 26 0 20.1796 0 13C0 5.82029 5.82029 0 13 0C20.1796 0 26 5.82029 26 13C26 20.1796 20.1796 26 13 26ZM11.7 11.7H6.5V14.3H11.7V19.5H14.3V14.3H19.5V11.7H14.3V6.5H11.7V11.7Z" fill="#0DBC2E"/>
          </svg>
        </i>
        <p>
          Добавить товар <br> к сравнению
        </p>`

    itemsHtml += this.flyAdd.outerHTML;

    this.flyHead.innerHTML = `<div class="flyhead-comparsion__container">${itemsHtml}</div>`;

    document.body.append(this.flyHead);

    this.flyItems = document.querySelectorAll('[data-comparsion-flyhead-item]');
    this.flyAdd = document.querySelector('[data-comparsion-fly-add]');
  }

  createFlyHeadItems() {
    let html = '';

    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      html += this.createFlyHeadItem(item);
    }

    return html;
  }

  createFlyHeadItem(item) {
    const attr = item.getAttribute('data-comparsion-item');
    const img = item.querySelector('.product-slide__image img').src;
    const chapter = item.querySelector('.product-slide__chapter:not([data-comparsion-counter])').innerHTML;
    const counter = item.querySelector('.product-slide__chapter[data-comparsion-counter]').innerHTML
    const name = item.querySelector('.product-slide__name').innerHTML;
    const price = item.querySelector('.product-slide__price').innerHTML;
    const oldPrice = item.querySelector('.product-slide__oldprice')?.innerHTML || null;
    const buySrc = item.querySelector('.product-slide__button:not([style])').href;
    const delSrc = item.querySelector('[data-comparsion-delete]').href;
    const favSrc = item.querySelector('[data-fav-btn]').href;
    
    
    const answer = `<div class="flyhead-comparsion__item" data-comparsion-flyhead-item="${attr}">
          <div class="flyhead-comparsion__image">
            <img src="${img}" alt="${name}">
          </div>
          <div class="flyhead-comparsion__arrow flyhead-comparsion__arrow_prev" data-comparsion-item-arrow="prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.9388 11.89L15.8885 16.8397L14.4743 18.2539L8.11035 11.89L14.4743 5.526L15.8885 6.9402L10.9388 11.89Z" fill="#666666"/>
            </svg>
          </div>
          <div class="flyhead-comparsion__arrow flyhead-comparsion__arrow_next" data-comparsion-item-arrow="next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.0603 11.8873L8.11047 6.93765L9.52467 5.52344L15.8887 11.8873L9.52467 18.2513L8.11047 16.8371L13.0603 11.8873Z" fill="#666666"/>
            </svg>
          </div>
          <div class="flyhead-comparsion__chapter" data-comparsion-counter >${counter}</div>
          <div class="flyhead-comparsion__chapter">${chapter}</div>
          <div class="flyhead-comparsion__name">${name}</div>
          <div class="flyhead-comparsion__prices">
            <div class="flyhead-comparsion__price">${price}</div>
            ${oldPrice ? `<div class="flyhead-comparsion__oldprice">${oldPrice}</div>` : ''}
          </div>
          <div class="flyhead-comparsion__actions">
            <a href="${buySrc}" class="flyhead-comparsion__button">В корзину</a>
            <a href="${favSrc}" class="flyhead-comparsion__action">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0008 3.77378C11.9583 2.01667 14.9833 2.075 16.8688 3.96447C18.7544 5.85393 18.8191 8.86417 17.0655 10.8275L9.99987 17.9042L2.93444 10.8275C1.18083 8.86417 1.24638 5.84918 3.13109 3.96447C5.01793 2.07763 8.03762 2.01406 10.0008 3.77378ZM15.6891 5.14175C14.4399 3.88995 12.423 3.83918 11.1141 5.01406L10.0015 6.0127L8.88837 5.01484C7.57577 3.83831 5.56251 3.89007 4.3096 5.14298C3.06815 6.38443 3.00582 8.37275 4.1499 9.686L9.99987 15.5453L15.85 9.686C16.9945 8.37225 16.9325 6.38771 15.6891 5.14175Z" fill="#212529"></path>
              </svg>
            </a>
            <a href="${delSrc}" class="flyhead-comparsion__action">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1666 5.0013H18.3333V6.66797H16.6666V17.5013C16.6666 17.9616 16.2935 18.3346 15.8333 18.3346H4.16663C3.70639 18.3346 3.33329 17.9616 3.33329 17.5013V6.66797H1.66663V5.0013H5.83329V2.5013C5.83329 2.04107 6.20639 1.66797 6.66663 1.66797H13.3333C13.7935 1.66797 14.1666 2.04107 14.1666 2.5013V5.0013ZM15 6.66797H4.99996V16.668H15V6.66797ZM11.1785 11.6677L12.6516 13.1409L11.4731 14.3194L9.99996 12.8462L8.52679 14.3194L7.34831 13.1409L8.82146 11.6677L7.34831 10.1946L8.52679 9.01613L9.99996 10.4892L11.4731 9.01613L12.6516 10.1946L11.1785 11.6677ZM7.49996 3.33464V5.0013H12.5V3.33464H7.49996Z" fill="#212529"></path>
              </svg>
            </a>
          </div>
        </div>\n`;

    return answer
  }

  checkArrows() {
    this.colsCount = 4;
    if (this.md1.matches) this.colsCount = 3;
    if (this.md3.matches) this.colsCount = 2;

    if (this.items.length > this.colsCount) {
      this.addEl ? this.addEl.hidden = true : null;
      this.flyAdd ? this.flyAdd.hidden = true : null;
      this.showArrows();
    } else if (this.items.length < this.colsCount) {
      this.addEl ? this.addEl.hidden = false : null;
      this.flyAdd ? this.flyAdd.hidden = false : null;
      this.hideArrows();
    } else {
      this.addEl ? this.addEl.hidden = true : null;
      this.flyAdd ? this.flyAdd.hidden = true : null;
      this.hideArrows();
    }
  }

  showArrows() {
    this.needArrows = true;
    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      if (index >= this.colsCount) {
        this.hideItem(item);
      } else {
        this.showItem(item);
      }
    }

    const arrows = document.querySelectorAll('[data-comparsion-item-arrow]');
    const counters = document.querySelectorAll('[data-comparsion-counter]');

    if (!arrows.length) return;
    arrows.forEach(e => e.hidden = false);

    if (!counters.length) return;
    counters.forEach(e => e.hidden = false);
  }

  hideArrows() {
    this.needArrows = false;
    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      item.hidden = false;
    }

    const arrows = document.querySelectorAll('[data-comparsion-item-arrow]');
    const counters = document.querySelectorAll('[data-comparsion-counter]');

    if (!arrows.length) return;
    arrows.forEach(e => e.hidden = true);

    if (!counters.length) return;
    counters.forEach(e => e.hidden = true);
  }

  hideItem(item) {
    const attr = item.getAttribute('data-comparsion-item');
    if (!attr) return;

    const cols = document.querySelectorAll(`[data-comparsion-column="${attr}"]`);
    const flyItem = document.querySelector(`[data-comparsion-flyhead-item="${attr}"]`);

    if (flyItem) flyItem.hidden = true;

    if (cols.length) {
      cols.forEach(col => col.hidden = true);
    }

    item.hidden = true;
  }

  showItem(item) {
    const attr = item.getAttribute('data-comparsion-item');
    if (!attr) return;

    const cols = document.querySelectorAll(`[data-comparsion-column="${attr}"]`);
    const flyItem = document.querySelector(`[data-comparsion-flyhead-item="${attr}"]`);

    if (flyItem) flyItem.hidden = false;

    if (cols.length) {
      cols.forEach(col => col.hidden = false);
    }

    item.hidden = false;
  }

  checkFlyHead() {
    const isHeadVisible = this.head.classList.contains('_watcher-view');
    const isBodyVisible = this.body.classList.contains('_watcher-view');

    if (!isHeadVisible&&isBodyVisible) {
      this.flyHead.classList.remove('_hide')
    } else {
      this.flyHead.classList.add('_hide')
    }
  }

  setHandlers() {
    document.addEventListener('watcherCallback', () => setTimeout(() => {
      this.checkFlyHead()
    }, 0))

    document.addEventListener('click', this.onClick.bind(this))
  }

  onClick(e) {
    const arrow = e.target.closest('[data-comparsion-item-arrow]');
    if (!arrow) return;

    let item = arrow.closest('[data-comparsion-item]');
    const flyItem = arrow.closest('[data-comparsion-flyhead-item]');
    const direction = arrow.getAttribute('data-comparsion-item-arrow')

    if (!item&&!flyItem) return;

    if (flyItem) {
      const attr = flyItem.getAttribute('data-comparsion-flyhead-item');
      item = this.parent.querySelector(`[data-comparsion-item="${attr}"]`)
    }
    
    if(!item) return;
    const itemsArr = [...this.items];

    const currentIndex = itemsArr.findIndex(el => el === item);
    if (currentIndex < 0) return;

    switch (direction) {
      case 'prev':
        for (let index = currentIndex-1; index >= 0; index--) {
          const itm = itemsArr[index];
          if (!itm.hidden) continue;
          this.hideItem(item);
          this.showItem(itm);
          break;
        }
        break;
      case 'next':
        for (let index = currentIndex+1; index < itemsArr.length; index++) {
          const itm = itemsArr[index];
          if (!itm.hidden) continue;
          this.hideItem(item);
          this.showItem(itm);
          break;
        }
        break;
    }
  }
}

function authActions(form, responseResult, formData) {
  if (!form.closest('.authPopup')) return;

  try {
    responseResult = JSON.parse(responseResult);
  } catch (error) {
    console.warn(error);
    return;
  }

  const { STATUS: status, RELOAD: reload, DATA: data } = responseResult;
  if (!status) {
    if (reload) location.reload()
    return;
  }

  if (form.closest('#phoneAuthPopup')) onPhoneAuthSubmit(data, formData)
  if (form.closest('#phonePinPopup')) onPhonePinSubmit(status, reload)
  if (form.closest('#registerPopup')) onRegisterSubmit(data, status, reload)
  if (form.closest('#emailAuthPopup')) onEmailAuthSubmit(data, status, reload)
  if (form.closest('#restorePassPopup')) onRestorePassSubmit(formData)
}

function onPhoneAuthSubmit(data, formData) {
  const pinPopup = document.querySelector('#phonePinPopup');
  if (!pinPopup) return;

  const { key, phone } = data;
  const sendedPhone = formData.get('phone');

  const subtitleEl = pinPopup.querySelector('.authPopup__subtitle');
  if (subtitleEl) {
    subtitleEl.innerHTML = `На ваш номер ${sendedPhone} поступил звонок. Укажите последние 4 цифры`
  }

  const autKeyInput = pinPopup.querySelector('[name="auth_key"]');
  if (autKeyInput) {
    autKeyInput.value = key;
  }

  const phoneInput = pinPopup.querySelector('[name="phone"]');
  if (phoneInput) {
    phoneInput.value = phone;
  }

  mhzModules.popup.open('#phonePinPopup');
}

function onPhonePinSubmit(status, reload) {
  if (!status) {
    if (reload) location.reload();
    return;
  }
  const successSelector = '#registerSuccessPopup';
  const successPopup = document.querySelector(successSelector);
  if (successPopup) {
    const titleEl = successPopup.querySelector('.authPopup__title');
    const textEl = successPopup.querySelector('.authPopup__text');

    if (titleEl) titleEl.innerHTML = 'Вход'
    if (textEl) textEl.innerHTML = 'Вы успешно авторизованы'
  }

  mhzModules.popup.open(successSelector);
  if (reload) {
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}

function onRegisterSubmit(data, status, reload) {
  if (!status) {
    if (reload) location.reload();
    return;
  }

  const successSelector = `#${data.popup || 'registerSuccessPopup'}`;
  const successPopup = document.querySelector(successSelector);
  if (successPopup) {
    const titleEl = successPopup.querySelector('.authPopup__title');
    const textEl = successPopup.querySelector('.authPopup__text');

    if (titleEl) titleEl.innerHTML = 'Регистрация'
    if (textEl) textEl.innerHTML = data.TEXT || 'Спасибо за регистрацию';
  }

  mhzModules.popup.open(successSelector);
  if (reload) {
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}

function onEmailAuthSubmit(data, status, reload) {
  if (!status) {
    if (reload) location.reload();
    return;
  }
  const successSelector = '#registerSuccessPopup';
  const successPopup = document.querySelector(successSelector);
  if (successPopup) {
    const titleEl = successPopup.querySelector('.authPopup__title');
    const textEl = successPopup.querySelector('.authPopup__text');

    if (titleEl) titleEl.innerHTML = 'Вход'
    if (textEl) textEl.innerHTML = 'Вы успешно авторизованы'
  }

  mhzModules.popup.open(successSelector);
  if (reload) {
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}

function onRestorePassSubmit(formData) {
  const successSelector = '#restorePassSuccessPopup';
  const email = formData.get('EMAIL')

  const textEl = document.querySelector(`${successSelector} .authPopup__text`);
  if (textEl) textEl.innerHTML = `Ссылка на восстановления пароля была направлена на Ваш почтовый ящик <strong>${email}</strong>`;

  mhzModules.popup.open(successSelector);
}

function handleResponsePopup(response) {
  if (!mhzModules?.popup) return;

  const data = response?.DATA || {};
  const popupId = data.popup;
  if (!popupId) return;

  const selector = `#${popupId}`;
  const popup = document.querySelector(selector);
  if (!popup) return;

  const text =
    data.TEXT ||
    response.MESSAGE ||
    '';

  if (text) {
    const textEl = popup.querySelector('.authPopup__text') || popup.querySelector('[data-popup-text]');
    if (textEl) {
      textEl.innerHTML = text;
    }
  }

  mhzModules.popup.open(selector);
}


async function favComparsionBtnAction(target, actionType) {
  const productId = target?.closest('[data-product_id]')?.getAttribute('data-product_id');
  if (!productId) return;

  const type = target.classList.contains('_active') ? 'REMOVE' : 'ADD';

  let url;

  switch (actionType) {
    case 'favorite':
      url = window.urls?.favorites || '/ajax/favorites_megamebel.php';
      break;
    case 'comparsion':
      url = window.urls?.comparsion || '/ajax/comparsion_megamebel.php';
      break;
  }
  if (!url) return;
  target.classList.add('_pen');
  const body = new FormData();

  if (window.BX) body.set('sessid', BX.bitrix_sessid());
  body.set('ID', productId);
  body.set('TYPE', type);

  await fetch(url, {
    method: 'POST',
    body,
  })
    .then(res => res.json())
    .then(res => {
      if (!res.STATUS) return;

      switch (actionType) {
        case 'favorite':
          window.favorites = window.favorites || [];
          if (type === 'ADD') {
            window.favorites.push(`${productId}`);
          } else {
            window.favorites = window.favorites.filter(el => el !== productId)
          }
          break;
        case 'comparsion':
          window.comparsion = window.comparsion || [];
          if (type === 'ADD') {
            window.comparsion.push(`${productId}`);
          } else {
            window.comparsion = window.comparsion.filter(el => el !== productId)
          }
          break;
      }

      setProductsButtons();
    })
    .catch(console.warn)

  target.classList.remove('_pen');
}

async function onAddToBasketClick(target) {
  const parent = target?.closest('[data-offer_id]');
  const offerId = parent?.getAttribute('data-offer_id');
  if (!offerId) return;
  target.classList.add('_pen');

  const quantity = getDigFromString(parent.getAttribute('data-quantity') || '1');

  const url = window.urls?.add2basket || '/ajax/add2basket_megamebel.php';

  const body = new FormData();

  if (window.BX) body.set('sessid', BX.bitrix_sessid());
  body.set('ID', offerId);
  body.set('QUANTITY', quantity);

  await fetch(url, {
    method: 'POST',
    body
  })
    .then(res => res.json())
    .then(res => {
      if (!res.STATUS) return;
      window.basketData.push({PRODUCT_ID: offerId})

      setProductsButtons();
    })
    .catch(console.warn)

  target.classList.remove('_pen');
}

function setProductsButtons() {
  window.comparsion = Object.values(window.comparsion || []);
  window.favorites = Object.values(window.favorites || []);
  window.basketData = Object.values(window.basketData || []);

  clearFavComparsionBtns();

  for (let index = 0; index < window.favorites.length; index++) {
    const id = window.favorites[index];
    
    const items = document.querySelectorAll(`[data-product_id="${id}"] [data-fav-btn]`);
    if (items.length) {
      items.forEach(item => item.classList.add('_active'));
    }
  }
  for (let index = 0; index < window.comparsion.length; index++) {
    const id = window.comparsion[index];
    
    const items = document.querySelectorAll(`[data-product_id="${id}"] [data-comparsion-btn]`);
    if (items.length) {
      items.forEach(item => item.classList.add('_active'));
    }
  }

  const headerFavoritesButtons = document.querySelectorAll('[data-header-favorite] i');
  if (headerFavoritesButtons.length) {
    headerFavoritesButtons.forEach(headerFavoritesButton => {
      if (window.favorites.length > 0) {
        headerFavoritesButton.innerHTML = window.favorites.length;
      } else {
        headerFavoritesButton.innerHTML = '';
      }
    })
  }
  const headerComparsionButtons = document.querySelectorAll('[data-header-comparsion] i');
  if (headerComparsionButtons.length) {
    headerComparsionButtons.forEach(headerComparsionButton => {
      if (window.comparsion.length > 0) {
        headerComparsionButton.innerHTML = window.comparsion.length;
      } else {
        headerComparsionButton.innerHTML = '';
      }
    })
  }

  if (window.basketData.length) {
    setBasketButtons();
  }
}

function clearFavComparsionBtns() {
  const favBtns = document.querySelectorAll(`[data-product_id] [data-fav-btn]`);
  const comparsionBtns = document.querySelectorAll(`[data-product_id] [data-comparsion-btn]`);
  for (let index = 0; index < favBtns.length; index++) {
    const btn = favBtns[index];
    btn.classList.remove('_active')
  }
  for (let index = 0; index < comparsionBtns.length; index++) {
    const btn = comparsionBtns[index];
    btn.classList.remove('_active')
  }
}

function setBasketButtons() {
  const headerBasketButtons = document.querySelectorAll('[data-header-basket] i');
  if (headerBasketButtons.length) {
    headerBasketButtons.forEach(headerBasketButton => {
      if (window.basketData.length > 0) {
        headerBasketButton.innerHTML = window.basketData.length
      } else {
        headerBasketButton.innerHTML = '';
      }
    })
  }

  for (let index = 0; index < window.basketData.length; index++) {
    const { PRODUCT_ID: productId } = window.basketData[index];
    const products = document.querySelectorAll(`[data-product_id="${productId}"]`);
    const offers = document.querySelectorAll(`[data-product_id="${productId}"]`);

    if (products.length) {
      products.forEach(el => {
        const addToBasketBtn = el.querySelector('[data-add2basket-btn]');
        if (!addToBasketBtn) return;
        const activeBtn = el.querySelector('.product-slide__button._active');
        if (activeBtn) {
          activeBtn.hidden = false;
          addToBasketBtn.hidden = true;
        } else {
          addToBasketBtn.innerHTML = 'В корзине';
          addToBasketBtn.removeAttribute('data-add2basket-btn');
          addToBasketBtn.setAttribute('href', '/basket/')
          addToBasketBtn.classList.add('_active');
        }
      })
    }
    if (offers.length) {
      offers.forEach(el => {
        const addToBasketBtn = el.querySelector('[data-add2basket-btn]');
        if (!addToBasketBtn) return;
        const activeBtn = el.querySelector('.product-slide__button._active');
        if (activeBtn) {
          activeBtn.hidden = false;
          addToBasketBtn.hidden = true;
        } else {
          addToBasketBtn.innerHTML = 'В корзине';
          addToBasketBtn.removeAttribute('data-add2basket-btn');
          addToBasketBtn.setAttribute('href', '/basket/')
          addToBasketBtn.classList.add('_active');
        }
      })
    }
  }
}

async function onBasketServicesChange(parent, target) {
  const url = parent.getAttribute('data-ajax');
  if (!url) return;

  const method = parent.getAttribute('method') || 'POST';
  
  const body = new FormData();
  if (window.BX) body.set('sessid', BX.bitrix_sessid());
  const inputs = parent.querySelectorAll('input');
  if (!inputs.length) return;

  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    const name = input.name;
    const value = input.checked ? 'Y' : '';

    body.set(name, value);
  }

  const options = {
    method
  }

  if (method !== 'GET') options.body = body;

  bodyLock(0);
  document.documentElement.classList.add('_pen');

  await fetch(url, options)
    .catch(console.warn)
    .then(res => res.text())
    .then(console.log)

  bodyUnlock(0);
  document.documentElement.classList.remove('_pen');
}

function delCheckedFromCart() {
  const checkedItemsButtons = document.querySelectorAll('[data-entity="basket-item"]:has([data-full-cart-checkone]:checked) [data-entity="basket-item-delete"]');
  if (!checkedItemsButtons.length) return;

  for (let index = 0; index < checkedItemsButtons.length; index++) {
    const button = checkedItemsButtons[index];
    button.click()
  }

  function onBXAjaxSuccess() {
      setTimeout(() => {
        const basketItems = document.querySelectorAll('[data-entity="basket-item"]:not([hidden])');
        if (!basketItems.length) location.reload();
      }, 1000);
      BX.removeCustomEvent('onAjaxSuccess', onBXAjaxSuccess);
  }

  if (window.BX) {
    BX.addCustomEvent('onAjaxSuccess', onBXAjaxSuccess)
  }

  checkCartClearBtnVisible();
}

function disablecontext(e, errorMsg = 'Вы не можете сохранять изображения с этого сайта.') {
    var clickedEl = e == null ? event.srcElement.tagName : e.target.tagName;
    if (clickedEl == 'IMG') {
        alert(errorMsg);
        return false;
    }
}

window.Toastify = Toastify;
window.mhzModules = mhzModules;