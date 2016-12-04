// to emulate a native app

// fastclick
import fastclick from 'fastclick';

document.addEventListener('DOMContentLoaded', () => {
    fastclick.attach(document.body);
}, false);

// prevent scroll view
document.addEventListener('touchmove', ( event ) => {
    event.preventDefault();
}, false);
