import {Splide} from '@splidejs/splide';
// Default theme
// import '@splidejs/splide/css';

// or only core styles
import '@splidejs/splide/css/core';



function initSliders() {
  // if (document.querySelector('.splide')) {
  //   let splide = new Splide('.splide', {
  //     type: 'slide',
  //     pagination: false,
  //     gap: 10,
  //     arrows: true,
  //     perMove: 1,
  //     perPage: 1,
  //   })
    
  //   splide.mount();
  // }
  if (document.querySelector('.big-hero__slider')) {
    let splide = new Splide('.big-hero__slider', {
      type: 'loop',
      pagination: true,
      gap: 10,
      arrows: false,
      perMove: 1,
      perPage: 1,
      autoplay: true,
    })
    
    splide.mount();
  }
  if (document.querySelector('.small-hero__slider')) {
    let splide = new Splide('.small-hero__slider', {
      type: 'loop',
      pagination: true,
      gap: 10,
      arrows: false,
      perMove: 1,
      perPage: 1,
      autoplay: true,
    })
    
    splide.mount();
  }
  if (document.querySelector('.categories__slider')) {
    let splide = new Splide('.categories__slider', {
      type: 'slide',
      pagination: false,
      gap: 18,
      perMove: 1,
      autoWidth: true,
      arrows: true,
      breakpoints: {
        768: {
          destroy: true
        }
      }
    })
    
    splide.mount();
  }
  if (document.querySelector('.series__slider')) {
    let splide = new Splide('.series__slider', {
      type: 'slide',
      pagination: false,
      gap: 18,
      perMove: 1,
      autoWidth: true,
      arrows: true,
      breakpoints: {
        768: {
          destroy: true
        }
      }
    })
    
    splide.mount();
  }
  if (document.querySelector('.productslider__slider')) {
    const productSliders = document.querySelectorAll('.productslider__slider');

    for (let index = 0; index < productSliders.length; index++) {
      const productSlider = productSliders[index];

      let splide = new Splide(productSlider, {
        type: 'slide',
        pagination: false,
        gap: 20,
        perMove: 1,
        perPage: 4,
        arrows: true,
        breakpoints: {
          992: {
            autoWidth: true,
            gap: 16,
          },
          480: {
            gap: 14,
          },
        }
      })
      
      splide.mount();
    }
  }
  if (document.querySelector('.main-productfull__mainslider')) {
    let mainslider, thumbslider;

    mainslider = new Splide('.main-productfull__mainslider', {
      type: 'slide',
      pagination: false,
      gap: 10,
      perMove: 1,
      perPage: 1,
      arrows: false,
    })
    

    if (document.querySelector('.main-productfull__thumbslider')) {
      thumbslider = new Splide('.main-productfull__thumbslider', {
        type: 'slide',
        pagination: false,
        arrows: false,
        rewind: true,
        autoWidth: true,
        gap: 15,
        isNavigation: true,
        breakpoints: {
          992: {
            direction: 'ttb',
            height: '74'
          },
          767: {
            direction: 'ltr',
          }
        }
      })
    }

    if (thumbslider) mainslider.sync(thumbslider)
      
    mainslider.mount();
    if (thumbslider) thumbslider.mount();
  }
  if (document.querySelector('.main-productfull__miniphoto')) {
    let splide = new Splide('.main-productfull__miniphoto', {
      type: 'slide',
      pagination: false,
      gap: 15,
      perMove: 1,
      perPage: 4,
      arrows: true,
      breakpoints: {
        767: {
          perPage: 3,
          gap: 10
        }
      }
    })
    
    splide.mount();
  }

  if (document.querySelector('.home-info__links')) {
    let splide = new Splide('.home-info__links', {
      type: 'slide',
      pagination: false,
      arrows: false,
      gap: 30,
      fixedWidth: '80px',
      breakpoints: {
        767: {
          fixedWidth: '60px',
          gap: 20,
        }
      }
    });

    splide.mount();
  }
}


window.addEventListener("load", function (e) {
	initSliders();
});