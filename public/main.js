window.onload = () => {
    'use strict';
    // console.log(navigator);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
}