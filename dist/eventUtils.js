'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventMappings = getEventMappings;
function titleToKebabCase(str) {
  return str.replace(/([^-])([A-Z])/, '$1-$2').toLowerCase();
}

/**
 * Determines event listeners to handle using props that start with `on`.
 * For example, `onClick` would prescribe to register an event handler for
 * `click`. `onIntersectionCleared` would prescribe to register event handler
 * for `intersection-cleared`.
 *
 * @param {object} possibleEventHandlers - React props object.
 * @returns {object} Events to register.
 */
function getEventMappings(possibleEventHandlers) {
  return Object.keys(possibleEventHandlers).filter(function (reactEventName) {
    return !!reactEventName.match(/^on[A-Z]/) && possibleEventHandlers[reactEventName].constructor === Function;
  }).reduce(function (handlers, reactEventName) {
    var aframeEventName = titleToKebabCase(reactEventName.replace(/^on/, ''));
    handlers[aframeEventName] = possibleEventHandlers[reactEventName];
    return handlers;
  }, {});
}