/* jshint devel:true */
"use strict";

function addDoughnut(){
  var data = [
    {
        value: 1,
        color:"white",
        highlight: "rgba(255,255,255,0.5)",
        label: "Yes"
    },
    {
        value: 9,
        color: "transparent",
        highlight: "rgba(255,255,255,0.5)",
        label: "No"
    }
  ];

  var options = {
      maintainAspectRatio: true,
      segmentStrokeWidth : 1,
     showTooltips: false
  }

  new Chart(document.getElementById('1-out-of-10').getContext("2d")).Pie(data,options);
}

var waypoint = new Waypoint({
  element: document.getElementById('1-out-of-10'),
  handler: function(direction) {
    setTimeout(addDoughnut, 1000);
    this.destroy();
  },
  offset: '50%'
})


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