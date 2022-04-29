/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Merges the contents of one or more objects into the first object.
 *
 * Arguments:
 * `deep` (optional), true to do a deep-merge
 * `target` the target object to merge properties into
 * `objects` N objects to merge into the target.
 *
 * @returns {object} - The extended object.
 */
export function extend() {
  let deep = false;
  let i = 0;
  if(arguments.length > 0 && typeof arguments[0] === 'boolean') {
    deep = arguments[0];
    ++i;
  }
  const target = arguments[i] || {};
  i++;
  for(; i < arguments.length; ++i) {
    const obj = arguments[i] || {};
    Object.keys(obj).forEach(function(name) {
      const value = obj[name];
      if(deep && _isObject(value) && !Array.isArray(value)) {
        target[name] = extend(true, target[name], value);
      } else {
        target[name] = value;
      }
    });
  }
  return target;
}

function _isObject(x) {
  return x && typeof x === 'object';
}
