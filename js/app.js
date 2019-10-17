'use strict';

function Product(name) {
  this.name = name;
  this.path = `img/${name}.jpg`;
  this.title = name;
  this.views = 0;
  this.meanView = 0;
  this.clicks = 0;
}

function ProductContainer() {
  this.products = [new Product('bag'), new Product('banana'), new Product('bathroom'), new Product('boots'), new Product('breakfast'), new Product('bubblegum'), new Product('chair'), new Product('cthulhu'), new Product('dog-duck'), new Product('dragon'), new Product('pen'), new Product('pet-sweep'), new Product('scissors'), new Product('shark'), new Product('sweep'), new Product('tauntaun'), new Product('unicorn'), new Product('usb'), new Product('water-can'), new Product('wine-glass')];
  this.leftImage = '';
  this.middleImage = '';
  this.rightImage = '';
  this.rounds = 0;
  this.roundLength = 25;
}

function updateRoundLength(e) {
  e.preventDefault();
  e.stopPropagation();
  container.roundLength = document.getElementById('rounds').value;
  document.getElementById('rounds').value = '';
}

function onScreen(product) {
  if(container.leftImage.name === product.name || container.middleImage.name === product.name || container.rightImage.name === product.name) {
    return true;
  }
  else {
    return false;
  }
};

function updateMeanView(ProductContainer) {
  var total = 0;
  for(var i = 0; i < ProductContainer.products.length; i++) {
    total += ProductContainer.products[i].views;
  }
  ProductContainer.meanView = total / ProductContainer.products.length;
}

function displayResults() {
  // remove current images
  var imageContainer = document.getElementById('imageContainer');
  for(var i = imageContainer.children.length - 1; i > -1; i--) {
    imageContainer.removeChild(imageContainer.children[i]);
  }

  // sort container.products by votes
  container.products.sort(function(productA, productB) {
    return productB.clicks - productA.clicks;
  });

  // add each image with caption of views and votes
  for(var i = 0; i < container.products.length; i++) {
    var figure = document.createElement('figure');
    var img = document.createElement('img');
    img.src = container.products[i].path;
    img.alt = container.products[i].name;
    figure.appendChild(img);
    var figcaption = document.createElement('figcaption');
    figcaption.textContent = `Views: ${container.products[i].views}, Votes: ${container.products[i].clicks}`;
    figure.appendChild(figcaption);
    imageContainer.appendChild(figure);
  }
  
  // create canvas
  var canvas = document.createElement('canvas');
  canvas.id = 'chart';
  document.getElementById('chartContainer').appendChild(canvas);
  
  // chart data
  // THANK YOU https://www.chartjs.org/samples/latest/charts/combo-bar-line.html
  var names = [];
  var clicksPerView = [];
  var views = [];
  var clicks = [];
  for(var i = 0; i < container.products.length; i++) {
    names[i] = container.products[i].name;
    clicksPerView[i] = (container.products[i].clicks / container.products[i].views);
    views[i] = container.products[i].views;
    clicks[i] = container.products[i].clicks;
  }

  var chartData = {
    labels: names,
    datasets: [{
      type: 'line',
      label: 'Clicks per View',
      borderColor: 'green',
      borderWidth: 2,
      fill: false,
      data: clicksPerView,
    },
    {
      type: 'bar',
      label: 'Views',
      backgroundColor: 'red',
      data: views,
      borderColor: 'white',
      borderWidth: 2
    },
    {
      type: 'bar',
      label: 'Clicks',
      backgroundColor: 'blue',
      data: clicks,
      borderColor: 'white',
      borderWidth: 2
    }]
  };
  
  var context = document.getElementById('chart').getContext('2d');
  
  // actual chart
  var chart = new Chart(context, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Survey Results'
      },
      tooltips: {
        mode: 'index',
        intersect: true
      }
    }
  });
}

// Function to check if local storage compatable
// THANK YOU http://diveinto.html5doctor.com/storage.html
function supportsHTML5Storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

