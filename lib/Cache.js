/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
export class Cache {
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
}
