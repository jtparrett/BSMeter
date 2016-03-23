var BSMeter = function(opts){
  this.opts = opts;
  this.isOpen = false;
  this.create();
};

BSMeter.prototype.create = function(){
  this.elements = {
    container: document.createElement('div'),
    wrapper: document.createElement('div'),
    needle: document.createElement('span'),
    result: document.createElement('span')
  };

  this.elements.container.classList.add('BSMeter');
  this.elements.wrapper.classList.add('BSMeter__wrapper');
  this.elements.container.innerHTML = '<a class="BSMeter__footer" href="http://www.rawnet.com" target="_blank">Eccentrically evolved by</a>';

  this.elements.needle.classList.add('BSMeter__needle');
  this.elements.wrapper.appendChild(this.elements.needle);

  this.elements.result.classList.add('BSMeter__result');
  this.elements.wrapper.appendChild(this.elements.result);

  this.elements.container.appendChild(this.elements.wrapper);
  document.body.appendChild(this.elements.container);
};

BSMeter.prototype.toggle = function(){
  this.isOpen = (this.isOpen)? false : true;

  if(this.isOpen){
    this.elements.container.className = 'BSMeter BSMeter--open';
  } else {
    this.elements.container.className = 'BSMeter';
  }
};

BSMeter.prototype.rate = function(){
  var self = this;
  this.pageContent = [];
  this.score = 0;

  this.opts.selectors.forEach(function(selector){
    var els = document.getElementsByTagName(selector);
    for(var i = 0; i < els.length; i++){
      var words = els[i].innerHTML.toLowerCase().split(' ');

      words.forEach(function(word){
        self.checkWord(word);
      });
    }
  });

  this.getResult();
};

BSMeter.prototype.checkWord = function(word){
  if(word === ''){
    return false;
  }

  if(this.opts.keywords.indexOf(word) > -1){
    this.score++;
  }

  this.pageContent.push(word);
};

BSMeter.prototype.getResult = function(){
  var result = ((this.score / this.opts.keywords.length) * 100).toFixed(1);
  var angle = 190 * (result / 100);

  angle = (result > 100)? 190 : angle;

  this.elements.result.innerHTML = result + '%';
  this.elements.needle.style.transform = 'rotate(' + angle + 'deg)';
};

// Initilise
var meter = new BSMeter({
    selectors: 'p, a, span, h1, h2, h3, h4, h5, h6'.split(', '),
    keywords: 'crm, rebranding, life, coach, think, outside the box, low-hanging, fruit, synergy, word of mouth, color, theory, baby, boomers, marketing, smarketing, customer, relationship, management, out-of-the-box, experience, nano-campaigning, investors, investomer, emotional, branding, educate, engagement, social, insights, viral, shareability, guru, sustainability, catalyst, economy, sticky, organic, content, conversation, visionary, data, experience, leader, management, communication'.split(', ')
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.message === "clicked_browser_action"){
    meter.toggle();
    meter.rate();
  }
});