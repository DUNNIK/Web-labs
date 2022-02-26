window.onload = function () {
    let elem = document.querySelector('.main-carousel');
    let flkty = new Flickity(elem, {
        cellAlign: 'left', //Align cells within the carousel element.
        draggable: true, //able dragging
        wrapAround: true, //you can flick forever
        accessibility: false, //disables being able to tab and keyboard navigation
        arrowShape: 'M 0,50 L 60,00 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z'
    });
}