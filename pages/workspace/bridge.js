let eventListeners = {};
let requestId = 0;

function init() {

}

function call(handlerName, args, callback) {

}

function register(handlerName, callback) {
    eventListeners[handlerName] = callback;
}

// init();