// function to return random integer
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function readProductsFromLocal() {
  // check for local storage compatibility
  if(supportsHTML5Storage()) {
    // pull local storage products
    //check to see if local storage exists
    if(localStorage['tuckerBusMall']) {
      container = JSON.parse(localStorage['tuckerBusMall']);
    }
    return true;
  }
  return false;
}
function writeProductsToLocal() {
  // check for local storage compatibility
  if(supportsHTML5Storage()) {
    // write to local products
    localStorage.removeItem('tuckerBusMall');
    localStorage.setItem('tuckerBusMall',JSON.stringify(container));
    return true;
  }
  return false;
}

function renderImages(e) {  
  if(e) {
    var name = e.target.name;
    for(var i = 0; i < container.products.length; i++) {
      if(container.products[i].name === name) {
        container.products[i].clicks++;
      }
    }
    container.rounds++;
  }
  // if we have exceeded the number of rounds, display results
  if(container.rounds >= container.roundLength) {
    //remove event listeners
    document.getElementById('submit').removeEventListener('click', updateRoundLength);
    document.getElementById('leftImage').removeEventListener('click', renderImages);
    document.getElementById('middleImage').removeEventListener('click', renderImages);
    document.getElementById('rightImage').removeEventListener('click', renderImages);
    // display results
    displayResults();
    writeProductsToLocal();
  }
  else {

    // update products.meanView
    updateMeanView(container);
    
    // refresh left image
    var leftImage = container.products[getRandom(container.products.length)];
    // refresh middle image
    var middleImage = container.products[getRandom(container.products.length)];
    // refresh right image
    var rightImage = container.products[getRandom(container.products.length)];

    var isMiddle = onScreen(middleImage);
    var isRight = onScreen(rightImage);

    var leftAboveViewMean = leftImage.views > (container.meanView * 1.2);
    var middleAboveViewMean = middleImage.views > (container.meanView * 1.2);
    var rightAboveViewMean = rightImage.views > (container.meanView * 1.2);

    // insert if not currently displayed or views is above product.viewMean
    while(leftAboveViewMean || onScreen(leftImage) || leftImage === middleImage || leftImage === rightImage) {
      leftImage = container.products[getRandom(container.products.length)];
      leftAboveViewMean = leftImage.views > (container.meanView * 1.2);
    }
    while(isMiddle || middleAboveViewMean || onScreen(middleImage) || middleImage === leftImage || middleImage === rightImage) {
      middleImage = container.products[getRandom(container.products.length)];
      middleAboveViewMean = middleImage.views > (container.meanView * 1.2);
      isMiddle = onScreen(middleImage);
    }
    while(isRight || rightAboveViewMean || onScreen(rightImage) || rightImage === leftImage || rightImage === middleImage) {
      rightImage = container.products[getRandom(container.products.length)];
      rightAboveViewMean = rightImage.views > (container.meanView * 1.2);
      isRight = onScreen(rightImage);
    }

    // fill right image data
    var currentImage = document.getElementById('leftImage');
    currentImage.src = leftImage.path;
    currentImage.name = leftImage.name;
    currentImage.title = leftImage.name;
    container.leftImage = leftImage;
    leftImage.views++;
    
    // fill middle image data
    currentImage = document.getElementById('middleImage');
    currentImage.src = middleImage.path;
    currentImage.name = middleImage.name;
    currentImage.title = middleImage.name;
    container.middleImage = middleImage;
    middleImage.views++;
    
    // fill right image data
    currentImage = document.getElementById('rightImage');
    currentImage.src = rightImage.path;
    currentImage.name = rightImage.name;
    currentImage.title = rightImage.name;
    container.rightImage = rightImage;
    rightImage.views++;
  }
}

// products array to store images
var container = new ProductContainer();
readProductsFromLocal();
document.getElementById('submit').addEventListener('click', updateRoundLength);

document.getElementById('leftImage').addEventListener('click',renderImages);
document.getElementById('middleImage').addEventListener('click',renderImages);
document.getElementById('rightImage').addEventListener('click',renderImages);

container.rounds = 0;

renderImages();
