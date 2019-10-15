'use strict'

var roundLength = 25;

function Product(name) {
  this.name = name;
  this.path = `img/${name}.jpg`;
  this.title = name;
  this.views = 0;
  this.meanView = 0;
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
  this.updateMeanView = function(productContainer) {
    var total = 0;
    for(var i = 0; i < productContainer.products.length; i++) {
      total += productContainer.products[i].views;
    }
    productContainer.meanView = total / productContainer.products.length;
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
  }
  // if we have exceeded the number of rounds, display results
  if(products.rounds >= roundLength) {
    //remove event listeners
    document.getElementById('submit').removeEventListener('click', updateRoundLength);
    document.getElementById('leftImage').removeEventListener('click', renderImages);
    document.getElementById('middleImage').removeEventListener('click', renderImages);
    document.getElementById('rightImage').removeEventListener('click', renderImages);
    // display results
    displayResults();
  }
  else {

    // update products.meanView
    products.updateMeanView(products);
    console.log(`meanView: ${products.meanView}`);
    
    // refresh left image
    var leftImage = products.products[getRandom(products.products.length)];
    // refresh middle image
    var middleImage = products.products[getRandom(products.products.length)];
    // refresh right image
    var rightImage = products.products[getRandom(products.products.length)];

    var isMiddle = products.onScreen(middleImage);
    var isRight = products.onScreen(rightImage);

    var leftAboveViewMean = leftImage.views > (products.meanView * 1.2);
    console.log(`leftAboveViewMean: ${leftAboveViewMean}`);
    var middleAboveViewMean = middleImage.views > (products.meanView * 1.2);
    console.log(`middleAboveViewMean: ${middleAboveViewMean}`);
    var rightAboveViewMean = rightImage.views > (products.meanView * 1.2);
    console.log(`rightAboveViewMean: ${rightAboveViewMean}`);

    console.log(`left onScreen: ${products.onScreen(leftImage)}`);
    console.log(`middle onScreen: ${products.onScreen(middleImage)}`);
    console.log(`right onScreen: ${products.onScreen(rightImage)}`);

    console.log(`left views: ${leftImage.views}`);
    console.log(`middle views: ${middleImage.views}`);
    console.log(`right views: ${rightImage.views}`);

    // insert if not currently displayed or views is above product.viewMean
    while(leftAboveViewMean || products.onScreen(leftImage) || leftImage === middleImage || leftImage === rightImage) {
      leftImage = products.products[getRandom(products.products.length)];
      leftAboveViewMean = leftImage.views > (products.meanView * 1.2);
      console.log(`stopped in left`);
    }
    while(isMiddle || middleAboveViewMean || products.onScreen(middleImage) || middleImage === leftImage || middleImage === rightImage) {
      middleImage = products.products[getRandom(products.products.length)];
      middleAboveViewMean = middleImage.views > (products.meanView * 1.2);
      isMiddle = products.onScreen(middleImage);
      console.log(`stopped in middle`);
    }
    while(isRight || rightAboveViewMean || products.onScreen(rightImage) || rightImage === leftImage || rightImage === middleImage) {
      rightImage = products.products[getRandom(products.products.length)];
      rightAboveViewMean = rightImage.views > (products.meanView * 1.2);
      isRight = products.onScreen(rightImage);
      console.log(`stopped in right`);
    }

    // fill right image data
    var currentImage = document.getElementById('leftImage');
    currentImage.src = leftImage.path;
    currentImage.name = leftImage.name;
    currentImage.title = leftImage.name;
    products.leftImage = leftImage;
    leftImage.views++;
    
    // fill middle image data
    currentImage = document.getElementById('middleImage');
    currentImage.src = middleImage.path;
    currentImage.name = middleImage.name;
    currentImage.title = middleImage.name;
    products.middleImage = middleImage;
    middleImage.views++;
    
    // fill right image data
    currentImage = document.getElementById('rightImage');
    currentImage.src = rightImage.path;
    currentImage.name = rightImage.name;
    currentImage.title = rightImage.name;
    products.rightImage = rightImage;
    rightImage.views++;
  }
}

function displayResults() {
  // remove current images
  var imageContainer = document.getElementById('imageContainer');
  for(var i = imageContainer.children.length - 1; i > -1; i--) {
    imageContainer.removeChild(imageContainer.children[i]);
  }

  // sort products.products by votes
  products.products.sort(function(productA, productB) {
    return productB.clicks - productA.clicks;
  });

  // add each image with caption of views and votes
  for(var i = 0; i < products.products.length; i++) {
    var figure = document.createElement('figure');
    var img = document.createElement('img');
    img.src = products.products[i].path;
    img.alt = products.products[i].name;
    figure.appendChild(img);
    var figcaption = document.createElement('figcaption');
    figcaption.textContent = `Views: ${products.products[i].views}, Votes: ${products.products[i].clicks}`;
    figure.appendChild(figcaption);
    imageContainer.appendChild(figure);
  }
  console.log(products.products);
}

function updateRoundLength(e) {
  e.preventDefault();
  e.stopPropagation();
  roundLength = document.getElementById('rounds').value;
  document.getElementById('rounds').value = '';
}

document.getElementById('submit').addEventListener('click', updateRoundLength);

document.getElementById('leftImage').addEventListener('click',renderImages);
document.getElementById('middleImage').addEventListener('click',renderImages);
document.getElementById('rightImage').addEventListener('click',renderImages);

renderImages();
