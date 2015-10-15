/* jshint devel:true */
"use strict";


Array.prototype.slice.call(document.querySelectorAll('main > section')).map(function(section){
  new Waypoint({
    element: section,
    handler: function(direction) {
      this.element.classList.add('seen');
      this.destroy();
    },
    offset: '40%'
  })
});



Array.prototype.slice.call(document.querySelectorAll('[data-iphone-step]')).map(function(solutionStep){
  new Waypoint({
    element: solutionStep,
    handler: function(direction) {
      var method = (direction === 'down') ? 'add' : 'remove',
          step = this.element.getAttribute('data-iphone-step');

      document
        .querySelector('.solution-fixed')
        .classList[method](step);

        if(step === 'vr') {
          var method = (direction === 'down') ? 'play' : 'pause';

          document.querySelector('[data-vr-video]').currentTime = 0;
          document.querySelector('[data-vr-video]')[method]();
        }
    },
    offset: '30%'
  })
});