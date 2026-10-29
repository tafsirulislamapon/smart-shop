// navbar

// show | close
function toggleMenu() {
  document.getElementById("menu").classList.toggle("hidden");
}

function closeMenu() {
  document.getElementById("menu").classList.add("hidden");
}


//scroll listener
window.addEventListener("scroll", () => {

  let currentSection = "home";

  document.querySelectorAll("section").forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      currentSection = section.id;
    }
  });

  const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
  if (atBottom) currentSection = "contact";


  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("bg-yellow-400",
      link.getAttribute("href") === "#" + currentSection);
  });


  document.getElementById("topButton")
    .classList.toggle("hidden", window.scrollY < 301);

});


// banner

const banners = [
  { image: "https://picsum.photos/id/26/1200/400", text: "Big Sale: Up to 50% Off" },
  { image: "https://picsum.photos/id/21/1200/400", text: "New Shoes Just Arrived" },
  { image: "https://picsum.photos/id/30/1200/400", text: "Fresh Deals Every Week" },
  { image: "https://picsum.photos/id/0/1200/400", text: "Use Code SMART10 for 10% Off" },
];

let bannerIndex = 0;

function moveBanner(step) {
  bannerIndex = bannerIndex + step;

  if (bannerIndex >= banners.length) bannerIndex = 0;

  if (bannerIndex < 0) bannerIndex = banners.length - 1;

  document.getElementById("bannerImage").src = banners[bannerIndex].image;

  document.getElementById("bannerText").textContent = banners[bannerIndex].text;

}

moveBanner(0);
setInterval(() => moveBanner(1), 3000);



// products

let products = [];

fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    products = data;
    showProducts(products);

    //console.log(products)
  })
  .catch(() => {
    document.getElementById("productList").textContent = "Could not load products.";
  });



// cards
function showProducts(productList) {

  let cards = "";

  productList.forEach((product) => {
    cards = cards + `
      <div class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
      
        <img src="${product.image}" alt="${product.title}" class="h-40 object-contain mb-3">
        
        <h3 class="font-semibold text-sm line-clamp-2 flex-1">${product.title}</h3>
        
        <p class="text-sm text-gray-600 my-1">Rating: ${product.rating.rate} / 5</p>

        <p class="font-bold text-lg">${product.price.toFixed(2)} BDT</p>
        
        <button onclick="addToCart(${product.id})"class="mt-2 bg-yellow-400 hover:bg-yellow-500 font-semibold py-2 rounded">
          Add to Cart
        </button>

      </div>`;
  });

  document.getElementById("productList").innerHTML = cards;

}



// search sorting

function sortProducts() {

  const sortType = document.getElementById("sortSelect").value;

  const sortedProducts = products.slice();
  //console.log(sortedProducts)

  if (sortType === "low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }
  if (sortType === "high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }
  showProducts(sortedProducts);
}



//cart + balance

let cart = [];
let couponApplied = false;
let balance = +localStorage.getItem("balance") || 1000;

// calc
function getCartTotals() {

  let subtotal = 0, delivery = 0, shipping = 0, discount = 0;

  cart.forEach((item) => {
    subtotal = subtotal + item.price * item.quantity;
  });

  if (cart.length > 0) {
    delivery = 50;
    shipping = 30;
  }
  if (couponApplied) {
    discount = subtotal * 0.1;
  }
  const total = subtotal + delivery + shipping - discount;

  return {
    subtotal: subtotal,
    delivery: delivery,
    shipping: shipping,
    discount: discount,
    total: total,
  };
}

function applyCoupon() {
  const code = document.getElementById("couponInput").value.trim().toUpperCase();

  if (code === "SMART10") {
    couponApplied = true;
    
    showMessage("cartMessage", "Coupon applied: 10% off!", true);

    updateCart();
  }
  else {
    showMessage("cartMessage", "Invalid coupon code.", false);
  }

}

// show msg
function showMessage(elementId, text, isCorrect) {

  const messageBox = document.getElementById(elementId);

  messageBox.textContent = text;

  if (isCorrect) {
    messageBox.className = "mt-2 text-sm font-semibold text-green-700";
  } else {
    messageBox.className = "mt-2 text-sm font-semibold text-red-600";
  }

}


function addToCart(productId) {

  const product = products.find((item) => item.id === productId);

  const cartItem = cart.find((item) => item.id === productId);


  if (cartItem) {
    cartItem.quantity = cartItem.quantity + 1;
  }
  else {
    cart.push(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1
      }
    );
  }

  // handle out of balance
  if (getCartTotals().total > balance) {
    if (cartItem) {
      cartItem.quantity = cartItem.quantity - 1;
    }
    else cart.pop();

    showMessage("cartMessage", "Not enough balance! Please add money.", false);
    return;

  }

  showMessage("cartMessage", "Added to cart.", true);

  updateCart();

}



function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  showMessage("cartMessage", "Item removed.", true);
  updateCart();
}



