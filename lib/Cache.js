/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = class Cache {
  constructor() {
    this._cache = new Map();
  }

  put(key, value) {
    this._cache.set(key, value);
  }

  get(key) {
    return this._cache.get(key);
  }

  del(key) {
    this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }
};
