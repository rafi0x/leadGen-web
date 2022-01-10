const demo = (data) => {
  return `
  <div class="item mix ${data.filter_tag} col-sm-6 col-md-4 col-lg-4 mb-4">
    <a
      href="#"
      class="item-wrap fancybox"
      data-bs-toggle="modal"
      data-bs-target="#imgModal"
    >
      <div class="work-info">
        <h2>#id ${data.id}</h2>
        <div class="d-none">
          <h4>${data.title}</h4>
          <p>${data.desc}</p>
          <h6>মুল্যঃ ৳${data.price}</h6>
        </div>
      </div>
      <img
        class="img-fluid"
        src="assets/img/designsImg/${data.img_src}"
        alt="${data.alt_text}"
      />
    </a>
  </div>
  `
}

const dvider = (title, tag) => {
  return `
    <div class="mix ${tag} mb-4 col-12">
      <div class="position-relative justify-content-center text-center">
        <h5 class="dvidr">${title}</h5>
      </div>
    </div>
  `
}

// alt_text
// desc
// filter_tag
// id
// img_src
// price
// title

function init(){
  "use strict";

  // Get the container element
  var btnContainer = document.getElementById("navbar");

  // Get all buttons with class="btn" inside the container
  var btns = btnContainer.getElementsByClassName("navBtn");

  // Loop through the buttons and add the active class to the current/clicked button
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }



  /**
   * Designs
   */
  // toggle the active class on select
  let portfolioFilters = select('#filters a', true);

  on('click', '#filters a', function(e) {
    e.preventDefault();
    portfolioFilters.forEach(function(el) {
      el.classList.remove('active');
    });
    this.classList.add('active');

    portfolioIsotope.arrange({
      filter: this.getAttribute('data-filter')
    });
    portfolioIsotope.on('arrangeComplete', function() {
      AOS.refresh()
    });
  }, true);

    mixitup('#portfolio-grid',{
      load: {
          filter: '.IDCARD'
      }
    });
  
  const images = document.querySelectorAll('.fancybox');
  const modalBody = document.querySelector('.dataz');
  const modalImg = document.querySelector('.modal-img');
  const orderBtn = document.querySelector('#orderBtn');
  const orderForm = document.querySelector('#orderForm');
  const modalStatus = document.querySelector('.modalStatus');

  //error message fields
  const nameErr = document.querySelector('#nameErr');
  const contactErr = document.querySelector('#contactErr');


  // load info on modal open
  images.forEach(img => {
    img.onclick = function() {
      orderForm[2].value = this.children[0].children[0].textContent;
      modalStatus.classList.add('d-none')
      const infos = Array.from(this.children[0].children[1].children);
      modalImg.src = this.children[1].src
      infos.map(el => {
        modalBody.innerHTML += el.outerHTML
      })
    }
  })

  // clear the modal on close
  $('#imgModal').on('hidden.bs.modal', function () {
    modalImg.src = ''
    modalBody.innerHTML = ''
    modalBody.classList.remove('d-none');
    orderBtn.classList.remove('d-none');
    orderForm.classList.add('d-none')
  });

  orderBtn.onclick = function() {
    modalBody.classList.add('d-none');
    orderBtn.classList.add('d-none');
    orderForm.classList.remove('d-none')
  }

  orderForm.onsubmit = async function(e) {
    try {
      e.preventDefault();

      //clear error messages
      nameErr.innerHTML = ''
      contactErr.innerHTML = ''
      orderForm[0].classList.remove('border-danger')
      orderForm[1].classList.remove('border-danger')

      let formData = Object.fromEntries(new FormData(this).entries())

      let resposne = await fetch('https://ashabgm.com/api/v1/client-data',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
          },
      })
      let result = await resposne.json();

      if(result.nameErr) {
        orderForm[0].classList.add('border-danger')
        nameErr.innerHTML = 'অনুগ্রহ করে আপনর নাম লিখুন'
      }
      else if(result.contactErr) {
        orderForm[1].classList.add('border-danger')
        contactErr.innerHTML = 'আপনার দেওয়া নাম্বারটি সঠিক নয়'
      } else {
        orderForm.classList.add('d-none')
        modalStatus.classList.remove('d-none')
        modalStatus.innerHTML = 'ধন্যবাদ, আপনার আবেদনটি সফল হয়েছে। অতিশিগ্রহি আমরা আপনার সাথে যোগাযোগ করবো।';
      }
    
    } catch (error) {
        orderForm.classList.add('d-none')
        modalStatus.classList.remove('d-none', 'alert-success')
        modalStatus.classList.add('alert-danger')
        modalStatus.innerHTML = 'সার্ভার ত্রুটির জন্য আন্তরিকভাবে দুঃখিত। কিছুক্ষণ পর আবার চেষ্টা করুন, অথবা আমাদের সাপোর্টএ কল করুন।';
    }

  }


  const visitorCounter = async (selector, whatTodo, save) => {
    let getTotal = await fetch(`https://api.countapi.xyz/${whatTodo}/rafi0xx/hola`, {
      method: 'GET'
    })
    let total = await getTotal.json();
    if(save) localStorage.setItem("status", 'visited');
    document.getElementById(selector).innerHTML = total.value
  }

  let n = localStorage.getItem('status');

  if (n === null) {
    visitorCounter('counter','hit', true)
  } else {
    visitorCounter('counter','get', false)
  }

}

window.onload = async () => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  })
  let request = await fetch('/api/v1/get-contentz')
  let response = await request.json()

  if(Array.isArray(response) && response.length !== 0) {
    response.map((el) => {
      if(el.id === 'divider') document.querySelector('#portfolio-grid').innerHTML += dvider(el.title, el.filter_tag)
      else document.querySelector('#portfolio-grid').innerHTML +=  demo(el)
    })
    document.querySelector('.main-content').classList.remove('d-none')
    document.querySelector('.loading-screen').classList.add('loaded')
  } else {
    location.reload()
  }
  init()
}