function updateCart() {
  let cartHTML = "";
  let itemCount = 0;

  cart.forEach((item) => {

    itemCount = itemCount + item.quantity;

    cartHTML = cartHTML + `
      <div class="flex items-center gap-2 border-b border-gray-200 py-2 text-sm">
        <span class="flex-1 line-clamp-1">${item.title}</span>
        <span>${item.quantity} x ${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${item.id})"
          class="text-red-600 font-semibold">Remove</button>
      </div>`;
  }
  );

  if (cart.length === 0) {
    cartHTML = `<p class="text-sm text-gray-500">Your cart is empty.</p>`;
  }

  document.getElementById("cartItems").innerHTML = cartHTML;
  document.getElementById("cartCount").textContent = itemCount;

  const totals = getCartTotals();

  document.getElementById("subtotal").textContent = totals.subtotal.toFixed(2);
  document.getElementById("delivery").textContent = totals.delivery.toFixed(2);
  document.getElementById("shipping").textContent = totals.shipping.toFixed(2);
  document.getElementById("discount").textContent = totals.discount.toFixed(2);
  document.getElementById("total").textContent = totals.total.toFixed(2);
}



// show balance + set localstorage
function showBalance() {
  document.getElementById("balance").textContent = balance.toFixed(2);
  localStorage.setItem("balance", balance);
}

function addMoney() {
  balance = balance + 1000;
  showBalance();
  showMessage("cartMessage", "1000 BDT added to your balance.", true);
}




function placeOrder() {
  if (cart.length === 0) {
    showMessage("cartMessage", "Your cart is empty.", false);
    return;
  }

  balance = balance - getCartTotals().total;
  cart = [];
  couponApplied = false;
  document.getElementById("couponInput").value = "";

  showBalance();
  updateCart();

  showMessage("cartMessage", "Order placed. Thank you!", true);

}

showBalance();
updateCart();


// REVIEWS 

let reviews = [];
let reviewIndex = 0;


fetch("reviews.json")
  .then((response) => response.json())
  .then((data) => {
    reviews = data;

    moveReview(0);
    setInterval(() => moveReview(1), 4000);

  })
  .catch(() => {
    document.getElementById("reviewBox").textContent = "Could not load reviews. Check the file name";
  });



function moveReview(step) {
  if (reviews.length === 0) return;

  reviewIndex = reviewIndex + step;

  if (reviewIndex >= reviews.length) reviewIndex = 0;

  if (reviewIndex < 0) reviewIndex = reviews.length - 1;

  const review = reviews[reviewIndex];

  const stars = "*".repeat(review.rating) + "_".repeat(5 - review.rating);
  
  document.getElementById("reviewBox").innerHTML = `
    <p class="text-yellow-500 text-2xl">${stars}</p>
    <p class="text-lg my-3">"${review.comment}"</p>
    <p class="font-bold">${review.name}</p>
    <p class="text-sm text-gray-500">${review.date}</p>`;

}

/*CONTACT FORM */

function sendMessage(event) {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (name === "" || email === "" || message === "") {
    showMessage("formMessage", "Please fill in all fields.", false);
  } 
  else if (!email.includes("@") || !email.includes(".")) {
    showMessage("formMessage", "Please enter a valid email.", false);
  } 
  else {
    
    showMessage("formMessage", "Thank you, " + name + "! We got your message.", true);
    
    document.getElementById("contactForm").reset();
  
  }
}


//backToTop
function backToTop() {
  window.scrollTo(0, 0);
}
