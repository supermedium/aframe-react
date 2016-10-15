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
export function getEventMappings(possibleEventHandlers) {
  return Object.keys(possibleEventHandlers)
    .filter(reactEventName => (
      !!reactEventName.match(/^on[A-Z]/))
      && possibleEventHandlers[reactEventName].constructor === Function
    ).reduce((handlers, reactEventName) => {
      const aframeEventName = titleToKebabCase(reactEventName.replace(/^on/, ''));
      handlers[aframeEventName] = possibleEventHandlers[reactEventName];
      return handlers;
    }, {});
}
