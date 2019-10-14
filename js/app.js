'use strict'

const roundLength = 5;

function Product(name) {
  this.name = name;
  this.path = `img/${name}.jpg`;
  this.title = name;
  this.views = 0;
  this.clicks = 0;
}

function ProductContainer() {
  this.products = [];
  this.leftImage = '';
  this.middleImage = '';
  this.rightImage = '';
  this.rounds = 0;
  this.onScreen = function(product) {
    if(this.leftImage.name === product.name || this.middleImage.name === product.name || this.rightImage.name === product.name) {
      return true;
    }
    else {
      return false;
    }
  };
}

// products array to store images
var products = new ProductContainer();
products.products.push(new Product('bag'));
products.products.push(new Product('banana'));
products.products.push(new Product('bathroom'));
products.products.push(new Product('boots'));
products.products.push(new Product('breakfast'));
products.products.push(new Product('bubblegum'));
products.products.push(new Product('chair'));
products.products.push(new Product('cthulhu'));
products.products.push(new Product('dog-duck'));
products.products.push(new Product('dragon'));
products.products.push(new Product('pen'));
products.products.push(new Product('pet-sweep'));
products.products.push(new Product('scissors'));
products.products.push(new Product('shark'));
products.products.push(new Product('sweep'));
products.products.push(new Product('tauntaun'));
products.products.push(new Product('unicorn'));
products.products.push(new Product('usb'));
products.products.push(new Product('water-can'));
products.products.push(new Product('wine-glass'));

// function to return random integer
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function renderImages(e) {
  
  if(e) {
    var name = e.target.name;
    for(var i = 0; i < products.products.length; i++) {
      if(products.products[i].name === name) {
        products.products[i].clicks++;
      }
    }
    products.rounds++;
    if(products.rounds >= roundLength) {
      // display results
      displayResults();
    }
  }

  // refresh left image
  var leftImage = products.products[getRandom(products.products.length)];
  // insert if not currently displayed
  while(products.onScreen(leftImage)) {
    leftImage = products.products[getRandom(products.products.length)];
  }
  var currentImage = document.getElementById('leftImage');
  currentImage.src = leftImage.path;
  currentImage.name = leftImage.name;
  currentImage.title = leftImage.name;
  products.leftImage = leftImage;
  leftImage.views++;
  
  // refresh middle image
  var middleImage = products.products[getRandom(products.products.length)];
  // insert if not currently displayed
  while(products.onScreen(middleImage)) {
    middleImage = products.products[getRandom(products.products.length)];
  }
  currentImage = document.getElementById('middleImage');
  currentImage.src = middleImage.path;
  currentImage.name = middleImage.name;
  currentImage.title = middleImage.name;
  products.middleImage = middleImage;
  middleImage.views++;
  
  // refresh right image
  var rightImage = products.products[getRandom(products.products.length)];
  // insert if not currently displayed
  while(products.onScreen(rightImage)) {
    rightImage = products.products[getRandom(products.products.length)];
  }
  currentImage = document.getElementById('rightImage');
  currentImage.src = rightImage.path;
  currentImage.name = rightImage.name;
  currentImage.title = rightImage.name;
  products.rightImage = rightImage;
  rightImage.views++;
}

function displayResults() {
  console.log(products.products);
}

document.getElementById('leftImage').addEventListener('click',renderImages);
document.getElementById('middleImage').addEventListener('click',renderImages);
document.getElementById('rightImage').addEventListener('click',renderImages);

renderImages();
