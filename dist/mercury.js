(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MercuryEngine = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = global || self, factory(global.AbcNotation = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  var fillStr = function (character, times) {
      return Array(times + 1).join(character);
  };
  var REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
  function tokenize(str) {
      var m = REGEX.exec(str);
      if (!m) {
          return ["", "", ""];
      }
      return [m[1], m[2], m[3]];
  }
  /**
   * Convert a (string) note in ABC notation into a (string) note in scientific notation
   *
   * @example
   * abcToScientificNotation("c") // => "C5"
   */
  function abcToScientificNotation(str) {
      var _a = tokenize(str), acc = _a[0], letter = _a[1], oct = _a[2];
      if (letter === "") {
          return "";
      }
      var o = 4;
      for (var i = 0; i < oct.length; i++) {
          o += oct.charAt(i) === "," ? -1 : 1;
      }
      var a = acc[0] === "_"
          ? acc.replace(/_/g, "b")
          : acc[0] === "^"
              ? acc.replace(/\^/g, "#")
              : "";
      return letter.charCodeAt(0) > 96
          ? letter.toUpperCase() + a + (o + 1)
          : letter + a + o;
  }
  /**
   * Convert a (string) note in scientific notation into a (string) note in ABC notation
   *
   * @example
   * scientificToAbcNotation("C#4") // => "^C"
   */
  function scientificToAbcNotation(str) {
      var n = core.note(str);
      if (n.empty || !n.oct) {
          return "";
      }
      var letter = n.letter, acc = n.acc, oct = n.oct;
      var a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
      var l = oct > 4 ? letter.toLowerCase() : letter;
      var o = oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
      return a + l + o;
  }
  function transpose(note, interval) {
      return scientificToAbcNotation(core.transpose(abcToScientificNotation(note), interval));
  }
  function distance(from, to) {
      return core.distance(abcToScientificNotation(from), abcToScientificNotation(to));
  }
  var index = {
      abcToScientificNotation: abcToScientificNotation,
      scientificToAbcNotation: scientificToAbcNotation,
      tokenize: tokenize,
      transpose: transpose,
      distance: distance,
  };

  exports.abcToScientificNotation = abcToScientificNotation;
  exports.default = index;
  exports.distance = distance;
  exports.scientificToAbcNotation = scientificToAbcNotation;
  exports.tokenize = tokenize;
  exports.transpose = transpose;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = global || self, factory(global.Array = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  // ascending range
  function ascR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = n + b)
          ;
      return a;
  }
  // descending range
  function descR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = b - n)
          ;
      return a;
  }
  /**
   * Creates a numeric range
   *
   * @param {number} from
   * @param {number} to
   * @return {Array<number>}
   *
   * @example
   * range(-2, 2) // => [-2, -1, 0, 1, 2]
   * range(2, -2) // => [2, 1, 0, -1, -2]
   */
  function range(from, to) {
      return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
  }
  /**
   * Rotates a list a number of times. It"s completly agnostic about the
   * contents of the list.
   *
   * @param {Integer} times - the number of rotations
   * @param {Array} array
   * @return {Array} the rotated array
   *
   * @example
   * rotate(1, [1, 2, 3]) // => [2, 3, 1]
   */
  function rotate(times, arr) {
      var len = arr.length;
      var n = ((times % len) + len) % len;
      return arr.slice(n, len).concat(arr.slice(0, n));
  }
  /**
   * Return a copy of the array with the null values removed
   * @function
   * @param {Array} array
   * @return {Array}
   *
   * @example
   * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
   */
  function compact(arr) {
      return arr.filter(function (n) { return n === 0 || n; });
  }
  /**
   * Sort an array of notes in ascending order. Pitch classes are listed
   * before notes. Any string that is not a note is removed.
   *
   * @param {string[]} notes
   * @return {string[]} sorted array of notes
   *
   * @example
   * sortedNoteNames(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
   * // => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
   * sortedNoteNames(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
   * // => ['C', 'F', 'G', 'A', 'B']
   */
  function sortedNoteNames(notes) {
      var valid = notes.map(function (n) { return core.note(n); }).filter(function (n) { return !n.empty; });
      return valid.sort(function (a, b) { return a.height - b.height; }).map(function (n) { return n.name; });
  }
  /**
   * Get sorted notes with duplicates removed. Pitch classes are listed
   * before notes.
   *
   * @function
   * @param {string[]} array
   * @return {string[]} unique sorted notes
   *
   * @example
   * Array.sortedUniqNoteNames(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
   * // => [ 'C', 'A', 'B', 'C2', 'C3' ]
   */
  function sortedUniqNoteNames(arr) {
      return sortedNoteNames(arr).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
  }
  /**
   * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
   *
   * @function
   * @param {Array} array
   * @return {Array} the array shuffled
   *
   * @example
   * shuffle(["C", "D", "E", "F"]) // => [...]
   */
  function shuffle(arr, rnd) {
      if (rnd === void 0) { rnd = Math.random; }
      var i;
      var t;
      var m = arr.length;
      while (m) {
          i = Math.floor(rnd() * m--);
          t = arr[m];
          arr[m] = arr[i];
          arr[i] = t;
      }
      return arr;
  }
  /**
   * Get all permutations of an array
   *
   * @param {Array} array - the array
   * @return {Array<Array>} an array with all the permutations
   * @example
   * permutations(["a", "b", "c"])) // =>
   * [
   *   ["a", "b", "c"],
   *   ["b", "a", "c"],
   *   ["b", "c", "a"],
   *   ["a", "c", "b"],
   *   ["c", "a", "b"],
   *   ["c", "b", "a"]
   * ]
   */
  function permutations(arr) {
      if (arr.length === 0) {
          return [[]];
      }
      return permutations(arr.slice(1)).reduce(function (acc, perm) {
          return acc.concat(arr.map(function (e, pos) {
              var newPerm = perm.slice();
              newPerm.splice(pos, 0, arr[0]);
              return newPerm;
          }));
      }, []);
  }

  exports.compact = compact;
  exports.permutations = permutations;
  exports.range = range;
  exports.rotate = rotate;
  exports.shuffle = shuffle;
  exports.sortedNoteNames = sortedNoteNames;
  exports.sortedUniqNoteNames = sortedUniqNoteNames;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],3:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord-type'), require('@tonaljs/core'), require('@tonaljs/pcset')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord-type', '@tonaljs/core', '@tonaljs/pcset'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChordDetect = {}, global.chordType, global.core, global.pcset));
}(this, (function (exports, chordType, core, pcset) { 'use strict';

  var namedSet = function (notes) {
      var pcToName = notes.reduce(function (record, n) {
          var chroma = core.note(n).chroma;
          if (chroma !== undefined) {
              record[chroma] = record[chroma] || core.note(n).name;
          }
          return record;
      }, {});
      return function (chroma) { return pcToName[chroma]; };
  };
  function detect(source) {
      var notes = source.map(function (n) { return core.note(n).pc; }).filter(function (x) { return x; });
      if (core.note.length === 0) {
          return [];
      }
      var found = findExactMatches(notes, 1);
      return found
          .filter(function (chord) { return chord.weight; })
          .sort(function (a, b) { return b.weight - a.weight; })
          .map(function (chord) { return chord.name; });
  }
  function findExactMatches(notes, weight) {
      var tonic = notes[0];
      var tonicChroma = core.note(tonic).chroma;
      var noteName = namedSet(notes);
      // we need to test all chormas to get the correct baseNote
      var allModes = pcset.modes(notes, false);
      var found = [];
      allModes.forEach(function (mode, index) {
          // some chords could have the same chroma but different interval spelling
          var chordTypes = chordType.all().filter(function (chordType) { return chordType.chroma === mode; });
          chordTypes.forEach(function (chordType) {
              var chordName = chordType.aliases[0];
              var baseNote = noteName(index);
              var isInversion = index !== tonicChroma;
              if (isInversion) {
                  found.push({
                      weight: 0.5 * weight,
                      name: "" + baseNote + chordName + "/" + tonic,
                  });
              }
              else {
                  found.push({ weight: 1 * weight, name: "" + baseNote + chordName });
              }
          });
      });
      return found;
  }
  var index = { detect: detect };

  exports.default = index;
  exports.detect = detect;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord-type":4,"@tonaljs/core":7,"@tonaljs/pcset":14}],4:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/pcset')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/pcset'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChordType = {}, global.core, global.pcset));
}(this, (function (exports, core, pcset) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @private
     * Chord List
     * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
     * Format: ["intervals", "full name", "abrv1 abrv2"]
     */
    var CHORDS = [
        // ==Major==
        ["1P 3M 5P", "major", "M ^ "],
        ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
        ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
        ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
        ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
        ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 M69"],
        ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
        [
            "1P 3M 5P 7M 11A",
            "major seventh sharp eleventh",
            "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11",
        ],
        // ==Minor==
        // '''Normal'''
        ["1P 3m 5P", "minor", "m min -"],
        ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
        [
            "1P 3m 5P 7M",
            "minor/major seventh",
            "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7",
        ],
        ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
        ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
        ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
        ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
        ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
        // '''Diminished'''
        ["1P 3m 5d", "diminished", "dim ° o"],
        ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
        ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
        // ==Dominant/Seventh==
        // '''Normal'''
        ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
        ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
        ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
        ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
        // '''Altered'''
        ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
        ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
        ["1P 3M 7m 9m", "altered", "alt7"],
        // '''Suspended'''
        ["1P 4P 5P", "suspended fourth", "sus4 sus"],
        ["1P 2M 5P", "suspended second", "sus2"],
        ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
        ["1P 5P 7m 9M 11P", "eleventh", "11"],
        [
            "1P 4P 5P 7m 9m",
            "suspended fourth flat ninth",
            "b9sus phryg 7b9sus 7b9sus4",
        ],
        // ==Other==
        ["1P 5P", "fifth", "5"],
        ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
        ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
        ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
        [
            "1P 3M 5P 7M 9M 11A",
            "major sharp eleventh (lydian)",
            "maj9#11 Δ9#11 ^9#11",
        ],
        // ==Legacy==
        ["1P 2M 4P 5P", "", "sus24 sus4add9"],
        ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
        ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
        ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
        ["1P 3M 5A 7m 9M", "", "9#5 9+"],
        ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
        ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
        ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
        ["1P 3M 5A 9A", "", "+add#9"],
        ["1P 3M 5A 9M", "", "M#5add9 +add9"],
        ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
        ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
        ["1P 3M 5P 6M 9M 11A", "", "69#11"],
        ["1P 3m 5P 6M 9M", "", "m69 -69"],
        ["1P 3M 5P 6m 7m", "", "7b6"],
        ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
        ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
        ["1P 3M 5P 7M 9m", "", "M7b9"],
        ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
        ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
        ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
        ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
        ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
        ["1P 3M 5P 7m 9A 13M", "", "13#9"],
        ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
        ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
        ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
        ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
        ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
        ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
        ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
        ["1P 3M 5P 7m 9m 13M", "", "13b9"],
        ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
        ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
        ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
        ["1P 3M 5P 9m", "", "Maddb9"],
        ["1P 3M 5d", "", "Mb5"],
        ["1P 3M 5d 6M 7m 9M", "", "13b5"],
        ["1P 3M 5d 7M", "", "M7b5"],
        ["1P 3M 5d 7M 9M", "", "M9b5"],
        ["1P 3M 5d 7m", "", "7b5"],
        ["1P 3M 5d 7m 9M", "", "9b5"],
        ["1P 3M 7m", "", "7no5"],
        ["1P 3M 7m 13m", "", "7b13"],
        ["1P 3M 7m 9M", "", "9no5"],
        ["1P 3M 7m 9M 13M", "", "13no5"],
        ["1P 3M 7m 9M 13m", "", "9b13"],
        ["1P 3m 4P 5P", "", "madd4"],
        ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
        ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
        ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
        ["1P 3m 5P 9M", "", "madd9"],
        ["1P 3m 5d 6M 7M", "", "o7M7"],
        ["1P 3m 5d 7M", "", "oM7"],
        ["1P 3m 6m 7M", "", "mb6M7"],
        ["1P 3m 6m 7m", "", "m7#5"],
        ["1P 3m 6m 7m 9M", "", "m9#5"],
        ["1P 3m 5A 7m 9M 11P", "", "m11A"],
        ["1P 3m 6m 9m", "", "mb6b9"],
        ["1P 2M 3m 5d 7m", "", "m9b5"],
        ["1P 4P 5A 7M", "", "M7#5sus4"],
        ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
        ["1P 4P 5A 7m", "", "7#5sus4"],
        ["1P 4P 5P 7M", "", "M7sus4"],
        ["1P 4P 5P 7M 9M", "", "M9sus4"],
        ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
        ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
        ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
        ["1P 4P 7m 10m", "", "4 quartal"],
        ["1P 5P 7m 9m 11P", "", "11b9"],
    ];

    var NoChordType = __assign(__assign({}, pcset.EmptyPcset), { name: "", quality: "Unknown", intervals: [], aliases: [] });
    var dictionary = [];
    var index = {};
    /**
     * Given a chord name or chroma, return the chord properties
     * @param {string} source - chord name or pitch class set chroma
     * @example
     * import { get } from 'tonaljs/chord-type'
     * get('major') // => { name: 'major', ... }
     */
    function get(type) {
        return index[type] || NoChordType;
    }
    var chordType = core.deprecate("ChordType.chordType", "ChordType.get", get);
    /**
     * Get all chord (long) names
     */
    function names() {
        return dictionary.map(function (chord) { return chord.name; }).filter(function (x) { return x; });
    }
    /**
     * Get all chord symbols
     */
    function symbols() {
        return dictionary.map(function (chord) { return chord.aliases[0]; }).filter(function (x) { return x; });
    }
    /**
     * Keys used to reference chord types
     */
    function keys() {
        return Object.keys(index);
    }
    /**
     * Return a list of all chord types
     */
    function all() {
        return dictionary.slice();
    }
    var entries = core.deprecate("ChordType.entries", "ChordType.all", all);
    /**
     * Clear the dictionary
     */
    function removeAll() {
        dictionary = [];
        index = {};
    }
    /**
     * Add a chord to the dictionary.
     * @param intervals
     * @param aliases
     * @param [fullName]
     */
    function add(intervals, aliases, fullName) {
        var quality = getQuality(intervals);
        var chord = __assign(__assign({}, pcset.get(intervals)), { name: fullName || "", quality: quality,
            intervals: intervals,
            aliases: aliases });
        dictionary.push(chord);
        if (chord.name) {
            index[chord.name] = chord;
        }
        index[chord.setNum] = chord;
        index[chord.chroma] = chord;
        chord.aliases.forEach(function (alias) { return addAlias(chord, alias); });
    }
    function addAlias(chord, alias) {
        index[alias] = chord;
    }
    function getQuality(intervals) {
        var has = function (interval) { return intervals.indexOf(interval) !== -1; };
        return has("5A")
            ? "Augmented"
            : has("3M")
                ? "Major"
                : has("5d")
                    ? "Diminished"
                    : has("3m")
                        ? "Minor"
                        : "Unknown";
    }
    CHORDS.forEach(function (_a) {
        var ivls = _a[0], fullName = _a[1], names = _a[2];
        return add(ivls.split(" "), names.split(" "), fullName);
    });
    dictionary.sort(function (a, b) { return a.setNum - b.setNum; });
    var index$1 = {
        names: names,
        symbols: symbols,
        get: get,
        all: all,
        add: add,
        removeAll: removeAll,
        keys: keys,
        // deprecated
        entries: entries,
        chordType: chordType,
    };

    exports.add = add;
    exports.addAlias = addAlias;
    exports.all = all;
    exports.chordType = chordType;
    exports.default = index$1;
    exports.entries = entries;
    exports.get = get;
    exports.keys = keys;
    exports.names = names;
    exports.removeAll = removeAll;
    exports.symbols = symbols;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/pcset":14}],5:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord-detect'), require('@tonaljs/chord-type'), require('@tonaljs/core'), require('@tonaljs/pcset'), require('@tonaljs/scale-type')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord-detect', '@tonaljs/chord-type', '@tonaljs/core', '@tonaljs/pcset', '@tonaljs/scale-type'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Chord = {}, global.chordDetect, global.chordType, global.core, global.pcset, global.scaleType));
}(this, (function (exports, chordDetect, chordType, core, pcset, scaleType) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var NoChord = {
        empty: true,
        name: "",
        symbol: "",
        root: "",
        rootDegree: 0,
        type: "",
        tonic: null,
        setNum: NaN,
        quality: "Unknown",
        chroma: "",
        normalized: "",
        aliases: [],
        notes: [],
        intervals: [],
    };
    // 6, 64, 7, 9, 11 and 13 are consider part of the chord
    // (see https://github.com/danigb/tonal/issues/55)
    var NUM_TYPES = /^(6|64|7|9|11|13)$/;
    /**
     * Tokenize a chord name. It returns an array with the tonic and chord type
     * If not tonic is found, all the name is considered the chord name.
     *
     * This function does NOT check if the chord type exists or not. It only tries
     * to split the tonic and chord type.
     *
     * @function
     * @param {string} name - the chord name
     * @return {Array} an array with [tonic, type]
     * @example
     * tokenize("Cmaj7") // => [ "C", "maj7" ]
     * tokenize("C7") // => [ "C", "7" ]
     * tokenize("mMaj7") // => [ null, "mMaj7" ]
     * tokenize("Cnonsense") // => [ null, "nonsense" ]
     */
    function tokenize(name) {
        var _a = core.tokenizeNote(name), letter = _a[0], acc = _a[1], oct = _a[2], type = _a[3];
        if (letter === "") {
            return ["", name];
        }
        // aug is augmented (see https://github.com/danigb/tonal/issues/55)
        if (letter === "A" && type === "ug") {
            return ["", "aug"];
        }
        // see: https://github.com/tonaljs/tonal/issues/70
        if (!type && (oct === "4" || oct === "5")) {
            return [letter + acc, oct];
        }
        if (NUM_TYPES.test(oct)) {
            return [letter + acc, oct + type];
        }
        else {
            return [letter + acc + oct, type];
        }
    }
    /**
     * Get a Chord from a chord name.
     */
    function get(src) {
        if (src === "") {
            return NoChord;
        }
        if (Array.isArray(src) && src.length === 2) {
            return getChord(src[1], src[0]);
        }
        else {
            var _a = tokenize(src), tonic = _a[0], type = _a[1];
            var chord_1 = getChord(type, tonic);
            return chord_1.empty ? getChord(src) : chord_1;
        }
    }
    /**
     * Get chord properties
     *
     * @param typeName - the chord type name
     * @param [tonic] - Optional tonic
     * @param [root]  - Optional root (requires a tonic)
     */
    function getChord(typeName, optionalTonic, optionalRoot) {
        var type = chordType.get(typeName);
        var tonic = core.note(optionalTonic || "");
        var root = core.note(optionalRoot || "");
        if (type.empty ||
            (optionalTonic && tonic.empty) ||
            (optionalRoot && root.empty)) {
            return NoChord;
        }
        var rootInterval = core.distance(tonic.pc, root.pc);
        var rootDegree = type.intervals.indexOf(rootInterval) + 1;
        if (!root.empty && !rootDegree) {
            return NoChord;
        }
        var intervals = Array.from(type.intervals);
        for (var i = 1; i < rootDegree; i++) {
            var num = intervals[0][0];
            var quality = intervals[0][1];
            var newNum = parseInt(num, 10) + 7;
            intervals.push("" + newNum + quality);
            intervals.shift();
        }
        var notes = tonic.empty
            ? []
            : intervals.map(function (i) { return core.transpose(tonic, i); });
        typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
        var symbol = "" + (tonic.empty ? "" : tonic.pc) + typeName + (root.empty || rootDegree <= 1 ? "" : "/" + root.pc);
        var name = "" + (optionalTonic ? tonic.pc + " " : "") + type.name + (rootDegree > 1 && optionalRoot ? " over " + root.pc : "");
        return __assign(__assign({}, type), { name: name,
            symbol: symbol, type: type.name, root: root.name, intervals: intervals,
            rootDegree: rootDegree, tonic: tonic.name, notes: notes });
    }
    var chord = core.deprecate("Chord.chord", "Chord.get", get);
    /**
     * Transpose a chord name
     *
     * @param {string} chordName - the chord name
     * @return {string} the transposed chord
     *
     * @example
     * transpose('Dm7', 'P4') // => 'Gm7
     */
    function transpose(chordName, interval) {
        var _a = tokenize(chordName), tonic = _a[0], type = _a[1];
        if (!tonic) {
            return chordName;
        }
        return core.transpose(tonic, interval) + type;
    }
    /**
     * Get all scales where the given chord fits
     *
     * @example
     * chordScales('C7b9')
     * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
     */
    function chordScales(name) {
        var s = get(name);
        var isChordIncluded = pcset.isSupersetOf(s.chroma);
        return scaleType.all()
            .filter(function (scale) { return isChordIncluded(scale.chroma); })
            .map(function (scale) { return scale.name; });
    }
    /**
     * Get all chords names that are a superset of the given one
     * (has the same notes and at least one more)
     *
     * @function
     * @example
     * extended("CMaj7")
     * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
     */
    function extended(chordName) {
        var s = get(chordName);
        var isSuperset = pcset.isSupersetOf(s.chroma);
        return chordType.all()
            .filter(function (chord) { return isSuperset(chord.chroma); })
            .map(function (chord) { return s.tonic + chord.aliases[0]; });
    }
    /**
     * Find all chords names that are a subset of the given one
     * (has less notes but all from the given chord)
     *
     * @example
     */
    function reduced(chordName) {
        var s = get(chordName);
        var isSubset = pcset.isSubsetOf(s.chroma);
        return chordType.all()
            .filter(function (chord) { return isSubset(chord.chroma); })
            .map(function (chord) { return s.tonic + chord.aliases[0]; });
    }
    var index = {
        getChord: getChord,
        get: get,
        detect: chordDetect.detect,
        chordScales: chordScales,
        extended: extended,
        reduced: reduced,
        tokenize: tokenize,
        transpose: transpose,
        // deprecate
        chord: chord,
    };

    Object.defineProperty(exports, 'detect', {
        enumerable: true,
        get: function () {
            return chordDetect.detect;
        }
    });
    exports.chord = chord;
    exports.chordScales = chordScales;
    exports.default = index;
    exports.extended = extended;
    exports.get = get;
    exports.getChord = getChord;
    exports.reduced = reduced;
    exports.tokenize = tokenize;
    exports.transpose = transpose;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord-detect":3,"@tonaljs/chord-type":4,"@tonaljs/core":7,"@tonaljs/pcset":14,"@tonaljs/scale-type":18}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Collection = {}));
}(this, (function (exports) { 'use strict';

  // ascending range
  function ascR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = n + b)
          ;
      return a;
  }
  // descending range
  function descR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = b - n)
          ;
      return a;
  }
  /**
   * Creates a numeric range
   *
   * @param {number} from
   * @param {number} to
   * @return {Array<number>}
   *
   * @example
   * range(-2, 2) // => [-2, -1, 0, 1, 2]
   * range(2, -2) // => [2, 1, 0, -1, -2]
   */
  function range(from, to) {
      return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
  }
  /**
   * Rotates a list a number of times. It"s completly agnostic about the
   * contents of the list.
   *
   * @param {Integer} times - the number of rotations
   * @param {Array} collection
   * @return {Array} the rotated collection
   *
   * @example
   * rotate(1, [1, 2, 3]) // => [2, 3, 1]
   */
  function rotate(times, arr) {
      var len = arr.length;
      var n = ((times % len) + len) % len;
      return arr.slice(n, len).concat(arr.slice(0, n));
  }
  /**
   * Return a copy of the collection with the null values removed
   * @function
   * @param {Array} collection
   * @return {Array}
   *
   * @example
   * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
   */
  function compact(arr) {
      return arr.filter(function (n) { return n === 0 || n; });
  }
  /**
   * Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.
   *
   * @function
   * @param {Array} collection
   * @return {Array} the collection shuffled
   *
   * @example
   * shuffle(["C", "D", "E", "F"]) // => [...]
   */
  function shuffle(arr, rnd) {
      if (rnd === void 0) { rnd = Math.random; }
      var i;
      var t;
      var m = arr.length;
      while (m) {
          i = Math.floor(rnd() * m--);
          t = arr[m];
          arr[m] = arr[i];
          arr[i] = t;
      }
      return arr;
  }
  /**
   * Get all permutations of an collection
   *
   * @param {Array} collection - the collection
   * @return {Array<Array>} an collection with all the permutations
   * @example
   * permutations(["a", "b", "c"])) // =>
   * [
   *   ["a", "b", "c"],
   *   ["b", "a", "c"],
   *   ["b", "c", "a"],
   *   ["a", "c", "b"],
   *   ["c", "a", "b"],
   *   ["c", "b", "a"]
   * ]
   */
  function permutations(arr) {
      if (arr.length === 0) {
          return [[]];
      }
      return permutations(arr.slice(1)).reduce(function (acc, perm) {
          return acc.concat(arr.map(function (e, pos) {
              var newPerm = perm.slice();
              newPerm.splice(pos, 0, arr[0]);
              return newPerm;
          }));
      }, []);
  }
  var index = {
      compact: compact,
      permutations: permutations,
      range: range,
      rotate: rotate,
      shuffle: shuffle,
  };

  exports.compact = compact;
  exports.default = index;
  exports.permutations = permutations;
  exports.range = range;
  exports.rotate = rotate;
  exports.shuffle = shuffle;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],7:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Core = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Fill a string with a repeated character
   *
   * @param character
   * @param repetition
   */
  var fillStr = function (s, n) { return Array(Math.abs(n) + 1).join(s); };
  function deprecate(original, alternative, fn) {
      return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          // tslint:disable-next-line
          console.warn(original + " is deprecated. Use " + alternative + ".");
          return fn.apply(this, args);
      };
  }

  function isNamed(src) {
      return src !== null && typeof src === "object" && typeof src.name === "string"
          ? true
          : false;
  }

  function isPitch(pitch) {
      return pitch !== null &&
          typeof pitch === "object" &&
          typeof pitch.step === "number" &&
          typeof pitch.alt === "number"
          ? true
          : false;
  }
  // The number of fifths of [C, D, E, F, G, A, B]
  var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
  // The number of octaves it span each step
  var STEPS_TO_OCTS = FIFTHS.map(function (fifths) {
      return Math.floor((fifths * 7) / 12);
  });
  function encode(pitch) {
      var step = pitch.step, alt = pitch.alt, oct = pitch.oct, _a = pitch.dir, dir = _a === void 0 ? 1 : _a;
      var f = FIFTHS[step] + 7 * alt;
      if (oct === undefined) {
          return [dir * f];
      }
      var o = oct - STEPS_TO_OCTS[step] - 4 * alt;
      return [dir * f, dir * o];
  }
  // We need to get the steps from fifths
  // Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
  // We add 1 to fifths to avoid negative numbers, so:
  // for ["F", "C", "G", "D", "A", "E", "B"] we have:
  var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
  function decode(coord) {
      var f = coord[0], o = coord[1], dir = coord[2];
      var step = FIFTHS_TO_STEPS[unaltered(f)];
      var alt = Math.floor((f + 1) / 7);
      if (o === undefined) {
          return { step: step, alt: alt, dir: dir };
      }
      var oct = o + 4 * alt + STEPS_TO_OCTS[step];
      return { step: step, alt: alt, oct: oct, dir: dir };
  }
  // Return the number of fifths as if it were unaltered
  function unaltered(f) {
      var i = (f + 1) % 7;
      return i < 0 ? 7 + i : i;
  }

  var NoNote = { empty: true, name: "", pc: "", acc: "" };
  var cache = new Map();
  var stepToLetter = function (step) { return "CDEFGAB".charAt(step); };
  var altToAcc = function (alt) {
      return alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
  };
  var accToAlt = function (acc) {
      return acc[0] === "b" ? -acc.length : acc.length;
  };
  /**
   * Given a note literal (a note name or a note object), returns the Note object
   * @example
   * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
   */
  function note(src) {
      var cached = cache.get(src);
      if (cached) {
          return cached;
      }
      var value = typeof src === "string"
          ? parse(src)
          : isPitch(src)
              ? note(pitchName(src))
              : isNamed(src)
                  ? note(src.name)
                  : NoNote;
      cache.set(src, value);
      return value;
  }
  var REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  /**
   * @private
   */
  function tokenizeNote(str) {
      var m = REGEX.exec(str);
      return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
  }
  /**
   * @private
   */
  function coordToNote(noteCoord) {
      return note(decode(noteCoord));
  }
  var mod = function (n, m) { return ((n % m) + m) % m; };
  var SEMI = [0, 2, 4, 5, 7, 9, 11];
  function parse(noteName) {
      var tokens = tokenizeNote(noteName);
      if (tokens[0] === "" || tokens[3] !== "") {
          return NoNote;
      }
      var letter = tokens[0];
      var acc = tokens[1];
      var octStr = tokens[2];
      var step = (letter.charCodeAt(0) + 3) % 7;
      var alt = accToAlt(acc);
      var oct = octStr.length ? +octStr : undefined;
      var coord = encode({ step: step, alt: alt, oct: oct });
      var name = letter + acc + octStr;
      var pc = letter + acc;
      var chroma = (SEMI[step] + alt + 120) % 12;
      var height = oct === undefined
          ? mod(SEMI[step] + alt, 12) - 12 * 99
          : SEMI[step] + alt + 12 * (oct + 1);
      var midi = height >= 0 && height <= 127 ? height : null;
      var freq = oct === undefined ? null : Math.pow(2, (height - 69) / 12) * 440;
      return {
          empty: false,
          acc: acc,
          alt: alt,
          chroma: chroma,
          coord: coord,
          freq: freq,
          height: height,
          letter: letter,
          midi: midi,
          name: name,
          oct: oct,
          pc: pc,
          step: step,
      };
  }
  function pitchName(props) {
      var step = props.step, alt = props.alt, oct = props.oct;
      var letter = stepToLetter(step);
      if (!letter) {
          return "";
      }
      var pc = letter + altToAcc(alt);
      return oct || oct === 0 ? pc + oct : pc;
  }

  var NoInterval = { empty: true, name: "", acc: "" };
  // shorthand tonal notation (with quality after number)
  var INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  // standard shorthand notation (with quality before number)
  var INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX$1 = new RegExp("^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$");
  /**
   * @private
   */
  function tokenizeInterval(str) {
      var m = REGEX$1.exec("" + str);
      if (m === null) {
          return ["", ""];
      }
      return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache$1 = {};
  /**
   * Get interval properties. It returns an object with:
   *
   * - name: the interval name
   * - num: the interval number
   * - type: 'perfectable' or 'majorable'
   * - q: the interval quality (d, m, M, A)
   * - dir: interval direction (1 ascending, -1 descending)
   * - simple: the simplified number
   * - semitones: the size in semitones
   * - chroma: the interval chroma
   *
   * @param {string} interval - the interval name
   * @return {Object} the interval properties
   *
   * @example
   * import { interval } from '@tonaljs/core'
   * interval('P5').semitones // => 7
   * interval('m3').type // => 'majorable'
   */
  function interval(src) {
      return typeof src === "string"
          ? cache$1[src] || (cache$1[src] = parse$1(src))
          : isPitch(src)
              ? interval(pitchName$1(src))
              : isNamed(src)
                  ? interval(src.name)
                  : NoInterval;
  }
  var SIZES = [0, 2, 4, 5, 7, 9, 11];
  var TYPES = "PMMPPMM";
  function parse$1(str) {
      var tokens = tokenizeInterval(str);
      if (tokens[0] === "") {
          return NoInterval;
      }
      var num = +tokens[0];
      var q = tokens[1];
      var step = (Math.abs(num) - 1) % 7;
      var t = TYPES[step];
      if (t === "M" && q === "P") {
          return NoInterval;
      }
      var type = t === "M" ? "majorable" : "perfectable";
      var name = "" + num + q;
      var dir = num < 0 ? -1 : 1;
      var simple = num === 8 || num === -8 ? num : dir * (step + 1);
      var alt = qToAlt(type, q);
      var oct = Math.floor((Math.abs(num) - 1) / 7);
      var semitones = dir * (SIZES[step] + alt + 12 * oct);
      var chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12;
      var coord = encode({ step: step, alt: alt, oct: oct, dir: dir });
      return {
          empty: false,
          name: name,
          num: num,
          q: q,
          step: step,
          alt: alt,
          dir: dir,
          type: type,
          simple: simple,
          semitones: semitones,
          chroma: chroma,
          coord: coord,
          oct: oct,
      };
  }
  /**
   * @private
   */
  function coordToInterval(coord) {
      var f = coord[0], _a = coord[1], o = _a === void 0 ? 0 : _a;
      var isDescending = f * 7 + o * 12 < 0;
      var ivl = isDescending ? [-f, -o, -1] : [f, o, 1];
      return interval(decode(ivl));
  }
  function qToAlt(type, q) {
      return (q === "M" && type === "majorable") ||
          (q === "P" && type === "perfectable")
          ? 0
          : q === "m" && type === "majorable"
              ? -1
              : /^A+$/.test(q)
                  ? q.length
                  : /^d+$/.test(q)
                      ? -1 * (type === "perfectable" ? q.length : q.length + 1)
                      : 0;
  }
  // return the interval name of a pitch
  function pitchName$1(props) {
      var step = props.step, alt = props.alt, _a = props.oct, oct = _a === void 0 ? 0 : _a, dir = props.dir;
      if (!dir) {
          return "";
      }
      var num = step + 1 + 7 * oct;
      var d = dir < 0 ? "-" : "";
      var type = TYPES[step] === "M" ? "majorable" : "perfectable";
      var name = d + num + altToQ(type, alt);
      return name;
  }
  function altToQ(type, alt) {
      if (alt === 0) {
          return type === "majorable" ? "M" : "P";
      }
      else if (alt === -1 && type === "majorable") {
          return "m";
      }
      else if (alt > 0) {
          return fillStr("A", alt);
      }
      else {
          return fillStr("d", type === "perfectable" ? alt : alt + 1);
      }
  }

  /**
   * Transpose a note by an interval.
   *
   * @param {string} note - the note or note name
   * @param {string} interval - the interval or interval name
   * @return {string} the transposed note name or empty string if not valid notes
   * @example
   * import { tranpose } from "@tonaljs/core"
   * transpose("d3", "3M") // => "F#3"
   * transpose("D", "3M") // => "F#"
   * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
   */
  function transpose(noteName, intervalName) {
      var note$1 = note(noteName);
      var interval$1 = interval(intervalName);
      if (note$1.empty || interval$1.empty) {
          return "";
      }
      var noteCoord = note$1.coord;
      var intervalCoord = interval$1.coord;
      var tr = noteCoord.length === 1
          ? [noteCoord[0] + intervalCoord[0]]
          : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
      return coordToNote(tr).name;
  }
  /**
   * Find the interval distance between two notes or coord classes.
   *
   * To find distance between coord classes, both notes must be coord classes and
   * the interval is always ascending
   *
   * @param {Note|string} from - the note or note name to calculate distance from
   * @param {Note|string} to - the note or note name to calculate distance to
   * @return {string} the interval name or empty string if not valid notes
   *
   */
  function distance(fromNote, toNote) {
      var from = note(fromNote);
      var to = note(toNote);
      if (from.empty || to.empty) {
          return "";
      }
      var fcoord = from.coord;
      var tcoord = to.coord;
      var fifths = tcoord[0] - fcoord[0];
      var octs = fcoord.length === 2 && tcoord.length === 2
          ? tcoord[1] - fcoord[1]
          : -Math.floor((fifths * 7) / 12);
      return coordToInterval([fifths, octs]).name;
  }

  exports.accToAlt = accToAlt;
  exports.altToAcc = altToAcc;
  exports.coordToInterval = coordToInterval;
  exports.coordToNote = coordToNote;
  exports.decode = decode;
  exports.deprecate = deprecate;
  exports.distance = distance;
  exports.encode = encode;
  exports.fillStr = fillStr;
  exports.interval = interval;
  exports.isNamed = isNamed;
  exports.isPitch = isPitch;
  exports.note = note;
  exports.stepToLetter = stepToLetter;
  exports.tokenizeInterval = tokenizeInterval;
  exports.tokenizeNote = tokenizeNote;
  exports.transpose = transpose;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],8:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.DurationValue = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // source: https://en.wikipedia.org/wiki/Note_value
    var DATA = [
        [
            0.125,
            "dl",
            ["large", "duplex longa", "maxima", "octuple", "octuple whole"],
        ],
        [0.25, "l", ["long", "longa"]],
        [0.5, "d", ["double whole", "double", "breve"]],
        [1, "w", ["whole", "semibreve"]],
        [2, "h", ["half", "minim"]],
        [4, "q", ["quarter", "crotchet"]],
        [8, "e", ["eighth", "quaver"]],
        [16, "s", ["sixteenth", "semiquaver"]],
        [32, "t", ["thirty-second", "demisemiquaver"]],
        [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
        [128, "h", ["hundred twenty-eighth"]],
        [256, "th", ["two hundred fifty-sixth"]],
    ];

    var VALUES = [];
    DATA.forEach(function (_a) {
        var denominator = _a[0], shorthand = _a[1], names = _a[2];
        return add(denominator, shorthand, names);
    });
    var NoDuration = {
        empty: true,
        name: "",
        value: 0,
        fraction: [0, 0],
        shorthand: "",
        dots: "",
        names: [],
    };
    function names() {
        return VALUES.reduce(function (names, duration) {
            duration.names.forEach(function (name) { return names.push(name); });
            return names;
        }, []);
    }
    function shorthands() {
        return VALUES.map(function (dur) { return dur.shorthand; });
    }
    var REGEX = /^([^.]+)(\.*)$/;
    function get(name) {
        var _a = REGEX.exec(name) || [], _ = _a[0], simple = _a[1], dots = _a[2];
        var base = VALUES.find(function (dur) { return dur.shorthand === simple || dur.names.includes(simple); });
        if (!base) {
            return NoDuration;
        }
        var fraction = calcDots(base.fraction, dots.length);
        var value = fraction[0] / fraction[1];
        return __assign(__assign({}, base), { name: name, dots: dots, value: value, fraction: fraction });
    }
    var value = function (name) { return get(name).value; };
    var fraction = function (name) { return get(name).fraction; };
    var index = { names: names, shorthands: shorthands, get: get, value: value, fraction: fraction };
    //// PRIVATE ////
    function add(denominator, shorthand, names) {
        VALUES.push({
            empty: false,
            dots: "",
            name: "",
            value: 1 / denominator,
            fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
            shorthand: shorthand,
            names: names,
        });
    }
    function calcDots(fraction, dots) {
        var pow = Math.pow(2, dots);
        var numerator = fraction[0] * pow;
        var denominator = fraction[1] * pow;
        var base = numerator;
        // add fractions
        for (var i = 0; i < dots; i++) {
            numerator += base / Math.pow(2, i + 1);
        }
        // simplify
        while (numerator % 2 === 0 && denominator % 2 === 0) {
            numerator /= 2;
            denominator /= 2;
        }
        return [numerator, denominator];
    }

    exports.default = index;
    exports.fraction = fraction;
    exports.get = get;
    exports.names = names;
    exports.shorthands = shorthands;
    exports.value = value;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],9:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = global || self, factory(global.Interval = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  /**
   * Get the natural list of names
   */
  function names() {
      return "1P 2M 3M 4P 5P 6m 7m".split(" ");
  }
  /**
   * Get properties of an interval
   *
   * @function
   * @example
   * Interval.get('P4') // => {"alt": 0,  "dir": 1,  "name": "4P", "num": 4, "oct": 0, "q": "P", "semitones": 5, "simple": 4, "step": 3, "type": "perfectable"}
   */
  var get = core.interval;
  /**
   * Get name of an interval
   *
   * @function
   * @example
   * Interval.name('4P') // => "4P"
   * Interval.name('P4') // => "4P"
   * Interval.name('C4') // => ""
   */
  var name = function (name) { return core.interval(name).name; };
  /**
   * Get semitones of an interval
   * @function
   * @example
   * Interval.semitones('P4') // => 5
   */
  var semitones = function (name) { return core.interval(name).semitones; };
  /**
   * Get quality of an interval
   * @function
   * @example
   * Interval.quality('P4') // => "P"
   */
  var quality = function (name) { return core.interval(name).q; };
  /**
   * Get number of an interval
   * @function
   * @example
   * Interval.num('P4') // => 4
   */
  var num = function (name) { return core.interval(name).num; };
  /**
   * Get the simplified version of an interval.
   *
   * @function
   * @param {string} interval - the interval to simplify
   * @return {string} the simplified interval
   *
   * @example
   * Interval.simplify("9M") // => "2M"
   * Interval.simplify("2M") // => "2M"
   * Interval.simplify("-2M") // => "7m"
   * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
   * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
   */
  function simplify(name) {
      var i = core.interval(name);
      return i.empty ? "" : i.simple + i.q;
  }
  /**
   * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
   * of an interval.
   *
   * @function
   * @param {string} interval - the interval to invert in interval shorthand
   * notation or interval array notation
   * @return {string} the inverted interval
   *
   * @example
   * Interval.invert("3m") // => "6M"
   * Interval.invert("2M") // => "7m"
   */
  function invert(name) {
      var i = core.interval(name);
      if (i.empty) {
          return "";
      }
      var step = (7 - i.step) % 7;
      var alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
      return core.interval({ step: step, alt: alt, oct: i.oct, dir: i.dir }).name;
  }
  // interval numbers
  var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
  // interval qualities
  var IQ = "P m M m M P d P m M m M".split(" ");
  /**
   * Get interval name from semitones number. Since there are several interval
   * names for the same number, the name it's arbitrary, but deterministic.
   *
   * @param {Integer} num - the number of semitones (can be negative)
   * @return {string} the interval name
   * @example
   * Interval.fromSemitones(7) // => "5P"
   * Interval.fromSemitones(-7) // => "-5P"
   */
  function fromSemitones(semitones) {
      var d = semitones < 0 ? -1 : 1;
      var n = Math.abs(semitones);
      var c = n % 12;
      var o = Math.floor(n / 12);
      return d * (IN[c] + 7 * o) + IQ[c];
  }
  /**
   * Find interval between two notes
   *
   * @example
   * Interval.distance("C4", "G4"); // => "5P"
   */
  var distance = core.distance;
  /**
   * Adds two intervals
   *
   * @function
   * @param {string} interval1
   * @param {string} interval2
   * @return {string} the added interval name
   * @example
   * Interval.add("3m", "5P") // => "7m"
   */
  var add = combinator(function (a, b) { return [a[0] + b[0], a[1] + b[1]]; });
  /**
   * Returns a function that adds an interval
   *
   * @function
   * @example
   * ['1P', '2M', '3M'].map(Interval.addTo('5P')) // => ["5P", "6M", "7M"]
   */
  var addTo = function (interval) { return function (other) {
      return add(interval, other);
  }; };
  /**
   * Subtracts two intervals
   *
   * @function
   * @param {string} minuendInterval
   * @param {string} subtrahendInterval
   * @return {string} the substracted interval name
   * @example
   * Interval.substract('5P', '3M') // => '3m'
   * Interval.substract('3M', '5P') // => '-3m'
   */
  var substract = combinator(function (a, b) { return [a[0] - b[0], a[1] - b[1]]; });
  var index = {
      names: names,
      get: get,
      name: name,
      num: num,
      semitones: semitones,
      quality: quality,
      fromSemitones: fromSemitones,
      distance: distance,
      invert: invert,
      simplify: simplify,
      add: add,
      addTo: addTo,
      substract: substract,
  };
  function combinator(fn) {
      return function (a, b) {
          var coordA = core.interval(a).coord;
          var coordB = core.interval(b).coord;
          if (coordA && coordB) {
              var coord = fn(coordA, coordB);
              return core.coordToInterval(coord).name;
          }
      };
  }

  exports.add = add;
  exports.addTo = addTo;
  exports.default = index;
  exports.distance = distance;
  exports.fromSemitones = fromSemitones;
  exports.get = get;
  exports.invert = invert;
  exports.name = name;
  exports.names = names;
  exports.num = num;
  exports.quality = quality;
  exports.semitones = semitones;
  exports.simplify = simplify;
  exports.substract = substract;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],10:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/note'), require('@tonaljs/roman-numeral')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/note', '@tonaljs/roman-numeral'], factory) :
    (global = global || self, factory(global.Key = {}, global.core, global.note, global.romanNumeral));
}(this, (function (exports, core, note, romanNumeral) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var mapToScale = function (scale) { return function (symbols, sep) {
        if (sep === void 0) { sep = ""; }
        return symbols.map(function (symbol, index) {
            return symbol !== "-" ? scale[index] + sep + symbol : "";
        });
    }; };
    function keyScale(gradesLiteral, chordsLiteral, hfLiteral, chordScalesLiteral) {
        return function (tonic) {
            var grades = gradesLiteral.split(" ");
            var intervals = grades.map(function (gr) { return romanNumeral.get(gr).interval || ""; });
            var scale = intervals.map(function (interval) { return core.transpose(tonic, interval); });
            var map = mapToScale(scale);
            return {
                tonic: tonic,
                grades: grades,
                intervals: intervals,
                scale: scale,
                chords: map(chordsLiteral.split(" ")),
                chordsHarmonicFunction: hfLiteral.split(" "),
                chordScales: map(chordScalesLiteral.split(","), " "),
            };
        };
    }
    var distInFifths = function (from, to) {
        var f = core.note(from);
        var t = core.note(to);
        return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
    };
    var MajorScale = keyScale("I II III IV V VI VII", "maj7 m7 m7 maj7 7 m7 m7b5", "T SD T SD D T D", "major,dorian,phrygian,lydian,mixolydian,minor,locrian");
    var NaturalScale = keyScale("I II bIII IV V bVI bVII", "m7 m7b5 maj7 m7 m7 maj7 7", "T SD T SD D SD SD", "minor,locrian,major,dorian,phrygian,lydian,mixolydian");
    var HarmonicScale = keyScale("I II bIII IV V bVI VII", "mmaj7 m7b5 +maj7 m7 7 maj7 mo7", "T SD T SD D SD D", "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian");
    var MelodicScale = keyScale("I II bIII IV V VI VII", "m6 m7 +maj7 7 7 m7b5 m7b5", "T SD T SD D - -", "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered");
    /**
     * Get a major key properties in a given tonic
     * @param tonic
     */
    function majorKey(tonic) {
        var keyScale = MajorScale(tonic);
        var alteration = distInFifths("C", tonic);
        var map = mapToScale(keyScale.scale);
        return __assign(__assign({}, keyScale), { type: "major", minorRelative: core.transpose(tonic, "-3m"), alteration: alteration, keySignature: core.altToAcc(alteration), secondaryDominants: map("- VI7 VII7 I7 II7 III7 -".split(" ")), secondaryDominantsMinorRelative: map("- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ")), substituteDominants: map("- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ")), substituteDominantsMinorRelative: map("- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ")) });
    }
    /**
     * Get minor key properties in a given tonic
     * @param tonic
     */
    function minorKey(tonic) {
        var alteration = distInFifths("C", tonic) - 3;
        return {
            type: "minor",
            tonic: tonic,
            relativeMajor: core.transpose(tonic, "3m"),
            alteration: alteration,
            keySignature: core.altToAcc(alteration),
            natural: NaturalScale(tonic),
            harmonic: HarmonicScale(tonic),
            melodic: MelodicScale(tonic),
        };
    }
    /**
     * Given a key signature, returns the tonic of the major key
     * @param sigature
     * @example
     * majorTonicFromKeySignature('###') // => 'A'
     */
    function majorTonicFromKeySignature(sig) {
        if (typeof sig === "number") {
            return note.transposeFifths("C", sig);
        }
        else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
            return note.transposeFifths("C", core.accToAlt(sig));
        }
        return null;
    }
    var index = { majorKey: majorKey, majorTonicFromKeySignature: majorTonicFromKeySignature, minorKey: minorKey };

    exports.default = index;
    exports.majorKey = majorKey;
    exports.majorTonicFromKeySignature = majorTonicFromKeySignature;
    exports.minorKey = minorKey;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/note":13,"@tonaljs/roman-numeral":17}],11:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = global || self, factory(global.Midi = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  function isMidi(arg) {
      return +arg >= 0 && +arg <= 127;
  }
  /**
   * Get the note midi number (a number between 0 and 127)
   *
   * It returns undefined if not valid note name
   *
   * @function
   * @param {string|number} note - the note name or midi number
   * @return {Integer} the midi number or undefined if not valid note
   * @example
   * import { toMidi } from '@tonaljs/midi'
   * toMidi("C4") // => 60
   * toMidi(60) // => 60
   * toMidi('60') // => 60
   */
  function toMidi(note) {
      if (isMidi(note)) {
          return +note;
      }
      var n = core.note(note);
      return n.empty ? null : n.midi;
  }
  /**
   * Get the frequency in hertzs from midi number
   *
   * @param {number} midi - the note midi number
   * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
   * @return {number} the frequency or null if not valid note midi
   * @example
   * import { midiToFreq} from '@tonaljs/midi'
   * midiToFreq(69) // => 440
   */
  function midiToFreq(midi, tuning) {
      if (tuning === void 0) { tuning = 440; }
      return Math.pow(2, (midi - 69) / 12) * tuning;
  }
  var L2 = Math.log(2);
  var L440 = Math.log(440);
  /**
   * Get the midi number from a frequency in hertz. The midi number can
   * contain decimals (with two digits precission)
   *
   * @param {number} frequency
   * @return {number}
   * @example
   * import { freqToMidi} from '@tonaljs/midi'
   * freqToMidi(220)); //=> 57
   * freqToMidi(261.62)); //=> 60
   * freqToMidi(261)); //=> 59.96
   */
  function freqToMidi(freq) {
      var v = (12 * (Math.log(freq) - L440)) / L2 + 69;
      return Math.round(v * 100) / 100;
  }
  var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
  var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
  /**
   * Given a midi number, returns a note name. The altered notes will have
   * flats unless explicitly set with the optional `useSharps` parameter.
   *
   * @function
   * @param {number} midi - the midi note number
   * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
   * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
   * @return {string} the note name
   * @example
   * import { midiToNoteName } from '@tonaljs/midi'
   * midiToNoteName(61) // => "Db4"
   * midiToNoteName(61, { pitchClass: true }) // => "Db"
   * midiToNoteName(61, { sharps: true }) // => "C#4"
   * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
   * // it rounds to nearest note
   * midiToNoteName(61.7) // => "D4"
   */
  function midiToNoteName(midi, options) {
      if (options === void 0) { options = {}; }
      if (isNaN(midi) || midi === -Infinity || midi === Infinity)
          return "";
      midi = Math.round(midi);
      var pcs = options.sharps === true ? SHARPS : FLATS;
      var pc = pcs[midi % 12];
      if (options.pitchClass) {
          return pc;
      }
      var o = Math.floor(midi / 12) - 1;
      return pc + o;
  }
  var index = { isMidi: isMidi, toMidi: toMidi, midiToFreq: midiToFreq, midiToNoteName: midiToNoteName, freqToMidi: freqToMidi };

  exports.default = index;
  exports.freqToMidi = freqToMidi;
  exports.isMidi = isMidi;
  exports.midiToFreq = midiToFreq;
  exports.midiToNoteName = midiToNoteName;
  exports.toMidi = toMidi;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],12:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/pcset')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/pcset'], factory) :
    (global = global || self, factory(global.Mode = {}, global.core, global.pcset));
}(this, (function (exports, core, pcset) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var DATA = [
        [0, 2773, 0, "ionian", "", "Maj7", "major"],
        [1, 2902, 2, "dorian", "m", "m7"],
        [2, 3418, 4, "phrygian", "m", "m7"],
        [3, 2741, -1, "lydian", "", "Maj7"],
        [4, 2774, 1, "mixolydian", "", "7"],
        [5, 2906, 3, "aeolian", "m", "m7", "minor"],
        [6, 3434, 5, "locrian", "dim", "m7b5"],
    ];

    var NoMode = __assign(__assign({}, pcset.EmptyPcset), { name: "", alt: 0, modeNum: NaN, triad: "", seventh: "", aliases: [] });
    var modes = DATA.map(toMode);
    var index = {};
    modes.forEach(function (mode) {
        index[mode.name] = mode;
        mode.aliases.forEach(function (alias) {
            index[alias] = mode;
        });
    });
    /**
     * Get a Mode by it's name
     *
     * @example
     * get('dorian')
     * // =>
     * // {
     * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
     * //   modeNum: 1,
     * //   chroma: '101101010110',
     * //   normalized: '101101010110',
     * //   name: 'dorian',
     * //   setNum: 2902,
     * //   alt: 2,
     * //   triad: 'm',
     * //   seventh: 'm7',
     * //   aliases: []
     * // }
     */
    function get(name) {
        return typeof name === "string"
            ? index[name.toLowerCase()] || NoMode
            : name && name.name
                ? get(name.name)
                : NoMode;
    }
    var mode = core.deprecate("Mode.mode", "Mode.get", get);
    /**
     * Get a list of all modes
     */
    function all() {
        return modes.slice();
    }
    var entries = core.deprecate("Mode.mode", "Mode.all", all);
    /**
     * Get a list of all mode names
     */
    function names() {
        return modes.map(function (mode) { return mode.name; });
    }
    function toMode(mode) {
        var modeNum = mode[0], setNum = mode[1], alt = mode[2], name = mode[3], triad = mode[4], seventh = mode[5], alias = mode[6];
        var aliases = alias ? [alias] : [];
        var chroma = Number(setNum).toString(2);
        var intervals = pcset.chromaToIntervals(chroma);
        return {
            empty: false,
            intervals: intervals,
            modeNum: modeNum,
            chroma: chroma,
            normalized: chroma,
            name: name,
            setNum: setNum,
            alt: alt,
            triad: triad,
            seventh: seventh,
            aliases: aliases,
        };
    }
    var index$1 = {
        get: get,
        names: names,
        all: all,
        // deprecated
        entries: entries,
        mode: mode,
    };

    exports.all = all;
    exports.default = index$1;
    exports.entries = entries;
    exports.get = get;
    exports.mode = mode;
    exports.names = names;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/pcset":14}],13:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/midi')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/midi'], factory) :
  (global = global || self, factory(global.Note = {}, global.core, global.midi$1));
}(this, (function (exports, core, midi$1) { 'use strict';

  var NAMES = ["C", "D", "E", "F", "G", "A", "B"];
  var toName = function (n) { return n.name; };
  var onlyNotes = function (array) {
      return array.map(core.note).filter(function (n) { return !n.empty; });
  };
  /**
   * Return the natural note names without octave
   * @function
   * @example
   * Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
   */
  function names(array) {
      if (array === undefined) {
          return NAMES.slice();
      }
      else if (!Array.isArray(array)) {
          return [];
      }
      else {
          return onlyNotes(array).map(toName);
      }
  }
  /**
   * Get a note from a note name
   *
   * @function
   * @example
   * Note.get('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
   */
  var get = core.note;
  /**
   * Get the note name
   * @function
   */
  var name = function (note) { return get(note).name; };
  /**
   * Get the note pitch class name
   * @function
   */
  var pitchClass = function (note) { return get(note).pc; };
  /**
   * Get the note accidentals
   * @function
   */
  var accidentals = function (note) { return get(note).acc; };
  /**
   * Get the note octave
   * @function
   */
  var octave = function (note) { return get(note).oct; };
  /**
   * Get the note midi
   * @function
   */
  var midi = function (note) { return get(note).midi; };
  /**
   * Get the note midi
   * @function
   */
  var freq = function (note) { return get(note).freq; };
  /**
   * Get the note chroma
   * @function
   */
  var chroma = function (note) { return get(note).chroma; };
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   *
   * @function
   * @param {number} midi - the midi note number
   * @return {string} the note name
   * @example
   * Note.fromMidi(61) // => "Db4"
   * Note.fromMidi(61.7) // => "D4"
   */
  function fromMidi(midi) {
      return midi$1.midiToNoteName(midi);
  }
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   */
  function fromFreq(freq) {
      return midi$1.midiToNoteName(midi$1.freqToMidi(freq));
  }
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   */
  function fromFreqSharps(freq) {
      return midi$1.midiToNoteName(midi$1.freqToMidi(freq), { sharps: true });
  }
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   *
   * @function
   * @param {number} midi - the midi note number
   * @return {string} the note name
   * @example
   * Note.fromMidiSharps(61) // => "C#4"
   */
  function fromMidiSharps(midi) {
      return midi$1.midiToNoteName(midi, { sharps: true });
  }
  /**
   * Transpose a note by an interval
   */
  var transpose = core.transpose;
  var tr = core.transpose;
  /**
   * Transpose by an interval.
   * @function
   * @param {string} interval
   * @return {function} a function that transposes by the given interval
   * @example
   * ["C", "D", "E"].map(Note.transposeBy("5P"));
   * // => ["G", "A", "B"]
   */
  var transposeBy = function (interval) { return function (note) {
      return transpose(note, interval);
  }; };
  var trBy = transposeBy;
  /**
   * Transpose from a note
   * @function
   * @param {string} note
   * @return {function}  a function that transposes the the note by an interval
   * ["1P", "3M", "5P"].map(Note.transposeFrom("C"));
   * // => ["C", "E", "G"]
   */
  var transposeFrom = function (note) { return function (interval) {
      return transpose(note, interval);
  }; };
  var trFrom = transposeFrom;
  /**
   * Transpose a note by a number of perfect fifths.
   *
   * @function
   * @param {string} note - the note name
   * @param {number} fifhts - the number of fifths
   * @return {string} the transposed note name
   *
   * @example
   * import { transposeFifths } from "@tonaljs/note"
   * transposeFifths("G4", 1) // => "D"
   * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
   */
  function transposeFifths(noteName, fifths) {
      var note = get(noteName);
      if (note.empty) {
          return "";
      }
      var _a = note.coord, nFifths = _a[0], nOcts = _a[1];
      var transposed = nOcts === undefined
          ? core.coordToNote([nFifths + fifths])
          : core.coordToNote([nFifths + fifths, nOcts]);
      return transposed.name;
  }
  var trFifths = transposeFifths;
  var ascending = function (a, b) { return a.height - b.height; };
  var descending = function (a, b) { return b.height - a.height; };
  function sortedNames(notes, comparator) {
      comparator = comparator || ascending;
      return onlyNotes(notes).sort(comparator).map(toName);
  }
  function sortedUniqNames(notes) {
      return sortedNames(notes, ascending).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
  }
  /**
   * Simplify a note
   *
   * @function
   * @param {string} note - the note to be simplified
   * - sameAccType: default true. Use same kind of accidentals that source
   * @return {string} the simplified note or '' if not valid note
   * @example
   * simplify("C##") // => "D"
   * simplify("C###") // => "D#"
   * simplify("C###")
   * simplify("B#4") // => "C5"
   */
  var simplify = nameBuilder(true);
  /**
   * Get enharmonic of a note
   *
   * @function
   * @param {string} note
   * @return {string} the enharmonic note or '' if not valid note
   * @example
   * Note.enharmonic("Db") // => "C#"
   * Note.enharmonic("C") // => "C"
   */
  var enharmonic = nameBuilder(false);
  function nameBuilder(sameAccidentals) {
      return function (noteName) {
          var note = get(noteName);
          if (note.empty) {
              return "";
          }
          var sharps = sameAccidentals ? note.alt > 0 : note.alt < 0;
          var pitchClass = note.midi === null;
          return midi$1.midiToNoteName(note.midi || note.chroma, { sharps: sharps, pitchClass: pitchClass });
      };
  }
  var index = {
      names: names,
      get: get,
      name: name,
      pitchClass: pitchClass,
      accidentals: accidentals,
      octave: octave,
      midi: midi,
      ascending: ascending,
      descending: descending,
      sortedNames: sortedNames,
      sortedUniqNames: sortedUniqNames,
      fromMidi: fromMidi,
      fromMidiSharps: fromMidiSharps,
      freq: freq,
      fromFreq: fromFreq,
      fromFreqSharps: fromFreqSharps,
      chroma: chroma,
      transpose: transpose,
      tr: tr,
      transposeBy: transposeBy,
      trBy: trBy,
      transposeFrom: transposeFrom,
      trFrom: trFrom,
      transposeFifths: transposeFifths,
      trFifths: trFifths,
      simplify: simplify,
      enharmonic: enharmonic,
  };

  exports.accidentals = accidentals;
  exports.ascending = ascending;
  exports.chroma = chroma;
  exports.default = index;
  exports.descending = descending;
  exports.enharmonic = enharmonic;
  exports.freq = freq;
  exports.fromFreq = fromFreq;
  exports.fromFreqSharps = fromFreqSharps;
  exports.fromMidi = fromMidi;
  exports.fromMidiSharps = fromMidiSharps;
  exports.get = get;
  exports.midi = midi;
  exports.name = name;
  exports.names = names;
  exports.octave = octave;
  exports.pitchClass = pitchClass;
  exports.simplify = simplify;
  exports.sortedNames = sortedNames;
  exports.sortedUniqNames = sortedUniqNames;
  exports.tr = tr;
  exports.trBy = trBy;
  exports.trFifths = trFifths;
  exports.trFrom = trFrom;
  exports.transpose = transpose;
  exports.transposeBy = transposeBy;
  exports.transposeFifths = transposeFifths;
  exports.transposeFrom = transposeFrom;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/midi":11}],14:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/collection'), require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/collection', '@tonaljs/core'], factory) :
  (global = global || self, factory(global.Pcset = {}, global.collection, global.core));
}(this, (function (exports, collection, core) { 'use strict';

  var _a;
  var EmptyPcset = {
      empty: true,
      name: "",
      setNum: 0,
      chroma: "000000000000",
      normalized: "000000000000",
      intervals: [],
  };
  // UTILITIES
  var setNumToChroma = function (num) { return Number(num).toString(2); };
  var chromaToNumber = function (chroma) { return parseInt(chroma, 2); };
  var REGEX = /^[01]{12}$/;
  function isChroma(set) {
      return REGEX.test(set);
  }
  var isPcsetNum = function (set) {
      return typeof set === "number" && set >= 0 && set <= 4095;
  };
  var isPcset = function (set) { return set && isChroma(set.chroma); };
  var cache = (_a = {}, _a[EmptyPcset.chroma] = EmptyPcset, _a);
  /**
   * Get the pitch class set of a collection of notes or set number or chroma
   */
  function get(src) {
      var chroma = isChroma(src)
          ? src
          : isPcsetNum(src)
              ? setNumToChroma(src)
              : Array.isArray(src)
                  ? listToChroma(src)
                  : isPcset(src)
                      ? src.chroma
                      : EmptyPcset.chroma;
      return (cache[chroma] = cache[chroma] || chromaToPcset(chroma));
  }
  /**
   * Use Pcset.properties
   * @function
   * @deprecated
   */
  var pcset = core.deprecate("Pcset.pcset", "Pcset.get", get);
  /**
   * Get pitch class set chroma
   * @function
   * @example
   * Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
   */
  var chroma = function (set) { return get(set).chroma; };
  /**
   * Get intervals (from C) of a set
   * @function
   * @example
   * Pcset.intervals(["c", "d", "e"]); //=>
   */
  var intervals = function (set) { return get(set).intervals; };
  /**
   * Get pitch class set number
   * @function
   * @example
   * Pcset.num(["c", "d", "e"]); //=> 2192
   */
  var num = function (set) { return get(set).setNum; };
  var IVLS = [
      "1P",
      "2m",
      "2M",
      "3m",
      "3M",
      "4P",
      "5d",
      "5P",
      "6m",
      "6M",
      "7m",
      "7M",
  ];
  /**
   * @private
   * Get the intervals of a pcset *starting from C*
   * @param {Set} set - the pitch class set
   * @return {IntervalName[]} an array of interval names or an empty array
   * if not a valid pitch class set
   */
  function chromaToIntervals(chroma) {
      var intervals = [];
      for (var i = 0; i < 12; i++) {
          // tslint:disable-next-line:curly
          if (chroma.charAt(i) === "1")
              intervals.push(IVLS[i]);
      }
      return intervals;
  }
  /**
   * Get a list of all possible pitch class sets (all possible chromas) *having
   * C as root*. There are 2048 different chromas. If you want them with another
   * note you have to transpose it
   *
   * @see http://allthescales.org/
   * @return {Array<PcsetChroma>} an array of possible chromas from '10000000000' to '11111111111'
   */
  function chromas() {
      return collection.range(2048, 4095).map(setNumToChroma);
  }
  /**
   * Given a a list of notes or a pcset chroma, produce the rotations
   * of the chroma discarding the ones that starts with "0"
   *
   * This is used, for example, to get all the modes of a scale.
   *
   * @param {Array|string} set - the list of notes or pitchChr of the set
   * @param {boolean} normalize - (Optional, true by default) remove all
   * the rotations that starts with "0"
   * @return {Array<string>} an array with all the modes of the chroma
   *
   * @example
   * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
   */
  function modes(set, normalize) {
      if (normalize === void 0) { normalize = true; }
      var pcs = get(set);
      var binary = pcs.chroma.split("");
      return collection.compact(binary.map(function (_, i) {
          var r = collection.rotate(i, binary);
          return normalize && r[0] === "0" ? null : r.join("");
      }));
  }
  /**
   * Test if two pitch class sets are numentical
   *
   * @param {Array|string} set1 - one of the pitch class sets
   * @param {Array|string} set2 - the other pitch class set
   * @return {boolean} true if they are equal
   * @example
   * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
   */
  function isEqual(s1, s2) {
      return get(s1).setNum === get(s2).setNum;
  }
  /**
   * Create a function that test if a collection of notes is a
   * subset of a given set
   *
   * The function is curryfied.
   *
   * @param {PcsetChroma|NoteName[]} set - the superset to test against (chroma or
   * list of notes)
   * @return{function(PcsetChroma|NoteNames[]): boolean} a function accepting a set
   * to test against (chroma or list of notes)
   * @example
   * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
   * inCMajor(["e6", "c4"]) // => true
   * inCMajor(["e6", "c4", "d3"]) // => false
   */
  function isSubsetOf(set) {
      var s = get(set).setNum;
      return function (notes) {
          var o = get(notes).setNum;
          // tslint:disable-next-line: no-bitwise
          return s && s !== o && (o & s) === o;
      };
  }
  /**
   * Create a function that test if a collection of notes is a
   * superset of a given set (it contains all notes and at least one more)
   *
   * @param {Set} set - an array of notes or a chroma set string to test against
   * @return {(subset: Set): boolean} a function that given a set
   * returns true if is a subset of the first one
   * @example
   * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
   * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
   * extendsCMajor(["c6", "e4", "g3"]) // => false
   */
  function isSupersetOf(set) {
      var s = get(set).setNum;
      return function (notes) {
          var o = get(notes).setNum;
          // tslint:disable-next-line: no-bitwise
          return s && s !== o && (o | s) === o;
      };
  }
  /**
   * Test if a given pitch class set includes a note
   *
   * @param {Array<string>} set - the base set to test against
   * @param {string} note - the note to test
   * @return {boolean} true if the note is included in the pcset
   *
   * Can be partially applied
   *
   * @example
   * const isNoteInCMajor = isNoteIncludedIn(['C', 'E', 'G'])
   * isNoteInCMajor('C4') // => true
   * isNoteInCMajor('C#4') // => false
   */
  function isNoteIncludedIn(set) {
      var s = get(set);
      return function (noteName) {
          var n = core.note(noteName);
          return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
      };
  }
  /** @deprecated use: isNoteIncludedIn */
  var includes = isNoteIncludedIn;
  /**
   * Filter a list with a pitch class set
   *
   * @param {Array|string} set - the pitch class set notes
   * @param {Array|string} notes - the note list to be filtered
   * @return {Array} the filtered notes
   *
   * @example
   * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
   * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
   */
  function filter(set) {
      var isIncluded = isNoteIncludedIn(set);
      return function (notes) {
          return notes.filter(isIncluded);
      };
  }
  var index = {
      get: get,
      chroma: chroma,
      num: num,
      intervals: intervals,
      chromas: chromas,
      isSupersetOf: isSupersetOf,
      isSubsetOf: isSubsetOf,
      isNoteIncludedIn: isNoteIncludedIn,
      isEqual: isEqual,
      filter: filter,
      modes: modes,
      // deprecated
      pcset: pcset,
  };
  //// PRIVATE ////
  function chromaRotations(chroma) {
      var binary = chroma.split("");
      return binary.map(function (_, i) { return collection.rotate(i, binary).join(""); });
  }
  function chromaToPcset(chroma) {
      var setNum = chromaToNumber(chroma);
      var normalizedNum = chromaRotations(chroma)
          .map(chromaToNumber)
          .filter(function (n) { return n >= 2048; })
          .sort()[0];
      var normalized = setNumToChroma(normalizedNum);
      var intervals = chromaToIntervals(chroma);
      return {
          empty: false,
          name: "",
          setNum: setNum,
          chroma: chroma,
          normalized: normalized,
          intervals: intervals,
      };
  }
  function listToChroma(set) {
      if (set.length === 0) {
          return EmptyPcset.chroma;
      }
      var pitch;
      var binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line:prefer-for-of
      for (var i = 0; i < set.length; i++) {
          pitch = core.note(set[i]);
          // tslint:disable-next-line: curly
          if (pitch.empty)
              pitch = core.interval(set[i]);
          // tslint:disable-next-line: curly
          if (!pitch.empty)
              binary[pitch.chroma] = 1;
      }
      return binary.join("");
  }

  exports.EmptyPcset = EmptyPcset;
  exports.chromaToIntervals = chromaToIntervals;
  exports.chromas = chromas;
  exports.default = index;
  exports.filter = filter;
  exports.get = get;
  exports.includes = includes;
  exports.isEqual = isEqual;
  exports.isNoteIncludedIn = isNoteIncludedIn;
  exports.isSubsetOf = isSubsetOf;
  exports.isSupersetOf = isSupersetOf;
  exports.modes = modes;
  exports.pcset = pcset;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/collection":6,"@tonaljs/core":7}],15:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord'), require('@tonaljs/core'), require('@tonaljs/roman-numeral')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord', '@tonaljs/core', '@tonaljs/roman-numeral'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Progression = {}, global.chord, global.core, global.romanNumeral));
}(this, (function (exports, chord, core, romanNumeral) { 'use strict';

  /**
   * Given a tonic and a chord list expressed with roman numeral notation
   * returns the progression expressed with leadsheet chords symbols notation
   * @example
   * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
   * // => ["C", "Dm7", "G7"]
   */
  function fromRomanNumerals(tonic, chords) {
      var romanNumerals = chords.map(romanNumeral.get);
      return romanNumerals.map(function (rn) { return core.transpose(tonic, core.interval(rn)) + rn.chordType; });
  }
  /**
   * Given a tonic and a chord list with leadsheet symbols notation,
   * return the chord list with roman numeral notation
   * @example
   * toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
   * // => ["IMaj7", "IIm7", "V7"]
   */
  function toRomanNumerals(tonic, chords) {
      return chords.map(function (chord$1) {
          var _a = chord.tokenize(chord$1), note = _a[0], chordType = _a[1];
          var intervalName = core.distance(tonic, note);
          var roman = romanNumeral.get(core.interval(intervalName));
          return roman.name + chordType;
      });
  }
  var index = { fromRomanNumerals: fromRomanNumerals, toRomanNumerals: toRomanNumerals };

  exports.default = index;
  exports.fromRomanNumerals = fromRomanNumerals;
  exports.toRomanNumerals = toRomanNumerals;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord":5,"@tonaljs/core":7,"@tonaljs/roman-numeral":17}],16:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/collection'), require('@tonaljs/midi')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/collection', '@tonaljs/midi'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Range = {}, global.collection, global.midi));
}(this, (function (exports, collection, midi) { 'use strict';

  /**
   * Create a numeric range. You supply a list of notes or numbers and it will
   * be connected to create complex ranges.
   *
   * @param {Array} notes - the list of notes or midi numbers used
   * @return {Array} an array of numbers or empty array if not valid parameters
   *
   * @example
   * numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
   * // it works midi notes
   * numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
   * // complex range
   * numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
   */
  function numeric(notes) {
      var midi$1 = collection.compact(notes.map(midi.toMidi));
      if (!notes.length || midi$1.length !== notes.length) {
          // there is no valid notes
          return [];
      }
      return midi$1.reduce(function (result, note) {
          var last = result[result.length - 1];
          return result.concat(collection.range(last, note).slice(1));
      }, [midi$1[0]]);
  }
  /**
   * Create a range of chromatic notes. The altered notes will use flats.
   *
   * @function
   * @param {Array} notes - the list of notes or midi note numbers to create a range from
   * @param {Object} options - The same as `midiToNoteName` (`{ sharps: boolean, pitchClass: boolean }`)
   * @return {Array} an array of note names
   *
   * @example
   * Range.chromatic(["C2, "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
   * // with sharps
   * Range.chromatic(["C2", "C3"], { sharps: true }) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
   */
  function chromatic(notes, options) {
      return numeric(notes).map(function (midi$1) { return midi.midiToNoteName(midi$1, options); });
  }
  var index = { numeric: numeric, chromatic: chromatic };

  exports.chromatic = chromatic;
  exports.default = index;
  exports.numeric = numeric;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/collection":6,"@tonaljs/midi":11}],17:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = global || self, factory(global.RomanNumeral = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  var NoRomanNumeral = { empty: true, name: "", chordType: "" };
  var cache = {};
  /**
   * Get properties of a roman numeral string
   *
   * @function
   * @param {string} - the roman numeral string (can have type, like: Imaj7)
   * @return {Object} - the roman numeral properties
   * @param {string} name - the roman numeral (tonic)
   * @param {string} type - the chord type
   * @param {string} num - the number (1 = I, 2 = II...)
   * @param {boolean} major - major or not
   *
   * @example
   * romanNumeral("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
   */
  function get(src) {
      return typeof src === "string"
          ? cache[src] || (cache[src] = parse(src))
          : typeof src === "number"
              ? get(NAMES[src] || "")
              : core.isPitch(src)
                  ? fromPitch(src)
                  : core.isNamed(src)
                      ? get(src.name)
                      : NoRomanNumeral;
  }
  var romanNumeral = core.deprecate("RomanNumeral.romanNumeral", "RomanNumeral.get", get);
  /**
   * Get roman numeral names
   *
   * @function
   * @param {boolean} [isMajor=true]
   * @return {Array<String>}
   *
   * @example
   * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
   */
  function names(major) {
      if (major === void 0) { major = true; }
      return (major ? NAMES : NAMES_MINOR).slice();
  }
  function fromPitch(pitch) {
      return get(core.altToAcc(pitch.alt) + NAMES[pitch.step]);
  }
  var REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
  function tokenize(str) {
      return (REGEX.exec(str) || ["", "", "", ""]);
  }
  var ROMANS = "I II III IV V VI VII";
  var NAMES = ROMANS.split(" ");
  var NAMES_MINOR = ROMANS.toLowerCase().split(" ");
  function parse(src) {
      var _a = tokenize(src), name = _a[0], acc = _a[1], roman = _a[2], chordType = _a[3];
      if (!roman) {
          return NoRomanNumeral;
      }
      var upperRoman = roman.toUpperCase();
      var step = NAMES.indexOf(upperRoman);
      var alt = core.accToAlt(acc);
      var dir = 1;
      return {
          empty: false,
          name: name,
          roman: roman,
          interval: core.interval({ step: step, alt: alt, dir: dir }).name,
          acc: acc,
          chordType: chordType,
          alt: alt,
          step: step,
          major: roman === upperRoman,
          oct: 0,
          dir: dir,
      };
  }
  var index = {
      names: names,
      get: get,
      // deprecated
      romanNumeral: romanNumeral,
  };

  exports.default = index;
  exports.get = get;
  exports.names = names;
  exports.tokenize = tokenize;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],18:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/pcset')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/pcset'], factory) :
    (global = global || self, factory(global.ScaleType = {}, global.core, global.pcset));
}(this, (function (exports, core, pcset) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // SCALES
    // Format: ["intervals", "name", "alias1", "alias2", ...]
    var SCALES = [
        // 5-note scales
        ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
        ["1P 3M 4P 5P 7M", "ionian pentatonic"],
        ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
        ["1P 2M 4P 5P 6M", "ritusen"],
        ["1P 2M 4P 5P 7m", "egyptian"],
        ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
        ["1P 3m 4P 5P 6m", "vietnamese 1"],
        ["1P 2m 3m 5P 6m", "pelog"],
        ["1P 2m 4P 5P 6m", "kumoijoshi"],
        ["1P 2M 3m 5P 6m", "hirajoshi"],
        ["1P 2m 4P 5d 7m", "iwato"],
        ["1P 2m 4P 5P 7m", "in-sen"],
        ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
        ["1P 3m 4P 6m 7m", "malkos raga"],
        ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
        ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
        ["1P 3m 4P 5P 6M", "minor six pentatonic"],
        ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
        ["1P 2M 3M 5P 6m", "flat six pentatonic"],
        ["1P 2m 3M 5P 6M", "scriabin"],
        ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
        ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
        ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
        ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
        ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
        // 6-note scales
        ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
        ["1P 2A 3M 5P 5A 7M", "augmented"],
        ["1P 2M 3m 3M 5P 6M", "major blues"],
        ["1P 2M 4P 5P 6M 7m", "piongio"],
        ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
        ["1P 2M 3M 4A 6M 7m", "prometheus"],
        ["1P 2m 3M 5d 6m 7m", "mystery #1"],
        ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
        ["1P 2M 3M 4A 5A 7m", "whole tone", "messiaen's mode #1"],
        ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
        ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
        // 7-note scales
        ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
        ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
        ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
        [
            "1P 2m 3m 4d 5d 6m 7m",
            "altered",
            "super locrian",
            "diminished whole tone",
            "pomeroy",
        ],
        ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
        [
            "1P 2M 3M 4P 5P 6m 7m",
            "mixolydian b6",
            "melodic minor fifth mode",
            "hindu",
        ],
        ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
        ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
        ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
        [
            "1P 2m 3m 4P 5P 6M 7m",
            "dorian b2",
            "phrygian #6",
            "melodic minor second mode",
        ],
        ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
        ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
        [
            "1P 2m 3m 4d 5d 6m 7d",
            "ultralocrian",
            "superlocrian bb7",
            "·superlocrian diminished",
        ],
        ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
        ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
        ["1P 2M 3m 5d 5P 6M 7m", "romanian minor"],
        ["1P 2M 3m 4A 5P 6M 7m", "dorian #4"],
        ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
        ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
        ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
        ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
        ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
        ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
        ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
        ["1P 2M 3m 4P 5P 6m 7m", "aeolian", "minor"],
        ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
        ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
        ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
        ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
        ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
        ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
        ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
        ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
        ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
        ["1P 2m 3M 4P 5d 6m 7M", "persian"],
        ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
        ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
        [
            "1P 2M 3M 4P 5A 6M 7M",
            "major augmented",
            "major #5",
            "ionian augmented",
            "ionian #5",
        ],
        ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
        // 8-note scales
        ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
        ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
        ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
        ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
        ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
        ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
        ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
        ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
        ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
        ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
        ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
        [
            "1P 2m 3m 3M 4A 5P 6M 7m",
            "half-whole diminished",
            "dominant diminished",
            "messiaen's mode #2",
        ],
        ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
        ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
        // 9-note scales
        ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
        ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
        // 10-note scales
        ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
        // 12-note scales
        ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"],
    ];

    var NoScaleType = __assign(__assign({}, pcset.EmptyPcset), { intervals: [], aliases: [] });
    var dictionary = [];
    var index = {};
    function names() {
        return dictionary.map(function (scale) { return scale.name; });
    }
    /**
     * Given a scale name or chroma, return the scale properties
     *
     * @param {string} type - scale name or pitch class set chroma
     * @example
     * import { get } from 'tonaljs/scale-type'
     * get('major') // => { name: 'major', ... }
     */
    function get(type) {
        return index[type] || NoScaleType;
    }
    var scaleType = core.deprecate("ScaleDictionary.scaleType", "ScaleType.get", get);
    /**
     * Return a list of all scale types
     */
    function all() {
        return dictionary.slice();
    }
    var entries = core.deprecate("ScaleDictionary.entries", "ScaleType.all", all);
    /**
     * Keys used to reference scale types
     */
    function keys() {
        return Object.keys(index);
    }
    /**
     * Clear the dictionary
     */
    function removeAll() {
        dictionary = [];
        index = {};
    }
    /**
     * Add a scale into dictionary
     * @param intervals
     * @param name
     * @param aliases
     */
    function add(intervals, name, aliases) {
        if (aliases === void 0) { aliases = []; }
        var scale = __assign(__assign({}, pcset.get(intervals)), { name: name, intervals: intervals, aliases: aliases });
        dictionary.push(scale);
        index[scale.name] = scale;
        index[scale.setNum] = scale;
        index[scale.chroma] = scale;
        scale.aliases.forEach(function (alias) { return addAlias(scale, alias); });
        return scale;
    }
    function addAlias(scale, alias) {
        index[alias] = scale;
    }
    SCALES.forEach(function (_a) {
        var ivls = _a[0], name = _a[1], aliases = _a.slice(2);
        return add(ivls.split(" "), name, aliases);
    });
    var index$1 = {
        names: names,
        get: get,
        all: all,
        add: add,
        removeAll: removeAll,
        keys: keys,
        // deprecated
        entries: entries,
        scaleType: scaleType,
    };

    exports.NoScaleType = NoScaleType;
    exports.add = add;
    exports.addAlias = addAlias;
    exports.all = all;
    exports.default = index$1;
    exports.entries = entries;
    exports.get = get;
    exports.keys = keys;
    exports.names = names;
    exports.removeAll = removeAll;
    exports.scaleType = scaleType;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/pcset":14}],19:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord-type'), require('@tonaljs/collection'), require('@tonaljs/core'), require('@tonaljs/note'), require('@tonaljs/pcset'), require('@tonaljs/scale-type')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord-type', '@tonaljs/collection', '@tonaljs/core', '@tonaljs/note', '@tonaljs/pcset', '@tonaljs/scale-type'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Scale = {}, global.chordType, global.collection, global.core, global.note, global.pcset, global.scaleType));
}(this, (function (exports, chordType, collection, core, note, pcset, scaleType) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var NoScale = {
        empty: true,
        name: "",
        type: "",
        tonic: null,
        setNum: NaN,
        chroma: "",
        normalized: "",
        aliases: [],
        notes: [],
        intervals: [],
    };
    /**
     * Given a string with a scale name and (optionally) a tonic, split
     * that components.
     *
     * It retuns an array with the form [ name, tonic ] where tonic can be a
     * note name or null and name can be any arbitrary string
     * (this function doesn"t check if that scale name exists)
     *
     * @function
     * @param {string} name - the scale name
     * @return {Array} an array [tonic, name]
     * @example
     * tokenize("C mixolydean") // => ["C", "mixolydean"]
     * tokenize("anything is valid") // => ["", "anything is valid"]
     * tokenize() // => ["", ""]
     */
    function tokenize(name) {
        if (typeof name !== "string") {
            return ["", ""];
        }
        var i = name.indexOf(" ");
        var tonic = core.note(name.substring(0, i));
        if (tonic.empty) {
            var n = core.note(name);
            return n.empty ? ["", name] : [n.name, ""];
        }
        var type = name.substring(tonic.name.length + 1);
        return [tonic.name, type.length ? type : ""];
    }
    /**
     * Get all scale names
     * @function
     */
    var names = scaleType.names;
    /**
     * Get a Scale from a scale name.
     */
    function get(src) {
        var tokens = Array.isArray(src) ? src : tokenize(src);
        var tonic = core.note(tokens[0]).name;
        var st = scaleType.get(tokens[1]);
        if (st.empty) {
            return NoScale;
        }
        var type = st.name;
        var notes = tonic
            ? st.intervals.map(function (i) { return core.transpose(tonic, i); })
            : [];
        var name = tonic ? tonic + " " + type : type;
        return __assign(__assign({}, st), { name: name, type: type, tonic: tonic, notes: notes });
    }
    var scale = core.deprecate("Scale.scale", "Scale.get", get);
    /**
     * Get all chords that fits a given scale
     *
     * @function
     * @param {string} name - the scale name
     * @return {Array<string>} - the chord names
     *
     * @example
     * scaleChords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
     */
    function scaleChords(name) {
        var s = get(name);
        var inScale = pcset.isSubsetOf(s.chroma);
        return chordType.all()
            .filter(function (chord) { return inScale(chord.chroma); })
            .map(function (chord) { return chord.aliases[0]; });
    }
    /**
     * Get all scales names that are a superset of the given one
     * (has the same notes and at least one more)
     *
     * @function
     * @param {string} name
     * @return {Array} a list of scale names
     * @example
     * extended("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
     */
    function extended(name) {
        var s = get(name);
        var isSuperset = pcset.isSupersetOf(s.chroma);
        return scaleType.all()
            .filter(function (scale) { return isSuperset(scale.chroma); })
            .map(function (scale) { return scale.name; });
    }
    /**
     * Find all scales names that are a subset of the given one
     * (has less notes but all from the given scale)
     *
     * @function
     * @param {string} name
     * @return {Array} a list of scale names
     *
     * @example
     * reduced("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
     */
    function reduced(name) {
        var isSubset = pcset.isSubsetOf(get(name).chroma);
        return scaleType.all()
            .filter(function (scale) { return isSubset(scale.chroma); })
            .map(function (scale) { return scale.name; });
    }
    /**
     * Given an array of notes, return the scale: a pitch class set starting from
     * the first note of the array
     *
     * @function
     * @param {string[]} notes
     * @return {string[]} pitch classes with same tonic
     * @example
     * scaleNotes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
     * scaleNotes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
     */
    function scaleNotes(notes) {
        var pcset = notes.map(function (n) { return core.note(n).pc; }).filter(function (x) { return x; });
        var tonic = pcset[0];
        var scale = note.sortedUniqNames(pcset);
        return collection.rotate(scale.indexOf(tonic), scale);
    }
    /**
     * Find mode names of a scale
     *
     * @function
     * @param {string} name - scale name
     * @example
     * modeNames("C pentatonic") // => [
     *   ["C", "major pentatonic"],
     *   ["D", "egyptian"],
     *   ["E", "malkos raga"],
     *   ["G", "ritusen"],
     *   ["A", "minor pentatonic"]
     * ]
     */
    function modeNames(name) {
        var s = get(name);
        if (s.empty) {
            return [];
        }
        var tonics = s.tonic ? s.notes : s.intervals;
        return pcset.modes(s.chroma)
            .map(function (chroma, i) {
            var modeName = get(chroma).name;
            return modeName ? [tonics[i], modeName] : ["", ""];
        })
            .filter(function (x) { return x[0]; });
    }
    function getNoteNameOf(scale) {
        var names = Array.isArray(scale) ? scaleNotes(scale) : get(scale).notes;
        var chromas = names.map(function (name) { return core.note(name).chroma; });
        return function (noteOrMidi) {
            var height = typeof noteOrMidi === "number" ? noteOrMidi : core.note(noteOrMidi).height;
            if (height === undefined)
                return undefined;
            var chroma = height % 12;
            var oct = Math.floor(height / 12) - 1;
            var position = chromas.indexOf(chroma);
            if (position === -1)
                return undefined;
            return names[position] + oct;
        };
    }
    function rangeOf(scale) {
        var getName = getNoteNameOf(scale);
        return function (fromNote, toNote) {
            var from = core.note(fromNote).height;
            var to = core.note(toNote).height;
            if (from === undefined || to === undefined)
                return [];
            return collection.range(from, to)
                .map(getName)
                .filter(function (x) { return x; });
        };
    }
    var index = {
        get: get,
        names: names,
        extended: extended,
        modeNames: modeNames,
        reduced: reduced,
        scaleChords: scaleChords,
        scaleNotes: scaleNotes,
        tokenize: tokenize,
        rangeOf: rangeOf,
        // deprecated
        scale: scale,
    };

    exports.default = index;
    exports.extended = extended;
    exports.get = get;
    exports.modeNames = modeNames;
    exports.names = names;
    exports.rangeOf = rangeOf;
    exports.reduced = reduced;
    exports.scale = scale;
    exports.scaleChords = scaleChords;
    exports.scaleNotes = scaleNotes;
    exports.tokenize = tokenize;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord-type":4,"@tonaljs/collection":6,"@tonaljs/core":7,"@tonaljs/note":13,"@tonaljs/pcset":14,"@tonaljs/scale-type":18}],20:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.TimeSignature = {}));
}(this, (function (exports) { 'use strict';

  // CONSTANTS
  var NONE = {
      empty: true,
      name: "",
      upper: undefined,
      lower: undefined,
      type: undefined,
      additive: [],
  };
  var NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
  // PUBLIC API
  function names() {
      return NAMES.slice();
  }
  var REGEX = /^(\d?\d(?:\+\d)*)\/(\d)$/;
  var CACHE = new Map();
  function get(literal) {
      var cached = CACHE.get(literal);
      if (cached) {
          return cached;
      }
      var ts = build(parse(literal));
      CACHE.set(literal, ts);
      return ts;
  }
  function parse(literal) {
      if (typeof literal === "string") {
          var _a = REGEX.exec(literal) || [], _ = _a[0], up_1 = _a[1], low = _a[2];
          return parse([up_1, low]);
      }
      var up = literal[0], down = literal[1];
      var denominator = +down;
      if (typeof up === "number") {
          return [up, denominator];
      }
      var list = up.split("+").map(function (n) { return +n; });
      return list.length === 1 ? [list[0], denominator] : [list, denominator];
  }
  var index = { names: names, parse: parse, get: get };
  // PRIVATE
  function build(_a) {
      var up = _a[0], down = _a[1];
      var upper = Array.isArray(up) ? up.reduce(function (a, b) { return a + b; }, 0) : up;
      var lower = down;
      if (upper === 0 || lower === 0) {
          return NONE;
      }
      var name = Array.isArray(up) ? up.join("+") + "/" + down : up + "/" + down;
      var additive = Array.isArray(up) ? up : [];
      var type = lower === 4 || lower === 2
          ? "simple"
          : lower === 8 && upper % 3 === 0
              ? "compound"
              : "irregular";
      return {
          empty: false,
          name: name,
          type: type,
          upper: upper,
          lower: lower,
          additive: additive,
      };
  }

  exports.default = index;
  exports.get = get;
  exports.names = names;
  exports.parse = parse;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],21:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/abc-notation'), require('@tonaljs/array'), require('@tonaljs/chord'), require('@tonaljs/chord-type'), require('@tonaljs/collection'), require('@tonaljs/core'), require('@tonaljs/duration-value'), require('@tonaljs/interval'), require('@tonaljs/key'), require('@tonaljs/midi'), require('@tonaljs/mode'), require('@tonaljs/note'), require('@tonaljs/pcset'), require('@tonaljs/progression'), require('@tonaljs/range'), require('@tonaljs/roman-numeral'), require('@tonaljs/scale'), require('@tonaljs/scale-type'), require('@tonaljs/time-signature')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/abc-notation', '@tonaljs/array', '@tonaljs/chord', '@tonaljs/chord-type', '@tonaljs/collection', '@tonaljs/core', '@tonaljs/duration-value', '@tonaljs/interval', '@tonaljs/key', '@tonaljs/midi', '@tonaljs/mode', '@tonaljs/note', '@tonaljs/pcset', '@tonaljs/progression', '@tonaljs/range', '@tonaljs/roman-numeral', '@tonaljs/scale', '@tonaljs/scale-type', '@tonaljs/time-signature'], factory) :
  (global = global || self, factory(global.Tonal = {}, global.abcNotation, global.array, global.chord, global.ChordType, global.collection, global.Core, global.durationValue, global.interval, global.key, global.midi, global.mode, global.note, global.Pcset, global.progression, global.range, global.romanNumeral, global.scale, global.ScaleType, global.timeSignature));
}(this, (function (exports, abcNotation, array, chord, ChordType, collection, Core, durationValue, interval, key, midi, mode, note, Pcset, progression, range, romanNumeral, scale, ScaleType, timeSignature) { 'use strict';

  abcNotation = abcNotation && Object.prototype.hasOwnProperty.call(abcNotation, 'default') ? abcNotation['default'] : abcNotation;
  chord = chord && Object.prototype.hasOwnProperty.call(chord, 'default') ? chord['default'] : chord;
  ChordType = ChordType && Object.prototype.hasOwnProperty.call(ChordType, 'default') ? ChordType['default'] : ChordType;
  collection = collection && Object.prototype.hasOwnProperty.call(collection, 'default') ? collection['default'] : collection;
  durationValue = durationValue && Object.prototype.hasOwnProperty.call(durationValue, 'default') ? durationValue['default'] : durationValue;
  interval = interval && Object.prototype.hasOwnProperty.call(interval, 'default') ? interval['default'] : interval;
  key = key && Object.prototype.hasOwnProperty.call(key, 'default') ? key['default'] : key;
  midi = midi && Object.prototype.hasOwnProperty.call(midi, 'default') ? midi['default'] : midi;
  mode = mode && Object.prototype.hasOwnProperty.call(mode, 'default') ? mode['default'] : mode;
  note = note && Object.prototype.hasOwnProperty.call(note, 'default') ? note['default'] : note;
  Pcset = Pcset && Object.prototype.hasOwnProperty.call(Pcset, 'default') ? Pcset['default'] : Pcset;
  progression = progression && Object.prototype.hasOwnProperty.call(progression, 'default') ? progression['default'] : progression;
  range = range && Object.prototype.hasOwnProperty.call(range, 'default') ? range['default'] : range;
  romanNumeral = romanNumeral && Object.prototype.hasOwnProperty.call(romanNumeral, 'default') ? romanNumeral['default'] : romanNumeral;
  scale = scale && Object.prototype.hasOwnProperty.call(scale, 'default') ? scale['default'] : scale;
  ScaleType = ScaleType && Object.prototype.hasOwnProperty.call(ScaleType, 'default') ? ScaleType['default'] : ScaleType;
  timeSignature = timeSignature && Object.prototype.hasOwnProperty.call(timeSignature, 'default') ? timeSignature['default'] : timeSignature;

  // deprecated (backwards compatibility)
  var Tonal = Core;
  var PcSet = Pcset;
  var ChordDictionary = ChordType;
  var ScaleDictionary = ScaleType;

  Object.keys(Core).forEach(function (k) {
    if (k !== 'default') Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () {
        return Core[k];
      }
    });
  });
  exports.AbcNotation = abcNotation;
  exports.Array = array;
  exports.Chord = chord;
  exports.ChordType = ChordType;
  exports.Collection = collection;
  exports.Core = Core;
  exports.DurationValue = durationValue;
  exports.Interval = interval;
  exports.Key = key;
  exports.Midi = midi;
  exports.Mode = mode;
  exports.Note = note;
  exports.Pcset = Pcset;
  exports.Progression = progression;
  exports.Range = range;
  exports.RomanNumeral = romanNumeral;
  exports.Scale = scale;
  exports.ScaleType = ScaleType;
  exports.TimeSignature = timeSignature;
  exports.ChordDictionary = ChordDictionary;
  exports.PcSet = PcSet;
  exports.ScaleDictionary = ScaleDictionary;
  exports.Tonal = Tonal;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/abc-notation":1,"@tonaljs/array":2,"@tonaljs/chord":5,"@tonaljs/chord-type":4,"@tonaljs/collection":6,"@tonaljs/core":7,"@tonaljs/duration-value":8,"@tonaljs/interval":9,"@tonaljs/key":10,"@tonaljs/midi":11,"@tonaljs/mode":12,"@tonaljs/note":13,"@tonaljs/pcset":14,"@tonaljs/progression":15,"@tonaljs/range":16,"@tonaljs/roman-numeral":17,"@tonaljs/scale":19,"@tonaljs/scale-type":18,"@tonaljs/time-signature":20}],22:[function(require,module,exports){
"use strict";

(function (exports) {

    // control sequences for coloring

    exports.black = "\x1b[30m"
    exports.red = "\x1b[31m"
    exports.green = "\x1b[32m"
    exports.yellow = "\x1b[33m"
    exports.blue = "\x1b[34m"
    exports.magenta = "\x1b[35m"
    exports.cyan = "\x1b[36m"
    exports.lightgray = "\x1b[37m"
    exports.default = "\x1b[39m"
    exports.darkgray = "\x1b[90m"
    exports.lightred = "\x1b[91m"
    exports.lightgreen = "\x1b[92m"
    exports.lightyellow = "\x1b[93m"
    exports.lightblue = "\x1b[94m"
    exports.lightmagenta = "\x1b[95m"
    exports.lightcyan = "\x1b[96m"
    exports.white = "\x1b[97m"
    exports.reset = "\x1b[0m"

    function colored (char, color) {
        // do not color it if color is not specified
        return (color === undefined) ? char : (color + char + exports.reset)
    }

    exports.colored = colored

    exports.plot = function (series, cfg = undefined) {
        // this function takes oth one array and array of arrays
        // if an array of numbers is passed it is transfored to
        // an array of exactly one array with numbers
        if (typeof(series[0]) == "number"){
            series = [series]
        }

        cfg = (typeof cfg !== 'undefined') ? cfg : {}

        let min = (typeof cfg.min !== 'undefined') ? cfg.min : series[0][0]
        let max = (typeof cfg.max !== 'undefined') ? cfg.max : series[0][0]

        for (let j = 0; j < series.length; j++) {
            for (let i = 0; i < series[j].length; i++) {
                min = Math.min(min, series[j][i])
                max = Math.max(max, series[j][i])
            }
        }

        let defaultSymbols = [ '┼', '┤', '╶', '╴', '─', '╰', '╭', '╮', '╯', '│' ]
        let range   = Math.abs (max - min)
        let offset  = (typeof cfg.offset  !== 'undefined') ? cfg.offset  : 3
        let padding = (typeof cfg.padding !== 'undefined') ? cfg.padding : '           '
        let height  = (typeof cfg.height  !== 'undefined') ? cfg.height  : range
        let colors  = (typeof cfg.colors !== 'undefined') ? cfg.colors : []
        let ratio   = range !== 0 ? height / range : 1;
        let min2    = Math.round (min * ratio)
        let max2    = Math.round (max * ratio)
        let rows    = Math.abs (max2 - min2)
        let width = 0
        for (let i = 0; i < series.length; i++) {
            width = Math.max(width, series[i].length)
        }
        width = width + offset
        let symbols = (typeof cfg.symbols !== 'undefined') ? cfg.symbols : defaultSymbols
        let format  = (typeof cfg.format !== 'undefined') ? cfg.format : function (x) {
            return (padding + x.toFixed (2)).slice (-padding.length)
        }

        let result = new Array (rows + 1) // empty space
        for (let i = 0; i <= rows; i++) {
            result[i] = new Array (width)
            for (let j = 0; j < width; j++) {
                result[i][j] = ' '
            }
        }
        for (let y = min2; y <= max2; ++y) { // axis + labels
            let label = format (rows > 0 ? max - (y - min2) * range / rows : y, y - min2)
            result[y - min2][Math.max (offset - label.length, 0)] = label
            result[y - min2][offset - 1] = (y == 0) ? symbols[0] : symbols[1]
        }

        for (let j = 0; j < series.length; j++) {
            let currentColor = colors[j % colors.length]
            let y0 = Math.round (series[j][0] * ratio) - min2
            result[rows - y0][offset - 1] = colored(symbols[0], currentColor) // first value

            for (let x = 0; x < series[j].length - 1; x++) { // plot the line
                let y0 = Math.round (series[j][x + 0] * ratio) - min2
                let y1 = Math.round (series[j][x + 1] * ratio) - min2
                if (y0 == y1) {
                    result[rows - y0][x + offset] = colored(symbols[4], currentColor)
                } else {
                    result[rows - y1][x + offset] = colored((y0 > y1) ? symbols[5] : symbols[6], currentColor)
                    result[rows - y0][x + offset] = colored((y0 > y1) ? symbols[7] : symbols[8], currentColor)
                    let from = Math.min (y0, y1)
                    let to = Math.max (y0, y1)
                    for (let y = from + 1; y < to; y++) {
                        result[rows - y][x + offset] = colored(symbols[9], currentColor)
                    }
                }
            }
        }
        return result.map (function (x) { return x.join ('') }).join ('\n')
    }

}) (typeof exports === 'undefined' ? /* istanbul ignore next */ this['asciichart'] = {} : exports);

},{}],23:[function(require,module,exports){
;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v9.1.2
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                       // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',        // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
      alphabetHasNormalDecimalDigits = true;


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10 && alphabetHasNormalDecimalDigits) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if less than two characters,
            // or if it contains '+', '-', '.', whitespace, or a repeated character.
            if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
              alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, -1);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, 1);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // THe index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    // If any number is NaN, return NaN.
    function maxOrMin(args, n) {
      var k, y,
        i = 1,
        x = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        y = new BigNumber(args[i]);
        if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
          x = y;
        }
      }

      return x;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = mathfloor(n / pows10[d - j - 1] % 10);
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
      }

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) {
        zc = xc;
        xc = yc;
        yc = zc;
        i = xcL;
        xcL = ycL;
        ycL = i;
      }

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) {
        t = yc;
        yc = xc;
        xc = t;
        b = a;
      }

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '5e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) {
          i = g1;
          g1 = g2;
          g2 = i;
          len -= i;
        }

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10 && alphabetHasNormalDecimalDigits) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () { return BigNumber; });

  // Node.js and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = BigNumber;

  // Browser.
  } else {
    if (!globalObject) {
      globalObject = typeof self != 'undefined' && self ? self : window;
    }

    globalObject.BigNumber = BigNumber;
  }
})(this);

},{}],24:[function(require,module,exports){

},{}],25:[function(require,module,exports){
module.exports={
	"new" : [
		"make"
	],

	"ring" : [
		"list",
		"array"
	],

	"set" : [
		"apply",
		"give"
	],

	"amp" : [
		"amplitude",
		"gain",
		"vol",
		"volume",
		"vel",
		"velocity"
	],

	"beat" : [
		"rhythm",
		"play"
	],

	"env" : [
		"envelope",
		"shape",
		"transient",
		"length",
		"duration",
		"dur"
	],

	"note" : [
		"pitch"
	],

	"time" : [
		"timing",
		"interval"
	],

	"offset" : [
		"position",
		"start",
		"startAt",
		"from"
	],

	"pan" : [
		"panning",
		"spat",
		"location"
	],

	"slide" : [
		"portamento",
		"glide",
		"porta"
	],

	"speed" : [
		"rate",
		"playback"
	],

	"sub" : [
		"deep",
		"low"
	],

	"add_fx" : [
		"fx",
		"withFX",
		"addFX",
		"effect",
		"cc",
		"change"
	],

	"res" : [
		"resonance",
		"reson"
	],

	"stretch" : [
		"beatstretch",
		"loop"
	],

	"wave2" : [
		"osc2",
		"add_osc"
	],

	"noise" : [
		"add_noise",
		"with_noise"
	],

	"group" : [
		"aux",
		"bus"
	],

	"name" : [
		"id"
	],

	"address" : [
		"tag",
		"url"
	],

	"out" : [
		"channel",
		"output",
		"outlet"
	],

	"clock" : [
		"sync",
		"clockSync",
		"midiClock",
		"midiSync"
	],

	"poly" : [
		"chords",
		"polyphonic"
	], 

	"tempo" : [
		"bpm"
	],

	"signature" : [
		"timeSignature",
		"timeSig",
		"measure"
	],

	"randomSeed" : [
		"seed"
	],

	"lowPass" : [
		"lowpass",
		"lopass",
		"loPass",
		"highCut",
		"hiCut"
	],

	"highPass" : [
		"highpass",
		"hipass",
		"hiPass",
		"lowCut",
		"loCut"
	],

	"silence" : [
		"mute",
		"killAll",
		"hush"
	]
}
},{}],26:[function(require,module,exports){
// 
// The default instrument objects for Mercury
// 

const emptyDefault = {
	'empty' : {
		'object' : '',
		'type' : '',
		'functions' : {
			'group' :	[],
			'time' : 	[ '1/1', 0 ],
			'beat' : 	[ 1, -1 ],
			'amp' :		[ 1 ],
			'env' :		[ 1, 250 ],
			'pan' : 	[ 0 ],
			'note' :	[ 0, 0 ],
			'add_fx' : 	[]
		}
	},
}

const instrumentDefaults = {
	'synth' : {
		'type' : 'saw',
		'functions' : {
			'amp' :		[ 0.7 ],
			'wave2' : 	[ 'saw', 0 ]
		}
	},
	'polySynth' : {
		'type' : 'saw',
		'functions' : {
			'amp' : 	[ 0.7 ],
			'wave2' : 	[ 'saw', 0 ]
		}
	},
	'sample' : {
		'type' : 'kick_909',
		'functions' : {
			'env' : 	[ -1 ],
			'amp' : 	[ 0.9 ],
			'stretch' : [ 0, 1, 1 ],
			'speed' :	[ 1 ],
			'note' :	[ 'off' ],
			'tune' :	[ 60 ]
		}
	},
	'loop' : {
		'type' : 'amen',
		'functions' : {
			'env' : 	[ -1 ],
			'amp' : 	[ 0.9 ],
			'stretch' : [ 1, 1, 1 ],
			'speed' :	[ 1 ],
			'note' :	[ 'off' ],
			'tune' :	[ 60 ]
		}
	},
	'midi' : {
		'type' : 'default',
		'functions' : {
			'env' : 	[ 250 ],
			'out' : 	[ 1 ],
			'chord' : 	'off',
			'sync' : 	'off'
		}
	},
	'input' : {
		'type' : 'default',
		'functions' : {
			'env' : 	[ -1 ],
			'amp' : 	[ 0.9 ],
			'note' :	[ 'off' ]
		}
	}
}

// merge the default empty object and the additional defaults
Object.keys(instrumentDefaults).forEach((o) => {
	let empty = JSON.parse(JSON.stringify(emptyDefault.empty));
	instrumentDefaults[o] = deepMerge(empty, instrumentDefaults[o]);
});
// add the empty default
Object.assign(instrumentDefaults, emptyDefault);
// instrumentDefaults = { ...instrumentDefaults, ...emptyDefault };

// Return true if input is object
// 
function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}
  
// Deep merge two objects
// thanks to https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
// 
function deepMerge(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, {
					[key]: {}
				});
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, {
					[key]: source[key]
				});
			}
		}
	}
	return deepMerge(target, ...sources);
}
/*
const instrumentDefaults = {
	'empty' : {
		'object' : '',
		'type' : '',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			'beat' : [ 1 ],
			'add_fx' : []
		}
	},
	'synth' : {
		'object' : '',
		'type' : 'saw',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			'note' : [ 0, 0 ],
			'env' : [ 1, 250 ],
			'beat' : [ 1 ],
			'amp' : [ 0.7 ],
			'wave2' : [ 'saw', 0 ],
			'add_fx' : [],
		}
	},
	'polySynth' : {
		'object' : '',
		'type' : 'saw',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			'note' : [ 0, 0 ],
			'env' : [ 1, 250 ],
			'beat' : [ 1 ],
			'amp' : [ 0.7 ],
			'wave2' : [ 'saw', 0 ],
			'add_fx' : [],
		}
	},
	'sample' : {
		'object' : '',
		'type' : 'kick_909',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			'speed' : [ 1 ],
			// 'note' : [ 0, 0 ],
			'env' : [ -1 ],
			'beat' : [ 1 ],
			'amp' : [ 0.9 ],
			'stretch': [0, 1, 1],
			'add_fx' : [],
		}
	},
	'loop' : {
		'object' : '',
		'type' : 'amen',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			'speed' : [ 1 ],
			// 'note' : [ 0, 0 ],
			'env' : [ -1 ],
			'beat' : [ 1 ],
			'amp' : [ 0.9 ],
			'stretch': [ 1, 1, 1 ],
			'add_fx' : [],
		}
	},
	'midi' : {
		'object' : '',
		'type' : 'default',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			// 'note' : [ 0, 0 ],
			'env' : [ 100 ],
			'out' : [ 1 ],
			'chord' : 'off',
			'sync' : 'off',
			'add_fx' : []
		}
	},
	'input' : {
		'object' : '',
		'type' : 'default',
		'functions' : {
			'group' : [],
			'time' : [ '1/1', 0 ],
			'env' : [ -1 ],
			'amp' : [ 0.9 ],
			'add_fx' : []
		}
	}
}
*/
module.exports = { instrumentDefaults };
},{}],27:[function(require,module,exports){
// ===================================================================
// Mercury grammar, lexer and parser
// 
// written by Timo Hoogland (c) 2020, www.timohoogland.com
// The GNU GPL-v3 License
// ===================================================================

// require the parser function
const Mercury = require('./src/mercuryParser.js').mercuryParser;

// export the parser function
module.exports = Mercury;
},{"./src/mercuryParser.js":30}],28:[function(require,module,exports){
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');
const IR = require('./mercuryIR.js');

const lexer = moo.compile({
	comment:	/(?:\/\/).*?$/,
	//nl:			{ match: /[\n|\r\n]+/, lineBreaks: true },
	
	//list:		[/ring /, /array /, /list /],
	//newObject:	[/new /, /make /],
	//setObject:	[/set /, /apply /, /give /, /send /],
	//print:		[/print /, /post /, /log /],
	//global:		[/silence/, /mute/, /killAll/],

	//seperator:	/,/,
	//newLine:	/[&;]/,
	
	//note:		/[a-gA-G](?:[0-9])?(?:#+|b+|x)?/,
	//number:		/[+-]?(?:[0-9]|[0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
	number:		/[+-]?(?:[0-9]+)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?/,
	//hex:		/0x[0-9a-f]+/,
	
	divider:	/[/:]/,
	//is:			'=',
	//timevalue:	/[nm]/,

	lParam:		'(',
	rParam:		')',
	lArray:		'[',
	rArray:		']',
	//lFunc:		'{',
	//rFunc:		'}'
	
	string:		{ 
					match: /"[^"\n]*"|'[^'\n]*'|`[^\n]*`/, 
					// match: /["'`](?:\\["\\]|[^\n"'``])*["'`]/, 
					value: x => x.slice(1, x.length-1)
				},
	
	//identifier:	/[a-zA-Z\_\-][a-zA-Z0-9\_\-\.]*/,
	//identifier:	/[a-zA-Z\_\-][^\s]*/,
	identifier:	{ 
					match: /[^0-9\s][^\s\(\)\[\]]*/,
					type: moo.keywords({
						list: ['ring', 'array', 'list'],
						newObject: ['new', 'make'],
						setObject: ['set', 'apply', 'give'],
						print: ['print', 'post', 'log'],
						display: ['display', 'view']
						// global: ['silence']
					})
				},

	//signal:		/~(?:\\["\\]|[^\n"\\ \t])+/,
	//osc:		/\/(?:\\["\\]|[^\n"\\ \t])*/,

	ws:			/[ \t]+/
});

lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "main$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["globalStatement", "main$ebnf$1"], "postprocess": (d) => { return { "@global" : d[0] }}},
    {"name": "main$ebnf$2", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "main$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["listStatement", "main$ebnf$2"], "postprocess": (d) => { return { "@list" : d[0] }}},
    {"name": "main$ebnf$3", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "main$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["objectStatement", "main$ebnf$3"], "postprocess": (d) => { return { "@object" : d[0] }}},
    {"name": "objectStatement", "symbols": [(lexer.has("newObject") ? {type: "newObject"} : newObject), (lexer.has("identifier") ? {type: "identifier"} : identifier), "objectIdentifier"], "postprocess":  (d) => {
        	return {
        		"@new" : {
        			"@inst" : d[1].value,
        			"@type" : d[2]
        		}
        	}
        }},
    {"name": "objectStatement", "symbols": [(lexer.has("newObject") ? {type: "newObject"} : newObject), (lexer.has("identifier") ? {type: "identifier"} : identifier), "objectIdentifier", "objExpression"], "postprocess":  (d) => {
        	return {
        		"@new" : {
        			"@inst" : d[1].value,
        			"@type" : d[2],
        			"@functions" : d[3]
        		}
        	}
        }},
    {"name": "objectStatement", "symbols": [(lexer.has("setObject") ? {type: "setObject"} : setObject), (lexer.has("identifier") ? {type: "identifier"} : identifier), "objExpression"], "postprocess":  (d) => {	
        	return {
        		"@set" : {
        			"@name" : d[1].value,
        			"@functions" : d[2]
        		}
        	}
        }},
    {"name": "objectIdentifier", "symbols": ["name"], "postprocess": id},
    {"name": "objectIdentifier", "symbols": ["array"], "postprocess": id},
    {"name": "listStatement", "symbols": [(lexer.has("list") ? {type: "list"} : list), (lexer.has("identifier") ? {type: "identifier"} : identifier), "paramElement"], "postprocess":  (d) => {
        	return {
        		"@name" : d[1].value,
        		"@params" : d[2]
        	}
        } },
    {"name": "globalStatement", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": (d) => { return { "@comment" : d[0].value }}},
    {"name": "globalStatement", "symbols": [(lexer.has("print") ? {type: "print"} : print), "objExpression"], "postprocess": (d) => { return { "@print" : d[1] }}},
    {"name": "globalStatement", "symbols": [(lexer.has("display") ? {type: "display"} : display), "objExpression"], "postprocess": (d) => { return { "@display" : d[1] }}},
    {"name": "globalStatement", "symbols": ["name"], "postprocess": (d) => { return { "@settings" : d[0] }}},
    {"name": "objExpression", "symbols": ["paramElement"], "postprocess": (d) => [d[0]]},
    {"name": "objExpression", "symbols": ["paramElement", "objExpression"], "postprocess": (d) => [d[0], d[1]].flat(Infinity)},
    {"name": "function", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "functionArguments"], "postprocess":  (d) => {
        	return { 
        		//"@function": IR.bindFunction(d[0].value),
        		"@function": { 
        			"@name": IR.keyBind(d[0].value),
        			"@args": d[1]
        		}
        	}
        }},
    {"name": "functionArguments$ebnf$1", "symbols": ["params"], "postprocess": id},
    {"name": "functionArguments$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "functionArguments", "symbols": [(lexer.has("lParam") ? {type: "lParam"} : lParam), "functionArguments$ebnf$1", (lexer.has("rParam") ? {type: "rParam"} : rParam)], "postprocess": (d) => d[1]},
    {"name": "array$ebnf$1", "symbols": ["params"], "postprocess": id},
    {"name": "array$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array", "symbols": [(lexer.has("lArray") ? {type: "lArray"} : lArray), "array$ebnf$1", (lexer.has("rArray") ? {type: "rArray"} : rArray)], "postprocess": (d) => { return { "@array" : d[1] }}},
    {"name": "params", "symbols": ["paramElement"], "postprocess": (d) => [d[0]]},
    {"name": "params", "symbols": ["paramElement", "params"], "postprocess": (d) => [d[0], d[1]].flat(Infinity)},
    {"name": "paramElement", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => { return IR.num(d) }},
    {"name": "paramElement", "symbols": ["name"], "postprocess": (d) => d[0]},
    {"name": "paramElement", "symbols": ["array"], "postprocess": (d) => d[0]},
    {"name": "paramElement", "symbols": ["function"], "postprocess": (d) => d[0]},
    {"name": "paramElement", "symbols": ["division"], "postprocess": (d) => d[0]},
    {"name": "division", "symbols": [(lexer.has("number") ? {type: "number"} : number), (lexer.has("divider") ? {type: "divider"} : divider), (lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => { return IR.division(d) }},
    {"name": "name", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => { return IR.identifier(d) }},
    {"name": "name", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => { return { "@string" : d[0].value }}}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

},{"./mercuryIR.js":29,"moo":33}],29:[function(require,module,exports){
//====================================================================
// Mercury Intermediate Representation
// written by Timo Hoogland (c) www.timohoogland.com
//
// Returns results for the parsing tree when parsing a line of code
// Inspired by the SEMA language Intermediate Representation by
// Chris Kiefer, Thor Magnuson & Francesco Bernardo
//====================================================================

// const bind = require('./bind-functions.gen.json');

// total-serialism library functions
// const tsIR = require('./totalSerialismIR.js').functionMap;
// included instrument/object defaults
// const instruments = require('../data/objects.js').objects;
// keyword bindings, use custom keywords for functions
const keywords = require('../data/function-aliases.json');
// mini language, use single characters for keywords and functions
// const miniLang = require('../data/mini-functions.json');

let keywordBinds = {};
keywordBinds = keywordBindings(keywords, keywordBinds);
// keywordBinds = keywordBindings(miniLang, keywordBinds);
// keywordBinds = keywordBindings(langDutch, keywordBinds);
// console.log(keywordBinds);

// processing for identifiers
function identifier(obj){
	let v = obj[0].value;
	if (v.match(/^[a-gA-G](?:#+|b+|x)?(?:[0-9])?$/)){
		// is the identifier a note?
		return { "@note" : v }
	} else if (v.match(/^~[^\s]*$/)){
		// is the identifier a signal?
		return { "@signal" : v }
	}
	return { "@identifier" : v };
}

// processing for division
function division(obj){
	// concatenate division numbers to string
	return { "@division" : obj[0].value + '/' + obj[2].value };
}

// processing for numbers
function num(obj){
	// parse string to number
	return { "@number" : Number(obj[0].value) };
}

// check if the function is part of mapped functions
// else return original value
function keyBind(f){
	return (keywordBinds[f]) ? keywordBinds[f] : f;
}

// Generate a dictionary of keyword and binding pairs based on 
// input dictionary of categorized keybindings 
function keywordBindings(dict, obj){
	// console.log('Generating keyword bindings...');
	let binds = { ...obj };
	Object.keys(dict).forEach((k) => {
		// store itself first
		binds[k] = k;
		dict[k].forEach((b) => {
			if (binds[b]) {
				// if already exists ignore and print warning
				console.log('Warning! Duplicate keyword: [ '+b+' ] \nfor: [ '+binds[b]+' ] and: [ '+k+' ] \n => BIND IGNORED');
			} else {
				// store binding name with resulting keyword
				binds[b] = k;
			}
			// console.log('mapped: [ '+b+' ] to: [ '+k+' ]');
		});
	});
	// console.log('...done!');
	return binds;
}

module.exports = { identifier, division, num, keyBind };
},{"../data/function-aliases.json":25}],30:[function(require,module,exports){
//====================================================================
// Mercury parser
//
// Parse a textfile of Mercury code and return the .json syntax tree
// written by Timo Hoogland 2021, www.timohoogland.com
//====================================================================

const nearley = require('nearley');
const grammar = require('./mercuryGrammar.js');
const worker = require('./mercuryTraverser.js');

const DEBUG = false;

function mercuryParser(code=''){
	// split multiple lines into array of strings
	let lines = code.includes('\r\n')? code.split('\r\n') : code.split('\n');
	let syntaxTree = { '@main' : [] };
	let errors = [];
	let warnings = [];
	let parseTree = {};
	let parser;

	for (let l=0; l<lines.length; l++){
		// let line = lines[l].trim();
		if (lines[l].trim() !== ''){	
			// create a Parser object from our grammar
			parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: false });

			try {
				// parse something!
				parser.feed(lines[l])
				// parser.results is an array of possible parsings.
				if (DEBUG){
					console.log('parsing:', lines[l]);

					if (parser.results.length > 1){
						console.log("Warning, ambiguous grammar!");
						for (var i=0; i<results; i++){
							// console.log("Result", i+1, "of", results, "\n", util.inspect(parser.results[i], { depth: 10 }), "\n");
							console.log(parser.results[i]);
						}
					} else {
						console.log(parser.results[0]);
					}
				}
				// only if not undefined
				if (parser.results[0] !== undefined){
					// build the tokenized syntax tree
					syntaxTree['@main'].push(parser.results[0]);
				} else {
					throw new Error();
				}
			} catch (e) {
				// console.error(e);
				let err = `Error at line ${Number(l)+1}`;
				try {
					err += `: Unexpected ${e.token.type}: '${e.token.value}' at ${lines[l].slice(0, e.token.offset)}${e.token.text}<-`;
				} catch (e) {}

				if (DEBUG){
					console.error(err);
				}
				errors.push(err);
			}
		}
	}

	// traverse Syntax Tree and create Intermediate Representation
	parseTree = worker.traverseTreeIR(syntaxTree['@main']);

	errors = parseTree.errors.concat(errors);
	delete parseTree.errors;
	
	warnings = parseTree.warnings;
	delete parseTree.warnings;
	// return both the parseTree and syntaxTree in one object
	return { 
		'parseTree': parseTree, 
		'syntaxTree': syntaxTree,
		'errors': errors,
		'warnings' : warnings
	};
}
exports.mercuryParser = mercuryParser;
},{"./mercuryGrammar.js":28,"./mercuryTraverser.js":31,"nearley":34}],31:[function(require,module,exports){
//====================================================================
// Mercury Intermediate Representation
// written by Timo Hoogland (c) www.timohoogland.com
//
// Returns results for the parsing tree when parsing a line of code
// Inspired by the SEMA language Intermediate Representation by
// Chris Kiefer, Thor Magnuson & Francesco Bernardo
//====================================================================

// const bind = require('./bind-functions.gen.json');

// total-serialism library functions
const tsIR = require('./totalSerialismIR.js').functionMap;
// mercury IR
const keyBind = require('./mercuryIR.js').keyBind;
// included instrument/object defaults
const instruments = require('../data/instrument-defaults.js').instrumentDefaults;
// mini language, use single characters for keywords and functions
// const miniLang = require('../data/mini-functions.json');

// code accepted global parameters
const globals = 'tempo signature amp scale root randomSeed highPass lowPass silence sound crossFade'.split(' ');

// code defaults and parsetree
let code = {
	'global' : {
		// 'tempo' : [ 90 ],
		// 'volume' : [ 0.8 ],
		// 'scale' : [ 'chromatic', 'c' ],
		// 'root' : [ 'c' ],
		// 'signature' : [ '4/4' ],
		'randomSeed' : [ 0 ],
		'highPass' : [ 5, 0 ],
		'lowPass' : [ 18000, 0 ],
		'silence' : false,
	},
	'variables' : {},
	'objects' : {},
	'groups' : {
		'all' : []
	},
	'print' : [],
	'display' : [],
	'comments' : [],
	'errors' : [],
	'warnings' : []
}

function deepCopy(o){
	return JSON.parse(JSON.stringify(o));
}

function traverseTreeIR(tree){
	// deepcopy the syntax tree
	let tmp = deepCopy(tree);
	// deepcopy the code template
	let ccode = deepCopy(code);
	tmp.map((t) => {
		// console.log('@tree', t);
		tmp = traverseTree(t, ccode);
	})
	return ccode;
}

function traverseTree(tree, code, level, obj){
	// console.log(`traversing`, tree);
	let map = {
		'@global' : (el, ccode) => {
			// if global code (comments, numbers, functions)
			// console.log({'global =>':el});
			return traverseTree(el, ccode, '@setting');
		},
		'@comment' : (el, ccode) => {
			// console.table({ '@comment' : el });
			// if a comment, just return
			ccode.comments.push(el);
			return ccode;
		},
		'@print' : (el, ccode) => {
			// console.log({'print =>':el});
			el.map((e) => {
				Object.keys(e).forEach((k) => {
					let p = map[k](e[k], ccode);
					ccode.print.push(p);
				});
			});
			return ccode;
		},
		'@display' : (el, ccode) => {
			ccode.display.push(traverseTree(el, ccode));
			return ccode;
		},
		'@settings' : (el, ccode) => {
			// console.log('@settings', traverseTree(el, ccode));
			let name = keyBind(traverseTree(el, ccode));
			if (globals.includes(name)){
				ccode.global[name] = true;
			} else {
				ccode.warnings.push(`Warning: Unkown setting name: ${name}`);
			}
			return ccode;
		},
		'@list' : (el, ccode) => {
			// if list/ring/array is instantiated store in variables
			// console.log({'list =>':el});
			let r = traverseTree(el['@params'], ccode, '@list');
			ccode.variables[el['@name']] = r;
			return ccode;
		},
		'@object' : (el, ccode) => {
			// if object is instantiated or set (new/make, set/apply)
			// console.log({'@object =>':el});
			return traverseTree(el, ccode);
		},
		'@new' : (el, ccode) => {
			// when new instrument check for instrument 
			// console.log({'@new =>':el});
			let inst = map['@inst'](el['@inst'], ccode);
			delete el['@inst'];
			
			Object.keys(el).forEach((k) => {
				inst = map[k](el[k], ccode, '@object', inst);
			});
			// generate unique ID name for object if no name()
			if (!inst.functions.name){
				inst.functions.name = [ uniqueID(8) ];
			}
			// add object to complete code
			ccode.objects[inst.functions.name] = inst;
			return ccode;
		},
		'@set' : (el, ccode) => {
			// set instrument, all or global parameters
			// console.log({'set =>':el});
			let name = keyBind(el['@name']);
			delete el['@name'];

			if (ccode.objects[name]){
				// if part of current instrument objects
				let inst = ccode.objects[name];
				Object.keys(el).forEach((k) => {
					inst = map[k](el[k], ccode, '@object', inst);
				});
				ccode.objects[inst.functions.name] = inst;
			} else if (name === 'all'){
				// if set all, set all instrument objects
				Object.keys(ccode.objects).forEach((o) => {
					let inst = ccode.objects[o];
					Object.keys(el).forEach((k) => {
						inst = map[k](el[k], ccode, '@object', inst);
					});
					ccode.objects[inst.functions.name] = inst;
				});
			} else {
				// if name is part of global settings
				let args;
				Object.keys(el).forEach((k) => {
					args = map[k](el[k], ccode, '@setting', args);
				});
				// if name is a total-serialism function
				if (tsIR[name]){
					if (args){
						tsIR[name](...args);
					} else {
						tsIR[name]();
					}
				}
				if (!globals.includes(name)){
					ccode.warnings.push(`Warning: Unkown instrument or setting: ${name}`);
				}
				ccode.global[name] = args;
			} 
			// else {
			// }
			return ccode;
		},
		'@inst' : (el, ccode) => {
			// check instruments for name and then deepcopy to output
			// if not a valid instrument return empty instrument
			// console.log({'@inst =>': el});
			let inst;
			if (!instruments[el]){
				inst = deepCopy(instruments['empty']);
				inst.type = el;
				ccode.warnings.push(`Warning: Unknown instrument type: ${el}`);
			} else { 
				inst = deepCopy(instruments[el]);
			}
			inst.object = el;
			return inst;
		},
		'@type' : (el, ccode, level, inst) => {
			// return the value of the type, can be identifier, string, array
			// console.log({'@type':el, '@inst':inst});
			inst.type = traverseTree(el, ccode);
			return inst;
		},
		'@functions' : (el, ccode, level, inst) => {
			// add all functions to object or parse for settings
			// console.log({'@functions =>':el, '@l':level, '@i':inst});
			if (level === '@setting'){
				// set arguments from global settings
				let args = [];
				el.map((e) => {
					Object.keys(e).map((k) => {
						args.push(map[k](e[k], ccode));
					});
				});
				return args;
			}

			let funcs = inst.functions;
			// for every function in functions list
			el.map((e) => {
				Object.keys(e).map((k) => {
					funcs = map[k](e[k], ccode, '@object', funcs);
				});
			});
			inst.functions = funcs;
			return inst;
		},
		'@function' : (el, ccode, level, funcs) => {
			// for every function check if the keyword maps to other
			// function keyword from keyword bindings.
			// if function is part of ts library execute and parse results
			// console.log({'@f':el, '@l':level, '@fs':funcs});
			let args = [];
			let func = keyBind(el['@name']);

			if (el['@args'] !== null){
				// fill arguments if not null
				el['@args'].map((e) => {
					Object.keys(e).map((k) => {
						args.push(map[k](e[k], ccode, '@list'));
					});
				});
			}

			if (tsIR[func] && level !== '@object'){
				// if function is part of TS and not in @object level
				try {
					if (args){
						return tsIR[func](...args);
					}
					return tsIR[func]();
				} catch (e) {
					ccode.errors.push(`Error in arguments for function: ${func}`)
					return [0];
				}
			}
			else if (level === '@list'){
				// if not part of TS and in @list level
				ccode.errors.push(`Unknown list function: ${func}`);
				return [0];
			} 
			else if (level === '@object'){
				// if in @object level ignore TS functions
				if (func === 'add_fx'){
					funcs[func].push(args);
				} else {
					if (func === 'name'){
						ccode.groups.all.push(...args);
					}
					else if (func === 'group'){
						// TO-DO:
						// code for group functions
					}
					funcs[func] = args;
				}
				return funcs;
			} else {
				el['@args'] = args;
				return el;
			}
		},
		'@array' : (el, ccode) => {
			// console.log({'@array':el});
			let arr = [];
			// if not an empty array parse all items
			if (el){
				el.map((e) => {
					Object.keys(e).map((k) => {
						arr.push(map[k](e[k], ccode));
					});
				});
			}
			return arr;
		},
		'@identifier' : (el, ccode) => {
			// if identifier is variable return the content
			if (ccode.variables[el]){
				return ccode.variables[el];
			}
			return el;
		},
		'@string' : (el) => {
			return el;
		},
		'@number' : (el) => {
			return el;
		},
		'@division' : (el) => {
			return el;
		},
		'@note' : (el) => {
			return el;
		},
		'@signal' : (el) => {
			return el;
		}
	}

	if (Array.isArray(tree)) {
		// console.log('array process of', tree);
		tree.map((el) => {
			Object.keys(el).map((k) => {
				code = map[k](el[k], code, level, obj);
			});
		});
	} else {
		// console.log('object process of', tree);
		if (tree){
			Object.keys(tree).map((k) => {
				code = map[k](tree[k], code, level, obj);
			});
		}
	}
	return code;
}

function uniqueID(length){
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
	let s = '';

	for (let l=0; l<length; l++){
		s += chars[Math.floor(Math.random() * chars.length)];
	}
	return s;
}

module.exports = { traverseTreeIR };
},{"../data/instrument-defaults.js":26,"./mercuryIR.js":29,"./totalSerialismIR.js":32}],32:[function(require,module,exports){

const Gen  = require('total-serialism').Generative;
const Algo = require('total-serialism').Algorithmic;
const Mod  = require('total-serialism').Transform;
const Rand = require('total-serialism').Stochastic;
const Stat = require('total-serialism').Statistic;
const TL   = require('total-serialism').Translate;
const Util = require('total-serialism').Utility;

const functionMap = {
	// All the Array transformation/generation methods
	// From the total-serialism Node package
	// 
	// Generative Methods
	// 
	// generate an array of ints between specified range
	'spread' : (...v) => {
		return Gen.spread(...v);
	},
	// generate an array of floats between range
	'spreadFloat' : (...v) => {
		return Gen.spreadFloat(...v);
	},
	'spreadF' : (...v) => {
		return Gen.spreadFloat(...v);
	},
	// generate an array of ints between specified range (inclusive)
	'spreadInclusive' : (...v) => {
		return Gen.spreadInclusive(...v);
	},
	'spreadInc' : (...v) => {
		return Gen.spreadInclusive(...v);
	},
	// generate an array of floats between range (inclusive)
	'spreadInclusiveFloat' : (...v) => {
		return Gen.spreadInclusiveFloat(...v);
	},
	'spreadInclusiveF' : (...v) => {
		return Gen.spreadInclusiveFloat(...v);
	},
	'spreadIncF' : (...v) => {
		return Gen.spreadInclusiveFloat(...v);
	},
	// generate an array between range (exponentially)
	'spreadExp' : (...v) => {
		return Gen.spreadExp(...v);
	},
	'spreadExpFloat' : (...v) => {
		return Gen.spreadExpFloat(...v);
	},
	'spreadExpF' : (...v) => {
		return Gen.spreadExpFloat(...v);
	},
	'spreadInclusiveExp' : (...v) => {
		return Gen.spreadInclusiveExp(...v);
	},
	'spreadIncExp' : (...v) => {
		return Gen.spreadInclusiveExp(...v);
	},
	'spreadInclusiveExpFloat' : (...v) => {
		return Gen.spreadInclusiveExpFloat(...v);
	},
	'spreadIncExpF' : (...v) => {
		return Gen.spreadInclusiveExpFloat(...v);
	},
	// fill an array with duplicates of a value
	'fill' : (...v) => {
		return Gen.fill(...v);
	},
	// generate an array from a sinewave function
	'sine' : (...v) => {
		return Gen.sine(...v);
	},
	'sineFloat' : (...v) => {
		return Gen.sineFloat(...v);
	},
	'sineF' : (...v) => {
		return Gen.sineFloat(...v);
	},
	'sinF' : (...v) => {
		return Gen.sineFloat(...v);
	},
	// generate an array from a cosine function
	'cosine' : (...v) => {
		return Gen.cosine(...v);
	},
	'cosineFloat' : (...v) => {
		return Gen.cosineFloat(...v);
	},
	'cosineF' : (...v) => {
		return Gen.cosineFloat(...v);
	},
	'cosF' : (...v) => {
		return Gen.cosineFloat(...v);
	},
	// generate an array from a sawtooth function
	'saw' : (...v) => {
		return Gen.saw(...v);
	},
	'sawFloat' : (...v) => {
		return Gen.sawFloat(...v);
	},
	'sawF' : (...v) => {
		return Gen.sawFloat(...v);
	},
	// generate an array from a squarewave function
	'square' : (...v) => {
		return Gen.square(...v);
	},
	'rect' : (...v) => {
		return Gen.square(...v);
	},
	'squareFloat' : (...v) => {
		return Gen.squareFloat(...v);
	},
	'squareF' : (...v) => {
		return Gen.squareFloat(...v);
	},
	'rectF' : (...v) => {
		return Gen.squareFloat(...v);
	},
	// 
	// Algorithmic Methods
	// 
	// generate a euclidean rhythm evenly spacing n-beats amongst n-steps
	// switched to fastEuclid method
	'euclid' : (...v) => {
		// return Algo.euclid(...v);
		return Algo.fastEuclid(...v);
	},
	'euclidean' : (...v) => {
		// return Algo.euclid(...v);
		return Algo.fastEuclid(...v);
	},
	// generate a rhythm based on a hexadecimal string (0-f)
	'hexBeat' : (...v) => {
		// console.log("@hexBeat", v);
		return Algo.hexBeat(v[0]);
	},
	'hex' : (...v) => {
		return Algo.hexBeat(v[0]);
	},
	// generate a sequence of numbers from the collatz conjecture
	// thread lightly, can grow large with large input numbers
	'collatz' : (...v) => {
		return Algo.collatz(v[0]);
	},
	'collatzMod' : (...v) => {
		return Algo.collatzMod(...v);
	},
	// generate the numbers in the fibonacci sequence
	'fibonacci' : (...v) => {
		return Algo.fibonacci(...v);
	},
	// generate the pisano periods from the fibonacci sequence
	'pisano' : (...v) => {
		return Algo.pisano(...v);
	},
	'fibonacciMod' : (...v) => {
		return functionMap.pisano(v);
	},
	// generate the numbers in the fibonacci sequence
	'pell' : (...v) => {
		return Algo.pell(...v);
	},
	// generate the numbers in the fibonacci sequence
	'lucas' : (...v) => {
		return Algo.lucas(...v);
	},
	// generate the numbers in the fibonacci sequence
	'threeFibonacci' : (...v) => {
		return Algo.threeFibonacci(...v);
	},
	// Per Nørgards Inifity series
	'infinitySeries' : (...v) => {
		return Algo.infinitySeries(...v);
	},
	'infSeries' : (...v) => {
		return functionMap.infinitySeries(v);
	},
	// 
	// Stochastic Methods
	// 
	// set the random number generator seed
	'randomSeed' : (...v) => {
		return Rand.seed(v[0]);
	},
	// get the random number generator seed
	'getSeed' : () => {
		return Rand.getSeed();
	},
	// generate an array of random integers in range
	'random' : (...v) => {
		return Rand.random(...v);
	},
	'rand' : (...v) => {
		return Rand.random(...v);
	},
	// generate an array of random floats
	'randomFloat' : (...v) => {
		return Rand.randomFloat(...v);
	},
	'randomF' : (...v) => {
		return Rand.randomFloat(...v);
	},
	'randF' : (...v) => {
		return Rand.randomFloat(...v);
	},
	// generate a random walk (drunk)
	'drunk' : (...v) => {
		return Rand.drunk(...v);
	},
	'drunkFloat' : (...v) => {
		return Rand.drunkFloat(...v);
	},
	'drunkF' : (...v) => {
		return Rand.drunkFloat(...v);
	},
	// generate random values picked from an urn
	'urn' : (...v) => {
		return Rand.urn(...v);
	},
	// generate an array of coin tosses
	'coin' : (...v) => {
		return Rand.coin(v[0]);
	},
	// generate an array of dice rolls
	'dice' : (...v) => {
		return Rand.dice(v[0]);
	},
	// generate random clave patterns
	'clave' : (...v) => {
		return Rand.clave(...v);
	},
	// generate an array of twelveTone notes
	'twelveTone' : () => {
		return Rand.twelveTone();
	},
	// choose values at random from a ring provided
	'choose' : (...v) => {
		return Rand.choose(...v);
	},
	// pick values randomly from a ring provided and remove chosen
	'pick' : (...v) => {
		return Rand.pick(...v);
	},
	// shuffle the items in an array, influenced by the random seed
	'shuffle' : (v) => {
		return Rand.shuffle(v);
	},
	'scramble' : (v) => {
		return Rand.shuffle(v);
	},
	// expand an array based upon the pattern within an array
	// arbitrarily choosing the next 
	'expand' : (...v) => {
		// check if arguments are correct
		v[0] = (Array.isArray(v[0])) ? v[0] : [v[0]];
		v[1] = Math.max(2, (Array.isArray(v[1])) ? v[1][0] : v[1]);
		return Rand.expand(v[0], v[1]);
	},
	// 
	// Transformational Methods
	// 
	// duplicate an array with an offset added to every value
	'clone' : (...v) => {
		return Mod.clone(...v);
	},
	// combine multiple numbers/arrays into one
	'combine' : (...v) => {
		return Mod.combine(...v);
	},
	'concat' : (...v) => {
		return Mod.combine(...v);
	},
	'join' : (...v) => {
		return Mod.combine(...v);
	},
	// duplicate an array certain amount of times
	'duplicate' : (...v) => {
		return Mod.duplicate(...v);
	},
	'dup' : (...v) => {
		return Mod.duplicate(...v);
	},
	'copy' : (...v) => {
		return Mod.duplicate(...v);
	},
	// Pad an array with zeroes (or any other value) up to the length specified.
	'pad' : (...v) => {
		return Mod.pad(...v);
	},
	// add zeroes to a rhythm to make it play once over a certain amount of bars
	'every' : (...v) => {
		return Mod.every(...v);
	},
	// flatten a multidimensional array to 1D (or specified)
	'flatten' : (...v) => {
		return Util.flatten(...v);
	},
	'flat' : (...v) => {
		return functionMap.flatten(v);
	},
	// invert an array around a center point
	'invert' : (...v) => {
		return Mod.invert(...v);
	},
	'inverse' : (...v) => {
		return Mod.invert(...v);
	},
	'flip' : (...v) => {
		return Mod.invert(...v);
	},
	'inv' : (...v) => {
		return Mod.invert(...v);
	},
	// filter items from an array
	'filter' : (...v) => {
		return Mod.filter(v[0], v.slice(1, v.length));
	},
	// lookup the values from an array based on another array
	'lookup' : (...v) => {
		return Mod.lookup(...v);
	},
	'get' : (...v) => {
		return Mod.lookup(...v);
	},
	// interleave multiple arrays into one
	'lace' : (...v) => {
		return Mod.lace(...v);
	},
	'zip' : (...v) => {
		return Mod.lace(...v);
	},
	// merge arrays into a 2D-array
	'merge' : (...v) => {
		return Mod.merge(...v);
	},
	// 'mix' : (...v) => {
	// 	return Mod.merge(...v);
	// },
	// generate a palindrome of an array
	'palindrome' : (...v) => {
		return Mod.palindrome(...v);
	},
	'palin' : (...v) => {
		return Mod.palindrome(...v);
	},
	'mirror' : (...v) => {
		return Mod.palindrome(...v);
	},
	// repeat the individual values of an array by a certain amount
	'repeat' : (...v) => {
		return Mod.repeat(...v);
	},
	// reverse an array
	'reverse' : (...v) => {
		return Mod.reverse(...v);
	},
	'rev' : (...v) => {
		return Mod.reverse(...v);
	},
	'retrograde' : (...v) => {
		return Mod.reverse(...v);
	},
	// rotate an array in positive or negative direction
	'rotate' : (...v) => {
		return Mod.rotate(...v);
	},
	'rot' : (...v) => {
		return Mod.rotate(...v);
	},
	'turn' : (...v) => {
		return Mod.rotate(...v);
	},
	// sort an array in ascending or descending order
	'sort' : (...v) => {
		return Stat.sort(...v);
	},
	// spray values on the non-zero places of another array
	'spray' : (...v) => {
		return Mod.spray(...v);
	},
	// slice an array into one or multiple parts
	'slice' : (...v) => {
		return Mod.slice(...v);
	},
	// split an array recursively till the end
	'split' : (...v) => {
		return Mod.split(...v);
	},
	// cut a piece of the array and return
	'cut' : (...v) => {
		return Mod.slice(...v)[0];
	},
	// cut a piece of the array and return the last part
	'cutLast' : (...v) => {
		return Mod.slice(...v).pop();
	},
	// stretch an array to a specified length, interpolating values
	'stretch' : (...v) => {
		return Util.trunc(functionMap['stretchFloat'](...v));
	},
	'stretchF' : (...v) => {
		return functionMap['stretchFloat'](...v);
	},
	'stretchFloat' : (...v) => {
		// swap because of implementation in total-serialism
		v[0] = (Array.isArray(v[0])) ? v[0] : [v[0]];
		v[1] = Math.max(2, (Array.isArray(v[1])) ? v[1][0] : v[1]);
		return Mod.stretch(...v);
	},
	// remove duplicates from an array, leave order intact
	'unique' : (...v) => {
		return Mod.unique(...v);
	},
	'thin' : (...v) => {
		return Mod.unique(...v);
	},
	// 
	// Translate Methods
	//
	'tempo' : (...v) => {
		TL.setTempo(v[0]);
		return TL.getTempo();
	},
	'getTempo' : () => {
		return TL.getTempo();
	},
	'scale' : (...v) => {
		TL.setScale(...v);
		return TL.getSettings().map;
	},
	'getScale' : () => {
		return TL.getSettings().scale;
	},
	'getRoot' : () => {
		return TL.getSettings().root;
	},
	'getScaleMap' : () => {
		return TL.getSettings().map;
	},
	'scaleNames' : (...v) => {
		return TL.getScales();
	},
	'tuning' : (...v) => {
		console.log('set tuning', v);
	},
	'root' : (v) => {
		TL.setRoot(v[0]);
		return TL.getSettings().root;
	},
	// tempo translate methods
	// divisionToMs
	'divisionToMs' : (...v) => {
		return TL.divisionToMs(...v);
	},
	'dtoms' : (...v) => {
		return TL.divisionToMs(...v);
	},
	// divisionToRatio
	'divisionToRatio' : (...v) => {
		return TL.divisionToRatio(...v);
	},
	'dtor' : (...v) => {
		return TL.divisionToRatio(...v);
	},
	// ratioToMs
	'ratioToMs' : (...v) => {
		return TL.ratioToMs(...v);
	},
	'rtoms' : (...v) => {
		return TL.ratioToMs(...v);
	},
	// timeToRatio
	'timeToRatio' : (...v) => {
		return TL.timevalueToRatio(...v);
	},
	'ttor' : (...v) => {
		return TL.timevalueToRatio(...v);
	},
	// pitch translate methods
	// midiToNote
	'midiToNote' : (...v) => {
		return TL.midiToNote(...v);
	},
	'mton' : (...v) => {
		return TL.midiToNote(...v);
	},
	// midiToFreq
	'midiToFreq' : (...v) => {
		return TL.midiToFreq(...v);
	},
	'mtof' : (...v) => {
		return TL.midiToFreq(...v);
	},
	// freqToMidi
	'freqToMidi' : (...v) => {
		return TL.freqToMidi(...v);
	},
	'ftom' : (...v) => {
		return TL.freqToMidi(...v);
	},
	// freqToNote
	'freqToNote' : (...v) => {
		return TL.freqToNote(...v);
	},
	'fton' : (...v) => {
		return TL.freqToNote(...v);
	},
	// noteToMidi
	'noteToMidi' : (...v) => {
		return TL.ntom(...v);
	},
	'ntom' : (...v) => {
		return TL.ntom(...v);
	},
	// noteToFreq
	'noteToFreq' : (...v) => {
		return TL.noteToFreq(...v);
	},
	'ntof' : (...v) => {
		return TL.noteToFreq(...v);
	},
	// chromaToRelative
	'chromaToRelative' : (...v) => {
		return TL.chromaToRelative(...v);
	},
	'ctor' : (...v) => {
		return TL.chromaToRelative(...v);
	},
	// relativeToMidi
	'relativeToMidi' : (...v) => {
		return TL.relativeToMidi(...v);
	},
	'rtom' : (...v) => {
		return TL.relativeToMidi(...v);
	},
	// relativeToFreq
	'relativeToFreq' : (...v) => {
		return TL.relativeToFreq(...v);
	},
	'rtof' : (...v) => {
		return TL.relativeToFreq(...v);
	},
	// mapToScale functions
	'toScale' : (...v) => {
		return TL.toScale(...v);
	},
	// ratio to cent
	'ratioToCent' : (...v) => {
		return TL.ratioToCent(...v);
	},
	'rtoc' : (...v) => {
		return TL.ratioToCent(...v);
	},
	// chords generation
	'chordsFromNumerals' : (...v) => {
		return TL.chordsFromNumerals(v);
	},
	'makeChords' : (...v) => {
		return functionMap.chordsFromNumerals(v);
	},
	'chordsFigured' : (...v) => {
		return functionMap.chordsFromNumerals(v);
	},
	'chordsFromNames' : (...v) => {
		return TL.chordsFromNames(...v);
	},
	'chordsNamed' : (...v) => {
		return functionMap.chordsFromNames(v);
	},
	// 
	// Statistic Methods
	// 
	// IMPLEMENTATION NEEDED
	// maximum
	// minimum
	// mean
	// median
	// mode

	// 
	// Utility Methods
	// 
	// wrap values between a low and high range
	'wrap' : (...v) => {
		return Util.wrap(...v);
	},
	// fold values between a low and high range
	'fold' : (...v) => {
		return Util.fold(...v);
	},
	// clip values between a low and high range
	'clip' : (...v) => {
		return Util.constrain(...v);
	},
	'constrain' : (...v) => {
		return Util.constrain(...v);
	},
	// scale values from an input range to an output range
	'map' : (...v) => {
		return Util.map(...v);
	},
	// sum the values from an array into one number
	'sum' : (...v) => {
		return Util.sum(...v);
	},
	'reduce' : (...v) => {
		return Util.sum(...v);
	},
	// return the size of an array
	'size' : (v) => {
		return Util.size(v);
	},
	// length unsupported because overwritten by function map to env
	// 'length' : (v) => {
	// 	return Util.size(v);
	// },
	// add 1 or more values to an array
	'add' : (...v) => {
		return Util.add(...v);
	},
	// subtract 1 or more values from an array
	'subtract' : (...v) => {
		return Util.subtract(...v);
	},
	'sub' : (...v) => {
		return Util.subtract(...v);
	},
	// multiply 1 or more values to an array
	'multiply' : (...v) => {
		return Util.multiply(...v);
	},
	'mult' : (...v) => {
		return Util.multiply(...v);
	},
	'mul' : (...v) => {
		return Util.multiply(...v);
	},
	// divide 1 or more values from an array
	'divide' : (...v) => {
		return Util.divide(...v);
	},
	'div' : (...v) => {
		return Util.divide(...v);
	},
	// normalize an array to 0-1 range
	'normalize' : (...v) => {
		return Util.normalize(...v);
	},
	'norm' : (...v) => {
		return Util.normalize(...v);
	},
	// signed normalize an array to -1 1 range
	'signedNormalize' : (...v) => {
		return Util.add(Util.mult(Util.norm(...v), 2), -1);
	},
	'snorm' : (...v) => {
		return functionMap.signedNormalize(...v);
	},
	// take the modulus of an array
	'modulo' : (...v) => {
		return Util.mod(...v);
	},
	'mod' : (...v) => {
		return Util.mod(...v);
	},
	// convert floats to integers by truncating
	'int' : (v) => {
		return Util.arrayCalc(v, 0, (a) => Math.trunc(a));
	},
	// round down floats
	'floor' : (v) => {
		return Util.arrayCalc(v, 0, (a) => Math.floor(a));
	},
	// round floats to nearest integer
	'round' : (v) => {
		return Util.arrayCalc(v, 0, (a) => Math.round(a));
	},
	'ceil' : (v) => {
		return Util.arrayCalc(v, 0, (a) => Math.ceil(a));
	}
}
exports.functionMap = functionMap;
},{"total-serialism":47}],33:[function(require,module,exports){
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory) /* global define */
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.moo = factory()
  }
}(this, function() {
  'use strict';

  var hasOwnProperty = Object.prototype.hasOwnProperty
  var toString = Object.prototype.toString
  var hasSticky = typeof new RegExp().sticky === 'boolean'

  /***************************************************************************/

  function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
  function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

  function reEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  function reGroups(s) {
    var re = new RegExp('|' + s)
    return re.exec('').length - 1
  }
  function reCapture(s) {
    return '(' + s + ')'
  }
  function reUnion(regexps) {
    if (!regexps.length) return '(?!)'
    var source =  regexps.map(function(s) {
      return "(?:" + s + ")"
    }).join('|')
    return "(?:" + source + ")"
  }

  function regexpOrLiteral(obj) {
    if (typeof obj === 'string') {
      return '(?:' + reEscape(obj) + ')'

    } else if (isRegExp(obj)) {
      // TODO: consider /u support
      if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
      if (obj.global) throw new Error('RegExp /g flag is implied')
      if (obj.sticky) throw new Error('RegExp /y flag is implied')
      if (obj.multiline) throw new Error('RegExp /m flag is implied')
      return obj.source

    } else {
      throw new Error('Not a pattern: ' + obj)
    }
  }

  function pad(s, length) {
    if (s.length > length) {
      return s
    }
    return Array(length - s.length + 1).join(" ") + s
  }

  function lastNLines(string, numLines) {
    var position = string.length
    var lineBreaks = 0;
    while (true) {
      var idx = string.lastIndexOf("\n", position - 1)
      if (idx === -1) {
        break;
      } else {
        lineBreaks++
      }
      position = idx
      if (lineBreaks === numLines) {
        break;
      }
      if (position === 0) {
        break;
      }
    }
    var startPosition = 
      lineBreaks < numLines ?
      0 : 
      position + 1
    return string.substring(startPosition).split("\n")
  }

  function objectToRules(object) {
    var keys = Object.getOwnPropertyNames(object)
    var result = []
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var thing = object[key]
      var rules = [].concat(thing)
      if (key === 'include') {
        for (var j = 0; j < rules.length; j++) {
          result.push({include: rules[j]})
        }
        continue
      }
      var match = []
      rules.forEach(function(rule) {
        if (isObject(rule)) {
          if (match.length) result.push(ruleOptions(key, match))
          result.push(ruleOptions(key, rule))
          match = []
        } else {
          match.push(rule)
        }
      })
      if (match.length) result.push(ruleOptions(key, match))
    }
    return result
  }

  function arrayToRules(array) {
    var result = []
    for (var i = 0; i < array.length; i++) {
      var obj = array[i]
      if (obj.include) {
        var include = [].concat(obj.include)
        for (var j = 0; j < include.length; j++) {
          result.push({include: include[j]})
        }
        continue
      }
      if (!obj.type) {
        throw new Error('Rule has no type: ' + JSON.stringify(obj))
      }
      result.push(ruleOptions(obj.type, obj))
    }
    return result
  }

  function ruleOptions(type, obj) {
    if (!isObject(obj)) {
      obj = { match: obj }
    }
    if (obj.include) {
      throw new Error('Matching rules cannot also include states')
    }

    // nb. error and fallback imply lineBreaks
    var options = {
      defaultType: type,
      lineBreaks: !!obj.error || !!obj.fallback,
      pop: false,
      next: null,
      push: null,
      error: false,
      fallback: false,
      value: null,
      type: null,
      shouldThrow: false,
    }

    // Avoid Object.assign(), so we support IE9+
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        options[key] = obj[key]
      }
    }

    // type transform cannot be a string
    if (typeof options.type === 'string' && type !== options.type) {
      throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
    }

    // convert to array
    var match = options.match
    options.match = Array.isArray(match) ? match : match ? [match] : []
    options.match.sort(function(a, b) {
      return isRegExp(a) && isRegExp(b) ? 0
           : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
    })
    return options
  }

  function toRules(spec) {
    return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
  }

  var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true})
  function compileRules(rules, hasStates) {
    var errorRule = null
    var fast = Object.create(null)
    var fastAllowed = true
    var unicodeFlag = null
    var groups = []
    var parts = []

    // If there is a fallback rule, then disable fast matching
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].fallback) {
        fastAllowed = false
      }
    }

    for (var i = 0; i < rules.length; i++) {
      var options = rules[i]

      if (options.include) {
        // all valid inclusions are removed by states() preprocessor
        throw new Error('Inheritance is not allowed in stateless lexers')
      }

      if (options.error || options.fallback) {
        // errorRule can only be set once
        if (errorRule) {
          if (!options.fallback === !errorRule.fallback) {
            throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
          } else {
            throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
          }
        }
        errorRule = options
      }

      var match = options.match.slice()
      if (fastAllowed) {
        while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
          var word = match.shift()
          fast[word.charCodeAt(0)] = options
        }
      }

      // Warn about inappropriate state-switching options
      if (options.pop || options.push || options.next) {
        if (!hasStates) {
          throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
        }
        if (options.fallback) {
          throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
        }
      }

      // Only rules with a .match are included in the RegExp
      if (match.length === 0) {
        continue
      }
      fastAllowed = false

      groups.push(options)

      // Check unicode flag is used everywhere or nowhere
      for (var j = 0; j < match.length; j++) {
        var obj = match[j]
        if (!isRegExp(obj)) {
          continue
        }

        if (unicodeFlag === null) {
          unicodeFlag = obj.unicode
        } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
          throw new Error('If one rule is /u then all must be')
        }
      }

      // convert to RegExp
      var pat = reUnion(match.map(regexpOrLiteral))

      // validate
      var regexp = new RegExp(pat)
      if (regexp.test("")) {
        throw new Error("RegExp matches empty string: " + regexp)
      }
      var groupCount = reGroups(pat)
      if (groupCount > 0) {
        throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
      }

      // try and detect rules matching newlines
      if (!options.lineBreaks && regexp.test('\n')) {
        throw new Error('Rule should declare lineBreaks: ' + regexp)
      }

      // store regex
      parts.push(reCapture(pat))
    }


    // If there's no fallback rule, use the sticky flag so we only look for
    // matches at the current index.
    //
    // If we don't support the sticky flag, then fake it using an irrefutable
    // match (i.e. an empty pattern).
    var fallbackRule = errorRule && errorRule.fallback
    var flags = hasSticky && !fallbackRule ? 'ym' : 'gm'
    var suffix = hasSticky || fallbackRule ? '' : '|'

    if (unicodeFlag === true) flags += "u"
    var combined = new RegExp(reUnion(parts) + suffix, flags)
    return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
  }

  function compile(rules) {
    var result = compileRules(toRules(rules))
    return new Lexer({start: result}, 'start')
  }

  function checkStateGroup(g, name, map) {
    var state = g && (g.push || g.next)
    if (state && !map[state]) {
      throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
    }
    if (g && g.pop && +g.pop !== 1) {
      throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
    }
  }
  function compileStates(states, start) {
    var all = states.$all ? toRules(states.$all) : []
    delete states.$all

    var keys = Object.getOwnPropertyNames(states)
    if (!start) start = keys[0]

    var ruleMap = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      ruleMap[key] = toRules(states[key]).concat(all)
    }
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var rules = ruleMap[key]
      var included = Object.create(null)
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j]
        if (!rule.include) continue
        var splice = [j, 1]
        if (rule.include !== key && !included[rule.include]) {
          included[rule.include] = true
          var newRules = ruleMap[rule.include]
          if (!newRules) {
            throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
          }
          for (var k = 0; k < newRules.length; k++) {
            var newRule = newRules[k]
            if (rules.indexOf(newRule) !== -1) continue
            splice.push(newRule)
          }
        }
        rules.splice.apply(rules, splice)
        j--
      }
    }

    var map = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      map[key] = compileRules(ruleMap[key], true)
    }

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i]
      var state = map[name]
      var groups = state.groups
      for (var j = 0; j < groups.length; j++) {
        checkStateGroup(groups[j], name, map)
      }
      var fastKeys = Object.getOwnPropertyNames(state.fast)
      for (var j = 0; j < fastKeys.length; j++) {
        checkStateGroup(state.fast[fastKeys[j]], name, map)
      }
    }

    return new Lexer(map, start)
  }

  function keywordTransform(map) {

    // Use a JavaScript Map to map keywords to their corresponding token type
    // unless Map is unsupported, then fall back to using an Object:
    var isMap = typeof Map !== 'undefined'
    var reverseMap = isMap ? new Map : Object.create(null)

    var types = Object.getOwnPropertyNames(map)
    for (var i = 0; i < types.length; i++) {
      var tokenType = types[i]
      var item = map[tokenType]
      var keywordList = Array.isArray(item) ? item : [item]
      keywordList.forEach(function(keyword) {
        if (typeof keyword !== 'string') {
          throw new Error("keyword must be string (in keyword '" + tokenType + "')")
        }
        if (isMap) {
          reverseMap.set(keyword, tokenType)
        } else {
          reverseMap[keyword] = tokenType
        }
      })
    }
    return function(k) {
      return isMap ? reverseMap.get(k) : reverseMap[k]
    }
  }

  /***************************************************************************/

  var Lexer = function(states, state) {
    this.startState = state
    this.states = states
    this.buffer = ''
    this.stack = []
    this.reset()
  }

  Lexer.prototype.reset = function(data, info) {
    this.buffer = data || ''
    this.index = 0
    this.line = info ? info.line : 1
    this.col = info ? info.col : 1
    this.queuedToken = info ? info.queuedToken : null
    this.queuedText = info ? info.queuedText: "";
    this.queuedThrow = info ? info.queuedThrow : null
    this.setState(info ? info.state : this.startState)
    this.stack = info && info.stack ? info.stack.slice() : []
    return this
  }

  Lexer.prototype.save = function() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
      stack: this.stack.slice(),
      queuedToken: this.queuedToken,
      queuedText: this.queuedText,
      queuedThrow: this.queuedThrow,
    }
  }

  Lexer.prototype.setState = function(state) {
    if (!state || this.state === state) return
    this.state = state
    var info = this.states[state]
    this.groups = info.groups
    this.error = info.error
    this.re = info.regexp
    this.fast = info.fast
  }

  Lexer.prototype.popState = function() {
    this.setState(this.stack.pop())
  }

  Lexer.prototype.pushState = function(state) {
    this.stack.push(this.state)
    this.setState(state)
  }

  var eat = hasSticky ? function(re, buffer) { // assume re is /y
    return re.exec(buffer)
  } : function(re, buffer) { // assume re is /g
    var match = re.exec(buffer)
    // will always match, since we used the |(?:) trick
    if (match[0].length === 0) {
      return null
    }
    return match
  }

  Lexer.prototype._getGroup = function(match) {
    var groupCount = this.groups.length
    for (var i = 0; i < groupCount; i++) {
      if (match[i + 1] !== undefined) {
        return this.groups[i]
      }
    }
    throw new Error('Cannot find token type for matched text')
  }

  function tokenToString() {
    return this.value
  }

  Lexer.prototype.next = function() {
    var index = this.index

    // If a fallback token matched, we don't need to re-run the RegExp
    if (this.queuedGroup) {
      var token = this._token(this.queuedGroup, this.queuedText, index)
      this.queuedGroup = null
      this.queuedText = ""
      return token
    }

    var buffer = this.buffer
    if (index === buffer.length) {
      return // EOF
    }

    // Fast matching for single characters
    var group = this.fast[buffer.charCodeAt(index)]
    if (group) {
      return this._token(group, buffer.charAt(index), index)
    }

    // Execute RegExp
    var re = this.re
    re.lastIndex = index
    var match = eat(re, buffer)

    // Error tokens match the remaining buffer
    var error = this.error
    if (match == null) {
      return this._token(error, buffer.slice(index, buffer.length), index)
    }

    var group = this._getGroup(match)
    var text = match[0]

    if (error.fallback && match.index !== index) {
      this.queuedGroup = group
      this.queuedText = text

      // Fallback tokens contain the unmatched portion of the buffer
      return this._token(error, buffer.slice(index, match.index), index)
    }

    return this._token(group, text, index)
  }

  Lexer.prototype._token = function(group, text, offset) {
    // count line breaks
    var lineBreaks = 0
    if (group.lineBreaks) {
      var matchNL = /\n/g
      var nl = 1
      if (text === '\n') {
        lineBreaks = 1
      } else {
        while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex }
      }
    }

    var token = {
      type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
      value: typeof group.value === 'function' ? group.value(text) : text,
      text: text,
      toString: tokenToString,
      offset: offset,
      lineBreaks: lineBreaks,
      line: this.line,
      col: this.col,
    }
    // nb. adding more props to token object will make V8 sad!

    var size = text.length
    this.index += size
    this.line += lineBreaks
    if (lineBreaks !== 0) {
      this.col = size - nl + 1
    } else {
      this.col += size
    }

    // throw, if no rule with {error: true}
    if (group.shouldThrow) {
      var err = new Error(this.formatError(token, "invalid syntax"))
      throw err;
    }

    if (group.pop) this.popState()
    else if (group.push) this.pushState(group.push)
    else if (group.next) this.setState(group.next)

    return token
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    var LexerIterator = function(lexer) {
      this.lexer = lexer
    }

    LexerIterator.prototype.next = function() {
      var token = this.lexer.next()
      return {value: token, done: !token}
    }

    LexerIterator.prototype[Symbol.iterator] = function() {
      return this
    }

    Lexer.prototype[Symbol.iterator] = function() {
      return new LexerIterator(this)
    }
  }

  Lexer.prototype.formatError = function(token, message) {
    if (token == null) {
      // An undefined token indicates EOF
      var text = this.buffer.slice(this.index)
      var token = {
        text: text,
        offset: this.index,
        lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
        line: this.line,
        col: this.col,
      }
    }
    
    var numLinesAround = 2
    var firstDisplayedLine = Math.max(token.line - numLinesAround, 1)
    var lastDisplayedLine = token.line + numLinesAround
    var lastLineDigits = String(lastDisplayedLine).length
    var displayedLines = lastNLines(
        this.buffer, 
        (this.line - token.line) + numLinesAround + 1
      )
      .slice(0, 5)
    var errorLines = []
    errorLines.push(message + " at line " + token.line + " col " + token.col + ":")
    errorLines.push("")
    for (var i = 0; i < displayedLines.length; i++) {
      var line = displayedLines[i]
      var lineNo = firstDisplayedLine + i
      errorLines.push(pad(String(lineNo), lastLineDigits) + "  " + line);
      if (lineNo === token.line) {
        errorLines.push(pad("", lastLineDigits + token.col + 1) + "^")
      }
    }
    return errorLines.join("\n")
  }

  Lexer.prototype.clone = function() {
    return new Lexer(this.states, this.state)
  }

  Lexer.prototype.has = function(tokenType) {
    return true
  }


  return {
    compile: compile,
    states: compileStates,
    error: Object.freeze({error: true}),
    fallback: Object.freeze({fallback: true}),
    keywords: keywordTransform,
  }

}));

},{}],34:[function(require,module,exports){
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(getSymbolShortDisplay).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            // Having right set here will prevent the right state and its children
            // form being garbage collected
            state.right = undefined;
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var lines = buffer
                .split("\n")
                .slice(
                    Math.max(0, this.line - 5), 
                    this.line
                );

            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var col = this.index - this.lastLineBreak;
            var lastLineDigits = String(this.line).length;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += lines
                .map(function(line, i) {
                    return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
                }, this)
                .join("\n");
            message += "\n" + pad("", lastLineDigits + col) + "^\n";
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }

        function pad(n, length) {
            var s = String(n);
            return Array(length - s.length + 1).join(" ") + s;
        }
    }

    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (true) {
            try {
                token = lexer.next();
                if (!token) {
                    break;
                }
            } catch (e) {
                // Create the next column so that the error reporter
                // can display the correctly predicted states.
                var nextColumn = new Column(this.grammar, this.current + 1);
                this.table.push(nextColumn);
                var err = new Error(this.reportLexerError(e));
                err.offset = this.current;
                err.token = e.token;
                throw err;
            }
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var err = new Error(this.reportError(token));
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.reportLexerError = function(lexerError) {
        var tokenDisplay, lexerMessage;
        // Planning to add a token property to moo's thrown error
        // even on erroring tokens to be used in error display below
        var token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    Parser.prototype.reportError = function(token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    Parser.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states
            .filter(function(state) {
                var nextSymbol = state.rule.symbols[state.dot];
                return nextSymbol && typeof nextSymbol !== "string";
            });

        if (expectantStates.length === 0) {
            lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
            this.displayStateStack(lastColumn.states, lines);
        } else {
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            // Display a "state stack" for each expectant state
            // - which shows you how this state came to be, step by step.
            // If there is more than one derivation, we only display the first one.
            var stateStacks = expectantStates
                .map(function(state) {
                    return this.buildFirstStateStack(state, []) || [state];
                }, this);
            // Display each state that is expecting a terminal symbol next.
            stateStacks.forEach(function(stateStack) {
                var state = stateStack[0];
                var nextSymbol = state.rule.symbols[state.dot];
                var symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            }, this);
        }
        lines.push("");
        return lines.join("\n");
    }
    
    Parser.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
            var state = stateStack[j];
            var display = state.rule.toString(state.dot);
            if (display === lastDisplay) {
                sameDisplayCount++;
            } else {
                if (sameDisplayCount > 0) {
                    lines.push('    ^ ' + sameDisplayCount + ' more lines identical to this');
                }
                sameDisplayCount = 0;
                lines.push('    ' + display);
            }
            lastDisplay = display;
        }
    };

    Parser.prototype.getSymbolDisplay = function(symbol) {
        return getSymbolLongDisplay(symbol);
    };

    /*
    Builds a the first state stack. You can think of a state stack as the call stack
    of the recursive-descent parser which the Nearley parse algorithm simulates.
    A state stack is represented as an array of state objects. Within a
    state stack, the first item of the array will be the starting
    state, with each successive item in the array going further back into history.

    This function needs to be given a starting state and an empty array representing
    the visited states, and it returns an single state stack.

    */
    Parser.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
            // Found cycle, return null
            // to eliminate this path from the results, because
            // we don't know how to display it meaningfully
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    function getSymbolLongDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return 'character matching ' + symbol;
            } else if (symbol.type) {
                return symbol.type + ' token';
            } else if (symbol.test) {
                return 'token matching ' + String(symbol.test);
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }

    function getSymbolShortDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return symbol.toString();
            } else if (symbol.type) {
                return '%' + symbol.type;
            } else if (symbol.test) {
                return '<' + String(symbol.test) + '>';
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));

},{}],35:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],36:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":37,"./lib/tychei":38,"./lib/xor128":39,"./lib/xor4096":40,"./lib/xorshift7":41,"./lib/xorwow":42,"./seedrandom":43}],37:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],38:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],39:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],40:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],41:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],42:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],43:[function(require,module,exports){
/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
} else {
  // When included as a plain script, set up Math.seedrandom global.
  math['seed' + rngname] = seedrandom;
}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":24}],44:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Tone=e():t.Tone=e()}("undefined"!=typeof self?self:this,(function(){return function(t){var e={};function s(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,s),i.l=!0,i.exports}return s.m=t,s.c=e,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)s.d(n,i,function(e){return t[e]}.bind(null,i));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=9)}([function(t,e,s){!function(t,e,s,n){"use strict";function i(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var o=i(e),r=i(s),a=i(n),c=function(t,e,s){return{endTime:e,insertTime:s,type:"exponentialRampToValue",value:t}},h=function(t,e,s){return{endTime:e,insertTime:s,type:"linearRampToValue",value:t}},u=function(t,e){return{startTime:e,type:"setValue",value:t}},l=function(t,e,s){return{duration:s,startTime:e,type:"setValueCurve",values:t}},p=function(t,e,s){var n=s.startTime,i=s.target,o=s.timeConstant;return i+(e-i)*Math.exp((n-t)/o)},d=function(t){return"exponentialRampToValue"===t.type},f=function(t){return"linearRampToValue"===t.type},_=function(t){return d(t)||f(t)},m=function(t){return"setValue"===t.type},g=function(t){return"setValueCurve"===t.type},v=function t(e,s,n,i){var o=e[s];return void 0===o?i:_(o)||m(o)?o.value:g(o)?o.values[o.values.length-1]:p(n,t(e,s-1,o.startTime,i),o)},y=function(t,e,s,n,i){return void 0===s?[n.insertTime,i]:_(s)?[s.endTime,s.value]:m(s)?[s.startTime,s.value]:g(s)?[s.startTime+s.duration,s.values[s.values.length-1]]:[s.startTime,v(t,e-1,s.startTime,i)]},x=function(t){return"cancelAndHold"===t.type},w=function(t){return"cancelScheduledValues"===t.type},b=function(t){return x(t)||w(t)?t.cancelTime:d(t)||f(t)?t.endTime:t.startTime},T=function(t,e,s,n){var i=n.endTime,o=n.value;return s===o?o:0<s&&0<o||s<0&&o<0?s*Math.pow(o/s,(t-e)/(i-e)):0},S=function(t,e,s,n){return s+(t-e)/(n.endTime-e)*(n.value-s)},k=function(t,e){var s=e.duration,n=e.startTime,i=e.values;return function(t,e){var s=Math.floor(e),n=Math.ceil(e);return s===n?t[s]:(1-(e-s))*t[s]+(1-(n-e))*t[n]}(i,(t-n)/s*(i.length-1))},C=function(t){return"setTarget"===t.type},A=function(){function t(e){r.default(this,t),this._automationEvents=[],this._currenTime=0,this._defaultValue=e}return a.default(t,[{key:Symbol.iterator,value:function(){return this._automationEvents[Symbol.iterator]()}},{key:"add",value:function(t){var e=b(t);if(x(t)||w(t)){var s=this._automationEvents.findIndex((function(s){return w(t)&&g(s)?s.startTime+s.duration>=e:b(s)>=e})),n=this._automationEvents[s];if(-1!==s&&(this._automationEvents=this._automationEvents.slice(0,s)),x(t)){var i=this._automationEvents[this._automationEvents.length-1];if(void 0!==n&&_(n)){if(C(i))throw new Error("The internal list is malformed.");var o=g(i)?i.startTime+i.duration:b(i),r=g(i)?i.values[i.values.length-1]:i.value,a=d(n)?T(e,o,r,n):S(e,o,r,n),p=d(n)?c(a,e,this._currenTime):h(a,e,this._currenTime);this._automationEvents.push(p)}void 0!==i&&C(i)&&this._automationEvents.push(u(this.getValue(e),e)),void 0!==i&&g(i)&&i.startTime+i.duration>e&&(this._automationEvents[this._automationEvents.length-1]=l(new Float32Array([6,7]),i.startTime,e-i.startTime))}}else{var m=this._automationEvents.findIndex((function(t){return b(t)>e})),v=-1===m?this._automationEvents[this._automationEvents.length-1]:this._automationEvents[m-1];if(void 0!==v&&g(v)&&b(v)+v.duration>e)return!1;var y=d(t)?c(t.value,t.endTime,this._currenTime):f(t)?h(t.value,e,this._currenTime):t;if(-1===m)this._automationEvents.push(y);else{if(g(t)&&e+t.duration>b(this._automationEvents[m]))return!1;this._automationEvents.splice(m,0,y)}}return!0}},{key:"flush",value:function(t){var e=this._automationEvents.findIndex((function(e){return b(e)>t}));if(e>1){var s=this._automationEvents.slice(e-1),n=s[0];C(n)&&s.unshift(u(v(this._automationEvents,e-2,n.startTime,this._defaultValue),n.startTime)),this._automationEvents=s}}},{key:"getValue",value:function(t){if(0===this._automationEvents.length)return this._defaultValue;var e=this._automationEvents[this._automationEvents.length-1],s=this._automationEvents.findIndex((function(e){return b(e)>t})),n=this._automationEvents[s],i=b(e)<=t?e:this._automationEvents[s-1];if(void 0!==i&&C(i)&&(void 0===n||!_(n)||n.insertTime>t))return p(t,v(this._automationEvents,s-2,i.startTime,this._defaultValue),i);if(void 0!==i&&m(i)&&(void 0===n||!_(n)))return i.value;if(void 0!==i&&g(i)&&(void 0===n||!_(n)||i.startTime+i.duration>t))return t<i.startTime+i.duration?k(t,i):i.values[i.values.length-1];if(void 0!==i&&_(i)&&(void 0===n||!_(n)))return i.value;if(void 0!==n&&d(n)){var r=y(this._automationEvents,s-1,i,n,this._defaultValue),a=o.default(r,2),c=a[0],h=a[1];return T(t,c,h,n)}if(void 0!==n&&f(n)){var u=y(this._automationEvents,s-1,i,n,this._defaultValue),l=o.default(u,2),x=l[0],w=l[1];return S(t,x,w,n)}return this._defaultValue}}]),t}();t.AutomationEventList=A,t.createCancelAndHoldAutomationEvent=function(t){return{cancelTime:t,type:"cancelAndHold"}},t.createCancelScheduledValuesAutomationEvent=function(t){return{cancelTime:t,type:"cancelScheduledValues"}},t.createExponentialRampToValueAutomationEvent=function(t,e){return{endTime:e,type:"exponentialRampToValue",value:t}},t.createLinearRampToValueAutomationEvent=function(t,e){return{endTime:e,type:"linearRampToValue",value:t}},t.createSetTargetAutomationEvent=function(t,e,s){return{startTime:e,target:t,timeConstant:s,type:"setTarget"}},t.createSetValueAutomationEvent=u,t.createSetValueCurveAutomationEvent=l,Object.defineProperty(t,"__esModule",{value:!0})}(e,s(1),s(7),s(8))},function(t,e,s){var n=s(2),i=s(3),o=s(4),r=s(6);t.exports=function(t,e){return n(t)||i(t,e)||o(t,e)||r()}},function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},function(t,e){t.exports=function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var s=[],n=!0,i=!1,o=void 0;try{for(var r,a=t[Symbol.iterator]();!(n=(r=a.next()).done)&&(s.push(r.value),!e||s.length!==e);n=!0);}catch(t){i=!0,o=t}finally{try{n||null==a.return||a.return()}finally{if(i)throw o}}return s}}},function(t,e,s){var n=s(5);t.exports=function(t,e){if(t){if("string"==typeof t)return n(t,e);var s=Object.prototype.toString.call(t).slice(8,-1);return"Object"===s&&t.constructor&&(s=t.constructor.name),"Map"===s||"Set"===s?Array.from(t):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?n(t,e):void 0}}},function(t,e){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var s=0,n=new Array(e);s<e;s++)n[s]=t[s];return n}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function s(t,e){for(var s=0;s<e.length;s++){var n=e[s];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}t.exports=function(t,e,n){return e&&s(t.prototype,e),n&&s(t,n),t}},function(t,e,s){"use strict";s.r(e),s.d(e,"getContext",(function(){return Ji})),s.d(e,"setContext",(function(){return Ki})),s.d(e,"Clock",(function(){return qo})),s.d(e,"Context",(function(){return Gi})),s.d(e,"BaseContext",(function(){return Wi})),s.d(e,"Delay",(function(){return Fo})),s.d(e,"Gain",(function(){return ko})),s.d(e,"Offline",(function(){return Io})),s.d(e,"OfflineContext",(function(){return Yi})),s.d(e,"Param",(function(){return xo})),s.d(e,"ToneAudioBuffer",(function(){return Xi})),s.d(e,"ToneAudioBuffers",(function(){return Vo})),s.d(e,"ToneAudioNode",(function(){return wo})),s.d(e,"connectSeries",(function(){return bo})),s.d(e,"connect",(function(){return To})),s.d(e,"disconnect",(function(){return So})),s.d(e,"FrequencyClass",(function(){return lo})),s.d(e,"Frequency",(function(){return _o})),s.d(e,"MidiClass",(function(){return No})),s.d(e,"Midi",(function(){return Po})),s.d(e,"TimeClass",(function(){return ho})),s.d(e,"Time",(function(){return uo})),s.d(e,"TicksClass",(function(){return jo})),s.d(e,"Ticks",(function(){return Lo})),s.d(e,"TransportTimeClass",(function(){return mo})),s.d(e,"TransportTime",(function(){return go})),s.d(e,"Emitter",(function(){return Bi})),s.d(e,"IntervalTimeline",(function(){return Bo})),s.d(e,"StateTimeline",(function(){return yo})),s.d(e,"Timeline",(function(){return Ni})),s.d(e,"isUndef",(function(){return ai})),s.d(e,"isDefined",(function(){return ci})),s.d(e,"isFunction",(function(){return hi})),s.d(e,"isNumber",(function(){return ui})),s.d(e,"isObject",(function(){return li})),s.d(e,"isBoolean",(function(){return pi})),s.d(e,"isArray",(function(){return di})),s.d(e,"isString",(function(){return fi})),s.d(e,"isNote",(function(){return _i})),s.d(e,"dbToGain",(function(){return eo})),s.d(e,"gainToDb",(function(){return so})),s.d(e,"intervalToFrequencyRatio",(function(){return no})),s.d(e,"ftom",(function(){return oo})),s.d(e,"mtof",(function(){return ao})),s.d(e,"optionsFromArguments",(function(){return Di})),s.d(e,"defaultArg",(function(){return Oi})),s.d(e,"Unit",(function(){return i})),s.d(e,"debug",(function(){return n})),s.d(e,"Noise",(function(){return Jo})),s.d(e,"UserMedia",(function(){return er})),s.d(e,"Oscillator",(function(){return ir})),s.d(e,"AMOscillator",(function(){return hr})),s.d(e,"FMOscillator",(function(){return ur})),s.d(e,"PulseOscillator",(function(){return lr})),s.d(e,"FatOscillator",(function(){return pr})),s.d(e,"PWMOscillator",(function(){return dr})),s.d(e,"OmniOscillator",(function(){return _r})),s.d(e,"ToneOscillatorNode",(function(){return nr})),s.d(e,"LFO",(function(){return yr})),s.d(e,"ToneBufferSource",(function(){return $o})),s.d(e,"Player",(function(){return br})),s.d(e,"Players",(function(){return Tr})),s.d(e,"GrainPlayer",(function(){return Sr})),s.d(e,"Add",(function(){return mr})),s.d(e,"Abs",(function(){return kr})),s.d(e,"AudioToGain",(function(){return ar})),s.d(e,"GainToAudio",(function(){return Cr})),s.d(e,"GreaterThan",(function(){return Mr})),s.d(e,"GreaterThanZero",(function(){return Or})),s.d(e,"Multiply",(function(){return cr})),s.d(e,"Negate",(function(){return Ar})),s.d(e,"Pow",(function(){return Er})),s.d(e,"Signal",(function(){return Do})),s.d(e,"connectSignal",(function(){return Oo})),s.d(e,"Scale",(function(){return gr})),s.d(e,"ScaleExp",(function(){return Rr})),s.d(e,"Subtract",(function(){return Dr})),s.d(e,"SyncedSignal",(function(){return qr})),s.d(e,"WaveShaper",(function(){return rr})),s.d(e,"Zero",(function(){return vr})),s.d(e,"AMSynth",(function(){return zr})),s.d(e,"DuoSynth",(function(){return Qr})),s.d(e,"FMSynth",(function(){return Zr})),s.d(e,"MetalSynth",(function(){return Yr})),s.d(e,"MembraneSynth",(function(){return Hr})),s.d(e,"MonoSynth",(function(){return Ur})),s.d(e,"NoiseSynth",(function(){return $r})),s.d(e,"PluckSynth",(function(){return oa})),s.d(e,"PolySynth",(function(){return ra})),s.d(e,"Sampler",(function(){return aa})),s.d(e,"Synth",(function(){return jr})),s.d(e,"Loop",(function(){return ha})),s.d(e,"Part",(function(){return ua})),s.d(e,"Pattern",(function(){return xa})),s.d(e,"Sequence",(function(){return wa})),s.d(e,"ToneEvent",(function(){return ca})),s.d(e,"AutoFilter",(function(){return ka})),s.d(e,"AutoPanner",(function(){return Aa})),s.d(e,"AutoWah",(function(){return Oa})),s.d(e,"BitCrusher",(function(){return Ma})),s.d(e,"Chebyshev",(function(){return Ra})),s.d(e,"Chorus",(function(){return Na})),s.d(e,"Distortion",(function(){return Pa})),s.d(e,"FeedbackDelay",(function(){return La})),s.d(e,"FrequencyShifter",(function(){return Ba})),s.d(e,"Freeverb",(function(){return Ua})),s.d(e,"JCReverb",(function(){return Ya})),s.d(e,"PingPongDelay",(function(){return $a})),s.d(e,"PitchShift",(function(){return Ja})),s.d(e,"Phaser",(function(){return Ka})),s.d(e,"Reverb",(function(){return tc})),s.d(e,"StereoWidener",(function(){return ic})),s.d(e,"Tremolo",(function(){return oc})),s.d(e,"Vibrato",(function(){return rc})),s.d(e,"Analyser",(function(){return ac})),s.d(e,"Meter",(function(){return hc})),s.d(e,"FFT",(function(){return uc})),s.d(e,"DCMeter",(function(){return lc})),s.d(e,"Waveform",(function(){return pc})),s.d(e,"Follower",(function(){return Da})),s.d(e,"Channel",(function(){return _c})),s.d(e,"CrossFade",(function(){return ba})),s.d(e,"Merge",(function(){return Fa})),s.d(e,"MidSideMerge",(function(){return sc})),s.d(e,"MidSideSplit",(function(){return ec})),s.d(e,"Mono",(function(){return mc})),s.d(e,"MultibandSplit",(function(){return gc})),s.d(e,"Panner",(function(){return Ca})),s.d(e,"Panner3D",(function(){return yc})),s.d(e,"PanVol",(function(){return fc})),s.d(e,"Recorder",(function(){return xc})),s.d(e,"Solo",(function(){return dc})),s.d(e,"Split",(function(){return qa})),s.d(e,"Volume",(function(){return Go})),s.d(e,"Compressor",(function(){return wc})),s.d(e,"Gate",(function(){return bc})),s.d(e,"Limiter",(function(){return Tc})),s.d(e,"MidSideCompressor",(function(){return Sc})),s.d(e,"MultibandCompressor",(function(){return kc})),s.d(e,"AmplitudeEnvelope",(function(){return Pr})),s.d(e,"Envelope",(function(){return Fr})),s.d(e,"FrequencyEnvelope",(function(){return Gr})),s.d(e,"EQ3",(function(){return Cc})),s.d(e,"Filter",(function(){return Wr})),s.d(e,"OnePoleFilter",(function(){return na})),s.d(e,"FeedbackCombFilter",(function(){return sa})),s.d(e,"LowpassCombFilter",(function(){return ia})),s.d(e,"Convolver",(function(){return Ac})),s.d(e,"BiquadFilter",(function(){return Br})),s.d(e,"version",(function(){return o})),s.d(e,"start",(function(){return to})),s.d(e,"supported",(function(){return Kn})),s.d(e,"now",(function(){return Dc})),s.d(e,"immediate",(function(){return Oc})),s.d(e,"Transport",(function(){return Mc})),s.d(e,"getTransport",(function(){return Ec})),s.d(e,"Destination",(function(){return Rc})),s.d(e,"Master",(function(){return qc})),s.d(e,"getDestination",(function(){return Fc})),s.d(e,"Listener",(function(){return Ic})),s.d(e,"getListener",(function(){return Vc})),s.d(e,"Draw",(function(){return Nc})),s.d(e,"getDraw",(function(){return Pc})),s.d(e,"context",(function(){return jc})),s.d(e,"loaded",(function(){return Lc})),s.d(e,"Buffer",(function(){return zc})),s.d(e,"Buffers",(function(){return Bc})),s.d(e,"BufferSource",(function(){return Wc}));var n={};s.r(n),s.d(n,"assert",(function(){return ti})),s.d(n,"assertRange",(function(){return ei})),s.d(n,"assertContextRunning",(function(){return si})),s.d(n,"setLogger",(function(){return ii})),s.d(n,"log",(function(){return oi})),s.d(n,"warn",(function(){return ri}));var i={};s.r(i);const o="14.7.77";var r=s(0);const a=new WeakSet,c=new WeakMap,h=new WeakMap,u=new WeakMap,l=new WeakMap,p=new WeakMap,d=new WeakMap,f=new WeakMap,_=new WeakMap,m=new WeakMap,g={construct:()=>g},v=/^import(?:(?:[\s]+[\w]+|(?:[\s]+[\w]+[\s]*,)?[\s]*\{[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?(?:[\s]*,[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?)*[\s]*}|(?:[\s]+[\w]+[\s]*,)?[\s]*\*[\s]+as[\s]+[\w]+)[\s]+from)?(?:[\s]*)("([^"\\]|\\.)+"|'([^'\\]|\\.)+')(?:[\s]*);?/,y=(t,e)=>{const s=[];let n=t.replace(/^[\s]+/,""),i=n.match(v);for(;null!==i;){const t=i[1].slice(1,-1),o=i[0].replace(/([\s]+)?;?$/,"").replace(t,new URL(t,e).toString());s.push(o),n=n.slice(i[0].length).replace(/^[\s]+/,""),i=n.match(v)}return[s.join(";"),n]},x=t=>{if(void 0!==t&&!Array.isArray(t))throw new TypeError("The parameterDescriptors property of given value for processorCtor is not an array.")},w=t=>{if(!(t=>{try{new new Proxy(t,g)}catch{return!1}return!0})(t))throw new TypeError("The given value for processorCtor should be a constructor.");if(null===t.prototype||"object"!=typeof t.prototype)throw new TypeError("The given value for processorCtor should have a prototype.")},b=(t,e)=>{const s=t.get(e);if(void 0===s)throw new Error("A value with the given key could not be found.");return s},T=(t,e)=>{const s=Array.from(t).filter(e);if(s.length>1)throw Error("More than one element was found.");if(0===s.length)throw Error("No element was found.");const[n]=s;return t.delete(n),n},S=(t,e,s,n)=>{const i=b(t,e),o=T(i,t=>t[0]===s&&t[1]===n);return 0===i.size&&t.delete(e),o},k=t=>b(d,t),C=t=>{if(a.has(t))throw new Error("The AudioNode is already stored.");a.add(t),k(t).forEach(t=>t(!0))},A=t=>"port"in t,D=t=>{if(!a.has(t))throw new Error("The AudioNode is not stored.");a.delete(t),k(t).forEach(t=>t(!1))},O=(t,e)=>{!A(t)&&e.every(t=>0===t.size)&&D(t)},M={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",fftSize:2048,maxDecibels:-30,minDecibels:-100,smoothingTimeConstant:.8},E=(t,e)=>t.context===e,R=t=>{try{t.copyToChannel(new Float32Array(1),0,-1)}catch{return!1}return!0},q=()=>new DOMException("","IndexSizeError"),F=t=>{var e;t.getChannelData=(e=t.getChannelData,s=>{try{return e.call(t,s)}catch(t){if(12===t.code)throw q();throw t}})},I={numberOfChannels:1},V=-34028234663852886e22,N=-V,P=t=>a.has(t),j={buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1},L=t=>b(c,t),z=t=>b(u,t),B=(t,e)=>{const{activeInputs:s}=L(t);s.forEach(s=>s.forEach(([s])=>{e.includes(t)||B(s,[...e,t])}));const n=(t=>"playbackRate"in t)(t)?[t.playbackRate]:A(t)?Array.from(t.parameters.values()):(t=>"frequency"in t&&"gain"in t)(t)?[t.Q,t.detune,t.frequency,t.gain]:(t=>"offset"in t)(t)?[t.offset]:(t=>!("frequency"in t)&&"gain"in t)(t)?[t.gain]:(t=>"detune"in t&&"frequency"in t)(t)?[t.detune,t.frequency]:(t=>"pan"in t)(t)?[t.pan]:[];for(const t of n){const s=z(t);void 0!==s&&s.activeInputs.forEach(([t])=>B(t,e))}P(t)&&D(t)},W=t=>{B(t.destination,[])},G=t=>void 0===t||"number"==typeof t||"string"==typeof t&&("balanced"===t||"interactive"===t||"playback"===t),U=t=>"context"in t,Q=t=>U(t[0]),Z=(t,e,s,n)=>{for(const e of t)if(s(e)){if(n)return!1;throw Error("The set contains at least one similar element.")}return t.add(e),!0},X=(t,e,[s,n],i)=>{Z(t,[e,s,n],t=>t[0]===e&&t[1]===s,i)},Y=(t,[e,s,n],i)=>{const o=t.get(e);void 0===o?t.set(e,new Set([[s,n]])):Z(o,[s,n],t=>t[0]===s,i)},H=t=>"inputs"in t,$=(t,e,s,n)=>{if(H(e)){const i=e.inputs[n];return t.connect(i,s,0),[i,s,0]}return t.connect(e,s,n),[e,s,n]},J=(t,e,s)=>{for(const n of t)if(n[0]===e&&n[1]===s)return t.delete(n),n;return null},K=(t,e)=>{if(!k(t).delete(e))throw new Error("Missing the expected event listener.")},tt=(t,e,s)=>{const n=b(t,e),i=T(n,t=>t[0]===s);return 0===n.size&&t.delete(e),i},et=(t,e,s,n)=>{H(e)?t.disconnect(e.inputs[n],s,0):t.disconnect(e,s,n)},st=t=>b(h,t),nt=t=>b(l,t),it=t=>f.has(t),ot=t=>!a.has(t),rt=t=>new Promise(e=>{const s=t.createScriptProcessor(256,1,1),n=t.createGain(),i=t.createBuffer(1,2,44100),o=i.getChannelData(0);o[0]=1,o[1]=1;const r=t.createBufferSource();r.buffer=i,r.loop=!0,r.connect(s).connect(t.destination),r.connect(n),r.disconnect(n),s.onaudioprocess=n=>{const i=n.inputBuffer.getChannelData(0);Array.prototype.some.call(i,t=>1===t)?e(!0):e(!1),r.stop(),s.onaudioprocess=null,r.disconnect(s),s.disconnect(t.destination)},r.start()}),at=(t,e)=>{const s=new Map;for(const e of t)for(const t of e){const e=s.get(t);s.set(t,void 0===e?1:e+1)}s.forEach((t,s)=>e(s,t))},ct=t=>"context"in t,ht=(t,e,s,n)=>{const{activeInputs:i,passiveInputs:o}=z(e),{outputs:r}=L(t),a=k(t),c=r=>{const a=st(t),c=nt(e);if(r){const e=tt(o,t,s);X(i,t,e,!1),n||it(t)||a.connect(c,s)}else{const e=((t,e,s)=>T(t,t=>t[0]===e&&t[1]===s))(i,t,s);Y(o,e,!1),n||it(t)||a.disconnect(c,s)}};return!!Z(r,[e,s],t=>t[0]===e&&t[1]===s,!0)&&(a.add(c),P(t)?X(i,t,[s,c],!0):Y(o,[t,s,c],!0),!0)},ut=(t,e,s,n,i)=>{const[o,r]=((t,e,s,n)=>{const{activeInputs:i,passiveInputs:o}=L(e),r=J(i[n],t,s);if(null===r){return[S(o,t,s,n)[2],!1]}return[r[2],!0]})(t,s,n,i);if(null!==o&&(K(t,o),!r||e||it(t)||et(st(t),st(s),n,i)),P(s)){const{activeInputs:t}=L(s);O(s,t)}},lt=(t,e,s,n)=>{const[i,o]=((t,e,s)=>{const{activeInputs:n,passiveInputs:i}=z(e),o=J(n,t,s);if(null===o){return[tt(i,t,s)[1],!1]}return[o[2],!0]})(t,s,n);null!==i&&(K(t,i),!o||e||it(t)||st(t).disconnect(nt(s),n))};class pt{constructor(t){this._map=new Map(t)}get size(){return this._map.size}entries(){return this._map.entries()}forEach(t,e=null){return this._map.forEach((s,n)=>t.call(e,s,n,this))}get(t){return this._map.get(t)}has(t){return this._map.has(t)}keys(){return this._map.keys()}values(){return this._map.values()}}const dt={channelCount:2,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:1,numberOfOutputs:1,parameterData:{},processorOptions:{}};function ft(t,e,s,n,i){if("function"==typeof t.copyFromChannel)0===e[s].byteLength&&(e[s]=new Float32Array(128)),t.copyFromChannel(e[s],n,i);else{const o=t.getChannelData(n);if(0===e[s].byteLength)e[s]=o.slice(i,i+128);else{const t=new Float32Array(o.buffer,i*Float32Array.BYTES_PER_ELEMENT,128);e[s].set(t)}}}const _t=(t,e,s,n,i)=>{"function"==typeof t.copyToChannel?0!==e[s].byteLength&&t.copyToChannel(e[s],n,i):0!==e[s].byteLength&&t.getChannelData(n).set(e[s],i)},mt=(t,e)=>{const s=[];for(let n=0;n<t;n+=1){const t=[],i="number"==typeof e?e:e[n];for(let e=0;e<i;e+=1)t.push(new Float32Array(128));s.push(t)}return s},gt=async(t,e,s,n,i,o,r)=>{const a=null===e?128*Math.ceil(t.context.length/128):e.length,c=n.channelCount*n.numberOfInputs,h=i.reduce((t,e)=>t+e,0),u=0===h?null:s.createBuffer(h,a,s.sampleRate);if(void 0===o)throw new Error("Missing the processor constructor.");const l=L(t),p=await((t,e)=>{const s=b(m,t),n=st(e);return b(s,n)})(s,t),d=mt(n.numberOfInputs,n.channelCount),f=mt(n.numberOfOutputs,i),_=Array.from(t.parameters.keys()).reduce((t,e)=>({...t,[e]:new Float32Array(128)}),{});for(let h=0;h<a;h+=128){if(n.numberOfInputs>0&&null!==e)for(let t=0;t<n.numberOfInputs;t+=1)for(let s=0;s<n.channelCount;s+=1)ft(e,d[t],s,s,h);void 0!==o.parameterDescriptors&&null!==e&&o.parameterDescriptors.forEach(({name:t},s)=>{ft(e,_,t,c+s,h)});for(let t=0;t<n.numberOfInputs;t+=1)for(let e=0;e<i[t];e+=1)0===f[t][e].byteLength&&(f[t][e]=new Float32Array(128));try{const t=d.map((t,e)=>0===l.activeInputs[e].size?[]:t),e=r(h/s.sampleRate,s.sampleRate,()=>p.process(t,f,_));if(null!==u)for(let t=0,e=0;t<n.numberOfOutputs;t+=1){for(let s=0;s<i[t];s+=1)_t(u,f[t],s,e+s,h);e+=i[t]}if(!e)break}catch(e){t.dispatchEvent(new ErrorEvent("processorerror",{colno:e.colno,filename:e.filename,lineno:e.lineno,message:e.message}));break}}return u},vt={Q:1,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",detune:0,frequency:350,gain:0,type:"lowpass"},yt={channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:6},xt={channelCount:6,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:6},wt={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",offset:1},bt={buffer:null,channelCount:2,channelCountMode:"clamped-max",channelInterpretation:"speakers",disableNormalization:!1},Tt={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",delayTime:0,maxDelayTime:1},St=(t,e,s)=>{const n=e[s];if(void 0===n)throw t();return n},kt={attack:.003,channelCount:2,channelCountMode:"clamped-max",channelInterpretation:"speakers",knee:30,ratio:12,release:.25,threshold:-24},Ct={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",gain:1},At=()=>new DOMException("","InvalidStateError"),Dt=()=>new DOMException("","InvalidAccessError"),Ot={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers"},Mt=(t,e,s,n,i,o,r,a,c,h,u)=>{const l=h.length;let p=a;for(let a=0;a<l;a+=1){let l=s[0]*h[a];for(let e=1;e<i;e+=1){const n=p-e&c-1;l+=s[e]*o[n],l-=t[e]*r[n]}for(let t=i;t<n;t+=1)l+=s[t]*o[p-t&c-1];for(let s=i;s<e;s+=1)l-=t[s]*r[p-s&c-1];o[p]=h[a],r[p]=l,p=p+1&c-1,u[a]=l}return p},Et={channelCount:2,channelCountMode:"explicit",channelInterpretation:"speakers"},Rt=t=>{const e=new Uint32Array([1179011410,40,1163280727,544501094,16,131073,44100,176400,1048580,1635017060,4,0]);try{const s=t.decodeAudioData(e.buffer,()=>{});return void 0!==s&&(s.catch(()=>{}),!0)}catch{}return!1},qt={numberOfChannels:1},Ft=(t,e,s)=>{const n=e[s];void 0!==n&&n!==t[s]&&(t[s]=n)},It=(t,e)=>{Ft(t,e,"channelCount"),Ft(t,e,"channelCountMode"),Ft(t,e,"channelInterpretation")},Vt=t=>"function"==typeof t.getFloatTimeDomainData,Nt=(t,e,s)=>{const n=e[s];void 0!==n&&n!==t[s].value&&(t[s].value=n)},Pt=t=>{var e;t.start=(e=t.start,(s=0,n=0,i)=>{if("number"==typeof i&&i<0||n<0||s<0)throw new RangeError("The parameters can't be negative.");e.call(t,s,n,i)})},jt=t=>{var e;t.stop=(e=t.stop,(s=0)=>{if(s<0)throw new RangeError("The parameter can't be negative.");e.call(t,s)})},Lt=(t,e)=>null===t?512:Math.max(512,Math.min(16384,Math.pow(2,Math.round(Math.log2(t*e))))),zt=async(t,e)=>new t(await(t=>new Promise((e,s)=>{const{port1:n,port2:i}=new MessageChannel;n.onmessage=({data:t})=>{n.close(),i.close(),e(t)},n.onmessageerror=({data:t})=>{n.close(),i.close(),s(t)},i.postMessage(t)}))(e)),Bt=(t,e)=>{const s=t.createBiquadFilter();return It(s,e),Nt(s,e,"Q"),Nt(s,e,"detune"),Nt(s,e,"frequency"),Nt(s,e,"gain"),Ft(s,e,"type"),s},Wt=(t,e)=>{const s=t.createChannelSplitter(e.numberOfOutputs);return It(s,e),(t=>{const e=t.numberOfOutputs;Object.defineProperty(t,"channelCount",{get:()=>e,set:t=>{if(t!==e)throw At()}}),Object.defineProperty(t,"channelCountMode",{get:()=>"explicit",set:t=>{if("explicit"!==t)throw At()}}),Object.defineProperty(t,"channelInterpretation",{get:()=>"discrete",set:t=>{if("discrete"!==t)throw At()}})})(s),s},Gt=(t,e)=>(t.connect=e.connect.bind(e),t.disconnect=e.disconnect.bind(e),t),Ut=(t,e)=>{const s=t.createDelay(e.maxDelayTime);return It(s,e),Nt(s,e,"delayTime"),s},Qt=(t,e)=>{const s=t.createGain();return It(s,e),Nt(s,e,"gain"),s};function Zt(t,e){const s=e[0]*e[0]+e[1]*e[1];return[(t[0]*e[0]+t[1]*e[1])/s,(t[1]*e[0]-t[0]*e[1])/s]}function Xt(t,e){let s=[0,0];for(let o=t.length-1;o>=0;o-=1)i=e,s=[(n=s)[0]*i[0]-n[1]*i[1],n[0]*i[1]+n[1]*i[0]],s[0]+=t[o];var n,i;return s}const Yt=(t,e,s,n)=>t.createScriptProcessor(e,s,n),Ht=()=>new DOMException("","NotSupportedError"),$t={numberOfChannels:1},Jt={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",detune:0,frequency:440,periodicWave:void 0,type:"sine"},Kt={channelCount:2,channelCountMode:"clamped-max",channelInterpretation:"speakers",coneInnerAngle:360,coneOuterAngle:360,coneOuterGain:0,distanceModel:"inverse",maxDistance:1e4,orientationX:1,orientationY:0,orientationZ:0,panningModel:"equalpower",positionX:0,positionY:0,positionZ:0,refDistance:1,rolloffFactor:1},te={disableNormalization:!1},ee={channelCount:2,channelCountMode:"explicit",channelInterpretation:"speakers",pan:0},se=()=>new DOMException("","UnknownError"),ne={channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",curve:null,oversample:"none"},ie=t=>{if(null===t)return!1;const e=t.length;return e%2!=0?0!==t[Math.floor(e/2)]:t[e/2-1]+t[e/2]!==0},oe=(t,e,s,n)=>{let i=Object.getPrototypeOf(t);for(;!i.hasOwnProperty(e);)i=Object.getPrototypeOf(i);const{get:o,set:r}=Object.getOwnPropertyDescriptor(i,e);Object.defineProperty(t,e,{get:s(o),set:n(r)})},re=(t,e,s)=>{try{t.setValueAtTime(e,s)}catch(n){if(9!==n.code)throw n;re(t,e,s+1e-7)}},ae=t=>{const e=t.createOscillator();try{e.start(-1)}catch(t){return t instanceof RangeError}return!1},ce=t=>{const e=t.createBuffer(1,1,44100),s=t.createBufferSource();s.buffer=e,s.start(),s.stop();try{return s.stop(),!0}catch{return!1}},he=t=>{const e=t.createOscillator();try{e.stop(-1)}catch(t){return t instanceof RangeError}return!1},ue=()=>{try{new DOMException}catch{return!1}return!0},le=()=>new Promise(t=>{const e=new ArrayBuffer(0),{port1:s,port2:n}=new MessageChannel;s.onmessage=({data:e})=>t(null!==e),n.postMessage(e,[e])}),pe=(t,e)=>{const s=e.createGain();t.connect(s);const n=(i=t.disconnect,()=>{i.call(t,s),t.removeEventListener("ended",n)});var i;t.addEventListener("ended",n),Gt(t,s),t.stop=(e=>{let n=!1;return(i=0)=>{if(n)try{e.call(t,i)}catch{s.gain.setValueAtTime(0,i)}else e.call(t,i),n=!0}})(t.stop)},de=(t,e)=>s=>{const n={value:t};return Object.defineProperties(s,{currentTarget:n,target:n}),"function"==typeof e?e.call(t,s):e.handleEvent.call(t,s)},fe=(_e=Z,(t,e,[s,n,i],o)=>{_e(t[n],[e,s,i],t=>t[0]===e&&t[1]===s,o)});var _e;const me=(t=>(e,s,[n,i,o],r)=>{const a=e.get(n);void 0===a?e.set(n,new Set([[i,s,o]])):t(a,[i,s,o],t=>t[0]===i&&t[1]===s,r)})(Z),ge=(t=>(e,s,n,i)=>t(e[i],t=>t[0]===s&&t[1]===n))(T),ve=new WeakMap,ye=(t=>e=>{var s;return null!==(s=t.get(e))&&void 0!==s?s:0})(ve),xe=(we=new Map,be=new WeakMap,(t,e)=>{const s=be.get(t);if(void 0!==s)return s;const n=we.get(t);if(void 0!==n)return n;try{const s=e();return s instanceof Promise?(we.set(t,s),s.catch(()=>!1).then(e=>(we.delete(t),be.set(t,e),e))):(be.set(t,s),s)}catch{return be.set(t,!1),!1}});var we,be;const Te="undefined"==typeof window?null:window,Se=(ke=xe,Ce=q,(t,e)=>{const s=t.createAnalyser();if(It(s,e),!(e.maxDecibels>e.minDecibels))throw Ce();return Ft(s,e,"fftSize"),Ft(s,e,"maxDecibels"),Ft(s,e,"minDecibels"),Ft(s,e,"smoothingTimeConstant"),ke(Vt,()=>Vt(s))||(t=>{t.getFloatTimeDomainData=e=>{const s=new Uint8Array(e.length);t.getByteTimeDomainData(s);const n=Math.max(s.length,t.fftSize);for(let t=0;t<n;t+=1)e[t]=.0078125*(s[t]-128);return e}})(s),s});var ke,Ce;const Ae=(De=L,t=>{const e=De(t);if(null===e.renderer)throw new Error("Missing the renderer of the given AudioNode in the audio graph.");return e.renderer});var De;const Oe=((t,e,s)=>async(n,i,o,r)=>{const a=t(n),c=[...r,n];await Promise.all(a.activeInputs.map((t,r)=>Array.from(t).filter(([t])=>!c.includes(t)).map(async([t,a])=>{const h=e(t),u=await h.render(t,i,c),l=n.context.destination;s(t)||n===l&&s(n)||u.connect(o,a,r)})).reduce((t,e)=>[...t,...e],[]))})(L,Ae,it),Me=(Ee=Se,Re=st,qe=Oe,()=>{const t=new WeakMap;return{render(e,s,n){const i=t.get(s);return void 0!==i?Promise.resolve(i):(async(e,s,n)=>{let i=Re(e);if(!E(i,s)){const t={channelCount:i.channelCount,channelCountMode:i.channelCountMode,channelInterpretation:i.channelInterpretation,fftSize:i.fftSize,maxDecibels:i.maxDecibels,minDecibels:i.minDecibels,smoothingTimeConstant:i.smoothingTimeConstant};i=Ee(s,t)}return t.set(s,i),await qe(e,s,i,n),i})(e,s,n)}}});var Ee,Re,qe;const Fe=(Ie=p,t=>{const e=Ie.get(t);if(void 0===e)throw At();return e});var Ie;const Ve=(t=>null===t?null:t.hasOwnProperty("OfflineAudioContext")?t.OfflineAudioContext:t.hasOwnProperty("webkitOfflineAudioContext")?t.webkitOfflineAudioContext:null)(Te),Ne=(Pe=Ve,t=>null!==Pe&&t instanceof Pe);var Pe;const je=new WeakMap,Le=(ze=de,class{constructor(t){this._nativeEventTarget=t,this._listeners=new WeakMap}addEventListener(t,e,s){if(null!==e){let n=this._listeners.get(e);void 0===n&&(n=ze(this,e),"function"==typeof e&&this._listeners.set(e,n)),this._nativeEventTarget.addEventListener(t,n,s)}}dispatchEvent(t){return this._nativeEventTarget.dispatchEvent(t)}removeEventListener(t,e,s){const n=null===e?void 0:this._listeners.get(e);this._nativeEventTarget.removeEventListener(t,void 0===n?null:n,s)}});var ze;const Be=(t=>null===t?null:t.hasOwnProperty("AudioContext")?t.AudioContext:t.hasOwnProperty("webkitAudioContext")?t.webkitAudioContext:null)(Te),We=(Ge=Be,t=>null!==Ge&&t instanceof Ge);var Ge;const Ue=(t=>e=>null!==t&&"function"==typeof t.AudioNode&&e instanceof t.AudioNode)(Te),Qe=(t=>e=>null!==t&&"function"==typeof t.AudioParam&&e instanceof t.AudioParam)(Te),Ze=((t,e,s,n,i,o,r,a,c,u,l,p,f,_,m)=>class extends u{constructor(e,n,i,o){super(i),this._context=e,this._nativeAudioNode=i;const r=l(e);p(r)&&!0!==s(rt,()=>rt(r))&&(t=>{const e=new Map;var s,n;t.connect=(s=t.connect.bind(t),(t,n=0,i=0)=>{const o=ct(t)?s(t,n,i):s(t,n),r=e.get(t);return void 0===r?e.set(t,[{input:i,output:n}]):r.every(t=>t.input!==i||t.output!==n)&&r.push({input:i,output:n}),o}),t.disconnect=(n=t.disconnect,(s,i,o)=>{if(n.apply(t),void 0===s)e.clear();else if("number"==typeof s)for(const[t,n]of e){const i=n.filter(t=>t.output!==s);0===i.length?e.delete(t):e.set(t,i)}else if(e.has(s))if(void 0===i)e.delete(s);else{const t=e.get(s);if(void 0!==t){const n=t.filter(t=>t.output!==i&&(t.input!==o||void 0===o));0===n.length?e.delete(s):e.set(s,n)}}for(const[s,n]of e)n.forEach(e=>{ct(s)?t.connect(s,e.output,e.input):t.connect(s,e.output)})})})(i),h.set(this,i),d.set(this,new Set),"closed"!==e.state&&n&&C(this),t(this,o,i)}get channelCount(){return this._nativeAudioNode.channelCount}set channelCount(t){this._nativeAudioNode.channelCount=t}get channelCountMode(){return this._nativeAudioNode.channelCountMode}set channelCountMode(t){this._nativeAudioNode.channelCountMode=t}get channelInterpretation(){return this._nativeAudioNode.channelInterpretation}set channelInterpretation(t){this._nativeAudioNode.channelInterpretation=t}get context(){return this._context}get numberOfInputs(){return this._nativeAudioNode.numberOfInputs}get numberOfOutputs(){return this._nativeAudioNode.numberOfOutputs}connect(t,s=0,a=0){if(s<0||s>=this._nativeAudioNode.numberOfOutputs)throw i();const h=l(this._context),u=m(h);if(f(t)||_(t))throw o();if(U(t)){const i=st(t);try{const e=$(this._nativeAudioNode,i,s,a),n=ot(this);(u||n)&&this._nativeAudioNode.disconnect(...e),"closed"!==this.context.state&&!n&&ot(t)&&C(t)}catch(t){if(12===t.code)throw o();throw t}if(e(this,t,s,a,u)){const e=c([this],t);at(e,n(u))}return t}const p=nt(t);if("playbackRate"===p.name)throw r();try{this._nativeAudioNode.connect(p,s),(u||ot(this))&&this._nativeAudioNode.disconnect(p,s)}catch(t){if(12===t.code)throw o();throw t}if(ht(this,t,s,u)){const e=c([this],t);at(e,n(u))}}disconnect(t,e,s){let n;const r=l(this._context),h=m(r);if(void 0===t)n=((t,e)=>{const s=L(t),n=[];for(const i of s.outputs)Q(i)?ut(t,e,...i):lt(t,e,...i),n.push(i[0]);return s.outputs.clear(),n})(this,h);else if("number"==typeof t){if(t<0||t>=this.numberOfOutputs)throw i();n=((t,e,s)=>{const n=L(t),i=[];for(const o of n.outputs)o[1]===s&&(Q(o)?ut(t,e,...o):lt(t,e,...o),i.push(o[0]),n.outputs.delete(o));return i})(this,h,t)}else{if(void 0!==e&&(e<0||e>=this.numberOfOutputs))throw i();if(U(t)&&void 0!==s&&(s<0||s>=t.numberOfInputs))throw i();if(n=((t,e,s,n,i)=>{const o=L(t);return Array.from(o.outputs).filter(t=>!(t[0]!==s||void 0!==n&&t[1]!==n||void 0!==i&&t[2]!==i)).map(s=>(Q(s)?ut(t,e,...s):lt(t,e,...s),o.outputs.delete(s),s[0]))})(this,h,t,e,s),0===n.length)throw o()}for(const t of n){const e=c([this],t);at(e,a)}}})((Xe=c,(t,e,s)=>{const n=[];for(let t=0;t<s.numberOfInputs;t+=1)n.push(new Set);Xe.set(t,{activeInputs:n,outputs:new Set,passiveInputs:new WeakMap,renderer:e})}),((t,e,s,n,i,o,r,a,c,h,u,l,p)=>(d,f,_,m,g)=>{const{activeInputs:v,passiveInputs:y}=o(f),{outputs:x}=o(d),w=a(d),b=o=>{const a=c(f),h=c(d);if(o){const e=S(y,d,_,m);t(v,d,e,!1),g||l(d)||s(h,a,_,m),p(f)&&C(f)}else{const t=n(v,d,_,m);e(y,m,t,!1),g||l(d)||i(h,a,_,m);const s=r(f);0===s?u(f)&&O(f,v):setTimeout(()=>{u(f)&&O(f,v)},1e3*s)}};return!!h(x,[f,_,m],t=>t[0]===f&&t[1]===_&&t[2]===m,!0)&&(w.add(b),u(d)?t(v,d,[_,m,b],!0):e(y,m,[d,_,b],!0),!0)})(fe,me,$,ge,et,L,ye,k,st,Z,P,it,ot),xe,((t,e,s,n,i,o)=>r=>(a,c)=>{const h=t.get(a);if(void 0===h){if(!r&&o(a)){const t=n(a),{outputs:o}=s(a);for(const s of o)if(Q(s)){const i=n(s[0]);e(t,i,s[1],s[2])}else{const e=i(s[0]);t.disconnect(e,s[1])}}t.set(a,c)}else t.set(a,h+c)})(f,et,L,st,nt,P),q,Dt,Ht,((t,e,s,n,i,o,r,a)=>(c,h)=>{const u=e.get(c);if(void 0===u)throw new Error("Missing the expected cycle count.");const l=o(c.context),p=a(l);if(u===h){if(e.delete(c),!p&&r(c)){const e=n(c),{outputs:o}=s(c);for(const s of o)if(Q(s)){const i=n(s[0]);t(e,i,s[1],s[2])}else{const t=i(s[0]);e.connect(t,s[1])}}}else e.set(c,u-h)})($,f,L,st,nt,Fe,P,Ne),((t,e,s)=>function n(i,o){const r=U(o)?o:s(t,o);if((t=>"delayTime"in t)(r))return[];if(i[0]===r)return[i];if(i.includes(r))return[];const{outputs:a}=e(r);return Array.from(a).map(t=>n([...i,r],t[0])).reduce((t,e)=>t.concat(e),[])})(je,L,b),Le,Fe,We,Ue,Qe,Ne);var Xe;const Ye=((t,e,s,n,i,o)=>class extends t{constructor(t,s){const r=i(t),a={...M,...s},c=n(r,a);super(t,!1,c,o(r)?e():null),this._nativeAnalyserNode=c}get fftSize(){return this._nativeAnalyserNode.fftSize}set fftSize(t){this._nativeAnalyserNode.fftSize=t}get frequencyBinCount(){return this._nativeAnalyserNode.frequencyBinCount}get maxDecibels(){return this._nativeAnalyserNode.maxDecibels}set maxDecibels(t){const e=this._nativeAnalyserNode.maxDecibels;if(this._nativeAnalyserNode.maxDecibels=t,!(t>this._nativeAnalyserNode.minDecibels))throw this._nativeAnalyserNode.maxDecibels=e,s()}get minDecibels(){return this._nativeAnalyserNode.minDecibels}set minDecibels(t){const e=this._nativeAnalyserNode.minDecibels;if(this._nativeAnalyserNode.minDecibels=t,!(this._nativeAnalyserNode.maxDecibels>t))throw this._nativeAnalyserNode.minDecibels=e,s()}get smoothingTimeConstant(){return this._nativeAnalyserNode.smoothingTimeConstant}set smoothingTimeConstant(t){this._nativeAnalyserNode.smoothingTimeConstant=t}getByteFrequencyData(t){this._nativeAnalyserNode.getByteFrequencyData(t)}getByteTimeDomainData(t){this._nativeAnalyserNode.getByteTimeDomainData(t)}getFloatFrequencyData(t){this._nativeAnalyserNode.getFloatFrequencyData(t)}getFloatTimeDomainData(t){this._nativeAnalyserNode.getFloatTimeDomainData(t)}})(Ze,Me,q,Se,Fe,Ne),He=new WeakSet,$e=(t=>null===t?null:t.hasOwnProperty("AudioBuffer")?t.AudioBuffer:null)(Te),Je=(Ke=new Uint32Array(1),t=>(Ke[0]=t,Ke[0]));var Ke;const ts=((t,e)=>s=>{s.copyFromChannel=(n,i,o=0)=>{const r=t(o),a=t(i);if(a>=s.numberOfChannels)throw e();const c=s.length,h=s.getChannelData(a),u=n.length;for(let t=r<0?-r:0;t+r<c&&t<u;t+=1)n[t]=h[t+r]},s.copyToChannel=(n,i,o=0)=>{const r=t(o),a=t(i);if(a>=s.numberOfChannels)throw e();const c=s.length,h=s.getChannelData(a),u=n.length;for(let t=r<0?-r:0;t+r<c&&t<u;t+=1)h[t+r]=n[t]}})(Je,q),es=(t=>e=>{e.copyFromChannel=(s=>(n,i,o=0)=>{const r=t(o),a=t(i);if(r<e.length)return s.call(e,n,a,r)})(e.copyFromChannel),e.copyToChannel=(s=>(n,i,o=0)=>{const r=t(o),a=t(i);if(r<e.length)return s.call(e,n,a,r)})(e.copyToChannel)})(Je),ss=((t,e,s,n,i,o,r,a)=>{let c=null;return class h{constructor(h){if(null===i)throw new Error("Missing the native OfflineAudioContext constructor.");const{length:u,numberOfChannels:l,sampleRate:p}={...I,...h};null===c&&(c=new i(1,1,44100));const d=null!==n&&e(o,o)?new n({length:u,numberOfChannels:l,sampleRate:p}):c.createBuffer(l,u,p);if(0===d.numberOfChannels)throw s();return"function"!=typeof d.copyFromChannel?(r(d),F(d)):e(R,()=>R(d))||a(d),t.add(d),d}static[Symbol.hasInstance](e){return null!==e&&"object"==typeof e&&Object.getPrototypeOf(e)===h.prototype||t.has(e)}}})(He,xe,Ht,$e,Ve,(ns=$e,()=>{if(null===ns)return!1;try{new ns({length:1,sampleRate:44100})}catch{return!1}return!0}),ts,es);var ns;const is=(os=Qt,(t,e)=>{const s=os(t,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});e.connect(s).connect(t.destination);const n=()=>{e.removeEventListener("ended",n),e.disconnect(s),s.disconnect()};e.addEventListener("ended",n)});var os;const rs=((t,e,s)=>async(n,i,o,r)=>{const a=e(n);await Promise.all(Array.from(a.activeInputs).map(async([e,n])=>{const a=t(e),c=await a.render(e,i,r);s(e)||c.connect(o,n)}))})(Ae,z,it),as=(t=>(e,s,n,i)=>t(s,e,n,i))(rs),cs=((t,e,s,n,i,o,r,a,c,h,u)=>(l,p)=>{const d=l.createBufferSource();return It(d,p),Nt(d,p,"playbackRate"),Ft(d,p,"buffer"),Ft(d,p,"loop"),Ft(d,p,"loopEnd"),Ft(d,p,"loopStart"),e(s,()=>s(l))||(t=>{t.start=(e=>{let s=!1;return(n=0,i=0,o)=>{if(s)throw At();e.call(t,n,i,o),s=!0}})(t.start)})(d),e(n,()=>n(l))||c(d),e(i,()=>i(l))||h(d,l),e(o,()=>o(l))||Pt(d),e(r,()=>r(l))||u(d,l),e(a,()=>a(l))||jt(d),t(l,d),d})(is,xe,t=>{const e=t.createBufferSource();e.start();try{e.start()}catch{return!0}return!1},t=>{const e=t.createBufferSource(),s=t.createBuffer(1,1,44100);e.buffer=s;try{e.start(0,1)}catch{return!1}return!0},t=>{const e=t.createBufferSource();e.start();try{e.stop()}catch{return!1}return!0},ae,ce,he,t=>{var e;t.start=(e=t.start,(s=0,n=0,i)=>{const o=t.buffer,r=null===o?n:Math.min(o.duration,n);null!==o&&r>o.duration-.5/t.context.sampleRate?e.call(t,s,0,0):e.call(t,s,r,i)})},(hs=oe,(t,e)=>{const s=e.createBuffer(1,1,44100);null===t.buffer&&(t.buffer=s),hs(t,"buffer",e=>()=>{const n=e.call(t);return n===s?null:n},e=>n=>e.call(t,null===n?s:n))}),pe);var hs;const us=((t,e)=>(s,n,i,o)=>(t(n).replay(i),e(n,s,i,o)))((t=>e=>{const s=t(e);if(null===s.renderer)throw new Error("Missing the renderer of the given AudioParam in the audio graph.");return s.renderer})(z),rs),ls=((t,e,s,n,i)=>()=>{const o=new WeakMap;let r=null,a=null;return{set start(t){r=t},set stop(t){a=t},render(c,h,u){const l=o.get(h);return void 0!==l?Promise.resolve(l):(async(c,h,u)=>{let l=s(c);const p=E(l,h);if(!p){const t={buffer:l.buffer,channelCount:l.channelCount,channelCountMode:l.channelCountMode,channelInterpretation:l.channelInterpretation,loop:l.loop,loopEnd:l.loopEnd,loopStart:l.loopStart,playbackRate:l.playbackRate.value};l=e(h,t),null!==r&&l.start(...r),null!==a&&l.stop(a)}return o.set(h,l),p?await t(h,c.playbackRate,l.playbackRate,u):await n(h,c.playbackRate,l.playbackRate,u),await i(c,h,l,u),l})(c,h,u)}}})(as,cs,st,us,Oe),ps=((t,e,s,n,i,o,a,c,h,u,l,p,d)=>(f,_,m,g=null,v=null)=>{const y=new r.AutomationEventList(m.defaultValue),x=_?n(y):null,w={get defaultValue(){return m.defaultValue},get maxValue(){return null===g?m.maxValue:g},get minValue(){return null===v?m.minValue:v},get value(){return m.value},set value(t){m.value=t,w.setValueAtTime(t,f.context.currentTime)},cancelAndHoldAtTime(t){if("function"==typeof m.cancelAndHoldAtTime)null===x&&y.flush(f.context.currentTime),y.add(i(t)),m.cancelAndHoldAtTime(t);else{const e=Array.from(y).pop();null===x&&y.flush(f.context.currentTime),y.add(i(t));const s=Array.from(y).pop();m.cancelScheduledValues(t),e!==s&&void 0!==s&&("exponentialRampToValue"===s.type?m.exponentialRampToValueAtTime(s.value,s.endTime):"linearRampToValue"===s.type?m.linearRampToValueAtTime(s.value,s.endTime):"setValue"===s.type?m.setValueAtTime(s.value,s.startTime):"setValueCurve"===s.type&&m.setValueCurveAtTime(s.values,s.startTime,s.duration))}return w},cancelScheduledValues:t=>(null===x&&y.flush(f.context.currentTime),y.add(o(t)),m.cancelScheduledValues(t),w),exponentialRampToValueAtTime(t,e){if(0===t)throw new RangeError;if(!Number.isFinite(e)||e<0)throw new RangeError;return null===x&&y.flush(f.context.currentTime),y.add(a(t,e)),m.exponentialRampToValueAtTime(t,e),w},linearRampToValueAtTime:(t,e)=>(null===x&&y.flush(f.context.currentTime),y.add(c(t,e)),m.linearRampToValueAtTime(t,e),w),setTargetAtTime:(t,e,s)=>(null===x&&y.flush(f.context.currentTime),y.add(h(t,e,s)),m.setTargetAtTime(t,e,s),w),setValueAtTime:(t,e)=>(null===x&&y.flush(f.context.currentTime),y.add(u(t,e)),m.setValueAtTime(t,e),w),setValueCurveAtTime(t,e,s){const n=t instanceof Float32Array?t:new Float32Array(t);if(null!==p&&"webkitAudioContext"===p.name){const t=e+s,i=f.context.sampleRate,o=Math.ceil(e*i),r=Math.floor(t*i),a=r-o,c=new Float32Array(a);for(let t=0;t<a;t+=1){const r=(n.length-1)/s*((o+t)/i-e),a=Math.floor(r),h=Math.ceil(r);c[t]=a===h?n[a]:(1-(r-a))*n[a]+(1-(h-r))*n[h]}null===x&&y.flush(f.context.currentTime),y.add(l(c,e,s)),m.setValueCurveAtTime(c,e,s);const h=r/i;h<t&&d(w,c[c.length-1],h),d(w,n[n.length-1],t)}else null===x&&y.flush(f.context.currentTime),y.add(l(n,e,s)),m.setValueCurveAtTime(n,e,s);return w}};return s.set(w,m),e.set(w,f),t(w,x),w})((ds=u,(t,e)=>{ds.set(t,{activeInputs:new Set,passiveInputs:new WeakMap,renderer:e})}),je,l,t=>({replay(e){for(const s of t)if("exponentialRampToValue"===s.type){const{endTime:t,value:n}=s;e.exponentialRampToValueAtTime(n,t)}else if("linearRampToValue"===s.type){const{endTime:t,value:n}=s;e.linearRampToValueAtTime(n,t)}else if("setTarget"===s.type){const{startTime:t,target:n,timeConstant:i}=s;e.setTargetAtTime(n,t,i)}else if("setValue"===s.type){const{startTime:t,value:n}=s;e.setValueAtTime(n,t)}else{if("setValueCurve"!==s.type)throw new Error("Can't apply an unknown automation.");{const{duration:t,startTime:n,values:i}=s;e.setValueCurveAtTime(i,n,t)}}}}),r.createCancelAndHoldAutomationEvent,r.createCancelScheduledValuesAutomationEvent,r.createExponentialRampToValueAutomationEvent,r.createLinearRampToValueAutomationEvent,r.createSetTargetAutomationEvent,r.createSetValueAutomationEvent,r.createSetValueCurveAutomationEvent,Be,re);var ds;const fs=((t,e,s,n,i,o,r,a)=>class extends t{constructor(t,n){const a=o(t),c={...j,...n},h=i(a,c),u=r(a),l=u?e():null;super(t,!1,h,l),this._audioBufferSourceNodeRenderer=l,this._isBufferNullified=!1,this._isBufferSet=null!==c.buffer,this._nativeAudioBufferSourceNode=h,this._onended=null,this._playbackRate=s(this,u,h.playbackRate,N,V)}get buffer(){return this._isBufferNullified?null:this._nativeAudioBufferSourceNode.buffer}set buffer(t){if(this._nativeAudioBufferSourceNode.buffer=t,null!==t){if(this._isBufferSet)throw n();this._isBufferSet=!0}}get loop(){return this._nativeAudioBufferSourceNode.loop}set loop(t){this._nativeAudioBufferSourceNode.loop=t}get loopEnd(){return this._nativeAudioBufferSourceNode.loopEnd}set loopEnd(t){this._nativeAudioBufferSourceNode.loopEnd=t}get loopStart(){return this._nativeAudioBufferSourceNode.loopStart}set loopStart(t){this._nativeAudioBufferSourceNode.loopStart=t}get onended(){return this._onended}set onended(t){const e="function"==typeof t?a(this,t):null;this._nativeAudioBufferSourceNode.onended=e;const s=this._nativeAudioBufferSourceNode.onended;this._onended=null!==s&&s===e?t:s}get playbackRate(){return this._playbackRate}start(t=0,e=0,s){if(this._nativeAudioBufferSourceNode.start(t,e,s),null!==this._audioBufferSourceNodeRenderer&&(this._audioBufferSourceNodeRenderer.start=void 0===s?[t,e]:[t,e,s]),"closed"!==this.context.state){C(this);const t=()=>{this._nativeAudioBufferSourceNode.removeEventListener("ended",t),P(this)&&D(this)};this._nativeAudioBufferSourceNode.addEventListener("ended",t)}}stop(t=0){this._nativeAudioBufferSourceNode.stop(t),null!==this._audioBufferSourceNodeRenderer&&(this._audioBufferSourceNodeRenderer.stop=t)}})(Ze,ls,ps,At,cs,Fe,Ne,de),_s=((t,e,s,n,i,o,r,a)=>class extends t{constructor(t,s){const n=o(t),c=r(n),h=i(n,s,c);super(t,!1,h,c?e(a):null),this._isNodeOfNativeOfflineAudioContext=c,this._nativeAudioDestinationNode=h}get channelCount(){return this._nativeAudioDestinationNode.channelCount}set channelCount(t){if(this._isNodeOfNativeOfflineAudioContext)throw n();if(t>this._nativeAudioDestinationNode.maxChannelCount)throw s();this._nativeAudioDestinationNode.channelCount=t}get channelCountMode(){return this._nativeAudioDestinationNode.channelCountMode}set channelCountMode(t){if(this._isNodeOfNativeOfflineAudioContext)throw n();this._nativeAudioDestinationNode.channelCountMode=t}get maxChannelCount(){return this._nativeAudioDestinationNode.maxChannelCount}})(Ze,t=>{let e=null;return{render:(s,n,i)=>(null===e&&(e=(async(e,s,n)=>{const i=s.destination;return await t(e,s,i,n),i})(s,n,i)),e)}},q,At,((t,e)=>(s,n,i)=>{const o=s.destination;if(o.channelCount!==n)try{o.channelCount=n}catch{}i&&"explicit"!==o.channelCountMode&&(o.channelCountMode="explicit"),0===o.maxChannelCount&&Object.defineProperty(o,"maxChannelCount",{value:n});const r=t(s,{channelCount:n,channelCountMode:o.channelCountMode,channelInterpretation:o.channelInterpretation,gain:1});return e(r,"channelCount",t=>()=>t.call(r),t=>e=>{t.call(r,e);try{o.channelCount=e}catch(t){if(e>o.maxChannelCount)throw t}}),e(r,"channelCountMode",t=>()=>t.call(r),t=>e=>{t.call(r,e),o.channelCountMode=e}),e(r,"channelInterpretation",t=>()=>t.call(r),t=>e=>{t.call(r,e),o.channelInterpretation=e}),Object.defineProperty(r,"maxChannelCount",{get:()=>o.maxChannelCount}),r.connect(o),r})(Qt,oe),Fe,Ne,Oe),ms=((t,e,s,n,i)=>()=>{const o=new WeakMap;return{render(r,a,c){const h=o.get(a);return void 0!==h?Promise.resolve(h):(async(r,a,c)=>{let h=s(r);const u=E(h,a);if(!u){const t={Q:h.Q.value,channelCount:h.channelCount,channelCountMode:h.channelCountMode,channelInterpretation:h.channelInterpretation,detune:h.detune.value,frequency:h.frequency.value,gain:h.gain.value,type:h.type};h=e(a,t)}return o.set(a,h),u?(await t(a,r.Q,h.Q,c),await t(a,r.detune,h.detune,c),await t(a,r.frequency,h.frequency,c),await t(a,r.gain,h.gain,c)):(await n(a,r.Q,h.Q,c),await n(a,r.detune,h.detune,c),await n(a,r.frequency,h.frequency,c),await n(a,r.gain,h.gain,c)),await i(r,a,h,c),h})(r,a,c)}}})(as,Bt,st,us,Oe),gs=(t=>(e,s)=>t.set(e,s))(ve),vs=(ys=Ze,xs=ps,ws=ms,bs=Dt,Ts=Bt,Ss=Fe,ks=Ne,Cs=gs,class extends ys{constructor(t,e){const s=Ss(t),n={...vt,...e},i=Ts(s,n),o=ks(s);super(t,!1,i,o?ws():null),this._Q=xs(this,o,i.Q,N,V),this._detune=xs(this,o,i.detune,1200*Math.log2(N),-1200*Math.log2(N)),this._frequency=xs(this,o,i.frequency,t.sampleRate/2,0),this._gain=xs(this,o,i.gain,40*Math.log10(N),V),this._nativeBiquadFilterNode=i,Cs(this,1)}get detune(){return this._detune}get frequency(){return this._frequency}get gain(){return this._gain}get Q(){return this._Q}get type(){return this._nativeBiquadFilterNode.type}set type(t){this._nativeBiquadFilterNode.type=t}getFrequencyResponse(t,e,s){try{this._nativeBiquadFilterNode.getFrequencyResponse(t,e,s)}catch(t){if(11===t.code)throw bs();throw t}if(t.length!==e.length||e.length!==s.length)throw bs()}});var ys,xs,ws,bs,Ts,Ss,ks,Cs;const As=((t,e)=>(s,n,i)=>{const o=new Set;var r,a;return s.connect=(r=s.connect,(i,a=0,c=0)=>{const h=0===o.size;if(e(i))return r.call(s,i,a,c),t(o,[i,a,c],t=>t[0]===i&&t[1]===a&&t[2]===c,!0),h&&n(),i;r.call(s,i,a),t(o,[i,a],t=>t[0]===i&&t[1]===a,!0),h&&n()}),s.disconnect=(a=s.disconnect,(t,n,r)=>{const c=o.size>0;if(void 0===t)a.apply(s),o.clear();else if("number"==typeof t){a.call(s,t);for(const e of o)e[1]===t&&o.delete(e)}else{e(t)?a.call(s,t,n,r):a.call(s,t,n);for(const e of o)e[0]!==t||void 0!==n&&e[1]!==n||void 0!==r&&e[2]!==r||o.delete(e)}const h=0===o.size;c&&h&&i()}),s})(Z,Ue),Ds=(Os=At,Ms=As,(t,e)=>{e.channelCount=1,e.channelCountMode="explicit",Object.defineProperty(e,"channelCount",{get:()=>1,set:()=>{throw Os()}}),Object.defineProperty(e,"channelCountMode",{get:()=>"explicit",set:()=>{throw Os()}});const s=t.createBufferSource();Ms(e,()=>{const t=e.numberOfInputs;for(let n=0;n<t;n+=1)s.connect(e,0,n)},()=>s.disconnect(e))});var Os,Ms;const Es=((t,e)=>(s,n)=>{const i=s.createChannelMerger(n.numberOfInputs);return null!==t&&"webkitAudioContext"===t.name&&e(s,i),It(i,n),i})(Be,Ds),Rs=((t,e,s,n,i)=>class extends t{constructor(t,o){const r=n(t),a={...yt,...o};super(t,!1,s(r,a),i(r)?e():null)}})(Ze,((t,e,s)=>()=>{const n=new WeakMap;return{render(i,o,r){const a=n.get(o);return void 0!==a?Promise.resolve(a):(async(i,o,r)=>{let a=e(i);if(!E(a,o)){const e={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,numberOfInputs:a.numberOfInputs};a=t(o,e)}return n.set(o,a),await s(i,o,a,r),a})(i,o,r)}}})(Es,st,Oe),Es,Fe,Ne),qs=((t,e,s,n,i,o)=>class extends t{constructor(t,r){const a=n(t),c=o({...xt,...r});super(t,!1,s(a,c),i(a)?e():null)}})(Ze,((t,e,s)=>()=>{const n=new WeakMap;return{render(i,o,r){const a=n.get(o);return void 0!==a?Promise.resolve(a):(async(i,o,r)=>{let a=e(i);if(!E(a,o)){const e={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,numberOfOutputs:a.numberOfOutputs};a=t(o,e)}return n.set(o,a),await s(i,o,a,r),a})(i,o,r)}}})(Wt,st,Oe),Wt,Fe,Ne,t=>({...t,channelCount:t.numberOfOutputs})),Fs=((t,e,s,n)=>(i,{offset:o,...r})=>{const a=i.createBuffer(1,2,44100),c=e(i,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}),h=s(i,{...r,gain:o}),u=a.getChannelData(0);u[0]=1,u[1]=1,c.buffer=a,c.loop=!0;const l={get bufferSize(){},get channelCount(){return h.channelCount},set channelCount(t){h.channelCount=t},get channelCountMode(){return h.channelCountMode},set channelCountMode(t){h.channelCountMode=t},get channelInterpretation(){return h.channelInterpretation},set channelInterpretation(t){h.channelInterpretation=t},get context(){return h.context},get inputs(){return[]},get numberOfInputs(){return c.numberOfInputs},get numberOfOutputs(){return h.numberOfOutputs},get offset(){return h.gain},get onended(){return c.onended},set onended(t){c.onended=t},addEventListener:(...t)=>c.addEventListener(t[0],t[1],t[2]),dispatchEvent:(...t)=>c.dispatchEvent(t[0]),removeEventListener:(...t)=>c.removeEventListener(t[0],t[1],t[2]),start(t=0){c.start.call(c,t)},stop(t=0){c.stop.call(c,t)}};return t(i,c),n(Gt(l,h),()=>c.connect(h),()=>c.disconnect(h))})(is,cs,Qt,As),Is=((t,e,s,n,i)=>(o,r)=>{if(void 0===o.createConstantSource)return s(o,r);const a=o.createConstantSource();return It(a,r),Nt(a,r,"offset"),e(n,()=>n(o))||Pt(a),e(i,()=>i(o))||jt(a),t(o,a),a})(is,xe,Fs,ae,he),Vs=((t,e,s,n,i,o,r)=>class extends t{constructor(t,r){const a=i(t),c={...wt,...r},h=n(a,c),u=o(a),l=u?s():null;super(t,!1,h,l),this._constantSourceNodeRenderer=l,this._nativeConstantSourceNode=h,this._offset=e(this,u,h.offset,N,V),this._onended=null}get offset(){return this._offset}get onended(){return this._onended}set onended(t){const e="function"==typeof t?r(this,t):null;this._nativeConstantSourceNode.onended=e;const s=this._nativeConstantSourceNode.onended;this._onended=null!==s&&s===e?t:s}start(t=0){if(this._nativeConstantSourceNode.start(t),null!==this._constantSourceNodeRenderer&&(this._constantSourceNodeRenderer.start=t),"closed"!==this.context.state){C(this);const t=()=>{this._nativeConstantSourceNode.removeEventListener("ended",t),P(this)&&D(this)};this._nativeConstantSourceNode.addEventListener("ended",t)}}stop(t=0){this._nativeConstantSourceNode.stop(t),null!==this._constantSourceNodeRenderer&&(this._constantSourceNodeRenderer.stop=t)}})(Ze,ps,((t,e,s,n,i)=>()=>{const o=new WeakMap;let r=null,a=null;return{set start(t){r=t},set stop(t){a=t},render(c,h,u){const l=o.get(h);return void 0!==l?Promise.resolve(l):(async(c,h,u)=>{let l=s(c);const p=E(l,h);if(!p){const t={channelCount:l.channelCount,channelCountMode:l.channelCountMode,channelInterpretation:l.channelInterpretation,offset:l.offset.value};l=e(h,t),null!==r&&l.start(r),null!==a&&l.stop(a)}return o.set(h,l),p?await t(h,c.offset,l.offset,u):await n(h,c.offset,l.offset,u),await i(c,h,l,u),l})(c,h,u)}}})(as,Is,st,us,Oe),Is,Fe,Ne,de),Ns=((t,e)=>(s,n)=>{const i=s.createConvolver();if(It(i,n),n.disableNormalization===i.normalize&&(i.normalize=!n.disableNormalization),Ft(i,n,"buffer"),n.channelCount>2)throw t();if(e(i,"channelCount",t=>()=>t.call(i),e=>s=>{if(s>2)throw t();return e.call(i,s)}),"max"===n.channelCountMode)throw t();return e(i,"channelCountMode",t=>()=>t.call(i),e=>s=>{if("max"===s)throw t();return e.call(i,s)}),i})(Ht,oe),Ps=((t,e,s,n,i,o)=>class extends t{constructor(t,r){const a=n(t),c={...bt,...r},h=s(a,c);super(t,!1,h,i(a)?e():null),this._isBufferNullified=!1,this._nativeConvolverNode=h,null!==c.buffer&&o(this,c.buffer.duration)}get buffer(){return this._isBufferNullified?null:this._nativeConvolverNode.buffer}set buffer(t){if(this._nativeConvolverNode.buffer=t,null===t&&null!==this._nativeConvolverNode.buffer){const t=this._nativeConvolverNode.context;this._nativeConvolverNode.buffer=t.createBuffer(1,1,44100),this._isBufferNullified=!0,o(this,0)}else this._isBufferNullified=!1,o(this,null===this._nativeConvolverNode.buffer?0:this._nativeConvolverNode.buffer.duration)}get normalize(){return this._nativeConvolverNode.normalize}set normalize(t){this._nativeConvolverNode.normalize=t}})(Ze,((t,e,s)=>()=>{const n=new WeakMap;return{render(i,o,r){const a=n.get(o);return void 0!==a?Promise.resolve(a):(async(i,o,r)=>{let a=e(i);if(!E(a,o)){const e={buffer:a.buffer,channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,disableNormalization:!a.normalize};a=t(o,e)}return n.set(o,a),H(a)?await s(i,o,a.inputs[0],r):await s(i,o,a,r),a})(i,o,r)}}})(Ns,st,Oe),Ns,Fe,Ne,gs),js=((t,e,s,n,i,o,r)=>class extends t{constructor(t,a){const c=i(t),h={...Tt,...a},u=n(c,h),l=o(c);super(t,!1,u,l?s(h.maxDelayTime):null),this._delayTime=e(this,l,u.delayTime),r(this,h.maxDelayTime)}get delayTime(){return this._delayTime}})(Ze,ps,((t,e,s,n,i)=>o=>{const r=new WeakMap;return{render(a,c,h){const u=r.get(c);return void 0!==u?Promise.resolve(u):(async(a,c,h)=>{let u=s(a);const l=E(u,c);if(!l){const t={channelCount:u.channelCount,channelCountMode:u.channelCountMode,channelInterpretation:u.channelInterpretation,delayTime:u.delayTime.value,maxDelayTime:o};u=e(c,t)}return r.set(c,u),l?await t(c,a.delayTime,u.delayTime,h):await n(c,a.delayTime,u.delayTime,h),await i(a,c,u,h),u})(a,c,h)}}})(as,Ut,st,us,Oe),Ut,Fe,Ne,gs),Ls=(zs=Ht,(t,e)=>{const s=t.createDynamicsCompressor();if(It(s,e),e.channelCount>2)throw zs();if("max"===e.channelCountMode)throw zs();return Nt(s,e,"attack"),Nt(s,e,"knee"),Nt(s,e,"ratio"),Nt(s,e,"release"),Nt(s,e,"threshold"),s});var zs;const Bs=((t,e,s,n,i,o,r,a)=>class extends t{constructor(t,i){const c=o(t),h={...kt,...i},u=n(c,h),l=r(c);super(t,!1,u,l?s():null),this._attack=e(this,l,u.attack),this._knee=e(this,l,u.knee),this._nativeDynamicsCompressorNode=u,this._ratio=e(this,l,u.ratio),this._release=e(this,l,u.release),this._threshold=e(this,l,u.threshold),a(this,.006)}get attack(){return this._attack}get channelCount(){return this._nativeDynamicsCompressorNode.channelCount}set channelCount(t){const e=this._nativeDynamicsCompressorNode.channelCount;if(this._nativeDynamicsCompressorNode.channelCount=t,t>2)throw this._nativeDynamicsCompressorNode.channelCount=e,i()}get channelCountMode(){return this._nativeDynamicsCompressorNode.channelCountMode}set channelCountMode(t){const e=this._nativeDynamicsCompressorNode.channelCountMode;if(this._nativeDynamicsCompressorNode.channelCountMode=t,"max"===t)throw this._nativeDynamicsCompressorNode.channelCountMode=e,i()}get knee(){return this._knee}get ratio(){return this._ratio}get reduction(){return"number"==typeof this._nativeDynamicsCompressorNode.reduction.value?this._nativeDynamicsCompressorNode.reduction.value:this._nativeDynamicsCompressorNode.reduction}get release(){return this._release}get threshold(){return this._threshold}})(Ze,ps,((t,e,s,n,i)=>()=>{const o=new WeakMap;return{render(r,a,c){const h=o.get(a);return void 0!==h?Promise.resolve(h):(async(r,a,c)=>{let h=s(r);const u=E(h,a);if(!u){const t={attack:h.attack.value,channelCount:h.channelCount,channelCountMode:h.channelCountMode,channelInterpretation:h.channelInterpretation,knee:h.knee.value,ratio:h.ratio.value,release:h.release.value,threshold:h.threshold.value};h=e(a,t)}return o.set(a,h),u?(await t(a,r.attack,h.attack,c),await t(a,r.knee,h.knee,c),await t(a,r.ratio,h.ratio,c),await t(a,r.release,h.release,c),await t(a,r.threshold,h.threshold,c)):(await n(a,r.attack,h.attack,c),await n(a,r.knee,h.knee,c),await n(a,r.ratio,h.ratio,c),await n(a,r.release,h.release,c),await n(a,r.threshold,h.threshold,c)),await i(r,a,h,c),h})(r,a,c)}}})(as,Ls,st,us,Oe),Ls,Ht,Fe,Ne,gs),Ws=((t,e,s,n,i,o)=>class extends t{constructor(t,r){const a=i(t),c={...Ct,...r},h=n(a,c),u=o(a);super(t,!1,h,u?s():null),this._gain=e(this,u,h.gain,N,V)}get gain(){return this._gain}})(Ze,ps,((t,e,s,n,i)=>()=>{const o=new WeakMap;return{render(r,a,c){const h=o.get(a);return void 0!==h?Promise.resolve(h):(async(r,a,c)=>{let h=s(r);const u=E(h,a);if(!u){const t={channelCount:h.channelCount,channelCountMode:h.channelCountMode,channelInterpretation:h.channelInterpretation,gain:h.gain.value};h=e(a,t)}return o.set(a,h),u?await t(a,r.gain,h.gain,c):await n(a,r.gain,h.gain,c),await i(r,a,h,c),h})(r,a,c)}}})(as,Qt,st,us,Oe),Qt,Fe,Ne),Gs=((t,e,s,n)=>(i,o,{channelCount:r,channelCountMode:a,channelInterpretation:c,feedback:h,feedforward:u})=>{const l=Lt(o,i.sampleRate),p=h instanceof Float64Array?h:new Float64Array(h),d=u instanceof Float64Array?u:new Float64Array(u),f=p.length,_=d.length,m=Math.min(f,_);if(0===f||f>20)throw n();if(0===p[0])throw e();if(0===_||_>20)throw n();if(0===d[0])throw e();if(1!==p[0]){for(let t=0;t<_;t+=1)d[t]/=p[0];for(let t=1;t<f;t+=1)p[t]/=p[0]}const g=s(i,l,r,r);g.channelCount=r,g.channelCountMode=a,g.channelInterpretation=c;const v=[],y=[],x=[];for(let t=0;t<r;t+=1){v.push(0);const t=new Float32Array(32),e=new Float32Array(32);t.fill(0),e.fill(0),y.push(t),x.push(e)}g.onaudioprocess=t=>{const e=t.inputBuffer,s=t.outputBuffer,n=e.numberOfChannels;for(let t=0;t<n;t+=1){const n=e.getChannelData(t),i=s.getChannelData(t);v[t]=Mt(p,f,d,_,m,y[t],x[t],v[t],32,n,i)}};const w=i.sampleRate/2;return Gt({get bufferSize(){return l},get channelCount(){return g.channelCount},set channelCount(t){g.channelCount=t},get channelCountMode(){return g.channelCountMode},set channelCountMode(t){g.channelCountMode=t},get channelInterpretation(){return g.channelInterpretation},set channelInterpretation(t){g.channelInterpretation=t},get context(){return g.context},get inputs(){return[g]},get numberOfInputs(){return g.numberOfInputs},get numberOfOutputs(){return g.numberOfOutputs},addEventListener:(...t)=>g.addEventListener(t[0],t[1],t[2]),dispatchEvent:(...t)=>g.dispatchEvent(t[0]),getFrequencyResponse(e,s,n){if(e.length!==s.length||s.length!==n.length)throw t();const i=e.length;for(let t=0;t<i;t+=1){const i=-Math.PI*(e[t]/w),o=[Math.cos(i),Math.sin(i)],r=Zt(Xt(d,o),Xt(p,o));s[t]=Math.sqrt(r[0]*r[0]+r[1]*r[1]),n[t]=Math.atan2(r[1],r[0])}},removeEventListener:(...t)=>g.removeEventListener(t[0],t[1],t[2])},g)})(Dt,At,Yt,Ht),Us=((t,e,s,n)=>i=>t(Rt,()=>Rt(i))?Promise.resolve(t(n,n)).then(t=>{if(!t){const t=s(i,512,0,1);i.oncomplete=()=>{t.onaudioprocess=null,t.disconnect()},t.onaudioprocess=()=>i.currentTime,t.connect(i.destination)}return i.startRendering()}):new Promise(t=>{const s=e(i,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});i.oncomplete=e=>{s.disconnect(),t(e.renderedBuffer)},s.connect(i.destination),i.startRendering()}))(xe,Qt,Yt,((t,e)=>()=>{if(null===e)return Promise.resolve(!1);const s=new e(1,1,44100),n=t(s,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});return new Promise(t=>{s.oncomplete=()=>{n.disconnect(),t(0!==s.currentTime)},s.startRendering()})})(Qt,Ve)),Qs=((t,e,s,n,i)=>(o,r)=>{const a=new WeakMap;let c=null;const h=async(h,u,l)=>{let p=null,d=e(h);const f=E(d,u);if(void 0===u.createIIRFilter?p=t(u,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}):f||(d=u.createIIRFilter(r,o)),a.set(u,null===p?d:p),null!==p){if(null===c){if(null===s)throw new Error("Missing the native OfflineAudioContext constructor.");const t=new s(h.context.destination.channelCount,h.context.length,u.sampleRate);c=(async()=>{await n(h,t,t.destination,l);return((t,e,s,n)=>{const i=s instanceof Float64Array?s:new Float64Array(s),o=n instanceof Float64Array?n:new Float64Array(n),r=i.length,a=o.length,c=Math.min(r,a);if(1!==i[0]){for(let t=0;t<r;t+=1)o[t]/=i[0];for(let t=1;t<a;t+=1)i[t]/=i[0]}const h=new Float32Array(32),u=new Float32Array(32),l=e.createBuffer(t.numberOfChannels,t.length,t.sampleRate),p=t.numberOfChannels;for(let e=0;e<p;e+=1){const s=t.getChannelData(e),n=l.getChannelData(e);h.fill(0),u.fill(0),Mt(i,r,o,a,c,h,u,0,32,s,n)}return l})(await i(t),u,o,r)})()}const t=await c;return p.buffer=t,p.start(0),p}return await n(h,u,d,l),d};return{render(t,e,s){const n=a.get(e);return void 0!==n?Promise.resolve(n):h(t,e,s)}}})(cs,st,Ve,Oe,Us);var Zs;const Xs=((t,e,s,n,i,o)=>class extends t{constructor(t,r){const a=n(t),c=i(a),h={...Ot,...r},u=e(a,c?null:t.baseLatency,h);super(t,!1,u,c?s(h.feedback,h.feedforward):null),(t=>{var e;t.getFrequencyResponse=(e=t.getFrequencyResponse,(s,n,i)=>{if(s.length!==n.length||n.length!==i.length)throw Dt();return e.call(t,s,n,i)})})(u),this._nativeIIRFilterNode=u,o(this,1)}getFrequencyResponse(t,e,s){return this._nativeIIRFilterNode.getFrequencyResponse(t,e,s)}})(Ze,(Zs=Gs,(t,e,s)=>{if(void 0===t.createIIRFilter)return Zs(t,e,s);const n=t.createIIRFilter(s.feedforward,s.feedback);return It(n,s),n}),Qs,Fe,Ne,gs),Ys=((t,e,s,n,i)=>(o,r)=>{const a=r.listener,{forwardX:c,forwardY:h,forwardZ:u,positionX:l,positionY:p,positionZ:d,upX:f,upY:_,upZ:m}=void 0===a.forwardX?(()=>{const c=e(r,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:9}),h=i(r),u=n(r,256,9,0),l=(e,n)=>{const i=s(r,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:n});return i.connect(c,0,e),i.start(),Object.defineProperty(i.offset,"defaultValue",{get:()=>n}),t({context:o},h,i.offset,N,V)};let p=[0,0,-1,0,1,0],d=[0,0,0];return u.onaudioprocess=({inputBuffer:t})=>{const e=[t.getChannelData(0)[0],t.getChannelData(1)[0],t.getChannelData(2)[0],t.getChannelData(3)[0],t.getChannelData(4)[0],t.getChannelData(5)[0]];e.some((t,e)=>t!==p[e])&&(a.setOrientation(...e),p=e);const s=[t.getChannelData(6)[0],t.getChannelData(7)[0],t.getChannelData(8)[0]];s.some((t,e)=>t!==d[e])&&(a.setPosition(...s),d=s)},c.connect(u),{forwardX:l(0,0),forwardY:l(1,0),forwardZ:l(2,-1),positionX:l(6,0),positionY:l(7,0),positionZ:l(8,0),upX:l(3,0),upY:l(4,1),upZ:l(5,0)}})():a;return{get forwardX(){return c},get forwardY(){return h},get forwardZ(){return u},get positionX(){return l},get positionY(){return p},get positionZ(){return d},get upX(){return f},get upY(){return _},get upZ(){return m}}})(ps,Es,Is,Yt,Ne),Hs=new WeakMap,$s=((t,e,s,n,i,o)=>class extends s{constructor(s,o){super(s),this._nativeContext=s,p.set(this,s),n(s)&&i.set(s,new Set),this._destination=new t(this,o),this._listener=e(this,s),this._onstatechange=null}get currentTime(){return this._nativeContext.currentTime}get destination(){return this._destination}get listener(){return this._listener}get onstatechange(){return this._onstatechange}set onstatechange(t){const e="function"==typeof t?o(this,t):null;this._nativeContext.onstatechange=e;const s=this._nativeContext.onstatechange;this._onstatechange=null!==s&&s===e?t:s}get sampleRate(){return this._nativeContext.sampleRate}get state(){return this._nativeContext.state}})(_s,Ys,Le,Ne,Hs,de),Js=((t,e,s,n,i,o)=>(r,a)=>{const c=r.createOscillator();return It(c,a),Nt(c,a,"detune"),Nt(c,a,"frequency"),void 0!==a.periodicWave?c.setPeriodicWave(a.periodicWave):Ft(c,a,"type"),e(s,()=>s(r))||Pt(c),e(n,()=>n(r))||o(c,r),e(i,()=>i(r))||jt(c),t(r,c),c})(is,xe,ae,ce,he,pe),Ks=((t,e,s,n,i,o,r)=>class extends t{constructor(t,r){const a=i(t),c={...Jt,...r},h=s(a,c),u=o(a),l=u?n():null,p=t.sampleRate/2;super(t,!1,h,l),this._detune=e(this,u,h.detune,153600,-153600),this._frequency=e(this,u,h.frequency,p,-p),this._nativeOscillatorNode=h,this._onended=null,this._oscillatorNodeRenderer=l,null!==this._oscillatorNodeRenderer&&void 0!==c.periodicWave&&(this._oscillatorNodeRenderer.periodicWave=c.periodicWave)}get detune(){return this._detune}get frequency(){return this._frequency}get onended(){return this._onended}set onended(t){const e="function"==typeof t?r(this,t):null;this._nativeOscillatorNode.onended=e;const s=this._nativeOscillatorNode.onended;this._onended=null!==s&&s===e?t:s}get type(){return this._nativeOscillatorNode.type}set type(t){this._nativeOscillatorNode.type=t,null!==this._oscillatorNodeRenderer&&(this._oscillatorNodeRenderer.periodicWave=null)}setPeriodicWave(t){this._nativeOscillatorNode.setPeriodicWave(t),null!==this._oscillatorNodeRenderer&&(this._oscillatorNodeRenderer.periodicWave=t)}start(t=0){if(this._nativeOscillatorNode.start(t),null!==this._oscillatorNodeRenderer&&(this._oscillatorNodeRenderer.start=t),"closed"!==this.context.state){C(this);const t=()=>{this._nativeOscillatorNode.removeEventListener("ended",t),P(this)&&D(this)};this._nativeOscillatorNode.addEventListener("ended",t)}}stop(t=0){this._nativeOscillatorNode.stop(t),null!==this._oscillatorNodeRenderer&&(this._oscillatorNodeRenderer.stop=t)}})(Ze,ps,Js,((t,e,s,n,i)=>()=>{const o=new WeakMap;let r=null,a=null,c=null;return{set periodicWave(t){r=t},set start(t){a=t},set stop(t){c=t},render(h,u,l){const p=o.get(u);return void 0!==p?Promise.resolve(p):(async(h,u,l)=>{let p=s(h);const d=E(p,u);if(!d){const t={channelCount:p.channelCount,channelCountMode:p.channelCountMode,channelInterpretation:p.channelInterpretation,detune:p.detune.value,frequency:p.frequency.value,periodicWave:null===r?void 0:r,type:p.type};p=e(u,t),null!==a&&p.start(a),null!==c&&p.stop(c)}return o.set(u,p),d?(await t(u,h.detune,p.detune,l),await t(u,h.frequency,p.frequency,l)):(await n(u,h.detune,p.detune,l),await n(u,h.frequency,p.frequency,l)),await i(h,u,p,l),p})(h,u,l)}}})(as,Js,st,us,Oe),Fe,Ne,de),tn=(en=cs,(t,e)=>{const s=en(t,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}),n=t.createBuffer(1,2,44100);return s.buffer=n,s.loop=!0,s.connect(e),s.start(),()=>{s.stop(),s.disconnect(e)}});var en;const sn=((t,e,s,n,i)=>(o,{curve:r,oversample:a,...c})=>{const h=o.createWaveShaper(),u=o.createWaveShaper();It(h,c),It(u,c);const l=s(o,{...c,gain:1}),p=s(o,{...c,gain:-1}),d=s(o,{...c,gain:1}),f=s(o,{...c,gain:-1});let _=null,m=!1,g=null;const v={get bufferSize(){},get channelCount(){return h.channelCount},set channelCount(t){l.channelCount=t,p.channelCount=t,h.channelCount=t,d.channelCount=t,u.channelCount=t,f.channelCount=t},get channelCountMode(){return h.channelCountMode},set channelCountMode(t){l.channelCountMode=t,p.channelCountMode=t,h.channelCountMode=t,d.channelCountMode=t,u.channelCountMode=t,f.channelCountMode=t},get channelInterpretation(){return h.channelInterpretation},set channelInterpretation(t){l.channelInterpretation=t,p.channelInterpretation=t,h.channelInterpretation=t,d.channelInterpretation=t,u.channelInterpretation=t,f.channelInterpretation=t},get context(){return h.context},get curve(){return g},set curve(s){if(null!==s&&s.length<2)throw e();if(null===s)h.curve=s,u.curve=s;else{const t=s.length,e=new Float32Array(t+2-t%2),n=new Float32Array(t+2-t%2);e[0]=s[0],n[0]=-s[t-1];const i=Math.ceil((t+1)/2),o=(t+1)/2-1;for(let r=1;r<i;r+=1){const a=r/i*o,c=Math.floor(a),h=Math.ceil(a);e[r]=c===h?s[c]:(1-(a-c))*s[c]+(1-(h-a))*s[h],n[r]=c===h?-s[t-1-c]:-(1-(a-c))*s[t-1-c]-(1-(h-a))*s[t-1-h]}e[i]=t%2==1?s[i-1]:(s[i-2]+s[i-1])/2,h.curve=e,u.curve=n}g=s,m&&(n(g)&&null===_?_=t(o,l):null!==_&&(_(),_=null))},get inputs(){return[l]},get numberOfInputs(){return h.numberOfInputs},get numberOfOutputs(){return h.numberOfOutputs},get oversample(){return h.oversample},set oversample(t){h.oversample=t,u.oversample=t},addEventListener:(...t)=>l.addEventListener(t[0],t[1],t[2]),dispatchEvent:(...t)=>l.dispatchEvent(t[0]),removeEventListener:(...t)=>l.removeEventListener(t[0],t[1],t[2])};null!==r&&(v.curve=r instanceof Float32Array?r:new Float32Array(r)),a!==v.oversample&&(v.oversample=a);return i(Gt(v,d),()=>{l.connect(h).connect(d),l.connect(p).connect(u).connect(f).connect(d),m=!0,n(g)&&(_=t(o,l))},()=>{l.disconnect(h),h.disconnect(d),l.disconnect(p),p.disconnect(u),u.disconnect(f),f.disconnect(d),m=!1,null!==_&&(_(),_=null)})})(tn,At,Qt,ie,As),nn=((t,e,s,n,i,o,r)=>(a,c)=>{const h=a.createWaveShaper();if(null!==o&&"webkitAudioContext"===o.name&&void 0===a.createGain().gain.automationRate)return s(a,c);It(h,c);const u=null===c.curve||c.curve instanceof Float32Array?c.curve:new Float32Array(c.curve);if(null!==u&&u.length<2)throw e();Ft(h,{curve:u},"curve"),Ft(h,c,"oversample");let l=null,p=!1;r(h,"curve",t=>()=>t.call(h),e=>s=>(e.call(h,s),p&&(n(s)&&null===l?l=t(a,h):n(s)||null===l||(l(),l=null)),s));return i(h,()=>{p=!0,n(h.curve)&&(l=t(a,h))},()=>{p=!1,null!==l&&(l(),l=null)})})(tn,At,sn,ie,As,Be,oe),on=((t,e,s,n,i,o,r,a,c)=>(h,{coneInnerAngle:u,coneOuterAngle:l,coneOuterGain:p,distanceModel:d,maxDistance:f,orientationX:_,orientationY:m,orientationZ:g,panningModel:v,positionX:y,positionY:x,positionZ:w,refDistance:b,rolloffFactor:T,...S})=>{const k=h.createPanner();if(S.channelCount>2)throw r();if("max"===S.channelCountMode)throw r();It(k,S);const C={channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete"},A=s(h,{...C,channelInterpretation:"speakers",numberOfInputs:6}),D=n(h,{...S,gain:1}),O=n(h,{...C,gain:1}),M=n(h,{...C,gain:0}),E=n(h,{...C,gain:0}),R=n(h,{...C,gain:0}),q=n(h,{...C,gain:0}),F=n(h,{...C,gain:0}),I=i(h,256,6,1),V=o(h,{...C,curve:new Float32Array([1,1]),oversample:"none"});let N=[_,m,g],P=[y,x,w];I.onaudioprocess=({inputBuffer:t})=>{const e=[t.getChannelData(0)[0],t.getChannelData(1)[0],t.getChannelData(2)[0]];e.some((t,e)=>t!==N[e])&&(k.setOrientation(...e),N=e);const s=[t.getChannelData(3)[0],t.getChannelData(4)[0],t.getChannelData(5)[0]];s.some((t,e)=>t!==P[e])&&(k.setPosition(...s),P=s)},Object.defineProperty(M.gain,"defaultValue",{get:()=>0}),Object.defineProperty(E.gain,"defaultValue",{get:()=>0}),Object.defineProperty(R.gain,"defaultValue",{get:()=>0}),Object.defineProperty(q.gain,"defaultValue",{get:()=>0}),Object.defineProperty(F.gain,"defaultValue",{get:()=>0});const j={get bufferSize(){},get channelCount(){return k.channelCount},set channelCount(t){if(t>2)throw r();D.channelCount=t,k.channelCount=t},get channelCountMode(){return k.channelCountMode},set channelCountMode(t){if("max"===t)throw r();D.channelCountMode=t,k.channelCountMode=t},get channelInterpretation(){return k.channelInterpretation},set channelInterpretation(t){D.channelInterpretation=t,k.channelInterpretation=t},get coneInnerAngle(){return k.coneInnerAngle},set coneInnerAngle(t){k.coneInnerAngle=t},get coneOuterAngle(){return k.coneOuterAngle},set coneOuterAngle(t){k.coneOuterAngle=t},get coneOuterGain(){return k.coneOuterGain},set coneOuterGain(t){if(t<0||t>1)throw e();k.coneOuterGain=t},get context(){return k.context},get distanceModel(){return k.distanceModel},set distanceModel(t){k.distanceModel=t},get inputs(){return[D]},get maxDistance(){return k.maxDistance},set maxDistance(t){if(t<0)throw new RangeError;k.maxDistance=t},get numberOfInputs(){return k.numberOfInputs},get numberOfOutputs(){return k.numberOfOutputs},get orientationX(){return O.gain},get orientationY(){return M.gain},get orientationZ(){return E.gain},get panningModel(){return k.panningModel},set panningModel(t){k.panningModel=t},get positionX(){return R.gain},get positionY(){return q.gain},get positionZ(){return F.gain},get refDistance(){return k.refDistance},set refDistance(t){if(t<0)throw new RangeError;k.refDistance=t},get rolloffFactor(){return k.rolloffFactor},set rolloffFactor(t){if(t<0)throw new RangeError;k.rolloffFactor=t},addEventListener:(...t)=>D.addEventListener(t[0],t[1],t[2]),dispatchEvent:(...t)=>D.dispatchEvent(t[0]),removeEventListener:(...t)=>D.removeEventListener(t[0],t[1],t[2])};u!==j.coneInnerAngle&&(j.coneInnerAngle=u),l!==j.coneOuterAngle&&(j.coneOuterAngle=l),p!==j.coneOuterGain&&(j.coneOuterGain=p),d!==j.distanceModel&&(j.distanceModel=d),f!==j.maxDistance&&(j.maxDistance=f),_!==j.orientationX.value&&(j.orientationX.value=_),m!==j.orientationY.value&&(j.orientationY.value=m),g!==j.orientationZ.value&&(j.orientationZ.value=g),v!==j.panningModel&&(j.panningModel=v),y!==j.positionX.value&&(j.positionX.value=y),x!==j.positionY.value&&(j.positionY.value=x),w!==j.positionZ.value&&(j.positionZ.value=w),b!==j.refDistance&&(j.refDistance=b),T!==j.rolloffFactor&&(j.rolloffFactor=T),1===N[0]&&0===N[1]&&0===N[2]||k.setOrientation(...N),0===P[0]&&0===P[1]&&0===P[2]||k.setPosition(...P);return c(Gt(j,k),()=>{D.connect(k),t(D,V,0,0),V.connect(O).connect(A,0,0),V.connect(M).connect(A,0,1),V.connect(E).connect(A,0,2),V.connect(R).connect(A,0,3),V.connect(q).connect(A,0,4),V.connect(F).connect(A,0,5),A.connect(I).connect(h.destination)},()=>{D.disconnect(k),a(D,V,0,0),V.disconnect(O),O.disconnect(A),V.disconnect(M),M.disconnect(A),V.disconnect(E),E.disconnect(A),V.disconnect(R),R.disconnect(A),V.disconnect(q),q.disconnect(A),V.disconnect(F),F.disconnect(A),A.disconnect(I),I.disconnect(h.destination)})})($,At,Es,Qt,Yt,nn,Ht,et,As),rn=(an=on,(t,e)=>{const s=t.createPanner();return void 0===s.orientationX?an(t,e):(It(s,e),Nt(s,e,"orientationX"),Nt(s,e,"orientationY"),Nt(s,e,"orientationZ"),Nt(s,e,"positionX"),Nt(s,e,"positionY"),Nt(s,e,"positionZ"),Ft(s,e,"coneInnerAngle"),Ft(s,e,"coneOuterAngle"),Ft(s,e,"coneOuterGain"),Ft(s,e,"distanceModel"),Ft(s,e,"maxDistance"),Ft(s,e,"panningModel"),Ft(s,e,"refDistance"),Ft(s,e,"rolloffFactor"),s)});var an;const cn=((t,e,s,n,i,o,r)=>class extends t{constructor(t,a){const c=i(t),h={...Kt,...a},u=s(c,h),l=o(c);super(t,!1,u,l?n():null),this._nativePannerNode=u,this._orientationX=e(this,l,u.orientationX,N,V),this._orientationY=e(this,l,u.orientationY,N,V),this._orientationZ=e(this,l,u.orientationZ,N,V),this._positionX=e(this,l,u.positionX,N,V),this._positionY=e(this,l,u.positionY,N,V),this._positionZ=e(this,l,u.positionZ,N,V),r(this,1)}get coneInnerAngle(){return this._nativePannerNode.coneInnerAngle}set coneInnerAngle(t){this._nativePannerNode.coneInnerAngle=t}get coneOuterAngle(){return this._nativePannerNode.coneOuterAngle}set coneOuterAngle(t){this._nativePannerNode.coneOuterAngle=t}get coneOuterGain(){return this._nativePannerNode.coneOuterGain}set coneOuterGain(t){this._nativePannerNode.coneOuterGain=t}get distanceModel(){return this._nativePannerNode.distanceModel}set distanceModel(t){this._nativePannerNode.distanceModel=t}get maxDistance(){return this._nativePannerNode.maxDistance}set maxDistance(t){this._nativePannerNode.maxDistance=t}get orientationX(){return this._orientationX}get orientationY(){return this._orientationY}get orientationZ(){return this._orientationZ}get panningModel(){return this._nativePannerNode.panningModel}set panningModel(t){this._nativePannerNode.panningModel=t}get positionX(){return this._positionX}get positionY(){return this._positionY}get positionZ(){return this._positionZ}get refDistance(){return this._nativePannerNode.refDistance}set refDistance(t){this._nativePannerNode.refDistance=t}get rolloffFactor(){return this._nativePannerNode.rolloffFactor}set rolloffFactor(t){this._nativePannerNode.rolloffFactor=t}})(Ze,ps,rn,((t,e,s,n,i,o,r,a,c,h)=>()=>{const u=new WeakMap;let l=null;return{render(p,d,f){const _=u.get(d);return void 0!==_?Promise.resolve(_):(async(p,d,f)=>{let _=null,m=o(p);const g={channelCount:m.channelCount,channelCountMode:m.channelCountMode,channelInterpretation:m.channelInterpretation},v={...g,coneInnerAngle:m.coneInnerAngle,coneOuterAngle:m.coneOuterAngle,coneOuterGain:m.coneOuterGain,distanceModel:m.distanceModel,maxDistance:m.maxDistance,panningModel:m.panningModel,refDistance:m.refDistance,rolloffFactor:m.rolloffFactor},y=E(m,d);if("bufferSize"in m)_=n(d,{...g,gain:1});else if(!y){const t={...v,orientationX:m.orientationX.value,orientationY:m.orientationY.value,orientationZ:m.orientationZ.value,positionX:m.positionX.value,positionY:m.positionY.value,positionZ:m.positionZ.value};m=i(d,t)}if(u.set(d,null===_?m:_),null!==_){if(null===l){if(null===r)throw new Error("Missing the native OfflineAudioContext constructor.");const t=new r(6,p.context.length,d.sampleRate),n=e(t,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:6});n.connect(t.destination),l=(async()=>{const e=await Promise.all([p.orientationX,p.orientationY,p.orientationZ,p.positionX,p.positionY,p.positionZ].map(async(e,n)=>{const i=s(t,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:0===n?1:0});return await a(t,e,i.offset,f),i}));for(let t=0;t<6;t+=1)e[t].connect(n,0,t),e[t].start(0);return h(t)})()}const t=await l,o=n(d,{...g,gain:1});await c(p,d,o,f);const u=[];for(let e=0;e<t.numberOfChannels;e+=1)u.push(t.getChannelData(e));let m=[u[0][0],u[1][0],u[2][0]],y=[u[3][0],u[4][0],u[5][0]],x=n(d,{...g,gain:1}),w=i(d,{...v,orientationX:m[0],orientationY:m[1],orientationZ:m[2],positionX:y[0],positionY:y[1],positionZ:y[2]});o.connect(x).connect(w.inputs[0]),w.connect(_);for(let e=128;e<t.length;e+=128){const t=[u[0][e],u[1][e],u[2][e]],s=[u[3][e],u[4][e],u[5][e]];if(t.some((t,e)=>t!==m[e])||s.some((t,e)=>t!==y[e])){m=t,y=s;const r=e/d.sampleRate;x.gain.setValueAtTime(0,r),x=n(d,{...g,gain:0}),w=i(d,{...v,orientationX:m[0],orientationY:m[1],orientationZ:m[2],positionX:y[0],positionY:y[1],positionZ:y[2]}),x.gain.setValueAtTime(1,r),o.connect(x).connect(w.inputs[0]),w.connect(_)}}return _}return y?(await t(d,p.orientationX,m.orientationX,f),await t(d,p.orientationY,m.orientationY,f),await t(d,p.orientationZ,m.orientationZ,f),await t(d,p.positionX,m.positionX,f),await t(d,p.positionY,m.positionY,f),await t(d,p.positionZ,m.positionZ,f)):(await a(d,p.orientationX,m.orientationX,f),await a(d,p.orientationY,m.orientationY,f),await a(d,p.orientationZ,m.orientationZ,f),await a(d,p.positionX,m.positionX,f),await a(d,p.positionY,m.positionY,f),await a(d,p.positionZ,m.positionZ,f)),H(m)?await c(p,d,m.inputs[0],f):await c(p,d,m,f),m})(p,d,f)}}})(as,Es,Is,Qt,rn,st,Ve,us,Oe,Us),Fe,Ne,gs),hn=((t,e,s,n)=>class i{constructor(i,o){const r=e(i),a=n({...te,...o}),c=t(r,a);return s.add(c),c}static[Symbol.hasInstance](t){return null!==t&&"object"==typeof t&&Object.getPrototypeOf(t)===i.prototype||s.has(t)}})((t=>(e,{disableNormalization:s,imag:n,real:i})=>{const o=n instanceof Float32Array?n:new Float32Array(n),r=i instanceof Float32Array?i:new Float32Array(i),a=e.createPeriodicWave(r,o,{disableNormalization:s});if(Array.from(n).length<2)throw t();return a})(q),Fe,new WeakSet,t=>{const{imag:e,real:s}=t;return void 0===e?void 0===s?{...t,imag:[0,0],real:[0,0]}:{...t,imag:Array.from(s,()=>0),real:s}:void 0===s?{...t,imag:e,real:Array.from(e,()=>0)}:{...t,imag:e,real:s}}),un=((t,e)=>(s,n)=>{const i=n.channelCountMode;if("clamped-max"===i)throw e();if(void 0===s.createStereoPanner)return t(s,n);const o=s.createStereoPanner();return It(o,n),Nt(o,n,"pan"),Object.defineProperty(o,"channelCountMode",{get:()=>i,set:t=>{if(t!==i)throw e()}}),o})(((t,e,s,n,i,o)=>{const r=new Float32Array([1,1]),a=Math.PI/2,c={channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete"},h={...c,oversample:"none"},u=(t,o,u,l,p)=>{if(1===o)return((t,e,i,o)=>{const u=new Float32Array(16385),l=new Float32Array(16385);for(let t=0;t<16385;t+=1){const e=t/16384*a;u[t]=Math.cos(e),l[t]=Math.sin(e)}const p=s(t,{...c,gain:0}),d=n(t,{...h,curve:u}),f=n(t,{...h,curve:r}),_=s(t,{...c,gain:0}),m=n(t,{...h,curve:l});return{connectGraph(){e.connect(p),e.connect(void 0===f.inputs?f:f.inputs[0]),e.connect(_),f.connect(i),i.connect(void 0===d.inputs?d:d.inputs[0]),i.connect(void 0===m.inputs?m:m.inputs[0]),d.connect(p.gain),m.connect(_.gain),p.connect(o,0,0),_.connect(o,0,1)},disconnectGraph(){e.disconnect(p),e.disconnect(void 0===f.inputs?f:f.inputs[0]),e.disconnect(_),f.disconnect(i),i.disconnect(void 0===d.inputs?d:d.inputs[0]),i.disconnect(void 0===m.inputs?m:m.inputs[0]),d.disconnect(p.gain),m.disconnect(_.gain),p.disconnect(o,0,0),_.disconnect(o,0,1)}}})(t,u,l,p);if(2===o)return((t,i,o,u)=>{const l=new Float32Array(16385),p=new Float32Array(16385),d=new Float32Array(16385),f=new Float32Array(16385),_=Math.floor(8192.5);for(let t=0;t<16385;t+=1)if(t>_){const e=(t-_)/(16384-_)*a;l[t]=Math.cos(e),p[t]=Math.sin(e),d[t]=0,f[t]=1}else{const e=t/(16384-_)*a;l[t]=1,p[t]=0,d[t]=Math.cos(e),f[t]=Math.sin(e)}const m=e(t,{channelCount:2,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:2}),g=s(t,{...c,gain:0}),v=n(t,{...h,curve:l}),y=s(t,{...c,gain:0}),x=n(t,{...h,curve:p}),w=n(t,{...h,curve:r}),b=s(t,{...c,gain:0}),T=n(t,{...h,curve:d}),S=s(t,{...c,gain:0}),k=n(t,{...h,curve:f});return{connectGraph(){i.connect(m),i.connect(void 0===w.inputs?w:w.inputs[0]),m.connect(g,0),m.connect(y,0),m.connect(b,1),m.connect(S,1),w.connect(o),o.connect(void 0===v.inputs?v:v.inputs[0]),o.connect(void 0===x.inputs?x:x.inputs[0]),o.connect(void 0===T.inputs?T:T.inputs[0]),o.connect(void 0===k.inputs?k:k.inputs[0]),v.connect(g.gain),x.connect(y.gain),T.connect(b.gain),k.connect(S.gain),g.connect(u,0,0),b.connect(u,0,0),y.connect(u,0,1),S.connect(u,0,1)},disconnectGraph(){i.disconnect(m),i.disconnect(void 0===w.inputs?w:w.inputs[0]),m.disconnect(g,0),m.disconnect(y,0),m.disconnect(b,1),m.disconnect(S,1),w.disconnect(o),o.disconnect(void 0===v.inputs?v:v.inputs[0]),o.disconnect(void 0===x.inputs?x:x.inputs[0]),o.disconnect(void 0===T.inputs?T:T.inputs[0]),o.disconnect(void 0===k.inputs?k:k.inputs[0]),v.disconnect(g.gain),x.disconnect(y.gain),T.disconnect(b.gain),k.disconnect(S.gain),g.disconnect(u,0,0),b.disconnect(u,0,0),y.disconnect(u,0,1),S.disconnect(u,0,1)}}})(t,u,l,p);throw i()};return(e,{channelCount:n,channelCountMode:r,pan:a,...c})=>{if("max"===r)throw i();const h=t(e,{...c,channelCount:1,channelCountMode:r,numberOfInputs:2}),l=s(e,{...c,channelCount:n,channelCountMode:r,gain:1}),p=s(e,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:a});let{connectGraph:d,disconnectGraph:f}=u(e,n,l,p,h);Object.defineProperty(p.gain,"defaultValue",{get:()=>0}),Object.defineProperty(p.gain,"maxValue",{get:()=>1}),Object.defineProperty(p.gain,"minValue",{get:()=>-1});const _={get bufferSize(){},get channelCount(){return l.channelCount},set channelCount(t){l.channelCount!==t&&(m&&f(),({connectGraph:d,disconnectGraph:f}=u(e,t,l,p,h)),m&&d()),l.channelCount=t},get channelCountMode(){return l.channelCountMode},set channelCountMode(t){if("clamped-max"===t||"max"===t)throw i();l.channelCountMode=t},get channelInterpretation(){return l.channelInterpretation},set channelInterpretation(t){l.channelInterpretation=t},get context(){return l.context},get inputs(){return[l]},get numberOfInputs(){return l.numberOfInputs},get numberOfOutputs(){return l.numberOfOutputs},get pan(){return p.gain},addEventListener:(...t)=>l.addEventListener(t[0],t[1],t[2]),dispatchEvent:(...t)=>l.dispatchEvent(t[0]),removeEventListener:(...t)=>l.removeEventListener(t[0],t[1],t[2])};let m=!1;return o(Gt(_,h),()=>{d(),m=!0},()=>{f(),m=!1})}})(Es,Wt,Qt,nn,Ht,As),Ht),ln=((t,e,s,n,i,o)=>class extends t{constructor(t,r){const a=i(t),c={...ee,...r},h=s(a,c),u=o(a);super(t,!1,h,u?n():null),this._pan=e(this,u,h.pan)}get pan(){return this._pan}})(Ze,ps,un,((t,e,s,n,i)=>()=>{const o=new WeakMap;return{render(r,a,c){const h=o.get(a);return void 0!==h?Promise.resolve(h):(async(r,a,c)=>{let h=s(r);const u=E(h,a);if(!u){const t={channelCount:h.channelCount,channelCountMode:h.channelCountMode,channelInterpretation:h.channelInterpretation,pan:h.pan.value};h=e(a,t)}return o.set(a,h),u?await t(a,r.pan,h.pan,c):await n(a,r.pan,h.pan,c),H(h)?await i(r,a,h.inputs[0],c):await i(r,a,h,c),h})(r,a,c)}}})(as,un,st,us,Oe),Fe,Ne),pn=((t,e,s)=>()=>{const n=new WeakMap;return{render(i,o,r){const a=n.get(o);return void 0!==a?Promise.resolve(a):(async(i,o,r)=>{let a=e(i);if(!E(a,o)){const e={channelCount:a.channelCount,channelCountMode:a.channelCountMode,channelInterpretation:a.channelInterpretation,curve:a.curve,oversample:a.oversample};a=t(o,e)}return n.set(o,a),H(a)?await s(i,o,a.inputs[0],r):await s(i,o,a,r),a})(i,o,r)}}})(nn,st,Oe),dn=((t,e,s,n,i,o,r)=>class extends t{constructor(t,e){const a=i(t),c={...ne,...e},h=s(a,c);super(t,!0,h,o(a)?n():null),this._isCurveNullified=!1,this._nativeWaveShaperNode=h,r(this,1)}get curve(){return this._isCurveNullified?null:this._nativeWaveShaperNode.curve}set curve(t){if(null===t)this._isCurveNullified=!0,this._nativeWaveShaperNode.curve=new Float32Array([0,0]);else{if(t.length<2)throw e();this._isCurveNullified=!1,this._nativeWaveShaperNode.curve=t}}get oversample(){return this._nativeWaveShaperNode.oversample}set oversample(t){this._nativeWaveShaperNode.oversample=t}})(Ze,At,nn,pn,Fe,Ne,gs),fn=(t=>null!==t&&t.isSecureContext)(Te),_n=(t=>(e,s,n)=>{Object.defineProperties(t,{currentFrame:{configurable:!0,get:()=>Math.round(e*s)},currentTime:{configurable:!0,get:()=>e}});try{return n()}finally{null!==t&&(delete t.currentFrame,delete t.currentTime)}})(Te),mn=new WeakMap,gn=((t,e)=>s=>{let n=t.get(s);if(void 0!==n)return n;if(null===e)throw new Error("Missing the native OfflineAudioContext constructor.");return n=new e(1,1,8e3),t.set(s,n),n})(mn,Ve),vn=(t=>null===t?null:t.hasOwnProperty("AudioWorkletNode")?t.AudioWorkletNode:null)(Te),yn=fn?((t,e,s,n,i,o,r,a,c,h,u,l)=>(p,d,f={credentials:"omit"})=>{const m=o(p);if(void 0!==m.audioWorklet)return Promise.all([i(d),Promise.resolve(t(u,u))]).then(([[t,e],s])=>{const[n,i]=y(t,e),o=s?i:i.replace(/\s+extends\s+AudioWorkletProcessor\s*{/," extends (class extends AudioWorkletProcessor {__b=new WeakSet();constructor(){super();(p=>p.postMessage=(q=>(m,t)=>q.call(p,m,t?t.filter(u=>!this.__b.has(u)):t))(p.postMessage))(this.port)}}){"),c=new Blob([`${n};(registerProcessor=>{${o}\n})((n,p)=>registerProcessor(n,class extends p{${s?"":"__c = (a) => a.forEach(e=>this.__b.add(e.buffer));"}process(i,o,p){${s?"":"i.forEach(this.__c);o.forEach(this.__c);this.__c(Object.values(p));"}return super.process(i.map(j=>j.some(k=>k.length===0)?[]:j),o,p)}}))`],{type:"application/javascript; charset=utf-8"}),h=URL.createObjectURL(c);return m.audioWorklet.addModule(h,f).then(()=>{if(a(m))return;return r(m).audioWorklet.addModule(h,f)}).finally(()=>URL.revokeObjectURL(h))});const g=h.get(p);if(void 0!==g&&g.has(d))return Promise.resolve();const v=c.get(p);if(void 0!==v){const t=v.get(d);if(void 0!==t)return t}const b=i(d).then(([t,e])=>{const[n,i]=y(t,e);return s(`${n};((a,b)=>{(a[b]=a[b]||[]).push((AudioWorkletProcessor,global,registerProcessor,sampleRate,self,window)=>{${i}\n})})(window,'_AWGS')`)}).then(()=>{const t=l._AWGS.pop();if(void 0===t)throw new SyntaxError;n(m.currentTime,m.sampleRate,()=>t(class{},void 0,(t,s)=>{if(""===t.trim())throw e();const n=_.get(m);if(void 0!==n){if(n.has(t))throw e();w(s),x(s.parameterDescriptors),n.set(t,s)}else w(s),x(s.parameterDescriptors),_.set(m,new Map([[t,s]]))},m.sampleRate,void 0,void 0))});return void 0===v?c.set(p,new Map([[d,b]])):v.set(d,b),b.then(()=>{const t=h.get(p);void 0===t?h.set(p,new Set([d])):t.add(d)}).finally(()=>{const t=c.get(p);void 0!==t&&t.delete(d)}),b})(xe,Ht,(t=>e=>new Promise((s,n)=>{if(null===t)return void n(new SyntaxError);const i=t.document.head;if(null===i)n(new SyntaxError);else{const o=t.document.createElement("script"),r=new Blob([e],{type:"application/javascript"}),a=URL.createObjectURL(r),c=t.onerror,h=()=>{t.onerror=c,URL.revokeObjectURL(a)};t.onerror=(e,s,i,o,r)=>s===a||s===t.location.href&&1===i&&1===o?(h(),n(r),!1):null!==c?c(e,s,i,o,r):void 0,o.onerror=()=>{h(),n(new SyntaxError)},o.onload=()=>{h(),s()},o.src=a,o.type="module",i.appendChild(o)}}))(Te),_n,(t=>async e=>{try{const t=await fetch(e);if(t.ok)return[await t.text(),t.url]}catch{}throw t()})(()=>new DOMException("","AbortError")),Fe,gn,Ne,new WeakMap,new WeakMap,((t,e)=>async()=>{if(null===t)return!0;if(null===e)return!1;const s=new Blob(['class A extends AudioWorkletProcessor{process(i){this.port.postMessage(i,[i[0][0].buffer])}}registerProcessor("a",A)'],{type:"application/javascript; charset=utf-8"}),n=new e(1,128,8e3),i=URL.createObjectURL(s);let o=!1,r=!1;try{await n.audioWorklet.addModule(i);const e=new t(n,"a",{numberOfOutputs:0}),s=n.createOscillator();e.port.onmessage=()=>o=!0,e.onprocessorerror=()=>r=!0,s.connect(e),await n.startRendering()}catch{}finally{URL.revokeObjectURL(i)}return o&&!r})(vn,Ve),Te):void 0,xn=((t,e)=>s=>t(s)||e(s))(We,Ne),wn=((t,e,s,n,i,o,r,a,c,h,u,l,p,d,f,_,m,g,v,y)=>class extends f{constructor(e,s){super(e,s),this._nativeContext=e,this._audioWorklet=void 0===t?void 0:{addModule:(e,s)=>t(this,e,s)}}get audioWorklet(){return this._audioWorklet}createAnalyser(){return new e(this)}createBiquadFilter(){return new i(this)}createBuffer(t,e,n){return new s({length:e,numberOfChannels:t,sampleRate:n})}createBufferSource(){return new n(this)}createChannelMerger(t=6){return new o(this,{numberOfInputs:t})}createChannelSplitter(t=6){return new r(this,{numberOfOutputs:t})}createConstantSource(){return new a(this)}createConvolver(){return new c(this)}createDelay(t=1){return new u(this,{maxDelayTime:t})}createDynamicsCompressor(){return new l(this)}createGain(){return new p(this)}createIIRFilter(t,e){return new d(this,{feedback:e,feedforward:t})}createOscillator(){return new _(this)}createPanner(){return new m(this)}createPeriodicWave(t,e,s={disableNormalization:!1}){return new g(this,{...s,imag:e,real:t})}createStereoPanner(){return new v(this)}createWaveShaper(){return new y(this)}decodeAudioData(t,e,s){return h(this._nativeContext,t).then(t=>("function"==typeof e&&e(t),t)).catch(t=>{throw"function"==typeof s&&s(t),t})}})(yn,Ye,ss,fs,vs,Rs,qs,Vs,Ps,((t,e,s,n,i,o,r,a,c,h,u)=>(l,p)=>{const d=r(l)?l:o(l);if(i.has(p)){const t=s();return Promise.reject(t)}try{i.add(p)}catch{}return e(c,()=>c(d))?d.decodeAudioData(p).then(s=>(e(a,()=>a(s))||u(s),t.add(s),s)):new Promise((e,s)=>{const i=()=>{try{(t=>{const{port1:e}=new MessageChannel;e.postMessage(t,[t])})(p)}catch{}},o=t=>{s(t),i()};try{d.decodeAudioData(p,s=>{"function"!=typeof s.copyFromChannel&&(h(s),F(s)),t.add(s),i(),e(s)},t=>{o(null===t?n():t)})}catch(t){o(t)}})})(He,xe,()=>new DOMException("","DataCloneError"),()=>new DOMException("","EncodingError"),new WeakSet,Fe,xn,R,Rt,ts,es),js,Bs,Ws,Xs,$s,Ks,cn,hn,ln,dn),bn=((t,e,s,n)=>class extends t{constructor(t,i){const o=s(t),r=e(o,i);if(n(o))throw TypeError();super(t,!0,r,null),this._nativeMediaElementAudioSourceNode=r}get mediaElement(){return this._nativeMediaElementAudioSourceNode.mediaElement}})(Ze,(t,e)=>t.createMediaElementSource(e.mediaElement),Fe,Ne),Tn=((t,e,s,n)=>class extends t{constructor(t,i){const o=s(t);if(n(o))throw new TypeError;const r={...Et,...i},a=e(o,r);super(t,!1,a,null),this._nativeMediaStreamAudioDestinationNode=a}get stream(){return this._nativeMediaStreamAudioDestinationNode.stream}})(Ze,(t,e)=>{const s=t.createMediaStreamDestination();return It(s,e),1===s.numberOfOutputs&&Object.defineProperty(s,"numberOfOutputs",{get:()=>0}),s},Fe,Ne),Sn=((t,e,s,n)=>class extends t{constructor(t,i){const o=s(t),r=e(o,i);if(n(o))throw new TypeError;super(t,!0,r,null),this._nativeMediaStreamAudioSourceNode=r}get mediaStream(){return this._nativeMediaStreamAudioSourceNode.mediaStream}})(Ze,(t,{mediaStream:e})=>{const s=e.getAudioTracks();s.sort((t,e)=>t.id<e.id?-1:t.id>e.id?1:0);const n=s.slice(0,1),i=t.createMediaStreamSource(new MediaStream(n));return Object.defineProperty(i,"mediaStream",{value:e}),i},Fe,Ne),kn=((t,e,s)=>class extends t{constructor(t,n){const i=s(t);super(t,!0,e(i,n),null)}})(Ze,((t,e)=>(s,{mediaStreamTrack:n})=>{if("function"==typeof s.createMediaStreamTrackSource)return s.createMediaStreamTrackSource(n);const i=new MediaStream([n]),o=s.createMediaStreamSource(i);if("audio"!==n.kind)throw t();if(e(s))throw new TypeError;return o})(At,Ne),Fe),Cn=((t,e,s,n,i,o,r,a,c)=>class extends t{constructor(t={}){if(null===c)throw new Error("Missing the native AudioContext constructor.");const e=new c(t);if(null===e)throw n();if(!G(t.latencyHint))throw new TypeError(`The provided value '${t.latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`);if(void 0!==t.sampleRate&&e.sampleRate!==t.sampleRate)throw s();super(e,2);const{latencyHint:i}=t,{sampleRate:o}=e;if(this._baseLatency="number"==typeof e.baseLatency?e.baseLatency:"balanced"===i?512/o:"interactive"===i||void 0===i?256/o:"playback"===i?1024/o:128*Math.max(2,Math.min(128,Math.round(i*o/128)))/o,this._nativeAudioContext=e,"webkitAudioContext"===c.name?(this._nativeGainNode=e.createGain(),this._nativeOscillatorNode=e.createOscillator(),this._nativeGainNode.gain.value=1e-37,this._nativeOscillatorNode.connect(this._nativeGainNode).connect(e.destination),this._nativeOscillatorNode.start()):(this._nativeGainNode=null,this._nativeOscillatorNode=null),this._state=null,"running"===e.state){this._state="suspended";const t=()=>{"suspended"===this._state&&(this._state=null),e.removeEventListener("statechange",t)};e.addEventListener("statechange",t)}}get baseLatency(){return this._baseLatency}get state(){return null!==this._state?this._state:this._nativeAudioContext.state}close(){return"closed"===this.state?this._nativeAudioContext.close().then(()=>{throw e()}):("suspended"===this._state&&(this._state=null),this._nativeAudioContext.close().then(()=>{null!==this._nativeGainNode&&null!==this._nativeOscillatorNode&&(this._nativeOscillatorNode.stop(),this._nativeGainNode.disconnect(),this._nativeOscillatorNode.disconnect()),W(this)}))}createMediaElementSource(t){return new i(this,{mediaElement:t})}createMediaStreamDestination(){return new o(this)}createMediaStreamSource(t){return new r(this,{mediaStream:t})}createMediaStreamTrackSource(t){return new a(this,{mediaStreamTrack:t})}resume(){return"suspended"===this._state?new Promise((t,e)=>{const s=()=>{this._nativeAudioContext.removeEventListener("statechange",s),"running"===this._nativeAudioContext.state?t():this.resume().then(t,e)};this._nativeAudioContext.addEventListener("statechange",s)}):this._nativeAudioContext.resume().catch(t=>{if(void 0===t||15===t.code)throw e();throw t})}suspend(){return this._nativeAudioContext.suspend().catch(t=>{if(void 0===t)throw e();throw t})}})(wn,At,Ht,se,bn,Tn,Sn,kn,Be),An=(Dn=Hs,t=>{const e=Dn.get(t);if(void 0===e)throw new Error("The context has no set of AudioWorkletNodes.");return e});var Dn;const On=(Mn=An,(t,e)=>{Mn(t).add(e)});var Mn;const En=(t=>(e,s,n=0,i=0)=>{const o=e[n];if(void 0===o)throw t();return ct(s)?o.connect(s,0,i):o.connect(s,0)})(q),Rn=(t=>(e,s)=>{t(e).delete(s)})(An),qn=(t=>(e,s,n,i=0)=>void 0===s?e.forEach(t=>t.disconnect()):"number"==typeof s?St(t,e,s).disconnect():ct(s)?void 0===n?e.forEach(t=>t.disconnect(s)):void 0===i?St(t,e,n).disconnect(s,0):St(t,e,n).disconnect(s,0,i):void 0===n?e.forEach(t=>t.disconnect(s)):St(t,e,n).disconnect(s,0))(q),Fn=new WeakMap,In=((t,e)=>s=>e(t,s))(Fn,b),Vn=((t,e,s,n,i,o,r,a,c,h,u,l,p)=>(d,f,_,g)=>{if(0===g.numberOfInputs&&0===g.numberOfOutputs)throw c();const v=Array.isArray(g.outputChannelCount)?g.outputChannelCount:Array.from(g.outputChannelCount);if(v.some(t=>t<1))throw c();if(v.length!==g.numberOfOutputs)throw e();if("explicit"!==g.channelCountMode)throw c();const y=g.channelCount*g.numberOfInputs,x=v.reduce((t,e)=>t+e,0),w=void 0===_.parameterDescriptors?0:_.parameterDescriptors.length;if(y+w>6||x>6)throw c();const b=new MessageChannel,T=[],S=[];for(let t=0;t<g.numberOfInputs;t+=1)T.push(r(d,{channelCount:g.channelCount,channelCountMode:g.channelCountMode,channelInterpretation:g.channelInterpretation,gain:1})),S.push(i(d,{channelCount:g.channelCount,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:g.channelCount}));const k=[];if(void 0!==_.parameterDescriptors)for(const{defaultValue:t,maxValue:e,minValue:s,name:n}of _.parameterDescriptors){const i=o(d,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:void 0!==g.parameterData[n]?g.parameterData[n]:void 0===t?0:t});Object.defineProperties(i.offset,{defaultValue:{get:()=>void 0===t?0:t},maxValue:{get:()=>void 0===e?N:e},minValue:{get:()=>void 0===s?V:s}}),k.push(i)}const C=n(d,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:Math.max(1,y+w)}),A=Lt(f,d.sampleRate),D=a(d,A,y+w,Math.max(1,x)),O=i(d,{channelCount:Math.max(1,x),channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:Math.max(1,x)}),M=[];for(let t=0;t<g.numberOfOutputs;t+=1)M.push(n(d,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:v[t]}));for(let t=0;t<g.numberOfInputs;t+=1){T[t].connect(S[t]);for(let e=0;e<g.channelCount;e+=1)S[t].connect(C,e,t*g.channelCount+e)}const E=new pt(void 0===_.parameterDescriptors?[]:_.parameterDescriptors.map(({name:t},e)=>{const s=k[e];return s.connect(C,0,y+e),s.start(0),[t,s.offset]}));C.connect(D);let R=g.channelInterpretation,q=null;const F=0===g.numberOfOutputs?[D]:M,I={get bufferSize(){return A},get channelCount(){return g.channelCount},set channelCount(t){throw s()},get channelCountMode(){return g.channelCountMode},set channelCountMode(t){throw s()},get channelInterpretation(){return R},set channelInterpretation(t){for(const e of T)e.channelInterpretation=t;R=t},get context(){return D.context},get inputs(){return T},get numberOfInputs(){return g.numberOfInputs},get numberOfOutputs(){return g.numberOfOutputs},get onprocessorerror(){return q},set onprocessorerror(t){"function"==typeof q&&I.removeEventListener("processorerror",q),q="function"==typeof t?t:null,"function"==typeof q&&I.addEventListener("processorerror",q)},get parameters(){return E},get port(){return b.port2},addEventListener:(...t)=>D.addEventListener(t[0],t[1],t[2]),connect:t.bind(null,F),disconnect:h.bind(null,F),dispatchEvent:(...t)=>D.dispatchEvent(t[0]),removeEventListener:(...t)=>D.removeEventListener(t[0],t[1],t[2])},P=new Map;var j,L;b.port1.addEventListener=(j=b.port1.addEventListener,(...t)=>{if("message"===t[0]){const e="function"==typeof t[1]?t[1]:"object"==typeof t[1]&&null!==t[1]&&"function"==typeof t[1].handleEvent?t[1].handleEvent:null;if(null!==e){const s=P.get(t[1]);void 0!==s?t[1]=s:(t[1]=t=>{u(d.currentTime,d.sampleRate,()=>e(t))},P.set(e,t[1]))}}return j.call(b.port1,t[0],t[1],t[2])}),b.port1.removeEventListener=(L=b.port1.removeEventListener,(...t)=>{if("message"===t[0]){const e=P.get(t[1]);void 0!==e&&(P.delete(t[1]),t[1]=e)}return L.call(b.port1,t[0],t[1],t[2])});let z=null;Object.defineProperty(b.port1,"onmessage",{get:()=>z,set:t=>{"function"==typeof z&&b.port1.removeEventListener("message",z),z="function"==typeof t?t:null,"function"==typeof z&&(b.port1.addEventListener("message",z),b.port1.start())}}),_.prototype.port=b.port1;let B=null;((t,e,s,n)=>{let i=m.get(t);void 0===i&&(i=new WeakMap,m.set(t,i));const o=zt(s,n);return i.set(e,o),o})(d,I,_,g).then(t=>B=t);const W=mt(g.numberOfInputs,g.channelCount),G=mt(g.numberOfOutputs,v),U=void 0===_.parameterDescriptors?[]:_.parameterDescriptors.reduce((t,{name:e})=>({...t,[e]:new Float32Array(128)}),{});let Q=!0;const Z=()=>{g.numberOfOutputs>0&&D.disconnect(O);for(let t=0,e=0;t<g.numberOfOutputs;t+=1){const s=M[t];for(let n=0;n<v[t];n+=1)O.disconnect(s,e+n,n);e+=v[t]}},X=new Map;D.onaudioprocess=({inputBuffer:t,outputBuffer:e})=>{if(null!==B){const s=l(I);for(let n=0;n<A;n+=128){for(let e=0;e<g.numberOfInputs;e+=1)for(let s=0;s<g.channelCount;s+=1)ft(t,W[e],s,s,n);void 0!==_.parameterDescriptors&&_.parameterDescriptors.forEach(({name:e},s)=>{ft(t,U,e,y+s,n)});for(let t=0;t<g.numberOfInputs;t+=1)for(let e=0;e<v[t];e+=1)0===G[t][e].byteLength&&(G[t][e]=new Float32Array(128));try{const t=W.map((t,e)=>{if(s[e].size>0)return X.set(e,A/128),t;const n=X.get(e);return void 0===n?[]:(t.every(t=>t.every(t=>0===t))&&(1===n?X.delete(e):X.set(e,n-1)),t)}),i=u(d.currentTime+n/d.sampleRate,d.sampleRate,()=>B.process(t,G,U));Q=i;for(let t=0,s=0;t<g.numberOfOutputs;t+=1){for(let i=0;i<v[t];i+=1)_t(e,G[t],i,s+i,n);s+=v[t]}}catch(t){Q=!1,I.dispatchEvent(new ErrorEvent("processorerror",{colno:t.colno,filename:t.filename,lineno:t.lineno,message:t.message}))}if(!Q){for(let t=0;t<g.numberOfInputs;t+=1){T[t].disconnect(S[t]);for(let e=0;e<g.channelCount;e+=1)S[n].disconnect(C,e,t*g.channelCount+e)}if(void 0!==_.parameterDescriptors){const t=_.parameterDescriptors.length;for(let e=0;e<t;e+=1){const t=k[e];t.disconnect(C,0,y+e),t.stop()}}C.disconnect(D),D.onaudioprocess=null,Y?Z():J();break}}}};let Y=!1;const H=r(d,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0}),$=()=>D.connect(H).connect(d.destination),J=()=>{D.disconnect(H),H.disconnect()};return $(),p(I,()=>{if(Q){J(),g.numberOfOutputs>0&&D.connect(O);for(let t=0,e=0;t<g.numberOfOutputs;t+=1){const s=M[t];for(let n=0;n<v[t];n+=1)O.connect(s,e+n,n);e+=v[t]}}Y=!0},()=>{Q&&($(),Z()),Y=!1})})(En,q,At,Es,Wt,Is,Qt,Yt,Ht,qn,_n,In,As),Nn=((t,e,s,n,i)=>(o,r,a,c,h,u)=>{if(null!==a)try{const e=new a(o,c,u),n=new Map;let r=null;if(Object.defineProperties(e,{channelCount:{get:()=>u.channelCount,set:()=>{throw t()}},channelCountMode:{get:()=>"explicit",set:()=>{throw t()}},onprocessorerror:{get:()=>r,set:t=>{"function"==typeof r&&e.removeEventListener("processorerror",r),r="function"==typeof t?t:null,"function"==typeof r&&e.addEventListener("processorerror",r)}}}),e.addEventListener=(p=e.addEventListener,(...t)=>{if("processorerror"===t[0]){const e="function"==typeof t[1]?t[1]:"object"==typeof t[1]&&null!==t[1]&&"function"==typeof t[1].handleEvent?t[1].handleEvent:null;if(null!==e){const s=n.get(t[1]);void 0!==s?t[1]=s:(t[1]=s=>{"error"===s.type?(Object.defineProperties(s,{type:{value:"processorerror"}}),e(s)):e(new ErrorEvent(t[0],{...s}))},n.set(e,t[1]))}}return p.call(e,"error",t[1],t[2]),p.call(e,...t)}),e.removeEventListener=(l=e.removeEventListener,(...t)=>{if("processorerror"===t[0]){const e=n.get(t[1]);void 0!==e&&(n.delete(t[1]),t[1]=e)}return l.call(e,"error",t[1],t[2]),l.call(e,t[0],t[1],t[2])}),0!==u.numberOfOutputs){const t=s(o,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",gain:0});e.connect(t).connect(o.destination);return i(e,()=>t.disconnect(),()=>t.connect(o.destination))}return e}catch(t){if(11===t.code)throw n();throw t}var l,p;if(void 0===h)throw n();return(t=>{const{port1:e}=new MessageChannel;try{e.postMessage(t)}finally{e.close()}})(u),e(o,r,h,u)})(At,Vn,Qt,Ht,As),Pn=((t,e,s,n,i,o,r,a,c,h,u,l,p,d,f,_)=>(m,g,v)=>{const y=new WeakMap;let x=null;return{render(w,b,T){a(b,w);const S=y.get(b);return void 0!==S?Promise.resolve(S):(async(a,w,b)=>{let T=u(a),S=null;const k=E(T,w),C=Array.isArray(g.outputChannelCount)?g.outputChannelCount:Array.from(g.outputChannelCount);if(null===l){const t=C.reduce((t,e)=>t+e,0),s=i(w,{channelCount:Math.max(1,t),channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:Math.max(1,t)}),o=[];for(let t=0;t<a.numberOfOutputs;t+=1)o.push(n(w,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:C[t]}));const h=r(w,{channelCount:g.channelCount,channelCountMode:g.channelCountMode,channelInterpretation:g.channelInterpretation,gain:1});h.connect=e.bind(null,o),h.disconnect=c.bind(null,o),S=[s,o,h]}else k||(T=new l(w,m));if(y.set(w,null===S?T:S[2]),null!==S){if(null===x){if(void 0===v)throw new Error("Missing the processor constructor.");if(null===p)throw new Error("Missing the native OfflineAudioContext constructor.");const t=a.channelCount*a.numberOfInputs,e=void 0===v.parameterDescriptors?0:v.parameterDescriptors.length,s=t+e,c=async()=>{const c=new p(s,128*Math.ceil(a.context.length/128),w.sampleRate),h=[],u=[];for(let t=0;t<g.numberOfInputs;t+=1)h.push(r(c,{channelCount:g.channelCount,channelCountMode:g.channelCountMode,channelInterpretation:g.channelInterpretation,gain:1})),u.push(i(c,{channelCount:g.channelCount,channelCountMode:"explicit",channelInterpretation:"discrete",numberOfOutputs:g.channelCount}));const l=await Promise.all(Array.from(a.parameters.values()).map(async t=>{const e=o(c,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"discrete",offset:t.value});return await d(c,t,e.offset,b),e})),m=n(c,{channelCount:1,channelCountMode:"explicit",channelInterpretation:"speakers",numberOfInputs:Math.max(1,t+e)});for(let t=0;t<g.numberOfInputs;t+=1){h[t].connect(u[t]);for(let e=0;e<g.channelCount;e+=1)u[t].connect(m,e,t*g.channelCount+e)}for(const[e,s]of l.entries())s.connect(m,0,t+e),s.start(0);return m.connect(c.destination),await Promise.all(h.map(t=>f(a,c,t,b))),_(c)};x=gt(a,0===s?null:await c(),w,g,C,v,h)}const t=await x,e=s(w,{buffer:null,channelCount:2,channelCountMode:"max",channelInterpretation:"speakers",loop:!1,loopEnd:0,loopStart:0,playbackRate:1}),[c,u,l]=S;null!==t&&(e.buffer=t,e.start(0)),e.connect(c);for(let t=0,e=0;t<a.numberOfOutputs;t+=1){const s=u[t];for(let n=0;n<C[t];n+=1)c.connect(s,e+n,n);e+=C[t]}return l}if(k)for(const[e,s]of a.parameters.entries())await t(w,s,T.parameters.get(e),b);else for(const[t,e]of a.parameters.entries())await d(w,e,T.parameters.get(t),b);return await f(a,w,T,b),T})(w,b,T)}}})(as,En,cs,Es,Wt,Is,Qt,Rn,qn,_n,st,vn,Ve,us,Oe,Us),jn=(t=>e=>t.get(e))(mn),Ln=(t=>(e,s)=>{t.set(e,s)})(Fn),zn=fn?((t,e,s,n,i,o,r,a,c,h,u,l,p)=>class extends e{constructor(e,p,d){var f;const m=a(e),g=c(m),v=u({...dt,...d}),y=_.get(m),x=null==y?void 0:y.get(p),w=g||"closed"!==m.state?m:null!==(f=r(m))&&void 0!==f?f:m,b=i(w,g?null:e.baseLatency,h,p,x,v);super(e,!0,b,g?n(p,v,x):null);const T=[];b.parameters.forEach((t,e)=>{const n=s(this,g,t);T.push([e,n])}),this._nativeAudioWorkletNode=b,this._onprocessorerror=null,this._parameters=new pt(T),g&&t(m,this);const{activeInputs:S}=o(this);l(b,S)}get onprocessorerror(){return this._onprocessorerror}set onprocessorerror(t){const e="function"==typeof t?p(this,t):null;this._nativeAudioWorkletNode.onprocessorerror=e;const s=this._nativeAudioWorkletNode.onprocessorerror;this._onprocessorerror=null!==s&&s===e?t:s}get parameters(){return null===this._parameters?this._nativeAudioWorkletNode.parameters:this._parameters}get port(){return this._nativeAudioWorkletNode.port}})(On,Ze,ps,Pn,Nn,L,jn,Fe,Ne,vn,t=>({...t,outputChannelCount:void 0!==t.outputChannelCount?t.outputChannelCount:1===t.numberOfInputs&&1===t.numberOfOutputs?[t.channelCount]:Array.from({length:t.numberOfOutputs},()=>1)}),Ln,de):void 0,Bn=(((t,e,s,n,i)=>{})(At,Ht,se,$s,Be),((t,e)=>(s,n,i)=>{if(null===e)throw new Error("Missing the native OfflineAudioContext constructor.");try{return new e(s,n,i)}catch(e){if("SyntaxError"===e.name)throw t();throw e}})(Ht,Ve)),Wn=((t,e,s,n,i,o,r,a)=>{const c=[];return(h,u)=>s(h).render(h,u,c).then(()=>Promise.all(Array.from(n(u)).map(t=>s(t).render(t,u,c)))).then(()=>i(u)).then(s=>("function"!=typeof s.copyFromChannel?(r(s),F(s)):e(o,()=>o(s))||a(s),t.add(s),s))})(He,xe,Ae,An,Us,R,ts,es),Gn=(((t,e,s,n,i)=>{})(xe,At,Bn,$s,Wn),((t,e,s,n,i)=>class extends t{constructor(t,s,i){let o;if("number"==typeof t&&void 0!==s&&void 0!==i)o={length:s,numberOfChannels:t,sampleRate:i};else{if("object"!=typeof t)throw new Error("The given parameters are not valid.");o=t}const{length:r,numberOfChannels:a,sampleRate:c}={...$t,...o},h=n(a,r,c);e(Rt,()=>Rt(h))||h.addEventListener("statechange",(()=>{let t=0;const e=s=>{"running"===this._state&&(t>0?(h.removeEventListener("statechange",e),s.stopImmediatePropagation(),this._waitForThePromiseToSettle(s)):t+=1)};return e})()),super(h,a),this._length=r,this._nativeOfflineAudioContext=h,this._state=null}get length(){return void 0===this._nativeOfflineAudioContext.length?this._length:this._nativeOfflineAudioContext.length}get state(){return null===this._state?this._nativeOfflineAudioContext.state:this._state}startRendering(){return"running"===this._state?Promise.reject(s()):(this._state="running",i(this.destination,this._nativeOfflineAudioContext).finally(()=>{this._state=null,W(this)}))}_waitForThePromiseToSettle(t){null===this._state?this._nativeOfflineAudioContext.dispatchEvent(t):setTimeout(()=>this._waitForThePromiseToSettle(t))}})(wn,xe,At,Bn,Wn)),Un=((t,e)=>s=>{const n=t.get(s);return e(n)||e(s)})(p,We),Qn=(Zn=h,Xn=Ue,t=>Zn.has(t)||Xn(t));var Zn,Xn;const Yn=(Hn=l,$n=Qe,t=>Hn.has(t)||$n(t));var Hn,$n;const Jn=((t,e)=>s=>{const n=t.get(s);return e(n)||e(s)})(p,Ne),Kn=()=>(async(t,e,s,n,i,o,r,a,c,h,u,l,p,d,f,_)=>{if(t(e,e)&&t(s,s)&&t(i,i)&&t(o,o)&&t(a,a)&&t(c,c)&&t(h,h)&&t(u,u)&&t(l,l)&&t(p,p)&&t(d,d)){return(await Promise.all([t(n,n),t(r,r),t(f,f),t(_,_)])).every(t=>t)}return!1})(xe,(t=>()=>{if(null===t)return!1;const e=new t(1,1,44100).createBuffer(1,1,44100);if(void 0===e.copyToChannel)return!0;const s=new Float32Array(2);try{e.copyFromChannel(s,0,0)}catch{return!1}return!0})(Ve),(t=>()=>{if(null===t)return!1;if(void 0!==t.prototype&&void 0!==t.prototype.close)return!0;const e=new t,s=void 0!==e.close;try{e.close()}catch{}return s})(Be),(t=>()=>{if(null===t)return Promise.resolve(!1);const e=new t(1,1,44100);return new Promise(t=>{let s=!0;const n=n=>{s&&(s=!1,e.startRendering(),t(n instanceof TypeError))};let i;try{i=e.decodeAudioData(null,()=>{},n)}catch(t){n(t)}void 0!==i&&i.catch(n)})})(Ve),(t=>()=>{if(null===t)return!1;let e;try{e=new t({latencyHint:"balanced"})}catch{return!1}return e.close(),!0})(Be),(t=>()=>{if(null===t)return!1;const e=new t(1,1,44100).createGain(),s=e.connect(e)===e;return e.disconnect(e),s})(Ve),((t,e)=>async()=>{if(null===t)return!0;if(null===e)return!1;const s=new Blob(['class A extends AudioWorkletProcessor{process(){this.port.postMessage(0)}}registerProcessor("a",A)'],{type:"application/javascript; charset=utf-8"}),n=new e(1,128,8e3),i=URL.createObjectURL(s);let o=!1;try{await n.audioWorklet.addModule(i);const e=new t(n,"a",{numberOfOutputs:0}),s=n.createOscillator();e.port.onmessage=()=>o=!0,s.connect(e),s.start(0),await n.startRendering(),o||await new Promise(t=>setTimeout(t,5))}catch{}finally{URL.revokeObjectURL(i)}return o})(vn,Ve),(t=>()=>{if(null===t)return!1;const e=new t(1,1,44100).createChannelMerger();if("max"===e.channelCountMode)return!0;try{e.channelCount=2}catch{return!0}return!1})(Ve),(t=>()=>{if(null===t)return!1;const e=new t(1,1,44100);if(void 0===e.createConstantSource)return!0;return e.createConstantSource().offset.maxValue!==Number.POSITIVE_INFINITY})(Ve),(t=>()=>{if(null===t)return!1;const e=new t(1,1,44100),s=e.createConvolver();s.buffer=e.createBuffer(1,1,e.sampleRate);try{s.buffer=e.createBuffer(1,1,e.sampleRate)}catch{return!1}return!0})(Ve),(t=>()=>{if(null===t)return!1;const e=new t(1,1,44100).createConvolver();try{e.channelCount=1}catch{return!1}return!0})(Ve),ue,(t=>()=>null!==t&&t.hasOwnProperty("isSecureContext"))(Te),(t=>()=>{if(null===t)return!1;const e=new t;try{return e.createMediaStreamSource(new MediaStream),!1}catch(t){return!0}})(Be),(t=>()=>{if(null===t)return Promise.resolve(!1);const e=new t(1,1,44100);if(void 0===e.createStereoPanner)return Promise.resolve(!0);if(void 0===e.createConstantSource)return Promise.resolve(!0);const s=e.createConstantSource(),n=e.createStereoPanner();return s.channelCount=1,s.offset.value=1,n.channelCount=1,s.start(),s.connect(n).connect(e.destination),e.startRendering().then(t=>1!==t.getChannelData(0)[0])})(Ve),le);function ti(t,e){if(!t)throw new Error(e)}function ei(t,e,s=1/0){if(!(e<=t&&t<=s))throw new RangeError(`Value must be within [${e}, ${s}], got: ${t}`)}function si(t){t.isOffline||"running"===t.state||ri('The AudioContext is "suspended". Invoke Tone.start() from a user action to start the audio.')}let ni=console;function ii(t){ni=t}function oi(...t){ni.log(...t)}function ri(...t){ni.warn(...t)}function ai(t){return void 0===t}function ci(t){return!ai(t)}function hi(t){return"function"==typeof t}function ui(t){return"number"==typeof t}function li(t){return"[object Object]"===Object.prototype.toString.call(t)&&t.constructor===Object}function pi(t){return"boolean"==typeof t}function di(t){return Array.isArray(t)}function fi(t){return"string"==typeof t}function _i(t){return fi(t)&&/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i.test(t)}const mi="object"==typeof self?self:null,gi=mi&&(mi.hasOwnProperty("AudioContext")||mi.hasOwnProperty("webkitAudioContext"));function vi(t,e,s,n){var i,o=arguments.length,r=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,n);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(r=(o<3?i(r):o>3?i(e,s,r):i(e,s))||r);return o>3&&r&&Object.defineProperty(e,s,r),r}function yi(t,e,s,n){return new(s||(s=Promise))((function(i,o){function r(t){try{c(n.next(t))}catch(t){o(t)}}function a(t){try{c(n.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?i(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(r,a)}c((n=n.apply(t,e||[])).next())}))}Object.create;Object.create;class xi{constructor(t,e,s){this._callback=t,this._type=e,this._updateInterval=s,this._createClock()}_createWorker(){const t=new Blob([`\n\t\t\t// the initial timeout time\n\t\t\tlet timeoutTime =  ${(1e3*this._updateInterval).toFixed(1)};\n\t\t\t// onmessage callback\n\t\t\tself.onmessage = function(msg){\n\t\t\t\ttimeoutTime = parseInt(msg.data);\n\t\t\t};\n\t\t\t// the tick function which posts a message\n\t\t\t// and schedules a new tick\n\t\t\tfunction tick(){\n\t\t\t\tsetTimeout(tick, timeoutTime);\n\t\t\t\tself.postMessage('tick');\n\t\t\t}\n\t\t\t// call tick initially\n\t\t\ttick();\n\t\t\t`],{type:"text/javascript"}),e=URL.createObjectURL(t),s=new Worker(e);s.onmessage=this._callback.bind(this),this._worker=s}_createTimeout(){this._timeout=setTimeout(()=>{this._createTimeout(),this._callback()},1e3*this._updateInterval)}_createClock(){if("worker"===this._type)try{this._createWorker()}catch(t){this._type="timeout",this._createClock()}else"timeout"===this._type&&this._createTimeout()}_disposeClock(){this._timeout&&(clearTimeout(this._timeout),this._timeout=0),this._worker&&(this._worker.terminate(),this._worker.onmessage=null)}get updateInterval(){return this._updateInterval}set updateInterval(t){this._updateInterval=Math.max(t,128/44100),"worker"===this._type&&this._worker.postMessage(Math.max(1e3*t,1))}get type(){return this._type}set type(t){this._disposeClock(),this._type=t,this._createClock()}dispose(){this._disposeClock()}}function wi(t){return Yn(t)}function bi(t){return Qn(t)}function Ti(t){return Jn(t)}function Si(t){return Un(t)}function ki(t){return t instanceof AudioBuffer}function Ci(t,e){return"value"===t||wi(e)||bi(e)||ki(e)}function Ai(t,...e){if(!e.length)return t;const s=e.shift();if(li(t)&&li(s))for(const e in s)Ci(e,s[e])?t[e]=s[e]:li(s[e])?(t[e]||Object.assign(t,{[e]:{}}),Ai(t[e],s[e])):Object.assign(t,{[e]:s[e]});return Ai(t,...e)}function Di(t,e,s=[],n){const i={},o=Array.from(e);if(li(o[0])&&n&&!Reflect.has(o[0],n)){Object.keys(o[0]).some(e=>Reflect.has(t,e))||(Ai(i,{[n]:o[0]}),s.splice(s.indexOf(n),1),o.shift())}if(1===o.length&&li(o[0]))Ai(i,o[0]);else for(let t=0;t<s.length;t++)ci(o[t])&&(i[s[t]]=o[t]);return Ai(t,i)}function Oi(t,e){return ai(t)?e:t}function Mi(t,e){return e.forEach(e=>{Reflect.has(t,e)&&delete t[e]}),t}
/**
 * Tone.js
 * @author Yotam Mann
 * @license http://opensource.org/licenses/MIT MIT License
 * @copyright 2014-2019 Yotam Mann
 */class Ei{constructor(){this.debug=!1,this._wasDisposed=!1}static getDefaults(){return{}}log(...t){(this.debug||mi&&this.toString()===mi.TONE_DEBUG_CLASS)&&oi(this,...t)}dispose(){return this._wasDisposed=!0,this}get disposed(){return this._wasDisposed}toString(){return this.name}}Ei.version=o;function Ri(t,e){return t>e+1e-6}function qi(t,e){return Ri(t,e)||Ii(t,e)}function Fi(t,e){return t+1e-6<e}function Ii(t,e){return Math.abs(t-e)<1e-6}function Vi(t,e,s){return Math.max(Math.min(t,s),e)}class Ni extends Ei{constructor(){super(),this.name="Timeline",this._timeline=[];const t=Di(Ni.getDefaults(),arguments,["memory"]);this.memory=t.memory,this.increasing=t.increasing}static getDefaults(){return{memory:1/0,increasing:!1}}get length(){return this._timeline.length}add(t){if(ti(Reflect.has(t,"time"),"Timeline: events must have a time attribute"),t.time=t.time.valueOf(),this.increasing&&this.length){const e=this._timeline[this.length-1];ti(qi(t.time,e.time),"The time must be greater than or equal to the last scheduled time"),this._timeline.push(t)}else{const e=this._search(t.time);this._timeline.splice(e+1,0,t)}if(this.length>this.memory){const t=this.length-this.memory;this._timeline.splice(0,t)}return this}remove(t){const e=this._timeline.indexOf(t);return-1!==e&&this._timeline.splice(e,1),this}get(t,e="time"){const s=this._search(t,e);return-1!==s?this._timeline[s]:null}peek(){return this._timeline[0]}shift(){return this._timeline.shift()}getAfter(t,e="time"){const s=this._search(t,e);return s+1<this._timeline.length?this._timeline[s+1]:null}getBefore(t){const e=this._timeline.length;if(e>0&&this._timeline[e-1].time<t)return this._timeline[e-1];const s=this._search(t);return s-1>=0?this._timeline[s-1]:null}cancel(t){if(this._timeline.length>1){let e=this._search(t);if(e>=0)if(Ii(this._timeline[e].time,t)){for(let s=e;s>=0&&Ii(this._timeline[s].time,t);s--)e=s;this._timeline=this._timeline.slice(0,e)}else this._timeline=this._timeline.slice(0,e+1);else this._timeline=[]}else 1===this._timeline.length&&qi(this._timeline[0].time,t)&&(this._timeline=[]);return this}cancelBefore(t){const e=this._search(t);return e>=0&&(this._timeline=this._timeline.slice(e+1)),this}previousEvent(t){const e=this._timeline.indexOf(t);return e>0?this._timeline[e-1]:null}_search(t,e="time"){if(0===this._timeline.length)return-1;let s=0;const n=this._timeline.length;let i=n;if(n>0&&this._timeline[n-1][e]<=t)return n-1;for(;s<i;){let n=Math.floor(s+(i-s)/2);const o=this._timeline[n],r=this._timeline[n+1];if(Ii(o[e],t)){for(let s=n;s<this._timeline.length;s++){if(!Ii(this._timeline[s][e],t))break;n=s}return n}if(Fi(o[e],t)&&Ri(r[e],t))return n;Ri(o[e],t)?i=n:s=n+1}return-1}_iterate(t,e=0,s=this._timeline.length-1){this._timeline.slice(e,s+1).forEach(t)}forEach(t){return this._iterate(t),this}forEachBefore(t,e){const s=this._search(t);return-1!==s&&this._iterate(e,0,s),this}forEachAfter(t,e){const s=this._search(t);return this._iterate(e,s+1),this}forEachBetween(t,e,s){let n=this._search(t),i=this._search(e);return-1!==n&&-1!==i?(this._timeline[n].time!==t&&(n+=1),this._timeline[i].time===e&&(i-=1),this._iterate(s,n,i)):-1===n&&this._iterate(s,0,i),this}forEachFrom(t,e){let s=this._search(t);for(;s>=0&&this._timeline[s].time>=t;)s--;return this._iterate(e,s+1),this}forEachAtTime(t,e){const s=this._search(t);if(-1!==s&&Ii(this._timeline[s].time,t)){let n=s;for(let e=s;e>=0&&Ii(this._timeline[e].time,t);e--)n=e;this._iterate(t=>{e(t)},n,s)}return this}dispose(){return super.dispose(),this._timeline=[],this}}const Pi=[];function ji(t){Pi.push(t)}const Li=[];function zi(t){Li.push(t)}class Bi extends Ei{constructor(){super(...arguments),this.name="Emitter"}on(t,e){return t.split(/\W+/).forEach(t=>{ai(this._events)&&(this._events={}),this._events.hasOwnProperty(t)||(this._events[t]=[]),this._events[t].push(e)}),this}once(t,e){const s=(...n)=>{e(...n),this.off(t,s)};return this.on(t,s),this}off(t,e){return t.split(/\W+/).forEach(s=>{if(ai(this._events)&&(this._events={}),this._events.hasOwnProperty(t))if(ai(e))this._events[t]=[];else{const s=this._events[t];for(let t=s.length-1;t>=0;t--)s[t]===e&&s.splice(t,1)}}),this}emit(t,...e){if(this._events&&this._events.hasOwnProperty(t)){const s=this._events[t].slice(0);for(let t=0,n=s.length;t<n;t++)s[t].apply(this,e)}return this}static mixin(t){["on","once","off","emit"].forEach(e=>{const s=Object.getOwnPropertyDescriptor(Bi.prototype,e);Object.defineProperty(t.prototype,e,s)})}dispose(){return super.dispose(),this._events=void 0,this}}class Wi extends Bi{constructor(){super(...arguments),this.isOffline=!1}toJSON(){return{}}}class Gi extends Wi{constructor(){super(),this.name="Context",this._constants=new Map,this._timeouts=new Ni,this._timeoutIds=0,this._initialized=!1,this.isOffline=!1,this._workletModules=new Map;const t=Di(Gi.getDefaults(),arguments,["context"]);t.context?this._context=t.context:this._context=function(t){return new Cn(t)}({latencyHint:t.latencyHint}),this._ticker=new xi(this.emit.bind(this,"tick"),t.clockSource,t.updateInterval),this.on("tick",this._timeoutLoop.bind(this)),this._context.onstatechange=()=>{this.emit("statechange",this.state)},this._setLatencyHint(t.latencyHint),this.lookAhead=t.lookAhead}static getDefaults(){return{clockSource:"worker",latencyHint:"interactive",lookAhead:.1,updateInterval:.05}}initialize(){var t;return this._initialized||(t=this,Pi.forEach(e=>e(t)),this._initialized=!0),this}createAnalyser(){return this._context.createAnalyser()}createOscillator(){return this._context.createOscillator()}createBufferSource(){return this._context.createBufferSource()}createBiquadFilter(){return this._context.createBiquadFilter()}createBuffer(t,e,s){return this._context.createBuffer(t,e,s)}createChannelMerger(t){return this._context.createChannelMerger(t)}createChannelSplitter(t){return this._context.createChannelSplitter(t)}createConstantSource(){return this._context.createConstantSource()}createConvolver(){return this._context.createConvolver()}createDelay(t){return this._context.createDelay(t)}createDynamicsCompressor(){return this._context.createDynamicsCompressor()}createGain(){return this._context.createGain()}createIIRFilter(t,e){return this._context.createIIRFilter(t,e)}createPanner(){return this._context.createPanner()}createPeriodicWave(t,e,s){return this._context.createPeriodicWave(t,e,s)}createStereoPanner(){return this._context.createStereoPanner()}createWaveShaper(){return this._context.createWaveShaper()}createMediaStreamSource(t){ti(Si(this._context),"Not available if OfflineAudioContext");return this._context.createMediaStreamSource(t)}createMediaElementSource(t){ti(Si(this._context),"Not available if OfflineAudioContext");return this._context.createMediaElementSource(t)}createMediaStreamDestination(){ti(Si(this._context),"Not available if OfflineAudioContext");return this._context.createMediaStreamDestination()}decodeAudioData(t){return this._context.decodeAudioData(t)}get currentTime(){return this._context.currentTime}get state(){return this._context.state}get sampleRate(){return this._context.sampleRate}get listener(){return this.initialize(),this._listener}set listener(t){ti(!this._initialized,"The listener cannot be set after initialization."),this._listener=t}get transport(){return this.initialize(),this._transport}set transport(t){ti(!this._initialized,"The transport cannot be set after initialization."),this._transport=t}get draw(){return this.initialize(),this._draw}set draw(t){ti(!this._initialized,"Draw cannot be set after initialization."),this._draw=t}get destination(){return this.initialize(),this._destination}set destination(t){ti(!this._initialized,"The destination cannot be set after initialization."),this._destination=t}createAudioWorkletNode(t,e){return function(t,e,s){return ti(ci(zn),"This node only works in a secure context (https or localhost)"),new zn(t,e,s)}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */(this.rawContext,t,e)}addAudioWorkletModule(t,e){return yi(this,void 0,void 0,(function*(){ti(ci(this.rawContext.audioWorklet),"AudioWorkletNode is only available in a secure context (https or localhost)"),this._workletModules.has(e)||this._workletModules.set(e,this.rawContext.audioWorklet.addModule(t)),yield this._workletModules.get(e)}))}workletsAreReady(){return yi(this,void 0,void 0,(function*(){const t=[];this._workletModules.forEach(e=>t.push(e)),yield Promise.all(t)}))}get updateInterval(){return this._ticker.updateInterval}set updateInterval(t){this._ticker.updateInterval=t}get clockSource(){return this._ticker.type}set clockSource(t){this._ticker.type=t}get latencyHint(){return this._latencyHint}_setLatencyHint(t){let e=0;if(this._latencyHint=t,fi(t))switch(t){case"interactive":e=.1;break;case"playback":e=.5;break;case"balanced":e=.25}this.lookAhead=e,this.updateInterval=e/2}get rawContext(){return this._context}now(){return this._context.currentTime+this.lookAhead}immediate(){return this._context.currentTime}resume(){return Si(this._context)?this._context.resume():Promise.resolve()}close(){return yi(this,void 0,void 0,(function*(){var t;Si(this._context)&&(yield this._context.close()),this._initialized&&(t=this,Li.forEach(e=>e(t)))}))}getConstant(t){if(this._constants.has(t))return this._constants.get(t);{const e=this._context.createBuffer(1,128,this._context.sampleRate),s=e.getChannelData(0);for(let e=0;e<s.length;e++)s[e]=t;const n=this._context.createBufferSource();return n.channelCount=1,n.channelCountMode="explicit",n.buffer=e,n.loop=!0,n.start(0),this._constants.set(t,n),n}}dispose(){return super.dispose(),this._ticker.dispose(),this._timeouts.dispose(),Object.keys(this._constants).map(t=>this._constants[t].disconnect()),this}_timeoutLoop(){const t=this.now();let e=this._timeouts.peek();for(;this._timeouts.length&&e&&e.time<=t;)e.callback(),this._timeouts.shift(),e=this._timeouts.peek()}setTimeout(t,e){this._timeoutIds++;const s=this.now();return this._timeouts.add({callback:t,id:this._timeoutIds,time:s+e}),this._timeoutIds}clearTimeout(t){return this._timeouts.forEach(e=>{e.id===t&&this._timeouts.remove(e)}),this}clearInterval(t){return this.clearTimeout(t)}setInterval(t,e){const s=++this._timeoutIds,n=()=>{const i=this.now();this._timeouts.add({callback:()=>{t(),n()},id:s,time:i+e})};return n(),s}}function Ui(t,e){di(e)?e.forEach(e=>Ui(t,e)):Object.defineProperty(t,e,{enumerable:!0,writable:!1})}function Qi(t,e){di(e)?e.forEach(e=>Qi(t,e)):Object.defineProperty(t,e,{writable:!0})}const Zi=()=>{};class Xi extends Ei{constructor(){super(),this.name="ToneAudioBuffer",this.onload=Zi;const t=Di(Xi.getDefaults(),arguments,["url","onload","onerror"]);this.reverse=t.reverse,this.onload=t.onload,t.url&&ki(t.url)||t.url instanceof Xi?this.set(t.url):fi(t.url)&&this.load(t.url).catch(t.onerror)}static getDefaults(){return{onerror:Zi,onload:Zi,reverse:!1}}get sampleRate(){return this._buffer?this._buffer.sampleRate:Ji().sampleRate}set(t){return t instanceof Xi?t.loaded?this._buffer=t.get():t.onload=()=>{this.set(t),this.onload(this)}:this._buffer=t,this._reversed&&this._reverse(),this}get(){return this._buffer}load(t){return yi(this,void 0,void 0,(function*(){const e=Xi.load(t).then(t=>{this.set(t),this.onload(this)});Xi.downloads.push(e);try{yield e}finally{const t=Xi.downloads.indexOf(e);Xi.downloads.splice(t,1)}return this}))}dispose(){return super.dispose(),this._buffer=void 0,this}fromArray(t){const e=di(t)&&t[0].length>0,s=e?t.length:1,n=e?t[0].length:t.length,i=Ji(),o=i.createBuffer(s,n,i.sampleRate),r=e||1!==s?t:[t];for(let t=0;t<s;t++)o.copyToChannel(r[t],t);return this._buffer=o,this}toMono(t){if(ui(t))this.fromArray(this.toArray(t));else{let t=new Float32Array(this.length);const e=this.numberOfChannels;for(let s=0;s<e;s++){const e=this.toArray(s);for(let s=0;s<e.length;s++)t[s]+=e[s]}t=t.map(t=>t/e),this.fromArray(t)}return this}toArray(t){if(ui(t))return this.getChannelData(t);if(1===this.numberOfChannels)return this.toArray(0);{const t=[];for(let e=0;e<this.numberOfChannels;e++)t[e]=this.getChannelData(e);return t}}getChannelData(t){return this._buffer?this._buffer.getChannelData(t):new Float32Array(0)}slice(t,e=this.duration){const s=Math.floor(t*this.sampleRate),n=Math.floor(e*this.sampleRate);ti(s<n,"The start time must be less than the end time");const i=n-s,o=Ji().createBuffer(this.numberOfChannels,i,this.sampleRate);for(let t=0;t<this.numberOfChannels;t++)o.copyToChannel(this.getChannelData(t).subarray(s,n),t);return new Xi(o)}_reverse(){if(this.loaded)for(let t=0;t<this.numberOfChannels;t++)this.getChannelData(t).reverse();return this}get loaded(){return this.length>0}get duration(){return this._buffer?this._buffer.duration:0}get length(){return this._buffer?this._buffer.length:0}get numberOfChannels(){return this._buffer?this._buffer.numberOfChannels:0}get reverse(){return this._reversed}set reverse(t){this._reversed!==t&&(this._reversed=t,this._reverse())}static fromArray(t){return(new Xi).fromArray(t)}static fromUrl(t){return yi(this,void 0,void 0,(function*(){const e=new Xi;return yield e.load(t)}))}static load(t){return yi(this,void 0,void 0,(function*(){const e=t.match(/\[([^\]\[]+\|.+)\]$/);if(e){const s=e[1].split("|");let n=s[0];for(const t of s)if(Xi.supportsType(t)){n=t;break}t=t.replace(e[0],n)}const s=""===Xi.baseUrl||Xi.baseUrl.endsWith("/")?Xi.baseUrl:Xi.baseUrl+"/",n=yield fetch(s+t);if(!n.ok)throw new Error("could not load url: "+t);const i=yield n.arrayBuffer();return yield Ji().decodeAudioData(i)}))}static supportsType(t){const e=t.split("."),s=e[e.length-1];return""!==document.createElement("audio").canPlayType("audio/"+s)}static loaded(){return yi(this,void 0,void 0,(function*(){for(yield Promise.resolve();Xi.downloads.length;)yield Xi.downloads[0]}))}}Xi.baseUrl="",Xi.downloads=[];class Yi extends Gi{constructor(){var t,e,s;super({clockSource:"offline",context:Ti(arguments[0])?arguments[0]:(t=arguments[0],e=arguments[1]*arguments[2],s=arguments[2],new Gn(t,e,s)),lookAhead:0,updateInterval:Ti(arguments[0])?128/arguments[0].sampleRate:128/arguments[2]}),this.name="OfflineContext",this._currentTime=0,this.isOffline=!0,this._duration=Ti(arguments[0])?arguments[0].length/arguments[0].sampleRate:arguments[1]}now(){return this._currentTime}get currentTime(){return this._currentTime}_renderClock(t){return yi(this,void 0,void 0,(function*(){let e=0;for(;this._duration-this._currentTime>=0;){this.emit("tick"),this._currentTime+=128/this.sampleRate,e++;const s=Math.floor(this.sampleRate/128);t&&e%s==0&&(yield new Promise(t=>setTimeout(t,1)))}}))}render(t=!0){return yi(this,void 0,void 0,(function*(){yield this.workletsAreReady(),yield this._renderClock(t);const e=yield this._context.startRendering();return new Xi(e)}))}close(){return Promise.resolve()}}const Hi=new class extends Wi{constructor(){super(...arguments),this.lookAhead=0,this.latencyHint=0,this.isOffline=!1}createAnalyser(){return{}}createOscillator(){return{}}createBufferSource(){return{}}createBiquadFilter(){return{}}createBuffer(t,e,s){return{}}createChannelMerger(t){return{}}createChannelSplitter(t){return{}}createConstantSource(){return{}}createConvolver(){return{}}createDelay(t){return{}}createDynamicsCompressor(){return{}}createGain(){return{}}createIIRFilter(t,e){return{}}createPanner(){return{}}createPeriodicWave(t,e,s){return{}}createStereoPanner(){return{}}createWaveShaper(){return{}}createMediaStreamSource(t){return{}}createMediaElementSource(t){return{}}createMediaStreamDestination(){return{}}decodeAudioData(t){return Promise.resolve({})}createAudioWorkletNode(t,e){return{}}get rawContext(){return{}}addAudioWorkletModule(t,e){return yi(this,void 0,void 0,(function*(){return Promise.resolve()}))}resume(){return Promise.resolve()}setTimeout(t,e){return 0}clearTimeout(t){return this}setInterval(t,e){return 0}clearInterval(t){return this}getConstant(t){return{}}get currentTime(){return 0}get state(){return{}}get sampleRate(){return 0}get listener(){return{}}get transport(){return{}}get draw(){return{}}set draw(t){}get destination(){return{}}set destination(t){}now(){return 0}immediate(){return 0}};let $i=Hi;function Ji(){return $i===Hi&&gi&&Ki(new Gi),$i}function Ki(t){$i=Si(t)?new Gi(t):Ti(t)?new Yi(t):t}function to(){return $i.resume()}if(mi&&!mi.TONE_SILENCE_LOGGING){let t="v";"dev"===o&&(t="");const e=` * Tone.js ${t}${o} * `;console.log("%c"+e,"background: #000; color: #fff")}function eo(t){return Math.pow(10,t/20)}function so(t){return Math.log(t)/Math.LN10*20}function no(t){return Math.pow(2,t/12)}let io=440;function oo(t){return Math.round(ro(t))}function ro(t){return 69+12*Math.log2(t/io)}function ao(t){return io*Math.pow(2,(t-69)/12)}class co extends Ei{constructor(t,e,s){super(),this.defaultUnits="s",this._val=e,this._units=s,this.context=t,this._expressions=this._getExpressions()}_getExpressions(){return{hz:{method:t=>this._frequencyToUnits(parseFloat(t)),regexp:/^(\d+(?:\.\d+)?)hz$/i},i:{method:t=>this._ticksToUnits(parseInt(t,10)),regexp:/^(\d+)i$/i},m:{method:t=>this._beatsToUnits(parseInt(t,10)*this._getTimeSignature()),regexp:/^(\d+)m$/i},n:{method:(t,e)=>{const s=parseInt(t,10),n="."===e?1.5:1;return 1===s?this._beatsToUnits(this._getTimeSignature())*n:this._beatsToUnits(4/s)*n},regexp:/^(\d+)n(\.?)$/i},number:{method:t=>this._expressions[this.defaultUnits].method.call(this,t),regexp:/^(\d+(?:\.\d+)?)$/},s:{method:t=>this._secondsToUnits(parseFloat(t)),regexp:/^(\d+(?:\.\d+)?)s$/},samples:{method:t=>parseInt(t,10)/this.context.sampleRate,regexp:/^(\d+)samples$/},t:{method:t=>{const e=parseInt(t,10);return this._beatsToUnits(8/(3*Math.floor(e)))},regexp:/^(\d+)t$/i},tr:{method:(t,e,s)=>{let n=0;return t&&"0"!==t&&(n+=this._beatsToUnits(this._getTimeSignature()*parseFloat(t))),e&&"0"!==e&&(n+=this._beatsToUnits(parseFloat(e))),s&&"0"!==s&&(n+=this._beatsToUnits(parseFloat(s)/4)),n},regexp:/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?$/}}}valueOf(){if(this._val instanceof co&&this.fromType(this._val),ai(this._val))return this._noArg();if(fi(this._val)&&ai(this._units)){for(const t in this._expressions)if(this._expressions[t].regexp.test(this._val.trim())){this._units=t;break}}else if(li(this._val)){let t=0;for(const e in this._val)if(ci(this._val[e])){const s=this._val[e];t+=new this.constructor(this.context,e).valueOf()*s}return t}if(ci(this._units)){const t=this._expressions[this._units],e=this._val.toString().trim().match(t.regexp);return e?t.method.apply(this,e.slice(1)):t.method.call(this,this._val)}return fi(this._val)?parseFloat(this._val):this._val}_frequencyToUnits(t){return 1/t}_beatsToUnits(t){return 60/this._getBpm()*t}_secondsToUnits(t){return t}_ticksToUnits(t){return t*this._beatsToUnits(1)/this._getPPQ()}_noArg(){return this._now()}_getBpm(){return this.context.transport.bpm.value}_getTimeSignature(){return this.context.transport.timeSignature}_getPPQ(){return this.context.transport.PPQ}fromType(t){switch(this._units=void 0,this.defaultUnits){case"s":this._val=t.toSeconds();break;case"i":this._val=t.toTicks();break;case"hz":this._val=t.toFrequency();break;case"midi":this._val=t.toMidi()}return this}toFrequency(){return 1/this.toSeconds()}toSamples(){return this.toSeconds()*this.context.sampleRate}toMilliseconds(){return 1e3*this.toSeconds()}}class ho extends co{constructor(){super(...arguments),this.name="TimeClass"}_getExpressions(){return Object.assign(super._getExpressions(),{now:{method:t=>this._now()+new this.constructor(this.context,t).valueOf(),regexp:/^\+(.+)/},quantize:{method:t=>{const e=new ho(this.context,t).valueOf();return this._secondsToUnits(this.context.transport.nextSubdivision(e))},regexp:/^@(.+)/}})}quantize(t,e=1){const s=new this.constructor(this.context,t).valueOf(),n=this.valueOf();return n+(Math.round(n/s)*s-n)*e}toNotation(){const t=this.toSeconds(),e=["1m"];for(let t=1;t<9;t++){const s=Math.pow(2,t);e.push(s+"n."),e.push(s+"n"),e.push(s+"t")}e.push("0");let s=e[0],n=new ho(this.context,e[0]).toSeconds();return e.forEach(e=>{const i=new ho(this.context,e).toSeconds();Math.abs(i-t)<Math.abs(n-t)&&(s=e,n=i)}),s}toBarsBeatsSixteenths(){const t=this._beatsToUnits(1);let e=this.valueOf()/t;e=parseFloat(e.toFixed(4));const s=Math.floor(e/this._getTimeSignature());let n=e%1*4;e=Math.floor(e)%this._getTimeSignature();const i=n.toString();i.length>3&&(n=parseFloat(parseFloat(i).toFixed(3)));return[s,e,n].join(":")}toTicks(){const t=this._beatsToUnits(1),e=this.valueOf()/t;return Math.round(e*this._getPPQ())}toSeconds(){return this.valueOf()}toMidi(){return oo(this.toFrequency())}_now(){return this.context.now()}}function uo(t,e){return new ho(Ji(),t,e)}class lo extends ho{constructor(){super(...arguments),this.name="Frequency",this.defaultUnits="hz"}static get A4(){return io}static set A4(t){!function(t){io=t}(t)}_getExpressions(){return Object.assign({},super._getExpressions(),{midi:{regexp:/^(\d+(?:\.\d+)?midi)/,method(t){return"midi"===this.defaultUnits?t:lo.mtof(t)}},note:{regexp:/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,method(t,e){const s=po[t.toLowerCase()]+12*(parseInt(e,10)+1);return"midi"===this.defaultUnits?s:lo.mtof(s)}},tr:{regexp:/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,method(t,e,s){let n=1;return t&&"0"!==t&&(n*=this._beatsToUnits(this._getTimeSignature()*parseFloat(t))),e&&"0"!==e&&(n*=this._beatsToUnits(parseFloat(e))),s&&"0"!==s&&(n*=this._beatsToUnits(parseFloat(s)/4)),n}}})}transpose(t){return new lo(this.context,this.valueOf()*no(t))}harmonize(t){return t.map(t=>this.transpose(t))}toMidi(){return oo(this.valueOf())}toNote(){const t=this.toFrequency(),e=Math.log2(t/lo.A4);let s=Math.round(12*e)+57;const n=Math.floor(s/12);n<0&&(s+=-12*n);return fo[s%12]+n.toString()}toSeconds(){return 1/super.toSeconds()}toTicks(){const t=this._beatsToUnits(1),e=this.valueOf()/t;return Math.floor(e*this._getPPQ())}_noArg(){return 0}_frequencyToUnits(t){return t}_ticksToUnits(t){return 1/(60*t/(this._getBpm()*this._getPPQ()))}_beatsToUnits(t){return 1/super._beatsToUnits(t)}_secondsToUnits(t){return 1/t}static mtof(t){return ao(t)}static ftom(t){return oo(t)}}const po={cbb:-2,cb:-1,c:0,"c#":1,cx:2,dbb:0,db:1,d:2,"d#":3,dx:4,ebb:2,eb:3,e:4,"e#":5,ex:6,fbb:3,fb:4,f:5,"f#":6,fx:7,gbb:5,gb:6,g:7,"g#":8,gx:9,abb:7,ab:8,a:9,"a#":10,ax:11,bbb:9,bb:10,b:11,"b#":12,bx:13},fo=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function _o(t,e){return new lo(Ji(),t,e)}class mo extends ho{constructor(){super(...arguments),this.name="TransportTime"}_now(){return this.context.transport.seconds}}function go(t,e){return new mo(Ji(),t,e)}class vo extends Ei{constructor(){super();const t=Di(vo.getDefaults(),arguments,["context"]);this.defaultContext?this.context=this.defaultContext:this.context=t.context}static getDefaults(){return{context:Ji()}}now(){return this.context.currentTime+this.context.lookAhead}immediate(){return this.context.currentTime}get sampleTime(){return 1/this.context.sampleRate}get blockTime(){return 128/this.context.sampleRate}toSeconds(t){return new ho(this.context,t).toSeconds()}toFrequency(t){return new lo(this.context,t).toFrequency()}toTicks(t){return new mo(this.context,t).toTicks()}_getPartialProperties(t){const e=this.get();return Object.keys(e).forEach(s=>{ai(t[s])&&delete e[s]}),e}get(){const t=this.constructor.getDefaults();return Object.keys(t).forEach(e=>{if(Reflect.has(this,e)){const s=this[e];ci(s)&&ci(s.value)&&ci(s.setValueAtTime)?t[e]=s.value:s instanceof vo?t[e]=s._getPartialProperties(t[e]):di(s)||ui(s)||fi(s)||pi(s)?t[e]=s:delete t[e]}}),t}set(t){return Object.keys(t).forEach(e=>{Reflect.has(this,e)&&ci(this[e])&&(this[e]&&ci(this[e].value)&&ci(this[e].setValueAtTime)?this[e].value!==t[e]&&(this[e].value=t[e]):this[e]instanceof vo?this[e].set(t[e]):this[e]=t[e])}),this}}class yo extends Ni{constructor(t="stopped"){super(),this.name="StateTimeline",this._initial=t,this.setStateAtTime(this._initial,0)}getValueAtTime(t){const e=this.get(t);return null!==e?e.state:this._initial}setStateAtTime(t,e,s){return ei(e,0),this.add(Object.assign({},s,{state:t,time:e})),this}getLastState(t,e){for(let s=this._search(e);s>=0;s--){const e=this._timeline[s];if(e.state===t)return e}}getNextState(t,e){const s=this._search(e);if(-1!==s)for(let e=s;e<this._timeline.length;e++){const s=this._timeline[e];if(s.state===t)return s}}}class xo extends vo{constructor(){super(Di(xo.getDefaults(),arguments,["param","units","convert"])),this.name="Param",this.overridden=!1,this._minOutput=1e-7;const t=Di(xo.getDefaults(),arguments,["param","units","convert"]);for(ti(ci(t.param)&&(wi(t.param)||t.param instanceof xo),"param must be an AudioParam");!wi(t.param);)t.param=t.param._param;this._swappable=!!ci(t.swappable)&&t.swappable,this._swappable?(this.input=this.context.createGain(),this._param=t.param,this.input.connect(this._param)):this._param=this.input=t.param,this._events=new Ni(1e3),this._initialValue=this._param.defaultValue,this.units=t.units,this.convert=t.convert,this._minValue=t.minValue,this._maxValue=t.maxValue,ci(t.value)&&t.value!==this._toType(this._initialValue)&&this.setValueAtTime(t.value,0)}static getDefaults(){return Object.assign(vo.getDefaults(),{convert:!0,units:"number"})}get value(){const t=this.now();return this.getValueAtTime(t)}set value(t){this.cancelScheduledValues(this.now()),this.setValueAtTime(t,this.now())}get minValue(){return ci(this._minValue)?this._minValue:"time"===this.units||"frequency"===this.units||"normalRange"===this.units||"positive"===this.units||"transportTime"===this.units||"ticks"===this.units||"bpm"===this.units||"hertz"===this.units||"samples"===this.units?0:"audioRange"===this.units?-1:"decibels"===this.units?-1/0:this._param.minValue}get maxValue(){return ci(this._maxValue)?this._maxValue:"normalRange"===this.units||"audioRange"===this.units?1:this._param.maxValue}_is(t,e){return this.units===e}_assertRange(t){return ci(this.maxValue)&&ci(this.minValue)&&ei(t,this._fromType(this.minValue),this._fromType(this.maxValue)),t}_fromType(t){return this.convert&&!this.overridden?this._is(t,"time")?this.toSeconds(t):this._is(t,"decibels")?eo(t):this._is(t,"frequency")?this.toFrequency(t):t:this.overridden?0:t}_toType(t){return this.convert&&"decibels"===this.units?so(t):t}setValueAtTime(t,e){const s=this.toSeconds(e),n=this._fromType(t);return ti(isFinite(n)&&isFinite(s),`Invalid argument(s) to setValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._assertRange(n),this.log(this.units,"setValueAtTime",t,s),this._events.add({time:s,type:"setValueAtTime",value:n}),this._param.setValueAtTime(n,s),this}getValueAtTime(t){const e=Math.max(this.toSeconds(t),0),s=this._events.getAfter(e),n=this._events.get(e);let i=this._initialValue;if(null===n)i=this._initialValue;else if("setTargetAtTime"!==n.type||null!==s&&"setValueAtTime"!==s.type)if(null===s)i=n.value;else if("linearRampToValueAtTime"===s.type||"exponentialRampToValueAtTime"===s.type){let t=n.value;if("setTargetAtTime"===n.type){const e=this._events.getBefore(n.time);t=null===e?this._initialValue:e.value}i="linearRampToValueAtTime"===s.type?this._linearInterpolate(n.time,t,s.time,s.value,e):this._exponentialInterpolate(n.time,t,s.time,s.value,e)}else i=n.value;else{const t=this._events.getBefore(n.time);let s;s=null===t?this._initialValue:t.value,"setTargetAtTime"===n.type&&(i=this._exponentialApproach(n.time,s,n.value,n.constant,e))}return this._toType(i)}setRampPoint(t){t=this.toSeconds(t);let e=this.getValueAtTime(t);return this.cancelAndHoldAtTime(t),0===this._fromType(e)&&(e=this._toType(this._minOutput)),this.setValueAtTime(e,t),this}linearRampToValueAtTime(t,e){const s=this._fromType(t),n=this.toSeconds(e);return ti(isFinite(s)&&isFinite(n),`Invalid argument(s) to linearRampToValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._assertRange(s),this._events.add({time:n,type:"linearRampToValueAtTime",value:s}),this.log(this.units,"linearRampToValueAtTime",t,n),this._param.linearRampToValueAtTime(s,n),this}exponentialRampToValueAtTime(t,e){let s=this._fromType(t);s=Ii(s,0)?this._minOutput:s,this._assertRange(s);const n=this.toSeconds(e);return ti(isFinite(s)&&isFinite(n),`Invalid argument(s) to exponentialRampToValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._events.add({time:n,type:"exponentialRampToValueAtTime",value:s}),this.log(this.units,"exponentialRampToValueAtTime",t,n),this._param.exponentialRampToValueAtTime(s,n),this}exponentialRampTo(t,e,s){return s=this.toSeconds(s),this.setRampPoint(s),this.exponentialRampToValueAtTime(t,s+this.toSeconds(e)),this}linearRampTo(t,e,s){return s=this.toSeconds(s),this.setRampPoint(s),this.linearRampToValueAtTime(t,s+this.toSeconds(e)),this}targetRampTo(t,e,s){return s=this.toSeconds(s),this.setRampPoint(s),this.exponentialApproachValueAtTime(t,s,e),this}exponentialApproachValueAtTime(t,e,s){e=this.toSeconds(e),s=this.toSeconds(s);const n=Math.log(s+1)/Math.log(200);return this.setTargetAtTime(t,e,n),this.cancelAndHoldAtTime(e+.9*s),this.linearRampToValueAtTime(t,e+s),this}setTargetAtTime(t,e,s){const n=this._fromType(t);ti(isFinite(s)&&s>0,"timeConstant must be a number greater than 0");const i=this.toSeconds(e);return this._assertRange(n),ti(isFinite(n)&&isFinite(i),`Invalid argument(s) to setTargetAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),this._events.add({constant:s,time:i,type:"setTargetAtTime",value:n}),this.log(this.units,"setTargetAtTime",t,i,s),this._param.setTargetAtTime(n,i,s),this}setValueCurveAtTime(t,e,s,n=1){s=this.toSeconds(s),e=this.toSeconds(e);const i=this._fromType(t[0])*n;this.setValueAtTime(this._toType(i),e);const o=s/(t.length-1);for(let s=1;s<t.length;s++){const i=this._fromType(t[s])*n;this.linearRampToValueAtTime(this._toType(i),e+s*o)}return this}cancelScheduledValues(t){const e=this.toSeconds(t);return ti(isFinite(e),"Invalid argument to cancelScheduledValues: "+JSON.stringify(t)),this._events.cancel(e),this._param.cancelScheduledValues(e),this.log(this.units,"cancelScheduledValues",e),this}cancelAndHoldAtTime(t){const e=this.toSeconds(t),s=this._fromType(this.getValueAtTime(e));ti(isFinite(e),"Invalid argument to cancelAndHoldAtTime: "+JSON.stringify(t)),this.log(this.units,"cancelAndHoldAtTime",e,"value="+s);const n=this._events.get(e),i=this._events.getAfter(e);return n&&Ii(n.time,e)?i?(this._param.cancelScheduledValues(i.time),this._events.cancel(i.time)):(this._param.cancelAndHoldAtTime(e),this._events.cancel(e+this.sampleTime)):i&&(this._param.cancelScheduledValues(i.time),this._events.cancel(i.time),"linearRampToValueAtTime"===i.type?this.linearRampToValueAtTime(this._toType(s),e):"exponentialRampToValueAtTime"===i.type&&this.exponentialRampToValueAtTime(this._toType(s),e)),this._events.add({time:e,type:"setValueAtTime",value:s}),this._param.setValueAtTime(s,e),this}rampTo(t,e=.1,s){return"frequency"===this.units||"bpm"===this.units||"decibels"===this.units?this.exponentialRampTo(t,e,s):this.linearRampTo(t,e,s),this}apply(t){const e=this.context.currentTime;t.setValueAtTime(this.getValueAtTime(e),e);const s=this._events.get(e);if(s&&"setTargetAtTime"===s.type){const n=this._events.getAfter(s.time),i=n?n.time:e+2,o=(i-e)/10;for(let s=e;s<i;s+=o)t.linearRampToValueAtTime(this.getValueAtTime(s),s)}return this._events.forEachAfter(this.context.currentTime,e=>{"cancelScheduledValues"===e.type?t.cancelScheduledValues(e.time):"setTargetAtTime"===e.type?t.setTargetAtTime(e.value,e.time,e.constant):t[e.type](e.value,e.time)}),this}setParam(t){ti(this._swappable,"The Param must be assigned as 'swappable' in the constructor");const e=this.input;return e.disconnect(this._param),this.apply(t),this._param=t,e.connect(this._param),this}dispose(){return super.dispose(),this._events.dispose(),this}get defaultValue(){return this._toType(this._param.defaultValue)}_exponentialApproach(t,e,s,n,i){return s+(e-s)*Math.exp(-(i-t)/n)}_linearInterpolate(t,e,s,n,i){return e+(i-t)/(s-t)*(n-e)}_exponentialInterpolate(t,e,s,n,i){return e*Math.pow(n/e,(i-t)/(s-t))}}class wo extends vo{constructor(){super(...arguments),this.name="ToneAudioNode",this._internalChannels=[]}get numberOfInputs(){return ci(this.input)?wi(this.input)||this.input instanceof xo?1:this.input.numberOfInputs:0}get numberOfOutputs(){return ci(this.output)?this.output.numberOfOutputs:0}_isAudioNode(t){return ci(t)&&(t instanceof wo||bi(t))}_getInternalNodes(){const t=this._internalChannels.slice(0);return this._isAudioNode(this.input)&&t.push(this.input),this._isAudioNode(this.output)&&this.input!==this.output&&t.push(this.output),t}_setChannelProperties(t){this._getInternalNodes().forEach(e=>{e.channelCount=t.channelCount,e.channelCountMode=t.channelCountMode,e.channelInterpretation=t.channelInterpretation})}_getChannelProperties(){const t=this._getInternalNodes();ti(t.length>0,"ToneAudioNode does not have any internal nodes");const e=t[0];return{channelCount:e.channelCount,channelCountMode:e.channelCountMode,channelInterpretation:e.channelInterpretation}}get channelCount(){return this._getChannelProperties().channelCount}set channelCount(t){const e=this._getChannelProperties();this._setChannelProperties(Object.assign(e,{channelCount:t}))}get channelCountMode(){return this._getChannelProperties().channelCountMode}set channelCountMode(t){const e=this._getChannelProperties();this._setChannelProperties(Object.assign(e,{channelCountMode:t}))}get channelInterpretation(){return this._getChannelProperties().channelInterpretation}set channelInterpretation(t){const e=this._getChannelProperties();this._setChannelProperties(Object.assign(e,{channelInterpretation:t}))}connect(t,e=0,s=0){return To(this,t,e,s),this}toDestination(){return this.connect(this.context.destination),this}toMaster(){return ri("toMaster() has been renamed toDestination()"),this.toDestination()}disconnect(t,e=0,s=0){return So(this,t,e,s),this}chain(...t){return bo(this,...t),this}fan(...t){return t.forEach(t=>this.connect(t)),this}dispose(){return super.dispose(),ci(this.input)&&(this.input instanceof wo?this.input.dispose():bi(this.input)&&this.input.disconnect()),ci(this.output)&&(this.output instanceof wo?this.output.dispose():bi(this.output)&&this.output.disconnect()),this._internalChannels=[],this}}function bo(...t){const e=t.shift();t.reduce((t,e)=>(t instanceof wo?t.connect(e):bi(t)&&To(t,e),e),e)}function To(t,e,s=0,n=0){for(ti(ci(t),"Cannot connect from undefined node"),ti(ci(e),"Cannot connect to undefined node"),(e instanceof wo||bi(e))&&ti(e.numberOfInputs>0,"Cannot connect to node with no inputs"),ti(t.numberOfOutputs>0,"Cannot connect from node with no outputs");e instanceof wo||e instanceof xo;)ci(e.input)&&(e=e.input);for(;t instanceof wo;)ci(t.output)&&(t=t.output);wi(e)?t.connect(e,s):t.connect(e,s,n)}function So(t,e,s=0,n=0){if(ci(e))for(;e instanceof wo;)e=e.input;for(;!bi(t);)ci(t.output)&&(t=t.output);wi(e)?t.disconnect(e,s):bi(e)?t.disconnect(e,s,n):t.disconnect()}class ko extends wo{constructor(){super(Di(ko.getDefaults(),arguments,["gain","units"])),this.name="Gain",this._gainNode=this.context.createGain(),this.input=this._gainNode,this.output=this._gainNode;const t=Di(ko.getDefaults(),arguments,["gain","units"]);this.gain=new xo({context:this.context,convert:t.convert,param:this._gainNode.gain,units:t.units,value:t.gain,minValue:t.minValue,maxValue:t.maxValue}),Ui(this,"gain")}static getDefaults(){return Object.assign(wo.getDefaults(),{convert:!0,gain:1,units:"gain"})}dispose(){return super.dispose(),this._gainNode.disconnect(),this.gain.dispose(),this}}class Co extends wo{constructor(t){super(t),this.onended=Zi,this._startTime=-1,this._stopTime=-1,this._timeout=-1,this.output=new ko({context:this.context,gain:0}),this._gainNode=this.output,this.getStateAtTime=function(t){const e=this.toSeconds(t);return-1!==this._startTime&&e>=this._startTime&&(-1===this._stopTime||e<=this._stopTime)?"started":"stopped"},this._fadeIn=t.fadeIn,this._fadeOut=t.fadeOut,this._curve=t.curve,this.onended=t.onended}static getDefaults(){return Object.assign(wo.getDefaults(),{curve:"linear",fadeIn:0,fadeOut:0,onended:Zi})}_startGain(t,e=1){ti(-1===this._startTime,"Source cannot be started more than once");const s=this.toSeconds(this._fadeIn);return this._startTime=t+s,this._startTime=Math.max(this._startTime,this.context.currentTime),s>0?(this._gainNode.gain.setValueAtTime(0,t),"linear"===this._curve?this._gainNode.gain.linearRampToValueAtTime(e,t+s):this._gainNode.gain.exponentialApproachValueAtTime(e,t,s)):this._gainNode.gain.setValueAtTime(e,t),this}stop(t){return this.log("stop",t),this._stopGain(this.toSeconds(t)),this}_stopGain(t){ti(-1!==this._startTime,"'start' must be called before 'stop'"),this.cancelStop();const e=this.toSeconds(this._fadeOut);return this._stopTime=this.toSeconds(t)+e,this._stopTime=Math.max(this._stopTime,this.context.currentTime),e>0?"linear"===this._curve?this._gainNode.gain.linearRampTo(0,e,t):this._gainNode.gain.targetRampTo(0,e,t):(this._gainNode.gain.cancelAndHoldAtTime(t),this._gainNode.gain.setValueAtTime(0,t)),this.context.clearTimeout(this._timeout),this._timeout=this.context.setTimeout(()=>{const t="exponential"===this._curve?2*e:0;this._stopSource(this.now()+t),this._onended()},this._stopTime-this.context.currentTime),this}_onended(){if(this.onended!==Zi&&(this.onended(this),this.onended=Zi,!this.context.isOffline)){const t=()=>this.dispose();void 0!==window.requestIdleCallback?window.requestIdleCallback(t):setTimeout(t,1e3)}}get state(){return this.getStateAtTime(this.now())}cancelStop(){return this.log("cancelStop"),ti(-1!==this._startTime,"Source is not started"),this._gainNode.gain.cancelScheduledValues(this._startTime+this.sampleTime),this.context.clearTimeout(this._timeout),this._stopTime=-1,this}dispose(){return super.dispose(),this._gainNode.disconnect(),this}}class Ao extends Co{constructor(){super(Di(Ao.getDefaults(),arguments,["offset"])),this.name="ToneConstantSource",this._source=this.context.createConstantSource();const t=Di(Ao.getDefaults(),arguments,["offset"]);To(this._source,this._gainNode),this.offset=new xo({context:this.context,convert:t.convert,param:this._source.offset,units:t.units,value:t.offset,minValue:t.minValue,maxValue:t.maxValue})}static getDefaults(){return Object.assign(Co.getDefaults(),{convert:!0,offset:1,units:"number"})}start(t){const e=this.toSeconds(t);return this.log("start",e),this._startGain(e),this._source.start(e),this}_stopSource(t){this._source.stop(t)}dispose(){return super.dispose(),"started"===this.state&&this.stop(),this._source.disconnect(),this.offset.dispose(),this}}class Do extends wo{constructor(){super(Di(Do.getDefaults(),arguments,["value","units"])),this.name="Signal",this.override=!0;const t=Di(Do.getDefaults(),arguments,["value","units"]);this.output=this._constantSource=new Ao({context:this.context,convert:t.convert,offset:t.value,units:t.units,minValue:t.minValue,maxValue:t.maxValue}),this._constantSource.start(0),this.input=this._param=this._constantSource.offset}static getDefaults(){return Object.assign(wo.getDefaults(),{convert:!0,units:"number",value:0})}connect(t,e=0,s=0){return Oo(this,t,e,s),this}dispose(){return super.dispose(),this._param.dispose(),this._constantSource.dispose(),this}setValueAtTime(t,e){return this._param.setValueAtTime(t,e),this}getValueAtTime(t){return this._param.getValueAtTime(t)}setRampPoint(t){return this._param.setRampPoint(t),this}linearRampToValueAtTime(t,e){return this._param.linearRampToValueAtTime(t,e),this}exponentialRampToValueAtTime(t,e){return this._param.exponentialRampToValueAtTime(t,e),this}exponentialRampTo(t,e,s){return this._param.exponentialRampTo(t,e,s),this}linearRampTo(t,e,s){return this._param.linearRampTo(t,e,s),this}targetRampTo(t,e,s){return this._param.targetRampTo(t,e,s),this}exponentialApproachValueAtTime(t,e,s){return this._param.exponentialApproachValueAtTime(t,e,s),this}setTargetAtTime(t,e,s){return this._param.setTargetAtTime(t,e,s),this}setValueCurveAtTime(t,e,s,n){return this._param.setValueCurveAtTime(t,e,s,n),this}cancelScheduledValues(t){return this._param.cancelScheduledValues(t),this}cancelAndHoldAtTime(t){return this._param.cancelAndHoldAtTime(t),this}rampTo(t,e,s){return this._param.rampTo(t,e,s),this}get value(){return this._param.value}set value(t){this._param.value=t}get convert(){return this._param.convert}set convert(t){this._param.convert=t}get units(){return this._param.units}get overridden(){return this._param.overridden}set overridden(t){this._param.overridden=t}get maxValue(){return this._param.maxValue}get minValue(){return this._param.minValue}apply(t){return this._param.apply(t),this}}function Oo(t,e,s,n){(e instanceof xo||wi(e)||e instanceof Do&&e.override)&&(e.cancelScheduledValues(0),e.setValueAtTime(0,0),e instanceof Do&&(e.overridden=!0)),To(t,e,s,n)}class Mo extends xo{constructor(){super(Di(Mo.getDefaults(),arguments,["value"])),this.name="TickParam",this._events=new Ni(1/0),this._multiplier=1;const t=Di(Mo.getDefaults(),arguments,["value"]);this._multiplier=t.multiplier,this._events.cancel(0),this._events.add({ticks:0,time:0,type:"setValueAtTime",value:this._fromType(t.value)}),this.setValueAtTime(t.value,0)}static getDefaults(){return Object.assign(xo.getDefaults(),{multiplier:1,units:"hertz",value:1})}setTargetAtTime(t,e,s){e=this.toSeconds(e),this.setRampPoint(e);const n=this._fromType(t),i=this._events.get(e),o=Math.round(Math.max(1/s,1));for(let t=0;t<=o;t++){const o=s*t+e,r=this._exponentialApproach(i.time,i.value,n,s,o);this.linearRampToValueAtTime(this._toType(r),o)}return this}setValueAtTime(t,e){const s=this.toSeconds(e);super.setValueAtTime(t,e);const n=this._events.get(s),i=this._events.previousEvent(n),o=this._getTicksUntilEvent(i,s);return n.ticks=Math.max(o,0),this}linearRampToValueAtTime(t,e){const s=this.toSeconds(e);super.linearRampToValueAtTime(t,e);const n=this._events.get(s),i=this._events.previousEvent(n),o=this._getTicksUntilEvent(i,s);return n.ticks=Math.max(o,0),this}exponentialRampToValueAtTime(t,e){e=this.toSeconds(e);const s=this._fromType(t),n=this._events.get(e),i=Math.round(Math.max(10*(e-n.time),1)),o=(e-n.time)/i;for(let t=0;t<=i;t++){const i=o*t+n.time,r=this._exponentialInterpolate(n.time,n.value,e,s,i);this.linearRampToValueAtTime(this._toType(r),i)}return this}_getTicksUntilEvent(t,e){if(null===t)t={ticks:0,time:0,type:"setValueAtTime",value:0};else if(ai(t.ticks)){const e=this._events.previousEvent(t);t.ticks=this._getTicksUntilEvent(e,t.time)}const s=this._fromType(this.getValueAtTime(t.time));let n=this._fromType(this.getValueAtTime(e));const i=this._events.get(e);return i&&i.time===e&&"setValueAtTime"===i.type&&(n=this._fromType(this.getValueAtTime(e-this.sampleTime))),.5*(e-t.time)*(s+n)+t.ticks}getTicksAtTime(t){const e=this.toSeconds(t),s=this._events.get(e);return Math.max(this._getTicksUntilEvent(s,e),0)}getDurationOfTicks(t,e){const s=this.toSeconds(e),n=this.getTicksAtTime(e);return this.getTimeOfTick(n+t)-s}getTimeOfTick(t){const e=this._events.get(t,"ticks"),s=this._events.getAfter(t,"ticks");if(e&&e.ticks===t)return e.time;if(e&&s&&"linearRampToValueAtTime"===s.type&&e.value!==s.value){const n=this._fromType(this.getValueAtTime(e.time)),i=(this._fromType(this.getValueAtTime(s.time))-n)/(s.time-e.time),o=Math.sqrt(Math.pow(n,2)-2*i*(e.ticks-t)),r=(-n+o)/i,a=(-n-o)/i;return(r>0?r:a)+e.time}return e?0===e.value?1/0:e.time+(t-e.ticks)/e.value:t/this._initialValue}ticksToTime(t,e){return this.getDurationOfTicks(t,e)}timeToTicks(t,e){const s=this.toSeconds(e),n=this.toSeconds(t),i=this.getTicksAtTime(s);return this.getTicksAtTime(s+n)-i}_fromType(t){return"bpm"===this.units&&this.multiplier?1/(60/t/this.multiplier):super._fromType(t)}_toType(t){return"bpm"===this.units&&this.multiplier?t/this.multiplier*60:super._toType(t)}get multiplier(){return this._multiplier}set multiplier(t){const e=this.value;this._multiplier=t,this.cancelScheduledValues(0),this.setValueAtTime(e,0)}}class Eo extends Do{constructor(){super(Di(Eo.getDefaults(),arguments,["value"])),this.name="TickSignal";const t=Di(Eo.getDefaults(),arguments,["value"]);this.input=this._param=new Mo({context:this.context,convert:t.convert,multiplier:t.multiplier,param:this._constantSource.offset,units:t.units,value:t.value})}static getDefaults(){return Object.assign(Do.getDefaults(),{multiplier:1,units:"hertz",value:1})}ticksToTime(t,e){return this._param.ticksToTime(t,e)}timeToTicks(t,e){return this._param.timeToTicks(t,e)}getTimeOfTick(t){return this._param.getTimeOfTick(t)}getDurationOfTicks(t,e){return this._param.getDurationOfTicks(t,e)}getTicksAtTime(t){return this._param.getTicksAtTime(t)}get multiplier(){return this._param.multiplier}set multiplier(t){this._param.multiplier=t}dispose(){return super.dispose(),this._param.dispose(),this}}class Ro extends vo{constructor(){super(Di(Ro.getDefaults(),arguments,["frequency"])),this.name="TickSource",this._state=new yo,this._tickOffset=new Ni;const t=Di(Ro.getDefaults(),arguments,["frequency"]);this.frequency=new Eo({context:this.context,units:t.units,value:t.frequency}),Ui(this,"frequency"),this._state.setStateAtTime("stopped",0),this.setTicksAtTime(0,0)}static getDefaults(){return Object.assign({frequency:1,units:"hertz"},vo.getDefaults())}get state(){return this.getStateAtTime(this.now())}start(t,e){const s=this.toSeconds(t);return"started"!==this._state.getValueAtTime(s)&&(this._state.setStateAtTime("started",s),ci(e)&&this.setTicksAtTime(e,s)),this}stop(t){const e=this.toSeconds(t);if("stopped"===this._state.getValueAtTime(e)){const t=this._state.get(e);t&&t.time>0&&(this._tickOffset.cancel(t.time),this._state.cancel(t.time))}return this._state.cancel(e),this._state.setStateAtTime("stopped",e),this.setTicksAtTime(0,e),this}pause(t){const e=this.toSeconds(t);return"started"===this._state.getValueAtTime(e)&&this._state.setStateAtTime("paused",e),this}cancel(t){return t=this.toSeconds(t),this._state.cancel(t),this._tickOffset.cancel(t),this}getTicksAtTime(t){const e=this.toSeconds(t),s=this._state.getLastState("stopped",e),n={state:"paused",time:e};this._state.add(n);let i=s,o=0;return this._state.forEachBetween(s.time,e+this.sampleTime,t=>{let e=i.time;const s=this._tickOffset.get(t.time);s&&s.time>=i.time&&(o=s.ticks,e=s.time),"started"===i.state&&"started"!==t.state&&(o+=this.frequency.getTicksAtTime(t.time)-this.frequency.getTicksAtTime(e)),i=t}),this._state.remove(n),o}get ticks(){return this.getTicksAtTime(this.now())}set ticks(t){this.setTicksAtTime(t,this.now())}get seconds(){return this.getSecondsAtTime(this.now())}set seconds(t){const e=this.now(),s=this.frequency.timeToTicks(t,e);this.setTicksAtTime(s,e)}getSecondsAtTime(t){t=this.toSeconds(t);const e=this._state.getLastState("stopped",t),s={state:"paused",time:t};this._state.add(s);let n=e,i=0;return this._state.forEachBetween(e.time,t+this.sampleTime,t=>{let e=n.time;const s=this._tickOffset.get(t.time);s&&s.time>=n.time&&(i=s.seconds,e=s.time),"started"===n.state&&"started"!==t.state&&(i+=t.time-e),n=t}),this._state.remove(s),i}setTicksAtTime(t,e){return e=this.toSeconds(e),this._tickOffset.cancel(e),this._tickOffset.add({seconds:this.frequency.getDurationOfTicks(t,e),ticks:t,time:e}),this}getStateAtTime(t){return t=this.toSeconds(t),this._state.getValueAtTime(t)}getTimeOfTick(t,e=this.now()){const s=this._tickOffset.get(e),n=this._state.get(e),i=Math.max(s.time,n.time),o=this.frequency.getTicksAtTime(i)+t-s.ticks;return this.frequency.getTimeOfTick(o)}forEachTickBetween(t,e,s){let n=this._state.get(t);this._state.forEachBetween(t,e,e=>{n&&"started"===n.state&&"started"!==e.state&&this.forEachTickBetween(Math.max(n.time,t),e.time-this.sampleTime,s),n=e});let i=null;if(n&&"started"===n.state){const o=Math.max(n.time,t),r=this.frequency.getTicksAtTime(o),a=r-this.frequency.getTicksAtTime(n.time);let c=Math.ceil(a)-a;c=Ii(c,1)?0:c;let h=this.frequency.getTimeOfTick(r+c);for(;h<e;){try{s(h,Math.round(this.getTicksAtTime(h)))}catch(t){i=t;break}h+=this.frequency.getDurationOfTicks(1,h)}}if(i)throw i;return this}dispose(){return super.dispose(),this._state.dispose(),this._tickOffset.dispose(),this.frequency.dispose(),this}}class qo extends vo{constructor(){super(Di(qo.getDefaults(),arguments,["callback","frequency"])),this.name="Clock",this.callback=Zi,this._lastUpdate=0,this._state=new yo("stopped"),this._boundLoop=this._loop.bind(this);const t=Di(qo.getDefaults(),arguments,["callback","frequency"]);this.callback=t.callback,this._tickSource=new Ro({context:this.context,frequency:t.frequency,units:t.units}),this._lastUpdate=0,this.frequency=this._tickSource.frequency,Ui(this,"frequency"),this._state.setStateAtTime("stopped",0),this.context.on("tick",this._boundLoop)}static getDefaults(){return Object.assign(vo.getDefaults(),{callback:Zi,frequency:1,units:"hertz"})}get state(){return this._state.getValueAtTime(this.now())}start(t,e){si(this.context);const s=this.toSeconds(t);return this.log("start",s),"started"!==this._state.getValueAtTime(s)&&(this._state.setStateAtTime("started",s),this._tickSource.start(s,e),s<this._lastUpdate&&this.emit("start",s,e)),this}stop(t){const e=this.toSeconds(t);return this.log("stop",e),this._state.cancel(e),this._state.setStateAtTime("stopped",e),this._tickSource.stop(e),e<this._lastUpdate&&this.emit("stop",e),this}pause(t){const e=this.toSeconds(t);return"started"===this._state.getValueAtTime(e)&&(this._state.setStateAtTime("paused",e),this._tickSource.pause(e),e<this._lastUpdate&&this.emit("pause",e)),this}get ticks(){return Math.ceil(this.getTicksAtTime(this.now()))}set ticks(t){this._tickSource.ticks=t}get seconds(){return this._tickSource.seconds}set seconds(t){this._tickSource.seconds=t}getSecondsAtTime(t){return this._tickSource.getSecondsAtTime(t)}setTicksAtTime(t,e){return this._tickSource.setTicksAtTime(t,e),this}getTimeOfTick(t,e=this.now()){return this._tickSource.getTimeOfTick(t,e)}getTicksAtTime(t){return this._tickSource.getTicksAtTime(t)}nextTickTime(t,e){const s=this.toSeconds(e),n=this.getTicksAtTime(s);return this._tickSource.getTimeOfTick(n+t,s)}_loop(){const t=this._lastUpdate,e=this.now();this._lastUpdate=e,this.log("loop",t,e),t!==e&&(this._state.forEachBetween(t,e,t=>{switch(t.state){case"started":const e=this._tickSource.getTicksAtTime(t.time);this.emit("start",t.time,e);break;case"stopped":0!==t.time&&this.emit("stop",t.time);break;case"paused":this.emit("pause",t.time)}}),this._tickSource.forEachTickBetween(t,e,(t,e)=>{this.callback(t,e)}))}getStateAtTime(t){const e=this.toSeconds(t);return this._state.getValueAtTime(e)}dispose(){return super.dispose(),this.context.off("tick",this._boundLoop),this._tickSource.dispose(),this._state.dispose(),this}}Bi.mixin(qo);class Fo extends wo{constructor(){super(Di(Fo.getDefaults(),arguments,["delayTime","maxDelay"])),this.name="Delay";const t=Di(Fo.getDefaults(),arguments,["delayTime","maxDelay"]),e=this.toSeconds(t.maxDelay);this._maxDelay=Math.max(e,this.toSeconds(t.delayTime)),this._delayNode=this.input=this.output=this.context.createDelay(e),this.delayTime=new xo({context:this.context,param:this._delayNode.delayTime,units:"time",value:t.delayTime,minValue:0,maxValue:this.maxDelay}),Ui(this,"delayTime")}static getDefaults(){return Object.assign(wo.getDefaults(),{delayTime:0,maxDelay:1})}get maxDelay(){return this._maxDelay}dispose(){return super.dispose(),this._delayNode.disconnect(),this.delayTime.dispose(),this}}function Io(t,e,s=2,n=Ji().sampleRate){return yi(this,void 0,void 0,(function*(){const i=Ji(),o=new Yi(s,e,n);Ki(o),yield t(o);const r=o.render();Ki(i);const a=yield r;return new Xi(a)}))}class Vo extends Ei{constructor(){super(),this.name="ToneAudioBuffers",this._buffers=new Map,this._loadingCount=0;const t=Di(Vo.getDefaults(),arguments,["urls","onload","baseUrl"],"urls");this.baseUrl=t.baseUrl,Object.keys(t.urls).forEach(e=>{this._loadingCount++;const s=t.urls[e];this.add(e,s,this._bufferLoaded.bind(this,t.onload),t.onerror)})}static getDefaults(){return{baseUrl:"",onerror:Zi,onload:Zi,urls:{}}}has(t){return this._buffers.has(t.toString())}get(t){return ti(this.has(t),"ToneAudioBuffers has no buffer named: "+t),this._buffers.get(t.toString())}_bufferLoaded(t){this._loadingCount--,0===this._loadingCount&&t&&t()}get loaded(){return Array.from(this._buffers).every(([t,e])=>e.loaded)}add(t,e,s=Zi,n=Zi){return fi(e)?this._buffers.set(t.toString(),new Xi(this.baseUrl+e,s,n)):this._buffers.set(t.toString(),new Xi(e,s,n)),this}dispose(){return super.dispose(),this._buffers.forEach(t=>t.dispose()),this._buffers.clear(),this}}class No extends lo{constructor(){super(...arguments),this.name="MidiClass",this.defaultUnits="midi"}_frequencyToUnits(t){return oo(super._frequencyToUnits(t))}_ticksToUnits(t){return oo(super._ticksToUnits(t))}_beatsToUnits(t){return oo(super._beatsToUnits(t))}_secondsToUnits(t){return oo(super._secondsToUnits(t))}toMidi(){return this.valueOf()}toFrequency(){return ao(this.toMidi())}transpose(t){return new No(this.context,this.toMidi()+t)}}function Po(t,e){return new No(Ji(),t,e)}class jo extends mo{constructor(){super(...arguments),this.name="Ticks",this.defaultUnits="i"}_now(){return this.context.transport.ticks}_beatsToUnits(t){return this._getPPQ()*t}_secondsToUnits(t){return Math.floor(t/(60/this._getBpm())*this._getPPQ())}_ticksToUnits(t){return t}toTicks(){return this.valueOf()}toSeconds(){return this.valueOf()/this._getPPQ()*(60/this._getBpm())}}function Lo(t,e){return new jo(Ji(),t,e)}class zo extends vo{constructor(){super(...arguments),this.name="Draw",this.expiration=.25,this.anticipation=.008,this._events=new Ni,this._boundDrawLoop=this._drawLoop.bind(this),this._animationFrame=-1}schedule(t,e){return this._events.add({callback:t,time:this.toSeconds(e)}),1===this._events.length&&(this._animationFrame=requestAnimationFrame(this._boundDrawLoop)),this}cancel(t){return this._events.cancel(this.toSeconds(t)),this}_drawLoop(){const t=this.context.currentTime;for(;this._events.length&&this._events.peek().time-this.anticipation<=t;){const e=this._events.shift();e&&t-e.time<=this.expiration&&e.callback()}this._events.length>0&&(this._animationFrame=requestAnimationFrame(this._boundDrawLoop))}dispose(){return super.dispose(),this._events.dispose(),cancelAnimationFrame(this._animationFrame),this}}ji(t=>{t.draw=new zo({context:t})}),zi(t=>{t.draw.dispose()});class Bo extends Ei{constructor(){super(...arguments),this.name="IntervalTimeline",this._root=null,this._length=0}add(t){ti(ci(t.time),"Events must have a time property"),ti(ci(t.duration),"Events must have a duration parameter"),t.time=t.time.valueOf();let e=new Wo(t.time,t.time+t.duration,t);for(null===this._root?this._root=e:this._root.insert(e),this._length++;null!==e;)e.updateHeight(),e.updateMax(),this._rebalance(e),e=e.parent;return this}remove(t){if(null!==this._root){const e=[];this._root.search(t.time,e);for(const s of e)if(s.event===t){this._removeNode(s),this._length--;break}}return this}get length(){return this._length}cancel(t){return this.forEachFrom(t,t=>this.remove(t)),this}_setRoot(t){this._root=t,null!==this._root&&(this._root.parent=null)}_replaceNodeInParent(t,e){null!==t.parent?(t.isLeftChild()?t.parent.left=e:t.parent.right=e,this._rebalance(t.parent)):this._setRoot(e)}_removeNode(t){if(null===t.left&&null===t.right)this._replaceNodeInParent(t,null);else if(null===t.right)this._replaceNodeInParent(t,t.left);else if(null===t.left)this._replaceNodeInParent(t,t.right);else{let e,s=null;if(t.getBalance()>0)if(null===t.left.right)e=t.left,e.right=t.right,s=e;else{for(e=t.left.right;null!==e.right;)e=e.right;e.parent&&(e.parent.right=e.left,s=e.parent,e.left=t.left,e.right=t.right)}else if(null===t.right.left)e=t.right,e.left=t.left,s=e;else{for(e=t.right.left;null!==e.left;)e=e.left;e.parent&&(e.parent.left=e.right,s=e.parent,e.left=t.left,e.right=t.right)}null!==t.parent?t.isLeftChild()?t.parent.left=e:t.parent.right=e:this._setRoot(e),s&&this._rebalance(s)}t.dispose()}_rotateLeft(t){const e=t.parent,s=t.isLeftChild(),n=t.right;n&&(t.right=n.left,n.left=t),null!==e?s?e.left=n:e.right=n:this._setRoot(n)}_rotateRight(t){const e=t.parent,s=t.isLeftChild(),n=t.left;n&&(t.left=n.right,n.right=t),null!==e?s?e.left=n:e.right=n:this._setRoot(n)}_rebalance(t){const e=t.getBalance();e>1&&t.left?t.left.getBalance()<0?this._rotateLeft(t.left):this._rotateRight(t):e<-1&&t.right&&(t.right.getBalance()>0?this._rotateRight(t.right):this._rotateLeft(t))}get(t){if(null!==this._root){const e=[];if(this._root.search(t,e),e.length>0){let t=e[0];for(let s=1;s<e.length;s++)e[s].low>t.low&&(t=e[s]);return t.event}}return null}forEach(t){if(null!==this._root){const e=[];this._root.traverse(t=>e.push(t)),e.forEach(e=>{e.event&&t(e.event)})}return this}forEachAtTime(t,e){if(null!==this._root){const s=[];this._root.search(t,s),s.forEach(t=>{t.event&&e(t.event)})}return this}forEachFrom(t,e){if(null!==this._root){const s=[];this._root.searchAfter(t,s),s.forEach(t=>{t.event&&e(t.event)})}return this}dispose(){return super.dispose(),null!==this._root&&this._root.traverse(t=>t.dispose()),this._root=null,this}}class Wo{constructor(t,e,s){this._left=null,this._right=null,this.parent=null,this.height=0,this.event=s,this.low=t,this.high=e,this.max=this.high}insert(t){t.low<=this.low?null===this.left?this.left=t:this.left.insert(t):null===this.right?this.right=t:this.right.insert(t)}search(t,e){t>this.max||(null!==this.left&&this.left.search(t,e),this.low<=t&&this.high>t&&e.push(this),this.low>t||null!==this.right&&this.right.search(t,e))}searchAfter(t,e){this.low>=t&&(e.push(this),null!==this.left&&this.left.searchAfter(t,e)),null!==this.right&&this.right.searchAfter(t,e)}traverse(t){t(this),null!==this.left&&this.left.traverse(t),null!==this.right&&this.right.traverse(t)}updateHeight(){null!==this.left&&null!==this.right?this.height=Math.max(this.left.height,this.right.height)+1:null!==this.right?this.height=this.right.height+1:null!==this.left?this.height=this.left.height+1:this.height=0}updateMax(){this.max=this.high,null!==this.left&&(this.max=Math.max(this.max,this.left.max)),null!==this.right&&(this.max=Math.max(this.max,this.right.max))}getBalance(){let t=0;return null!==this.left&&null!==this.right?t=this.left.height-this.right.height:null!==this.left?t=this.left.height+1:null!==this.right&&(t=-(this.right.height+1)),t}isLeftChild(){return null!==this.parent&&this.parent.left===this}get left(){return this._left}set left(t){this._left=t,null!==t&&(t.parent=this),this.updateHeight(),this.updateMax()}get right(){return this._right}set right(t){this._right=t,null!==t&&(t.parent=this),this.updateHeight(),this.updateMax()}dispose(){this.parent=null,this._left=null,this._right=null,this.event=null}}class Go extends wo{constructor(){super(Di(Go.getDefaults(),arguments,["volume"])),this.name="Volume";const t=Di(Go.getDefaults(),arguments,["volume"]);this.input=this.output=new ko({context:this.context,gain:t.volume,units:"decibels"}),this.volume=this.output.gain,Ui(this,"volume"),this._unmutedVolume=t.volume,this.mute=t.mute}static getDefaults(){return Object.assign(wo.getDefaults(),{mute:!1,volume:0})}get mute(){return this.volume.value===-1/0}set mute(t){!this.mute&&t?(this._unmutedVolume=this.volume.value,this.volume.value=-1/0):this.mute&&!t&&(this.volume.value=this._unmutedVolume)}dispose(){return super.dispose(),this.input.dispose(),this.volume.dispose(),this}}class Uo extends wo{constructor(){super(Di(Uo.getDefaults(),arguments)),this.name="Destination",this.input=new Go({context:this.context}),this.output=new ko({context:this.context}),this.volume=this.input.volume;const t=Di(Uo.getDefaults(),arguments);bo(this.input,this.output,this.context.rawContext.destination),this.mute=t.mute,this._internalChannels=[this.input,this.context.rawContext.destination,this.output]}static getDefaults(){return Object.assign(wo.getDefaults(),{mute:!1,volume:0})}get mute(){return this.input.mute}set mute(t){this.input.mute=t}chain(...t){return this.input.disconnect(),t.unshift(this.input),t.push(this.output),bo(...t),this}get maxChannelCount(){return this.context.rawContext.destination.maxChannelCount}dispose(){return super.dispose(),this.volume.dispose(),this}}ji(t=>{t.destination=new Uo({context:t})}),zi(t=>{t.destination.dispose()});class Qo extends Ei{constructor(t){super(),this.name="TimelineValue",this._timeline=new Ni({memory:10}),this._initialValue=t}set(t,e){return this._timeline.add({value:t,time:e}),this}get(t){const e=this._timeline.get(t);return e?e.value:this._initialValue}}class Zo{constructor(t,e){this.id=Zo._eventId++;const s=Object.assign(Zo.getDefaults(),e);this.transport=t,this.callback=s.callback,this._once=s.once,this.time=s.time}static getDefaults(){return{callback:Zi,once:!1,time:0}}invoke(t){this.callback&&(this.callback(t),this._once&&this.transport.clear(this.id))}dispose(){return this.callback=void 0,this}}Zo._eventId=0;class Xo extends Zo{constructor(t,e){super(t,e),this._currentId=-1,this._nextId=-1,this._nextTick=this.time,this._boundRestart=this._restart.bind(this);const s=Object.assign(Xo.getDefaults(),e);this.duration=new jo(t.context,s.duration).valueOf(),this._interval=new jo(t.context,s.interval).valueOf(),this._nextTick=s.time,this.transport.on("start",this._boundRestart),this.transport.on("loopStart",this._boundRestart),this.context=this.transport.context,this._restart()}static getDefaults(){return Object.assign({},Zo.getDefaults(),{duration:1/0,interval:1,once:!1})}invoke(t){this._createEvents(t),super.invoke(t)}_createEvents(t){const e=this.transport.getTicksAtTime(t);e>=this.time&&e>=this._nextTick&&this._nextTick+this._interval<this.time+this.duration&&(this._nextTick+=this._interval,this._currentId=this._nextId,this._nextId=this.transport.scheduleOnce(this.invoke.bind(this),new jo(this.context,this._nextTick).toSeconds()))}_restart(t){this.transport.clear(this._currentId),this.transport.clear(this._nextId),this._nextTick=this.time;const e=this.transport.getTicksAtTime(t);e>this.time&&(this._nextTick=this.time+Math.ceil((e-this.time)/this._interval)*this._interval),this._currentId=this.transport.scheduleOnce(this.invoke.bind(this),new jo(this.context,this._nextTick).toSeconds()),this._nextTick+=this._interval,this._nextId=this.transport.scheduleOnce(this.invoke.bind(this),new jo(this.context,this._nextTick).toSeconds())}dispose(){return super.dispose(),this.transport.clear(this._currentId),this.transport.clear(this._nextId),this.transport.off("start",this._boundRestart),this.transport.off("loopStart",this._boundRestart),this}}class Yo extends vo{constructor(){super(Di(Yo.getDefaults(),arguments)),this.name="Transport",this._loop=new Qo(!1),this._loopStart=0,this._loopEnd=0,this._scheduledEvents={},this._timeline=new Ni,this._repeatedEvents=new Bo,this._syncedSignals=[],this._swingAmount=0;const t=Di(Yo.getDefaults(),arguments);this._ppq=t.ppq,this._clock=new qo({callback:this._processTick.bind(this),context:this.context,frequency:0,units:"bpm"}),this._bindClockEvents(),this.bpm=this._clock.frequency,this._clock.frequency.multiplier=t.ppq,this.bpm.setValueAtTime(t.bpm,0),Ui(this,"bpm"),this._timeSignature=t.timeSignature,this._swingTicks=t.ppq/2}static getDefaults(){return Object.assign(vo.getDefaults(),{bpm:120,loopEnd:"4m",loopStart:0,ppq:192,swing:0,swingSubdivision:"8n",timeSignature:4})}_processTick(t,e){if(this._loop.get(t)&&e>=this._loopEnd&&(this.emit("loopEnd",t),this._clock.setTicksAtTime(this._loopStart,t),e=this._loopStart,this.emit("loopStart",t,this._clock.getSecondsAtTime(t)),this.emit("loop",t)),this._swingAmount>0&&e%this._ppq!=0&&e%(2*this._swingTicks)!=0){const s=e%(2*this._swingTicks)/(2*this._swingTicks),n=Math.sin(s*Math.PI)*this._swingAmount;t+=new jo(this.context,2*this._swingTicks/3).toSeconds()*n}this._timeline.forEachAtTime(e,e=>e.invoke(t))}schedule(t,e){const s=new Zo(this,{callback:t,time:new mo(this.context,e).toTicks()});return this._addEvent(s,this._timeline)}scheduleRepeat(t,e,s,n=1/0){const i=new Xo(this,{callback:t,duration:new ho(this.context,n).toTicks(),interval:new ho(this.context,e).toTicks(),time:new mo(this.context,s).toTicks()});return this._addEvent(i,this._repeatedEvents)}scheduleOnce(t,e){const s=new Zo(this,{callback:t,once:!0,time:new mo(this.context,e).toTicks()});return this._addEvent(s,this._timeline)}clear(t){if(this._scheduledEvents.hasOwnProperty(t)){const e=this._scheduledEvents[t.toString()];e.timeline.remove(e.event),e.event.dispose(),delete this._scheduledEvents[t.toString()]}return this}_addEvent(t,e){return this._scheduledEvents[t.id.toString()]={event:t,timeline:e},e.add(t),t.id}cancel(t=0){const e=this.toTicks(t);return this._timeline.forEachFrom(e,t=>this.clear(t.id)),this._repeatedEvents.forEachFrom(e,t=>this.clear(t.id)),this}_bindClockEvents(){this._clock.on("start",(t,e)=>{e=new jo(this.context,e).toSeconds(),this.emit("start",t,e)}),this._clock.on("stop",t=>{this.emit("stop",t)}),this._clock.on("pause",t=>{this.emit("pause",t)})}get state(){return this._clock.getStateAtTime(this.now())}start(t,e){let s;return ci(e)&&(s=this.toTicks(e)),this._clock.start(t,s),this}stop(t){return this._clock.stop(t),this}pause(t){return this._clock.pause(t),this}toggle(t){return t=this.toSeconds(t),"started"!==this._clock.getStateAtTime(t)?this.start(t):this.stop(t),this}get timeSignature(){return this._timeSignature}set timeSignature(t){di(t)&&(t=t[0]/t[1]*4),this._timeSignature=t}get loopStart(){return new ho(this.context,this._loopStart,"i").toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t)}get loopEnd(){return new ho(this.context,this._loopEnd,"i").toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t)}get loop(){return this._loop.get(this.now())}set loop(t){this._loop.set(t,this.now())}setLoopPoints(t,e){return this.loopStart=t,this.loopEnd=e,this}get swing(){return this._swingAmount}set swing(t){this._swingAmount=t}get swingSubdivision(){return new jo(this.context,this._swingTicks).toNotation()}set swingSubdivision(t){this._swingTicks=this.toTicks(t)}get position(){const t=this.now(),e=this._clock.getTicksAtTime(t);return new jo(this.context,e).toBarsBeatsSixteenths()}set position(t){const e=this.toTicks(t);this.ticks=e}get seconds(){return this._clock.seconds}set seconds(t){const e=this.now(),s=this._clock.frequency.timeToTicks(t,e);this.ticks=s}get progress(){if(this.loop){const t=this.now();return(this._clock.getTicksAtTime(t)-this._loopStart)/(this._loopEnd-this._loopStart)}return 0}get ticks(){return this._clock.ticks}set ticks(t){if(this._clock.ticks!==t){const e=this.now();if("started"===this.state){const s=this._clock.getTicksAtTime(e),n=e+this._clock.frequency.getDurationOfTicks(Math.ceil(s)-s,e);this.emit("stop",n),this._clock.setTicksAtTime(t,n),this.emit("start",n,this._clock.getSecondsAtTime(n))}else this._clock.setTicksAtTime(t,e)}}getTicksAtTime(t){return Math.round(this._clock.getTicksAtTime(t))}getSecondsAtTime(t){return this._clock.getSecondsAtTime(t)}get PPQ(){return this._clock.frequency.multiplier}set PPQ(t){this._clock.frequency.multiplier=t}nextSubdivision(t){if(t=this.toTicks(t),"started"!==this.state)return 0;{const e=this.now(),s=t-this.getTicksAtTime(e)%t;return this._clock.nextTickTime(s,e)}}syncSignal(t,e){if(!e){const s=this.now();if(0!==t.getValueAtTime(s)){const n=1/(60/this.bpm.getValueAtTime(s)/this.PPQ);e=t.getValueAtTime(s)/n}else e=0}const s=new ko(e);return this.bpm.connect(s),s.connect(t._param),this._syncedSignals.push({initial:t.value,ratio:s,signal:t}),t.value=0,this}unsyncSignal(t){for(let e=this._syncedSignals.length-1;e>=0;e--){const s=this._syncedSignals[e];s.signal===t&&(s.ratio.dispose(),s.signal.value=s.initial,this._syncedSignals.splice(e,1))}return this}dispose(){return super.dispose(),this._clock.dispose(),Qi(this,"bpm"),this._timeline.dispose(),this._repeatedEvents.dispose(),this}}Bi.mixin(Yo),ji(t=>{t.transport=new Yo({context:t})}),zi(t=>{t.transport.dispose()});class Ho extends wo{constructor(t){super(t),this.input=void 0,this._state=new yo("stopped"),this._synced=!1,this._scheduled=[],this._syncedStart=Zi,this._syncedStop=Zi,this._state.memory=100,this._state.increasing=!0,this._volume=this.output=new Go({context:this.context,mute:t.mute,volume:t.volume}),this.volume=this._volume.volume,Ui(this,"volume"),this.onstop=t.onstop}static getDefaults(){return Object.assign(wo.getDefaults(),{mute:!1,onstop:Zi,volume:0})}get state(){return this._synced?"started"===this.context.transport.state?this._state.getValueAtTime(this.context.transport.seconds):"stopped":this._state.getValueAtTime(this.now())}get mute(){return this._volume.mute}set mute(t){this._volume.mute=t}_clampToCurrentTime(t){return this._synced?t:Math.max(t,this.context.currentTime)}start(t,e,s){let n=ai(t)&&this._synced?this.context.transport.seconds:this.toSeconds(t);if(n=this._clampToCurrentTime(n),this._synced||"started"!==this._state.getValueAtTime(n))if(this.log("start",n),this._state.setStateAtTime("started",n),this._synced){const t=this._state.get(n);t&&(t.offset=this.toSeconds(Oi(e,0)),t.duration=s?this.toSeconds(s):void 0);const i=this.context.transport.schedule(t=>{this._start(t,e,s)},n);this._scheduled.push(i),"started"===this.context.transport.state&&this.context.transport.getSecondsAtTime(this.immediate())>n&&this._syncedStart(this.now(),this.context.transport.seconds)}else si(this.context),this._start(n,e,s);else ti(Ri(n,this._state.get(n).time),"Start time must be strictly greater than previous start time"),this._state.cancel(n),this._state.setStateAtTime("started",n),this.log("restart",n),this.restart(n,e,s);return this}stop(t){let e=ai(t)&&this._synced?this.context.transport.seconds:this.toSeconds(t);if(e=this._clampToCurrentTime(e),"started"===this._state.getValueAtTime(e)||ci(this._state.getNextState("started",e))){if(this.log("stop",e),this._synced){const t=this.context.transport.schedule(this._stop.bind(this),e);this._scheduled.push(t)}else this._stop(e);this._state.cancel(e),this._state.setStateAtTime("stopped",e)}return this}restart(t,e,s){return t=this.toSeconds(t),"started"===this._state.getValueAtTime(t)&&(this._state.cancel(t),this._restart(t,e,s)),this}sync(){return this._synced||(this._synced=!0,this._syncedStart=(t,e)=>{if(e>0){const s=this._state.get(e);if(s&&"started"===s.state&&s.time!==e){const n=e-this.toSeconds(s.time);let i;s.duration&&(i=this.toSeconds(s.duration)-n),this._start(t,this.toSeconds(s.offset)+n,i)}}},this._syncedStop=t=>{const e=this.context.transport.getSecondsAtTime(Math.max(t-this.sampleTime,0));"started"===this._state.getValueAtTime(e)&&this._stop(t)},this.context.transport.on("start",this._syncedStart),this.context.transport.on("loopStart",this._syncedStart),this.context.transport.on("stop",this._syncedStop),this.context.transport.on("pause",this._syncedStop),this.context.transport.on("loopEnd",this._syncedStop)),this}unsync(){return this._synced&&(this.context.transport.off("stop",this._syncedStop),this.context.transport.off("pause",this._syncedStop),this.context.transport.off("loopEnd",this._syncedStop),this.context.transport.off("start",this._syncedStart),this.context.transport.off("loopStart",this._syncedStart)),this._synced=!1,this._scheduled.forEach(t=>this.context.transport.clear(t)),this._scheduled=[],this._state.cancel(0),this._stop(0),this}dispose(){return super.dispose(),this.onstop=Zi,this.unsync(),this._volume.dispose(),this._state.dispose(),this}}class $o extends Co{constructor(){super(Di($o.getDefaults(),arguments,["url","onload"])),this.name="ToneBufferSource",this._source=this.context.createBufferSource(),this._internalChannels=[this._source],this._sourceStarted=!1,this._sourceStopped=!1;const t=Di($o.getDefaults(),arguments,["url","onload"]);To(this._source,this._gainNode),this._source.onended=()=>this._stopSource(),this.playbackRate=new xo({context:this.context,param:this._source.playbackRate,units:"positive",value:t.playbackRate}),this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this._buffer=new Xi(t.url,t.onload,t.onerror),this._internalChannels.push(this._source)}static getDefaults(){return Object.assign(Co.getDefaults(),{url:new Xi,loop:!1,loopEnd:0,loopStart:0,onload:Zi,onerror:Zi,playbackRate:1})}get fadeIn(){return this._fadeIn}set fadeIn(t){this._fadeIn=t}get fadeOut(){return this._fadeOut}set fadeOut(t){this._fadeOut=t}get curve(){return this._curve}set curve(t){this._curve=t}start(t,e,s,n=1){ti(this.buffer.loaded,"buffer is either not set or not loaded");const i=this.toSeconds(t);this._startGain(i,n),e=this.loop?Oi(e,this.loopStart):Oi(e,0);let o=Math.max(this.toSeconds(e),0);if(this.loop){const t=this.toSeconds(this.loopEnd)||this.buffer.duration,e=this.toSeconds(this.loopStart),s=t-e;qi(o,t)&&(o=(o-e)%s+e),Ii(o,this.buffer.duration)&&(o=0)}if(this._source.buffer=this.buffer.get(),this._source.loopEnd=this.toSeconds(this.loopEnd)||this.buffer.duration,Fi(o,this.buffer.duration)&&(this._sourceStarted=!0,this._source.start(i,o)),ci(s)){let t=this.toSeconds(s);t=Math.max(t,0),this.stop(i+t)}return this}_stopSource(t){!this._sourceStopped&&this._sourceStarted&&(this._sourceStopped=!0,this._source.stop(this.toSeconds(t)),this._onended())}get loopStart(){return this._source.loopStart}set loopStart(t){this._source.loopStart=this.toSeconds(t)}get loopEnd(){return this._source.loopEnd}set loopEnd(t){this._source.loopEnd=this.toSeconds(t)}get buffer(){return this._buffer}set buffer(t){this._buffer.set(t)}get loop(){return this._source.loop}set loop(t){this._source.loop=t,this._sourceStarted&&this.cancelStop()}dispose(){return super.dispose(),this._source.onended=null,this._source.disconnect(),this._buffer.dispose(),this.playbackRate.dispose(),this}}class Jo extends Ho{constructor(){super(Di(Jo.getDefaults(),arguments,["type"])),this.name="Noise",this._source=null;const t=Di(Jo.getDefaults(),arguments,["type"]);this._playbackRate=t.playbackRate,this.type=t.type,this._fadeIn=t.fadeIn,this._fadeOut=t.fadeOut}static getDefaults(){return Object.assign(Ho.getDefaults(),{fadeIn:0,fadeOut:0,playbackRate:1,type:"white"})}get type(){return this._type}set type(t){if(ti(t in tr,"Noise: invalid type: "+t),this._type!==t&&(this._type=t,"started"===this.state)){const t=this.now();this._stop(t),this._start(t)}}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._source&&(this._source.playbackRate.value=t)}_start(t){const e=tr[this._type];this._source=new $o({url:e,context:this.context,fadeIn:this._fadeIn,fadeOut:this._fadeOut,loop:!0,onended:()=>this.onstop(this),playbackRate:this._playbackRate}).connect(this.output),this._source.start(this.toSeconds(t),Math.random()*(e.duration-.001))}_stop(t){this._source&&(this._source.stop(this.toSeconds(t)),this._source=null)}get fadeIn(){return this._fadeIn}set fadeIn(t){this._fadeIn=t,this._source&&(this._source.fadeIn=this._fadeIn)}get fadeOut(){return this._fadeOut}set fadeOut(t){this._fadeOut=t,this._source&&(this._source.fadeOut=this._fadeOut)}_restart(t){this._stop(t),this._start(t)}dispose(){return super.dispose(),this._source&&this._source.disconnect(),this}}const Ko={brown:null,pink:null,white:null},tr={get brown(){if(!Ko.brown){const t=[];for(let e=0;e<2;e++){const s=new Float32Array(220500);t[e]=s;let n=0;for(let t=0;t<220500;t++){const e=2*Math.random()-1;s[t]=(n+.02*e)/1.02,n=s[t],s[t]*=3.5}}Ko.brown=(new Xi).fromArray(t)}return Ko.brown},get pink(){if(!Ko.pink){const t=[];for(let e=0;e<2;e++){const s=new Float32Array(220500);let n,i,o,r,a,c,h;t[e]=s,n=i=o=r=a=c=h=0;for(let t=0;t<220500;t++){const e=2*Math.random()-1;n=.99886*n+.0555179*e,i=.99332*i+.0750759*e,o=.969*o+.153852*e,r=.8665*r+.3104856*e,a=.55*a+.5329522*e,c=-.7616*c-.016898*e,s[t]=n+i+o+r+a+c+h+.5362*e,s[t]*=.11,h=.115926*e}}Ko.pink=(new Xi).fromArray(t)}return Ko.pink},get white(){if(!Ko.white){const t=[];for(let e=0;e<2;e++){const s=new Float32Array(220500);t[e]=s;for(let t=0;t<220500;t++)s[t]=2*Math.random()-1}Ko.white=(new Xi).fromArray(t)}return Ko.white}};class er extends wo{constructor(){super(Di(er.getDefaults(),arguments,["volume"])),this.name="UserMedia";const t=Di(er.getDefaults(),arguments,["volume"]);this._volume=this.output=new Go({context:this.context,volume:t.volume}),this.volume=this._volume.volume,Ui(this,"volume"),this.mute=t.mute}static getDefaults(){return Object.assign(wo.getDefaults(),{mute:!1,volume:0})}open(t){return yi(this,void 0,void 0,(function*(){ti(er.supported,"UserMedia is not supported"),"started"===this.state&&this.close();const e=yield er.enumerateDevices();ui(t)?this._device=e[t]:(this._device=e.find(e=>e.label===t||e.deviceId===t),!this._device&&e.length>0&&(this._device=e[0]),ti(ci(this._device),"No matching device "+t));const s={audio:{echoCancellation:!1,sampleRate:this.context.sampleRate,noiseSuppression:!1,mozNoiseSuppression:!1}};this._device&&(s.audio.deviceId=this._device.deviceId);const n=yield navigator.mediaDevices.getUserMedia(s);if(!this._stream){this._stream=n;const t=this.context.createMediaStreamSource(n);To(t,this.output),this._mediaStream=t}return this}))}close(){return this._stream&&this._mediaStream&&(this._stream.getAudioTracks().forEach(t=>{t.stop()}),this._stream=void 0,this._mediaStream.disconnect(),this._mediaStream=void 0),this._device=void 0,this}static enumerateDevices(){return yi(this,void 0,void 0,(function*(){return(yield navigator.mediaDevices.enumerateDevices()).filter(t=>"audioinput"===t.kind)}))}get state(){return this._stream&&this._stream.active?"started":"stopped"}get deviceId(){return this._device?this._device.deviceId:void 0}get groupId(){return this._device?this._device.groupId:void 0}get label(){return this._device?this._device.label:void 0}get mute(){return this._volume.mute}set mute(t){this._volume.mute=t}dispose(){return super.dispose(),this.close(),this._volume.dispose(),this.volume.dispose(),this}static get supported(){return ci(navigator.mediaDevices)&&ci(navigator.mediaDevices.getUserMedia)}}function sr(t,e){return yi(this,void 0,void 0,(function*(){const s=e/t.context.sampleRate,n=new Yi(1,s,t.context.sampleRate);new t.constructor(Object.assign(t.get(),{frequency:2/s,detune:0,context:n})).toDestination().start(0);return(yield n.render()).getChannelData(0)}))}class nr extends Co{constructor(){super(Di(nr.getDefaults(),arguments,["frequency","type"])),this.name="ToneOscillatorNode",this._oscillator=this.context.createOscillator(),this._internalChannels=[this._oscillator];const t=Di(nr.getDefaults(),arguments,["frequency","type"]);To(this._oscillator,this._gainNode),this.type=t.type,this.frequency=new xo({context:this.context,param:this._oscillator.frequency,units:"frequency",value:t.frequency}),this.detune=new xo({context:this.context,param:this._oscillator.detune,units:"cents",value:t.detune}),Ui(this,["frequency","detune"])}static getDefaults(){return Object.assign(Co.getDefaults(),{detune:0,frequency:440,type:"sine"})}start(t){const e=this.toSeconds(t);return this.log("start",e),this._startGain(e),this._oscillator.start(e),this}_stopSource(t){this._oscillator.stop(t)}setPeriodicWave(t){return this._oscillator.setPeriodicWave(t),this}get type(){return this._oscillator.type}set type(t){this._oscillator.type=t}dispose(){return super.dispose(),"started"===this.state&&this.stop(),this._oscillator.disconnect(),this.frequency.dispose(),this.detune.dispose(),this}}class ir extends Ho{constructor(){super(Di(ir.getDefaults(),arguments,["frequency","type"])),this.name="Oscillator",this._oscillator=null;const t=Di(ir.getDefaults(),arguments,["frequency","type"]);this.frequency=new Do({context:this.context,units:"frequency",value:t.frequency}),Ui(this,"frequency"),this.detune=new Do({context:this.context,units:"cents",value:t.detune}),Ui(this,"detune"),this._partials=t.partials,this._partialCount=t.partialCount,this._type=t.type,t.partialCount&&"custom"!==t.type&&(this._type=this.baseType+t.partialCount.toString()),this.phase=t.phase}static getDefaults(){return Object.assign(Ho.getDefaults(),{detune:0,frequency:440,partialCount:0,partials:[],phase:0,type:"sine"})}_start(t){const e=this.toSeconds(t),s=new nr({context:this.context,onended:()=>this.onstop(this)});this._oscillator=s,this._wave?this._oscillator.setPeriodicWave(this._wave):this._oscillator.type=this._type,this._oscillator.connect(this.output),this.frequency.connect(this._oscillator.frequency),this.detune.connect(this._oscillator.detune),this._oscillator.start(e)}_stop(t){const e=this.toSeconds(t);this._oscillator&&this._oscillator.stop(e)}_restart(t){const e=this.toSeconds(t);return this.log("restart",e),this._oscillator&&this._oscillator.cancelStop(),this._state.cancel(e),this}syncFrequency(){return this.context.transport.syncSignal(this.frequency),this}unsyncFrequency(){return this.context.transport.unsyncSignal(this.frequency),this}_getCachedPeriodicWave(){if("custom"===this._type){return ir._periodicWaveCache.find(t=>{return t.phase===this._phase&&(e=t.partials,s=this._partials,e.length===s.length&&e.every((t,e)=>s[e]===t));var e,s})}{const t=ir._periodicWaveCache.find(t=>t.type===this._type&&t.phase===this._phase);return this._partialCount=t?t.partialCount:this._partialCount,t}}get type(){return this._type}set type(t){this._type=t;const e=-1!==["sine","square","sawtooth","triangle"].indexOf(t);if(0===this._phase&&e)this._wave=void 0,this._partialCount=0,null!==this._oscillator&&(this._oscillator.type=t);else{const e=this._getCachedPeriodicWave();if(ci(e)){const{partials:t,wave:s}=e;this._wave=s,this._partials=t,null!==this._oscillator&&this._oscillator.setPeriodicWave(this._wave)}else{const[e,s]=this._getRealImaginary(t,this._phase),n=this.context.createPeriodicWave(e,s);this._wave=n,null!==this._oscillator&&this._oscillator.setPeriodicWave(this._wave),ir._periodicWaveCache.push({imag:s,partialCount:this._partialCount,partials:this._partials,phase:this._phase,real:e,type:this._type,wave:this._wave}),ir._periodicWaveCache.length>100&&ir._periodicWaveCache.shift()}}}get baseType(){return this._type.replace(this.partialCount.toString(),"")}set baseType(t){this.partialCount&&"custom"!==this._type&&"custom"!==t?this.type=t+this.partialCount:this.type=t}get partialCount(){return this._partialCount}set partialCount(t){ei(t,0);let e=this._type;const s=/^(sine|triangle|square|sawtooth)(\d+)$/.exec(this._type);if(s&&(e=s[1]),"custom"!==this._type)this.type=0===t?e:e+t.toString();else{const e=new Float32Array(t);this._partials.forEach((t,s)=>e[s]=t),this._partials=Array.from(e),this.type=this._type}}_getRealImaginary(t,e){let s=2048;const n=new Float32Array(s),i=new Float32Array(s);let o=1;if("custom"===t){if(o=this._partials.length+1,this._partialCount=this._partials.length,s=o,0===this._partials.length)return[n,i]}else{const e=/^(sine|triangle|square|sawtooth)(\d+)$/.exec(t);e?(o=parseInt(e[2],10)+1,this._partialCount=parseInt(e[2],10),t=e[1],o=Math.max(o,2),s=o):this._partialCount=0,this._partials=[]}for(let r=1;r<s;++r){const s=2/(r*Math.PI);let a;switch(t){case"sine":a=r<=o?1:0,this._partials[r-1]=a;break;case"square":a=1&r?2*s:0,this._partials[r-1]=a;break;case"sawtooth":a=s*(1&r?1:-1),this._partials[r-1]=a;break;case"triangle":a=1&r?s*s*2*(r-1>>1&1?-1:1):0,this._partials[r-1]=a;break;case"custom":a=this._partials[r-1];break;default:throw new TypeError("Oscillator: invalid type: "+t)}0!==a?(n[r]=-a*Math.sin(e*r),i[r]=a*Math.cos(e*r)):(n[r]=0,i[r]=0)}return[n,i]}_inverseFFT(t,e,s){let n=0;const i=t.length;for(let o=0;o<i;o++)n+=t[o]*Math.cos(o*s)+e[o]*Math.sin(o*s);return n}getInitialValue(){const[t,e]=this._getRealImaginary(this._type,0);let s=0;const n=2*Math.PI;for(let i=0;i<32;i++)s=Math.max(this._inverseFFT(t,e,i/32*n),s);return Vi(-this._inverseFFT(t,e,this._phase)/s,-1,1)}get partials(){return this._partials.slice(0,this.partialCount)}set partials(t){this._partials=t,this._partialCount=this._partials.length,t.length&&(this.type="custom")}get phase(){return this._phase*(180/Math.PI)}set phase(t){this._phase=t*Math.PI/180,this.type=this._type}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),null!==this._oscillator&&this._oscillator.dispose(),this._wave=void 0,this.frequency.dispose(),this.detune.dispose(),this}}ir._periodicWaveCache=[];class or extends wo{constructor(){super(Object.assign(Di(or.getDefaults(),arguments,["context"])))}connect(t,e=0,s=0){return Oo(this,t,e,s),this}}class rr extends or{constructor(){super(Object.assign(Di(rr.getDefaults(),arguments,["mapping","length"]))),this.name="WaveShaper",this._shaper=this.context.createWaveShaper(),this.input=this._shaper,this.output=this._shaper;const t=Di(rr.getDefaults(),arguments,["mapping","length"]);di(t.mapping)||t.mapping instanceof Float32Array?this.curve=Float32Array.from(t.mapping):hi(t.mapping)&&this.setMap(t.mapping,t.length)}static getDefaults(){return Object.assign(Do.getDefaults(),{length:1024})}setMap(t,e=1024){const s=new Float32Array(e);for(let n=0,i=e;n<i;n++){const e=n/(i-1)*2-1;s[n]=t(e,n)}return this.curve=s,this}get curve(){return this._shaper.curve}set curve(t){this._shaper.curve=t}get oversample(){return this._shaper.oversample}set oversample(t){ti(["none","2x","4x"].some(e=>e.includes(t)),"oversampling must be either 'none', '2x', or '4x'"),this._shaper.oversample=t}dispose(){return super.dispose(),this._shaper.disconnect(),this}}class ar extends or{constructor(){super(...arguments),this.name="AudioToGain",this._norm=new rr({context:this.context,mapping:t=>(t+1)/2}),this.input=this._norm,this.output=this._norm}dispose(){return super.dispose(),this._norm.dispose(),this}}class cr extends Do{constructor(){super(Object.assign(Di(cr.getDefaults(),arguments,["value"]))),this.name="Multiply",this.override=!1;const t=Di(cr.getDefaults(),arguments,["value"]);this._mult=this.input=this.output=new ko({context:this.context,minValue:t.minValue,maxValue:t.maxValue}),this.factor=this._param=this._mult.gain,this.factor.setValueAtTime(t.value,0)}static getDefaults(){return Object.assign(Do.getDefaults(),{value:0})}dispose(){return super.dispose(),this._mult.dispose(),this}}class hr extends Ho{constructor(){super(Di(hr.getDefaults(),arguments,["frequency","type","modulationType"])),this.name="AMOscillator",this._modulationScale=new ar({context:this.context}),this._modulationNode=new ko({context:this.context});const t=Di(hr.getDefaults(),arguments,["frequency","type","modulationType"]);this._carrier=new ir({context:this.context,detune:t.detune,frequency:t.frequency,onstop:()=>this.onstop(this),phase:t.phase,type:t.type}),this.frequency=this._carrier.frequency,this.detune=this._carrier.detune,this._modulator=new ir({context:this.context,phase:t.phase,type:t.modulationType}),this.harmonicity=new cr({context:this.context,units:"positive",value:t.harmonicity}),this.frequency.chain(this.harmonicity,this._modulator.frequency),this._modulator.chain(this._modulationScale,this._modulationNode.gain),this._carrier.chain(this._modulationNode,this.output),Ui(this,["frequency","detune","harmonicity"])}static getDefaults(){return Object.assign(ir.getDefaults(),{harmonicity:1,modulationType:"square"})}_start(t){this._modulator.start(t),this._carrier.start(t)}_stop(t){this._modulator.stop(t),this._carrier.stop(t)}_restart(t){this._modulator.restart(t),this._carrier.restart(t)}get type(){return this._carrier.type}set type(t){this._carrier.type=t}get baseType(){return this._carrier.baseType}set baseType(t){this._carrier.baseType=t}get partialCount(){return this._carrier.partialCount}set partialCount(t){this._carrier.partialCount=t}get modulationType(){return this._modulator.type}set modulationType(t){this._modulator.type=t}get phase(){return this._carrier.phase}set phase(t){this._carrier.phase=t,this._modulator.phase=t}get partials(){return this._carrier.partials}set partials(t){this._carrier.partials=t}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),this.frequency.dispose(),this.detune.dispose(),this.harmonicity.dispose(),this._carrier.dispose(),this._modulator.dispose(),this._modulationNode.dispose(),this._modulationScale.dispose(),this}}class ur extends Ho{constructor(){super(Di(ur.getDefaults(),arguments,["frequency","type","modulationType"])),this.name="FMOscillator",this._modulationNode=new ko({context:this.context,gain:0});const t=Di(ur.getDefaults(),arguments,["frequency","type","modulationType"]);this._carrier=new ir({context:this.context,detune:t.detune,frequency:0,onstop:()=>this.onstop(this),phase:t.phase,type:t.type}),this.detune=this._carrier.detune,this.frequency=new Do({context:this.context,units:"frequency",value:t.frequency}),this._modulator=new ir({context:this.context,phase:t.phase,type:t.modulationType}),this.harmonicity=new cr({context:this.context,units:"positive",value:t.harmonicity}),this.modulationIndex=new cr({context:this.context,units:"positive",value:t.modulationIndex}),this.frequency.connect(this._carrier.frequency),this.frequency.chain(this.harmonicity,this._modulator.frequency),this.frequency.chain(this.modulationIndex,this._modulationNode),this._modulator.connect(this._modulationNode.gain),this._modulationNode.connect(this._carrier.frequency),this._carrier.connect(this.output),this.detune.connect(this._modulator.detune),Ui(this,["modulationIndex","frequency","detune","harmonicity"])}static getDefaults(){return Object.assign(ir.getDefaults(),{harmonicity:1,modulationIndex:2,modulationType:"square"})}_start(t){this._modulator.start(t),this._carrier.start(t)}_stop(t){this._modulator.stop(t),this._carrier.stop(t)}_restart(t){return this._modulator.restart(t),this._carrier.restart(t),this}get type(){return this._carrier.type}set type(t){this._carrier.type=t}get baseType(){return this._carrier.baseType}set baseType(t){this._carrier.baseType=t}get partialCount(){return this._carrier.partialCount}set partialCount(t){this._carrier.partialCount=t}get modulationType(){return this._modulator.type}set modulationType(t){this._modulator.type=t}get phase(){return this._carrier.phase}set phase(t){this._carrier.phase=t,this._modulator.phase=t}get partials(){return this._carrier.partials}set partials(t){this._carrier.partials=t}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),this.frequency.dispose(),this.harmonicity.dispose(),this._carrier.dispose(),this._modulator.dispose(),this._modulationNode.dispose(),this.modulationIndex.dispose(),this}}class lr extends Ho{constructor(){super(Di(lr.getDefaults(),arguments,["frequency","width"])),this.name="PulseOscillator",this._widthGate=new ko({context:this.context,gain:0}),this._thresh=new rr({context:this.context,mapping:t=>t<=0?-1:1});const t=Di(lr.getDefaults(),arguments,["frequency","width"]);this.width=new Do({context:this.context,units:"audioRange",value:t.width}),this._triangle=new ir({context:this.context,detune:t.detune,frequency:t.frequency,onstop:()=>this.onstop(this),phase:t.phase,type:"triangle"}),this.frequency=this._triangle.frequency,this.detune=this._triangle.detune,this._triangle.chain(this._thresh,this.output),this.width.chain(this._widthGate,this._thresh),Ui(this,["width","frequency","detune"])}static getDefaults(){return Object.assign(Ho.getDefaults(),{detune:0,frequency:440,phase:0,type:"pulse",width:.2})}_start(t){t=this.toSeconds(t),this._triangle.start(t),this._widthGate.gain.setValueAtTime(1,t)}_stop(t){t=this.toSeconds(t),this._triangle.stop(t),this._widthGate.gain.cancelScheduledValues(t),this._widthGate.gain.setValueAtTime(0,t)}_restart(t){this._triangle.restart(t),this._widthGate.gain.cancelScheduledValues(t),this._widthGate.gain.setValueAtTime(1,t)}get phase(){return this._triangle.phase}set phase(t){this._triangle.phase=t}get type(){return"pulse"}get baseType(){return"pulse"}get partials(){return[]}get partialCount(){return 0}set carrierType(t){this._triangle.type=t}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),this._triangle.dispose(),this.width.dispose(),this._widthGate.dispose(),this._thresh.dispose(),this}}class pr extends Ho{constructor(){super(Di(pr.getDefaults(),arguments,["frequency","type","spread"])),this.name="FatOscillator",this._oscillators=[];const t=Di(pr.getDefaults(),arguments,["frequency","type","spread"]);this.frequency=new Do({context:this.context,units:"frequency",value:t.frequency}),this.detune=new Do({context:this.context,units:"cents",value:t.detune}),this._spread=t.spread,this._type=t.type,this._phase=t.phase,this._partials=t.partials,this._partialCount=t.partialCount,this.count=t.count,Ui(this,["frequency","detune"])}static getDefaults(){return Object.assign(ir.getDefaults(),{count:3,spread:20,type:"sawtooth"})}_start(t){t=this.toSeconds(t),this._forEach(e=>e.start(t))}_stop(t){t=this.toSeconds(t),this._forEach(e=>e.stop(t))}_restart(t){this._forEach(e=>e.restart(t))}_forEach(t){for(let e=0;e<this._oscillators.length;e++)t(this._oscillators[e],e)}get type(){return this._type}set type(t){this._type=t,this._forEach(e=>e.type=t)}get spread(){return this._spread}set spread(t){if(this._spread=t,this._oscillators.length>1){const e=-t/2,s=t/(this._oscillators.length-1);this._forEach((t,n)=>t.detune.value=e+s*n)}}get count(){return this._oscillators.length}set count(t){if(ei(t,1),this._oscillators.length!==t){this._forEach(t=>t.dispose()),this._oscillators=[];for(let e=0;e<t;e++){const s=new ir({context:this.context,volume:-6-1.1*t,type:this._type,phase:this._phase+e/t*360,partialCount:this._partialCount,onstop:0===e?()=>this.onstop(this):Zi});"custom"===this.type&&(s.partials=this._partials),this.frequency.connect(s.frequency),this.detune.connect(s.detune),s.detune.overridden=!1,s.connect(this.output),this._oscillators[e]=s}this.spread=this._spread,"started"===this.state&&this._forEach(t=>t.start())}}get phase(){return this._phase}set phase(t){this._phase=t,this._forEach((t,e)=>t.phase=this._phase+e/this.count*360)}get baseType(){return this._oscillators[0].baseType}set baseType(t){this._forEach(e=>e.baseType=t),this._type=this._oscillators[0].type}get partials(){return this._oscillators[0].partials}set partials(t){this._partials=t,this._partialCount=this._partials.length,t.length&&(this._type="custom",this._forEach(e=>e.partials=t))}get partialCount(){return this._oscillators[0].partialCount}set partialCount(t){this._partialCount=t,this._forEach(e=>e.partialCount=t),this._type=this._oscillators[0].type}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),this.frequency.dispose(),this.detune.dispose(),this._forEach(t=>t.dispose()),this}}class dr extends Ho{constructor(){super(Di(dr.getDefaults(),arguments,["frequency","modulationFrequency"])),this.name="PWMOscillator",this.sourceType="pwm",this._scale=new cr({context:this.context,value:2});const t=Di(dr.getDefaults(),arguments,["frequency","modulationFrequency"]);this._pulse=new lr({context:this.context,frequency:t.modulationFrequency}),this._pulse.carrierType="sine",this.modulationFrequency=this._pulse.frequency,this._modulator=new ir({context:this.context,detune:t.detune,frequency:t.frequency,onstop:()=>this.onstop(this),phase:t.phase}),this.frequency=this._modulator.frequency,this.detune=this._modulator.detune,this._modulator.chain(this._scale,this._pulse.width),this._pulse.connect(this.output),Ui(this,["modulationFrequency","frequency","detune"])}static getDefaults(){return Object.assign(Ho.getDefaults(),{detune:0,frequency:440,modulationFrequency:.4,phase:0,type:"pwm"})}_start(t){t=this.toSeconds(t),this._modulator.start(t),this._pulse.start(t)}_stop(t){t=this.toSeconds(t),this._modulator.stop(t),this._pulse.stop(t)}_restart(t){this._modulator.restart(t),this._pulse.restart(t)}get type(){return"pwm"}get baseType(){return"pwm"}get partials(){return[]}get partialCount(){return 0}get phase(){return this._modulator.phase}set phase(t){this._modulator.phase=t}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),this._pulse.dispose(),this._scale.dispose(),this._modulator.dispose(),this}}const fr={am:hr,fat:pr,fm:ur,oscillator:ir,pulse:lr,pwm:dr};class _r extends Ho{constructor(){super(Di(_r.getDefaults(),arguments,["frequency","type"])),this.name="OmniOscillator";const t=Di(_r.getDefaults(),arguments,["frequency","type"]);this.frequency=new Do({context:this.context,units:"frequency",value:t.frequency}),this.detune=new Do({context:this.context,units:"cents",value:t.detune}),Ui(this,["frequency","detune"]),this.set(t)}static getDefaults(){return Object.assign(ir.getDefaults(),ur.getDefaults(),hr.getDefaults(),pr.getDefaults(),lr.getDefaults(),dr.getDefaults())}_start(t){this._oscillator.start(t)}_stop(t){this._oscillator.stop(t)}_restart(t){return this._oscillator.restart(t),this}get type(){let t="";return["am","fm","fat"].some(t=>this._sourceType===t)&&(t=this._sourceType),t+this._oscillator.type}set type(t){"fm"===t.substr(0,2)?(this._createNewOscillator("fm"),this._oscillator=this._oscillator,this._oscillator.type=t.substr(2)):"am"===t.substr(0,2)?(this._createNewOscillator("am"),this._oscillator=this._oscillator,this._oscillator.type=t.substr(2)):"fat"===t.substr(0,3)?(this._createNewOscillator("fat"),this._oscillator=this._oscillator,this._oscillator.type=t.substr(3)):"pwm"===t?(this._createNewOscillator("pwm"),this._oscillator=this._oscillator):"pulse"===t?this._createNewOscillator("pulse"):(this._createNewOscillator("oscillator"),this._oscillator=this._oscillator,this._oscillator.type=t)}get partials(){return this._oscillator.partials}set partials(t){this._getOscType(this._oscillator,"pulse")||this._getOscType(this._oscillator,"pwm")||(this._oscillator.partials=t)}get partialCount(){return this._oscillator.partialCount}set partialCount(t){this._getOscType(this._oscillator,"pulse")||this._getOscType(this._oscillator,"pwm")||(this._oscillator.partialCount=t)}set(t){return Reflect.has(t,"type")&&t.type&&(this.type=t.type),super.set(t),this}_createNewOscillator(t){if(t!==this._sourceType){this._sourceType=t;const e=fr[t],s=this.now();if(this._oscillator){const t=this._oscillator;t.stop(s),this.context.setTimeout(()=>t.dispose(),this.blockTime)}this._oscillator=new e({context:this.context}),this.frequency.connect(this._oscillator.frequency),this.detune.connect(this._oscillator.detune),this._oscillator.connect(this.output),this._oscillator.onstop=()=>this.onstop(this),"started"===this.state&&this._oscillator.start(s)}}get phase(){return this._oscillator.phase}set phase(t){this._oscillator.phase=t}get sourceType(){return this._sourceType}set sourceType(t){let e="sine";"pwm"!==this._oscillator.type&&"pulse"!==this._oscillator.type&&(e=this._oscillator.type),"fm"===t?this.type="fm"+e:"am"===t?this.type="am"+e:"fat"===t?this.type="fat"+e:"oscillator"===t?this.type=e:"pulse"===t?this.type="pulse":"pwm"===t&&(this.type="pwm")}_getOscType(t,e){return t instanceof fr[e]}get baseType(){return this._oscillator.baseType}set baseType(t){this._getOscType(this._oscillator,"pulse")||this._getOscType(this._oscillator,"pwm")||"pulse"===t||"pwm"===t||(this._oscillator.baseType=t)}get width(){return this._getOscType(this._oscillator,"pulse")?this._oscillator.width:void 0}get count(){return this._getOscType(this._oscillator,"fat")?this._oscillator.count:void 0}set count(t){this._getOscType(this._oscillator,"fat")&&ui(t)&&(this._oscillator.count=t)}get spread(){return this._getOscType(this._oscillator,"fat")?this._oscillator.spread:void 0}set spread(t){this._getOscType(this._oscillator,"fat")&&ui(t)&&(this._oscillator.spread=t)}get modulationType(){return this._getOscType(this._oscillator,"fm")||this._getOscType(this._oscillator,"am")?this._oscillator.modulationType:void 0}set modulationType(t){(this._getOscType(this._oscillator,"fm")||this._getOscType(this._oscillator,"am"))&&fi(t)&&(this._oscillator.modulationType=t)}get modulationIndex(){return this._getOscType(this._oscillator,"fm")?this._oscillator.modulationIndex:void 0}get harmonicity(){return this._getOscType(this._oscillator,"fm")||this._getOscType(this._oscillator,"am")?this._oscillator.harmonicity:void 0}get modulationFrequency(){return this._getOscType(this._oscillator,"pwm")?this._oscillator.modulationFrequency:void 0}asArray(t=1024){return yi(this,void 0,void 0,(function*(){return sr(this,t)}))}dispose(){return super.dispose(),this.detune.dispose(),this.frequency.dispose(),this._oscillator.dispose(),this}}class mr extends Do{constructor(){super(Object.assign(Di(mr.getDefaults(),arguments,["value"]))),this.override=!1,this.name="Add",this._sum=new ko({context:this.context}),this.input=this._sum,this.output=this._sum,this.addend=this._param,bo(this._constantSource,this._sum)}static getDefaults(){return Object.assign(Do.getDefaults(),{value:0})}dispose(){return super.dispose(),this._sum.dispose(),this}}class gr extends or{constructor(){super(Object.assign(Di(gr.getDefaults(),arguments,["min","max"]))),this.name="Scale";const t=Di(gr.getDefaults(),arguments,["min","max"]);this._mult=this.input=new cr({context:this.context,value:t.max-t.min}),this._add=this.output=new mr({context:this.context,value:t.min}),this._min=t.min,this._max=t.max,this.input.connect(this.output)}static getDefaults(){return Object.assign(or.getDefaults(),{max:1,min:0})}get min(){return this._min}set min(t){this._min=t,this._setRange()}get max(){return this._max}set max(t){this._max=t,this._setRange()}_setRange(){this._add.value=this._min,this._mult.value=this._max-this._min}dispose(){return super.dispose(),this._add.dispose(),this._mult.dispose(),this}}class vr extends or{constructor(){super(Object.assign(Di(vr.getDefaults(),arguments))),this.name="Zero",this._gain=new ko({context:this.context}),this.output=this._gain,this.input=void 0,To(this.context.getConstant(0),this._gain)}dispose(){return super.dispose(),So(this.context.getConstant(0),this._gain),this}}class yr extends wo{constructor(){super(Di(yr.getDefaults(),arguments,["frequency","min","max"])),this.name="LFO",this._stoppedValue=0,this._units="number",this.convert=!0,this._fromType=xo.prototype._fromType,this._toType=xo.prototype._toType,this._is=xo.prototype._is,this._clampValue=xo.prototype._clampValue;const t=Di(yr.getDefaults(),arguments,["frequency","min","max"]);this._oscillator=new ir(t),this.frequency=this._oscillator.frequency,this._amplitudeGain=new ko({context:this.context,gain:t.amplitude,units:"normalRange"}),this.amplitude=this._amplitudeGain.gain,this._stoppedSignal=new Do({context:this.context,units:"audioRange",value:0}),this._zeros=new vr({context:this.context}),this._a2g=new ar({context:this.context}),this._scaler=this.output=new gr({context:this.context,max:t.max,min:t.min}),this.units=t.units,this.min=t.min,this.max=t.max,this._oscillator.chain(this._amplitudeGain,this._a2g,this._scaler),this._zeros.connect(this._a2g),this._stoppedSignal.connect(this._a2g),Ui(this,["amplitude","frequency"]),this.phase=t.phase}static getDefaults(){return Object.assign(ir.getDefaults(),{amplitude:1,frequency:"4n",max:1,min:0,type:"sine",units:"number"})}start(t){return t=this.toSeconds(t),this._stoppedSignal.setValueAtTime(0,t),this._oscillator.start(t),this}stop(t){return t=this.toSeconds(t),this._stoppedSignal.setValueAtTime(this._stoppedValue,t),this._oscillator.stop(t),this}sync(){return this._oscillator.sync(),this._oscillator.syncFrequency(),this}unsync(){return this._oscillator.unsync(),this._oscillator.unsyncFrequency(),this}_setStoppedValue(){this._stoppedValue=this._oscillator.getInitialValue(),this._stoppedSignal.value=this._stoppedValue}get min(){return this._toType(this._scaler.min)}set min(t){t=this._fromType(t),this._scaler.min=t}get max(){return this._toType(this._scaler.max)}set max(t){t=this._fromType(t),this._scaler.max=t}get type(){return this._oscillator.type}set type(t){this._oscillator.type=t,this._setStoppedValue()}get partials(){return this._oscillator.partials}set partials(t){this._oscillator.partials=t,this._setStoppedValue()}get phase(){return this._oscillator.phase}set phase(t){this._oscillator.phase=t,this._setStoppedValue()}get units(){return this._units}set units(t){const e=this.min,s=this.max;this._units=t,this.min=e,this.max=s}get state(){return this._oscillator.state}connect(t,e,s){return(t instanceof xo||t instanceof Do)&&(this.convert=t.convert,this.units=t.units),Oo(this,t,e,s),this}dispose(){return super.dispose(),this._oscillator.dispose(),this._stoppedSignal.dispose(),this._zeros.dispose(),this._scaler.dispose(),this._a2g.dispose(),this._amplitudeGain.dispose(),this.amplitude.dispose(),this}}function xr(t,e=1/0){const s=new WeakMap;return function(n,i){Reflect.defineProperty(n,i,{configurable:!0,enumerable:!0,get:function(){return s.get(this)},set:function(n){ei(n,t,e),s.set(this,n)}})}}function wr(t,e=1/0){const s=new WeakMap;return function(n,i){Reflect.defineProperty(n,i,{configurable:!0,enumerable:!0,get:function(){return s.get(this)},set:function(n){ei(this.toSeconds(n),t,e),s.set(this,n)}})}}class br extends Ho{constructor(){super(Di(br.getDefaults(),arguments,["url","onload"])),this.name="Player",this._activeSources=new Set;const t=Di(br.getDefaults(),arguments,["url","onload"]);this._buffer=new Xi({onload:this._onload.bind(this,t.onload),onerror:t.onerror,reverse:t.reverse,url:t.url}),this.autostart=t.autostart,this._loop=t.loop,this._loopStart=t.loopStart,this._loopEnd=t.loopEnd,this._playbackRate=t.playbackRate,this.fadeIn=t.fadeIn,this.fadeOut=t.fadeOut}static getDefaults(){return Object.assign(Ho.getDefaults(),{autostart:!1,fadeIn:0,fadeOut:0,loop:!1,loopEnd:0,loopStart:0,onload:Zi,onerror:Zi,playbackRate:1,reverse:!1})}load(t){return yi(this,void 0,void 0,(function*(){return yield this._buffer.load(t),this._onload(),this}))}_onload(t=Zi){t(),this.autostart&&this.start()}_onSourceEnd(t){this.onstop(this),this._activeSources.delete(t),0!==this._activeSources.size||this._synced||"started"!==this._state.getValueAtTime(this.now())||(this._state.cancel(this.now()),this._state.setStateAtTime("stopped",this.now()))}start(t,e,s){return super.start(t,e,s),this}_start(t,e,s){e=this._loop?Oi(e,this._loopStart):Oi(e,0);const n=this.toSeconds(e),i=s;s=Oi(s,Math.max(this._buffer.duration-n,0));let o=this.toSeconds(s);o/=this._playbackRate,t=this.toSeconds(t);const r=new $o({url:this._buffer,context:this.context,fadeIn:this.fadeIn,fadeOut:this.fadeOut,loop:this._loop,loopEnd:this._loopEnd,loopStart:this._loopStart,onended:this._onSourceEnd.bind(this),playbackRate:this._playbackRate}).connect(this.output);this._loop||this._synced||(this._state.cancel(t+o),this._state.setStateAtTime("stopped",t+o,{implicitEnd:!0})),this._activeSources.add(r),this._loop&&ai(i)?r.start(t,n):r.start(t,n,o-this.toSeconds(this.fadeOut))}_stop(t){const e=this.toSeconds(t);this._activeSources.forEach(t=>t.stop(e))}restart(t,e,s){return super.restart(t,e,s),this}_restart(t,e,s){this._stop(t),this._start(t,e,s)}seek(t,e){const s=this.toSeconds(e);if("started"===this._state.getValueAtTime(s)){const e=this.toSeconds(t);this._stop(s),this._start(s,e)}return this}setLoopPoints(t,e){return this.loopStart=t,this.loopEnd=e,this}get loopStart(){return this._loopStart}set loopStart(t){this._loopStart=t,this.buffer.loaded&&ei(this.toSeconds(t),0,this.buffer.duration),this._activeSources.forEach(e=>{e.loopStart=t})}get loopEnd(){return this._loopEnd}set loopEnd(t){this._loopEnd=t,this.buffer.loaded&&ei(this.toSeconds(t),0,this.buffer.duration),this._activeSources.forEach(e=>{e.loopEnd=t})}get buffer(){return this._buffer}set buffer(t){this._buffer.set(t)}get loop(){return this._loop}set loop(t){if(this._loop!==t&&(this._loop=t,this._activeSources.forEach(e=>{e.loop=t}),t)){const t=this._state.getNextState("stopped",this.now());t&&this._state.cancel(t.time)}}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t;const e=this.now(),s=this._state.getNextState("stopped",e);s&&s.implicitEnd&&(this._state.cancel(s.time),this._activeSources.forEach(t=>t.cancelStop())),this._activeSources.forEach(s=>{s.playbackRate.setValueAtTime(t,e)})}get reverse(){return this._buffer.reverse}set reverse(t){this._buffer.reverse=t}get loaded(){return this._buffer.loaded}dispose(){return super.dispose(),this._activeSources.forEach(t=>t.dispose()),this._activeSources.clear(),this._buffer.dispose(),this}}vi([wr(0)],br.prototype,"fadeIn",void 0),vi([wr(0)],br.prototype,"fadeOut",void 0);class Tr extends wo{constructor(){super(Di(Tr.getDefaults(),arguments,["urls","onload"],"urls")),this.name="Players",this.input=void 0,this._players=new Map;const t=Di(Tr.getDefaults(),arguments,["urls","onload"],"urls");this._volume=this.output=new Go({context:this.context,volume:t.volume}),this.volume=this._volume.volume,Ui(this,"volume"),this._buffers=new Vo({urls:t.urls,onload:t.onload,baseUrl:t.baseUrl,onerror:t.onerror}),this.mute=t.mute,this._fadeIn=t.fadeIn,this._fadeOut=t.fadeOut}static getDefaults(){return Object.assign(Ho.getDefaults(),{baseUrl:"",fadeIn:0,fadeOut:0,mute:!1,onload:Zi,onerror:Zi,urls:{},volume:0})}get mute(){return this._volume.mute}set mute(t){this._volume.mute=t}get fadeIn(){return this._fadeIn}set fadeIn(t){this._fadeIn=t,this._players.forEach(e=>{e.fadeIn=t})}get fadeOut(){return this._fadeOut}set fadeOut(t){this._fadeOut=t,this._players.forEach(e=>{e.fadeOut=t})}get state(){return Array.from(this._players).some(([t,e])=>"started"===e.state)?"started":"stopped"}has(t){return this._buffers.has(t)}player(t){if(ti(this.has(t),`No Player with the name ${t} exists on this object`),!this._players.has(t)){const e=new br({context:this.context,fadeIn:this._fadeIn,fadeOut:this._fadeOut,url:this._buffers.get(t)}).connect(this.output);this._players.set(t,e)}return this._players.get(t)}get loaded(){return this._buffers.loaded}add(t,e,s){return ti(!this._buffers.has(t),"A buffer with that name already exists on this object"),this._buffers.add(t,e,s),this}stopAll(t){return this._players.forEach(e=>e.stop(t)),this}dispose(){return super.dispose(),this._volume.dispose(),this.volume.dispose(),this._players.forEach(t=>t.dispose()),this._buffers.dispose(),this}}class Sr extends Ho{constructor(){super(Di(Sr.getDefaults(),arguments,["url","onload"])),this.name="GrainPlayer",this._loopStart=0,this._loopEnd=0,this._activeSources=[];const t=Di(Sr.getDefaults(),arguments,["url","onload"]);this.buffer=new Xi({onload:t.onload,onerror:t.onerror,reverse:t.reverse,url:t.url}),this._clock=new qo({context:this.context,callback:this._tick.bind(this),frequency:1/t.grainSize}),this._playbackRate=t.playbackRate,this._grainSize=t.grainSize,this._overlap=t.overlap,this.detune=t.detune,this.overlap=t.overlap,this.loop=t.loop,this.playbackRate=t.playbackRate,this.grainSize=t.grainSize,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.reverse=t.reverse,this._clock.on("stop",this._onstop.bind(this))}static getDefaults(){return Object.assign(Ho.getDefaults(),{onload:Zi,onerror:Zi,overlap:.1,grainSize:.2,playbackRate:1,detune:0,loop:!1,loopStart:0,loopEnd:0,reverse:!1})}_start(t,e,s){e=Oi(e,0),e=this.toSeconds(e),t=this.toSeconds(t);const n=1/this._clock.frequency.getValueAtTime(t);this._clock.start(t,e/n),s&&this.stop(t+this.toSeconds(s))}restart(t,e,s){return super.restart(t,e,s),this}_restart(t,e,s){this._stop(t),this._start(t,e,s)}_stop(t){this._clock.stop(t)}_onstop(t){this._activeSources.forEach(e=>{e.fadeOut=0,e.stop(t)}),this.onstop(this)}_tick(t){const e=this._clock.getTicksAtTime(t),s=e*this._grainSize;if(this.log("offset",s),!this.loop&&s>this.buffer.duration)return void this.stop(t);const n=s<this._overlap?0:this._overlap,i=new $o({context:this.context,url:this.buffer,fadeIn:n,fadeOut:this._overlap,loop:this.loop,loopStart:this._loopStart,loopEnd:this._loopEnd,playbackRate:no(this.detune/100)}).connect(this.output);i.start(t,this._grainSize*e),i.stop(t+this._grainSize/this.playbackRate),this._activeSources.push(i),i.onended=()=>{const t=this._activeSources.indexOf(i);-1!==t&&this._activeSources.splice(t,1)}}get playbackRate(){return this._playbackRate}set playbackRate(t){ei(t,.001),this._playbackRate=t,this.grainSize=this._grainSize}get loopStart(){return this._loopStart}set loopStart(t){this.buffer.loaded&&ei(this.toSeconds(t),0,this.buffer.duration),this._loopStart=this.toSeconds(t)}get loopEnd(){return this._loopEnd}set loopEnd(t){this.buffer.loaded&&ei(this.toSeconds(t),0,this.buffer.duration),this._loopEnd=this.toSeconds(t)}get reverse(){return this.buffer.reverse}set reverse(t){this.buffer.reverse=t}get grainSize(){return this._grainSize}set grainSize(t){this._grainSize=this.toSeconds(t),this._clock.frequency.setValueAtTime(this._playbackRate/this._grainSize,this.now())}get overlap(){return this._overlap}set overlap(t){const e=this.toSeconds(t);ei(e,0),this._overlap=e}get loaded(){return this.buffer.loaded}dispose(){return super.dispose(),this.buffer.dispose(),this._clock.dispose(),this._activeSources.forEach(t=>t.dispose()),this}}class kr extends or{constructor(){super(...arguments),this.name="Abs",this._abs=new rr({context:this.context,mapping:t=>Math.abs(t)<.001?0:Math.abs(t)}),this.input=this._abs,this.output=this._abs}dispose(){return super.dispose(),this._abs.dispose(),this}}class Cr extends or{constructor(){super(...arguments),this.name="GainToAudio",this._norm=new rr({context:this.context,mapping:t=>2*Math.abs(t)-1}),this.input=this._norm,this.output=this._norm}dispose(){return super.dispose(),this._norm.dispose(),this}}class Ar extends or{constructor(){super(...arguments),this.name="Negate",this._multiply=new cr({context:this.context,value:-1}),this.input=this._multiply,this.output=this._multiply}dispose(){return super.dispose(),this._multiply.dispose(),this}}class Dr extends Do{constructor(){super(Object.assign(Di(Dr.getDefaults(),arguments,["value"]))),this.override=!1,this.name="Subtract",this._sum=new ko({context:this.context}),this.input=this._sum,this.output=this._sum,this._neg=new Ar({context:this.context}),this.subtrahend=this._param,bo(this._constantSource,this._neg,this._sum)}static getDefaults(){return Object.assign(Do.getDefaults(),{value:0})}dispose(){return super.dispose(),this._neg.dispose(),this._sum.dispose(),this}}class Or extends or{constructor(){super(Object.assign(Di(Or.getDefaults(),arguments))),this.name="GreaterThanZero",this._thresh=this.output=new rr({context:this.context,length:127,mapping:t=>t<=0?0:1}),this._scale=this.input=new cr({context:this.context,value:1e4}),this._scale.connect(this._thresh)}dispose(){return super.dispose(),this._scale.dispose(),this._thresh.dispose(),this}}class Mr extends Do{constructor(){super(Object.assign(Di(Mr.getDefaults(),arguments,["value"]))),this.name="GreaterThan",this.override=!1;const t=Di(Mr.getDefaults(),arguments,["value"]);this._subtract=this.input=new Dr({context:this.context,value:t.value}),this._gtz=this.output=new Or({context:this.context}),this.comparator=this._param=this._subtract.subtrahend,Ui(this,"comparator"),this._subtract.connect(this._gtz)}static getDefaults(){return Object.assign(Do.getDefaults(),{value:0})}dispose(){return super.dispose(),this._gtz.dispose(),this._subtract.dispose(),this.comparator.dispose(),this}}class Er extends or{constructor(){super(Object.assign(Di(Er.getDefaults(),arguments,["value"]))),this.name="Pow";const t=Di(Er.getDefaults(),arguments,["value"]);this._exponentScaler=this.input=this.output=new rr({context:this.context,mapping:this._expFunc(t.value),length:8192}),this._exponent=t.value}static getDefaults(){return Object.assign(or.getDefaults(),{value:1})}_expFunc(t){return e=>Math.pow(Math.abs(e),t)}get value(){return this._exponent}set value(t){this._exponent=t,this._exponentScaler.setMap(this._expFunc(this._exponent))}dispose(){return super.dispose(),this._exponentScaler.dispose(),this}}class Rr extends gr{constructor(){super(Object.assign(Di(Rr.getDefaults(),arguments,["min","max","exponent"]))),this.name="ScaleExp";const t=Di(Rr.getDefaults(),arguments,["min","max","exponent"]);this.input=this._exp=new Er({context:this.context,value:t.exponent}),this._exp.connect(this._mult)}static getDefaults(){return Object.assign(gr.getDefaults(),{exponent:1})}get exponent(){return this._exp.value}set exponent(t){this._exp.value=t}dispose(){return super.dispose(),this._exp.dispose(),this}}class qr extends Do{constructor(){super(Di(Do.getDefaults(),arguments,["value","units"])),this.name="SyncedSignal",this.override=!1;const t=Di(Do.getDefaults(),arguments,["value","units"]);this._lastVal=t.value,this._synced=this.context.transport.scheduleRepeat(this._onTick.bind(this),"1i"),this._syncedCallback=this._anchorValue.bind(this),this.context.transport.on("start",this._syncedCallback),this.context.transport.on("pause",this._syncedCallback),this.context.transport.on("stop",this._syncedCallback),this._constantSource.disconnect(),this._constantSource.stop(0),this._constantSource=this.output=new Ao({context:this.context,offset:t.value,units:t.units}).start(0),this.setValueAtTime(t.value,0)}_onTick(t){const e=super.getValueAtTime(this.context.transport.seconds);this._lastVal!==e&&(this._lastVal=e,this._constantSource.offset.setValueAtTime(e,t))}_anchorValue(t){const e=super.getValueAtTime(this.context.transport.seconds);this._lastVal=e,this._constantSource.offset.cancelAndHoldAtTime(t),this._constantSource.offset.setValueAtTime(e,t)}getValueAtTime(t){const e=new mo(this.context,t).toSeconds();return super.getValueAtTime(e)}setValueAtTime(t,e){const s=new mo(this.context,e).toSeconds();return super.setValueAtTime(t,s),this}linearRampToValueAtTime(t,e){const s=new mo(this.context,e).toSeconds();return super.linearRampToValueAtTime(t,s),this}exponentialRampToValueAtTime(t,e){const s=new mo(this.context,e).toSeconds();return super.exponentialRampToValueAtTime(t,s),this}setTargetAtTime(t,e,s){const n=new mo(this.context,e).toSeconds();return super.setTargetAtTime(t,n,s),this}cancelScheduledValues(t){const e=new mo(this.context,t).toSeconds();return super.cancelScheduledValues(e),this}setValueCurveAtTime(t,e,s,n){const i=new mo(this.context,e).toSeconds();return s=this.toSeconds(s),super.setValueCurveAtTime(t,i,s,n),this}cancelAndHoldAtTime(t){const e=new mo(this.context,t).toSeconds();return super.cancelAndHoldAtTime(e),this}setRampPoint(t){const e=new mo(this.context,t).toSeconds();return super.setRampPoint(e),this}exponentialRampTo(t,e,s){const n=new mo(this.context,s).toSeconds();return super.exponentialRampTo(t,e,n),this}linearRampTo(t,e,s){const n=new mo(this.context,s).toSeconds();return super.linearRampTo(t,e,n),this}targetRampTo(t,e,s){const n=new mo(this.context,s).toSeconds();return super.targetRampTo(t,e,n),this}dispose(){return super.dispose(),this.context.transport.clear(this._synced),this.context.transport.off("start",this._syncedCallback),this.context.transport.off("pause",this._syncedCallback),this.context.transport.off("stop",this._syncedCallback),this._constantSource.dispose(),this}}class Fr extends wo{constructor(){super(Di(Fr.getDefaults(),arguments,["attack","decay","sustain","release"])),this.name="Envelope",this._sig=new Do({context:this.context,value:0}),this.output=this._sig,this.input=void 0;const t=Di(Fr.getDefaults(),arguments,["attack","decay","sustain","release"]);this.attack=t.attack,this.decay=t.decay,this.sustain=t.sustain,this.release=t.release,this.attackCurve=t.attackCurve,this.releaseCurve=t.releaseCurve,this.decayCurve=t.decayCurve}static getDefaults(){return Object.assign(wo.getDefaults(),{attack:.01,attackCurve:"linear",decay:.1,decayCurve:"exponential",release:1,releaseCurve:"exponential",sustain:.5})}get value(){return this.getValueAtTime(this.now())}_getCurve(t,e){if(fi(t))return t;{let s;for(s in Ir)if(Ir[s][e]===t)return s;return t}}_setCurve(t,e,s){if(fi(s)&&Reflect.has(Ir,s)){const n=Ir[s];li(n)?"_decayCurve"!==t&&(this[t]=n[e]):this[t]=n}else{if(!di(s)||"_decayCurve"===t)throw new Error("Envelope: invalid curve: "+s);this[t]=s}}get attackCurve(){return this._getCurve(this._attackCurve,"In")}set attackCurve(t){this._setCurve("_attackCurve","In",t)}get releaseCurve(){return this._getCurve(this._releaseCurve,"Out")}set releaseCurve(t){this._setCurve("_releaseCurve","Out",t)}get decayCurve(){return this._decayCurve}set decayCurve(t){ti(["linear","exponential"].some(e=>e===t),"Invalid envelope curve: "+t),this._decayCurve=t}triggerAttack(t,e=1){this.log("triggerAttack",t,e),t=this.toSeconds(t);let s=this.toSeconds(this.attack);const n=this.toSeconds(this.decay),i=this.getValueAtTime(t);if(i>0){s=(1-i)/(1/s)}if(s<this.sampleTime)this._sig.cancelScheduledValues(t),this._sig.setValueAtTime(e,t);else if("linear"===this._attackCurve)this._sig.linearRampTo(e,s,t);else if("exponential"===this._attackCurve)this._sig.targetRampTo(e,s,t);else{this._sig.cancelAndHoldAtTime(t);let n=this._attackCurve;for(let t=1;t<n.length;t++)if(n[t-1]<=i&&i<=n[t]){n=this._attackCurve.slice(t),n[0]=i;break}this._sig.setValueCurveAtTime(n,t,s,e)}if(n&&this.sustain<1){const i=e*this.sustain,o=t+s;this.log("decay",o),"linear"===this._decayCurve?this._sig.linearRampToValueAtTime(i,n+o):this._sig.exponentialApproachValueAtTime(i,o,n)}return this}triggerRelease(t){this.log("triggerRelease",t),t=this.toSeconds(t);const e=this.getValueAtTime(t);if(e>0){const s=this.toSeconds(this.release);s<this.sampleTime?this._sig.setValueAtTime(0,t):"linear"===this._releaseCurve?this._sig.linearRampTo(0,s,t):"exponential"===this._releaseCurve?this._sig.targetRampTo(0,s,t):(ti(di(this._releaseCurve),"releaseCurve must be either 'linear', 'exponential' or an array"),this._sig.cancelAndHoldAtTime(t),this._sig.setValueCurveAtTime(this._releaseCurve,t,s,e))}return this}getValueAtTime(t){return this._sig.getValueAtTime(t)}triggerAttackRelease(t,e,s=1){return e=this.toSeconds(e),this.triggerAttack(e,s),this.triggerRelease(e+this.toSeconds(t)),this}cancel(t){return this._sig.cancelScheduledValues(this.toSeconds(t)),this}connect(t,e=0,s=0){return Oo(this,t,e,s),this}asArray(t=1024){return yi(this,void 0,void 0,(function*(){const e=t/this.context.sampleRate,s=new Yi(1,e,this.context.sampleRate),n=this.toSeconds(this.attack)+this.toSeconds(this.decay),i=n+this.toSeconds(this.release),o=.1*i,r=i+o,a=new this.constructor(Object.assign(this.get(),{attack:e*this.toSeconds(this.attack)/r,decay:e*this.toSeconds(this.decay)/r,release:e*this.toSeconds(this.release)/r,context:s}));a._sig.toDestination(),a.triggerAttackRelease(e*(n+o)/r,0);return(yield s.render()).getChannelData(0)}))}dispose(){return super.dispose(),this._sig.dispose(),this}}vi([wr(0)],Fr.prototype,"attack",void 0),vi([wr(0)],Fr.prototype,"decay",void 0),vi([xr(0,1)],Fr.prototype,"sustain",void 0),vi([wr(0)],Fr.prototype,"release",void 0);const Ir=(()=>{let t,e;const s=[];for(t=0;t<128;t++)s[t]=Math.sin(t/127*(Math.PI/2));const n=[];for(t=0;t<127;t++){e=t/127;const s=Math.sin(e*(2*Math.PI)*6.4-Math.PI/2)+1;n[t]=s/10+.83*e}n[127]=1;const i=[];for(t=0;t<128;t++)i[t]=Math.ceil(t/127*5)/5;const o=[];for(t=0;t<128;t++)e=t/127,o[t]=.5*(1-Math.cos(Math.PI*e));const r=[];for(t=0;t<128;t++){e=t/127;const s=4*Math.pow(e,3)+.2,n=Math.cos(s*Math.PI*2*e);r[t]=Math.abs(n*(1-e))}function a(t){const e=new Array(t.length);for(let s=0;s<t.length;s++)e[s]=1-t[s];return e}return{bounce:{In:a(r),Out:r},cosine:{In:s,Out:(c=s,c.slice(0).reverse())},exponential:"exponential",linear:"linear",ripple:{In:n,Out:a(n)},sine:{In:o,Out:a(o)},step:{In:i,Out:a(i)}};var c})();class Vr extends wo{constructor(){super(Di(Vr.getDefaults(),arguments)),this._scheduledEvents=[],this._synced=!1,this._original_triggerAttack=this.triggerAttack,this._original_triggerRelease=this.triggerRelease;const t=Di(Vr.getDefaults(),arguments);this._volume=this.output=new Go({context:this.context,volume:t.volume}),this.volume=this._volume.volume,Ui(this,"volume")}static getDefaults(){return Object.assign(wo.getDefaults(),{volume:0})}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",1),this._syncMethod("triggerRelease",0)),this}_syncState(){let t=!1;return this._synced||(this._synced=!0,t=!0),t}_syncMethod(t,e){const s=this["_original_"+t]=this[t];this[t]=(...t)=>{const n=t[e],i=this.context.transport.schedule(n=>{t[e]=n,s.apply(this,t)},n);this._scheduledEvents.push(i)}}unsync(){return this._scheduledEvents.forEach(t=>this.context.transport.clear(t)),this._scheduledEvents=[],this._synced&&(this._synced=!1,this.triggerAttack=this._original_triggerAttack,this.triggerRelease=this._original_triggerRelease),this}triggerAttackRelease(t,e,s,n){const i=this.toSeconds(s),o=this.toSeconds(e);return this.triggerAttack(t,i,n),this.triggerRelease(i+o),this}dispose(){return super.dispose(),this._volume.dispose(),this.unsync(),this._scheduledEvents=[],this}}class Nr extends Vr{constructor(){super(Di(Nr.getDefaults(),arguments));const t=Di(Nr.getDefaults(),arguments);this.portamento=t.portamento,this.onsilence=t.onsilence}static getDefaults(){return Object.assign(Vr.getDefaults(),{detune:0,onsilence:Zi,portamento:0})}triggerAttack(t,e,s=1){this.log("triggerAttack",t,e,s);const n=this.toSeconds(e);return this._triggerEnvelopeAttack(n,s),this.setNote(t,n),this}triggerRelease(t){this.log("triggerRelease",t);const e=this.toSeconds(t);return this._triggerEnvelopeRelease(e),this}setNote(t,e){const s=this.toSeconds(e),n=t instanceof lo?t.toFrequency():t;if(this.portamento>0&&this.getLevelAtTime(s)>.05){const t=this.toSeconds(this.portamento);this.frequency.exponentialRampTo(n,t,s)}else this.frequency.setValueAtTime(n,s);return this}}vi([wr(0)],Nr.prototype,"portamento",void 0);class Pr extends Fr{constructor(){super(Di(Pr.getDefaults(),arguments,["attack","decay","sustain","release"])),this.name="AmplitudeEnvelope",this._gainNode=new ko({context:this.context,gain:0}),this.output=this._gainNode,this.input=this._gainNode,this._sig.connect(this._gainNode.gain),this.output=this._gainNode,this.input=this._gainNode}dispose(){return super.dispose(),this._gainNode.dispose(),this}}class jr extends Nr{constructor(){super(Di(jr.getDefaults(),arguments)),this.name="Synth";const t=Di(jr.getDefaults(),arguments);this.oscillator=new _r(Object.assign({context:this.context,detune:t.detune,onstop:()=>this.onsilence(this)},t.oscillator)),this.frequency=this.oscillator.frequency,this.detune=this.oscillator.detune,this.envelope=new Pr(Object.assign({context:this.context},t.envelope)),this.oscillator.chain(this.envelope,this.output),Ui(this,["oscillator","frequency","detune","envelope"])}static getDefaults(){return Object.assign(Nr.getDefaults(),{envelope:Object.assign(Mi(Fr.getDefaults(),Object.keys(wo.getDefaults())),{attack:.005,decay:.1,release:1,sustain:.3}),oscillator:Object.assign(Mi(_r.getDefaults(),[...Object.keys(Ho.getDefaults()),"frequency","detune"]),{type:"triangle"})})}_triggerEnvelopeAttack(t,e){if(this.envelope.triggerAttack(t,e),this.oscillator.start(t),0===this.envelope.sustain){const e=this.toSeconds(this.envelope.attack),s=this.toSeconds(this.envelope.decay);this.oscillator.stop(t+e+s)}}_triggerEnvelopeRelease(t){this.envelope.triggerRelease(t),this.oscillator.stop(t+this.toSeconds(this.envelope.release))}getLevelAtTime(t){return t=this.toSeconds(t),this.envelope.getValueAtTime(t)}dispose(){return super.dispose(),this.oscillator.dispose(),this.envelope.dispose(),this}}class Lr extends Nr{constructor(){super(Di(Lr.getDefaults(),arguments)),this.name="ModulationSynth";const t=Di(Lr.getDefaults(),arguments);this._carrier=new jr({context:this.context,oscillator:t.oscillator,envelope:t.envelope,onsilence:()=>this.onsilence(this),volume:-10}),this._modulator=new jr({context:this.context,oscillator:t.modulation,envelope:t.modulationEnvelope,volume:-10}),this.oscillator=this._carrier.oscillator,this.envelope=this._carrier.envelope,this.modulation=this._modulator.oscillator,this.modulationEnvelope=this._modulator.envelope,this.frequency=new Do({context:this.context,units:"frequency"}),this.detune=new Do({context:this.context,value:t.detune,units:"cents"}),this.harmonicity=new cr({context:this.context,value:t.harmonicity,minValue:0}),this._modulationNode=new ko({context:this.context,gain:0}),Ui(this,["frequency","harmonicity","oscillator","envelope","modulation","modulationEnvelope","detune"])}static getDefaults(){return Object.assign(Nr.getDefaults(),{harmonicity:3,oscillator:Object.assign(Mi(_r.getDefaults(),[...Object.keys(Ho.getDefaults()),"frequency","detune"]),{type:"sine"}),envelope:Object.assign(Mi(Fr.getDefaults(),Object.keys(wo.getDefaults())),{attack:.01,decay:.01,sustain:1,release:.5}),modulation:Object.assign(Mi(_r.getDefaults(),[...Object.keys(Ho.getDefaults()),"frequency","detune"]),{type:"square"}),modulationEnvelope:Object.assign(Mi(Fr.getDefaults(),Object.keys(wo.getDefaults())),{attack:.5,decay:0,sustain:1,release:.5})})}_triggerEnvelopeAttack(t,e){this._carrier._triggerEnvelopeAttack(t,e),this._modulator._triggerEnvelopeAttack(t,e)}_triggerEnvelopeRelease(t){return this._carrier._triggerEnvelopeRelease(t),this._modulator._triggerEnvelopeRelease(t),this}getLevelAtTime(t){return t=this.toSeconds(t),this.envelope.getValueAtTime(t)}dispose(){return super.dispose(),this._carrier.dispose(),this._modulator.dispose(),this.frequency.dispose(),this.detune.dispose(),this.harmonicity.dispose(),this._modulationNode.dispose(),this}}class zr extends Lr{constructor(){super(Di(zr.getDefaults(),arguments)),this.name="AMSynth",this._modulationScale=new ar({context:this.context}),this.frequency.connect(this._carrier.frequency),this.frequency.chain(this.harmonicity,this._modulator.frequency),this.detune.fan(this._carrier.detune,this._modulator.detune),this._modulator.chain(this._modulationScale,this._modulationNode.gain),this._carrier.chain(this._modulationNode,this.output)}dispose(){return super.dispose(),this._modulationScale.dispose(),this}}class Br extends wo{constructor(){super(Di(Br.getDefaults(),arguments,["frequency","type"])),this.name="BiquadFilter";const t=Di(Br.getDefaults(),arguments,["frequency","type"]);this._filter=this.context.createBiquadFilter(),this.input=this.output=this._filter,this.Q=new xo({context:this.context,units:"number",value:t.Q,param:this._filter.Q}),this.frequency=new xo({context:this.context,units:"frequency",value:t.frequency,param:this._filter.frequency}),this.detune=new xo({context:this.context,units:"cents",value:t.detune,param:this._filter.detune}),this.gain=new xo({context:this.context,units:"decibels",convert:!1,value:t.gain,param:this._filter.gain}),this.type=t.type}static getDefaults(){return Object.assign(wo.getDefaults(),{Q:1,type:"lowpass",frequency:350,detune:0,gain:0})}get type(){return this._filter.type}set type(t){ti(-1!==["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(t),"Invalid filter type: "+t),this._filter.type=t}getFrequencyResponse(t=128){const e=new Float32Array(t);for(let s=0;s<t;s++){const n=19980*Math.pow(s/t,2)+20;e[s]=n}const s=new Float32Array(t),n=new Float32Array(t),i=this.context.createBiquadFilter();return i.type=this.type,i.Q.value=this.Q.value,i.frequency.value=this.frequency.value,i.gain.value=this.gain.value,i.getFrequencyResponse(e,s,n),s}dispose(){return super.dispose(),this._filter.disconnect(),this.Q.dispose(),this.frequency.dispose(),this.gain.dispose(),this.detune.dispose(),this}}class Wr extends wo{constructor(){super(Di(Wr.getDefaults(),arguments,["frequency","type","rolloff"])),this.name="Filter",this.input=new ko({context:this.context}),this.output=new ko({context:this.context}),this._filters=[];const t=Di(Wr.getDefaults(),arguments,["frequency","type","rolloff"]);this._filters=[],this.Q=new Do({context:this.context,units:"positive",value:t.Q}),this.frequency=new Do({context:this.context,units:"frequency",value:t.frequency}),this.detune=new Do({context:this.context,units:"cents",value:t.detune}),this.gain=new Do({context:this.context,units:"decibels",convert:!1,value:t.gain}),this._type=t.type,this.rolloff=t.rolloff,Ui(this,["detune","frequency","gain","Q"])}static getDefaults(){return Object.assign(wo.getDefaults(),{Q:1,detune:0,frequency:350,gain:0,rolloff:-12,type:"lowpass"})}get type(){return this._type}set type(t){ti(-1!==["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(t),"Invalid filter type: "+t),this._type=t,this._filters.forEach(e=>e.type=t)}get rolloff(){return this._rolloff}set rolloff(t){const e=ui(t)?t:parseInt(t,10),s=[-12,-24,-48,-96];let n=s.indexOf(e);ti(-1!==n,"rolloff can only be "+s.join(", ")),n+=1,this._rolloff=e,this.input.disconnect(),this._filters.forEach(t=>t.disconnect()),this._filters=new Array(n);for(let t=0;t<n;t++){const e=new Br({context:this.context});e.type=this._type,this.frequency.connect(e.frequency),this.detune.connect(e.detune),this.Q.connect(e.Q),this.gain.connect(e.gain),this._filters[t]=e}this._internalChannels=this._filters,bo(this.input,...this._internalChannels,this.output)}getFrequencyResponse(t=128){const e=new Br({frequency:this.frequency.value,gain:this.gain.value,Q:this.Q.value,type:this._type,detune:this.detune.value}),s=new Float32Array(t).map(()=>1);return this._filters.forEach(()=>{e.getFrequencyResponse(t).forEach((t,e)=>s[e]*=t)}),e.dispose(),s}dispose(){return super.dispose(),this._filters.forEach(t=>{t.dispose()}),Qi(this,["detune","frequency","gain","Q"]),this.frequency.dispose(),this.Q.dispose(),this.detune.dispose(),this.gain.dispose(),this}}class Gr extends Fr{constructor(){super(Di(Gr.getDefaults(),arguments,["attack","decay","sustain","release"])),this.name="FrequencyEnvelope";const t=Di(Gr.getDefaults(),arguments,["attack","decay","sustain","release"]);this._octaves=t.octaves,this._baseFrequency=this.toFrequency(t.baseFrequency),this._exponent=this.input=new Er({context:this.context,value:t.exponent}),this._scale=this.output=new gr({context:this.context,min:this._baseFrequency,max:this._baseFrequency*Math.pow(2,this._octaves)}),this._sig.chain(this._exponent,this._scale)}static getDefaults(){return Object.assign(Fr.getDefaults(),{baseFrequency:200,exponent:1,octaves:4})}get baseFrequency(){return this._baseFrequency}set baseFrequency(t){const e=this.toFrequency(t);ei(e,0),this._baseFrequency=e,this._scale.min=this._baseFrequency,this.octaves=this._octaves}get octaves(){return this._octaves}set octaves(t){this._octaves=t,this._scale.max=this._baseFrequency*Math.pow(2,t)}get exponent(){return this._exponent.value}set exponent(t){this._exponent.value=t}dispose(){return super.dispose(),this._exponent.dispose(),this._scale.dispose(),this}}class Ur extends Nr{constructor(){super(Di(Ur.getDefaults(),arguments)),this.name="MonoSynth";const t=Di(Ur.getDefaults(),arguments);this.oscillator=new _r(Object.assign(t.oscillator,{context:this.context,detune:t.detune,onstop:()=>this.onsilence(this)})),this.frequency=this.oscillator.frequency,this.detune=this.oscillator.detune,this.filter=new Wr(Object.assign(t.filter,{context:this.context})),this.filterEnvelope=new Gr(Object.assign(t.filterEnvelope,{context:this.context})),this.envelope=new Pr(Object.assign(t.envelope,{context:this.context})),this.oscillator.chain(this.filter,this.envelope,this.output),this.filterEnvelope.connect(this.filter.frequency),Ui(this,["oscillator","frequency","detune","filter","filterEnvelope","envelope"])}static getDefaults(){return Object.assign(Nr.getDefaults(),{envelope:Object.assign(Mi(Fr.getDefaults(),Object.keys(wo.getDefaults())),{attack:.005,decay:.1,release:1,sustain:.9}),filter:Object.assign(Mi(Wr.getDefaults(),Object.keys(wo.getDefaults())),{Q:1,rolloff:-12,type:"lowpass"}),filterEnvelope:Object.assign(Mi(Gr.getDefaults(),Object.keys(wo.getDefaults())),{attack:.6,baseFrequency:200,decay:.2,exponent:2,octaves:3,release:2,sustain:.5}),oscillator:Object.assign(Mi(_r.getDefaults(),Object.keys(Ho.getDefaults())),{type:"sawtooth"})})}_triggerEnvelopeAttack(t,e=1){if(this.envelope.triggerAttack(t,e),this.filterEnvelope.triggerAttack(t),this.oscillator.start(t),0===this.envelope.sustain){const e=this.toSeconds(this.envelope.attack),s=this.toSeconds(this.envelope.decay);this.oscillator.stop(t+e+s)}}_triggerEnvelopeRelease(t){this.envelope.triggerRelease(t),this.filterEnvelope.triggerRelease(t),this.oscillator.stop(t+this.toSeconds(this.envelope.release))}getLevelAtTime(t){return t=this.toSeconds(t),this.envelope.getValueAtTime(t)}dispose(){return super.dispose(),this.oscillator.dispose(),this.envelope.dispose(),this.filterEnvelope.dispose(),this.filter.dispose(),this}}class Qr extends Nr{constructor(){super(Di(Qr.getDefaults(),arguments)),this.name="DuoSynth";const t=Di(Qr.getDefaults(),arguments);this.voice0=new Ur(Object.assign(t.voice0,{context:this.context,onsilence:()=>this.onsilence(this)})),this.voice1=new Ur(Object.assign(t.voice1,{context:this.context})),this.harmonicity=new cr({context:this.context,units:"positive",value:t.harmonicity}),this._vibrato=new yr({frequency:t.vibratoRate,context:this.context,min:-50,max:50}),this._vibrato.start(),this.vibratoRate=this._vibrato.frequency,this._vibratoGain=new ko({context:this.context,units:"normalRange",gain:t.vibratoAmount}),this.vibratoAmount=this._vibratoGain.gain,this.frequency=new Do({context:this.context,units:"frequency",value:440}),this.detune=new Do({context:this.context,units:"cents",value:t.detune}),this.frequency.connect(this.voice0.frequency),this.frequency.chain(this.harmonicity,this.voice1.frequency),this._vibrato.connect(this._vibratoGain),this._vibratoGain.fan(this.voice0.detune,this.voice1.detune),this.detune.fan(this.voice0.detune,this.voice1.detune),this.voice0.connect(this.output),this.voice1.connect(this.output),Ui(this,["voice0","voice1","frequency","vibratoAmount","vibratoRate"])}getLevelAtTime(t){return t=this.toSeconds(t),this.voice0.envelope.getValueAtTime(t)+this.voice1.envelope.getValueAtTime(t)}static getDefaults(){return Ai(Nr.getDefaults(),{vibratoAmount:.5,vibratoRate:5,harmonicity:1.5,voice0:Ai(Mi(Ur.getDefaults(),Object.keys(Nr.getDefaults())),{filterEnvelope:{attack:.01,decay:0,sustain:1,release:.5},envelope:{attack:.01,decay:0,sustain:1,release:.5}}),voice1:Ai(Mi(Ur.getDefaults(),Object.keys(Nr.getDefaults())),{filterEnvelope:{attack:.01,decay:0,sustain:1,release:.5},envelope:{attack:.01,decay:0,sustain:1,release:.5}})})}_triggerEnvelopeAttack(t,e){this.voice0._triggerEnvelopeAttack(t,e),this.voice1._triggerEnvelopeAttack(t,e)}_triggerEnvelopeRelease(t){return this.voice0._triggerEnvelopeRelease(t),this.voice1._triggerEnvelopeRelease(t),this}dispose(){return super.dispose(),this.voice0.dispose(),this.voice1.dispose(),this.frequency.dispose(),this.detune.dispose(),this._vibrato.dispose(),this.vibratoRate.dispose(),this._vibratoGain.dispose(),this.harmonicity.dispose(),this}}class Zr extends Lr{constructor(){super(Di(Zr.getDefaults(),arguments)),this.name="FMSynth";const t=Di(Zr.getDefaults(),arguments);this.modulationIndex=new cr({context:this.context,value:t.modulationIndex}),this.frequency.connect(this._carrier.frequency),this.frequency.chain(this.harmonicity,this._modulator.frequency),this.frequency.chain(this.modulationIndex,this._modulationNode),this.detune.fan(this._carrier.detune,this._modulator.detune),this._modulator.connect(this._modulationNode.gain),this._modulationNode.connect(this._carrier.frequency),this._carrier.connect(this.output)}static getDefaults(){return Object.assign(Lr.getDefaults(),{modulationIndex:10})}dispose(){return super.dispose(),this.modulationIndex.dispose(),this}}const Xr=[1,1.483,1.932,2.546,2.63,3.897];class Yr extends Nr{constructor(){super(Di(Yr.getDefaults(),arguments)),this.name="MetalSynth",this._oscillators=[],this._freqMultipliers=[];const t=Di(Yr.getDefaults(),arguments);this.detune=new Do({context:this.context,units:"cents",value:t.detune}),this.frequency=new Do({context:this.context,units:"frequency"}),this._amplitude=new ko({context:this.context,gain:0}).connect(this.output),this._highpass=new Wr({Q:0,context:this.context,type:"highpass"}).connect(this._amplitude);for(let e=0;e<Xr.length;e++){const s=new ur({context:this.context,harmonicity:t.harmonicity,modulationIndex:t.modulationIndex,modulationType:"square",onstop:0===e?()=>this.onsilence(this):Zi,type:"square"});s.connect(this._highpass),this._oscillators[e]=s;const n=new cr({context:this.context,value:Xr[e]});this._freqMultipliers[e]=n,this.frequency.chain(n,s.frequency),this.detune.connect(s.detune)}this._filterFreqScaler=new gr({context:this.context,max:7e3,min:this.toFrequency(t.resonance)}),this.envelope=new Fr({attack:t.envelope.attack,attackCurve:"linear",context:this.context,decay:t.envelope.decay,release:t.envelope.release,sustain:0}),this.envelope.chain(this._filterFreqScaler,this._highpass.frequency),this.envelope.connect(this._amplitude.gain),this._octaves=t.octaves,this.octaves=t.octaves}static getDefaults(){return Ai(Nr.getDefaults(),{envelope:Object.assign(Mi(Fr.getDefaults(),Object.keys(wo.getDefaults())),{attack:.001,decay:1.4,release:.2}),harmonicity:5.1,modulationIndex:32,octaves:1.5,resonance:4e3})}_triggerEnvelopeAttack(t,e=1){return this.envelope.triggerAttack(t,e),this._oscillators.forEach(e=>e.start(t)),0===this.envelope.sustain&&this._oscillators.forEach(e=>{e.stop(t+this.toSeconds(this.envelope.attack)+this.toSeconds(this.envelope.decay))}),this}_triggerEnvelopeRelease(t){return this.envelope.triggerRelease(t),this._oscillators.forEach(e=>e.stop(t+this.toSeconds(this.envelope.release))),this}getLevelAtTime(t){return t=this.toSeconds(t),this.envelope.getValueAtTime(t)}get modulationIndex(){return this._oscillators[0].modulationIndex.value}set modulationIndex(t){this._oscillators.forEach(e=>e.modulationIndex.value=t)}get harmonicity(){return this._oscillators[0].harmonicity.value}set harmonicity(t){this._oscillators.forEach(e=>e.harmonicity.value=t)}get resonance(){return this._filterFreqScaler.min}set resonance(t){this._filterFreqScaler.min=this.toFrequency(t),this.octaves=this._octaves}get octaves(){return this._octaves}set octaves(t){this._octaves=t,this._filterFreqScaler.max=this._filterFreqScaler.min*Math.pow(2,t)}dispose(){return super.dispose(),this._oscillators.forEach(t=>t.dispose()),this._freqMultipliers.forEach(t=>t.dispose()),this.frequency.dispose(),this.detune.dispose(),this._filterFreqScaler.dispose(),this._amplitude.dispose(),this.envelope.dispose(),this._highpass.dispose(),this}}class Hr extends jr{constructor(){super(Di(Hr.getDefaults(),arguments)),this.name="MembraneSynth",this.portamento=0;const t=Di(Hr.getDefaults(),arguments);this.pitchDecay=t.pitchDecay,this.octaves=t.octaves,Ui(this,["oscillator","envelope"])}static getDefaults(){return Ai(Nr.getDefaults(),jr.getDefaults(),{envelope:{attack:.001,attackCurve:"exponential",decay:.4,release:1.4,sustain:.01},octaves:10,oscillator:{type:"sine"},pitchDecay:.05})}setNote(t,e){const s=this.toSeconds(e),n=this.toFrequency(t instanceof lo?t.toFrequency():t),i=n*this.octaves;return this.oscillator.frequency.setValueAtTime(i,s),this.oscillator.frequency.exponentialRampToValueAtTime(n,s+this.toSeconds(this.pitchDecay)),this}dispose(){return super.dispose(),this}}vi([xr(0)],Hr.prototype,"octaves",void 0),vi([wr(0)],Hr.prototype,"pitchDecay",void 0);class $r extends Vr{constructor(){super(Di($r.getDefaults(),arguments)),this.name="NoiseSynth";const t=Di($r.getDefaults(),arguments);this.noise=new Jo(Object.assign({context:this.context},t.noise)),this.envelope=new Pr(Object.assign({context:this.context},t.envelope)),this.noise.chain(this.envelope,this.output)}static getDefaults(){return Object.assign(Vr.getDefaults(),{envelope:Object.assign(Mi(Fr.getDefaults(),Object.keys(wo.getDefaults())),{decay:.1,sustain:0}),noise:Object.assign(Mi(Jo.getDefaults(),Object.keys(Ho.getDefaults())),{type:"white"})})}triggerAttack(t,e=1){return t=this.toSeconds(t),this.envelope.triggerAttack(t,e),this.noise.start(t),0===this.envelope.sustain&&this.noise.stop(t+this.toSeconds(this.envelope.attack)+this.toSeconds(this.envelope.decay)),this}triggerRelease(t){return t=this.toSeconds(t),this.envelope.triggerRelease(t),this.noise.stop(t+this.toSeconds(this.envelope.release)),this}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",0),this._syncMethod("triggerRelease",0)),this}triggerAttackRelease(t,e,s=1){return e=this.toSeconds(e),t=this.toSeconds(t),this.triggerAttack(e,s),this.triggerRelease(e+t),this}dispose(){return super.dispose(),this.noise.dispose(),this.envelope.dispose(),this}}const Jr=new Set;function Kr(t){Jr.add(t)}function ta(t,e){const s=`registerProcessor("${t}", ${e})`;Jr.add(s)}class ea extends wo{constructor(t){super(t),this.name="ToneAudioWorklet",this.workletOptions={},this.onprocessorerror=Zi;const e=URL.createObjectURL(new Blob([Array.from(Jr).join("\n")],{type:"text/javascript"})),s=this._audioWorkletName();this._dummyGain=this.context.createGain(),this._dummyParam=this._dummyGain.gain,this.context.addAudioWorkletModule(e,s).then(()=>{this.disposed||(this._worklet=this.context.createAudioWorkletNode(s,this.workletOptions),this._worklet.onprocessorerror=this.onprocessorerror.bind(this),this.onReady(this._worklet))})}dispose(){return super.dispose(),this._dummyGain.disconnect(),this._worklet&&(this._worklet.port.postMessage("dispose"),this._worklet.disconnect()),this}}Kr('\n\t/**\n\t * The base AudioWorkletProcessor for use in Tone.js. Works with the [[ToneAudioWorklet]]. \n\t */\n\tclass ToneAudioWorkletProcessor extends AudioWorkletProcessor {\n\n\t\tconstructor(options) {\n\t\t\t\n\t\t\tsuper(options);\n\t\t\t/**\n\t\t\t * If the processor was disposed or not. Keep alive until it\'s disposed.\n\t\t\t */\n\t\t\tthis.disposed = false;\n\t\t   \t/** \n\t\t\t * The number of samples in the processing block\n\t\t\t */\n\t\t\tthis.blockSize = 128;\n\t\t\t/**\n\t\t\t * the sample rate\n\t\t\t */\n\t\t\tthis.sampleRate = sampleRate;\n\n\t\t\tthis.port.onmessage = (event) => {\n\t\t\t\t// when it receives a dispose \n\t\t\t\tif (event.data === "dispose") {\n\t\t\t\t\tthis.disposed = true;\n\t\t\t\t}\n\t\t\t};\n\t\t}\n\t}\n');Kr("\n\t/**\n\t * Abstract class for a single input/output processor. \n\t * has a 'generate' function which processes one sample at a time\n\t */\n\tclass SingleIOProcessor extends ToneAudioWorkletProcessor {\n\n\t\tconstructor(options) {\n\t\t\tsuper(Object.assign(options, {\n\t\t\t\tnumberOfInputs: 1,\n\t\t\t\tnumberOfOutputs: 1\n\t\t\t}));\n\t\t\t/**\n\t\t\t * Holds the name of the parameter and a single value of that\n\t\t\t * parameter at the current sample\n\t\t\t * @type { [name: string]: number }\n\t\t\t */\n\t\t\tthis.params = {}\n\t\t}\n\n\t\t/**\n\t\t * Generate an output sample from the input sample and parameters\n\t\t * @abstract\n\t\t * @param input number\n\t\t * @param channel number\n\t\t * @param parameters { [name: string]: number }\n\t\t * @returns number\n\t\t */\n\t\tgenerate(){}\n\n\t\t/**\n\t\t * Update the private params object with the \n\t\t * values of the parameters at the given index\n\t\t * @param parameters { [name: string]: Float32Array },\n\t\t * @param index number\n\t\t */\n\t\tupdateParams(parameters, index) {\n\t\t\tfor (const paramName in parameters) {\n\t\t\t\tconst param = parameters[paramName];\n\t\t\t\tif (param.length > 1) {\n\t\t\t\t\tthis.params[paramName] = parameters[paramName][index];\n\t\t\t\t} else {\n\t\t\t\t\tthis.params[paramName] = parameters[paramName][0];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Process a single frame of the audio\n\t\t * @param inputs Float32Array[][]\n\t\t * @param outputs Float32Array[][]\n\t\t */\n\t\tprocess(inputs, outputs, parameters) {\n\t\t\tconst input = inputs[0];\n\t\t\tconst output = outputs[0];\n\t\t\t// get the parameter values\n\t\t\tconst channelCount = Math.max(input && input.length || 0, output.length);\n\t\t\tfor (let sample = 0; sample < this.blockSize; sample++) {\n\t\t\t\tthis.updateParams(parameters, sample);\n\t\t\t\tfor (let channel = 0; channel < channelCount; channel++) {\n\t\t\t\t\tconst inputSample = input && input.length ? input[channel][sample] : 0;\n\t\t\t\t\toutput[channel][sample] = this.generate(inputSample, channel, this.params);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn !this.disposed;\n\t\t}\n\t};\n");Kr("\n\t/**\n\t * A multichannel buffer for use within an AudioWorkletProcessor as a delay line\n\t */\n\tclass DelayLine {\n\t\t\n\t\tconstructor(size, channels) {\n\t\t\tthis.buffer = [];\n\t\t\tthis.writeHead = []\n\t\t\tthis.size = size;\n\n\t\t\t// create the empty channels\n\t\t\tfor (let i = 0; i < channels; i++) {\n\t\t\t\tthis.buffer[i] = new Float32Array(this.size);\n\t\t\t\tthis.writeHead[i] = 0;\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Push a value onto the end\n\t\t * @param channel number\n\t\t * @param value number\n\t\t */\n\t\tpush(channel, value) {\n\t\t\tthis.writeHead[channel] += 1;\n\t\t\tif (this.writeHead[channel] > this.size) {\n\t\t\t\tthis.writeHead[channel] = 0;\n\t\t\t}\n\t\t\tthis.buffer[channel][this.writeHead[channel]] = value;\n\t\t}\n\n\t\t/**\n\t\t * Get the recorded value of the channel given the delay\n\t\t * @param channel number\n\t\t * @param delay number delay samples\n\t\t */\n\t\tget(channel, delay) {\n\t\t\tlet readHead = this.writeHead[channel] - Math.floor(delay);\n\t\t\tif (readHead < 0) {\n\t\t\t\treadHead += this.size;\n\t\t\t}\n\t\t\treturn this.buffer[channel][readHead];\n\t\t}\n\t}\n");ta("feedback-comb-filter",'\n\tclass FeedbackCombFilterWorklet extends SingleIOProcessor {\n\n\t\tconstructor(options) {\n\t\t\tsuper(options);\n\t\t\tthis.delayLine = new DelayLine(this.sampleRate, options.channelCount || 2);\n\t\t}\n\n\t\tstatic get parameterDescriptors() {\n\t\t\treturn [{\n\t\t\t\tname: "delayTime",\n\t\t\t\tdefaultValue: 0.1,\n\t\t\t\tminValue: 0,\n\t\t\t\tmaxValue: 1,\n\t\t\t\tautomationRate: "k-rate"\n\t\t\t}, {\n\t\t\t\tname: "feedback",\n\t\t\t\tdefaultValue: 0.5,\n\t\t\t\tminValue: 0,\n\t\t\t\tmaxValue: 0.9999,\n\t\t\t\tautomationRate: "k-rate"\n\t\t\t}];\n\t\t}\n\n\t\tgenerate(input, channel, parameters) {\n\t\t\tconst delayedSample = this.delayLine.get(channel, parameters.delayTime * this.sampleRate);\n\t\t\tthis.delayLine.push(channel, input + delayedSample * parameters.feedback);\n\t\t\treturn delayedSample;\n\t\t}\n\t}\n');class sa extends ea{constructor(){super(Di(sa.getDefaults(),arguments,["delayTime","resonance"])),this.name="FeedbackCombFilter";const t=Di(sa.getDefaults(),arguments,["delayTime","resonance"]);this.input=new ko({context:this.context}),this.output=new ko({context:this.context}),this.delayTime=new xo({context:this.context,value:t.delayTime,units:"time",minValue:0,maxValue:1,param:this._dummyParam,swappable:!0}),this.resonance=new xo({context:this.context,value:t.resonance,units:"normalRange",param:this._dummyParam,swappable:!0}),Ui(this,["resonance","delayTime"])}_audioWorkletName(){return"feedback-comb-filter"}static getDefaults(){return Object.assign(wo.getDefaults(),{delayTime:.1,resonance:.5})}onReady(t){bo(this.input,t,this.output);const e=t.parameters.get("delayTime");this.delayTime.setParam(e);const s=t.parameters.get("feedback");this.resonance.setParam(s)}dispose(){return super.dispose(),this.input.dispose(),this.output.dispose(),this.delayTime.dispose(),this.resonance.dispose(),this}}class na extends wo{constructor(){super(Di(na.getDefaults(),arguments,["frequency","type"])),this.name="OnePoleFilter";const t=Di(na.getDefaults(),arguments,["frequency","type"]);this._frequency=t.frequency,this._type=t.type,this.input=new ko({context:this.context}),this.output=new ko({context:this.context}),this._createFilter()}static getDefaults(){return Object.assign(wo.getDefaults(),{frequency:880,type:"lowpass"})}_createFilter(){const t=this._filter,e=this.toFrequency(this._frequency),s=1/(2*Math.PI*e);if("lowpass"===this._type){const t=1/(s*this.context.sampleRate),e=t-1;this._filter=this.context.createIIRFilter([t,0],[1,e])}else{const t=1/(s*this.context.sampleRate)-1;this._filter=this.context.createIIRFilter([1,-1],[1,t])}this.input.chain(this._filter,this.output),t&&this.context.setTimeout(()=>{this.disposed||(this.input.disconnect(t),t.disconnect())},this.blockTime)}get frequency(){return this._frequency}set frequency(t){this._frequency=t,this._createFilter()}get type(){return this._type}set type(t){this._type=t,this._createFilter()}getFrequencyResponse(t=128){const e=new Float32Array(t);for(let s=0;s<t;s++){const n=19980*Math.pow(s/t,2)+20;e[s]=n}const s=new Float32Array(t),n=new Float32Array(t);return this._filter.getFrequencyResponse(e,s,n),s}dispose(){return super.dispose(),this.input.dispose(),this.output.dispose(),this._filter.disconnect(),this}}class ia extends wo{constructor(){super(Di(ia.getDefaults(),arguments,["delayTime","resonance","dampening"])),this.name="LowpassCombFilter";const t=Di(ia.getDefaults(),arguments,["delayTime","resonance","dampening"]);this._combFilter=this.output=new sa({context:this.context,delayTime:t.delayTime,resonance:t.resonance}),this.delayTime=this._combFilter.delayTime,this.resonance=this._combFilter.resonance,this._lowpass=this.input=new na({context:this.context,frequency:t.dampening,type:"lowpass"}),this._lowpass.connect(this._combFilter)}static getDefaults(){return Object.assign(wo.getDefaults(),{dampening:3e3,delayTime:.1,resonance:.5})}get dampening(){return this._lowpass.frequency}set dampening(t){this._lowpass.frequency=t}dispose(){return super.dispose(),this._combFilter.dispose(),this._lowpass.dispose(),this}}class oa extends Vr{constructor(){super(Di(oa.getDefaults(),arguments)),this.name="PluckSynth";const t=Di(oa.getDefaults(),arguments);this._noise=new Jo({context:this.context,type:"pink"}),this.attackNoise=t.attackNoise,this._lfcf=new ia({context:this.context,dampening:t.dampening,resonance:t.resonance}),this.resonance=t.resonance,this.release=t.release,this._noise.connect(this._lfcf),this._lfcf.connect(this.output)}static getDefaults(){return Ai(Vr.getDefaults(),{attackNoise:1,dampening:4e3,resonance:.7,release:1})}get dampening(){return this._lfcf.dampening}set dampening(t){this._lfcf.dampening=t}triggerAttack(t,e){const s=this.toFrequency(t);e=this.toSeconds(e);const n=1/s;return this._lfcf.delayTime.setValueAtTime(n,e),this._noise.start(e),this._noise.stop(e+n*this.attackNoise),this._lfcf.resonance.cancelScheduledValues(e),this._lfcf.resonance.setValueAtTime(this.resonance,e),this}triggerRelease(t){return this._lfcf.resonance.linearRampTo(0,this.release,t),this}dispose(){return super.dispose(),this._noise.dispose(),this._lfcf.dispose(),this}}class ra extends Vr{constructor(){super(Di(ra.getDefaults(),arguments,["voice","options"])),this.name="PolySynth",this._availableVoices=[],this._activeVoices=[],this._voices=[],this._gcTimeout=-1,this._averageActiveVoices=0;const t=Di(ra.getDefaults(),arguments,["voice","options"]);ti(!ui(t.voice),"DEPRECATED: The polyphony count is no longer the first argument.");const e=t.voice.getDefaults();this.options=Object.assign(e,t.options),this.voice=t.voice,this.maxPolyphony=t.maxPolyphony,this._dummyVoice=this._getNextAvailableVoice();const s=this._voices.indexOf(this._dummyVoice);this._voices.splice(s,1),this._gcTimeout=this.context.setInterval(this._collectGarbage.bind(this),1)}static getDefaults(){return Object.assign(Vr.getDefaults(),{maxPolyphony:32,options:{},voice:jr})}get activeVoices(){return this._activeVoices.length}_makeVoiceAvailable(t){this._availableVoices.push(t);const e=this._activeVoices.findIndex(e=>e.voice===t);this._activeVoices.splice(e,1)}_getNextAvailableVoice(){if(this._availableVoices.length)return this._availableVoices.shift();if(this._voices.length<this.maxPolyphony){const t=new this.voice(Object.assign(this.options,{context:this.context,onsilence:this._makeVoiceAvailable.bind(this)}));return t.connect(this.output),this._voices.push(t),t}ri("Max polyphony exceeded. Note dropped.")}_collectGarbage(){if(this._averageActiveVoices=Math.max(.95*this._averageActiveVoices,this.activeVoices),this._availableVoices.length&&this._voices.length>Math.ceil(this._averageActiveVoices+1)){const t=this._availableVoices.shift(),e=this._voices.indexOf(t);this._voices.splice(e,1),this.context.isOffline||t.dispose()}}_triggerAttack(t,e,s){t.forEach(t=>{const n=new No(this.context,t).toMidi(),i=this._getNextAvailableVoice();i&&(i.triggerAttack(t,e,s),this._activeVoices.push({midi:n,voice:i,released:!1}),this.log("triggerAttack",t,e))})}_triggerRelease(t,e){t.forEach(t=>{const s=new No(this.context,t).toMidi(),n=this._activeVoices.find(({midi:t,released:e})=>t===s&&!e);n&&(n.voice.triggerRelease(e),n.released=!0,this.log("triggerRelease",t,e))})}_scheduleEvent(t,e,s,n){ti(!this.disposed,"Synth was already disposed"),s<=this.now()?"attack"===t?this._triggerAttack(e,s,n):this._triggerRelease(e,s):this.context.setTimeout(()=>{this._scheduleEvent(t,e,s,n)},s-this.now())}triggerAttack(t,e,s){Array.isArray(t)||(t=[t]);const n=this.toSeconds(e);return this._scheduleEvent("attack",t,n,s),this}triggerRelease(t,e){Array.isArray(t)||(t=[t]);const s=this.toSeconds(e);return this._scheduleEvent("release",t,s),this}triggerAttackRelease(t,e,s,n){const i=this.toSeconds(s);if(this.triggerAttack(t,i,n),di(e)){ti(di(t),"If the duration is an array, the notes must also be an array"),t=t;for(let s=0;s<t.length;s++){const n=e[Math.min(s,e.length-1)],o=this.toSeconds(n);ti(o>0,"The duration must be greater than 0"),this.triggerRelease(t[s],i+o)}}else{const s=this.toSeconds(e);ti(s>0,"The duration must be greater than 0"),this.triggerRelease(t,i+s)}return this}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",1),this._syncMethod("triggerRelease",1)),this}set(t){const e=Mi(t,["onsilence","context"]);return this.options=Ai(this.options,e),this._voices.forEach(t=>t.set(e)),this._dummyVoice.set(e),this}get(){return this._dummyVoice.get()}releaseAll(t){const e=this.toSeconds(t);return this._activeVoices.forEach(({voice:t})=>{t.triggerRelease(e)}),this}dispose(){return super.dispose(),this._dummyVoice.dispose(),this._voices.forEach(t=>t.dispose()),this._activeVoices=[],this._availableVoices=[],this.context.clearInterval(this._gcTimeout),this}}class aa extends Vr{constructor(){super(Di(aa.getDefaults(),arguments,["urls","onload","baseUrl"],"urls")),this.name="Sampler",this._activeSources=new Map;const t=Di(aa.getDefaults(),arguments,["urls","onload","baseUrl"],"urls"),e={};Object.keys(t.urls).forEach(s=>{const n=parseInt(s,10);if(ti(_i(s)||ui(n)&&isFinite(n),"url key is neither a note or midi pitch: "+s),_i(s)){const n=new lo(this.context,s).toMidi();e[n]=t.urls[s]}else ui(n)&&isFinite(n)&&(e[n]=t.urls[n])}),this._buffers=new Vo({urls:e,onload:t.onload,baseUrl:t.baseUrl,onerror:t.onerror}),this.attack=t.attack,this.release=t.release,this.curve=t.curve,this._buffers.loaded&&Promise.resolve().then(t.onload)}static getDefaults(){return Object.assign(Vr.getDefaults(),{attack:0,baseUrl:"",curve:"exponential",onload:Zi,onerror:Zi,release:.1,urls:{}})}_findClosest(t){let e=0;for(;e<96;){if(this._buffers.has(t+e))return-e;if(this._buffers.has(t-e))return e;e++}throw new Error("No available buffers for note: "+t)}triggerAttack(t,e,s=1){return this.log("triggerAttack",t,e,s),Array.isArray(t)||(t=[t]),t.forEach(t=>{const n=ro(new lo(this.context,t).toFrequency()),i=Math.round(n),o=n-i,r=this._findClosest(i),a=i-r,c=this._buffers.get(a),h=no(r+o),u=new $o({url:c,context:this.context,curve:this.curve,fadeIn:this.attack,fadeOut:this.release,playbackRate:h}).connect(this.output);u.start(e,0,c.duration/h,s),di(this._activeSources.get(i))||this._activeSources.set(i,[]),this._activeSources.get(i).push(u),u.onended=()=>{if(this._activeSources&&this._activeSources.has(i)){const t=this._activeSources.get(i),e=t.indexOf(u);-1!==e&&t.splice(e,1)}}}),this}triggerRelease(t,e){return this.log("triggerRelease",t,e),Array.isArray(t)||(t=[t]),t.forEach(t=>{const s=new lo(this.context,t).toMidi();if(this._activeSources.has(s)&&this._activeSources.get(s).length){const t=this._activeSources.get(s);e=this.toSeconds(e),t.forEach(t=>{t.stop(e)}),this._activeSources.set(s,[])}}),this}releaseAll(t){const e=this.toSeconds(t);return this._activeSources.forEach(t=>{for(;t.length;){t.shift().stop(e)}}),this}sync(){return this._syncState()&&(this._syncMethod("triggerAttack",1),this._syncMethod("triggerRelease",1)),this}triggerAttackRelease(t,e,s,n=1){const i=this.toSeconds(s);return this.triggerAttack(t,i,n),di(e)?(ti(di(t),"notes must be an array when duration is array"),t.forEach((t,s)=>{const n=e[Math.min(s,e.length-1)];this.triggerRelease(t,i+this.toSeconds(n))})):this.triggerRelease(t,i+this.toSeconds(e)),this}add(t,e,s){if(ti(_i(t)||isFinite(t),"note must be a pitch or midi: "+t),_i(t)){const n=new lo(this.context,t).toMidi();this._buffers.add(n,e,s)}else this._buffers.add(t,e,s);return this}get loaded(){return this._buffers.loaded}dispose(){return super.dispose(),this._buffers.dispose(),this._activeSources.forEach(t=>{t.forEach(t=>t.dispose())}),this._activeSources.clear(),this}}vi([wr(0)],aa.prototype,"attack",void 0),vi([wr(0)],aa.prototype,"release",void 0);class ca extends vo{constructor(){super(Di(ca.getDefaults(),arguments,["callback","value"])),this.name="ToneEvent",this._state=new yo("stopped"),this._startOffset=0;const t=Di(ca.getDefaults(),arguments,["callback","value"]);this._loop=t.loop,this.callback=t.callback,this.value=t.value,this._loopStart=this.toTicks(t.loopStart),this._loopEnd=this.toTicks(t.loopEnd),this._playbackRate=t.playbackRate,this._probability=t.probability,this._humanize=t.humanize,this.mute=t.mute,this._playbackRate=t.playbackRate,this._state.increasing=!0,this._rescheduleEvents()}static getDefaults(){return Object.assign(vo.getDefaults(),{callback:Zi,humanize:!1,loop:!1,loopEnd:"1m",loopStart:0,mute:!1,playbackRate:1,probability:1,value:null})}_rescheduleEvents(t=-1){this._state.forEachFrom(t,t=>{let e;if("started"===t.state){-1!==t.id&&this.context.transport.clear(t.id);const s=t.time+Math.round(this.startOffset/this._playbackRate);if(!0===this._loop||ui(this._loop)&&this._loop>1){e=1/0,ui(this._loop)&&(e=this._loop*this._getLoopDuration());const n=this._state.getAfter(s);null!==n&&(e=Math.min(e,n.time-s)),e!==1/0&&(this._state.setStateAtTime("stopped",s+e+1,{id:-1}),e=new jo(this.context,e));const i=new jo(this.context,this._getLoopDuration());t.id=this.context.transport.scheduleRepeat(this._tick.bind(this),i,new jo(this.context,s),e)}else t.id=this.context.transport.schedule(this._tick.bind(this),new jo(this.context,s))}})}get state(){return this._state.getValueAtTime(this.context.transport.ticks)}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset=t}get probability(){return this._probability}set probability(t){this._probability=t}get humanize(){return this._humanize}set humanize(t){this._humanize=t}start(t){const e=this.toTicks(t);return"stopped"===this._state.getValueAtTime(e)&&(this._state.add({id:-1,state:"started",time:e}),this._rescheduleEvents(e)),this}stop(t){this.cancel(t);const e=this.toTicks(t);if("started"===this._state.getValueAtTime(e)){this._state.setStateAtTime("stopped",e,{id:-1});const t=this._state.getBefore(e);let s=e;null!==t&&(s=t.time),this._rescheduleEvents(s)}return this}cancel(t){t=Oi(t,-1/0);const e=this.toTicks(t);return this._state.forEachFrom(e,t=>{this.context.transport.clear(t.id)}),this._state.cancel(e),this}_tick(t){const e=this.context.transport.getTicksAtTime(t);if(!this.mute&&"started"===this._state.getValueAtTime(e)){if(this.probability<1&&Math.random()>this.probability)return;if(this.humanize){let e=.02;pi(this.humanize)||(e=this.toSeconds(this.humanize)),t+=(2*Math.random()-1)*e}this.callback(t,this.value)}}_getLoopDuration(){return Math.round((this._loopEnd-this._loopStart)/this._playbackRate)}get loop(){return this._loop}set loop(t){this._loop=t,this._rescheduleEvents()}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._rescheduleEvents()}get loopEnd(){return new jo(this.context,this._loopEnd).toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t),this._loop&&this._rescheduleEvents()}get loopStart(){return new jo(this.context,this._loopStart).toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t),this._loop&&this._rescheduleEvents()}get progress(){if(this._loop){const t=this.context.transport.ticks,e=this._state.get(t);if(null!==e&&"started"===e.state){const s=this._getLoopDuration();return(t-e.time)%s/s}return 0}return 0}dispose(){return super.dispose(),this.cancel(),this._state.dispose(),this}}class ha extends vo{constructor(){super(Di(ha.getDefaults(),arguments,["callback","interval"])),this.name="Loop";const t=Di(ha.getDefaults(),arguments,["callback","interval"]);this._event=new ca({context:this.context,callback:this._tick.bind(this),loop:!0,loopEnd:t.interval,playbackRate:t.playbackRate,probability:t.probability}),this.callback=t.callback,this.iterations=t.iterations}static getDefaults(){return Object.assign(vo.getDefaults(),{interval:"4n",callback:Zi,playbackRate:1,iterations:1/0,probability:1,mute:!1,humanize:!1})}start(t){return this._event.start(t),this}stop(t){return this._event.stop(t),this}cancel(t){return this._event.cancel(t),this}_tick(t){this.callback(t)}get state(){return this._event.state}get progress(){return this._event.progress}get interval(){return this._event.loopEnd}set interval(t){this._event.loopEnd=t}get playbackRate(){return this._event.playbackRate}set playbackRate(t){this._event.playbackRate=t}get humanize(){return this._event.humanize}set humanize(t){this._event.humanize=t}get probability(){return this._event.probability}set probability(t){this._event.probability=t}get mute(){return this._event.mute}set mute(t){this._event.mute=t}get iterations(){return!0===this._event.loop?1/0:this._event.loop}set iterations(t){this._event.loop=t===1/0||t}dispose(){return super.dispose(),this._event.dispose(),this}}class ua extends ca{constructor(){super(Di(ua.getDefaults(),arguments,["callback","events"])),this.name="Part",this._state=new yo("stopped"),this._events=new Set;const t=Di(ua.getDefaults(),arguments,["callback","events"]);this._state.increasing=!0,t.events.forEach(t=>{di(t)?this.add(t[0],t[1]):this.add(t)})}static getDefaults(){return Object.assign(ca.getDefaults(),{events:[]})}start(t,e){const s=this.toTicks(t);if("started"!==this._state.getValueAtTime(s)){e=Oi(e,this._loop?this._loopStart:0),e=this._loop?Oi(e,this._loopStart):Oi(e,0);const t=this.toTicks(e);this._state.add({id:-1,offset:t,state:"started",time:s}),this._forEach(e=>{this._startNote(e,s,t)})}return this}_startNote(t,e,s){e-=s,this._loop?t.startOffset>=this._loopStart&&t.startOffset<this._loopEnd?(t.startOffset<s&&(e+=this._getLoopDuration()),t.start(new jo(this.context,e))):t.startOffset<this._loopStart&&t.startOffset>=s&&(t.loop=!1,t.start(new jo(this.context,e))):t.startOffset>=s&&t.start(new jo(this.context,e))}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset=t,this._forEach(t=>{t.startOffset+=this._startOffset})}stop(t){const e=this.toTicks(t);return this._state.cancel(e),this._state.setStateAtTime("stopped",e),this._forEach(e=>{e.stop(t)}),this}at(t,e){const s=new mo(this.context,t).toTicks(),n=new jo(this.context,1).toSeconds(),i=this._events.values();let o=i.next();for(;!o.done;){const t=o.value;if(Math.abs(s-t.startOffset)<n)return ci(e)&&(t.value=e),t;o=i.next()}return ci(e)?(this.add(t,e),this.at(t)):null}add(t,e){t instanceof Object&&Reflect.has(t,"time")&&(t=(e=t).time);const s=this.toTicks(t);let n;return e instanceof ca?(n=e,n.callback=this._tick.bind(this)):n=new ca({callback:this._tick.bind(this),context:this.context,value:e}),n.startOffset=s,n.set({humanize:this.humanize,loop:this.loop,loopEnd:this.loopEnd,loopStart:this.loopStart,playbackRate:this.playbackRate,probability:this.probability}),this._events.add(n),this._restartEvent(n),this}_restartEvent(t){this._state.forEach(e=>{"started"===e.state?this._startNote(t,e.time,e.offset):t.stop(new jo(this.context,e.time))})}remove(t,e){return li(t)&&t.hasOwnProperty("time")&&(t=(e=t).time),t=this.toTicks(t),this._events.forEach(s=>{s.startOffset===t&&(ai(e)||ci(e)&&s.value===e)&&(this._events.delete(s),s.dispose())}),this}clear(){return this._forEach(t=>t.dispose()),this._events.clear(),this}cancel(t){return this._forEach(e=>e.cancel(t)),this._state.cancel(this.toTicks(t)),this}_forEach(t){return this._events&&this._events.forEach(e=>{e instanceof ua?e._forEach(t):t(e)}),this}_setAll(t,e){this._forEach(s=>{s[t]=e})}_tick(t,e){this.mute||this.callback(t,e)}_testLoopBoundries(t){this._loop&&(t.startOffset<this._loopStart||t.startOffset>=this._loopEnd)?t.cancel(0):"stopped"===t.state&&this._restartEvent(t)}get probability(){return this._probability}set probability(t){this._probability=t,this._setAll("probability",t)}get humanize(){return this._humanize}set humanize(t){this._humanize=t,this._setAll("humanize",t)}get loop(){return this._loop}set loop(t){this._loop=t,this._forEach(e=>{e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.loop=t,this._testLoopBoundries(e)})}get loopEnd(){return new jo(this.context,this._loopEnd).toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t),this._loop&&this._forEach(e=>{e.loopEnd=t,this._testLoopBoundries(e)})}get loopStart(){return new jo(this.context,this._loopStart).toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t),this._loop&&this._forEach(t=>{t.loopStart=this.loopStart,this._testLoopBoundries(t)})}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._setAll("playbackRate",t)}get length(){return this._events.size}dispose(){return super.dispose(),this.clear(),this}}function*la(t){let e=0;for(;e<t.length;)e=fa(e,t),yield t[e],e++}function*pa(t){let e=t.length-1;for(;e>=0;)e=fa(e,t),yield t[e],e--}function*da(t,e){for(;;)yield*e(t)}function fa(t,e){return Vi(t,0,e.length-1)}function*_a(t,e){let s=e?0:t.length-1;for(;;)s=fa(s,t),yield t[s],e?(s++,s>=t.length-1&&(e=!1)):(s--,s<=0&&(e=!0))}function*ma(t){let e=0,s=0;for(;e<t.length;)e=fa(e,t),yield t[e],s++,e+=s%2?2:-1}function*ga(t){let e=t.length-1,s=0;for(;e>=0;)e=fa(e,t),yield t[e],s++,e+=s%2?-2:1}function*va(t){const e=[];for(let s=0;s<t.length;s++)e.push(s);for(;e.length>0;){const s=fa(e.splice(Math.floor(e.length*Math.random()),1)[0],t);yield t[s]}}function*ya(t,e="up",s=0){switch(ti(t.length>0,"The array must have more than one value in it"),e){case"up":yield*da(t,la);case"down":yield*da(t,pa);case"upDown":yield*_a(t,!0);case"downUp":yield*_a(t,!1);case"alternateUp":yield*da(t,ma);case"alternateDown":yield*da(t,ga);case"random":yield*function*(t){for(;;){const e=Math.floor(Math.random()*t.length);yield t[e]}}(t);case"randomOnce":yield*da(t,va);case"randomWalk":yield*function*(t){let e=Math.floor(Math.random()*t.length);for(;;)0===e?e++:e===t.length-1||Math.random()<.5?e--:e++,yield t[e]}(t)}}class xa extends ha{constructor(){super(Di(xa.getDefaults(),arguments,["callback","values","pattern"])),this.name="Pattern";const t=Di(xa.getDefaults(),arguments,["callback","values","pattern"]);this.callback=t.callback,this._values=t.values,this._pattern=ya(t.values,t.pattern),this._type=t.pattern}static getDefaults(){return Object.assign(ha.getDefaults(),{pattern:"up",values:[],callback:Zi})}_tick(t){const e=this._pattern.next();this._value=e.value,this.callback(t,this._value)}get values(){return this._values}set values(t){this._values=t,this.pattern=this._type}get value(){return this._value}get pattern(){return this._type}set pattern(t){this._type=t,this._pattern=ya(this._values,this._type)}}class wa extends ca{constructor(){super(Di(wa.getDefaults(),arguments,["callback","events","subdivision"])),this.name="Sequence",this._part=new ua({callback:this._seqCallback.bind(this),context:this.context}),this._events=[],this._eventsArray=[];const t=Di(wa.getDefaults(),arguments,["callback","events","subdivision"]);this._subdivision=this.toTicks(t.subdivision),this.events=t.events,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.playbackRate=t.playbackRate,this.probability=t.probability,this.humanize=t.humanize,this.mute=t.mute,this.playbackRate=t.playbackRate}static getDefaults(){return Object.assign(Mi(ca.getDefaults(),["value"]),{events:[],loop:!0,loopEnd:0,loopStart:0,subdivision:"8n"})}_seqCallback(t,e){null!==e&&this.callback(t,e)}get events(){return this._events}set events(t){this.clear(),this._eventsArray=t,this._events=this._createSequence(this._eventsArray),this._eventsUpdated()}start(t,e){return this._part.start(t,e?this._indexTime(e):e),this}stop(t){return this._part.stop(t),this}get subdivision(){return new jo(this.context,this._subdivision).toSeconds()}_createSequence(t){return new Proxy(t,{get:(t,e)=>t[e],set:(t,e,s)=>(fi(e)&&isFinite(parseInt(e,10))&&di(s)?t[e]=this._createSequence(s):t[e]=s,this._eventsUpdated(),!0)})}_eventsUpdated(){this._part.clear(),this._rescheduleSequence(this._eventsArray,this._subdivision,this.startOffset),this.loopEnd=this.loopEnd}_rescheduleSequence(t,e,s){t.forEach((t,n)=>{const i=n*e+s;if(di(t))this._rescheduleSequence(t,e/t.length,i);else{const e=new jo(this.context,i,"i").toSeconds();this._part.add(e,t)}})}_indexTime(t){return new jo(this.context,t*this._subdivision+this.startOffset).toSeconds()}clear(){return this._part.clear(),this}dispose(){return super.dispose(),this._part.dispose(),this}get loop(){return this._part.loop}set loop(t){this._part.loop=t}get loopStart(){return this._loopStart}set loopStart(t){this._loopStart=t,this._part.loopStart=this._indexTime(t)}get loopEnd(){return this._loopEnd}set loopEnd(t){this._loopEnd=t,this._part.loopEnd=0===t?this._indexTime(this._eventsArray.length):this._indexTime(t)}get startOffset(){return this._part.startOffset}set startOffset(t){this._part.startOffset=t}get playbackRate(){return this._part.playbackRate}set playbackRate(t){this._part.playbackRate=t}get probability(){return this._part.probability}set probability(t){this._part.probability=t}get progress(){return this._part.progress}get humanize(){return this._part.humanize}set humanize(t){this._part.humanize=t}get length(){return this._part.length}}class ba extends wo{constructor(){super(Object.assign(Di(ba.getDefaults(),arguments,["fade"]))),this.name="CrossFade",this._panner=this.context.createStereoPanner(),this._split=this.context.createChannelSplitter(2),this._g2a=new Cr({context:this.context}),this.a=new ko({context:this.context,gain:0}),this.b=new ko({context:this.context,gain:0}),this.output=new ko({context:this.context}),this._internalChannels=[this.a,this.b];const t=Di(ba.getDefaults(),arguments,["fade"]);this.fade=new Do({context:this.context,units:"normalRange",value:t.fade}),Ui(this,"fade"),this.context.getConstant(1).connect(this._panner),this._panner.connect(this._split),this._panner.channelCount=1,this._panner.channelCountMode="explicit",To(this._split,this.a.gain,0),To(this._split,this.b.gain,1),this.fade.chain(this._g2a,this._panner.pan),this.a.connect(this.output),this.b.connect(this.output)}static getDefaults(){return Object.assign(wo.getDefaults(),{fade:.5})}dispose(){return super.dispose(),this.a.dispose(),this.b.dispose(),this.output.dispose(),this.fade.dispose(),this._g2a.dispose(),this._panner.disconnect(),this._split.disconnect(),this}}class Ta extends wo{constructor(t){super(t),this.name="Effect",this._dryWet=new ba({context:this.context}),this.wet=this._dryWet.fade,this.effectSend=new ko({context:this.context}),this.effectReturn=new ko({context:this.context}),this.input=new ko({context:this.context}),this.output=this._dryWet,this.input.fan(this._dryWet.a,this.effectSend),this.effectReturn.connect(this._dryWet.b),this.wet.setValueAtTime(t.wet,0),this._internalChannels=[this.effectReturn,this.effectSend],Ui(this,"wet")}static getDefaults(){return Object.assign(wo.getDefaults(),{wet:1})}connectEffect(t){return this._internalChannels.push(t),this.effectSend.chain(t,this.effectReturn),this}dispose(){return super.dispose(),this._dryWet.dispose(),this.effectSend.dispose(),this.effectReturn.dispose(),this.wet.dispose(),this}}class Sa extends Ta{constructor(t){super(t),this.name="LFOEffect",this._lfo=new yr({context:this.context,frequency:t.frequency,amplitude:t.depth}),this.depth=this._lfo.amplitude,this.frequency=this._lfo.frequency,this.type=t.type,Ui(this,["frequency","depth"])}static getDefaults(){return Object.assign(Ta.getDefaults(),{frequency:1,type:"sine",depth:1})}start(t){return this._lfo.start(t),this}stop(t){return this._lfo.stop(t),this}sync(){return this._lfo.sync(),this}unsync(){return this._lfo.unsync(),this}get type(){return this._lfo.type}set type(t){this._lfo.type=t}dispose(){return super.dispose(),this._lfo.dispose(),this.frequency.dispose(),this.depth.dispose(),this}}class ka extends Sa{constructor(){super(Di(ka.getDefaults(),arguments,["frequency","baseFrequency","octaves"])),this.name="AutoFilter";const t=Di(ka.getDefaults(),arguments,["frequency","baseFrequency","octaves"]);this.filter=new Wr(Object.assign(t.filter,{context:this.context})),this.connectEffect(this.filter),this._lfo.connect(this.filter.frequency),this.octaves=t.octaves,this.baseFrequency=t.baseFrequency}static getDefaults(){return Object.assign(Sa.getDefaults(),{baseFrequency:200,octaves:2.6,filter:{type:"lowpass",rolloff:-12,Q:1}})}get baseFrequency(){return this._lfo.min}set baseFrequency(t){this._lfo.min=this.toFrequency(t),this.octaves=this._octaves}get octaves(){return this._octaves}set octaves(t){this._octaves=t,this._lfo.max=this._lfo.min*Math.pow(2,t)}dispose(){return super.dispose(),this.filter.dispose(),this}}class Ca extends wo{constructor(){super(Object.assign(Di(Ca.getDefaults(),arguments,["pan"]))),this.name="Panner",this._panner=this.context.createStereoPanner(),this.input=this._panner,this.output=this._panner;const t=Di(Ca.getDefaults(),arguments,["pan"]);this.pan=new xo({context:this.context,param:this._panner.pan,value:t.pan,minValue:-1,maxValue:1}),this._panner.channelCount=t.channelCount,this._panner.channelCountMode="explicit",Ui(this,"pan")}static getDefaults(){return Object.assign(wo.getDefaults(),{pan:0,channelCount:1})}dispose(){return super.dispose(),this._panner.disconnect(),this.pan.dispose(),this}}class Aa extends Sa{constructor(){super(Di(Aa.getDefaults(),arguments,["frequency"])),this.name="AutoPanner";const t=Di(Aa.getDefaults(),arguments,["frequency"]);this._panner=new Ca({context:this.context,channelCount:t.channelCount}),this.connectEffect(this._panner),this._lfo.connect(this._panner.pan),this._lfo.min=-1,this._lfo.max=1}static getDefaults(){return Object.assign(Sa.getDefaults(),{channelCount:1})}dispose(){return super.dispose(),this._panner.dispose(),this}}class Da extends wo{constructor(){super(Di(Da.getDefaults(),arguments,["smoothing"])),this.name="Follower";const t=Di(Da.getDefaults(),arguments,["smoothing"]);this._abs=this.input=new kr({context:this.context}),this._lowpass=this.output=new na({context:this.context,frequency:1/this.toSeconds(t.smoothing),type:"lowpass"}),this._abs.connect(this._lowpass),this._smoothing=t.smoothing}static getDefaults(){return Object.assign(wo.getDefaults(),{smoothing:.05})}get smoothing(){return this._smoothing}set smoothing(t){this._smoothing=t,this._lowpass.frequency=1/this.toSeconds(this.smoothing)}dispose(){return super.dispose(),this._abs.dispose(),this._lowpass.dispose(),this}}class Oa extends Ta{constructor(){super(Di(Oa.getDefaults(),arguments,["baseFrequency","octaves","sensitivity"])),this.name="AutoWah";const t=Di(Oa.getDefaults(),arguments,["baseFrequency","octaves","sensitivity"]);this._follower=new Da({context:this.context,smoothing:t.follower}),this._sweepRange=new Rr({context:this.context,min:0,max:1,exponent:.5}),this._baseFrequency=this.toFrequency(t.baseFrequency),this._octaves=t.octaves,this._inputBoost=new ko({context:this.context}),this._bandpass=new Wr({context:this.context,rolloff:-48,frequency:0,Q:t.Q}),this._peaking=new Wr({context:this.context,type:"peaking"}),this._peaking.gain.value=t.gain,this.gain=this._peaking.gain,this.Q=this._bandpass.Q,this.effectSend.chain(this._inputBoost,this._follower,this._sweepRange),this._sweepRange.connect(this._bandpass.frequency),this._sweepRange.connect(this._peaking.frequency),this.effectSend.chain(this._bandpass,this._peaking,this.effectReturn),this._setSweepRange(),this.sensitivity=t.sensitivity,Ui(this,["gain","Q"])}static getDefaults(){return Object.assign(Ta.getDefaults(),{baseFrequency:100,octaves:6,sensitivity:0,Q:2,gain:2,follower:.2})}get octaves(){return this._octaves}set octaves(t){this._octaves=t,this._setSweepRange()}get follower(){return this._follower.smoothing}set follower(t){this._follower.smoothing=t}get baseFrequency(){return this._baseFrequency}set baseFrequency(t){this._baseFrequency=this.toFrequency(t),this._setSweepRange()}get sensitivity(){return so(1/this._inputBoost.gain.value)}set sensitivity(t){this._inputBoost.gain.value=1/eo(t)}_setSweepRange(){this._sweepRange.min=this._baseFrequency,this._sweepRange.max=Math.min(this._baseFrequency*Math.pow(2,this._octaves),this.context.sampleRate/2)}dispose(){return super.dispose(),this._follower.dispose(),this._sweepRange.dispose(),this._bandpass.dispose(),this._peaking.dispose(),this._inputBoost.dispose(),this}}ta("bit-crusher","\n\tclass BitCrusherWorklet extends SingleIOProcessor {\n\n\t\tstatic get parameterDescriptors() {\n\t\t\treturn [{\n\t\t\t\tname: \"bits\",\n\t\t\t\tdefaultValue: 12,\n\t\t\t\tminValue: 1,\n\t\t\t\tmaxValue: 16,\n\t\t\t\tautomationRate: 'k-rate'\n\t\t\t}];\n\t\t}\n\n\t\tgenerate(input, _channel, parameters) {\n\t\t\tconst step = Math.pow(0.5, parameters.bits - 1);\n\t\t\tconst val = step * Math.floor(input / step + 0.5);\n\t\t\treturn val;\n\t\t}\n\t}\n");class Ma extends Ta{constructor(){super(Di(Ma.getDefaults(),arguments,["bits"])),this.name="BitCrusher";const t=Di(Ma.getDefaults(),arguments,["bits"]);this._bitCrusherWorklet=new Ea({context:this.context,bits:t.bits}),this.connectEffect(this._bitCrusherWorklet),this.bits=this._bitCrusherWorklet.bits}static getDefaults(){return Object.assign(Ta.getDefaults(),{bits:4})}dispose(){return super.dispose(),this._bitCrusherWorklet.dispose(),this}}class Ea extends ea{constructor(){super(Di(Ea.getDefaults(),arguments)),this.name="BitCrusherWorklet";const t=Di(Ea.getDefaults(),arguments);this.input=new ko({context:this.context}),this.output=new ko({context:this.context}),this.bits=new xo({context:this.context,value:t.bits,units:"positive",minValue:1,maxValue:16,param:this._dummyParam,swappable:!0})}static getDefaults(){return Object.assign(ea.getDefaults(),{bits:12})}_audioWorkletName(){return"bit-crusher"}onReady(t){bo(this.input,t,this.output);const e=t.parameters.get("bits");this.bits.setParam(e)}dispose(){return super.dispose(),this.input.dispose(),this.output.dispose(),this.bits.dispose(),this}}class Ra extends Ta{constructor(){super(Di(Ra.getDefaults(),arguments,["order"])),this.name="Chebyshev";const t=Di(Ra.getDefaults(),arguments,["order"]);this._shaper=new rr({context:this.context,length:4096}),this._order=t.order,this.connectEffect(this._shaper),this.order=t.order,this.oversample=t.oversample}static getDefaults(){return Object.assign(Ta.getDefaults(),{order:1,oversample:"none"})}_getCoefficient(t,e,s){return s.has(e)||(0===e?s.set(e,0):1===e?s.set(e,t):s.set(e,2*t*this._getCoefficient(t,e-1,s)-this._getCoefficient(t,e-2,s))),s.get(e)}get order(){return this._order}set order(t){this._order=t,this._shaper.setMap(e=>this._getCoefficient(e,t,new Map))}get oversample(){return this._shaper.oversample}set oversample(t){this._shaper.oversample=t}dispose(){return super.dispose(),this._shaper.dispose(),this}}class qa extends wo{constructor(){super(Di(qa.getDefaults(),arguments,["channels"])),this.name="Split";const t=Di(qa.getDefaults(),arguments,["channels"]);this._splitter=this.input=this.output=this.context.createChannelSplitter(t.channels),this._internalChannels=[this._splitter]}static getDefaults(){return Object.assign(wo.getDefaults(),{channels:2})}dispose(){return super.dispose(),this._splitter.disconnect(),this}}class Fa extends wo{constructor(){super(Di(Fa.getDefaults(),arguments,["channels"])),this.name="Merge";const t=Di(Fa.getDefaults(),arguments,["channels"]);this._merger=this.output=this.input=this.context.createChannelMerger(t.channels)}static getDefaults(){return Object.assign(wo.getDefaults(),{channels:2})}dispose(){return super.dispose(),this._merger.disconnect(),this}}class Ia extends wo{constructor(t){super(t),this.name="StereoEffect",this.input=new ko({context:this.context}),this.input.channelCount=2,this.input.channelCountMode="explicit",this._dryWet=this.output=new ba({context:this.context,fade:t.wet}),this.wet=this._dryWet.fade,this._split=new qa({context:this.context,channels:2}),this._merge=new Fa({context:this.context,channels:2}),this.input.connect(this._split),this.input.connect(this._dryWet.a),this._merge.connect(this._dryWet.b),Ui(this,["wet"])}connectEffectLeft(...t){this._split.connect(t[0],0,0),bo(...t),To(t[t.length-1],this._merge,0,0)}connectEffectRight(...t){this._split.connect(t[0],1,0),bo(...t),To(t[t.length-1],this._merge,0,1)}static getDefaults(){return Object.assign(wo.getDefaults(),{wet:1})}dispose(){return super.dispose(),this._dryWet.dispose(),this._split.dispose(),this._merge.dispose(),this}}class Va extends Ia{constructor(t){super(t),this.feedback=new Do({context:this.context,value:t.feedback,units:"normalRange"}),this._feedbackL=new ko({context:this.context}),this._feedbackR=new ko({context:this.context}),this._feedbackSplit=new qa({context:this.context,channels:2}),this._feedbackMerge=new Fa({context:this.context,channels:2}),this._merge.connect(this._feedbackSplit),this._feedbackMerge.connect(this._split),this._feedbackSplit.connect(this._feedbackL,0,0),this._feedbackL.connect(this._feedbackMerge,0,0),this._feedbackSplit.connect(this._feedbackR,1,0),this._feedbackR.connect(this._feedbackMerge,0,1),this.feedback.fan(this._feedbackL.gain,this._feedbackR.gain),Ui(this,["feedback"])}static getDefaults(){return Object.assign(Ia.getDefaults(),{feedback:.5})}dispose(){return super.dispose(),this.feedback.dispose(),this._feedbackL.dispose(),this._feedbackR.dispose(),this._feedbackSplit.dispose(),this._feedbackMerge.dispose(),this}}class Na extends Va{constructor(){super(Di(Na.getDefaults(),arguments,["frequency","delayTime","depth"])),this.name="Chorus";const t=Di(Na.getDefaults(),arguments,["frequency","delayTime","depth"]);this._depth=t.depth,this._delayTime=t.delayTime/1e3,this._lfoL=new yr({context:this.context,frequency:t.frequency,min:0,max:1}),this._lfoR=new yr({context:this.context,frequency:t.frequency,min:0,max:1,phase:180}),this._delayNodeL=new Fo({context:this.context}),this._delayNodeR=new Fo({context:this.context}),this.frequency=this._lfoL.frequency,Ui(this,["frequency"]),this._lfoL.frequency.connect(this._lfoR.frequency),this.connectEffectLeft(this._delayNodeL),this.connectEffectRight(this._delayNodeR),this._lfoL.connect(this._delayNodeL.delayTime),this._lfoR.connect(this._delayNodeR.delayTime),this.depth=this._depth,this.type=t.type,this.spread=t.spread}static getDefaults(){return Object.assign(Va.getDefaults(),{frequency:1.5,delayTime:3.5,depth:.7,type:"sine",spread:180,feedback:0,wet:.5})}get depth(){return this._depth}set depth(t){this._depth=t;const e=this._delayTime*t;this._lfoL.min=Math.max(this._delayTime-e,0),this._lfoL.max=this._delayTime+e,this._lfoR.min=Math.max(this._delayTime-e,0),this._lfoR.max=this._delayTime+e}get delayTime(){return 1e3*this._delayTime}set delayTime(t){this._delayTime=t/1e3,this.depth=this._depth}get type(){return this._lfoL.type}set type(t){this._lfoL.type=t,this._lfoR.type=t}get spread(){return this._lfoR.phase-this._lfoL.phase}set spread(t){this._lfoL.phase=90-t/2,this._lfoR.phase=t/2+90}start(t){return this._lfoL.start(t),this._lfoR.start(t),this}stop(t){return this._lfoL.stop(t),this._lfoR.stop(t),this}sync(){return this._lfoL.sync(),this._lfoR.sync(),this}unsync(){return this._lfoL.unsync(),this._lfoR.unsync(),this}dispose(){return super.dispose(),this._lfoL.dispose(),this._lfoR.dispose(),this._delayNodeL.dispose(),this._delayNodeR.dispose(),this.frequency.dispose(),this}}class Pa extends Ta{constructor(){super(Di(Pa.getDefaults(),arguments,["distortion"])),this.name="Distortion";const t=Di(Pa.getDefaults(),arguments,["distortion"]);this._shaper=new rr({context:this.context,length:4096}),this._distortion=t.distortion,this.connectEffect(this._shaper),this.distortion=t.distortion,this.oversample=t.oversample}static getDefaults(){return Object.assign(Ta.getDefaults(),{distortion:.4,oversample:"none"})}get distortion(){return this._distortion}set distortion(t){this._distortion=t;const e=100*t,s=Math.PI/180;this._shaper.setMap(t=>Math.abs(t)<.001?0:(3+e)*t*20*s/(Math.PI+e*Math.abs(t)))}get oversample(){return this._shaper.oversample}set oversample(t){this._shaper.oversample=t}dispose(){return super.dispose(),this._shaper.dispose(),this}}class ja extends Ta{constructor(t){super(t),this.name="FeedbackEffect",this._feedbackGain=new ko({context:this.context,gain:t.feedback,units:"normalRange"}),this.feedback=this._feedbackGain.gain,Ui(this,"feedback"),this.effectReturn.chain(this._feedbackGain,this.effectSend)}static getDefaults(){return Object.assign(Ta.getDefaults(),{feedback:.125})}dispose(){return super.dispose(),this._feedbackGain.dispose(),this.feedback.dispose(),this}}class La extends ja{constructor(){super(Di(La.getDefaults(),arguments,["delayTime","feedback"])),this.name="FeedbackDelay";const t=Di(La.getDefaults(),arguments,["delayTime","feedback"]);this._delayNode=new Fo({context:this.context,delayTime:t.delayTime,maxDelay:t.maxDelay}),this.delayTime=this._delayNode.delayTime,this.connectEffect(this._delayNode),Ui(this,"delayTime")}static getDefaults(){return Object.assign(ja.getDefaults(),{delayTime:.25,maxDelay:1})}dispose(){return super.dispose(),this._delayNode.dispose(),this.delayTime.dispose(),this}}class za extends wo{constructor(t){super(t),this.name="PhaseShiftAllpass",this.input=new ko({context:this.context}),this.output=new ko({context:this.context}),this.offset90=new ko({context:this.context});this._bank0=this._createAllPassFilterBank([.6923878,.9360654322959,.988229522686,.9987488452737]),this._bank1=this._createAllPassFilterBank([.4021921162426,.856171088242,.9722909545651,.9952884791278]),this._oneSampleDelay=this.context.createIIRFilter([0,1],[1,0]),bo(this.input,...this._bank0,this._oneSampleDelay,this.output),bo(this.input,...this._bank1,this.offset90)}_createAllPassFilterBank(t){return t.map(t=>{const e=[[t*t,0,-1],[1,0,-t*t]];return this.context.createIIRFilter(e[0],e[1])})}dispose(){return super.dispose(),this.input.dispose(),this.output.dispose(),this.offset90.dispose(),this._bank0.forEach(t=>t.disconnect()),this._bank1.forEach(t=>t.disconnect()),this._oneSampleDelay.disconnect(),this}}class Ba extends Ta{constructor(){super(Di(Ba.getDefaults(),arguments,["frequency"])),this.name="FrequencyShifter";const t=Di(Ba.getDefaults(),arguments,["frequency"]);this.frequency=new Do({context:this.context,units:"frequency",value:t.frequency,minValue:-this.context.sampleRate/2,maxValue:this.context.sampleRate/2}),this._sine=new nr({context:this.context,type:"sine"}),this._cosine=new ir({context:this.context,phase:-90,type:"sine"}),this._sineMultiply=new cr({context:this.context}),this._cosineMultiply=new cr({context:this.context}),this._negate=new Ar({context:this.context}),this._add=new mr({context:this.context}),this._phaseShifter=new za({context:this.context}),this.effectSend.connect(this._phaseShifter),this.frequency.fan(this._sine.frequency,this._cosine.frequency),this._phaseShifter.offset90.connect(this._cosineMultiply),this._cosine.connect(this._cosineMultiply.factor),this._phaseShifter.connect(this._sineMultiply),this._sine.connect(this._sineMultiply.factor),this._sineMultiply.connect(this._negate),this._cosineMultiply.connect(this._add),this._negate.connect(this._add.addend),this._add.connect(this.effectReturn);const e=this.immediate();this._sine.start(e),this._cosine.start(e)}static getDefaults(){return Object.assign(Ta.getDefaults(),{frequency:0})}dispose(){return super.dispose(),this.frequency.dispose(),this._add.dispose(),this._cosine.dispose(),this._cosineMultiply.dispose(),this._negate.dispose(),this._phaseShifter.dispose(),this._sine.dispose(),this._sineMultiply.dispose(),this}}const Wa=[1557/44100,1617/44100,1491/44100,1422/44100,1277/44100,1356/44100,1188/44100,1116/44100],Ga=[225,556,441,341];class Ua extends Ia{constructor(){super(Di(Ua.getDefaults(),arguments,["roomSize","dampening"])),this.name="Freeverb",this._combFilters=[],this._allpassFiltersL=[],this._allpassFiltersR=[];const t=Di(Ua.getDefaults(),arguments,["roomSize","dampening"]);this.roomSize=new Do({context:this.context,value:t.roomSize,units:"normalRange"}),this._allpassFiltersL=Ga.map(t=>{const e=this.context.createBiquadFilter();return e.type="allpass",e.frequency.value=t,e}),this._allpassFiltersR=Ga.map(t=>{const e=this.context.createBiquadFilter();return e.type="allpass",e.frequency.value=t,e}),this._combFilters=Wa.map((e,s)=>{const n=new ia({context:this.context,dampening:t.dampening,delayTime:e});return s<Wa.length/2?this.connectEffectLeft(n,...this._allpassFiltersL):this.connectEffectRight(n,...this._allpassFiltersR),this.roomSize.connect(n.resonance),n}),Ui(this,["roomSize"])}static getDefaults(){return Object.assign(Ia.getDefaults(),{roomSize:.7,dampening:3e3})}get dampening(){return this._combFilters[0].dampening}set dampening(t){this._combFilters.forEach(e=>e.dampening=t)}dispose(){return super.dispose(),this._allpassFiltersL.forEach(t=>t.disconnect()),this._allpassFiltersR.forEach(t=>t.disconnect()),this._combFilters.forEach(t=>t.dispose()),this.roomSize.dispose(),this}}const Qa=[.06748,.06404,.08212,.09004],Za=[.773,.802,.753,.733],Xa=[347,113,37];class Ya extends Ia{constructor(){super(Di(Ya.getDefaults(),arguments,["roomSize"])),this.name="JCReverb",this._allpassFilters=[],this._feedbackCombFilters=[];const t=Di(Ya.getDefaults(),arguments,["roomSize"]);this.roomSize=new Do({context:this.context,value:t.roomSize,units:"normalRange"}),this._scaleRoomSize=new gr({context:this.context,min:-.733,max:.197}),this._allpassFilters=Xa.map(t=>{const e=this.context.createBiquadFilter();return e.type="allpass",e.frequency.value=t,e}),this._feedbackCombFilters=Qa.map((t,e)=>{const s=new sa({context:this.context,delayTime:t});return this._scaleRoomSize.connect(s.resonance),s.resonance.value=Za[e],e<Qa.length/2?this.connectEffectLeft(...this._allpassFilters,s):this.connectEffectRight(...this._allpassFilters,s),s}),this.roomSize.connect(this._scaleRoomSize),Ui(this,["roomSize"])}static getDefaults(){return Object.assign(Ia.getDefaults(),{roomSize:.5})}dispose(){return super.dispose(),this._allpassFilters.forEach(t=>t.disconnect()),this._feedbackCombFilters.forEach(t=>t.dispose()),this.roomSize.dispose(),this._scaleRoomSize.dispose(),this}}class Ha extends Va{constructor(t){super(t),this._feedbackL.disconnect(),this._feedbackL.connect(this._feedbackMerge,0,1),this._feedbackR.disconnect(),this._feedbackR.connect(this._feedbackMerge,0,0),Ui(this,["feedback"])}}class $a extends Ha{constructor(){super(Di($a.getDefaults(),arguments,["delayTime","feedback"])),this.name="PingPongDelay";const t=Di($a.getDefaults(),arguments,["delayTime","feedback"]);this._leftDelay=new Fo({context:this.context,maxDelay:t.maxDelay}),this._rightDelay=new Fo({context:this.context,maxDelay:t.maxDelay}),this._rightPreDelay=new Fo({context:this.context,maxDelay:t.maxDelay}),this.delayTime=new Do({context:this.context,units:"time",value:t.delayTime}),this.connectEffectLeft(this._leftDelay),this.connectEffectRight(this._rightPreDelay,this._rightDelay),this.delayTime.fan(this._leftDelay.delayTime,this._rightDelay.delayTime,this._rightPreDelay.delayTime),this._feedbackL.disconnect(),this._feedbackL.connect(this._rightDelay),Ui(this,["delayTime"])}static getDefaults(){return Object.assign(Ha.getDefaults(),{delayTime:.25,maxDelay:1})}dispose(){return super.dispose(),this._leftDelay.dispose(),this._rightDelay.dispose(),this._rightPreDelay.dispose(),this.delayTime.dispose(),this}}class Ja extends ja{constructor(){super(Di(Ja.getDefaults(),arguments,["pitch"])),this.name="PitchShift";const t=Di(Ja.getDefaults(),arguments,["pitch"]);this._frequency=new Do({context:this.context}),this._delayA=new Fo({maxDelay:1,context:this.context}),this._lfoA=new yr({context:this.context,min:0,max:.1,type:"sawtooth"}).connect(this._delayA.delayTime),this._delayB=new Fo({maxDelay:1,context:this.context}),this._lfoB=new yr({context:this.context,min:0,max:.1,type:"sawtooth",phase:180}).connect(this._delayB.delayTime),this._crossFade=new ba({context:this.context}),this._crossFadeLFO=new yr({context:this.context,min:0,max:1,type:"triangle",phase:90}).connect(this._crossFade.fade),this._feedbackDelay=new Fo({delayTime:t.delayTime,context:this.context}),this.delayTime=this._feedbackDelay.delayTime,Ui(this,"delayTime"),this._pitch=t.pitch,this._windowSize=t.windowSize,this._delayA.connect(this._crossFade.a),this._delayB.connect(this._crossFade.b),this._frequency.fan(this._lfoA.frequency,this._lfoB.frequency,this._crossFadeLFO.frequency),this.effectSend.fan(this._delayA,this._delayB),this._crossFade.chain(this._feedbackDelay,this.effectReturn);const e=this.now();this._lfoA.start(e),this._lfoB.start(e),this._crossFadeLFO.start(e),this.windowSize=this._windowSize}static getDefaults(){return Object.assign(ja.getDefaults(),{pitch:0,windowSize:.1,delayTime:0,feedback:0})}get pitch(){return this._pitch}set pitch(t){this._pitch=t;let e=0;t<0?(this._lfoA.min=0,this._lfoA.max=this._windowSize,this._lfoB.min=0,this._lfoB.max=this._windowSize,e=no(t-1)+1):(this._lfoA.min=this._windowSize,this._lfoA.max=0,this._lfoB.min=this._windowSize,this._lfoB.max=0,e=no(t)-1),this._frequency.value=e*(1.2/this._windowSize)}get windowSize(){return this._windowSize}set windowSize(t){this._windowSize=this.toSeconds(t),this.pitch=this._pitch}dispose(){return super.dispose(),this._frequency.dispose(),this._delayA.dispose(),this._delayB.dispose(),this._lfoA.dispose(),this._lfoB.dispose(),this._crossFade.dispose(),this._crossFadeLFO.dispose(),this._feedbackDelay.dispose(),this}}class Ka extends Ia{constructor(){super(Di(Ka.getDefaults(),arguments,["frequency","octaves","baseFrequency"])),this.name="Phaser";const t=Di(Ka.getDefaults(),arguments,["frequency","octaves","baseFrequency"]);this._lfoL=new yr({context:this.context,frequency:t.frequency,min:0,max:1}),this._lfoR=new yr({context:this.context,frequency:t.frequency,min:0,max:1,phase:180}),this._baseFrequency=this.toFrequency(t.baseFrequency),this._octaves=t.octaves,this.Q=new Do({context:this.context,value:t.Q,units:"positive"}),this._filtersL=this._makeFilters(t.stages,this._lfoL),this._filtersR=this._makeFilters(t.stages,this._lfoR),this.frequency=this._lfoL.frequency,this.frequency.value=t.frequency,this.connectEffectLeft(...this._filtersL),this.connectEffectRight(...this._filtersR),this._lfoL.frequency.connect(this._lfoR.frequency),this.baseFrequency=t.baseFrequency,this.octaves=t.octaves,this._lfoL.start(),this._lfoR.start(),Ui(this,["frequency","Q"])}static getDefaults(){return Object.assign(Ia.getDefaults(),{frequency:.5,octaves:3,stages:10,Q:10,baseFrequency:350})}_makeFilters(t,e){const s=[];for(let n=0;n<t;n++){const t=this.context.createBiquadFilter();t.type="allpass",this.Q.connect(t.Q),e.connect(t.frequency),s.push(t)}return s}get octaves(){return this._octaves}set octaves(t){this._octaves=t;const e=this._baseFrequency*Math.pow(2,t);this._lfoL.max=e,this._lfoR.max=e}get baseFrequency(){return this._baseFrequency}set baseFrequency(t){this._baseFrequency=this.toFrequency(t),this._lfoL.min=this._baseFrequency,this._lfoR.min=this._baseFrequency,this.octaves=this._octaves}dispose(){return super.dispose(),this.Q.dispose(),this._lfoL.dispose(),this._lfoR.dispose(),this._filtersL.forEach(t=>t.disconnect()),this._filtersR.forEach(t=>t.disconnect()),this.frequency.dispose(),this}}class tc extends Ta{constructor(){super(Di(tc.getDefaults(),arguments,["decay"])),this.name="Reverb",this._convolver=this.context.createConvolver(),this.ready=Promise.resolve();const t=Di(tc.getDefaults(),arguments,["decay"]);this._decay=t.decay,this._preDelay=t.preDelay,this.generate(),this.connectEffect(this._convolver)}static getDefaults(){return Object.assign(Ta.getDefaults(),{decay:1.5,preDelay:.01})}get decay(){return this._decay}set decay(t){ei(t=this.toSeconds(t),.001),this._decay=t,this.generate()}get preDelay(){return this._preDelay}set preDelay(t){ei(t=this.toSeconds(t),0),this._preDelay=t,this.generate()}generate(){return yi(this,void 0,void 0,(function*(){const t=this.ready,e=new Yi(2,this._decay+this._preDelay,this.context.sampleRate),s=new Jo({context:e}),n=new Jo({context:e}),i=new Fa({context:e});s.connect(i,0,0),n.connect(i,0,1);const o=new ko({context:e}).toDestination();i.connect(o),s.start(0),n.start(0),o.gain.setValueAtTime(0,0),o.gain.setValueAtTime(1,this._preDelay),o.gain.exponentialApproachValueAtTime(0,this._preDelay,this.decay);const r=e.render();return this.ready=r.then(Zi),yield t,this._convolver.buffer=(yield r).get(),this}))}dispose(){return super.dispose(),this._convolver.disconnect(),this}}class ec extends wo{constructor(){super(Di(ec.getDefaults(),arguments)),this.name="MidSideSplit",this._split=this.input=new qa({channels:2,context:this.context}),this._midAdd=new mr({context:this.context}),this.mid=new cr({context:this.context,value:Math.SQRT1_2}),this._sideSubtract=new Dr({context:this.context}),this.side=new cr({context:this.context,value:Math.SQRT1_2}),this._split.connect(this._midAdd,0),this._split.connect(this._midAdd.addend,1),this._split.connect(this._sideSubtract,0),this._split.connect(this._sideSubtract.subtrahend,1),this._midAdd.connect(this.mid),this._sideSubtract.connect(this.side)}dispose(){return super.dispose(),this.mid.dispose(),this.side.dispose(),this._midAdd.dispose(),this._sideSubtract.dispose(),this._split.dispose(),this}}class sc extends wo{constructor(){super(Di(sc.getDefaults(),arguments)),this.name="MidSideMerge",this.mid=new ko({context:this.context}),this.side=new ko({context:this.context}),this._left=new mr({context:this.context}),this._leftMult=new cr({context:this.context,value:Math.SQRT1_2}),this._right=new Dr({context:this.context}),this._rightMult=new cr({context:this.context,value:Math.SQRT1_2}),this._merge=this.output=new Fa({context:this.context}),this.mid.fan(this._left),this.side.connect(this._left.addend),this.mid.connect(this._right),this.side.connect(this._right.subtrahend),this._left.connect(this._leftMult),this._right.connect(this._rightMult),this._leftMult.connect(this._merge,0,0),this._rightMult.connect(this._merge,0,1)}dispose(){return super.dispose(),this.mid.dispose(),this.side.dispose(),this._leftMult.dispose(),this._rightMult.dispose(),this._left.dispose(),this._right.dispose(),this}}class nc extends Ta{constructor(t){super(t),this.name="MidSideEffect",this._midSideMerge=new sc({context:this.context}),this._midSideSplit=new ec({context:this.context}),this._midSend=this._midSideSplit.mid,this._sideSend=this._midSideSplit.side,this._midReturn=this._midSideMerge.mid,this._sideReturn=this._midSideMerge.side,this.effectSend.connect(this._midSideSplit),this._midSideMerge.connect(this.effectReturn)}connectEffectMid(...t){this._midSend.chain(...t,this._midReturn)}connectEffectSide(...t){this._sideSend.chain(...t,this._sideReturn)}dispose(){return super.dispose(),this._midSideSplit.dispose(),this._midSideMerge.dispose(),this._midSend.dispose(),this._sideSend.dispose(),this._midReturn.dispose(),this._sideReturn.dispose(),this}}class ic extends nc{constructor(){super(Di(ic.getDefaults(),arguments,["width"])),this.name="StereoWidener";const t=Di(ic.getDefaults(),arguments,["width"]);this.width=new Do({context:this.context,value:t.width,units:"normalRange"}),Ui(this,["width"]),this._twoTimesWidthMid=new cr({context:this.context,value:2}),this._twoTimesWidthSide=new cr({context:this.context,value:2}),this._midMult=new cr({context:this.context}),this._twoTimesWidthMid.connect(this._midMult.factor),this.connectEffectMid(this._midMult),this._oneMinusWidth=new Dr({context:this.context}),this._oneMinusWidth.connect(this._twoTimesWidthMid),To(this.context.getConstant(1),this._oneMinusWidth),this.width.connect(this._oneMinusWidth.subtrahend),this._sideMult=new cr({context:this.context}),this.width.connect(this._twoTimesWidthSide),this._twoTimesWidthSide.connect(this._sideMult.factor),this.connectEffectSide(this._sideMult)}static getDefaults(){return Object.assign(nc.getDefaults(),{width:.5})}dispose(){return super.dispose(),this.width.dispose(),this._midMult.dispose(),this._sideMult.dispose(),this._twoTimesWidthMid.dispose(),this._twoTimesWidthSide.dispose(),this._oneMinusWidth.dispose(),this}}class oc extends Ia{constructor(){super(Di(oc.getDefaults(),arguments,["frequency","depth"])),this.name="Tremolo";const t=Di(oc.getDefaults(),arguments,["frequency","depth"]);this._lfoL=new yr({context:this.context,type:t.type,min:1,max:0}),this._lfoR=new yr({context:this.context,type:t.type,min:1,max:0}),this._amplitudeL=new ko({context:this.context}),this._amplitudeR=new ko({context:this.context}),this.frequency=new Do({context:this.context,value:t.frequency,units:"frequency"}),this.depth=new Do({context:this.context,value:t.depth,units:"normalRange"}),Ui(this,["frequency","depth"]),this.connectEffectLeft(this._amplitudeL),this.connectEffectRight(this._amplitudeR),this._lfoL.connect(this._amplitudeL.gain),this._lfoR.connect(this._amplitudeR.gain),this.frequency.fan(this._lfoL.frequency,this._lfoR.frequency),this.depth.fan(this._lfoR.amplitude,this._lfoL.amplitude),this.spread=t.spread}static getDefaults(){return Object.assign(Ia.getDefaults(),{frequency:10,type:"sine",depth:.5,spread:180})}start(t){return this._lfoL.start(t),this._lfoR.start(t),this}stop(t){return this._lfoL.stop(t),this._lfoR.stop(t),this}sync(){return this._lfoL.sync(),this._lfoR.sync(),this.context.transport.syncSignal(this.frequency),this}unsync(){return this._lfoL.unsync(),this._lfoR.unsync(),this.context.transport.unsyncSignal(this.frequency),this}get type(){return this._lfoL.type}set type(t){this._lfoL.type=t,this._lfoR.type=t}get spread(){return this._lfoR.phase-this._lfoL.phase}set spread(t){this._lfoL.phase=90-t/2,this._lfoR.phase=t/2+90}dispose(){return super.dispose(),this._lfoL.dispose(),this._lfoR.dispose(),this._amplitudeL.dispose(),this._amplitudeR.dispose(),this.frequency.dispose(),this.depth.dispose(),this}}class rc extends Ta{constructor(){super(Di(rc.getDefaults(),arguments,["frequency","depth"])),this.name="Vibrato";const t=Di(rc.getDefaults(),arguments,["frequency","depth"]);this._delayNode=new Fo({context:this.context,delayTime:0,maxDelay:t.maxDelay}),this._lfo=new yr({context:this.context,type:t.type,min:0,max:t.maxDelay,frequency:t.frequency,phase:-90}).start().connect(this._delayNode.delayTime),this.frequency=this._lfo.frequency,this.depth=this._lfo.amplitude,this.depth.value=t.depth,Ui(this,["frequency","depth"]),this.effectSend.chain(this._delayNode,this.effectReturn)}static getDefaults(){return Object.assign(Ta.getDefaults(),{maxDelay:.005,frequency:5,depth:.1,type:"sine"})}get type(){return this._lfo.type}set type(t){this._lfo.type=t}dispose(){return super.dispose(),this._delayNode.dispose(),this._lfo.dispose(),this.frequency.dispose(),this.depth.dispose(),this}}class ac extends wo{constructor(){super(Di(ac.getDefaults(),arguments,["type","size"])),this.name="Analyser",this._analysers=[],this._buffers=[];const t=Di(ac.getDefaults(),arguments,["type","size"]);this.input=this.output=this._gain=new ko({context:this.context}),this._split=new qa({context:this.context,channels:t.channels}),this.input.connect(this._split),ei(t.channels,1);for(let e=0;e<t.channels;e++)this._analysers[e]=this.context.createAnalyser(),this._split.connect(this._analysers[e],e,0);this.size=t.size,this.type=t.type}static getDefaults(){return Object.assign(wo.getDefaults(),{size:1024,smoothing:.8,type:"fft",channels:1})}getValue(){return this._analysers.forEach((t,e)=>{const s=this._buffers[e];"fft"===this._type?t.getFloatFrequencyData(s):"waveform"===this._type&&t.getFloatTimeDomainData(s)}),1===this.channels?this._buffers[0]:this._buffers}get size(){return this._analysers[0].frequencyBinCount}set size(t){this._analysers.forEach((e,s)=>{e.fftSize=2*t,this._buffers[s]=new Float32Array(t)})}get channels(){return this._analysers.length}get type(){return this._type}set type(t){ti("waveform"===t||"fft"===t,"Analyser: invalid type: "+t),this._type=t}get smoothing(){return this._analysers[0].smoothingTimeConstant}set smoothing(t){this._analysers.forEach(e=>e.smoothingTimeConstant=t)}dispose(){return super.dispose(),this._analysers.forEach(t=>t.disconnect()),this._split.dispose(),this._gain.dispose(),this}}class cc extends wo{constructor(){super(Di(cc.getDefaults(),arguments)),this.name="MeterBase",this.input=this.output=this._analyser=new ac({context:this.context,size:256,type:"waveform"})}dispose(){return super.dispose(),this._analyser.dispose(),this}}class hc extends cc{constructor(){super(Di(hc.getDefaults(),arguments,["smoothing"])),this.name="Meter",this._rms=0;const t=Di(hc.getDefaults(),arguments,["smoothing"]);this.input=this.output=this._analyser=new ac({context:this.context,size:256,type:"waveform",channels:t.channels}),this.smoothing=t.smoothing,this.normalRange=t.normalRange}static getDefaults(){return Object.assign(cc.getDefaults(),{smoothing:.8,normalRange:!1,channels:1})}getLevel(){return ri("'getLevel' has been changed to 'getValue'"),this.getValue()}getValue(){const t=this._analyser.getValue(),e=(1===this.channels?[t]:t).map(t=>{const e=t.reduce((t,e)=>t+e*e,0),s=Math.sqrt(e/t.length);return this._rms=Math.max(s,this._rms*this.smoothing),this.normalRange?this._rms:so(this._rms)});return 1===this.channels?e[0]:e}get channels(){return this._analyser.channels}dispose(){return super.dispose(),this._analyser.dispose(),this}}class uc extends cc{constructor(){super(Di(uc.getDefaults(),arguments,["size"])),this.name="FFT";const t=Di(uc.getDefaults(),arguments,["size"]);this.normalRange=t.normalRange,this._analyser.type="fft",this.size=t.size}static getDefaults(){return Object.assign(wo.getDefaults(),{normalRange:!1,size:1024,smoothing:.8})}getValue(){return this._analyser.getValue().map(t=>this.normalRange?eo(t):t)}get size(){return this._analyser.size}set size(t){this._analyser.size=t}get smoothing(){return this._analyser.smoothing}set smoothing(t){this._analyser.smoothing=t}getFrequencyOfIndex(t){return ti(0<=t&&t<this.size,"index must be greater than or equal to 0 and less than "+this.size),t*this.context.sampleRate/(2*this.size)}}class lc extends cc{constructor(){super(Di(lc.getDefaults(),arguments)),this.name="DCMeter",this._analyser.type="waveform",this._analyser.size=256}getValue(){return this._analyser.getValue()[0]}}class pc extends cc{constructor(){super(Di(pc.getDefaults(),arguments,["size"])),this.name="Waveform";const t=Di(pc.getDefaults(),arguments,["size"]);this._analyser.type="waveform",this.size=t.size}static getDefaults(){return Object.assign(cc.getDefaults(),{size:1024})}getValue(){return this._analyser.getValue()}get size(){return this._analyser.size}set size(t){this._analyser.size=t}}class dc extends wo{constructor(){super(Di(dc.getDefaults(),arguments,["solo"])),this.name="Solo";const t=Di(dc.getDefaults(),arguments,["solo"]);this.input=this.output=new ko({context:this.context}),dc._allSolos.has(this.context)||dc._allSolos.set(this.context,new Set),dc._allSolos.get(this.context).add(this),this.solo=t.solo}static getDefaults(){return Object.assign(wo.getDefaults(),{solo:!1})}get solo(){return this._isSoloed()}set solo(t){t?this._addSolo():this._removeSolo(),dc._allSolos.get(this.context).forEach(t=>t._updateSolo())}get muted(){return 0===this.input.gain.value}_addSolo(){dc._soloed.has(this.context)||dc._soloed.set(this.context,new Set),dc._soloed.get(this.context).add(this)}_removeSolo(){dc._soloed.has(this.context)&&dc._soloed.get(this.context).delete(this)}_isSoloed(){return dc._soloed.has(this.context)&&dc._soloed.get(this.context).has(this)}_noSolos(){return!dc._soloed.has(this.context)||dc._soloed.has(this.context)&&0===dc._soloed.get(this.context).size}_updateSolo(){this._isSoloed()||this._noSolos()?this.input.gain.value=1:this.input.gain.value=0}dispose(){return super.dispose(),dc._allSolos.get(this.context).delete(this),this._removeSolo(),this}}dc._allSolos=new Map,dc._soloed=new Map;class fc extends wo{constructor(){super(Di(fc.getDefaults(),arguments,["pan","volume"])),this.name="PanVol";const t=Di(fc.getDefaults(),arguments,["pan","volume"]);this._panner=this.input=new Ca({context:this.context,pan:t.pan,channelCount:t.channelCount}),this.pan=this._panner.pan,this._volume=this.output=new Go({context:this.context,volume:t.volume}),this.volume=this._volume.volume,this._panner.connect(this._volume),this.mute=t.mute,Ui(this,["pan","volume"])}static getDefaults(){return Object.assign(wo.getDefaults(),{mute:!1,pan:0,volume:0,channelCount:1})}get mute(){return this._volume.mute}set mute(t){this._volume.mute=t}dispose(){return super.dispose(),this._panner.dispose(),this.pan.dispose(),this._volume.dispose(),this.volume.dispose(),this}}class _c extends wo{constructor(){super(Di(_c.getDefaults(),arguments,["volume","pan"])),this.name="Channel";const t=Di(_c.getDefaults(),arguments,["volume","pan"]);this._solo=this.input=new dc({solo:t.solo,context:this.context}),this._panVol=this.output=new fc({context:this.context,pan:t.pan,volume:t.volume,mute:t.mute,channelCount:t.channelCount}),this.pan=this._panVol.pan,this.volume=this._panVol.volume,this._solo.connect(this._panVol),Ui(this,["pan","volume"])}static getDefaults(){return Object.assign(wo.getDefaults(),{pan:0,volume:0,mute:!1,solo:!1,channelCount:1})}get solo(){return this._solo.solo}set solo(t){this._solo.solo=t}get muted(){return this._solo.muted||this.mute}get mute(){return this._panVol.mute}set mute(t){this._panVol.mute=t}_getBus(t){return _c.buses.has(t)||_c.buses.set(t,new ko({context:this.context})),_c.buses.get(t)}send(t,e=0){const s=this._getBus(t),n=new ko({context:this.context,units:"decibels",gain:e});return this.connect(n),n.connect(s),n}receive(t){return this._getBus(t).connect(this),this}dispose(){return super.dispose(),this._panVol.dispose(),this.pan.dispose(),this.volume.dispose(),this._solo.dispose(),this}}_c.buses=new Map;class mc extends wo{constructor(){super(Di(mc.getDefaults(),arguments)),this.name="Mono",this.input=new ko({context:this.context}),this._merge=this.output=new Fa({channels:2,context:this.context}),this.input.connect(this._merge,0,0),this.input.connect(this._merge,0,1)}dispose(){return super.dispose(),this._merge.dispose(),this.input.dispose(),this}}class gc extends wo{constructor(){super(Di(gc.getDefaults(),arguments,["lowFrequency","highFrequency"])),this.name="MultibandSplit",this.input=new ko({context:this.context}),this.output=void 0,this.low=new Wr({context:this.context,frequency:0,type:"lowpass"}),this._lowMidFilter=new Wr({context:this.context,frequency:0,type:"highpass"}),this.mid=new Wr({context:this.context,frequency:0,type:"lowpass"}),this.high=new Wr({context:this.context,frequency:0,type:"highpass"}),this._internalChannels=[this.low,this.mid,this.high];const t=Di(gc.getDefaults(),arguments,["lowFrequency","highFrequency"]);this.lowFrequency=new Do({context:this.context,units:"frequency",value:t.lowFrequency}),this.highFrequency=new Do({context:this.context,units:"frequency",value:t.highFrequency}),this.Q=new Do({context:this.context,units:"positive",value:t.Q}),this.input.fan(this.low,this.high),this.input.chain(this._lowMidFilter,this.mid),this.lowFrequency.fan(this.low.frequency,this._lowMidFilter.frequency),this.highFrequency.fan(this.mid.frequency,this.high.frequency),this.Q.connect(this.low.Q),this.Q.connect(this._lowMidFilter.Q),this.Q.connect(this.mid.Q),this.Q.connect(this.high.Q),Ui(this,["high","mid","low","highFrequency","lowFrequency"])}static getDefaults(){return Object.assign(wo.getDefaults(),{Q:1,highFrequency:2500,lowFrequency:400})}dispose(){return super.dispose(),Qi(this,["high","mid","low","highFrequency","lowFrequency"]),this.low.dispose(),this._lowMidFilter.dispose(),this.mid.dispose(),this.high.dispose(),this.lowFrequency.dispose(),this.highFrequency.dispose(),this.Q.dispose(),this}}class vc extends wo{constructor(){super(...arguments),this.name="Listener",this.positionX=new xo({context:this.context,param:this.context.rawContext.listener.positionX}),this.positionY=new xo({context:this.context,param:this.context.rawContext.listener.positionY}),this.positionZ=new xo({context:this.context,param:this.context.rawContext.listener.positionZ}),this.forwardX=new xo({context:this.context,param:this.context.rawContext.listener.forwardX}),this.forwardY=new xo({context:this.context,param:this.context.rawContext.listener.forwardY}),this.forwardZ=new xo({context:this.context,param:this.context.rawContext.listener.forwardZ}),this.upX=new xo({context:this.context,param:this.context.rawContext.listener.upX}),this.upY=new xo({context:this.context,param:this.context.rawContext.listener.upY}),this.upZ=new xo({context:this.context,param:this.context.rawContext.listener.upZ})}static getDefaults(){return Object.assign(wo.getDefaults(),{positionX:0,positionY:0,positionZ:0,forwardX:0,forwardY:0,forwardZ:-1,upX:0,upY:1,upZ:0})}dispose(){return super.dispose(),this.positionX.dispose(),this.positionY.dispose(),this.positionZ.dispose(),this.forwardX.dispose(),this.forwardY.dispose(),this.forwardZ.dispose(),this.upX.dispose(),this.upY.dispose(),this.upZ.dispose(),this}}ji(t=>{t.listener=new vc({context:t})}),zi(t=>{t.listener.dispose()});class yc extends wo{constructor(){super(Di(yc.getDefaults(),arguments,["positionX","positionY","positionZ"])),this.name="Panner3D";const t=Di(yc.getDefaults(),arguments,["positionX","positionY","positionZ"]);this._panner=this.input=this.output=this.context.createPanner(),this.panningModel=t.panningModel,this.maxDistance=t.maxDistance,this.distanceModel=t.distanceModel,this.coneOuterGain=t.coneOuterGain,this.coneOuterAngle=t.coneOuterAngle,this.coneInnerAngle=t.coneInnerAngle,this.refDistance=t.refDistance,this.rolloffFactor=t.rolloffFactor,this.positionX=new xo({context:this.context,param:this._panner.positionX,value:t.positionX}),this.positionY=new xo({context:this.context,param:this._panner.positionY,value:t.positionY}),this.positionZ=new xo({context:this.context,param:this._panner.positionZ,value:t.positionZ}),this.orientationX=new xo({context:this.context,param:this._panner.orientationX,value:t.orientationX}),this.orientationY=new xo({context:this.context,param:this._panner.orientationY,value:t.orientationY}),this.orientationZ=new xo({context:this.context,param:this._panner.orientationZ,value:t.orientationZ})}static getDefaults(){return Object.assign(wo.getDefaults(),{coneInnerAngle:360,coneOuterAngle:360,coneOuterGain:0,distanceModel:"inverse",maxDistance:1e4,orientationX:0,orientationY:0,orientationZ:0,panningModel:"equalpower",positionX:0,positionY:0,positionZ:0,refDistance:1,rolloffFactor:1})}setPosition(t,e,s){return this.positionX.value=t,this.positionY.value=e,this.positionZ.value=s,this}setOrientation(t,e,s){return this.orientationX.value=t,this.orientationY.value=e,this.orientationZ.value=s,this}get panningModel(){return this._panner.panningModel}set panningModel(t){this._panner.panningModel=t}get refDistance(){return this._panner.refDistance}set refDistance(t){this._panner.refDistance=t}get rolloffFactor(){return this._panner.rolloffFactor}set rolloffFactor(t){this._panner.rolloffFactor=t}get distanceModel(){return this._panner.distanceModel}set distanceModel(t){this._panner.distanceModel=t}get coneInnerAngle(){return this._panner.coneInnerAngle}set coneInnerAngle(t){this._panner.coneInnerAngle=t}get coneOuterAngle(){return this._panner.coneOuterAngle}set coneOuterAngle(t){this._panner.coneOuterAngle=t}get coneOuterGain(){return this._panner.coneOuterGain}set coneOuterGain(t){this._panner.coneOuterGain=t}get maxDistance(){return this._panner.maxDistance}set maxDistance(t){this._panner.maxDistance=t}dispose(){return super.dispose(),this._panner.disconnect(),this.orientationX.dispose(),this.orientationY.dispose(),this.orientationZ.dispose(),this.positionX.dispose(),this.positionY.dispose(),this.positionZ.dispose(),this}}class xc extends wo{constructor(){super(Di(xc.getDefaults(),arguments)),this.name="Recorder";const t=Di(xc.getDefaults(),arguments);this.input=new ko({context:this.context}),ti(xc.supported,"Media Recorder API is not available"),this._stream=this.context.createMediaStreamDestination(),this.input.connect(this._stream),this._recorder=new MediaRecorder(this._stream.stream,{mimeType:t.mimeType})}static getDefaults(){return wo.getDefaults()}get mimeType(){return this._recorder.mimeType}static get supported(){return null!==mi&&Reflect.has(mi,"MediaRecorder")}get state(){return"inactive"===this._recorder.state?"stopped":"paused"===this._recorder.state?"paused":"started"}start(){return yi(this,void 0,void 0,(function*(){ti("started"!==this.state,"Recorder is already started");const t=new Promise(t=>{const e=()=>{this._recorder.removeEventListener("start",e,!1),t()};this._recorder.addEventListener("start",e,!1)});return this._recorder.start(),yield t}))}stop(){return yi(this,void 0,void 0,(function*(){ti("stopped"!==this.state,"Recorder is not started");const t=new Promise(t=>{const e=s=>{this._recorder.removeEventListener("dataavailable",e,!1),t(s.data)};this._recorder.addEventListener("dataavailable",e,!1)});return this._recorder.stop(),yield t}))}pause(){return ti("started"===this.state,"Recorder must be started"),this._recorder.pause(),this}dispose(){return super.dispose(),this.input.dispose(),this._stream.disconnect(),this}}class wc extends wo{constructor(){super(Di(wc.getDefaults(),arguments,["threshold","ratio"])),this.name="Compressor",this._compressor=this.context.createDynamicsCompressor(),this.input=this._compressor,this.output=this._compressor;const t=Di(wc.getDefaults(),arguments,["threshold","ratio"]);this.threshold=new xo({minValue:this._compressor.threshold.minValue,maxValue:this._compressor.threshold.maxValue,context:this.context,convert:!1,param:this._compressor.threshold,units:"decibels",value:t.threshold}),this.attack=new xo({minValue:this._compressor.attack.minValue,maxValue:this._compressor.attack.maxValue,context:this.context,param:this._compressor.attack,units:"time",value:t.attack}),this.release=new xo({minValue:this._compressor.release.minValue,maxValue:this._compressor.release.maxValue,context:this.context,param:this._compressor.release,units:"time",value:t.release}),this.knee=new xo({minValue:this._compressor.knee.minValue,maxValue:this._compressor.knee.maxValue,context:this.context,convert:!1,param:this._compressor.knee,units:"decibels",value:t.knee}),this.ratio=new xo({minValue:this._compressor.ratio.minValue,maxValue:this._compressor.ratio.maxValue,context:this.context,convert:!1,param:this._compressor.ratio,units:"positive",value:t.ratio}),Ui(this,["knee","release","attack","ratio","threshold"])}static getDefaults(){return Object.assign(wo.getDefaults(),{attack:.003,knee:30,ratio:12,release:.25,threshold:-24})}get reduction(){return this._compressor.reduction}dispose(){return super.dispose(),this._compressor.disconnect(),this.attack.dispose(),this.release.dispose(),this.threshold.dispose(),this.ratio.dispose(),this.knee.dispose(),this}}class bc extends wo{constructor(){super(Object.assign(Di(bc.getDefaults(),arguments,["threshold","smoothing"]))),this.name="Gate";const t=Di(bc.getDefaults(),arguments,["threshold","smoothing"]);this._follower=new Da({context:this.context,smoothing:t.smoothing}),this._gt=new Mr({context:this.context,value:eo(t.threshold)}),this.input=new ko({context:this.context}),this._gate=this.output=new ko({context:this.context}),this.input.connect(this._gate),this.input.chain(this._follower,this._gt,this._gate.gain)}static getDefaults(){return Object.assign(wo.getDefaults(),{smoothing:.1,threshold:-40})}get threshold(){return so(this._gt.value)}set threshold(t){this._gt.value=eo(t)}get smoothing(){return this._follower.smoothing}set smoothing(t){this._follower.smoothing=t}dispose(){return super.dispose(),this.input.dispose(),this._follower.dispose(),this._gt.dispose(),this._gate.dispose(),this}}class Tc extends wo{constructor(){super(Object.assign(Di(Tc.getDefaults(),arguments,["threshold"]))),this.name="Limiter";const t=Di(Tc.getDefaults(),arguments,["threshold"]);this._compressor=this.input=this.output=new wc({context:this.context,ratio:20,attack:.003,release:.01,threshold:t.threshold}),this.threshold=this._compressor.threshold,Ui(this,"threshold")}static getDefaults(){return Object.assign(wo.getDefaults(),{threshold:-12})}get reduction(){return this._compressor.reduction}dispose(){return super.dispose(),this._compressor.dispose(),this.threshold.dispose(),this}}class Sc extends wo{constructor(){super(Object.assign(Di(Sc.getDefaults(),arguments))),this.name="MidSideCompressor";const t=Di(Sc.getDefaults(),arguments);this._midSideSplit=this.input=new ec({context:this.context}),this._midSideMerge=this.output=new sc({context:this.context}),this.mid=new wc(Object.assign(t.mid,{context:this.context})),this.side=new wc(Object.assign(t.side,{context:this.context})),this._midSideSplit.mid.chain(this.mid,this._midSideMerge.mid),this._midSideSplit.side.chain(this.side,this._midSideMerge.side),Ui(this,["mid","side"])}static getDefaults(){return Object.assign(wo.getDefaults(),{mid:{ratio:3,threshold:-24,release:.03,attack:.02,knee:16},side:{ratio:6,threshold:-30,release:.25,attack:.03,knee:10}})}dispose(){return super.dispose(),this.mid.dispose(),this.side.dispose(),this._midSideSplit.dispose(),this._midSideMerge.dispose(),this}}class kc extends wo{constructor(){super(Object.assign(Di(kc.getDefaults(),arguments))),this.name="MultibandCompressor";const t=Di(kc.getDefaults(),arguments);this._splitter=this.input=new gc({context:this.context,lowFrequency:t.lowFrequency,highFrequency:t.highFrequency}),this.lowFrequency=this._splitter.lowFrequency,this.highFrequency=this._splitter.highFrequency,this.output=new ko({context:this.context}),this.low=new wc(Object.assign(t.low,{context:this.context})),this.mid=new wc(Object.assign(t.mid,{context:this.context})),this.high=new wc(Object.assign(t.high,{context:this.context})),this._splitter.low.chain(this.low,this.output),this._splitter.mid.chain(this.mid,this.output),this._splitter.high.chain(this.high,this.output),Ui(this,["high","mid","low","highFrequency","lowFrequency"])}static getDefaults(){return Object.assign(wo.getDefaults(),{lowFrequency:250,highFrequency:2e3,low:{ratio:6,threshold:-30,release:.25,attack:.03,knee:10},mid:{ratio:3,threshold:-24,release:.03,attack:.02,knee:16},high:{ratio:3,threshold:-24,release:.03,attack:.02,knee:16}})}dispose(){return super.dispose(),this._splitter.dispose(),this.low.dispose(),this.mid.dispose(),this.high.dispose(),this.output.dispose(),this}}class Cc extends wo{constructor(){super(Di(Cc.getDefaults(),arguments,["low","mid","high"])),this.name="EQ3",this.output=new ko({context:this.context}),this._internalChannels=[];const t=Di(Cc.getDefaults(),arguments,["low","mid","high"]);this.input=this._multibandSplit=new gc({context:this.context,highFrequency:t.highFrequency,lowFrequency:t.lowFrequency}),this._lowGain=new ko({context:this.context,gain:t.low,units:"decibels"}),this._midGain=new ko({context:this.context,gain:t.mid,units:"decibels"}),this._highGain=new ko({context:this.context,gain:t.high,units:"decibels"}),this.low=this._lowGain.gain,this.mid=this._midGain.gain,this.high=this._highGain.gain,this.Q=this._multibandSplit.Q,this.lowFrequency=this._multibandSplit.lowFrequency,this.highFrequency=this._multibandSplit.highFrequency,this._multibandSplit.low.chain(this._lowGain,this.output),this._multibandSplit.mid.chain(this._midGain,this.output),this._multibandSplit.high.chain(this._highGain,this.output),Ui(this,["low","mid","high","lowFrequency","highFrequency"]),this._internalChannels=[this._multibandSplit]}static getDefaults(){return Object.assign(wo.getDefaults(),{high:0,highFrequency:2500,low:0,lowFrequency:400,mid:0})}dispose(){return super.dispose(),Qi(this,["low","mid","high","lowFrequency","highFrequency"]),this._multibandSplit.dispose(),this.lowFrequency.dispose(),this.highFrequency.dispose(),this._lowGain.dispose(),this._midGain.dispose(),this._highGain.dispose(),this.low.dispose(),this.mid.dispose(),this.high.dispose(),this.Q.dispose(),this}}class Ac extends wo{constructor(){super(Di(Ac.getDefaults(),arguments,["url","onload"])),this.name="Convolver",this._convolver=this.context.createConvolver();const t=Di(Ac.getDefaults(),arguments,["url","onload"]);this._buffer=new Xi(t.url,e=>{this.buffer=e,t.onload()}),this.input=new ko({context:this.context}),this.output=new ko({context:this.context}),this._buffer.loaded&&(this.buffer=this._buffer),this.normalize=t.normalize,this.input.chain(this._convolver,this.output)}static getDefaults(){return Object.assign(wo.getDefaults(),{normalize:!0,onload:Zi})}load(t){return yi(this,void 0,void 0,(function*(){this.buffer=yield this._buffer.load(t)}))}get buffer(){return this._buffer.length?this._buffer:null}set buffer(t){t&&this._buffer.set(t),this._convolver.buffer&&(this.input.disconnect(),this._convolver.disconnect(),this._convolver=this.context.createConvolver(),this.input.chain(this._convolver,this.output));const e=this._buffer.get();this._convolver.buffer=e||null}get normalize(){return this._convolver.normalize}set normalize(t){this._convolver.normalize=t}dispose(){return super.dispose(),this._buffer.dispose(),this._convolver.disconnect(),this}}function Dc(){return Ji().now()}function Oc(){return Ji().immediate()}const Mc=Ji().transport;function Ec(){return Ji().transport}const Rc=Ji().destination,qc=Ji().destination;function Fc(){return Ji().destination}const Ic=Ji().listener;function Vc(){return Ji().listener}const Nc=Ji().draw;function Pc(){return Ji().draw}const jc=Ji();function Lc(){return Xi.loaded()}const zc=Xi,Bc=Vo,Wc=$o}])}));

},{}],45:[function(require,module,exports){

},{}],46:[function(require,module,exports){
module.exports={
  "c": 0,
  "cbb": 10,
  "cb": 11,
  "c#": 1,
  "c##": 2,
  "cx": 2,
  "d": 2,
  "dbb": 0,
  "db": 1,
  "d#": 3,
  "d##": 4,
  "dx": 4,
  "e": 4,
  "ebb": 2,
  "eb": 3,
  "e#": 5,
  "e##": 6,
  "ex": 6,
  "f": 5,
  "fbb": 3,
  "fb": 4,
  "f#": 6,
  "f##": 7,
  "fx": 7,
  "g": 7,
  "gbb": 5,
  "gb": 6,
  "g#": 8,
  "g##": 9,
  "gx": 9,
  "a": 9,
  "abb": 7,
  "ab": 8,
  "a#": 10,
  "a##": 11,
  "ax": 11,
  "b": 11,
  "bbb": 9,
  "bb": 10,
  "b#": 0,
  "b##": 1,
  "bx": 1,
  "C": 0,
  "Cbb": 10,
  "Cb": 11,
  "C#": 1,
  "C##": 2,
  "Cx": 2,
  "D": 2,
  "Dbb": 0,
  "Db": 1,
  "D#": 3,
  "D##": 4,
  "Dx": 4,
  "E": 4,
  "Ebb": 2,
  "Eb": 3,
  "E#": 5,
  "E##": 6,
  "Ex": 6,
  "F": 5,
  "Fbb": 3,
  "Fb": 4,
  "F#": 6,
  "F##": 7,
  "Fx": 7,
  "G": 7,
  "Gbb": 5,
  "Gb": 6,
  "G#": 8,
  "G##": 9,
  "Gx": 9,
  "A": 9,
  "Abb": 7,
  "Ab": 8,
  "A#": 10,
  "A##": 11,
  "Ax": 11,
  "B": 11,
  "Bbb": 9,
  "Bb": 10,
  "B#": 0,
  "B##": 1,
  "Bx": 1
}

},{}],47:[function(require,module,exports){
//=======================================================================
// index.js
// main of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// total-serialism is a set of methods for the generation and 
// transformation of number sequences designed with algorithmic 
// composition for music in mind.
//=======================================================================

// require the various libraries
const Generative    = require('./src/gen-basic.js');
const Algorithmic   = require('./src/gen-complex.js');
const Stochastic    = require('./src/gen-stochastic.js');
const Transform     = require('./src/transform.js');
const Statistic     = require('./src/statistic.js')
const Translate     = require('./src/translate.js');
const Utility       = require('./src/utility.js');

// export the various libraries
exports.Generative  = Generative;
exports.Algorithmic = Algorithmic;
exports.Stochastic  = Stochastic;
exports.Transform   = Transform;
exports.Statistic   = Statistic;
exports.Translate   = Translate;
exports.Utility     = Utility;

// Methods exposed to global scope
exports.getSettings = Translate.getSettings;
exports.setTempo    = Translate.setTempo;
exports.getTempo    = Translate.getTempo;
exports.setBPM      = Translate.setTempo;
exports.getBPM      = Translate.getTempo;
exports.setScale    = Translate.setScale;
exports.getScale    = Translate.getScale;
exports.setRoot     = Translate.setRoot;
exports.getRoot     = Translate.getRoot;

// Include all methods as part of the main library
// This allows you to use everything without having to specify the 
// various libraries
// Object.assign(this, Generative, Algorithmic, Stochastic, Transform, Statistic, Translate, Utility);
},{"./src/gen-basic.js":48,"./src/gen-complex.js":49,"./src/gen-stochastic.js":50,"./src/statistic.js":51,"./src/transform.js":52,"./src/translate.js":53,"./src/utility.js":54}],48:[function(require,module,exports){
//==========================================================================
// gen-basic.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Basic methods that generate number sequences as 
// startingpoint for composing melodies, rhythms and more
// 
// credits:
// - spread-methods inspired by Max8's MC functions spread and spreadinclusive
// - cosine/sine array generation inspired by workshop by Steven Yi at ICLC
//==========================================================================

// const Util = require('./utility.js');
const { map, flatten, toArray, size, TWO_PI } = require('./utility');

// Generate a list of n-length starting at one value
// up until (but excluding) the 3th argument. 
// Evenly spaced values in between in floating-point
// Defaults to range of 0 - 1 for Float
// 
// @param {Int+} -> array-length
// @param {Int} -> low output 
// @param {Int} -> high output
// @return -> {Array}
//
function spreadFloat(len=1, lo=1, hi){
	// if hi undefined set lo to 0 and hi=lo
	if (hi === undefined){ var t=lo, lo=0, hi=t; }
	// calculate the range
	let r = hi - lo; 
	// lo is actual lowest value
	lo = Math.min(lo, hi);
	// len is minimum of 1 or length of array
	len = size(len);
	if (len === 1){ return [lo]; }
	// stepsize
	let s = Math.abs(r) / len;
	// generate array
	let arr = [];
	for (let i=0; i<len; i++){
		arr[i] = i * s + lo;
	}
	return (r < 0)? arr.reverse() : arr;
}
exports.spreadFloat = spreadFloat;
exports.spreadF = spreadFloat;

// Spread function rounded to integers
// 
// @params {length, low-output, high-output}
// @return {Array}
//
function spread(len, lo=size(len), hi){
	let arr = spreadFloat(len, lo, hi);
	return arr.map(v => Math.floor(Number(v.toPrecision(15))));
}
exports.spread = spread;

// Generate a list of n-length starting at one value
// up until (but excluding) the 3th argument. 
// Set an exponential curve in the spacing of the values.
// Defaults to range of 0 - 1 for Float
// 
// @params {length, low-output, high-output, exponent}
// @return {Array}
//
function spreadExpFloat(len=1, lo=1, hi, exp=1){
	// if hi undefined set lo to 0 and hi=lo
	if (hi === undefined){ var t=lo, lo=0, hi=t; }
	// calculate the range
	let r = hi - lo; 
	// lo is actual lowest value
	lo = Math.min(lo, hi);
	// len is minimum of 1
	len = size(len);
	// len = Math.max(1, len);
	if (len === 1){ return [lo]; }
	// generate array
	let arr = [];
	for (let i=0; i<len; i++){
		arr[i] = Math.pow((i / len), exp) * Math.abs(r) + lo;
	}
	return (r < 0)? arr.reverse() : arr;
}
exports.spreadFloatExp = spreadExpFloat; // deprecated
exports.spreadExpFloat = spreadExpFloat;
exports.spreadExpF = spreadExpFloat;

// Spread function floored to integers
// 
// @params {length, low-output, high-output, exponent}
// @return {Array}
//
function spreadExp(len, lo=size(len), hi, exp){
	let arr = spreadExpFloat(len, lo, hi, exp);
	return arr.map(v => Math.floor(Number(v.toPrecision(15))));
}
exports.spreadExp = spreadExp;

// Generate a list of n-length starting at one value
// ending at the 3th argument.
// Evenly spaced values in between in floating-point
// Defaults to range of 0 - 1 for Float
// 
// @params {length, low-output, high-output}
// @return {Array}
//
function spreadInclusiveFloat(len=1, lo=1, hi){
	// if hi undefined set lo to 0 and hi=lo
	if (hi === undefined){ var t=lo, lo=0, hi=t; }
	// calculate the range
	let r = hi - lo; 
	// lo is actual lowest value
	lo = Math.min(lo, hi);
	// len is minimum of 1
	len = size(len);
	// len = Math.max(1, len);
	if (len === 1){ return [lo]; }
	// stepsize
	let s = Math.abs(r) / (len - 1);
	// generate array
	let arr = []
	for (let i=0; i<len; i++){
		arr[i] = i * s + lo;
	}
	return (r < 0)? arr.reverse() : arr;
}
exports.spreadInclusiveFloat = spreadInclusiveFloat;
exports.spreadIncF = spreadInclusiveFloat;

// spreadinclusiveFloat function floored to integers
// 
// @params {length, low-output, high-output}
// @return {Array}
//
function spreadInclusive(len, lo=size(len), hi){
	var arr = spreadInclusiveFloat(len, lo, hi);
	return arr.map(v => Math.floor(Number(v.toPrecision(15))));
}
exports.spreadInclusive = spreadInclusive;
exports.spreadInc = spreadInclusive;

// Generate a list of n-length starting at one value
// ending at the 3th argument.
// Set an exponential curve in the spacing of the values.
// Defaults to range of 0 - 1 for Float
// 
// @params {length, low-output, high-output, exponent}
// @return {Array}
//
function spreadInclusiveExpFloat(len=1, lo=1, hi, exp=1){
	// if hi undefined set lo to 0 and hi=lo
	if (hi === undefined){ var t=lo, lo=0, hi=t; }
	// calculate the range
	let r = hi - lo; 
	// lo is actual lowest value
	lo = Math.min(lo, hi);
	// len is minimum of 1
	len = size(len);
	// len = Math.max(1, len);
	if (len === 1){ return [lo]; }
	// generate array
	let arr = [];
	for (let i=0; i<len; i++){
		arr[i] = Math.pow((i / (len-1)), exp) * Math.abs(r) + lo;
	}
	return (r < 0)? arr.reverse() : arr;
}
exports.spreadInclusiveFloatExp = spreadInclusiveExpFloat; //deprecated
exports.spreadInclusiveExpFloat = spreadInclusiveExpFloat;
exports.spreadIncExpF = spreadInclusiveExpFloat;

// spreadinclusiveFloatExp function floored to integers
// 
// @params {length, low-output, high-output, exponent}
// @return {Array}
//
function spreadInclusiveExp(len, lo=size(len), hi, exp){
	var arr = spreadInclusiveExpFloat(len, lo, hi, exp);
	return arr.map(v => Math.floor(Number(v.toPrecision(15))));
}
exports.spreadInclusiveExp = spreadInclusiveExp;
exports.spreadIncExp = spreadInclusiveExp;

// fill an array with values. Arguments are pairs.
// Every pair consists of <value, amount>
// The value is repeated n-amount times in the list
// Also accepts an array as a single argument
// 
// @params {value0, amount0, value1, amount1, ... value-n, amount-n}
// @return {Array}
// 
function fill(...args){
	// also accepts a single array as argument containing the pairs
	if (args.length === 1){
		args = args[0];
	}
	// when arguments uneven strip last argument
	if (args.length % 2){ args.pop(); }
	// when no arguments return array of 0
	if (!args.length){ return [0]; }
	
	let len = args.length/2;
	let arr = [];
	for (let i=0; i<len; i++){
		for (let k=0; k<Math.abs(args[i*2+1]); k++){
			arr.push(args[i*2]);
		}
	}
	return arr;
}
exports.fill = fill;

// Generate an array with n-periods of a sine function
// Optional last arguments set lo and hi range and phase offset
// Only setting first range argument sets the low-range to 0
// 
// @param {Int} -> Length of output array (resolution)
// @param {NumberArray | Number} -> Periods of sine-wave 
// @param {Number} -> Low range of values (optional, default=-1) 
// @param {Number} -> High range of values (optional, default=1)
// @param {Number} -> Phase offset (optional, default=0)
// @return {Array} -> Sine function
// 
function sineFloat(len=1, periods=1, lo, hi, phase=0){
	// if no range specified
	if (lo === undefined){ lo = -1; hi = 1; }
	else if (hi === undefined){ hi = lo, lo = 0; }
	// make periods array
	periods = toArray(periods);
	
	// if (lo === undefined){ lo = -1; hi = 1; }
	// swap if lo > hi
	// if (lo > hi){ var t=lo, lo=hi, hi=t; }

	// array length minimum of 1
	len = size(len);
	// len = Math.max(1, len);
	let arr = [];

	// let twoPI = Math.PI * 2.0;
	// let a = Math.PI * 2.0 * periods / len;
	// let p = Math.PI * phase * 2.0;
	let p = TWO_PI * phase;
	for (let i=0; i<len; i++){
		// arr[i] = Math.sin(a * i + p);
		let a = TWO_PI * periods[i % periods.length] / len;
		arr[i] = Math.sin(a * i + p);
	}
	return map(arr, -1, 1, lo, hi);
}
exports.sineFloat = sineFloat;
exports.sineF = sineFloat;
exports.sinF = sineFloat;

// Generate an integer array with n-periods of a sine function
// Optional last arguments set lo and hi range
// 
// @param {Int} -> Length of output array
// @param {Number} -> Periods of sine-wave 
// @param {Number} -> Low range of values (optional, default = 0) 
// @param {Number} -> High range of values (optional, default = 12)
// @param {Number} -> Phase shift (optional, default = 0)
// @return {Array} -> Sine function
// 
function sine(len=1, periods=1, lo=12, hi, phase){
	var arr = sineFloat(len, periods, lo, hi, phase);
	return arr.map(v => Math.trunc(v));
}
exports.sine = sine;

// Generate an array with n-periods of a cosine function
// Flip the low and high range to invert the function
// See sinFloat() for details
//
function cosineFloat(len=1, periods=1, lo, hi, phase=0){
	return sineFloat(len, periods, lo, hi, phase+0.25);
}
exports.cosineFloat = cosineFloat;
exports.cosineF = cosineFloat;
exports.cosF = cosineFloat;

// Generate an integer array with n-periods of a cosine function
// Flip the low and high range to invert the function
// See sin() for details
// 
function cosine(len=1, periods=1, lo=12, hi, phase=0){
	var arr = sineFloat(len, periods, lo, hi, phase+0.25);
	return arr.map(v => Math.trunc(v));
}
exports.cosine = cosine;

// Generate an array with n-periods of a saw/phasor function
// Optional last arguments set lo and hi range and phase offset
// Only setting first range argument sets the low-range to 0
// 
// @param {Int} -> Length of output array (resolution)
// @param {Number/Array} -> Periods of the wave (option, default=1)
// @param {Number} -> Low range of values (optional, default=-1) 
// @param {Number} -> High range of values (optional, default=1)
// @param {Number} -> Phase offset (optional, default=0)
// @return {Array} -> wave-function as array
//  
function sawFloat(len=1, periods=1, lo, hi, phase=0){
	if (lo === undefined){ lo = -1; hi = 1; }
	else if (hi === undefined){ hi = lo, lo = 0; }
	// make periods array
	periods = toArray(periods);

	// array length minimum of 1
	len = size(len);
	// len = Math.max(1, len);
	let arr = [];

	let a = 1 / len;
	for (let i=0; i<len; i++){
		arr[i] = ((i * a * periods[i % periods.length]) % 1.0 + 1.0) % 1.0;
	}
	return map(arr, 0, 1, lo, hi);
	// return arr;
}
exports.sawFloat = sawFloat;
exports.phasor = sawFloat;
exports.sawF = sawFloat;

function saw(len=1, periods=1, lo=12, hi, phase=0){
	var arr = sawFloat(len, periods, lo, hi, phase);
	return arr.map(v => Math.trunc(v));
}
exports.saw = saw;

// Generate an array with n-periods of a pulse/squarewave function
// Optional last arguments set lo and hi range and pulse width
// Only setting first range argument sets the low-range to 0
// 
// @param {Int} -> Length of output array (resolution)
// @param {Number/Array} -> Periods of the wave (option, default=1)
// @param {Number} -> Low range of values (optional, default=-1) 
// @param {Number} -> High range of values (optional, default=1)
// @param {Number} -> Pulse width (optional, default=0.5)
// @return {Array} -> wave-function as array
//  
function squareFloat(len=1, periods=1, lo, hi, pulse=0.5){
	if (lo === undefined){ lo = 0; hi = 1; }
	else if (hi === undefined){ hi = lo, lo = 0; }
	// make periods array
	periods = toArray(periods);

	// array length minimum of 1
	len = size(len);
	// len = Math.max(1, len);
	let arr = [];

	let a = 1 / len;
	for (let i=0; i<len; i++){
		arr[i] = ((i * a * periods[i % periods.length]) % 1 + 1) % 1;
		arr[i] = arr[i] < pulse;
	}
	return map(arr, 0, 1, lo, hi);
	// return arr;
}
exports.squareFloat = squareFloat;
exports.squareF = squareFloat;
exports.rectFloat = squareFloat;
exports.rectF = squareFloat;

function square(len=1, periods=1, lo=12, hi, pulse=0.5){
	var arr = squareFloat(len, periods, lo, hi, pulse);
	return arr.map(v => Math.trunc(v));
}
exports.square = square;
exports.rect = square;

// Generate a binary rhythm from a positive integer number or an array 
// of numbers. Returns the binary value as an array of separated 1's and 0's
// useful for representing rhythmical patterns
// 
// @param {Int+/Array} -> Array of numbers to convert to binary representation
// @return {Array} -> Array of 1's and 0's
//
function binary(...a){
	// if no arguments return else flatten array to 1 dimension
	if (!a.length) { return [0]; }
	a = flatten(a);

	let arr = [];
	for (let i=0; i<a.length; i++){
		if (isNaN(a[i])){
			arr = arr.concat(0);
		} else {
			// make the value into a whole number
			let v = Math.floor(Math.max(a[i], 0));
			// convert the number to binary string, split, convert to numbers
			arr = arr.concat(v.toString(2).split('').map((x) => Number(x)));
		}
	}
	return arr;
}
exports.binary = binary;
exports.binaryBeat = binary;

// Generate an array of 1's and 0's based on a positive integer number or array
// Every number in the array will be replaced by a 1 with a specified amount of 
// 0's appended to it. Eg. a 2 => 1 0, a 4 => 1 0 0 0, etc. This technique is
// useful to generate a rhythm based on spacing length between onsets
//
// @param {Int+/Array} -> Array of numbers to convert to spaced rhythm
// @return {Array} -> Array of 1's and 0's representing a rhythm
//
function spacing(...a){
	// if no arguments return else flatten array to 1 dimension
	if (!a.length) { return [0]; }
	a = flatten(a);

	let arr = [];
	for (let i=0; i<a.length; i++){
		if (isNaN(a[i]) || a[i] < 1){
			// if no number or less than 1 append 0
			arr = arr.concat(0);
		} else {
			// for every integer push a 1 followed by 0's
			for (let j=0; j<Math.floor(a[i]); j++){
				arr.push(!j ? 1 : 0);
			}
		}
	}
	return arr;
}
exports.space = spacing;
exports.spacing = spacing;
exports.spacingBeat = spacing;
},{"./utility":54}],49:[function(require,module,exports){
//==============================================================================
// gen-complex.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Complex Algorithms and methods that generate number sequences as 
// startingpoint for composing melodies, rhythms and more
// 
// credits:
// - euclid() based on paper by Godfried Toussaint  
// http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf 
// and code from https://github.com/brianhouse/bjorklund
// - hexBeat() inspired by Steven Yi's implementation in the csound
//  livecode environment from 
// https://github.com/kunstmusik/csound-live-code
// and here https://kunstmusik.github.io/learn-hex-beats/
// - fibonacci(), nbonacci() and pisano() inspired by 'fibonacci motion' 
// used by composer Iannis Xenakis and 'symbolic music'. See further 
// reading in README.md. Also inspired by Numberphile videos on 
// pisano period on youtube.
// - infinitySeries(), contributed by Stephen Meyer and based on
// https://www.lawtonhall.com/blog/2019/9/9/per-nrgrds-infinity-series#:~:text=Coding%20the%20Infinity%20Series
// 
//==============================================================================

const { mod, size } = require('./utility');
const { rotate } = require('./transform');
const BigNumber = require('bignumber.js');

// configure the bignumber settings
BigNumber.config({
	DECIMAL_PLACES: 20,
	EXPONENTIAL_AT: [-7, 20]
});

// A hexadecimal rhythm generator. Generates values of 0 and 1
// based on the input of a hexadecimal character string
// Does not work with `0x` hexadecimal notation, for that use binary()
//
// @param {String/Number} -> hexadecimal characters (0 t/m f)
// @return {Array} -> rhythm
// 
function hexBeat(hex="8"){
	// convert to string if a number
	if (!hex.isNaN){ hex = hex.toString(); }
	let a = [];
	// for every char in string get binary expansion
	for (let i=0; i<hex.length; i++){
		let binary = parseInt("0x" + hex[i]).toString(2);
		binary = isNaN(binary)? '0000' : binary;
		// pad with leading 0's to ensure 4 values
		let padding = binary.padStart(4, '0');
		a = a.concat(padding.split('').map(x => Number(x)));
	}
	return a;
}
exports.hexBeat = hexBeat;
exports.hex = hexBeat;

// A fast euclidean rhythm algorithm
// Uses the downsampling of a line drawn between two points in a 
// 2-dimensional grid to divide the squares into an evenly distributed
// amount of steps. Generates correct distribution, but the distribution 
// may differ a bit from the recursive euclidean distribution algorithm 
// for steps above 44.
//
// @param {Int} -> steps (optional, default=8)
// @param {Int} -> beats (optional, default=4)
// @param {Int} -> rotate (optional, default=0)
// @return {Array}
// 
function fastEuclid(s=8, h=4, r=0){
	let arr = [];
	let d = -1;
	// steps/hits is minimum of 1 or array length
	s = size(s);
	h = size(h);
	
	for (let i=0; i<s; i++){
		let v = Math.floor(i * (h / s));
		arr[i] = Number(v !== d);
		d = v;
	}
	if (r){
		return rotate(arr, r);
	}
	return arr;
}
exports.fastEuclidean = fastEuclid;
exports.fastEuclid = fastEuclid;

// The Euclidean rhythm generator
// Generate a euclidean rhythm evenly spacing n-beats amongst n-steps.
// Inspired by Godfried Toussaints famous paper "The Euclidean Algorithm
// Generates Traditional Musical Rhythms".
//
// @param {Int} -> steps (optional, default=8)
// @param {Int} -> beats (optional, default=4)
// @param {Int} -> rotate (optional, default=0)
// @return {Array}
// 
let pattern, counts, remainders;

function euclid(steps=8, beats=4, rot=0){
	// steps/hits is minimum of 1 or array length
	steps = size(steps);
	beats = size(beats);

	pattern = [];
	counts = [];
	remainders = [];
	var level = 0;
	var divisor = steps - beats;

	remainders.push(beats);
	while (remainders[level] > 1){
		counts.push(Math.floor(divisor / remainders[level]));
		remainders.push(divisor % remainders[level]);
		
		divisor = remainders[level];
        level++;
	}
    counts.push(divisor);
	build(level);

	return rotate(pattern, rot - pattern.indexOf(1));
}
exports.euclidean = euclid;
exports.euclid = euclid;

function build(l){
	var level = l;
	
	if (level == -1){
		pattern.push(0);
	} else if (level == -2){
		pattern.push(1);
	} else {
		for (var i=0; i<counts[level]; i++){
			build(level-1);
		}
		if (remainders[level] != 0){
			build(level-2);
		}
	}
}

// Lindenmayer String expansion
// a recursive fractal algorithm to generate botanic (and more)
// Default rule is 1 -> 10, 0 -> 1, where 1=A and 0=B
// Rules are specified as a JS object consisting of strings or arrays
//
// @param {String} -> the axiom (the start)
// @param {Int} -> number of generations
// @param {Object} -> production rules
// @return {String/Array} -> axiom determins string or array output
// 
function linden(axiom=[1], iteration=3, rules={1: [1, 0], 0: [1]}){
	axiom = (typeof axiom === 'number')? [axiom] : axiom;
	let asString = typeof axiom === 'string';
	let res;

	// return axiom of iterations is < 1
	if (iteration < 1){ return axiom };

	for(let n=0; n<iteration; n++){
		res = (asString)? "" : [];
		for(let ch in axiom){
			let char = axiom[ch];
			let rule = rules[char];
			if(rule){
				res = (asString)? res + rule : res.concat(rule);
			}else{
				res = (asString)? res + char : res.concat(char);
			}
		}
		axiom = res;
	}
	return res;
}
exports.linden = linden;

// Generate a single sequence of the Collatz Conjecture given
// a starting value greater than 1
// The conjecture states that any giving positive integer will
// eventually reach zero after iteratively applying the following rules
// if the number is even, divide by 2
// if the number is odd, multiply by 3 and add 1
// 
// @param {Int+} -> starting number
// @return {Array} -> the sequence (inverted, so starting at 1)
// 
function collatz(n=12){
	n = Math.max(2, n);
	let sequence = [];

	while (n != 1){
		if (n % 2){
			n = n * 3 + 1;
		} else {
			n = n / 2;
		}
		sequence.push(n);
	}
	return sequence.reverse();
}
exports.collatz = collatz;

// Return the modulus of a collatz conjecture sequence
// Set the modulo
// 
// @param {Int+} -> starting number
// @param {Int+} -> modulus
// 
function collatzMod(n=12, m=2){
	return mod(collatz(n), Math.min(m, Math.floor(m)));
}
exports.collatzMod = collatzMod;

// The collatz conjecture with BigNumber library
// 
function bigCollatz(n=12){
	let num = new BigNumber(n);
	let sequence = [];

	while (num.gt(1)){
		if (num.mod(2).eq(1)){
			num = num.times(3);
			num = num.plus(1);
		} else {
			num = num.div(2);
		}
		sequence.push(num.toFixed());
	}
	return sequence.reverse();
}
exports.bigCollatz = bigCollatz;

// Return the modulus of a collatz conjecture sequence
// Set the modulo
// 
function bigCollatzMod(n=12, m=2){
	let arr = bigCollatz(n);
	for (let i in arr){
		arr[i] = new BigNumber(arr[i]);
		arr[i] = arr[i].mod(m).toNumber();
	}
	return arr;
}
exports.bigCollatzMod = bigCollatzMod;

// Generate any n-bonacci sequence as an array of BigNumber objects
// F(n) = t * F(n-1) + F(n-2). This possibly generatres various 
// integer sequences: fibonacci, pell, tribonacci
// 
// @param {Int} -> output length of array
// @param {Int} -> start value 1
// @param {Int} -> start value 2
// @param {Int} -> multiplier t
// @return {Array} -> array of BigNumber objects
// 
function numBonacci(len=1, s1=0, s2=1, t=1){
	var n1 = new BigNumber(s2); //startvalue n-1
	var n2 = new BigNumber(s1); //startvalue n-2

	var cur = 0, arr = [n2, n1];
	
	if (len < 3) {
		// return arr;
		return arr.slice(0, len);
	} else {
		len = Math.max(1, len-2);
		for (var i=0; i<len; i++){	
			// general method for nbonacci sequences
			// Fn = t * Fn-1 + Fn-2
			cur = n1.times(t).plus(n2);
			n2 = n1; // store n-1 as n-2
			n1 = cur; // store current number as n-1
			arr.push(cur); // store BigNumber in array
		}
		return arr;
	}
}

// Generate any n-bonacci sequence as an array of BigNumber objects
// for export fuction. F(n) = t * F(n-1) + F(n-2)
// 
// @param {Int} -> output length of array
// @param {Int} -> start value 1 (optional, default=0)
// @param {Int} -> start value 2 (optional, default=1)
// @param {Int} -> multiplier (optional, default=1)
// @return {String-Array} -> array of bignumbers as strings
// 
function nbonacci(len=1, s1=0, s2=1, t=1, toString=false){
	return numBonacci(len, s1, s2, t).map(x => {
		return (toString)? x.toFixed() : x.toNumber() 
	});
}
exports.nbonacci = nbonacci;

// Generate the Fibonacci sequence as an array of BigNumber objects
// F(n) = F(n-1) + F(n-2). The ratio between consecutive numbers in 
// the fibonacci sequence tends towards the Golden Ratio (1+√5)/2
// OEIS: A000045 (Online Encyclopedia of Integer Sequences)
// When working with larger fibonacci-numbers then possible in 64-bit
// Set the toString to true
// 
// @param {Int} -> output length of array
// @param {Int} -> offset in sequence (optional, default=0)
// @param {Bool} -> numbers as strings (optional, default=false)
// @return {String-Array} -> array of bignumbers as strings
// 
function fibonacci(len=1, offset=0, toString=false){
	var f = numBonacci(len+offset, 0, 1, 1).map(x => {
		return (toString)? x.toFixed() : x.toNumber() 
	});
	if (offset > 0){
		return f.slice(offset, offset+len);
	}
	return f;
}
exports.fibonacci = fibonacci;

// Generate the Pisano period sequence as an array of BigNumber objects
// Returns array of [0] if no period is found within the default length
// of fibonacci numbers (256). Mod value is a minimum of 2
// 
// F(n) = (F(n-1) + F(n-2)) mod a.
// 
// @param {Int} -> output length of array
// @param {Int} -> modulus for pisano period
// @return {Int-Array} -> array of integers
// 
function pisano(mod=12, len=-1){
	if (mod < 2){ return [0]; }
	if (len < 1){
		return pisanoPeriod(mod);
	} else {
		return numBonacci(len, 0, 1, 1).map(x => x.mod(mod).toNumber());
	}
}
exports.pisanoPeriod = pisano;
exports.pisano = pisano;

function pisanoPeriod(mod=2, length=32){
	// console.log('pisano', '@mod', mod, '@length', length);
	var seq = numBonacci(length, 0, 1, 1).map(x => x.mod(mod).toNumber());
	var p = [], l = 0;

	for (var i=0; i<seq.length; i++){
		// console.log(i, seq[i]);
		p.push(seq[i]);

		if (p.length > 2){ 
			var c = [0, 1, 1];
			var equals = 0;
			// compare last 3 values with [0, 1, 1]
			for (let k=0; k<p.length; k++){
				equals += p[k] === c[k];
				// console.log('>>', equals);
			}
			// if equals slice the sequence and return
			if (equals === 3 && l > 3){
				// console.log('true');
				return seq.slice(0, l);
			}
			p = p.slice(1, 3);
			l++;
		}
	}
	// console.log('no period, next iteration');
	return pisanoPeriod(mod, length*2);
}

// Generate the Pell numbers as an array of BigNumber objects
// F(n) = 2 * F(n-1) + F(n-2). The ratio between consecutive numbers 
// in the pell sequence tends towards the Silver Ratio 1 + √2.
// OEIS: A006190 (Online Encyclopedia of Integer Sequences)
// 
// @param {Int} -> output length of array
// @param {Int} -> offset in sequence (optional, default=0)
// @param {Bool} -> numbers as strings (optional, default=false)
// @return {String-Array} -> array of bignumbers as strings
// 
function pell(len=1, offset=0, toString=false){
	var f = numBonacci(len+offset, 0, 1, 2).map(x => {
		return (toString)? x.toFixed() : x.toNumber() 
	});
	if (offset > 0){
		return f.slice(offset, offset+len);
	}
	return f;
}
exports.pell = pell;

// Generate the Tribonacci numbers as an array of BigNumber objects
// F(n) = 2 * F(n-1) + F(n-2). The ratio between consecutive numbers in 
// the 3-bonacci sequence tends towards the Bronze Ratio (3 + √13) / 2.
// OEIS: A000129 (Online Encyclopedia of Integer Sequences)
// 
// @param {Int} -> output length of array
// @param {Int} -> offset in sequence (optional, default=0)
// @param {Bool} -> numbers as strings (optional, default=false)
// @return {String-Array} -> array of bignumbers as strings
// 
function threeFibonacci(len=1, offset=0, toString=false){
	let f = numBonacci(len+offset, 0, 1, 3).map(x => {
		return (toString)? x.toFixed() : x.toNumber() 
	});
	if (offset > 0){
		return f.slice(offset, offset+len);
	}
	return f;
}
exports.threeFibonacci = threeFibonacci;

// Generate the Lucas numbers as an array of BigNumber objects
// F(n) = F(n-1) + F(n-2), with F0=2 and F1=1.
// OEIS: A000032 (Online Encyclopedia of Integer Sequences)
// 
// @param {Int} -> output length of array
// @param {Int} -> offset in sequence (optional, default=0)
// @param {Bool} -> numbers as strings (optional, default=false)
// @return {String-Array} -> array of bignumbers as strings
// 
function lucas(len=1, offset=0, toString=false){
	let f = numBonacci(len+offset, 2, 1, 1).map(x => {
		return (toString)? x.toFixed() : x.toNumber() 
	});
	if (offset > 0){
		return f.slice(offset, offset+len);
	}
	return f;
}
exports.lucas = lucas;

// Generate the Nørgård infinity series sequence.
//
// @param {Int+} -> size the length of the resulting Meldoy's steps (default=16)
// @param {Array} -> seed the sequence's first two steps (defaults = [0, 1])
// @param {Int} -> offset from which the sequence starts
// @return {Array} -> an Array with the infinity series as its steps
//
function infinitySeries(len=16, seed=[0,1], offset=0){
	len = size(len);
	let root  = seed[0];
	let step1 = seed[1];
	let seedInterval = step1 - root;

	let steps = Array.from(new Array(len), (n, i) => i + offset).map(step => {
		return root + (norgardInteger(step) * seedInterval);
	});

	return steps;
}
exports.infinitySeries = infinitySeries;
exports.infSeries = infinitySeries;

// Returns the value for any index of the base infinity series sequence 
// (0, 1 seed). This function enables an efficient way to compute any 
// arbitrary section of the infinity series without needing to compute
// the entire sequence up to that point.
//
// This is the Infinity Series binary trick. Steps:
// 1. Convert the integer n to binary string
// 2. Split the string and map as an Array of 1s and 0s
// 3. Loop thru the digits, summing the 1s digits, and changing the 
//    negative/positve polarity **at each step** when a 0 is encounterd
//
// @param {Int} -> index the 0-based index of the infinity series
// @return -> the value in the infinity series at the given index.
//
function norgardInteger(index) {
	var binaryDigits = index.toString(2).split("").map(bit => parseInt(bit));

	return binaryDigits.reduce((integer, digit) => {
		return (digit === 1)? integer+=1 : integer*= -1;
	}, 0);
}

// Generate an Elementary Cellular Automaton class
// This is an one dimensional array (collection of cells) with states
// that are either dead or alive (0/1). By following a set of rules the
// next generation is calculated for every cell based on its neighbouring
// cells. Invoke the next() method to iterate the generations. Set the first
// generation with the feed() method (usually random values work quite well)
// Change the rule() based on a decimal number or an array of digits
// 
// Some interesting rules to try: 
// 3 5 9 18 22 26 30 41 45 54 60 73 90 105 
// 106 110 120 122 126 146 150 154 181
// 
// @constructor {length, rule} -> generate the CA
// @get state -> return the current generations as array
// @get table -> return the table of rules
// @method rule() -> set the rule based on decimal number or array
// @method feed() -> feed the initial generation with an array
// @method next() -> generate the next generation and return
// 
class Automaton {
	constructor(l=8, r=110){
		// the size of the population for each generation
		this._length = Math.max(3, l);
		// the state of the current generation
		this._state = new Array(this._length).fill(0);
		// the rule (will be converted to binary representation)
		this._rule = this.ruleToBinary(r).split('');
		// the rule table for lookup
		this._table = this.binaryToTable(this._rule);
	}
	get state(){
		// return the current state of the Automaton
		return this._state;
	}
	get table(){
		// return the object of rules
		return this._table;
	}
	rule(a){
		// set the rule for the automaton
		if (Array.isArray(a)){
			// when the argument is an array of 1's and 0's convert to table
			if (a.length != 8){
				console.log('Warning: rule() must have length 8 to correctly represent all possible states');
			}
			let r = a.slice(0, 8).join('').padStart(8, '0');
			// this._rule = parseInt(r, 2);
			this._table = this.binaryToTable(r);
		} else if (typeof a === 'object'){
			// when the argument is an object store it directly in table
			if (Object.keys(a).length != 8){
				console.log('Warning: rule() must have 8 keys to correctly represent all possible states')
			}
			this._rule = undefined;
			this._table = { ...a };
		} else {
			if (isNaN(Number(a))){
				console.error('Error: rule() expected a number but received:', a);
			} else {
				// when the argument is a number
				let b = this.ruleToBinary(Number(a));
				this._rule = a;
				this._table = this.binaryToTable(b);
			}
		}
	}
	feed(a){
		// feed the automaton with an initial array
		if (!Array.isArray(a) || a.length < 3){
			console.log('Warning: feed() expected array of at least length 3 but received:', typeof a, 'with length:', (Array.isArray(a)?a:[a]).length);
		} else {
			this._state = a;
			this._length = a.length;
		}
	}
	next(){
		// calculate the next generation from the rules
		let n = [];
		let l = this._length;
		// for every cell in the current state, check the neighbors
		for (let i = 0; i < l; i++){
			let left = this._state[((i-1 % l) + l) % l];
			let right = this._state[((i+1 % l) + l) % l];
			// join 3 cells to string and lookup next value from table
			n[i] = this._table[[left, this._state[i], right].join('')];
		}
		// store in state and return result as array
		return this._state = n;
	}
	ruleToBinary(r){
		// convert a rule number to binary sequence 
		return r.toString(2).padStart(8, '0');
	}
	binaryToTable(r){
		// store binary sequence in lookup table
		let c = {};
		for (let i = 0; i < 8; i++){
			c[(7-i).toString(2).padStart(3, '0')] = Number(r[i]);
		}
		return c;
	}
}
exports.Automaton = Automaton;
},{"./transform":52,"./utility":54,"bignumber.js":23}],50:[function(require,module,exports){
//=======================================================================
// gen-stochastic.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Stochastic and Probablity Theory algorithms to generate 
// various forms of random 
// number sequences
// 
// credits:
// - Gratefully using the seedrandom package by David Bau
//=======================================================================

// require Generative methods
const { spread } = require('./gen-basic.js');
const { lookup } = require('./transform.js');
const { fold, size, toArray } = require('./utility');
const { change } = require('./statistic');

// require seedrandom package
let seedrandom = require('seedrandom');

// local pseudorandom number generator and seed storage
let rng = seedrandom();
let _seed = 0;

// Set the seed for all the Random Number Generators. 
// 0 sets to unpredictable seeding
// 
// @param {Number/String} -> the seed
// @return {Void}
// 
function seed(v=0){
	if (v === 0 || v === null || v === undefined){
		rng = seedrandom();
		_seed = 0;
	} else {
		rng = seedrandom(v);
		_seed = v;
	}
	// also return the seed that has been set
	return getSeed();
}
exports.seed = seed;

// Return the seed that was set
//
// @return {Value} -> the seed
//
function getSeed(){
	return _seed;
}
exports.getSeed = getSeed;

// generate a list of random float values 
// between a certain specified range (excluding high val)
// 
// @param {Int} -> number of values to output
// @param {Number} -> minimum range (optional, default=0)
// @param {Number} -> maximum range (optional, defautl=1)
// @return {Array}
// 
function randomFloat(len=1, lo=1, hi=0){
	// swap if lo > hi
	if (lo > hi){ var t=lo, lo=hi, hi=t; }
	// len is positive and minimum of 1
	len = size(len);

	var arr = [];
	for (var i=0; i<len; i++){
		arr[i] = (rng() * (hi - lo)) + lo;
	}
	return arr;
}
exports.randomFloat = randomFloat;
exports.randomF = randomFloat;

// generate a list of random integer values 
// between a certain specified range (excluding high val)
// 
// @param {Int} -> number of values to output
// @param {Number} -> minimum range (optional, default=0)
// @param {Number} -> maximum range (optional, defautl=2)
// @return {Array}
// 
function random(len=1, lo=12, hi=0){
	var arr = randomFloat(len, lo, hi);
	return arr.map(v => Math.floor(v));
}
exports.random = random;

// generate a list of random float values but the next random 
// value is within a limited range of the previous value generating
// a random "drunk" walk, also referred to as brownian motion.
// Inspired by the [drunk]-object in MaxMSP
// 
// @param {Int} -> length of output array
// @param {Number} -> step range for next random value
// @param {Number} -> minimum range (optional, default=null)
// @param {Number} -> maximum range (optional, default=null)
// @param {Number} -> starting point
// @param {Bool} -> fold between lo and hi range
// @return {Array}
// 
function drunkFloat(len=1, step=1, lo=1, hi=0, p, bound=true){
	// swap if lo > hi
	if (lo > hi){ var t=lo, lo=hi, hi=t; }
	p = (!p)? (lo+hi)/2 : p;
	// len is positive and minimum of 1
	len = size(len);

	var arr = [];
	for (var i=0; i<len; i++){
		// direction of next random number (+ / -)
		var dir = (rng() > 0.5) * 2 - 1;
		// prev + random value * step * direction
		p += rng() * step * dir;

		if (bound && (p > hi || p < lo)){
			p = fold(p, lo, hi);
		}
		arr.push(p);
	}
	return arr;
}
exports.drunkFloat = drunkFloat;
exports.drunkF = drunkFloat;
exports.walkFloat = drunkFloat;

// generate a list of random integer values but the next random 
// value is within a limited range of the previous value generating
// a random "drunk" walk, also referred to as brownian motion.
// Inspired by the [drunk]-object in MaxMSP
// 
// @param {Int} -> length of output array
// @param {Number} -> step range for next random value
// @param {Number} -> minimum range (optional, default=null)
// @param {Number} -> maximum range (optional, default=null)
// @param {Number} -> starting point
// @param {Bool} -> fold between lo and hi range
// @return {Array}
// 
function drunk(len=1, step=1, lo=12, hi=0, p, bound=true){
	let arr = drunkFloat(len, step, lo, hi, p, bound);
	return arr.map(v => Math.floor(v));
}
exports.drunk = drunk;
exports.walk = drunk;

// generate a list of random integer values 0 or 1
// like a coin toss, heads/tails
// 
// @param {Int} -> number of tosses to output
// @return {Array}
// 
function coin(len=1){
	var arr = randomFloat(len, 0, 2);
	return arr.map(v => Math.floor(v));
}
exports.coin = coin;

// generate a list of random integer values 1 to 6
// like the roll of a dice
// 
// @param {Int} -> number of tosses to output
// @param {Int} -> sides of the die (optional, default=6)
// @return {Array}
// 
function dice(len=1, sides=6){
	var arr = randomFloat(len, 1, sides+1);
	return arr.map(v => Math.floor(v));
}
exports.dice = dice;

// Generate random clave patterns. Outputs a binary list as rhythm, 
// where 1's represent onsets and 0's represent rests.
// 
// @param {Int} -> output length of rhythm (default=8)
// @param {Int} -> maximum gap between onsets (default=3)
// @param {Int} -> minimum gap between onsets (default=2)
// 
function clave(len=8, max=3, min=2){
	let arr = [];
	// set list length to minimum of 1
	len = size(len);

	// swap if lo > hi
	if (min > max){ var t=min, min=max; max=t; }
	// limit lower ranges
	min = Math.max(1, min);
	max = Math.max(min, max) + 1;

	let sum = 0;
	let rtm = [];
	// randomly generate list of gap intervals
	while (sum < len){
		let r = Math.floor(rng() * (max - min)) + min;
		rtm.push(r);
		sum += r;
	}
	// convert rhythmic "gaps" to binary pattern
	rtm.forEach((g) => {
		for (let i=0; i<g; i++){
			arr.push(!i ? 1 : 0);
		}
	});
	return arr.slice(0, len);
}
exports.clave = clave;

// shuffle a list, based on the Fisher-Yates shuffle algorithm
// by Ronald Fisher and Frank Yates in 1938
// The algorithm has run time complexity of O(n)
// 
// @param {Array} -> array to shuffle
// @return {Array}
// 
function shuffle(a=[0]){
	// slice array to avoid changing the original array
	var arr = a.slice();
	for (var i=arr.length-1; i>0; i-=1) {
		var j = Math.floor(rng() * (i + 1));
		var t = arr[i];
		arr[i] = arr[j];
		arr[j] = t;
	}
	return arr;
}
exports.shuffle = shuffle;
exports.scramble = shuffle;

// Generate a list of 12 semitones
// then shuffle the list based on a random seed
// 
// @return {Array} -> twelve-tone series
// 
function twelveTone(){
	return shuffle(spread(12));
}
exports.twelveTone = twelveTone;
exports.toneRow = twelveTone;

// Generate a list of unique random integer values between a 
// certain specified range (excluding high val). An 'urn' is filled
// with values and when one is picked it is removed from the urn. 
// If the outputlist is longer then the range, the urn refills when
// empty. On refill it is made sure no repeating value can be picked.
// Inspired by the [urn]-object in MaxMSP
// 
// @param {Int} -> number of values to output
// @param {Number} -> maximum range (optional, default=12)
// @param {Number} -> minimum range (optional, defautl=0)
// @return {Array} -> random values
// 
function urn(len=1, hi=12, lo=0){
	// swap if lo > hi
	if (lo > hi){ var t=lo, lo=hi, hi=t; }
	// generate array with values and pick
	return pick(len, spread(hi-lo, lo, hi));
}
exports.urn = urn;

// Choose random items from an array provided
// The default array is an array of 0 and 1
// 
// @param {Int} -> output length
// @param {Array} -> items to choose from
// @return {Array} -> randomly selected items
// 
function choose(len=1, a=[0, 1]){
	// if a is no Array make it an array
	a = toArray(a);
	// set the size to minimum of 1 or based on array length
	len = size(len);

	var arr = [];
	for (var i=0; i<len; i++){
		arr.push(a[Math.floor(rng()*a.length)]);
	}
	return arr;
}
exports.choose = choose;

// Pick random items from an array provided
// An 'urn' is filled with values and when one is picked it is removed 
// from the urn. If the outputlist is longer then the range, the urn 
// refills when empty. On refill it is made sure no repeating value
// can be picked.
// 
// @param {Int} -> output length
// @param {Array} -> items to choose from
// @return {Array} -> randomly selected items
// 
function pick(len=1, a=[0, 1]){
	// set the size to minimum of 1 or based on array length
	len = size(len);
	// fill the jar with the input
	// var jar = (!Array.isArray(a))? [a] : a;
	let jar = toArray(a);

	if (jar.length < 2){
		return new Array(len).fill(jar[0]);
	}
	// shuffle the jar
	let s = shuffle(jar);
	// value, previous, output-array
	let v, p, arr = [];	
	for (let i=0; i<len; i++){
		v = s.pop();
		if (v === undefined){
			s = shuffle(jar);
			v = s.pop();
			if (v === p) {
				v = s.pop();
				s.push(p);
			}
		}
		arr[i] = v;
		p = v;
	}
	return arr;
}
exports.pick = pick;

// expand an array based upon the pattern within an array
// the pattern is derived from the rate in change between values
// the newly generated values are selected randomly from the list
// of changes.
// 
// @param {Array} -> the array to expand
// @param {Number} -> the resulting array length
// @return {Array}
// 
function expand(a=[0, 0], l=0){
	a = toArray(a);
	l = size(l);
	// return a if output length is smaller/equal then input array
	if (l <= a.length){ return a; }
	// get the differences and pick the expansion options
	let p = change(a);
	let chg = pick(l-a.length, p);
	// empty output array and axiom for output
	let arr = a.slice();
	let acc = arr[arr.length-1];
	// accumulate the change and store in array
	for (let c=0; c<chg.length; c++){
		arr.push(acc += chg[c]);
	}
	return arr;
}
exports.expand = expand;
exports.extrapolate = expand;

// Initialize a Markov Chain Model (One of the simpelest forms of ML)
// A Markov chain is a stochastic model describing a sequence 
// of possible events in which the probability of each event depends 
// only on the state of the previous (multiple) events.
// 
// @get table -> return transition table from Markov
// @method clear() -> erase the transition table
// @method train() -> train the markov model
// 		@param {Array} -> array of values as training data
// @method seed() -> seed the random number generator (global RNG)
// 		@param {Value} -> any value as random seed (0 = unpredictable seed)
// @method state() -> set the initial value to start the chain
// @method next() -> generate the next value based state or set axiom
// @method chain() -> generate an array of values (default length=2)
// 
class MarkovChain {
	constructor(data){
		// transition probabilities table
		this._table = {};
		// train if dataset is provided
		if (data) { this.train(data) };
		// current state of markov chain
		this._state;
	}
	get table(){
		// output a copy of the table as an object
		return { ...this._table };
	}
	read(t){
		// read a markov chain table from a json file
		if (Array.isArray(t) || typeof t !== 'object'){
			return console.error(`Error: input is not a valid json formatted table. If your input is an array use train() instead.`);
		}
		this._table = t;
	}
	clear(){
		// empty the transition probabilities
		this._table = {};
	}
	train(a){
		if (!Array.isArray(a)){ 
			return console.error(`Error: train() expected array but received: ${typeof a}`);
		}
		// build a transition table from array of values
		for (let i=1; i<a.length; i++){
			if (!this._table[a[i-1]]) {
				this._table[a[i-1]] = [a[i]];
			} else {
				this._table[a[i-1]].push(a[i]);
			}
		}
	}
	seed(s){
		// deprecated, seed is now also be set for the global rng
		seed(s);
	}
	state(a){
		// set the state
		if (!this._table[a]){
            console.error(`Warning: ${a} is not part of transition table`);
		}
		this._state = a;
	}
	randomState(){
		let states = Object.keys(this._table);
		this._state = states[Math.floor(rng() * states.length)];
	}
	next(){
		// if the state is undefined or has no transition in table
		// randomly choose from all
		if (this._state === undefined || !this._table[this._state]){
			this.randomState();
		}
		// get probabilities based on state
		let probs = this._table[this._state];
		// select pseudorandomly next value
		this._state = probs[Math.floor(rng() * probs.length)];
		return this._state;
	}
	chain(l=2){
		// return an array of values generated with next()
		let c = [];
		for (let i=0; i<l; i++){
			c.push(this.next());
		}
		return c;
	}
}
exports.MarkovChain = MarkovChain;

// Initialize a Deep Markov Chain Model (with higher order n)
// 
// @get table -> return transition table from Markov
// @method clear() -> erase the transition table
// @method train() -> train the markov model
// 		@param {Array} -> array of values as training data
//		@param {Int+} -> order of markov analysis
// @method seed() -> seed the random number generator (global RNG)
// 		@param {Value} -> any value as random seed (0 = unpredictable seed)
// @method state() -> set the initial value to start the chain
// @method next() -> generate the next value based state or set axiom
// @method chain() -> generate an array of values (default length=2)
// 
class DeepMarkov {
	constructor(data){
		// transition probabilities table
		this._table = new Map();
		// train if dataset is provided
		if (data) { this.train(data) };
		// current state of markov chain
		this._state = '';
	}
	get table(){
		// return copy of object
		return new Map(JSON.parse(JSON.stringify(Array.from(this._table))));
	}
	clear(){
		// empty the transition probabilities
		this._table = new Map();
	}
	train(a, o=2){
		if (!Array.isArray(a)){ 
			return console.error(`Error: train() expected array but received: ${typeof a}`);
		}
		if (o < 1){
			return console.error(`Error: train() expected order greater then 1 but received ${o}`);
		}
		// build a transition table from array of values
		for (let i=0; i<(a.length-o); i++) {
			let slice = a.slice(i, i+o);
			let key = JSON.stringify(slice);

			let next = a[i+o];

			if (this._table.has(key)) {
				let arr = this._table.get(key);
				arr.push(next);
				this._table.set(key, arr);
			} else {
				this._table.set(key, [a[i+o]]);
			}
		}
	}
	seed(s){
		// deprecated, seed is now also be set for the global rng
		seed(s);
	}
	state(a){
		// stringify the state
		let s = JSON.stringify(a);
		// set the state
		if (!this._table.has(s)) {
			console.error(`Warning: ${a} is not part of transition table`);
		}
		this._state = s;
	}
	randomState() {
		let keys = Array.from(this._table.keys())
		this._state = keys[Math.floor(rng() * keys.length)]
	}
	next(){
        // if the state is undefined or has no transition in table
        // randomly choose from all
		if (this._state === undefined || !this._table.has(this._state)) {
			this.randomState();
		}
		// get probabilities based on state
		let probs = this._table.get(this._state);
		let newState = probs[Math.floor(rng() * probs.length)]

		// Now recreate a nice string representation
		let prefix = JSON.parse(this._state);
		prefix.shift();
		prefix.push(newState);
		this._state = JSON.stringify(prefix);

		return newState;
	}
	chain(l=2){
		// return an array of values generated with next()
		let c = [];
		for (let i=0; i<l; i++){
			c.push(this.next());
		}
		return c;
	}
}
exports.DeepMarkov = DeepMarkov;
exports.DeepMarkovChain = DeepMarkov;
},{"./gen-basic.js":48,"./statistic":51,"./transform.js":52,"./utility":54,"seedrandom":36}],51:[function(require,module,exports){
//=======================================================================
// statistic.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Statistical related methods and algorithms that can be helpful in
// analysis of number sequences, melodies, rhythms and more
//=======================================================================

const Mod = require('./transform');

const { maximum, minimum, flatten, toArray } = require('./utility');

// sort an array of numbers or strings. sorts ascending
// or descending in numerical and alphabetical order
// 
// @param {Array} -> array to sort
// @param {Int} -> sort direction (positive value is ascending)
// @return {Array} -> sorted array, object includes order-indeces
// 
function sort(a=[0], d=1){
	a = toArray(a);
	let arr;
	if (a.map(x => typeof x).includes('string')){
		arr = a.slice().sort();
	} else {
		arr = a.slice().sort((a,b) => { return a-b; })
	}
	if (d < 0){
		return arr.reverse();
	}
	return arr;
}
exports.sort = sort;

// Return the biggest value from an array
// 
// @param {NumberArray} -> input array
// @return {Number} -> biggest value
// 
exports.maximum = maximum;
exports.max = maximum;

// Return the lowest value from an array
// 
// @param {NumberArray} -> input array
// @return {Number} -> lowest value
// 
exports.minimum = minimum;
exports.min = minimum;

// Return the average (artihmetic mean value) from an array
// The mean is a measure of central tendency
// 
// @param {NumberArray} -> input array of n-numbers
// @param {Bool} -> enable/disable the deep flag for n-dim arrays (default=true)
// @return {Number} -> mean
// 
function mean(a=[0], d=true){
	if (!Array.isArray(a)) { return a; }
	if (d) { a = flatten(a); }

	let s = 0;
	for (let i in a){
		s += isNaN(a[i])? 0 : a[i];
	}
	return s / a.length;
}
exports.mean = mean;
exports.average = mean;

// Return the median (center value) from an array
// The median is a measure of central tendency
// If array is even number of values the median is the
// average of the two center values
// Ignores other datatypes then Number and Boolean
// 
// @param {NumberArray} -> input array of n-numbers
// @param {Bool} -> enable/disable the deep flag for n-dim arrays (default=true)
// @return {Number} -> median
// 
function median(a=[0], d=true){
	if (!Array.isArray(a)) { return a; }
	if (d) { a = flatten(a); }

	let arr = a.slice();
	if (arr.map(x => typeof x).includes('string')) { 
		arr = Mod.filterType(arr, ['number', 'boolean']);
	}
	arr = arr.sort((a,b) => { return a-b; });
	let c = Math.floor(arr.length/2);

	if (!(arr.length % 2)){
		return (arr[c] + arr[c-1]) / 2;
	}
	return arr[c];
}
exports.median = median;
exports.center = median;

// Returns the mode(s) (most common value) from an array
// The mode is a measure of central tendency
// Returns an array when multi-modal system
// 
// @param {NumberArray} -> input array of n-numbers
// @param {Bool} -> enable/disable the deep flag for n-dim arrays (default=true)
// @return {Number/Array} -> the mode or modes
//
function mode(a=[0], d=true){
	if (!Array.isArray(a)) { return a; }
	if (d) { a = flatten(a); }

	let arr = a.slice().sort((a,b) => { return a-b; });

	let amount = 1;
	let streak = 0;
	let modes = [];

	for (let i=1; i<arr.length; i++){
		if (arr[i-1] != arr[i]){
			amount = 0;
		}
		amount++;
		if (amount > streak){
			streak = amount;
			modes = [arr[i]];
		} else if (amount == streak){
			modes.push(arr[i]);
		}
	}
	return modes;
}
exports.mode = mode;
exports.common = mode;

// Compare two arrays recursively and if all values
// of the array and subarrays are equal to eachother
// return a true boolean
// 
// @params {Array} -> compare array1
// @params {Array} -> compare array2
// @return {Bool} -> true or false
// 
function compare(a1=[0], a2){
	a1 = toArray(a1);
	a2 = toArray(a2);
	if (a1.length !== a2.length){
		return false;
	}
	for (let i in a1){
		if (Array.isArray(a1[i])){
			return compare(a1[i], a2[i]);
		} else if (a1[i] !== a2[i]){
			return false;
		}
	}
	return true;
}
exports.compare = compare;
// exports.equal = compare; (deprecated for equal in utility operator)

// Return the difference between every consecutive value in an array
// With melodic content from a chromatic scale this can be seen as
// a list of intervals that, when followed from the same note, results
// in the same melody.
// 
// @param {Array} -> array to calculate from
// @param {Bool} -> returns diff between first and last (optional, default=false)
// @return {Array} -> list of changes
// 
function change(a=[0, 0], l=false){
	if (a.length < 2 || !Array.isArray(a)){
		return [0];
	}
	let len = a.length;
	let arr = [];
	for (let i=1; i<len; i++){
		arr.push(a[i] - a[i-1]);
	}
	// optionally also return diff from first and last value
	if (l){ arr.push(a[0] - a[a.length-1]); }
	return arr;
}
exports.change = change;
exports.delta = change;
exports.difference = change;
exports.diff = change;

},{"./transform":52,"./utility":54}],52:[function(require,module,exports){
//=======================================================================
// transform.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Basic methods that can transform number sequences
// 
// TODO:
// - make invert() work with note-values 'c' etc.
// 
// credits:
// - Many functions are based on Laurie Spiegel's suggestion to 
// "extract a basic "library" consisting of the most elemental 
// transformations which have consistently been successfully used on 
// musical patterns, a basic group of "tried-and-true" musical 
// manipulations.", in Manipulation of Musical Patterns (1981)
//=======================================================================

// require the Utility methods
// const Rand = require('./gen-stochastic');
const { sort } = require('./statistic');
const { flatten, add, max, min, lerp, toArray, size } = require('./utility');

// Duplicate an array multiple times,
// optionaly add an offset to every value when duplicating
// Also works with 2-dimensonal arrays
// If string the values will be concatenated
// 
// @param {Array} -> array to clone
// @param {Int, Int2, ... Int-n} -> amount of clones with integer offset
// 								 -> or string concatenation
// 
function clone(a=[0], ...c){
	a = toArray(a);
	// flatten clone array if multi-dimensional
	if (!c.length) { 
		return a;
	} else { 
		c = flatten(c); 
	}
	let arr = [];
	for (let i=0; i<c.length; i++){
		arr = arr.concat(a.map(v => add(v, c[i])));
	}
	return arr;
}
exports.clone = clone;

// combine arrays into one array
// multiple arrays as arguments possible
// 
// @params {Array0, Array1, ..., Array-n} -> Arrays to join
// @return {Array}
// 
function combine(...args){
	if (!args.length){ return [0]; }
	let arr = [];
	for (let i=0; i<args.length; i++){
		arr = arr.concat(args[i]);
	}
	return arr;
}
exports.combine = combine;
exports.join = combine;

// duplicate an array a certain amount of times
// 
// @param {Array} -> array to duplicate
// @param {Int} -> amount of output duplicates (optional, default=2)
// @return {Array}
// 
function duplicate(a=[0], d=2){
	let arr = [];
	for (let i=0; i<Math.max(1,d); i++){
		arr = arr.concat(a);
	}
	return arr;
}
exports.duplicate = duplicate;
exports.copy = duplicate;
exports.dup = duplicate;

// pad an array with zeroes (or other values)
// the division determines the amount of values per bar
// total length = bars * div
//
// param {Array} -> Array to use every n-bars
// param {Int} -> amount of bars (optional, default=1)
// param {Int} -> amount of values per bar (optional, default=16)
// param {Value} -> padding argument (optional, default=0)
// param {Number} -> shift the output by n-divs (optional, default=0)
// return {Array}
//
function every(a=[0], bars=1, div=16, pad=0, shift=0){
	let len = Math.floor(bars * div);
	let sft = Math.floor(shift * div);
	return padding(a, len, pad, sft);
}
exports.every = every;

// Import from the Util.flatten
// flatten a multidimensional array. Optionally set the depth
// for the flattening
//
exports.flatten = flatten;
exports.flat = flatten;

// similar to every(), but instead of specifying bars/divisions
// this method allows you to specify the exact length of the array
// and the shift is not a ratio but in whole integer steps
//
// param {Array} -> Array to use every n-bars
// param {Int} -> Array length output
// param {Number} -> shift the output by n-divs (optional, default=0)
// param {Value} -> padding argument (optional, default=0)
// return {Array}
//
function padding(a=[0], length=16, pad=0, shift=0){
	a = toArray(a);	
	length = size(length);
	
	let len = length - a.length;
	if (len < 1) {
		return a.slice(0, length);
	}
	let arr = new Array(len).fill(pad);
	return rotate(a.concat(arr), shift);
}
exports.padding = padding;
exports.pad = padding;

// filter one or multiple values from an array
// 
// @param {Array} -> array to filter
// @param {Number/String/Array} -> values to filter
// @return (Array} -> filtered array
// 
function filter(a=[0], f){
	let arr = (Array.isArray(a))? a.slice() : [a];
	f = toArray(f);

	for (var i=0; i<f.length; i++){
		let index = arr.indexOf(f[i]);
		while (index >= 0){
			arr.splice(index, 1);
			index = arr.indexOf(f[i]);
		}
	}
	return arr;
}
exports.filter = filter;

// filter one or multiple datatypes from an array
// In this case the input type is the type that is output
// 
// @param {Array} -> array to filter
// @param {String/Array} -> types to filter (default = number)
// @return (Array} -> filtered array
// 
function filterType(a=[0], t='number'){
	a = (Array.isArray(a))? a.slice() : [a];
	t = toArray(t);

	let types = a.map(x => typeof x);	
	let arr = [];
	for (let i in t){
		let index = types.indexOf(t[i]);
		while (index >= 0){
			arr.push(a[index]);
			a.splice(index, 1);
			types.splice(index, 1);
			index = types.indexOf(t[i]);
		}
	}
	return arr;
}
exports.filterType = filterType;
exports.tFilter = filterType;

// invert a list of values by mapping the lowest value
// to the highest value and vice versa, flipping everything
// in between. 
// Second optional argument sets the center to flip values against. 
// Third optional argument sets a range to flip values against.
// 
// @param {Array} -> array to invert
// @param {Int} -> invert center / low range (optional)
// @param {Int} -> high range (optional)
// @return {Array}
// 
function invert(a=[0], lo, hi){
	a = toArray(a);

	if (lo === undefined){
		hi = max(a);
		lo = min(a);
	} else if (hi === undefined){
		hi = lo;
	}
	return a.slice().map(v => {
		if (Array.isArray(v)){
			return invert(v, lo, hi);
		}
		return hi - v + lo;
	});
}
exports.invert = invert;

// interleave two or more arrays
// 
// @param {Array0, Array1, ..., Array-n} -> arrays to interleave
// @return {Array}
//  
function lace(...args){
	if (!args.length){ return [0]; }
	var l = 0;
	for (let i=0; i<args.length; i++){
		args[i] = toArray(args[i]);
		l = Math.max(args[i].length, l);
	}
	var arr = [];
	for (var i=0; i<l; i++){
		for (var k=0; k<args.length; k++){
			let v = args[k][i];
			if (v !== undefined){ arr.push(v); }
		}
	}
	return arr;
}
exports.lace = lace;
exports.zip = lace;

// Build an array of items based on another array of indeces 
// The values are wrapped within the length of the lookup array
// Works with n-dimensional arrays by applying a recursive lookup
// 
// @param {Array} -> Array with indeces to lookup
// @param {Array} -> Array with values returned from lookup
// @return {Array} -> Looked up values
// 
function lookup(idx=[0], arr=[0]){
	idx = toArray(idx);
	arr = toArray(arr);
	let a = [];
	let len = arr.length;
	for (let i in idx){
		if (Array.isArray(idx[i])){
			a.push(lookup(idx[i], arr));
		} else {
			if (!isNaN(idx[i])){
				let look = (Math.floor(idx[i]) % len + len) % len;
				a.push(arr[look]);
			}
		}
	}
	return a;
}
exports.lookup = lookup;

// merge all values of two arrays on the same index
// into a 2D array. preserves length of longest list
// flattens multidimensional arrays to 2 dimensions on merge
// 
// @params {Array0, Array1, ..., Array-n} -> Arrays to merge
// @return {Array}
// 
function merge(...args){
	if (!args.length){ return [0]; }
	let l = 0;
	for (let i=0; i<args.length; i++){
		args[i] = toArray(args[i]);
		l = Math.max(args[i].length, l);
	}
	let arr = [];
	for (let i=0; i<l; i++){
		let a = [];
		for (let k=0; k<args.length; k++){
			let v = args[k][i];
			if (v !== undefined){ 
				if (Array.isArray(v)) a.push(...v);
				else a.push(v);
			}
		}
		arr[i] = a;
	}
	return arr;
}
exports.merge = merge;

// reverse an array and concatenate to the input
// creating a palindrome of the array
// 
// @param {Array} -> array to make palindrome of
// @param {Bool} -> no-double flag (optional, default=false)
// @return {Array}
// 
function palindrome(arr, noDouble=false){
	if (arr === undefined){ return [0] };
	if (!Array.isArray(arr)){ return [arr] };
	
	let rev = arr.slice().reverse();
	if (noDouble){
		rev = rev.slice(1, rev.length-1);
	}
	return arr.concat(rev);
}
exports.palindrome = palindrome;
exports.palin = palindrome;
exports.mirror = palindrome;

// repeat the values of an array n-times
// Using a second array for repeat times iterates over that array
// 
// @param {Array} -> array with values to repeat
// @param {Int/Array} -> array or number of repetitions per value
// @return {Array}
// 
function repeat(arr=[0], rep=1){
	arr = toArray(arr);
	rep = toArray(rep);
	
	let a = [];
	for (let i in arr){
		let r = rep[i % rep.length];
		r = (isNaN(r) || r < 0)? 0 : r;
		for (let k=0; k<r; k++){
			a.push(arr[i]);
		}
	}
	return a;
}
exports.repeat = repeat;

// reverse the order of items in an Array
// 
// @param {Array} -> array to reverse
// @return {Array}
// 
function reverse(a=[0]){
	if (!Array.isArray(a)){ return [a]; }
	return a.slice().reverse();
}
exports.reverse = reverse;

// rotate the position of items in an array 
// 1 = direction right, -1 = direction left
// 
// @param {Array} -> array to rotate
// @param {Int} -> steps to rotate (optional, default=0)
// @return {Array}
// 
function rotate(a=[0], r=0){
	if (!Array.isArray(a)){ return [a]; }
	var l = a.length;
	var arr = [];
	for (var i=0; i<l; i++){
		// arr[i] = a[Util.mod((i - r), l)];
		arr[i] = a[((i - r) % l + l) % l];
	}
	return arr;
}
exports.rotate = rotate;

// placeholder for the sort() method found in 
// statistic.js
// 
exports.sort = sort;

// slice an array in one or multiple parts 
// slice lengths are determined by the second argument array
// outputs an array of arrays of the result
//
// @params {Array} -> array to slice
// @params {Number|Array} -> slice points
// @return {Array}
// 
function slice(a=[0], s=[1], r=true){
	a = toArray(a);
	s = toArray(s);

	let arr = [];
	let _s = 0;
	for (let i=0; i<s.length; i++){
		if (s[i] > 0){
			let _t = _s + s[i];
			arr.push(a.slice(_s, _t));
			_s = _t;
		}
	}
	if (r){
		arr.push(a.slice(_s, a.length));
	}
	return arr;
}
exports.slice = slice;

// Similar to slice in that it also splits an array
// excepts slice recursively splits until the array is
// completely empty 
// 
// @params {Array} -> array to split
// @params {Number/Array} -> split sizes to iterate over
// @return {Array} -> 2D array of splitted values
// 
function split(a=[0], s=[1]){
	a = toArray(a);
	s = toArray(s);

	return _split(a, s);
}
exports.split = split;

function _split(a, s){
	if (s[0] > 0){
		let arr = a.slice(0, s[0]);
		let res = a.slice(s[0], a.length);

		if (res.length < 1){ return [arr]; }
		return [arr, ...split(res, rotate(s, -1))];
	}
	return [...split(a, rotate(s, -1))];
}

// spray the values of one array on the 
// places of values of another array if 
// the value is greater than 0
// 
// param {Array} -> array to spread
// param {Array} -> positions to spread to
// return {Array}
// 
function spray(values=[0], beats=[0]){
	values = toArray(values);
	beats = toArray(beats);

	var arr = beats.slice();
	var c = 0;
	for (let i in beats){
		if (beats[i] > 0){
			arr[i] = values[c++ % values.length];
		}
	}
	return arr;
}
exports.spray = spray;

// stretch (or shrink) an array of numbers to a specified length
// interpolating the values to fill in the gaps. 
// TO-DO: Interpolations options are: none, linear, cosine, cubic
// 
// param {Array} -> array to stretch
// param {Array} -> outputlength of array
// param {String/Int} -> interpolation function (optional, default=linear)
// 
function stretch(a=[0], len=1, mode='linear'){
	a = toArray(a);
	if (len < 2){ return a; }
	len = size(len);
	
	let arr = [];
	let l = a.length;
	for (let i=0; i<len; i++){
		// construct a lookup interpolation position for new array
		let val = i / (len - 1) * (l - 1);
		// lookup nearest neighbour left/right
		let a0 = a[Math.max(Math.trunc(val), 0)];
		let a1 = a[Math.min(Math.trunc(val)+1, l-1) % a.length];

		if (mode === 'none' || mode === null || mode === false){
			arr.push(a0);
		} else {
			// interpolate between the values according to decimal place
			arr.push(lerp(a0, a1, val % 1));
		}
	}
	return arr;
}
exports.stretch = stretch;

// filter duplicate items from an array
// does not account for 2-dimensional arrays in the array
// 
// @param {Array} -> array to filter
// @return {Array}
// 
function unique(a=[0]){
	return [...new Set(toArray(a))];
}
exports.unique = unique;

},{"./statistic":51,"./utility":54}],53:[function(require,module,exports){
//==============================================================================
// translate.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Methods to translate between midi, note-names, intervals and more
// 
// credits:
// - Using the amazing Tonal.js package by @danigb for various functions
//==============================================================================

// require API's
const { Note, Scale } = require('@tonaljs/tonal');
const { Chord } = require('@tonaljs/tonal');
const { Progression } = require('@tonaljs/tonal');

// require Scale Mappings
// const Scales = require('../data/scales.json');
const ToneSet = require('../data/tones.json');
const chromaSet = { c:0, d:2, e:4, f:5, g:7, a:9, b:11 };

const { unique } = require('./transform');
const { add, wrap, multiply, toArray } = require('./utility');

// create a mapping list of scales for 12-TET from Tonal
let Scales = {};

Scale.names().forEach((s) => {
	let scl = Scale.get(s);
	let name = scl.name.replace(/\s+/g, '_').replace(/[#'-]+/g, '');
	let chroma = scl.chroma.split('').map(x => Number(x));

	// rename aeolian to minor
	name = (name === 'aeolian')? 'minor' : name;

	let map = [];
	for (let i=0; i<chroma.length; i++){
		if (!chroma[i]){
			map.push(map[map.length-1]);
			continue;
		}
		map.push(i);
	}
	Scales[name] = map;
});

// global settings stored in object
var notation = {
	"scale" : "chromatic",
	"root" : "c",
	"rootInt" : 0,
	"map" : Scales["chromatic"],
	"bpm" : 120,
	"measureInMs" : 2000
}

// Return a dictionary with all the notational preferences:
// scale, root, map, bpm, measureInMs
// 
// @return -> Dictionary object
// 
function getSettings(){
	return { ...notation };
}
exports.getSettings = getSettings;

// Set the tempo to use for translating between values, default = 100. 
// Also calculates the length of a 4/4 measure in milliseconds
// 
// @param {Number} -> the tempo in Beats/Minute (BPM)
// @return {Number} -> the tempo in Beats/Minute (BPM)
// 
function setTempo(t=100){
	if (Array.isArray(t)){
		t = t[0];
	}
	notation.bpm = Math.max(1, Number(t));
	notation.measureInMs = 60000.0 / notation.bpm * 4;
	return getTempo();
}
exports.setTempo = setTempo;
exports.setBPM = setTempo;

// Get the current used tempo
// 
// @return {Number} -> tempo in Beats/Minute (BPM)
// 
function getTempo(){
	return getSettings().bpm;
}
exports.getTempo = getTempo;
exports.getBPM = getTempo;

// Set the scale to use for mapping integer sequences to
// 
// @param {String} -> scale name
// @param {Int/String} -> root of the scale (optional, default=c)
// @return {Object} -> the scale, root and rootInt
// 
function setScale(s="chromatic", r){
	if (Scales[s]){
		notation.scale = s;
		if (r !== undefined) { setRoot(r); }
		notation.map = Scales[s];
	}
	return getScale();
}
exports.setScale = setScale;

// returns the scale and root as object
// 
// @return {Object} -> the scale, root and rootInt
// 
function getScale(){
	return { 
		"scale" : getSettings().scale, 
		"root" : getSettings().root,
		"rootInt" : getSettings().rootInt,
		"mapping" : getSettings().map
	};
}
exports.getScale = getScale;

// Set the root of a scale to use for mapping integer sequences
// 
// @param {Int/String} -> root of the scale (optional, default=c)
// @return {Object} -> the scale, root and rootInt
// 
function setRoot(r='c'){
	if (!isNaN(Number(r))){
		notation.rootInt = Math.floor(r);
		notation.root = Note.pitchClass(Note.fromMidi(notation.rootInt));
	} 
	// else if (r in ToneSet){
	// 	notation.rootInt = chromaToRelative(r);
	// 	// notation.rootInt = ToneSet[r];
	// 	notation.root = r;
	// } else {
	// 	console.log('not a valid root');
	// }
	else {
		notation.rootInt = chromaToRelative(r);
		// notation.rootInt = ToneSet[r];
		notation.root = r;
	}
	return getScale();
}
exports.setRoot = setRoot;

// returns the root of the scale as String and integer
// 
// @return {Object} -> the scale and root
// 
function getRoot(){
	return { "root" : getSettings().root, "rootInt" : getSettings().rootInt };
}
exports.getRoot = getRoot;

/* WORK IN PROGRESS
// set a custom mapping for a non existing scale
// 
// @params {Array} -> array of length 12 containing semitones
// @return {Void}
// 
function setMapping(a){
	if (!Array.isArray(a) || a.length < 12){
		console.error("not an array or not long enough");
		a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	}
	notation.map = a.slice(0, 12);
	// a = (a !== undefined)? a : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
}
exports.setMapping = setMapping;*/

// returns an array of all available scale names
// 
// @return {Array} -> scale names
// 
function scaleNames(){
	return Object.keys(Scales).sort();
}
exports.scaleNames = scaleNames;
exports.getScales = scaleNames;

/* WORK IN PROGRESS
// search scales based on an array of intervals
// 
// @param {Array|String} -> array of intervals
// @return {Object} -> possible scales
// 
function searchScales(iv){
	iv = (Array.isArray(iv))? iv : [iv];

	let names = scaleNames();
	let scales = names.map(x => Scl.intervals(x));
	let arr = [];
	for (let n in names){
		let includes = 0;
		for (let i in iv){
			includes += scales[n].includes(iv[i]);
		}
		if (includes == iv.length){
			arr.push({ "scale" : names[n], "intervals" : scales[n]});
		}
	}
	console.log(arr);
}
exports.searchScales = searchScales;*/

// Convert a midi value to a note name (60 => C4)
// 
// @param {Number/Array} -> midi values to convert
// @return {String/Array} -> note name
// 
function midiToNote(a=60){
	if (!Array.isArray(a)){
		return Note.fromMidi(a).toLowerCase();
	}
	return a.map(x => midiToNote(x));
}
exports.midiToNote = midiToNote;
exports.mton = midiToNote;

// Convert a midi value to a frequency (60 => 261.63 Hz)
// With default equal temperament tuning A4 = 440 Hz
// Adjust the tuning with optional second argument
// Adjust the amount of notes per octave (12-TET, 5-TET) with third argument
// Adjust the center c4 midi value with optional fourth argument
// 
// @param {Number/Array} -> midi values to convert
// @param {Number} -> tuning
// @param {Number} -> octave division
// @return {Number/Array} -> frequency in Hz
// 
function midiToFreq(a=48, t=440, n=12, c=69){
	if (!Array.isArray(a)){
		return Math.pow(2, (a - c) / n) * t;
	}
	return a.map(x => midiToFreq(x, t, n, c));
}
exports.midiToFreq = midiToFreq;
exports.mtof = midiToFreq;

// Convert a frequency to closest midi note (261.62 Hz => 60)
// With default equal temperament tuning A4 = 440 Hz
// Set the detune flag to return te exact floating point midi value
// 
// @param {Number/Array} -> frequency value
// @param {Number/Array} -> detune precision value (default=false)
// @return {Number/Array} -> midi note
// 
function freqToMidi(a=261, d=false){
	if (!Array.isArray(a)){
		let f = Math.log(a / 440) / Math.log(2) * 12 + 69;
		if (!d) {
			return Math.round(f);
		}
		return f;
	}
	return a.map(x => freqToMidi(x, d));
}
exports.freqToMidi = freqToMidi;
exports.ftom = freqToMidi;

// Convert a frequency to closest note name (261.62 Hz => 'c4')
// With default equal temperament tuning A4 = 440 Hz
// 
// @param {Number/Array} -> frequency value
// @return {Number/Array} -> midi note
// 
function freqToNote(a=261){
	return midiToNote(freqToMidi(a));
}
exports.freqToNote = freqToNote;
exports.fton = freqToNote;

// Convert a pitch name to a midi value (C4 => 60)
// 
// @param {String/Array} -> pitch name to convert
// @return {Number/Array} -> midi value
// 
function noteToMidi(a='c4'){
	if (!Array.isArray(a)){
		return Note.midi(a);
	}
	return a.map(x => noteToMidi(x));
}
exports.noteToMidi = noteToMidi;
exports.ntom = noteToMidi;

// Convert a pitch name to a frequency (C4 => 261.63 Hz)
// With default equal temperament tuning A4 = 440 Hz
// 
// @param {String/Array} -> pitch name to convert
// @return {Number/Array} -> frequency in Hz
// 
function noteToFreq(a='c4'){
	if (!Array.isArray(a)){
		return Note.freq(a);
	}
	return a.map(x => noteToFreq(x));
}
exports.noteToFreq = noteToFreq;
exports.ntof = noteToFreq;

// Convert a chromagram pitch class to a relative note number
// 
// @param {String/Array} -> pitchclass names to convert
// @return {Number/Array} -> midi note number
// 
function chromaToRelative(c='c'){
	if (!Array.isArray(c)){
		let m = c.toLowerCase().match(/^[a-g]/);
		let v = 0;
		if (m){
			v = chromaSet[m[0]];
		} else {
			console.log(`ctor(): '${c}' is not a valid chroma value`);
			return 0;
		}
		let a = c.split('').slice(1);
		a.forEach((a) => {
			switch(a) {
				case '#': v += 1; break;
				case 'b': v -= 1; break;
				case 'x': v += 2; break;
				case '-': v -= 12; break;
				case '+': v += 12; break;
			}
		});
		return v;
	}
	return c.map(x => chromaToRelative(x));
}
exports.chromaToRelative = chromaToRelative;
exports.ctor = chromaToRelative;

// Convert a list of relative semitone intervals to midi
// provide octave offset with second argument. Octave offset
// follows midi octave convention where 3 is 48, 4 is 60 etc.
// 
// @param {Number/Array} -> relative
// @param {Number/String} -> octave (optional, default=4)
// @return {Number/Array}
// 
function relativeToMidi(a=0, o=4){
	if (!Array.isArray(a)){
		o = (typeof o === 'string')? Note.midi(o) : (o + 1) * 12;
		return a + o;
	}
	return a.map(x => relativeToMidi(x, o));
}
exports.relativeToMidi = relativeToMidi;
exports.rtom = relativeToMidi;

// Convert a list of semitone intervals to frequency
// provide octave offset
// 
// @param {Number/Array} -> semitones
// @param {Number} -> octave (optional, default=4)
// @return {Number/Array}
// 
function relativeToFreq(a=0, o=4){
	return midiToFreq(relativeToMidi(a, o));
}
exports.relativeToFreq = relativeToFreq;
exports.rtof = relativeToFreq;

// Map a list of relative semitone values to the selected
// scale set with setScale(). Preserves detuning when a 
// midi floating point value is used.
// Also offsets the values with the root note selected
// 
// @params {Array/Number} -> Array of relative semitones
// @return {Array/Number} -> mapped to scale
// 
function mapToScale(a=[0]){
	if (!Array.isArray(a)) {
		// detuning float
		let d = a - Math.floor(a);
		// selected semitone
		let s = Math.floor(((a % 12) + 12) % 12);
		// octave offset
		let o = Math.floor(a / 12) * 12;
		return notation.map[s] + o + d + notation.rootInt;
	}
	return a.map(x => mapToScale(x));
}
exports.mapToScale = mapToScale;
exports.toScale = mapToScale;

// Map an array of relative semitone intervals to scale and 
// output in specified octave as midi value
// 
// @param {Array/Int} -> semitone intervals
// @param {Int/String} -> octave range
// @return {Array/Int} -> mapped midi values
// 
function mapToMidi(a=[0], o=4){
	return add(relativeToMidi(mapToScale(a), o), notation.rootInt);
}
exports.mapToMidi = mapToMidi;
exports.toMidi = mapToMidi;

// Map an array of relative semitone intervals to scale and 
// output in frequency value
// 
// @param {Array/Int} -> semitone intervals
// @param {Int/String} -> octave range
// @return {Array/Int} -> mapped midi values
//
function mapToFreq(a=[0], o=4){
	// return mapToMidi(a, o);
	return midiToFreq(mapToMidi(a, o));
}
exports.mapToFreq = mapToFreq;
exports.toFreq = mapToFreq;

// Convert a frequency ratio string to a corresponding cents value
// eq. ['2/1', '3/2'] => [1200, 701.95]
// 
// @param {Number/String/Array} -> ratios to convert
// @return {Number/Array} -> cents output
// 
function ratioToCent(a=['1/1']){
	a = toArray(a);
	return a.map(x => {
		if (Array.isArray(x)){
			return ratioToCent(x);
		}
		return Math.log(divRatio(x)) / Math.log(2) * 1200;
	});
}
exports.ratioToCent = ratioToCent;
exports.rtoc = ratioToCent;

/* WORK IN PROGRESS
// Convert a midi value to semitone intervals
// provide octave offset
// 
// @param {Number/Array} -> semitones
// @param {Number} -> octave (optional, default=4)
// @return {Number/Array}
// 
function midiToSemi(a=0, o=4){
	if (!Array.isArray(a)){
		return a - o * 12;
	}
	return a.map(x => x - o * 12);
}
exports.midiToSemi = midiToSemi;
exports.mtos = midiToSemi;
*/

// Use a list of roman numerals to translate a chord progression
// The function returns a 2d-array of chords, where every chord is
// a separate array within the larger array. The chords are returned
// as semitones from 0-12. Optionally with a second argument you can 
// offset the chords based on a note name or midi value
// eg. IIm with 'D' becomes [E, G, B] becomes => [4, 7, 11]
// Valid chord numerals: I, II, III, ..., VII
// Valid additions: m, M, 7, 9, sus2, sus4, maj7, m7, maj9, m9
// 
// @param - {Array/String} -> roman numerals to convert to chords
// @param - {String/Number} -> root for chord progression
// @return - {2d-Array} -> array of chords
//
function chordsFromNumerals(a=['i'], n='c'){
	// make array if not array and flatten
	a = Array.isArray(a)? a.flat(Infinity) : [a];
	// check if n is notename
	n = isNaN(n)? n : midiToNote(wrap(n));
	// generate progression of chord names
	let p = Progression.fromRomanNumerals(n, a);
	// translate chordnames to semitones
	return chordsFromNames(p);
}
exports.chordsFromNumerals = chordsFromNumerals;
exports.chords = chordsFromNumerals;

// Use a list of chord names to generate a chord progression
// The function returns an array of chords and works on n-dimensional arrays
// where every chord is a separate array within the larger array. 
// The chords are returned as semitones from 0-12. 
// eg. Em becomes => [4, 7, 11]
// Valid note names: C, D, E ..., B
// Valid additions: m, M, 7, 9, sus2, sus4, maj7, m7, maj9, m9
// 
// @param - {Array/String} -> chord names to convert to numbers
// @return - {2d-Array} -> array of chords
//
function chordsFromNames(a=['c']){
	// if not an array, translate chordname to semitone array
	if (!Array.isArray(a)){
		let ch = Chord.get(a);
		if (ch.empty){
			console.log(`Invalid chord name generated from numeral: ${a}`);
			return [0];
		}
		// return wrap(chromaToRelative(ch.notes));
		return chromaToRelative(ch.notes);
	}
	return a.map(c => chordsFromNames(c));
}
exports.chordsFromNames = chordsFromNames;

// Convert a beat division value to milliseconds based on the global BPM
// eg. ['1/4', 1/8', '1/16'] => [500, 250, 125] @ BPM = 120
// Also works with ratio floating values
// 
// @param {Number/String/Array} -> beat division or ratio array
// @param {Number} -> set the BPM (optional, default=globalBPM)
// @return {Number/Array}
//
function divisionToMs(a=['1'], bpm){
	return ratioToMs(divisionToRatio(a), bpm);
}
exports.divisionToMs = divisionToMs;
exports.dtoms = divisionToMs;

// Convert a beat ratio value to milliseconds based on the global BPM
// eg. [0.25, 0.125, 0.0625] => [500, 250, 125] @ BPM = 120
// 
// @param {Number/String/Array} -> beat ratio array
// @param {Number} -> set the BPM (optional, default=globalBPM)
// @return {Number/Array}
//
function ratioToMs(a=[1], bpm){
	let measureMs = notation.measureInMs;
	if (bpm){
		measureMs = 60000 / Math.max(1, Number(bpm)) * 4;
	}
	return multiply(a, measureMs);
}
exports.ratioToMs = ratioToMs;
exports.rtoms = ratioToMs;

// Convert a beat ratio value to milliseconds based on the BPM
// eg. [0.25, 0.125, 0.0625] => [500, 250, 125] @ BPM = 120
// 
// @param {Number/String/Array} -> beat ratio array
// @return {Number/Array}
//
function divisionToRatio(a=['1']){
	a = toArray(a);
	return a.map(x => {
		if (Array.isArray(x)){
			return divisionToRatio(x);
		}
		return divRatio(x);
	});
}
exports.divisionToRatio = divisionToRatio;
exports.dtor = divisionToRatio;

// Evaluate a division string to a ratio
// 
function divRatio(x){
	// match all division symbols: eg. 1/4, 5/16
	let d = /^\d+(\/\d+)?$/;
	// output a floating point value
	return (typeof x === 'string' && d.test(x))? eval(x) : x;
}

// Convert a division or ratio value to amount of ticks
// Used in software like Ableton, M4L and MaxMSP
// 
// @param {Number/String/Array} -> division to convert
// @return {Array}
// 
function divisionToTicks(a=['1']){
	// 1 tick = 1/480th of a quarter note, 
	// 1 bar = 1920 ticks
	return multiply(divisionToRatio(a), 1920);
}
exports.divisionToTicks = divisionToTicks;
exports.dtotk = divisionToTicks;
exports.ratioToTicks = divisionToTicks;
exports.rtotk = divisionToTicks;

// Convert timevalues to a ratio in floatingpoint
// eg. 4n, 8nt, 16nd, 2m etc.
// 
// @param {String/Array} -> timevalues to convert
// @return {Array}
// 
function timevalueToRatio(a=['1n']){
	a = toArray(a);
	return a.map(x => {
		if (Array.isArray(x)){
			return timevalueToRatio(x);
		}
		return timevalueRatio(x);
	});
}
exports.timevalueToRatio = timevalueToRatio;
exports.ttor = timevalueToRatio;

// Convert timevalues to milliseconds
// 
// @param {String/Array} -> timevalues to convert
// @param {Number} -> bpm (optional, default=globalBPM)
// @return {Array}
// 
function timevalueToMs(a=['1n'], bpm){
	return ratioToMs(timevalueToRatio(a), bpm);
}
exports.timevalueToMs = timevalueToMs;
exports.ttoms = timevalueToMs;

// Convert timevalues to ticks
// 
// @param {String/Array} -> timevalues to convert
// @return {Array}
// 
function timevalueToTicks(a=['1n']){
	return multiply(timevalueToRatio(a), 1920);
}
exports.timevalueToTicks = timevalueToTicks;
exports.ttotk = timevalueToTicks;

function timevalueRatio(x){
	let r = /^(\d+)([nm])([dt]?)$/;
	let m = x.match(r);
	let v = 1;
	if (m){
		let nm = { 'n' : 1, 'm' : m[1]*m[1] }
		let dt = { 'd' : 3/2, 't' : 2/3, '' : 1 }
		v = 1 / m[1] * nm[m[2]] * dt[m[3]];
	} else {
		console.log(`timevalueRatio(): ${x} is not a valid timevalue`);
	}
	return v;
}

// Convert toneJS time values
// function tonetimeRatio(x){
// }

//=======================================================================
// Scala class
// 
// Import a .scl file and convert to a JSON object. Use methods to 
// translate numbers into frequencies according to the settings of
// tune, center and the scala cents
//=======================================================================

// const fs = require('fs');
// const path = require('path');

// const TL = require('./translate.js');
// scala database from json
// const db = require('../data/scldb-min.json');

class Scala {
	constructor() {
		// the converted file to dictionary
		this.scl = {
			'description' : 'Divide an octave into 12 equal steps',
			'size' : 12,
			'tune' : 440,
			'center' :  69,
			'range' : 1200,
			'cents' : [ 0, 100, 200, 300, 400, 500, 
						600, 700, 800, 900, 1000, 1100 ]
		};
	}

	// get the current loaded scala data
	// 
	// @return {Object} -> Object with the loaded scala data
	// 
	get data(){
		return { ...this.scl };
	}

	// get the filenames from the database
	// 
	// @return {Array} -> array with all scala filenames
	// 
	get names(){
		const db = require('../data/scldb.json');
		return Object.keys(db);
	}

	// set the tuning in Hz for the center value
	// 
	// @param {Number} -> tuning in Hz
	// @return {Void}
	// 
	tune(v){
		if (isNaN(Number(v))){
			error(v + ' is not a number \n');
		} else {
			this.scl['tune'] = v;
		}
	}
	
	// set the center value corresponding with cent 0 and tuning frequency
	// 
	// @param {Int} -> center value as integer
	// @return {Void}
	// 
	center(v){
		if (isNaN(Number(v))){
			error(v + ' is not a number \n');
		} else {
			this.scl['center'] = v;
		}
	}

	// return the frequency from the scala corresponding to the input number
	// 
	// @params {Number/Array} -> Number to convert
	// @return {Number} -> Converted frequency
	// 
	scalaToFreq(a=48){
		let isArr = !Array.isArray(a);
		let arr = (isArr)? [a] : a;

		arr = arr.map((x) => {
			let s = this.scl.size;
			let n = x - this.scl.center;
			let o = Math.floor(n / s) * this.scl.range;
			let c = this.scl.cents[((n % s) + s) % s];

			return Math.pow(2, (c + o) / 1200) * this.scl.tune;
		});
		return (isArr)? arr[0] : arr;
	}

	// shorthand for scalaToFreq()
	stof(a=48){
		return this.scalaToFreq(a);
	}

	// search the scala scale database with filter options
	// 
	// @params {Object} -> filter options in the format:
	// 					{ size: <Number/Array>, range: <Number>, 
	// 					  cents: <String/Array>, description: <String/Array> }
	// @return {Object -> All scala files matching the filter
	// 
	search(f){
		const db = require('../data/scldb.json');

		f = (typeof f !== 'undefined') ? f : {};
		f.size = (typeof f.size !== 'undefined') ? f.size : null;
		f.cents = (typeof f.cents !== 'undefined') ? f.cents : null;
		f.description = (typeof f.description !== 'undefined') ? f.description : null;
		f.decimals = (typeof f.decimals !== 'undefined') ? f.decimals : 3;

		// console.log('search', f);
		
		// let result = { ...db };
		let result = JSON.parse(JSON.stringify(db));
		Object.keys(f).forEach((k) => {
			let tmpRes = {};
			// only search the key if filter is added
			if (f[k] !== null){
				// allow arrays for multiple searches
				let s = (!Array.isArray(f[k]))? [f[k]] : f[k];
				// serach size with number match
				if (k === 'size'){
					Object.keys(result).forEach((scl) => {
						s.forEach((v) => {
							if (result[scl][k] === Number(v)){
								tmpRes[scl] = result[scl];
							}
						});
					});
					result = tmpRes;
				}
				// search description with regular expression
				if (k === 'description'){
					Object.keys(result).forEach((scl) => {
						s.forEach((v) => {
							if (result[scl][k].match(String(v), 'i')){
								tmpRes[scl] = result[scl];
							}
						});
					});
					result = tmpRes;
				}
				// search cents for number or ratio
				if (k === 'cents'){
					Object.keys(result).forEach((scl) => {
						let match = 0;

						// temporary cents array
						let tmpCents = result[scl][k];
						// append the octave ratio (or range)
						tmpCents.push(result[scl]['range']);
						// filter duplicates
						
						tmpCents = unique(tmpCents).map(x => x.toFixed(f.decimals));

						for (let i in s){
							// for all entered cent/ratio values
							let cent = (typeof s[i] === 'string')? ratioToCent(s[i])[0] : s[i];
							// if equals cent from array increment match
							for (let c=0; c<tmpCents.length; c++){
								if (tmpCents[c] === cent.toFixed(f.decimals)){
									match += 1;
								}
							}
						}
						// result if matches equals amount of searches
						if (match === s.length) {
							tmpRes[scl] = result[scl];
						}
					});
					result = tmpRes;
				}
			}
		});
		return result;
	}

	// read and parse a filestring (best imported with fs.readFileSync for 
	// local usage or fetch() in the browser) to use in the scale
	// 
	// @params {String} -> text as string loaded from .scl file
	// @return {Void}
	// 
	parse(f){
		// read the file text in variable
		// let file = fs.readFileSync(f, 'utf8');
		// this.scl.name = path.parse(f).name;

		// remove linebreaks and split into array of lines
		let file = f.replace(/(\r\n|\n\r|\r|\n)/g, '\n').split('\n');
		// empty cents array in dictionary
		this.scl.cents = [ 0 ];
		// init line number and note count
		let l = 0, n = 0;
		// iterate through lines
		for (var i=0; i<file.length; i++){
			let line = file[i];
	
			if (line.match(/^!(.+)?/)) {
				// ignore if comment
			} else {
				// console.log(line, l);
				if (l === 0){
					// first non-comment line is description
					this.scl['description'] = line;
				} else if (l === 1){
					// second non-comment line is number of notes in scale
					this.scl['size'] = Number(line);
				} else {
					// remove leading, trailing and multiple whitespace
					// split line in array
					line = line.trim().replace(/\s+/g, ' ').split(' ');
	
					if (n < this.scl.size){
						// if line is not a number then it's a ratio
						if (isNaN(Number(line[0]))) {
							line = ratioToCent(line[0])[0];
						} else {
							// if line is negative then make absolute
							line = (Number(line[0]) < 0)? Math.abs(Number(line[0])) : Number(line[0]);
						}
						// push notes to object and increment notecount
						this.scl.cents.push(line);
						n++;
					}
				}
				// increment linecount
				l++;
			}
		}
		// sort the cent values
		this.scl['cents'] = this.scl.cents.sort((a, b) => {return a-b});
		// last value is width of "octave" (usually an octave of 1200)
		this.scl['range'] = this.scl.cents.pop();
	}

	// return an object with frequencies derived from the loaded scala
	// mapped to a specific range of values
	// 
	// @params {Int} -> high value for output range (optional, default=127)
	// @params {Int} -> low value for output range (optional, default=0)
	// @return {Object} -> Object with all values and corresponding frequency
	// 
	chart(hi=127, lo=0){
		// swap lo and hi range if hi is smaller than lo
		if (hi < lo){ var t=hi, hi=lo, lo=t; }
		let range = hi - lo;
		// empty object for frequencies
		let chart = {};
		// calculate frequencies for values 0 to 127
		for (var i=0; i<range+1; i++){
			chart[i + lo] = this.scalaToFreq(i + lo);
		}
		return chart;
	}
}
exports.Scala = Scala;

},{"../data/scldb.json":45,"../data/tones.json":46,"./transform":52,"./utility":54,"@tonaljs/tonal":21}],54:[function(require,module,exports){
//====================================================================
// utility.js
// part of 'total-serialism' Package
// by Timo Hoogland (@t.mo / @tmhglnd), www.timohoogland.com
// MIT License
//
// Utility functions
//====================================================================

const chart = require('asciichart');

const HALF_PI = Math.PI / 2.0;
const TWO_PI = Math.PI * 2.0;
const PI = Math.PI;

exports.HALF_PI = HALF_PI;
exports.TWO_PI = TWO_PI;
exports.PI = PI;

// check if the value is an array or not
// if not transform into an array and output
//
// @param {Value} -> input to be checked
// @return {Array} -> the input as an array
//
function toArray(a){
	return Array.isArray(a) ? a : [a];
}
exports.toArray = toArray;

// check if the value is an array or not
// if it is an array output the first value
// 
// @param {Value} -> intput to be checked
// @param {Int+} -> index to return from Array (optional, default=0)
// @return {Value} -> single value output
//
function fromArray(a, i=0){
	return Array.isArray(a) ? a[i] : a;
}
exports.fromArray = fromArray;

// Return the length/size of an array if the argument is an array
// if argument is a number return the number as integer
// if argument is not a number return 1
// The method can be used to input arrays as arguments for other functions
// 
// @param {Value/Array} -> input value to check
// @return {Int} -> the array length
// 
function length(a){
	if (Array.isArray(a)){
		// return array length if argument is array
		return a.length;
	}
	// else return 1 if NaN or positive integer if Number
	return isNaN(a) ? 1 : Math.max(1, Math.floor(a));
}
exports.length = length;
exports.size = length;

// Wrap a value between a low and high range
// Similar to mod, expect the low range is also adjustable
// 
// @param {Number/Array} -> input value
// @param {Number} -> minimum value optional, (default=12)
// @param {Number} -> maximum value optional, (default=0)
// @return {Number} -> remainder after division
// 
function wrap(a=0, lo=12, hi=0){
	// swap if lo > hi
	if (lo > hi){ var t=lo, lo=hi, hi=t; }
	// calculate range and wrap the values
	if (!Array.isArray(a)){
		return _wrap(a, lo, hi);
	}
	return a.map(x => wrap(x, lo, hi));
}
exports.wrap = wrap;

function _wrap(a, lo, hi){
	let r = hi - lo;
	return ((((a - lo) % r) + r) % r) + lo;
}

// Constrain a value between a low and high range
// 
// @param {Number/Array} -> number to constrain
// @param {Number} -> minimum value (optional, default=12)
// @param {Number} -> maximum value (optional, default=0)
// @return {Number} -> constrained value
// 
function constrain(a=0, lo=12, hi=0){
	// swap if lo > hi
	if (lo > hi){ var t=lo, lo=hi, hi=t; }
	// constrain the values
	if (!Array.isArray(a)){
		return Math.min(hi, Math.max(lo, a));
	}
	return a.map(x => constrain(x, lo, hi));
}
exports.constrain = constrain;
exports.bound = constrain;
exports.clip = constrain;
exports.clamp = constrain;

// Fold a between a low and high range
// When the value exceeds the range it is folded inwards
// Has the effect of "bouncing" against the boundaries
// 
// @param {Number/Array} -> number to fold
// @param {Number} -> minimum value (optional, default=12)
// @param {Number} -> maximum value (optional, default=0)
// @return {Number} -> folder value
// 
function fold(a=0, lo=12, hi=0){
	// swap if lo > hi
	if (lo > hi){ var t=lo, lo=hi, hi=t; }
	// fold the values
	if (!Array.isArray(a)){
		return _fold(a, lo, hi);
	}
	return a.map(x => fold(x, lo, hi));
}
exports.fold = fold;
exports.bounce = fold;

function _fold(a, lo, hi){
	a = _map(a, lo, hi, -1, 1);
	a = Math.asin(Math.sin(a * HALF_PI)) / HALF_PI;
	return _map(a, -1, 1, lo, hi);
}

// Map/scale a value or array from one input-range 
// to a given output-range
// 
// @param {Number/Array} -> value to be scaled
// @param {Number} -> input low
// @param {Number} -> input high
// @param {Number} -> output low
// @param {Number} -> output high
// @param {Number} -> exponent (optional, default=1)
// @return {Number/Array}
// 
function map(a=0, ...params){
	if (!Array.isArray(a)){
		return _map(a, ...params);
	}
	return a.map(x => map(x, ...params));
}
exports.map = map;
exports.scale = map;

function _map(a, inLo=0, inHi=1, outLo=0, outHi=1, exp=1){
	a = (a - inLo) / (inHi - inLo);
	if (exp != 1){
		var sign = (a >= 0.0) ? 1 : -1;
		a = Math.pow(Math.abs(a), exp) * sign;
	}
	return a * (outHi - outLo) + outLo;
}

// Lerp (Linear interpolation) two values or arrays
// Both sides can be a single value or an array
// Set the interpolation factor as third argument
// 
// @param {Number/Array} -> input 1 to be mixed
// @param {Number/Array} -> input 2 to be mixed
// @param {Number} -> interpolation factor (optional, default=0.5)
// @return {Number/Array}
// 
function lerp(a=0, v=0, f=0.5){
	return arrayCalc(a, v, (a, b) => { return a * (1 - f) + b * f });
}
exports.lerp = lerp;
exports.mix = lerp;

// add 1 or more values to an array, 
// preserves listlength of first argument
// arguments are applied sequentially
// 
// @param {Number/Array} -> input to be added to
// @param {Number/Array} -> value to add
// @return {Number/Array}
// 
function add(a=0, v=0){
	return arrayCalc(a, v, (a, b) => { return a + b });
}
exports.add = add;

// subtract 1 or more values from an array
// preserves listlength of first argument
// arguments are applied sequentially
// 
// @param {Number/Array} -> input to be subtracted from
// @param {Number/Array} -> value to subtract
// @return {Number/Array}
// 
function subtract(a=0, v=0){
	return arrayCalc(a, v, (a, b) => { return a - b });
}
exports.subtract = subtract;
exports.sub = subtract;

// multiply 1 or more values from an array
// preserves listlength of first argument
// arguments are applied sequentially
// 
// @param {Number/Array} -> input to be multiplied
// @param {Number/Array} -> value to multiply with
// @return {Number/Array}
// 
function multiply(a=0, v=1){
	return arrayCalc(a, v, (a, b) => { return a * b });
}
exports.multiply = multiply;
exports.mult = multiply;
exports.mul = multiply;

// divide 1 or more values from an array
// preserves listlength of first argument
// arguments are applied sequentially
// 
// @param {Number/Array} -> input to be divided
// @param {Number/Array} -> value to divide with
// @return {Number/Array}
// 
function divide(a=0, v=1){
	return arrayCalc(a, v, (a, b) => { return a / b });
}
exports.divide = divide;
exports.div = divide;

// Return the remainder after division
// also works in the negative direction, so wrap starts at 0
// 
// @param {Int/Array} -> input value
// @param {Int/Array} -> divisor (optional, default=12)
// @return {Int/Array} -> remainder after division
// 
function mod(a=0, v=12){
	return arrayCalc(a, v, (a, b) => { return ((a % b) + b) % b });
}
exports.mod = mod;

// Raise a value of one array to the power of the value
// from the right hand array
// 
// @param {Number/Array} -> base
// @param {Number/Array} -> exponent 
// @return {Number/Array} -> result from function
// 
function pow(a=0, v=1){
	return arrayCalc(a, v, (a, b) => { return Math.pow(a, b) });
}
exports.pow = pow;

// Return the squareroot of an array of values
// 
// @param {Number/Array} -> values
// @return {Number/Array} -> result
// 
function sqrt(a=0){
	return arrayCalc(a, 0, (a) => { return Math.sqrt(a) });
}
exports.sqrt = sqrt;

// Evaluate a function for a multi-dimensional array
// 
// @params {Array|Number} -> left hand input array
// @params {Array|Number} -> right hand input array
// @params {Function} -> function to evaluate
// @return {Array|Number} -> result of evaluation
// 
function arrayCalc(a=0, v=0, func=()=>{return a;}){
	// if righthand side is array
	if (Array.isArray(v)){
		a = toArray(a);
		let l1 = a.length, l2 = v.length, r = [];
		let l = Math.max(l1, l2);
		for (let i=0; i<l; i++){
			r[i] = arrayCalc(a[i % l1], v[i % l2], func);
		}
		return r;
	}
	// if both are single values
	if (!Array.isArray(a)){
		let r = func(a, v);
		if (!isNaN(a) && !isNaN(v)){
			return isNaN(r)? 0 : r;
		}
		return r;
	}
	// if lefthand side is array
	return a.map(x => arrayCalc(x, v, func));
}
exports.arrayCalc = arrayCalc;

// flatten a multidimensional array. Optionally set the depth
// for the flattening
//
// @param {Array} -> array to flatten
// @param {Number} -> depth of flatten
// @return {Array} -> flattened array
//
function flatten(a=[0], depth=Infinity){
	return toArray(a).flat(depth);
}
exports.flatten = flatten;
exports.flat = flatten;

// Truncate all the values in an array towards 0,
// sometimes referred to as rounding down
// 
// @param {Number/Array} -> input value
// @return {Int/Array} -> trucated value
function truncate(a=[0]){
	if (!Array.isArray(a)){
		return Math.trunc(a);
	}
	return a.map(x => truncate(x));
}
exports.truncate = truncate;
exports.trunc = truncate;
exports.int = truncate;

// Return the sum of all values in the array
// Ignore all non numeric values
// Works with multidimensional arrays by flattening first
// 
// @param {Array} -> input array
// @return {Number} -> summed array
//
function sum(a=[0]){
	let s = 0;
	flatten(toArray(a)).forEach((v) => {
		s += isNaN(v) ? 0 : v;
	});
	return s;
}
exports.sum = sum;

// Return the biggest value from an array
// 
// @param {NumberArray} -> input array
// @return {Number} -> biggest value
// 
function maximum(a=[0]){
	if (!Array.isArray(a)) { return a; }
	return Math.max(...flatten(a));
}
exports.maximum = maximum;
exports.max = maximum;

// Return the lowest value from an array
// 
// @param {NumberArray} -> input array
// @return {Number} -> lowest value
// 
function minimum(a=[0]){
	if (!Array.isArray(a)) { return a; }
	return Math.min(...flatten(a));
}
exports.minimum = minimum;
exports.min = minimum;

// Normalize all the values in an array between 0. and 1.
// The highest value will be 1, the lowest value will be 0.
// 
// @param {Number/Array} -> input values
// @return {Number/Array} -> normalized values
// 
function normalize(a=[0]){
	// get minimum and maximum
	let min = minimum(a);
	let range = maximum(a) - min;
	// if range 0 then range = min and min = 0
	if (!range) { range = min, min = 0; }
	// normalize and return
	return divide(subtract(a, min), range);
}
exports.normalize = normalize;
exports.norm = normalize;

// Signed Normalize all the values in an array between -1. and 1.
// The highest value will be 1, the lowest value will be -1.
//
// @param {Number/Array} -> input values
// @return {Number/Array} -> signed normalized values
// 
function signedNormalize(a=[0]){
	return subtract(multiply(normalize(a), 2), 1);
}
exports.signedNormalize = signedNormalize;
exports.snorm = signedNormalize;

// Plot an array of values to the console in the form of an
// ascii chart and return chart from function. If you just want the 
// chart returned as text and not log to console set { log: false }.
// Using the asciichart package by x84. 
// 
// @param {Number/Array/String} -> value to plot
// @param {Object} -> { log: false } don't log to console and only return
//                 -> { data: true } log the original array data
//                 -> { decimals: 2 } adjust the number of decimals
//                 -> { height: 10 } set a fixed chart line-height
//                 -> other preferences for padding, colors, offset
//                    See the asciichart documentation
// 
function plot(a=[0], prefs){
	// if a is not an Array
	a = toArray(a);
	// empty object if no preferences
	prefs = (typeof prefs !== 'undefined') ? prefs : {};

	prefs.log = (typeof prefs.log !== 'undefined') ? prefs.log : true;
	prefs.data = (typeof prefs.data !== 'undefined') ? prefs.data : false;
	prefs.decimals = (typeof prefs.decimals !== 'undefined') ? prefs.decimals : 2;

	let p = chart.plot(a, prefs);
	if (prefs.data){
		console.log('chart data: [', a.map(x => x.toFixed(prefs.decimals)).join(", "), "]\n");
	}
	if (prefs.log){
		console.log(chart.plot(a, prefs), "\n");
	}
	return p;
}
exports.plot = plot;

// Draw a 2D-array of values to the console in the form of an
// ascii gray-scaleimage and return chart from function. 
// If you just want the chart returned as text and not log to console 
// set { log: false }. If you want to print using a characterset under 
// ascii-code 256 use { extend: false }. 
// 
// @param {Array/2D-Array} -> values to plot
// @param {Object} -> { log: false } don't log to console and only return
//                 -> { extend: true } use extended ascii characters
//                 -> { error: false } use error character for error reporting
// 
function draw(a=[0], prefs){
	// if a is not an array
	a = toArray(a);
	// if a is not an 2d-array
	a = (Array.isArray(a[0])) ? a : [a];

	// empty object if no preferences
	prefs = (typeof prefs !== 'undefined') ? prefs : {};

	prefs.log = (typeof prefs.log !== 'undefined') ? prefs.log : true;
	prefs.extend = (typeof prefs.extend !== 'undefined') ? prefs.extend : true;
	prefs.error = (typeof prefs.error !== 'undefined') ? prefs.error : false;

	// when using extended ascii set
	let chars = (prefs.extend) ? ' ░▒▓█'.split('') : ' .-=+#'.split('');
	// when flagging NaN values
	let err = (prefs.error) ? ((prefs.extend) ? '�' : '?') : ' ';

	// get the lowest and highest value from input and calculate range
	let min = Infinity, max = -Infinity;
	for (let i in a){
		for (let j in a[i]){
			min = (a[i][j] < min)? a[i][j] : min;
			max = (a[i][j] > max)? a[i][j] : max;
		}
	}
	let range = max - min;

	// lookup a grayscale ascii value based on normalized array value
	// use whitespace if value is NaN or 'X' if error flag is true
	let p = '';
	for (let i in a){
		for (let j in a[i]){
			let grey = Math.trunc((a[i][j] - min) / range * (chars.length-1));
			let char = (isNaN(grey)) ? err : chars[grey];
			p += char;
		}
		// add linebreak if multiple lines must be printed
		if (a.length > 1) { p += '\n'; }
	}
	if (prefs.log){ console.log(p); }
	return p;	
}
exports.draw = draw;
},{"asciichart":22}],55:[function(require,module,exports){
(function (process,global){(function (){
/**
 * WEBMIDI.js v3.1.6
 * A JavaScript library to kickstart your MIDI projects
 * https://webmidijs.org
 * Build generated on June 4th, 2023.
 *
 * © Copyright 2015-2023, Jean-Philippe Côté.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class EventEmitter{constructor(e=!1){this.eventMap={},this.eventsSuspended=1==e}addListener(e,t,n={}){if("string"==typeof e&&e.length<1||e instanceof String&&e.length<1||"string"!=typeof e&&!(e instanceof String)&&e!==EventEmitter.ANY_EVENT)throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");if("function"!=typeof t)throw new TypeError("The callback must be a function.");const r=new Listener(e,this,t,n);return this.eventMap[e]||(this.eventMap[e]=[]),n.prepend?this.eventMap[e].unshift(r):this.eventMap[e].push(r),r}addOneTimeListener(e,t,n={}){n.remaining=1,this.addListener(e,t,n)}static get ANY_EVENT(){return Symbol.for("Any event")}hasListener(e,t){if(void 0===e)return!!(this.eventMap[EventEmitter.ANY_EVENT]&&this.eventMap[EventEmitter.ANY_EVENT].length>0)||Object.entries(this.eventMap).some(([,e])=>e.length>0);if(this.eventMap[e]&&this.eventMap[e].length>0){if(t instanceof Listener){return this.eventMap[e].filter(e=>e===t).length>0}if("function"==typeof t){return this.eventMap[e].filter(e=>e.callback===t).length>0}return null==t}return!1}get eventNames(){return Object.keys(this.eventMap)}getListeners(e){return this.eventMap[e]||[]}suspendEvent(e){this.getListeners(e).forEach(e=>{e.suspended=!0})}unsuspendEvent(e){this.getListeners(e).forEach(e=>{e.suspended=!1})}getListenerCount(e){return this.getListeners(e).length}emit(e,...t){if("string"!=typeof e&&!(e instanceof String))throw new TypeError("The 'event' parameter must be a string.");if(this.eventsSuspended)return;let n=[],r=this.eventMap[EventEmitter.ANY_EVENT]||[];return this.eventMap[e]&&(r=r.concat(this.eventMap[e])),r.forEach(e=>{if(e.suspended)return;let r=[...t];Array.isArray(e.arguments)&&(r=r.concat(e.arguments)),e.remaining>0&&(n.push(e.callback.apply(e.context,r)),e.count++),--e.remaining<1&&e.remove()}),n}removeListener(e,t,n={}){if(void 0===e)return void(this.eventMap={});if(!this.eventMap[e])return;let r=this.eventMap[e].filter(e=>t&&e.callback!==t||n.remaining&&n.remaining!==e.remaining||n.context&&n.context!==e.context);r.length?this.eventMap[e]=r:delete this.eventMap[e]}async waitFor(e,t={}){return t.duration=parseInt(t.duration),(isNaN(t.duration)||t.duration<=0)&&(t.duration=1/0),new Promise((n,r)=>{let i,s=this.addListener(e,()=>{clearTimeout(i),n()},{remaining:1});t.duration!==1/0&&(i=setTimeout(()=>{s.remove(),r("The duration expired before the event was emitted.")},t.duration))})}get eventCount(){return Object.keys(this.eventMap).length}}class Listener{constructor(e,t,n,r={}){if("string"!=typeof e&&!(e instanceof String)&&e!==EventEmitter.ANY_EVENT)throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");if(!t)throw new ReferenceError("The 'target' parameter is mandatory.");if("function"!=typeof n)throw new TypeError("The 'callback' must be a function.");void 0===r.arguments||Array.isArray(r.arguments)||(r.arguments=[r.arguments]),(r=Object.assign({context:t,remaining:1/0,arguments:void 0,duration:1/0},r)).duration!==1/0&&setTimeout(()=>this.remove(),r.duration),this.arguments=r.arguments,this.callback=n,this.context=r.context,this.count=0,this.event=e,this.remaining=parseInt(r.remaining)>=1?parseInt(r.remaining):1/0,this.suspended=!1,this.target=t}remove(){this.target.removeListener(this.event,this.callback,{context:this.context,remaining:this.remaining})}}
/**
 * The `Enumerations` class contains enumerations and arrays of elements used throughout the
 * library. All its properties are static and should be referenced using the class name. For
 * example: `Enumerations.CHANNEL_MESSAGES`.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */class Enumerations{static get MIDI_CHANNEL_MESSAGES(){return this.validation&&console.warn("The MIDI_CHANNEL_MESSAGES enum has been deprecated. Use the Enumerations.CHANNEL_MESSAGES enum instead."),Enumerations.CHANNEL_MESSAGES}static get CHANNEL_MESSAGES(){return{noteoff:8,noteon:9,keyaftertouch:10,controlchange:11,programchange:12,channelaftertouch:13,pitchbend:14}}static get CHANNEL_NUMBERS(){return[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]}static get MIDI_CHANNEL_NUMBERS(){return this.validation&&console.warn("The MIDI_CHANNEL_NUMBERS array has been deprecated. Use the Enumerations.CHANNEL_NUMBERS array instead."),[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]}static get CHANNEL_MODE_MESSAGES(){return{allsoundoff:120,resetallcontrollers:121,localcontrol:122,allnotesoff:123,omnimodeoff:124,omnimodeon:125,monomodeon:126,polymodeon:127}}static get MIDI_CHANNEL_MODE_MESSAGES(){return this.validation&&console.warn("The MIDI_CHANNEL_MODE_MESSAGES enum has been deprecated. Use the Enumerations.CHANNEL_MODE_MESSAGES enum instead."),Enumerations.CHANNEL_MODE_MESSAGES}static get MIDI_CONTROL_CHANGE_MESSAGES(){return this.validation&&console.warn("The MIDI_CONTROL_CHANGE_MESSAGES enum has been deprecated. Use the Enumerations.CONTROL_CHANGE_MESSAGES array instead."),{bankselectcoarse:0,modulationwheelcoarse:1,breathcontrollercoarse:2,controller3:3,footcontrollercoarse:4,portamentotimecoarse:5,dataentrycoarse:6,volumecoarse:7,balancecoarse:8,controller9:9,pancoarse:10,expressioncoarse:11,effectcontrol1coarse:12,effectcontrol2coarse:13,controller14:14,controller15:15,generalpurposeslider1:16,generalpurposeslider2:17,generalpurposeslider3:18,generalpurposeslider4:19,controller20:20,controller21:21,controller22:22,controller23:23,controller24:24,controller25:25,controller26:26,controller27:27,controller28:28,controller29:29,controller30:30,controller31:31,bankselectfine:32,modulationwheelfine:33,breathcontrollerfine:34,controller35:35,footcontrollerfine:36,portamentotimefine:37,dataentryfine:38,volumefine:39,balancefine:40,controller41:41,panfine:42,expressionfine:43,effectcontrol1fine:44,effectcontrol2fine:45,controller46:46,controller47:47,controller48:48,controller49:49,controller50:50,controller51:51,controller52:52,controller53:53,controller54:54,controller55:55,controller56:56,controller57:57,controller58:58,controller59:59,controller60:60,controller61:61,controller62:62,controller63:63,holdpedal:64,portamento:65,sustenutopedal:66,softpedal:67,legatopedal:68,hold2pedal:69,soundvariation:70,resonance:71,soundreleasetime:72,soundattacktime:73,brightness:74,soundcontrol6:75,soundcontrol7:76,soundcontrol8:77,soundcontrol9:78,soundcontrol10:79,generalpurposebutton1:80,generalpurposebutton2:81,generalpurposebutton3:82,generalpurposebutton4:83,controller84:84,controller85:85,controller86:86,controller87:87,controller88:88,controller89:89,controller90:90,reverblevel:91,tremololevel:92,choruslevel:93,celestelevel:94,phaserlevel:95,databuttonincrement:96,databuttondecrement:97,nonregisteredparametercoarse:98,nonregisteredparameterfine:99,registeredparametercoarse:100,registeredparameterfine:101,controller102:102,controller103:103,controller104:104,controller105:105,controller106:106,controller107:107,controller108:108,controller109:109,controller110:110,controller111:111,controller112:112,controller113:113,controller114:114,controller115:115,controller116:116,controller117:117,controller118:118,controller119:119,allsoundoff:120,resetallcontrollers:121,localcontrol:122,allnotesoff:123,omnimodeoff:124,omnimodeon:125,monomodeon:126,polymodeon:127}}static get CONTROL_CHANGE_MESSAGES(){return[{number:0,name:"bankselectcoarse",description:"Bank Select (Coarse)",position:"msb"},{number:1,name:"modulationwheelcoarse",description:"Modulation Wheel (Coarse)",position:"msb"},{number:2,name:"breathcontrollercoarse",description:"Breath Controller (Coarse)",position:"msb"},{number:3,name:"controller3",description:"Undefined",position:"msb"},{number:4,name:"footcontrollercoarse",description:"Foot Controller (Coarse)",position:"msb"},{number:5,name:"portamentotimecoarse",description:"Portamento Time (Coarse)",position:"msb"},{number:6,name:"dataentrycoarse",description:"Data Entry (Coarse)",position:"msb"},{number:7,name:"volumecoarse",description:"Channel Volume (Coarse)",position:"msb"},{number:8,name:"balancecoarse",description:"Balance (Coarse)",position:"msb"},{number:9,name:"controller9",description:"Controller 9 (Coarse)",position:"msb"},{number:10,name:"pancoarse",description:"Pan (Coarse)",position:"msb"},{number:11,name:"expressioncoarse",description:"Expression Controller (Coarse)",position:"msb"},{number:12,name:"effectcontrol1coarse",description:"Effect Control 1 (Coarse)",position:"msb"},{number:13,name:"effectcontrol2coarse",description:"Effect Control 2 (Coarse)",position:"msb"},{number:14,name:"controller14",description:"Undefined",position:"msb"},{number:15,name:"controller15",description:"Undefined",position:"msb"},{number:16,name:"generalpurposecontroller1",description:"General Purpose Controller 1 (Coarse)",position:"msb"},{number:17,name:"generalpurposecontroller2",description:"General Purpose Controller 2 (Coarse)",position:"msb"},{number:18,name:"generalpurposecontroller3",description:"General Purpose Controller 3 (Coarse)",position:"msb"},{number:19,name:"generalpurposecontroller4",description:"General Purpose Controller 4 (Coarse)",position:"msb"},{number:20,name:"controller20",description:"Undefined",position:"msb"},{number:21,name:"controller21",description:"Undefined",position:"msb"},{number:22,name:"controller22",description:"Undefined",position:"msb"},{number:23,name:"controller23",description:"Undefined",position:"msb"},{number:24,name:"controller24",description:"Undefined",position:"msb"},{number:25,name:"controller25",description:"Undefined",position:"msb"},{number:26,name:"controller26",description:"Undefined",position:"msb"},{number:27,name:"controller27",description:"Undefined",position:"msb"},{number:28,name:"controller28",description:"Undefined",position:"msb"},{number:29,name:"controller29",description:"Undefined",position:"msb"},{number:30,name:"controller30",description:"Undefined",position:"msb"},{number:31,name:"controller31",description:"Undefined",position:"msb"},{number:32,name:"bankselectfine",description:"Bank Select (Fine)",position:"lsb"},{number:33,name:"modulationwheelfine",description:"Modulation Wheel (Fine)",position:"lsb"},{number:34,name:"breathcontrollerfine",description:"Breath Controller (Fine)",position:"lsb"},{number:35,name:"controller35",description:"Undefined",position:"lsb"},{number:36,name:"footcontrollerfine",description:"Foot Controller (Fine)",position:"lsb"},{number:37,name:"portamentotimefine",description:"Portamento Time (Fine)",position:"lsb"},{number:38,name:"dataentryfine",description:"Data Entry (Fine)",position:"lsb"},{number:39,name:"channelvolumefine",description:"Channel Volume (Fine)",position:"lsb"},{number:40,name:"balancefine",description:"Balance (Fine)",position:"lsb"},{number:41,name:"controller41",description:"Undefined",position:"lsb"},{number:42,name:"panfine",description:"Pan (Fine)",position:"lsb"},{number:43,name:"expressionfine",description:"Expression Controller (Fine)",position:"lsb"},{number:44,name:"effectcontrol1fine",description:"Effect control 1 (Fine)",position:"lsb"},{number:45,name:"effectcontrol2fine",description:"Effect control 2 (Fine)",position:"lsb"},{number:46,name:"controller46",description:"Undefined",position:"lsb"},{number:47,name:"controller47",description:"Undefined",position:"lsb"},{number:48,name:"controller48",description:"General Purpose Controller 1 (Fine)",position:"lsb"},{number:49,name:"controller49",description:"General Purpose Controller 2 (Fine)",position:"lsb"},{number:50,name:"controller50",description:"General Purpose Controller 3 (Fine)",position:"lsb"},{number:51,name:"controller51",description:"General Purpose Controller 4 (Fine)",position:"lsb"},{number:52,name:"controller52",description:"Undefined",position:"lsb"},{number:53,name:"controller53",description:"Undefined",position:"lsb"},{number:54,name:"controller54",description:"Undefined",position:"lsb"},{number:55,name:"controller55",description:"Undefined",position:"lsb"},{number:56,name:"controller56",description:"Undefined",position:"lsb"},{number:57,name:"controller57",description:"Undefined",position:"lsb"},{number:58,name:"controller58",description:"Undefined",position:"lsb"},{number:59,name:"controller59",description:"Undefined",position:"lsb"},{number:60,name:"controller60",description:"Undefined",position:"lsb"},{number:61,name:"controller61",description:"Undefined",position:"lsb"},{number:62,name:"controller62",description:"Undefined",position:"lsb"},{number:63,name:"controller63",description:"Undefined",position:"lsb"},{number:64,name:"damperpedal",description:"Damper Pedal On/Off"},{number:65,name:"portamento",description:"Portamento On/Off"},{number:66,name:"sostenuto",description:"Sostenuto On/Off"},{number:67,name:"softpedal",description:"Soft Pedal On/Off"},{number:68,name:"legatopedal",description:"Legato Pedal On/Off"},{number:69,name:"hold2",description:"Hold 2 On/Off"},{number:70,name:"soundvariation",description:"Sound Variation",position:"lsb"},{number:71,name:"resonance",description:"Resonance",position:"lsb"},{number:72,name:"releasetime",description:"Release Time",position:"lsb"},{number:73,name:"attacktime",description:"Attack Time",position:"lsb"},{number:74,name:"brightness",description:"Brightness",position:"lsb"},{number:75,name:"decaytime",description:"Decay Time",position:"lsb"},{number:76,name:"vibratorate",description:"Vibrato Rate",position:"lsb"},{number:77,name:"vibratodepth",description:"Vibrato Depth",position:"lsb"},{number:78,name:"vibratodelay",description:"Vibrato Delay",position:"lsb"},{number:79,name:"controller79",description:"Undefined",position:"lsb"},{number:80,name:"generalpurposecontroller5",description:"General Purpose Controller 5",position:"lsb"},{number:81,name:"generalpurposecontroller6",description:"General Purpose Controller 6",position:"lsb"},{number:82,name:"generalpurposecontroller7",description:"General Purpose Controller 7",position:"lsb"},{number:83,name:"generalpurposecontroller8",description:"General Purpose Controller 8",position:"lsb"},{number:84,name:"portamentocontrol",description:"Portamento Control",position:"lsb"},{number:85,name:"controller85",description:"Undefined"},{number:86,name:"controller86",description:"Undefined"},{number:87,name:"controller87",description:"Undefined"},{number:88,name:"highresolutionvelocityprefix",description:"High Resolution Velocity Prefix",position:"lsb"},{number:89,name:"controller89",description:"Undefined"},{number:90,name:"controller90",description:"Undefined"},{number:91,name:"effect1depth",description:"Effects 1 Depth (Reverb Send Level)"},{number:92,name:"effect2depth",description:"Effects 2 Depth"},{number:93,name:"effect3depth",description:"Effects 3 Depth (Chorus Send Level)"},{number:94,name:"effect4depth",description:"Effects 4 Depth"},{number:95,name:"effect5depth",description:"Effects 5 Depth"},{number:96,name:"dataincrement",description:"Data Increment"},{number:97,name:"datadecrement",description:"Data Decrement"},{number:98,name:"nonregisteredparameterfine",description:"Non-Registered Parameter Number (Fine)",position:"lsb"},{number:99,name:"nonregisteredparametercoarse",description:"Non-Registered Parameter Number (Coarse)",position:"msb"},{number:100,name:"registeredparameterfine",description:"Registered Parameter Number (Fine)",position:"lsb"},{number:101,name:"registeredparametercoarse",description:"Registered Parameter Number (Coarse)",position:"msb"},{number:102,name:"controller102",description:"Undefined"},{number:103,name:"controller103",description:"Undefined"},{number:104,name:"controller104",description:"Undefined"},{number:105,name:"controller105",description:"Undefined"},{number:106,name:"controller106",description:"Undefined"},{number:107,name:"controller107",description:"Undefined"},{number:108,name:"controller108",description:"Undefined"},{number:109,name:"controller109",description:"Undefined"},{number:110,name:"controller110",description:"Undefined"},{number:111,name:"controller111",description:"Undefined"},{number:112,name:"controller112",description:"Undefined"},{number:113,name:"controller113",description:"Undefined"},{number:114,name:"controller114",description:"Undefined"},{number:115,name:"controller115",description:"Undefined"},{number:116,name:"controller116",description:"Undefined"},{number:117,name:"controller117",description:"Undefined"},{number:118,name:"controller118",description:"Undefined"},{number:119,name:"controller119",description:"Undefined"},{number:120,name:"allsoundoff",description:"All Sound Off"},{number:121,name:"resetallcontrollers",description:"Reset All Controllers"},{number:122,name:"localcontrol",description:"Local Control On/Off"},{number:123,name:"allnotesoff",description:"All Notes Off"},{number:124,name:"omnimodeoff",description:"Omni Mode Off"},{number:125,name:"omnimodeon",description:"Omni Mode On"},{number:126,name:"monomodeon",description:"Mono Mode On"},{number:127,name:"polymodeon",description:"Poly Mode On"}]}static get REGISTERED_PARAMETERS(){return{pitchbendrange:[0,0],channelfinetuning:[0,1],channelcoarsetuning:[0,2],tuningprogram:[0,3],tuningbank:[0,4],modulationrange:[0,5],azimuthangle:[61,0],elevationangle:[61,1],gain:[61,2],distanceratio:[61,3],maximumdistance:[61,4],maximumdistancegain:[61,5],referencedistanceratio:[61,6],panspreadangle:[61,7],rollangle:[61,8]}}static get MIDI_REGISTERED_PARAMETERS(){return this.validation&&console.warn("The MIDI_REGISTERED_PARAMETERS enum has been deprecated. Use the Enumerations.REGISTERED_PARAMETERS enum instead."),Enumerations.MIDI_REGISTERED_PARAMETERS}static get SYSTEM_MESSAGES(){return{sysex:240,timecode:241,songposition:242,songselect:243,tunerequest:246,tuningrequest:246,sysexend:247,clock:248,start:250,continue:251,stop:252,activesensing:254,reset:255,midimessage:0,unknownsystemmessage:-1}}static get MIDI_SYSTEM_MESSAGES(){return this.validation&&console.warn("The MIDI_SYSTEM_MESSAGES enum has been deprecated. Use the Enumerations.SYSTEM_MESSAGES enum instead."),Enumerations.SYSTEM_MESSAGES}static get CHANNEL_EVENTS(){return["noteoff","controlchange","noteon","keyaftertouch","programchange","channelaftertouch","pitchbend","allnotesoff","allsoundoff","localcontrol","monomode","omnimode","resetallcontrollers","nrpn","nrpn-dataentrycoarse","nrpn-dataentryfine","nrpn-dataincrement","nrpn-datadecrement","rpn","rpn-dataentrycoarse","rpn-dataentryfine","rpn-dataincrement","rpn-datadecrement","nrpn-databuttonincrement","nrpn-databuttondecrement","rpn-databuttonincrement","rpn-databuttondecrement"]}}
/**
 * The `Note` class represents a single musical note such as `"D3"`, `"G#4"`, `"F-1"`, `"Gb7"`, etc.
 *
 * `Note` objects can be played back on a single channel by calling
 * [`OutputChannel.playNote()`]{@link OutputChannel#playNote} or, on multiple channels of the same
 * output, by calling [`Output.playNote()`]{@link Output#playNote}.
 *
 * The note has [`attack`](#attack) and [`release`](#release) velocities set at `0.5` by default.
 * These can be changed by passing in the appropriate option. It is also possible to set a
 * system-wide default for attack and release velocities by using the
 * [`WebMidi.defaults`](WebMidi#defaults) property.
 *
 * If you prefer to work with raw MIDI values (`0` to `127`), you can use [`rawAttack`](#rawAttack) and
 * [`rawRelease`](#rawRelease) to both get and set the values.
 *
 * The note may have a [`duration`](#duration). If it does, playback will be automatically stopped
 * when the duration has elapsed by sending a `"noteoff"` event. By default, the duration is set to
 * `Infinity`. In this case, it will never stop playing unless explicitly stopped by calling a
 * method such as [`OutputChannel.stopNote()`]{@link OutputChannel#stopNote},
 * [`Output.stopNote()`]{@link Output#stopNote} or similar.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */class Note{constructor(e,t={}){this.duration=wm.defaults.note.duration,this.attack=wm.defaults.note.attack,this.release=wm.defaults.note.release,null!=t.duration&&(this.duration=t.duration),null!=t.attack&&(this.attack=t.attack),null!=t.rawAttack&&(this.attack=Utilities.from7bitToFloat(t.rawAttack)),null!=t.release&&(this.release=t.release),null!=t.rawRelease&&(this.release=Utilities.from7bitToFloat(t.rawRelease)),Number.isInteger(e)?this.identifier=Utilities.toNoteIdentifier(e):this.identifier=e}get identifier(){return this._name+(this._accidental||"")+this._octave}set identifier(e){const t=Utilities.getNoteDetails(e);if(wm.validation&&!e)throw new Error("Invalid note identifier");this._name=t.name,this._accidental=t.accidental,this._octave=t.octave}get name(){return this._name}set name(e){if(wm.validation&&(e=e.toUpperCase(),!["C","D","E","F","G","A","B"].includes(e)))throw new Error("Invalid name value");this._name=e}get accidental(){return this._accidental}set accidental(e){if(wm.validation&&(e=e.toLowerCase(),!["#","##","b","bb"].includes(e)))throw new Error("Invalid accidental value");this._accidental=e}get octave(){return this._octave}set octave(e){if(wm.validation&&(e=parseInt(e),isNaN(e)))throw new Error("Invalid octave value");this._octave=e}get duration(){return this._duration}set duration(e){if(wm.validation&&(e=parseFloat(e),isNaN(e)||null===e||e<0))throw new RangeError("Invalid duration value.");this._duration=e}get attack(){return this._attack}set attack(e){if(wm.validation&&(e=parseFloat(e),isNaN(e)||!(e>=0&&e<=1)))throw new RangeError("Invalid attack value.");this._attack=e}get release(){return this._release}set release(e){if(wm.validation&&(e=parseFloat(e),isNaN(e)||!(e>=0&&e<=1)))throw new RangeError("Invalid release value.");this._release=e}get rawAttack(){return Utilities.fromFloatTo7Bit(this._attack)}set rawAttack(e){this._attack=Utilities.from7bitToFloat(e)}get rawRelease(){return Utilities.fromFloatTo7Bit(this._release)}set rawRelease(e){this._release=Utilities.from7bitToFloat(e)}get number(){return Utilities.toNoteNumber(this.identifier)}getOffsetNumber(e=0,t=0){return wm.validation&&(e=parseInt(e)||0,t=parseInt(t)||0),Math.min(Math.max(this.number+12*e+t,0),127)}}
/**
 * The `Utilities` class contains general-purpose utility methods. All methods are static and
 * should be called using the class name. For example: `Utilities.getNoteDetails("C4")`.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */class Utilities{
/**
   * Returns a MIDI note number matching the identifier passed in the form of a string. The
   * identifier must include the octave number. The identifier also optionally include a sharp (#),
   * a double sharp (##), a flat (b) or a double flat (bb) symbol. For example, these are all valid
   * identifiers: C5, G4, D#-1, F0, Gb7, Eb-1, Abb4, B##6, etc.
   *
   * When converting note identifiers to numbers, C4 is considered to be middle C (MIDI note number
   * 60) as per the scientific pitch notation standard.
   *
   * The resulting note number can be offset by using the `octaveOffset` parameter.
   *
   * @param identifier {string} The identifier in the form of a letter, followed by an optional "#",
   * "##", "b" or "bb" followed by the octave number. For exemple: C5, G4, D#-1, F0, Gb7, Eb-1,
   * Abb4, B##6, etc.
   *
   * @param {number} [octaveOffset=0] A integer to offset the octave by.
   *
   * @returns {number} The MIDI note number (an integer between 0 and 127).
   *
   * @throws RangeError Invalid 'octaveOffset' value
   *
   * @throws TypeError Invalid note identifier
   *
   * @license Apache-2.0
   * @since 3.0.0
   * @static
   */
static toNoteNumber(e,t=0){if(t=null==t?0:parseInt(t),isNaN(t))throw new RangeError("Invalid 'octaveOffset' value");"string"!=typeof e&&(e="");const n=this.getNoteDetails(e);if(!n)throw new TypeError("Invalid note identifier");let r=12*(n.octave+1+t);if(r+={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[n.name],n.accidental&&(n.accidental.startsWith("b")?r-=n.accidental.length:r+=n.accidental.length),r<0||r>127)throw new RangeError("Invalid octaveOffset value");return r}static getNoteDetails(e){Number.isInteger(e)&&(e=this.toNoteIdentifier(e));const t=e.match(/^([CDEFGAB])(#{0,2}|b{0,2})(-?\d+)$/i);if(!t)throw new TypeError("Invalid note identifier");const n=t[1].toUpperCase(),r=parseInt(t[3]);let i=t[2].toLowerCase();i=""===i?void 0:i;return{accidental:i,identifier:n+(i||"")+r,name:n,octave:r}}static sanitizeChannels(e){let t;if(wm.validation)if("all"===e)t=["all"];else if("none"===e)return[];return t=Array.isArray(e)?e:[e],t.indexOf("all")>-1&&(t=Enumerations.MIDI_CHANNEL_NUMBERS),t.map((function(e){return parseInt(e)})).filter((function(e){return e>=1&&e<=16}))}static toTimestamp(e){let t=!1;const n=parseFloat(e);return!isNaN(n)&&("string"==typeof e&&"+"===e.substring(0,1)?n>=0&&(t=wm.time+n):n>=0&&(t=n),t)}static guessNoteNumber(e,t){t=parseInt(t)||0;let n=!1;if(Number.isInteger(e)&&e>=0&&e<=127)n=parseInt(e);else if(parseInt(e)>=0&&parseInt(e)<=127)n=parseInt(e);else if("string"==typeof e||e instanceof String)try{n=this.toNoteNumber(e.trim(),t)}catch(e){return!1}return n}static toNoteIdentifier(e,t){if(e=parseInt(e),isNaN(e)||e<0||e>127)throw new RangeError("Invalid note number");if(t=null==t?0:parseInt(t),isNaN(t))throw new RangeError("Invalid octaveOffset value");const n=Math.floor(e/12-1)+t;return["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][e%12]+n.toString()}static buildNote(e,t={}){if(t.octaveOffset=parseInt(t.octaveOffset)||0,e instanceof Note)return e;let n=this.guessNoteNumber(e,t.octaveOffset);if(!1===n)throw new TypeError(`The input could not be parsed as a note (${e})`);return t.octaveOffset=void 0,new Note(n,t)}static buildNoteArray(e,t={}){let n=[];return Array.isArray(e)||(e=[e]),e.forEach(e=>{n.push(this.buildNote(e,t))}),n}static from7bitToFloat(e){return e===1/0&&(e=127),e=parseInt(e)||0,Math.min(Math.max(e/127,0),1)}static fromFloatTo7Bit(e){return e===1/0&&(e=1),e=parseFloat(e)||0,Math.min(Math.max(Math.round(127*e),0),127)}static fromMsbLsbToFloat(e,t=0){wm.validation&&(e=Math.min(Math.max(parseInt(e)||0,0),127),t=Math.min(Math.max(parseInt(t)||0,0),127));const n=((e<<7)+t)/16383;return Math.min(Math.max(n,0),1)}static fromFloatToMsbLsb(e){wm.validation&&(e=Math.min(Math.max(parseFloat(e)||0,0),1));const t=Math.round(16383*e);return{msb:t>>7,lsb:127&t}}static offsetNumber(e,t=0,n=0){if(wm.validation){if(e=parseInt(e),isNaN(e))throw new Error("Invalid note number");t=parseInt(t)||0,n=parseInt(n)||0}return Math.min(Math.max(e+12*t+n,0),127)}static getPropertyByValue(e,t){return Object.keys(e).find(n=>e[n]===t)}static getCcNameByNumber(e){if(!wm.validation||(e=parseInt(e))>=0&&e<=127)return Enumerations.CONTROL_CHANGE_MESSAGES[e].name}static getCcNumberByName(e){let t=Enumerations.CONTROL_CHANGE_MESSAGES.find(t=>t.name===e);return t?t.number:Enumerations.MIDI_CONTROL_CHANGE_MESSAGES[e]}static getChannelModeByNumber(e){if(!(e>=120&&e<=127))return!1;for(let t in Enumerations.CHANNEL_MODE_MESSAGES)if(Enumerations.CHANNEL_MODE_MESSAGES.hasOwnProperty(t)&&e===Enumerations.CHANNEL_MODE_MESSAGES[t])return t;return!1}static get isNode(){return"undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node}static get isBrowser(){return"undefined"!=typeof window&&void 0!==window.document}}
/**
 * The `OutputChannel` class represents a single output MIDI channel. `OutputChannel` objects are
 * provided by an [`Output`](Output) port which, itself, is made available by a device. The
 * `OutputChannel` object is derived from the host's MIDI subsystem and should not be instantiated
 * directly.
 *
 * All 16 `OutputChannel` objects can be found inside the parent output's
 * [`channels`]{@link Output#channels} property.
 *
 * @param {Output} output The [`Output`](Output) this channel belongs to.
 * @param {number} number The MIDI channel number (`1` - `16`).
 *
 * @extends EventEmitter
 * @license Apache-2.0
 * @since 3.0.0
 */class OutputChannel extends EventEmitter{constructor(e,t){super(),this._output=e,this._number=t,this._octaveOffset=0}destroy(){this._output=null,this._number=null,this._octaveOffset=0,this.removeListener()}send(e,t={time:0}){return this.output.send(e,t),this}sendKeyAftertouch(e,t,n={}){if(wm.validation){if(n.useRawValue&&(n.rawValue=n.useRawValue),isNaN(parseFloat(t)))throw new RangeError("Invalid key aftertouch value.");if(n.rawValue){if(!(t>=0&&t<=127&&Number.isInteger(t)))throw new RangeError("Key aftertouch raw value must be an integer between 0 and 127.")}else if(!(t>=0&&t<=1))throw new RangeError("Key aftertouch value must be a float between 0 and 1.")}n.rawValue||(t=Utilities.fromFloatTo7Bit(t));const r=wm.octaveOffset+this.output.octaveOffset+this.octaveOffset;return Array.isArray(e)||(e=[e]),Utilities.buildNoteArray(e).forEach(e=>{this.send([(Enumerations.CHANNEL_MESSAGES.keyaftertouch<<4)+(this.number-1),e.getOffsetNumber(r),t],{time:Utilities.toTimestamp(n.time)})}),this}
/**
   * Sends a MIDI **control change** message to the channel at the scheduled time. The control
   * change message to send can be specified numerically (`0` to `127`) or by using one of the
   * following common names:
   *
   * | Number | Name                          |
   * |--------|-------------------------------|
   * | 0      |`bankselectcoarse`             |
   * | 1      |`modulationwheelcoarse`        |
   * | 2      |`breathcontrollercoarse`       |
   * | 4      |`footcontrollercoarse`         |
   * | 5      |`portamentotimecoarse`         |
   * | 6      |`dataentrycoarse`              |
   * | 7      |`volumecoarse`                 |
   * | 8      |`balancecoarse`                |
   * | 10     |`pancoarse`                    |
   * | 11     |`expressioncoarse`             |
   * | 12     |`effectcontrol1coarse`         |
   * | 13     |`effectcontrol2coarse`         |
   * | 18     |`generalpurposeslider3`        |
   * | 19     |`generalpurposeslider4`        |
   * | 32     |`bankselectfine`               |
   * | 33     |`modulationwheelfine`          |
   * | 34     |`breathcontrollerfine`         |
   * | 36     |`footcontrollerfine`           |
   * | 37     |`portamentotimefine`           |
   * | 38     |`dataentryfine`                |
   * | 39     |`volumefine`                   |
   * | 40     |`balancefine`                  |
   * | 42     |`panfine`                      |
   * | 43     |`expressionfine`               |
   * | 44     |`effectcontrol1fine`           |
   * | 45     |`effectcontrol2fine`           |
   * | 64     |`holdpedal`                    |
   * | 65     |`portamento`                   |
   * | 66     |`sustenutopedal`               |
   * | 67     |`softpedal`                    |
   * | 68     |`legatopedal`                  |
   * | 69     |`hold2pedal`                   |
   * | 70     |`soundvariation`               |
   * | 71     |`resonance`                    |
   * | 72     |`soundreleasetime`             |
   * | 73     |`soundattacktime`              |
   * | 74     |`brightness`                   |
   * | 75     |`soundcontrol6`                |
   * | 76     |`soundcontrol7`                |
   * | 77     |`soundcontrol8`                |
   * | 78     |`soundcontrol9`                |
   * | 79     |`soundcontrol10`               |
   * | 80     |`generalpurposebutton1`        |
   * | 81     |`generalpurposebutton2`        |
   * | 82     |`generalpurposebutton3`        |
   * | 83     |`generalpurposebutton4`        |
   * | 91     |`reverblevel`                  |
   * | 92     |`tremololevel`                 |
   * | 93     |`choruslevel`                  |
   * | 94     |`celestelevel`                 |
   * | 95     |`phaserlevel`                  |
   * | 96     |`dataincrement`                |
   * | 97     |`datadecrement`                |
   * | 98     |`nonregisteredparametercoarse` |
   * | 99     |`nonregisteredparameterfine`   |
   * | 100    |`registeredparametercoarse`    |
   * | 101    |`registeredparameterfine`      |
   * | 120    |`allsoundoff`                  |
   * | 121    |`resetallcontrollers`          |
   * | 122    |`localcontrol`                 |
   * | 123    |`allnotesoff`                  |
   * | 124    |`omnimodeoff`                  |
   * | 125    |`omnimodeon`                   |
   * | 126    |`monomodeon`                   |
   * | 127    |`polymodeon`                   |
   *
   * As you can see above, not all control change message have a matching name. This does not mean
   * you cannot use the others. It simply means you will need to use their number
   * (`0` to `127`) instead of their name. While you can still use them, numbers `120` to `127` are
   * usually reserved for *channel mode* messages. See
   * [`sendChannelMode()`]{@link OutputChannel#sendChannelMode} method for more info.
   *
   * To view a detailed list of all available **control change** messages, please consult "Table 3 -
   * Control Change Messages" from the [MIDI Messages](
   * https://www.midi.org/specifications/item/table-3-control-change-messages-data-bytes-2)
   * specification.
   *
   * **Note**: messages #0-31 (MSB) are paired with messages #32-63 (LSB). For example, message #1
   * (`modulationwheelcoarse`) can be accompanied by a second control change message for
   * `modulationwheelfine` to achieve a greater level of precision. if you want to specify both MSB
   * and LSB for messages between `0` and `31`, you can do so by passing a 2-value array as the
   * second parameter.
   *
   * @param {number|string} controller The MIDI controller name or number (`0` - `127`).
   *
   * @param {number|number[]} value The value to send (0-127). You can also use a two-position array
   * for controllers 0 to 31. In this scenario, the first value will be sent as usual and the second
   * value will be sent to the matching LSB controller (which is obtained by adding 32 to the first
   * controller)
   *
   * @param {object} [options={}]
   *
   * @param {number|string} [options.time=(now)] If `time` is a string prefixed with `"+"` and
   * followed by a number, the message will be delayed by that many milliseconds. If the value is a
   * positive number
   * ([`DOMHighResTimeStamp`]{@link https://developer.mozilla.org/docs/Web/API/DOMHighResTimeStamp}),
   * the operation will be scheduled for that time. The current time can be retrieved with
   * [`WebMidi.time`]{@link WebMidi#time}. If `options.time` is omitted, or in the past, the
   * operation will be carried out as soon as possible.
   *
   * @throws {RangeError} Controller numbers must be between 0 and 127.
   * @throws {RangeError} Invalid controller name.
   * @throws {TypeError} The value array must have a length of 2.
   *
   * @returns {OutputChannel} Returns the `OutputChannel` object so methods can be chained.
   *
   * @license Apache-2.0
   * @since 3.0.0
   */sendControlChange(e,t,n={}){if("string"==typeof e&&(e=Utilities.getCcNumberByName(e)),Array.isArray(t)||(t=[t]),wm.validation){if(void 0===e)throw new TypeError("Control change must be identified with a valid name or an integer between 0 and 127.");if(!Number.isInteger(e)||!(e>=0&&e<=127))throw new TypeError("Control change number must be an integer between 0 and 127.");if(2===(t=t.map(e=>{const t=Math.min(Math.max(parseInt(e),0),127);if(isNaN(t))throw new TypeError("Values must be integers between 0 and 127");return t})).length&&e>=32)throw new TypeError("To use a value array, the controller must be between 0 and 31")}return t.forEach((r,i)=>{this.send([(Enumerations.CHANNEL_MESSAGES.controlchange<<4)+(this.number-1),e+32*i,t[i]],{time:Utilities.toTimestamp(n.time)})}),this}_selectNonRegisteredParameter(e,t={}){return this.sendControlChange(99,e[0],t),this.sendControlChange(98,e[1],t),this}_deselectRegisteredParameter(e={}){return this.sendControlChange(101,127,e),this.sendControlChange(100,127,e),this}_deselectNonRegisteredParameter(e={}){return this.sendControlChange(101,127,e),this.sendControlChange(100,127,e),this}_selectRegisteredParameter(e,t={}){return this.sendControlChange(101,e[0],t),this.sendControlChange(100,e[1],t),this}_setCurrentParameter(e,t={}){return e=[].concat(e),this.sendControlChange(6,e[0],t),e.length<2||this.sendControlChange(38,e[1],t),this}sendRpnDecrement(e,t={}){if(Array.isArray(e)||(e=Enumerations.REGISTERED_PARAMETERS[e]),wm.validation){if(void 0===e)throw new TypeError("The specified registered parameter is invalid.");let t=!1;if(Object.getOwnPropertyNames(Enumerations.REGISTERED_PARAMETERS).forEach(n=>{Enumerations.REGISTERED_PARAMETERS[n][0]===e[0]&&Enumerations.REGISTERED_PARAMETERS[n][1]===e[1]&&(t=!0)}),!t)throw new TypeError("The specified registered parameter is invalid.")}return this._selectRegisteredParameter(e,t),this.sendControlChange(97,0,t),this._deselectRegisteredParameter(t),this}sendRpnIncrement(e,t={}){if(Array.isArray(e)||(e=Enumerations.REGISTERED_PARAMETERS[e]),wm.validation){if(void 0===e)throw new TypeError("The specified registered parameter is invalid.");let t=!1;if(Object.getOwnPropertyNames(Enumerations.REGISTERED_PARAMETERS).forEach(n=>{Enumerations.REGISTERED_PARAMETERS[n][0]===e[0]&&Enumerations.REGISTERED_PARAMETERS[n][1]===e[1]&&(t=!0)}),!t)throw new TypeError("The specified registered parameter is invalid.")}return this._selectRegisteredParameter(e,t),this.sendControlChange(96,0,t),this._deselectRegisteredParameter(t),this}playNote(e,t={}){this.sendNoteOn(e,t);const n=Array.isArray(e)?e:[e];for(let e of n)if(parseInt(e.duration)>0){const n={time:(Utilities.toTimestamp(t.time)||wm.time)+parseInt(e.duration),release:e.release,rawRelease:e.rawRelease};this.sendNoteOff(e,n)}else if(parseInt(t.duration)>0){const n={time:(Utilities.toTimestamp(t.time)||wm.time)+parseInt(t.duration),release:t.release,rawRelease:t.rawRelease};this.sendNoteOff(e,n)}return this}sendNoteOff(e,t={}){if(wm.validation){if(null!=t.rawRelease&&!(t.rawRelease>=0&&t.rawRelease<=127))throw new RangeError("The 'rawRelease' option must be an integer between 0 and 127");if(null!=t.release&&!(t.release>=0&&t.release<=1))throw new RangeError("The 'release' option must be an number between 0 and 1");t.rawVelocity&&(t.rawRelease=t.velocity,console.warn("The 'rawVelocity' option is deprecated. Use 'rawRelease' instead.")),t.velocity&&(t.release=t.velocity,console.warn("The 'velocity' option is deprecated. Use 'attack' instead."))}let n=64;null!=t.rawRelease?n=t.rawRelease:isNaN(t.release)||(n=Math.round(127*t.release));const r=wm.octaveOffset+this.output.octaveOffset+this.octaveOffset;return Utilities.buildNoteArray(e,{rawRelease:parseInt(n)}).forEach(e=>{this.send([(Enumerations.CHANNEL_MESSAGES.noteoff<<4)+(this.number-1),e.getOffsetNumber(r),e.rawRelease],{time:Utilities.toTimestamp(t.time)})}),this}stopNote(e,t={}){return this.sendNoteOff(e,t)}sendNoteOn(e,t={}){if(wm.validation){if(null!=t.rawAttack&&!(t.rawAttack>=0&&t.rawAttack<=127))throw new RangeError("The 'rawAttack' option must be an integer between 0 and 127");if(null!=t.attack&&!(t.attack>=0&&t.attack<=1))throw new RangeError("The 'attack' option must be an number between 0 and 1");t.rawVelocity&&(t.rawAttack=t.velocity,t.rawRelease=t.release,console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' or 'rawRelease'.")),t.velocity&&(t.attack=t.velocity,console.warn("The 'velocity' option is deprecated. Use 'attack' instead."))}let n=64;null!=t.rawAttack?n=t.rawAttack:isNaN(t.attack)||(n=Math.round(127*t.attack));const r=wm.octaveOffset+this.output.octaveOffset+this.octaveOffset;return Utilities.buildNoteArray(e,{rawAttack:n}).forEach(e=>{this.send([(Enumerations.CHANNEL_MESSAGES.noteon<<4)+(this.number-1),e.getOffsetNumber(r),e.rawAttack],{time:Utilities.toTimestamp(t.time)})}),this}sendChannelMode(e,t=0,n={}){if("string"==typeof e&&(e=Enumerations.CHANNEL_MODE_MESSAGES[e]),wm.validation){if(void 0===e)throw new TypeError("Invalid channel mode message name or number.");if(isNaN(e)||!(e>=120&&e<=127))throw new TypeError("Invalid channel mode message number.");if(isNaN(parseInt(t))||t<0||t>127)throw new RangeError("Value must be an integer between 0 and 127.")}return this.send([(Enumerations.CHANNEL_MESSAGES.controlchange<<4)+(this.number-1),e,t],{time:Utilities.toTimestamp(n.time)}),this}sendOmniMode(e,t={}){return void 0===e||e?this.sendChannelMode("omnimodeon",0,t):this.sendChannelMode("omnimodeoff",0,t),this}sendChannelAftertouch(e,t={}){if(wm.validation){if(isNaN(parseFloat(e)))throw new RangeError("Invalid channel aftertouch value.");if(t.rawValue){if(!(e>=0&&e<=127&&Number.isInteger(e)))throw new RangeError("Channel aftertouch raw value must be an integer between 0 and 127.")}else if(!(e>=0&&e<=1))throw new RangeError("Channel aftertouch value must be a float between 0 and 1.")}return this.send([(Enumerations.CHANNEL_MESSAGES.channelaftertouch<<4)+(this.number-1),Math.round(127*e)],{time:Utilities.toTimestamp(t.time)}),this}sendMasterTuning(e,t={}){if(e=parseFloat(e)||0,wm.validation&&!(e>-65&&e<64))throw new RangeError("The value must be a decimal number larger than -65 and smaller than 64.");let n=Math.floor(e)+64,r=e-Math.floor(e);r=Math.round((r+1)/2*16383);let i=r>>7&127,s=127&r;return this.sendRpnValue("channelcoarsetuning",n,t),this.sendRpnValue("channelfinetuning",[i,s],t),this}sendModulationRange(e,t,n={}){if(wm.validation){if(!Number.isInteger(e)||!(e>=0&&e<=127))throw new RangeError("The semitones value must be an integer between 0 and 127.");if(!(null==t||Number.isInteger(t)&&t>=0&&t<=127))throw new RangeError("If specified, the cents value must be an integer between 0 and 127.")}return t>=0&&t<=127||(t=0),this.sendRpnValue("modulationrange",[e,t],n),this}sendNrpnValue(e,t,n={}){if(t=[].concat(t),wm.validation){if(!Array.isArray(e)||!Number.isInteger(e[0])||!Number.isInteger(e[1]))throw new TypeError("The specified NRPN is invalid.");if(!(e[0]>=0&&e[0]<=127))throw new RangeError("The first byte of the NRPN must be between 0 and 127.");if(!(e[1]>=0&&e[1]<=127))throw new RangeError("The second byte of the NRPN must be between 0 and 127.");t.forEach(e=>{if(!(e>=0&&e<=127))throw new RangeError("The data bytes of the NRPN must be between 0 and 127.")})}return this._selectNonRegisteredParameter(e,n),this._setCurrentParameter(t,n),this._deselectNonRegisteredParameter(n),this}sendPitchBend(e,t={}){if(wm.validation)if(t.rawValue&&Array.isArray(e)){if(!(e[0]>=0&&e[0]<=127))throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.");if(!(e[1]>=0&&e[1]<=127))throw new RangeError("The pitch bend LSB must be an integer between 0 and 127.")}else if(t.rawValue&&!Array.isArray(e)){if(!(e>=0&&e<=127))throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.")}else{if(isNaN(e)||null===e)throw new RangeError("Invalid pitch bend value.");if(!(e>=-1&&e<=1))throw new RangeError("The pitch bend value must be a float between -1 and 1.")}let n=0,r=0;if(t.rawValue&&Array.isArray(e))n=e[0],r=e[1];else if(t.rawValue&&!Array.isArray(e))n=e;else{const t=Utilities.fromFloatToMsbLsb((e+1)/2);n=t.msb,r=t.lsb}return this.send([(Enumerations.CHANNEL_MESSAGES.pitchbend<<4)+(this.number-1),r,n],{time:Utilities.toTimestamp(t.time)}),this}sendPitchBendRange(e,t,n={}){if(wm.validation){if(!Number.isInteger(e)||!(e>=0&&e<=127))throw new RangeError("The semitones value must be an integer between 0 and 127.");if(!Number.isInteger(t)||!(t>=0&&t<=127))throw new RangeError("The cents value must be an integer between 0 and 127.")}return this.sendRpnValue("pitchbendrange",[e,t],n),this}sendProgramChange(e,t={}){if(e=parseInt(e)||0,wm.validation&&!(e>=0&&e<=127))throw new RangeError("The program number must be between 0 and 127.");return this.send([(Enumerations.CHANNEL_MESSAGES.programchange<<4)+(this.number-1),e],{time:Utilities.toTimestamp(t.time)}),this}sendRpnValue(e,t,n={}){if(Array.isArray(e)||(e=Enumerations.REGISTERED_PARAMETERS[e]),wm.validation){if(!Number.isInteger(e[0])||!Number.isInteger(e[1]))throw new TypeError("The specified NRPN is invalid.");if(!(e[0]>=0&&e[0]<=127))throw new RangeError("The first byte of the RPN must be between 0 and 127.");if(!(e[1]>=0&&e[1]<=127))throw new RangeError("The second byte of the RPN must be between 0 and 127.");[].concat(t).forEach(e=>{if(!(e>=0&&e<=127))throw new RangeError("The data bytes of the RPN must be between 0 and 127.")})}return this._selectRegisteredParameter(e,n),this._setCurrentParameter(t,n),this._deselectRegisteredParameter(n),this}sendTuningBank(e,t={}){if(wm.validation&&(!Number.isInteger(e)||!(e>=0&&e<=127)))throw new RangeError("The tuning bank number must be between 0 and 127.");return this.sendRpnValue("tuningbank",e,t),this}sendTuningProgram(e,t={}){if(wm.validation&&(!Number.isInteger(e)||!(e>=0&&e<=127)))throw new RangeError("The tuning program number must be between 0 and 127.");return this.sendRpnValue("tuningprogram",e,t),this}sendLocalControl(e,t={}){return e?this.sendChannelMode("localcontrol",127,t):this.sendChannelMode("localcontrol",0,t)}sendAllNotesOff(e={}){return this.sendChannelMode("allnotesoff",0,e)}sendAllSoundOff(e={}){return this.sendChannelMode("allsoundoff",0,e)}sendResetAllControllers(e={}){return this.sendChannelMode("resetallcontrollers",0,e)}sendPolyphonicMode(e,t={}){return"mono"===e?this.sendChannelMode("monomodeon",0,t):this.sendChannelMode("polymodeon",0,t)}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get output(){return this._output}get number(){return this._number}}
/**
 * The `Output` class represents a single MIDI output port (not to be confused with a MIDI channel).
 * A port is made available by a MIDI device. A MIDI device can advertise several input and output
 * ports. Each port has 16 MIDI channels which can be accessed via the [`channels`](#channels)
 * property.
 *
 * The `Output` object is automatically instantiated by the library according to the host's MIDI
 * subsystem and should not be directly instantiated.
 *
 * You can access all available `Output` objects by referring to the
 * [`WebMidi.outputs`](WebMidi#outputs) array or by using methods such as
 * [`WebMidi.getOutputByName()`](WebMidi#getOutputByName) or
 * [`WebMidi.getOutputById()`](WebMidi#getOutputById).
 *
 * @fires Output#opened
 * @fires Output#disconnected
 * @fires Output#closed
 *
 * @extends EventEmitter
 * @license Apache-2.0
 */class Output extends EventEmitter{constructor(e){super(),this._midiOutput=e,this._octaveOffset=0,this.channels=[];for(let e=1;e<=16;e++)this.channels[e]=new OutputChannel(this,e);this._midiOutput.onstatechange=this._onStateChange.bind(this)}async destroy(){this.removeListener(),this.channels.forEach(e=>e.destroy()),this.channels=[],this._midiOutput&&(this._midiOutput.onstatechange=null),await this.close(),this._midiOutput=null}_onStateChange(e){let t={timestamp:wm.time};"open"===e.port.connection?(t.type="opened",t.target=this,t.port=t.target,this.emit("opened",t)):"closed"===e.port.connection&&"connected"===e.port.state?(t.type="closed",t.target=this,t.port=t.target,this.emit("closed",t)):"closed"===e.port.connection&&"disconnected"===e.port.state?(t.type="disconnected",t.port={connection:e.port.connection,id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},this.emit("disconnected",t)):"pending"===e.port.connection&&"disconnected"===e.port.state||console.warn("This statechange event was not caught:",e.port.connection,e.port.state)}async open(){try{return await this._midiOutput.open(),Promise.resolve(this)}catch(e){return Promise.reject(e)}}async close(){this._midiOutput?await this._midiOutput.close():await Promise.resolve()}
/**
   * Sends a MIDI message on the MIDI output port. If no time is specified, the message will be
   * sent immediately. The message should be an array of 8 bit unsigned integers (0-225), a
   * [`Uint8Array`]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array}
   * object or a [`Message`](Message) object.
   *
   * It is usually not necessary to use this method directly as you can use one of the simpler
   * helper methods such as [`playNote()`](#playNote), [`stopNote()`](#stopNote),
   * [`sendControlChange()`](#sendControlChange), etc.
   *
   * Details on the format of MIDI messages are available in the summary of
   * [MIDI messages]{@link https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message}
   * from the MIDI Manufacturers Association.
   *
   * @param message {number[]|Uint8Array|Message} An array of 8bit unsigned integers, a `Uint8Array`
   * object (not available in Node.js) containing the message bytes or a `Message` object.
   *
   * @param {object} [options={}]
   *
   * @param {number|string} [options.time=(now)] If `time` is a string prefixed with `"+"` and
   * followed by a number, the message will be delayed by that many milliseconds. If the value is a
   * positive number
   * ([`DOMHighResTimeStamp`]{@link https://developer.mozilla.org/docs/Web/API/DOMHighResTimeStamp}),
   * the operation will be scheduled for that time. The current time can be retrieved with
   * [`WebMidi.time`]{@link WebMidi#time}. If `options.time` is omitted, or in the past, the
   * operation will be carried out as soon as possible.
   *
   * @throws {RangeError} The first byte (status) must be an integer between 128 and 255.
   *
   * @returns {Output} Returns the `Output` object so methods can be chained.
   *
   * @license Apache-2.0
   */send(e,t={time:0},n=0){if(e instanceof Message&&(e=Utilities.isNode?e.data:e.rawData),e instanceof Uint8Array&&Utilities.isNode&&(e=Array.from(e)),wm.validation){if(Array.isArray(e)||e instanceof Uint8Array||(e=[e],Array.isArray(t)&&(e=e.concat(t)),t=isNaN(n)?{time:0}:{time:n}),!(parseInt(e[0])>=128&&parseInt(e[0])<=255))throw new RangeError("The first byte (status) must be an integer between 128 and 255.");e.slice(1).forEach(e=>{if(!((e=parseInt(e))>=0&&e<=255))throw new RangeError("Data bytes must be integers between 0 and 255.")}),t||(t={time:0})}return this._midiOutput.send(e,Utilities.toTimestamp(t.time)),this}sendSysex(e,t=[],n={}){if(e=[].concat(e),t instanceof Uint8Array){const r=new Uint8Array(1+e.length+t.length+1);r[0]=Enumerations.SYSTEM_MESSAGES.sysex,r.set(Uint8Array.from(e),1),r.set(t,1+e.length),r[r.length-1]=Enumerations.SYSTEM_MESSAGES.sysexend,this.send(r,{time:n.time})}else{const r=e.concat(t,Enumerations.SYSTEM_MESSAGES.sysexend);this.send([Enumerations.SYSTEM_MESSAGES.sysex].concat(r),{time:n.time})}return this}clear(){return this._midiOutput.clear?this._midiOutput.clear():wm.validation&&console.warn("The 'clear()' method has not yet been implemented in your environment."),this}sendTimecodeQuarterFrame(e,t={}){if(wm.validation&&(e=parseInt(e),isNaN(e)||!(e>=0&&e<=127)))throw new RangeError("The value must be an integer between 0 and 127.");return this.send([Enumerations.SYSTEM_MESSAGES.timecode,e],{time:t.time}),this}sendSongPosition(e=0,t={}){var n=(e=Math.floor(e)||0)>>7&127,r=127&e;return this.send([Enumerations.SYSTEM_MESSAGES.songposition,n,r],{time:t.time}),this}sendSongSelect(e=0,t={}){if(wm.validation&&(e=parseInt(e),isNaN(e)||!(e>=0&&e<=127)))throw new RangeError("The program value must be between 0 and 127");return this.send([Enumerations.SYSTEM_MESSAGES.songselect,e],{time:t.time}),this}sendTuneRequest(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.tunerequest],{time:e.time}),this}sendClock(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.clock],{time:e.time}),this}sendStart(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.start],{time:e.time}),this}sendContinue(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.continue],{time:e.time}),this}sendStop(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.stop],{time:e.time}),this}sendActiveSensing(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.activesensing],{time:e.time}),this}sendReset(e={}){return this.send([Enumerations.SYSTEM_MESSAGES.reset],{time:e.time}),this}sendTuningRequest(e={}){return wm.validation&&console.warn("The sendTuningRequest() method has been deprecated. Use sendTuningRequest() instead."),this.sendTuneRequest(e)}sendKeyAftertouch(e,t,n={}){return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendKeyAftertouch(e,t,n)}),this}sendControlChange(e,t,n={},r={}){if(wm.validation&&(Array.isArray(n)||Number.isInteger(n)||"all"===n)){const e=n;(n=r).channels=e,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendControlChange(e,t,n)}),this}sendPitchBendRange(e=0,t=0,n={}){return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendPitchBendRange(e,t,n)}),this}setPitchBendRange(e=0,t=0,n="all",r={}){return wm.validation&&(console.warn("The setPitchBendRange() method is deprecated. Use sendPitchBendRange() instead."),r.channels=n,"all"===r.channels&&(r.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendPitchBendRange(e,t,r)}sendRpnValue(e,t,n={}){return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendRpnValue(e,t,n)}),this}setRegisteredParameter(e,t=[],n="all",r={}){return wm.validation&&(console.warn("The setRegisteredParameter() method is deprecated. Use sendRpnValue() instead."),r.channels=n,"all"===r.channels&&(r.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendRpnValue(e,t,r)}sendChannelAftertouch(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendChannelAftertouch(e,t)}),this}sendPitchBend(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendPitchBend(e,t)}),this}sendProgramChange(e=0,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendProgramChange(e,t)}),this}sendModulationRange(e,t,n={}){return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendModulationRange(e,t,n)}),this}setModulationRange(e=0,t=0,n="all",r={}){return wm.validation&&(console.warn("The setModulationRange() method is deprecated. Use sendModulationRange() instead."),r.channels=n,"all"===r.channels&&(r.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendModulationRange(e,t,r)}sendMasterTuning(e,t={}){return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendMasterTuning(e,t)}),this}setMasterTuning(e,t={},n={}){return wm.validation&&(console.warn("The setMasterTuning() method is deprecated. Use sendMasterTuning() instead."),n.channels=t,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendMasterTuning(e,n)}sendTuningProgram(e,t={}){return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendTuningProgram(e,t)}),this}setTuningProgram(e,t="all",n={}){return wm.validation&&(console.warn("The setTuningProgram() method is deprecated. Use sendTuningProgram() instead."),n.channels=t,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendTuningProgram(e,n)}sendTuningBank(e=0,t={}){return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendTuningBank(e,t)}),this}setTuningBank(e,t="all",n={}){return wm.validation&&(console.warn("The setTuningBank() method is deprecated. Use sendTuningBank() instead."),n.channels=t,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendTuningBank(e,n)}sendChannelMode(e,t=0,n={},r={}){if(wm.validation&&(Array.isArray(n)||Number.isInteger(n)||"all"===n)){const e=n;(n=r).channels=e,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendChannelMode(e,t,n)}),this}sendAllSoundOff(e={}){return null==e.channels&&(e.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(e.channels).forEach(t=>{this.channels[t].sendAllSoundOff(e)}),this}sendAllNotesOff(e={}){return null==e.channels&&(e.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(e.channels).forEach(t=>{this.channels[t].sendAllNotesOff(e)}),this}sendResetAllControllers(e={},t={}){if(wm.validation&&(Array.isArray(e)||Number.isInteger(e)||"all"===e)){const n=e;(e=t).channels=n,"all"===e.channels&&(e.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==e.channels&&(e.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(e.channels).forEach(t=>{this.channels[t].sendResetAllControllers(e)}),this}sendPolyphonicMode(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendPolyphonicMode(e,t)}),this}sendLocalControl(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendLocalControl(e,t)}),this}sendOmniMode(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendOmniMode(e,t)}),this}sendNrpnValue(e,t,n={}){return null==n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendNrpnValue(e,t,n)}),this}setNonRegisteredParameter(e,t=[],n="all",r={}){return wm.validation&&(console.warn("The setNonRegisteredParameter() method is deprecated. Use sendNrpnValue() instead."),r.channels=n,"all"===r.channels&&(r.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendNrpnValue(e,t,r)}sendRpnIncrement(e,t={}){return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendRpnIncrement(e,t)}),this}incrementRegisteredParameter(e,t="all",n={}){return wm.validation&&(console.warn("The incrementRegisteredParameter() method is deprecated. Use sendRpnIncrement() instead."),n.channels=t,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendRpnIncrement(e,n)}sendRpnDecrement(e,t={}){return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendRpnDecrement(e,t)}),this}decrementRegisteredParameter(e,t="all",n={}){return wm.validation&&(console.warn("The decrementRegisteredParameter() method is deprecated. Use sendRpnDecrement() instead."),n.channels=t,"all"===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS)),this.sendRpnDecrement(e,n)}sendNoteOff(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendNoteOff(e,t)}),this}stopNote(e,t){return this.sendNoteOff(e,t)}playNote(e,t={},n={}){if(wm.validation&&(t.rawVelocity&&console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' instead."),t.velocity&&console.warn("The 'velocity' option is deprecated. Use 'velocity' instead."),Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].playNote(e,t)}),this}sendNoteOn(e,t={},n={}){if(wm.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendNoteOn(e,t)}),this}get name(){return this._midiOutput.name}get id(){return this._midiOutput.id}get connection(){return this._midiOutput.connection}get manufacturer(){return this._midiOutput.manufacturer}get state(){return this._midiOutput.state}get type(){return this._midiOutput.type}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}}
/**
 * The `Forwarder` class allows the forwarding of MIDI messages to predetermined outputs. When you
 * call its [`forward()`](#forward) method, it will send the specified [`Message`](Message) object
 * to all the outputs listed in its [`destinations`](#destinations) property.
 *
 * If specific channels or message types have been defined in the [`channels`](#channels) or
 * [`types`](#types) properties, only messages matching the channels/types will be forwarded.
 *
 * While it can be manually instantiated, you are more likely to come across a `Forwarder` object as
 * the return value of the [`Input.addForwarder()`](Input#addForwarder) method.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */class Forwarder{constructor(e=[],t={}){this.destinations=[],this.types=[...Object.keys(Enumerations.SYSTEM_MESSAGES),...Object.keys(Enumerations.CHANNEL_MESSAGES)],this.channels=Enumerations.MIDI_CHANNEL_NUMBERS,this.suspended=!1,Array.isArray(e)||(e=[e]),t.types&&!Array.isArray(t.types)&&(t.types=[t.types]),t.channels&&!Array.isArray(t.channels)&&(t.channels=[t.channels]),wm.validation&&(e.forEach(e=>{if(!(e instanceof Output))throw new TypeError("Destinations must be of type 'Output'.")}),void 0!==t.types&&t.types.forEach(e=>{if(!Enumerations.SYSTEM_MESSAGES.hasOwnProperty(e)&&!Enumerations.CHANNEL_MESSAGES.hasOwnProperty(e))throw new TypeError("Type must be a valid message type.")}),void 0!==t.channels&&t.channels.forEach(e=>{if(!Enumerations.MIDI_CHANNEL_NUMBERS.includes(e))throw new TypeError("MIDI channel must be between 1 and 16.")})),this.destinations=e,t.types&&(this.types=t.types),t.channels&&(this.channels=t.channels)}forward(e){this.suspended||this.types.includes(e.type)&&(e.channel&&!this.channels.includes(e.channel)||this.destinations.forEach(t=>{(!wm.validation||t instanceof Output)&&t.send(e)}))}}
/**
 * The `InputChannel` class represents a single MIDI input channel (1-16) from a single input
 * device. This object is derived from the host's MIDI subsystem and should not be instantiated
 * directly.
 *
 * All 16 `InputChannel` objects can be found inside the input's [`channels`](Input#channels)
 * property.
 *
 * @fires InputChannel#midimessage
 * @fires InputChannel#unknownmessage
 *
 * @fires InputChannel#noteoff
 * @fires InputChannel#noteon
 * @fires InputChannel#keyaftertouch
 * @fires InputChannel#programchange
 * @fires InputChannel#channelaftertouch
 * @fires InputChannel#pitchbend
 *
 * @fires InputChannel#allnotesoff
 * @fires InputChannel#allsoundoff
 * @fires InputChannel#localcontrol
 * @fires InputChannel#monomode
 * @fires InputChannel#omnimode
 * @fires InputChannel#resetallcontrollers
 *
 * @fires InputChannel#event:nrpn
 * @fires InputChannel#event:nrpn-dataentrycoarse
 * @fires InputChannel#event:nrpn-dataentryfine
 * @fires InputChannel#event:nrpn-dataincrement
 * @fires InputChannel#event:nrpn-datadecrement
 * @fires InputChannel#event:rpn
 * @fires InputChannel#event:rpn-dataentrycoarse
 * @fires InputChannel#event:rpn-dataentryfine
 * @fires InputChannel#event:rpn-dataincrement
 * @fires InputChannel#event:rpn-datadecrement
 *
 * @fires InputChannel#controlchange
 * @fires InputChannel#event:controlchange-controllerxxx
 * @fires InputChannel#event:controlchange-bankselectcoarse
 * @fires InputChannel#event:controlchange-modulationwheelcoarse
 * @fires InputChannel#event:controlchange-breathcontrollercoarse
 * @fires InputChannel#event:controlchange-footcontrollercoarse
 * @fires InputChannel#event:controlchange-portamentotimecoarse
 * @fires InputChannel#event:controlchange-dataentrycoarse
 * @fires InputChannel#event:controlchange-volumecoarse
 * @fires InputChannel#event:controlchange-balancecoarse
 * @fires InputChannel#event:controlchange-pancoarse
 * @fires InputChannel#event:controlchange-expressioncoarse
 * @fires InputChannel#event:controlchange-effectcontrol1coarse
 * @fires InputChannel#event:controlchange-effectcontrol2coarse
 * @fires InputChannel#event:controlchange-generalpurposecontroller1
 * @fires InputChannel#event:controlchange-generalpurposecontroller2
 * @fires InputChannel#event:controlchange-generalpurposecontroller3
 * @fires InputChannel#event:controlchange-generalpurposecontroller4
 * @fires InputChannel#event:controlchange-bankselectfine
 * @fires InputChannel#event:controlchange-modulationwheelfine
 * @fires InputChannel#event:controlchange-breathcontrollerfine
 * @fires InputChannel#event:controlchange-footcontrollerfine
 * @fires InputChannel#event:controlchange-portamentotimefine
 * @fires InputChannel#event:controlchange-dataentryfine
 * @fires InputChannel#event:controlchange-channelvolumefine
 * @fires InputChannel#event:controlchange-balancefine
 * @fires InputChannel#event:controlchange-panfine
 * @fires InputChannel#event:controlchange-expressionfine
 * @fires InputChannel#event:controlchange-effectcontrol1fine
 * @fires InputChannel#event:controlchange-effectcontrol2fine
 * @fires InputChannel#event:controlchange-damperpedal
 * @fires InputChannel#event:controlchange-portamento
 * @fires InputChannel#event:controlchange-sostenuto
 * @fires InputChannel#event:controlchange-softpedal
 * @fires InputChannel#event:controlchange-legatopedal
 * @fires InputChannel#event:controlchange-hold2
 * @fires InputChannel#event:controlchange-soundvariation
 * @fires InputChannel#event:controlchange-resonance
 * @fires InputChannel#event:controlchange-releasetime
 * @fires InputChannel#event:controlchange-attacktime
 * @fires InputChannel#event:controlchange-brightness
 * @fires InputChannel#event:controlchange-decaytime
 * @fires InputChannel#event:controlchange-vibratorate
 * @fires InputChannel#event:controlchange-vibratodepth
 * @fires InputChannel#event:controlchange-vibratodelay
 * @fires InputChannel#event:controlchange-generalpurposecontroller5
 * @fires InputChannel#event:controlchange-generalpurposecontroller6
 * @fires InputChannel#event:controlchange-generalpurposecontroller7
 * @fires InputChannel#event:controlchange-generalpurposecontroller8
 * @fires InputChannel#event:controlchange-portamentocontrol
 * @fires InputChannel#event:controlchange-highresolutionvelocityprefix
 * @fires InputChannel#event:controlchange-effect1depth
 * @fires InputChannel#event:controlchange-effect2depth
 * @fires InputChannel#event:controlchange-effect3depth
 * @fires InputChannel#event:controlchange-effect4depth
 * @fires InputChannel#event:controlchange-effect5depth
 * @fires InputChannel#event:controlchange-dataincrement
 * @fires InputChannel#event:controlchange-datadecrement
 * @fires InputChannel#event:controlchange-nonregisteredparameterfine
 * @fires InputChannel#event:controlchange-nonregisteredparametercoarse
 * @fires InputChannel#event:controlchange-registeredparameterfine
 * @fires InputChannel#event:controlchange-registeredparametercoarse
 * @fires InputChannel#event:controlchange-allsoundoff
 * @fires InputChannel#event:controlchange-resetallcontrollers
 * @fires InputChannel#event:controlchange-localcontrol
 * @fires InputChannel#event:controlchange-allnotesoff
 * @fires InputChannel#event:controlchange-omnimodeoff
 * @fires InputChannel#event:controlchange-omnimodeon
 * @fires InputChannel#event:controlchange-monomodeon
 * @fires InputChannel#event:controlchange-polymodeon
 * @fires InputChannel#event:
 *
 * @extends EventEmitter
 * @license Apache-2.0
 * @since 3.0.0
 */class InputChannel extends EventEmitter{constructor(e,t){super(),this._input=e,this._number=t,this._octaveOffset=0,this._nrpnBuffer=[],this._rpnBuffer=[],this.parameterNumberEventsEnabled=!0,this.notesState=new Array(128).fill(!1)}destroy(){this._input=null,this._number=null,this._octaveOffset=0,this._nrpnBuffer=[],this.notesState=new Array(128).fill(!1),this.parameterNumberEventsEnabled=!1,this.removeListener()}_processMidiMessageEvent(e){const t=Object.assign({},e);t.port=this.input,t.target=this,t.type="midimessage",this.emit(t.type,t),this._parseEventForStandardMessages(t)}_parseEventForStandardMessages(e){const t=Object.assign({},e);t.type=t.message.type||"unknownmessage";const n=e.message.dataBytes[0],r=e.message.dataBytes[1];if("noteoff"===t.type||"noteon"===t.type&&0===r)this.notesState[n]=!1,t.type="noteoff",t.note=new Note(Utilities.offsetNumber(n,this.octaveOffset+this.input.octaveOffset+wm.octaveOffset),{rawAttack:0,rawRelease:r}),t.value=Utilities.from7bitToFloat(r),t.rawValue=r,t.velocity=t.note.release,t.rawVelocity=t.note.rawRelease;else if("noteon"===t.type)this.notesState[n]=!0,t.note=new Note(Utilities.offsetNumber(n,this.octaveOffset+this.input.octaveOffset+wm.octaveOffset),{rawAttack:r}),t.value=Utilities.from7bitToFloat(r),t.rawValue=r,t.velocity=t.note.attack,t.rawVelocity=t.note.rawAttack;else if("keyaftertouch"===t.type)t.note=new Note(Utilities.offsetNumber(n,this.octaveOffset+this.input.octaveOffset+wm.octaveOffset)),t.value=Utilities.from7bitToFloat(r),t.rawValue=r,t.identifier=t.note.identifier,t.key=t.note.number,t.rawKey=n;else if("controlchange"===t.type){t.controller={number:n,name:Enumerations.CONTROL_CHANGE_MESSAGES[n].name,description:Enumerations.CONTROL_CHANGE_MESSAGES[n].description,position:Enumerations.CONTROL_CHANGE_MESSAGES[n].position},t.subtype=t.controller.name||"controller"+n,t.value=Utilities.from7bitToFloat(r),t.rawValue=r;const e=Object.assign({},t);e.type=`${t.type}-controller${n}`,delete e.subtype,this.emit(e.type,e);const i=Object.assign({},t);i.type=t.type+"-"+Enumerations.CONTROL_CHANGE_MESSAGES[n].name,delete i.subtype,0!==i.type.indexOf("controller")&&this.emit(i.type,i),t.message.dataBytes[0]>=120&&this._parseChannelModeMessage(t),this.parameterNumberEventsEnabled&&this._isRpnOrNrpnController(t.message.dataBytes[0])&&this._parseEventForParameterNumber(t)}else"programchange"===t.type?(t.value=n,t.rawValue=t.value):"channelaftertouch"===t.type?(t.value=Utilities.from7bitToFloat(n),t.rawValue=n):"pitchbend"===t.type?(t.value=((r<<7)+n-8192)/8192,t.rawValue=(r<<7)+n):t.type="unknownmessage";this.emit(t.type,t)}_parseChannelModeMessage(e){const t=Object.assign({},e);t.type=t.controller.name,"localcontrol"===t.type&&(t.value=127===t.message.data[2],t.rawValue=t.message.data[2]),"omnimodeon"===t.type?(t.type="omnimode",t.value=!0,t.rawValue=t.message.data[2]):"omnimodeoff"===t.type&&(t.type="omnimode",t.value=!1,t.rawValue=t.message.data[2]),"monomodeon"===t.type?(t.type="monomode",t.value=!0,t.rawValue=t.message.data[2]):"polymodeon"===t.type&&(t.type="monomode",t.value=!1,t.rawValue=t.message.data[2]),this.emit(t.type,t)}_parseEventForParameterNumber(e){const t=e.message.dataBytes[0],n=e.message.dataBytes[1];99===t||101===t?(this._nrpnBuffer=[],this._rpnBuffer=[],99===t?this._nrpnBuffer=[e.message]:127!==n&&(this._rpnBuffer=[e.message])):98===t||100===t?98===t?(this._rpnBuffer=[],1===this._nrpnBuffer.length?this._nrpnBuffer.push(e.message):this._nrpnBuffer=[]):(this._nrpnBuffer=[],1===this._rpnBuffer.length&&127!==n?this._rpnBuffer.push(e.message):this._rpnBuffer=[]):6!==t&&38!==t&&96!==t&&97!==t||(2===this._rpnBuffer.length?this._dispatchParameterNumberEvent("rpn",this._rpnBuffer[0].dataBytes[1],this._rpnBuffer[1].dataBytes[1],e):2===this._nrpnBuffer.length?this._dispatchParameterNumberEvent("nrpn",this._nrpnBuffer[0].dataBytes[1],this._nrpnBuffer[1].dataBytes[1],e):(this._nrpnBuffer=[],this._rpnBuffer=[]))}_isRpnOrNrpnController(e){return 6===e||38===e||96===e||97===e||98===e||99===e||100===e||101===e}_dispatchParameterNumberEvent(e,t,n,r){e="nrpn"===e?"nrpn":"rpn";const i={target:r.target,timestamp:r.timestamp,message:r.message,parameterMsb:t,parameterLsb:n,value:Utilities.from7bitToFloat(r.message.dataBytes[1]),rawValue:r.message.dataBytes[1]};i.parameter="rpn"===e?Object.keys(Enumerations.REGISTERED_PARAMETERS).find(e=>Enumerations.REGISTERED_PARAMETERS[e][0]===t&&Enumerations.REGISTERED_PARAMETERS[e][1]===n):(t<<7)+n;const s=Enumerations.CONTROL_CHANGE_MESSAGES[r.message.dataBytes[0]].name;i.type=`${e}-${s}`,this.emit(i.type,i);const a=Object.assign({},i);"nrpn-dataincrement"===a.type?a.type="nrpn-databuttonincrement":"nrpn-datadecrement"===a.type?a.type="nrpn-databuttondecrement":"rpn-dataincrement"===a.type?a.type="rpn-databuttonincrement":"rpn-datadecrement"===a.type&&(a.type="rpn-databuttondecrement"),this.emit(a.type,a),i.type=e,i.subtype=s,this.emit(i.type,i)}getChannelModeByNumber(e){return wm.validation&&(console.warn("The 'getChannelModeByNumber()' method has been moved to the 'Utilities' class."),e=Math.floor(e)),Utilities.getChannelModeByNumber(e)}getCcNameByNumber(e){if(wm.validation&&(console.warn("The 'getCcNameByNumber()' method has been moved to the 'Utilities' class."),!((e=parseInt(e))>=0&&e<=127)))throw new RangeError("Invalid control change number.");return Utilities.getCcNameByNumber(e)}getNoteState(e){e instanceof Note&&(e=e.identifier);const t=Utilities.guessNoteNumber(e,wm.octaveOffset+this.input.octaveOffset+this.octaveOffset);return this.notesState[t]}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get input(){return this._input}get number(){return this._number}get nrpnEventsEnabled(){return this.parameterNumberEventsEnabled}set nrpnEventsEnabled(e){this.validation&&(e=!!e),this.parameterNumberEventsEnabled=e}}
/**
 * The `Message` class represents a single MIDI message. It has several properties that make it
 * easy to make sense of the binary data it contains.
 *
 * @license Apache-2.0
 * @since 3.0.0
 */class Message{constructor(e){this.rawData=e,this.data=Array.from(this.rawData),this.statusByte=this.rawData[0],this.rawDataBytes=this.rawData.slice(1),this.dataBytes=this.data.slice(1),this.isChannelMessage=!1,this.isSystemMessage=!1,this.command=void 0,this.channel=void 0,this.manufacturerId=void 0,this.type=void 0,this.statusByte<240?(this.isChannelMessage=!0,this.command=this.statusByte>>4,this.channel=1+(15&this.statusByte)):(this.isSystemMessage=!0,this.command=this.statusByte),this.isChannelMessage?this.type=Utilities.getPropertyByValue(Enumerations.CHANNEL_MESSAGES,this.command):this.isSystemMessage&&(this.type=Utilities.getPropertyByValue(Enumerations.SYSTEM_MESSAGES,this.command)),this.statusByte===Enumerations.SYSTEM_MESSAGES.sysex&&(0===this.dataBytes[0]?(this.manufacturerId=this.dataBytes.slice(0,3),this.dataBytes=this.dataBytes.slice(3,this.rawDataBytes.length-1),this.rawDataBytes=this.rawDataBytes.slice(3,this.rawDataBytes.length-1)):(this.manufacturerId=[this.dataBytes[0]],this.dataBytes=this.dataBytes.slice(1,this.dataBytes.length-1),this.rawDataBytes=this.rawDataBytes.slice(1,this.rawDataBytes.length-1)))}}
/**
 * The `Input` class represents a single MIDI input port. This object is automatically instantiated
 * by the library according to the host's MIDI subsystem and does not need to be directly
 * instantiated. Instead, you can access all `Input` objects by referring to the
 * [`WebMidi.inputs`](WebMidi#inputs) array. You can also retrieve inputs by using methods such as
 * [`WebMidi.getInputByName()`](WebMidi#getInputByName) and
 * [`WebMidi.getInputById()`](WebMidi#getInputById).
 *
 * Note that a single MIDI device may expose several inputs and/or outputs.
 *
 * **Important**: the `Input` class does not directly fire channel-specific MIDI messages
 * (such as [`noteon`](InputChannel#event:noteon) or
 * [`controlchange`](InputChannel#event:controlchange), etc.). The [`InputChannel`](InputChannel)
 * object does that. However, you can still use the
 * [`Input.addListener()`](#addListener) method to listen to channel-specific events on multiple
 * [`InputChannel`](InputChannel) objects at once.
 *
 * @fires Input#opened
 * @fires Input#disconnected
 * @fires Input#closed
 * @fires Input#midimessage
 *
 * @fires Input#sysex
 * @fires Input#timecode
 * @fires Input#songposition
 * @fires Input#songselect
 * @fires Input#tunerequest
 * @fires Input#clock
 * @fires Input#start
 * @fires Input#continue
 * @fires Input#stop
 * @fires Input#activesensing
 * @fires Input#reset
 *
 * @fires Input#unknownmidimessage
 *
 * @extends EventEmitter
 * @license Apache-2.0
 */class Input extends EventEmitter{constructor(e){super(),this._midiInput=e,this._octaveOffset=0,this.channels=[];for(let e=1;e<=16;e++)this.channels[e]=new InputChannel(this,e);this._forwarders=[],this._midiInput.onstatechange=this._onStateChange.bind(this),this._midiInput.onmidimessage=this._onMidiMessage.bind(this)}async destroy(){this.removeListener(),this.channels.forEach(e=>e.destroy()),this.channels=[],this._forwarders=[],this._midiInput&&(this._midiInput.onstatechange=null,this._midiInput.onmidimessage=null),await this.close(),this._midiInput=null}_onStateChange(e){let t={timestamp:wm.time,target:this,port:this};"open"===e.port.connection?(t.type="opened",this.emit("opened",t)):"closed"===e.port.connection&&"connected"===e.port.state?(t.type="closed",this.emit("closed",t)):"closed"===e.port.connection&&"disconnected"===e.port.state?(t.type="disconnected",t.port={connection:e.port.connection,id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},this.emit("disconnected",t)):"pending"===e.port.connection&&"disconnected"===e.port.state||console.warn("This statechange event was not caught: ",e.port.connection,e.port.state)}_onMidiMessage(e){const t=new Message(e.data),n={port:this,target:this,message:t,timestamp:e.timeStamp,type:"midimessage",data:t.data,rawData:t.data,statusByte:t.data[0],dataBytes:t.dataBytes};this.emit("midimessage",n),t.isSystemMessage?this._parseEvent(n):t.isChannelMessage&&this.channels[t.channel]._processMidiMessageEvent(n),this._forwarders.forEach(e=>e.forward(t))}_parseEvent(e){const t=Object.assign({},e);t.type=t.message.type||"unknownmidimessage","songselect"===t.type&&(t.song=e.data[1]+1,t.value=e.data[1],t.rawValue=t.value),this.emit(t.type,t)}async open(){try{await this._midiInput.open()}catch(e){return Promise.reject(e)}return Promise.resolve(this)}async close(){if(!this._midiInput)return Promise.resolve(this);try{await this._midiInput.close()}catch(e){return Promise.reject(e)}return Promise.resolve(this)}getChannelModeByNumber(){wm.validation&&console.warn("The 'getChannelModeByNumber()' method has been moved to the 'Utilities' class.")}addListener(e,t,n={}){if(wm.validation&&"function"==typeof n){let e=null!=t?[].concat(t):void 0;t=n,n={channels:e}}if(Enumerations.CHANNEL_EVENTS.includes(e)){void 0===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS);let r=[];return Utilities.sanitizeChannels(n.channels).forEach(i=>{r.push(this.channels[i].addListener(e,t,n))}),r}return super.addListener(e,t,n)}addOneTimeListener(e,t,n={}){return n.remaining=1,this.addListener(e,t,n)}on(e,t,n,r){return this.addListener(e,t,n,r)}hasListener(e,t,n={}){if(wm.validation&&"function"==typeof n){let e=[].concat(t);t=n,n={channels:e}}return Enumerations.CHANNEL_EVENTS.includes(e)?(void 0===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),Utilities.sanitizeChannels(n.channels).every(n=>this.channels[n].hasListener(e,t))):super.hasListener(e,t)}removeListener(e,t,n={}){if(wm.validation&&"function"==typeof n){let e=[].concat(t);t=n,n={channels:e}}if(void 0===n.channels&&(n.channels=Enumerations.MIDI_CHANNEL_NUMBERS),null==e)return Utilities.sanitizeChannels(n.channels).forEach(e=>{this.channels[e]&&this.channels[e].removeListener()}),super.removeListener();Enumerations.CHANNEL_EVENTS.includes(e)?Utilities.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].removeListener(e,t,n)}):super.removeListener(e,t,n)}addForwarder(e,t={}){let n;return n=e instanceof Forwarder?e:new Forwarder(e,t),this._forwarders.push(n),n}removeForwarder(e){this._forwarders=this._forwarders.filter(t=>t!==e)}hasForwarder(e){return this._forwarders.includes(e)}get name(){return this._midiInput.name}get id(){return this._midiInput.id}get connection(){return this._midiInput.connection}get manufacturer(){return this._midiInput.manufacturer}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get state(){return this._midiInput.state}get type(){return this._midiInput.type}get nrpnEventsEnabled(){return wm.validation&&console.warn("The 'nrpnEventsEnabled' property has been moved to the 'InputChannel' class."),!1}}if(Utilities.isNode){try{window.navigator}catch(err){let jzz;eval('jzz = require("jzz")'),global.navigator=jzz}try{performance}catch(err){let performance;eval('performance = require("perf_hooks").performance'),global.performance=performance}}
/**
 * The `WebMidi` object makes it easier to work with the low-level Web MIDI API. Basically, it
 * simplifies sending outgoing MIDI messages and reacting to incoming MIDI messages.
 *
 * When using the WebMidi.js library, you should know that the `WebMidi` class has already been
 * instantiated. You cannot instantiate it yourself. If you use the **IIFE** version, you should
 * simply use the global object called `WebMidi`. If you use the **CJS** (CommonJS) or **ESM** (ES6
 * module) version, you get an already-instantiated object when you import the module.
 *
 * @fires WebMidi#connected
 * @fires WebMidi#disabled
 * @fires WebMidi#disconnected
 * @fires WebMidi#enabled
 * @fires WebMidi#error
 * @fires WebMidi#midiaccessgranted
 * @fires WebMidi#portschanged
 *
 * @extends EventEmitter
 * @license Apache-2.0
 */class WebMidi extends EventEmitter{constructor(){super(),this.defaults={note:{attack:Utilities.from7bitToFloat(64),release:Utilities.from7bitToFloat(64),duration:1/0}},this.interface=null,this.validation=!0,this._inputs=[],this._disconnectedInputs=[],this._outputs=[],this._disconnectedOutputs=[],this._stateChangeQueue=[],this._octaveOffset=0}async enable(e={},t=!1){if(this.validation=!1!==e.validation,this.validation&&("function"==typeof e&&(e={callback:e,sysex:t}),t&&(e.sysex=!0)),this.enabled)return"function"==typeof e.callback&&e.callback(),Promise.resolve();const n={timestamp:this.time,target:this,type:"error",error:void 0},r={timestamp:this.time,target:this,type:"midiaccessgranted"},i={timestamp:this.time,target:this,type:"enabled"};try{"function"==typeof e.requestMIDIAccessFunction?this.interface=await e.requestMIDIAccessFunction({sysex:e.sysex,software:e.software}):this.interface=await navigator.requestMIDIAccess({sysex:e.sysex,software:e.software})}catch(t){return n.error=t,this.emit("error",n),"function"==typeof e.callback&&e.callback(t),Promise.reject(t)}this.emit("midiaccessgranted",r),this.interface.onstatechange=this._onInterfaceStateChange.bind(this);try{await this._updateInputsAndOutputs()}catch(t){return n.error=t,this.emit("error",n),"function"==typeof e.callback&&e.callback(t),Promise.reject(t)}return this.emit("enabled",i),"function"==typeof e.callback&&e.callback(),Promise.resolve(this)}async disable(){return this.interface&&(this.interface.onstatechange=void 0),this._destroyInputsAndOutputs().then(()=>{navigator&&"function"==typeof navigator.close&&navigator.close(),this.interface=null;let e={timestamp:this.time,target:this,type:"disabled"};this.emit("disabled",e),this.removeListener()})}getInputById(e,t={disconnected:!1}){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return}if(t.disconnected){for(let t=0;t<this._disconnectedInputs.length;t++)if(this._disconnectedInputs[t].id===e.toString())return this._disconnectedInputs[t]}else for(let t=0;t<this.inputs.length;t++)if(this.inputs[t].id===e.toString())return this.inputs[t]}getInputByName(e,t={disconnected:!1}){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return;e=e.toString()}if(t.disconnected){for(let t=0;t<this._disconnectedInputs.length;t++)if(~this._disconnectedInputs[t].name.indexOf(e))return this._disconnectedInputs[t]}else for(let t=0;t<this.inputs.length;t++)if(~this.inputs[t].name.indexOf(e))return this.inputs[t]}getOutputByName(e,t={disconnected:!1}){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return;e=e.toString()}if(t.disconnected){for(let t=0;t<this._disconnectedOutputs.length;t++)if(~this._disconnectedOutputs[t].name.indexOf(e))return this._disconnectedOutputs[t]}else for(let t=0;t<this.outputs.length;t++)if(~this.outputs[t].name.indexOf(e))return this.outputs[t]}getOutputById(e,t={disconnected:!1}){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return}if(t.disconnected){for(let t=0;t<this._disconnectedOutputs.length;t++)if(this._disconnectedOutputs[t].id===e.toString())return this._disconnectedOutputs[t]}else for(let t=0;t<this.outputs.length;t++)if(this.outputs[t].id===e.toString())return this.outputs[t]}noteNameToNumber(e){return this.validation&&console.warn("The noteNameToNumber() method is deprecated. Use Utilities.toNoteNumber() instead."),Utilities.toNoteNumber(e,this.octaveOffset)}getOctave(e){return this.validation&&(console.warn("The getOctave()is deprecated. Use Utilities.getNoteDetails() instead"),e=parseInt(e)),!isNaN(e)&&e>=0&&e<=127&&Utilities.getNoteDetails(Utilities.offsetNumber(e,this.octaveOffset)).octave}sanitizeChannels(e){return this.validation&&console.warn("The sanitizeChannels() method has been moved to the utilities class."),Utilities.sanitizeChannels(e)}toMIDIChannels(e){return this.validation&&console.warn("The toMIDIChannels() method has been deprecated. Use Utilities.sanitizeChannels() instead."),Utilities.sanitizeChannels(e)}guessNoteNumber(e){return this.validation&&console.warn("The guessNoteNumber() method has been deprecated. Use Utilities.guessNoteNumber() instead."),Utilities.guessNoteNumber(e,this.octaveOffset)}getValidNoteArray(e,t={}){return this.validation&&console.warn("The getValidNoteArray() method has been moved to the Utilities.buildNoteArray()"),Utilities.buildNoteArray(e,t)}convertToTimestamp(e){return this.validation&&console.warn("The convertToTimestamp() method has been moved to Utilities.toTimestamp()."),Utilities.toTimestamp(e)}async _destroyInputsAndOutputs(){let e=[];return this.inputs.forEach(t=>e.push(t.destroy())),this.outputs.forEach(t=>e.push(t.destroy())),Promise.all(e).then(()=>{this._inputs=[],this._outputs=[]})}_onInterfaceStateChange(e){this._updateInputsAndOutputs();let t={timestamp:e.timeStamp,type:e.port.state,target:this};if("connected"===e.port.state&&"open"===e.port.connection){"output"===e.port.type?t.port=this.getOutputById(e.port.id):"input"===e.port.type&&(t.port=this.getInputById(e.port.id)),this.emit(e.port.state,t);const n=Object.assign({},t);n.type="portschanged",this.emit(n.type,n)}else if("disconnected"===e.port.state&&"pending"===e.port.connection){"input"===e.port.type?t.port=this.getInputById(e.port.id,{disconnected:!0}):"output"===e.port.type&&(t.port=this.getOutputById(e.port.id,{disconnected:!0})),this.emit(e.port.state,t);const n=Object.assign({},t);n.type="portschanged",this.emit(n.type,n)}}async _updateInputsAndOutputs(){return Promise.all([this._updateInputs(),this._updateOutputs()])}async _updateInputs(){if(!this.interface)return;for(let e=this._inputs.length-1;e>=0;e--){const t=this._inputs[e];Array.from(this.interface.inputs.values()).find(e=>e===t._midiInput)||(this._disconnectedInputs.push(t),this._inputs.splice(e,1))}let e=[];return this.interface.inputs.forEach(t=>{if(!this._inputs.find(e=>e._midiInput===t)){let n=this._disconnectedInputs.find(e=>e._midiInput===t);n||(n=new Input(t)),this._inputs.push(n),e.push(n.open())}}),Promise.all(e)}async _updateOutputs(){if(!this.interface)return;for(let e=this._outputs.length-1;e>=0;e--){const t=this._outputs[e];Array.from(this.interface.outputs.values()).find(e=>e===t._midiOutput)||(this._disconnectedOutputs.push(t),this._outputs.splice(e,1))}let e=[];return this.interface.outputs.forEach(t=>{if(!this._outputs.find(e=>e._midiOutput===t)){let n=this._disconnectedOutputs.find(e=>e._midiOutput===t);n||(n=new Output(t)),this._outputs.push(n),e.push(n.open())}}),Promise.all(e)}get enabled(){return null!==this.interface}get inputs(){return this._inputs}get isNode(){return this.validation&&console.warn("WebMidi.isNode has been deprecated. Use Utilities.isNode instead."),Utilities.isNode}get isBrowser(){return this.validation&&console.warn("WebMidi.isBrowser has been deprecated. Use Utilities.isBrowser instead."),Utilities.isBrowser}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get outputs(){return this._outputs}get supported(){return"undefined"!=typeof navigator&&navigator.requestMIDIAccess}get sysexEnabled(){return!(!this.interface||!this.interface.sysexEnabled)}get time(){return performance.now()}get version(){return"3.1.6"}get flavour(){return"cjs"}get CHANNEL_EVENTS(){return this.validation&&console.warn("The CHANNEL_EVENTS enum has been moved to Enumerations.CHANNEL_EVENTS."),Enumerations.CHANNEL_EVENTS}get MIDI_SYSTEM_MESSAGES(){return this.validation&&console.warn("The MIDI_SYSTEM_MESSAGES enum has been moved to Enumerations.SYSTEM_MESSAGES."),Enumerations.SYSTEM_MESSAGES}get MIDI_CHANNEL_MODE_MESSAGES(){return this.validation&&console.warn("The MIDI_CHANNEL_MODE_MESSAGES enum has been moved to Enumerations.CHANNEL_MODE_MESSAGES."),Enumerations.CHANNEL_MODE_MESSAGES}get MIDI_CONTROL_CHANGE_MESSAGES(){return this.validation&&console.warn("The MIDI_CONTROL_CHANGE_MESSAGES enum has been replaced by the Enumerations.CONTROL_CHANGE_MESSAGES array."),Enumerations.MIDI_CONTROL_CHANGE_MESSAGES}get MIDI_REGISTERED_PARAMETER(){return this.validation&&console.warn("The MIDI_REGISTERED_PARAMETER enum has been moved to Enumerations.REGISTERED_PARAMETERS."),Enumerations.REGISTERED_PARAMETERS}get NOTES(){return this.validation&&console.warn("The NOTES enum has been deprecated."),["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]}}const wm=new WebMidi;wm.constructor=null,exports.Enumerations=Enumerations,exports.Forwarder=Forwarder,exports.Input=Input,exports.InputChannel=InputChannel,exports.Message=Message,exports.Note=Note,exports.Output=Output,exports.OutputChannel=OutputChannel,exports.Utilities=Utilities,exports.WebMidi=wm;


}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":35}],56:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const TL = require('total-serialism').Translate;

// all the available effects
const fxMap = {
	'drive' : (params) => {
		return new TanhDistortion(params);
	},
	'distort' : (params) => {
		return new TanhDistortion(params);
	},
	'overdrive' : (params) => {
		return new TanhDistortion(params);
	},
	'squash' : (params) => {
		return new Squash(params);
	},
	'compress' : (params) => {
		return new Compressor(params);
	},
	'compressor' : (params) => {
		return new Compressor(params);
	},
	'comp' : (params) => {
		return new Compressor(params);
	},
	'lfo' : (params) => {
		return new LFO(params);
	},
	'tremolo' : (params) => {
		return new LFO(params);
	},
	'flutter' : (params) => {
		return new LFO(params);
	},
	'chip' : (params) => {
		return new DownSampler(params);
	},
	'degrade' : (params) => {
		return new DownSampler(params);
	},
	'reverb' : (params) => {
		return new Reverb(params);
	},
	'shift' : (params) => {
		return new PitchShift(params);
	},
	'pitchShift' : (params) => {
		return new PitchShift(params);
	},
	'tune' : (params) => {
		return new PitchShift(params);
	},
	'filter' : (params) => {
		return new Filter(params);
	},
	'triggerFilter' : (params) => {
		return new TriggerFilter(params);
	},
	'envFilter' : (params) => {
		return new TriggerFilter(params);
	},
	/*'autoFilter' : (params) => {
		return new AutoFilter(params);
	},
	'wobble' : (params) => {
		return fxMap.autoFilter(params);
	},*/
	'delay' : (params) => {
		return new Delay(params);
	},
	'echo' : (params) => {
		return new Delay(params);
	},
	'ppDelay' : (params) => {
		return new PingPongDelay(params);
	},
	'freeverb' : (params) => {
		return new FreeVerb(params);
	}
}
module.exports = fxMap;

// A Downsampling Chiptune effect. Downsamples the signal by a specified amount
// Resulting in a lower samplerate, making it sound more like 8bit/chiptune
// Programmed with a custom AudioWorkletProcessor, see effects/Processors.js
//
const DownSampler = function(_params){
	this._down = (_params[0])? Util.toArray(_params[0]) : [0.5];

	// ToneAudioNode has all the tone effect parameters
	this._fx = new Tone.ToneAudioNode();
	// A gain node for connecting with input and output
	this._fx.input = new Tone.Gain(1);
	this._fx.output = new Tone.Gain(1);
	// the fx processor
	this._fx.workletNode = Tone.getContext().createAudioWorkletNode('downsampler-processor');
	// connect input, fx and output
	this._fx.input.chain(this._fx.workletNode, this._fx.output);

	this.set = function(c, time, bpm){
		// some parameter mapping changing input range 0-1 to 1-inf
		let p = this._fx.workletNode.parameters.get('down');
		let d = Math.floor(1 / (1 - Util.clip(Util.getParam(this._down, c) ** 0.25, 0, 0.999)));
		p.setValueAtTime(Util.assureNum(d), time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx }
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// A distortion algorithm using the tanh (hyperbolic-tangent) as a 
// waveshaping technique. Some mapping to apply a more equal loudness 
// distortion is applied on the overdrive parameter
//
const TanhDistortion = function(_params){
	this._drive = (_params[0])? Util.toArray(_params[0]) : [4];

	// ToneAudioNode has all the tone effect parameters
	this._fx = new Tone.ToneAudioNode();
	// A gain node for connecting with input and output
	this._fx.input = new Tone.Gain(1);
	this._fx.output = new Tone.Gain(1);
	// the fx processor
	this._fx.workletNode = Tone.getContext().createAudioWorkletNode('tanh-distortion-processor');
	// connect input, fx and output
	this._fx.input.chain(this._fx.workletNode, this._fx.output);

	this.set = function(c, time, bpm){
		// drive amount, minimum drive of 1
		const d = Util.assureNum(Math.max(1, Math.pow(Util.getParam(this._drive, c), 2) + 1));
		// preamp gain reduction for linear at drive = 1
		const p = 0.4;
		// makeup gain
		const m = 1.0 / p / (d ** 0.6);
		// set the input gain and output gain reduction
		this._fx.input.gain.setValueAtTime(p * d, time);
		this._fx.output.gain.setValueAtTime(m, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx }
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// A Compressor effect, allowing to reduce the dynamic range of a signal
// Set the threshold (in dB's), the ratio, the attack and release time in ms
// or relative to the tempo
//
const Compressor = function(_params){
	// replace defaults with provided params
	this.defaults = [-30, 6, 10, 80];
	this.defaults.splice(0, _params.length, ..._params);
	_params = this.defaults.map(p => Util.toArray(p));	

	this._fx = new Tone.Compressor({
		threshold: -24,
		ratio: 4,
		knee: 8,
		attack: 0.005,
		release: 0.07
	});

	this._thr = _params[0];
	this._rat = _params[1];
	this._att = _params[2];
	this._rel = _params[3];

	this.set = function(c, time, bpm){
		this._fx.threshold.setValueAtTime(Util.getParam(this._thr, c), time);
		this._fx.ratio.setValueAtTime(Math.min(20, Util.getParam(this._rat, c)), time);
		this._fx.attack.setValueAtTime(Util.divToS(Util.getParam(this._att, c)), time);
		this._fx.release.setValueAtTime(Util.divToS(Util.getParam(this._rel, c)), time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return': this._fx }
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// A distortion/compression effect of an incoming signal
// Based on an algorithm by Peter McCulloch
// 
const Squash = function(_params){
	this._squash = (_params[0])? Util.toArray(_params[0]) : [1];

	// ToneAudioNode has all the tone effect parameters
	this._fx = new Tone.ToneAudioNode();
	// A gain node for connecting with input and output
	this._fx.input = new Tone.Gain(1);
	this._fx.output = new Tone.Gain(1);
	// the fx processor
	this._fx.workletNode = Tone.getContext().createAudioWorkletNode('squash-processor');
	// connect input, fx and output
	this._fx.input.chain(this._fx.workletNode, this._fx.output);

	this.set = function(c, time, bpm){
		let d = Util.assureNum(Math.max(1, Util.getParam(this._squash, c)));
		let p = this._fx.workletNode.parameters.get('amount');
		let m = 1.0 / Math.sqrt(d);
		p.setValueAtTime(d, time);
		this._fx.output.gain.setValueAtTime(m, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx }
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// Reverb FX
// Add a reverb to the sound to give it a feel of space
// 
const Reverb = function(_params){
	this._fx = new Tone.Reverb();

	this._wet = (_params[0] !== undefined)? Util.toArray(_params[0]) : [ 0.5 ];
	this._size = (_params[1] !== undefined)? Util.toArray(_params[1]) : [ 1.5 ];

	this.set = function(c, time){
		let tmp = Math.min(10, Math.max(0.1, Util.getParam(this._size, c)));
		if (this._fx.decay != tmp){
			this._fx.decay = tmp; 
		}

		let wet = Math.min(1, Math.max(0, Util.getParam(this._wet, c)));
		this._fx.wet.setValueAtTime(wet, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// PitchShift FX
// Shift the pitch up or down with semitones
// 
const PitchShift = function(_params){
	this._fx = new Tone.PitchShift();

	this._pitch = (_params[0] !== undefined)? Util.toArray(_params[0]) : [-12];
	this._wet = (_params[1] !== undefined)? Util.toArray(_params[1]) : [1];

	this.set = function(c, time){
		let p = Util.getParam(this._pitch, c);
		let w = Util.getParam(this._wet, c);

		this._fx.pitch = TL.toScale(p);
		// this._fx.pitch = p;
		this._fx.wet.setValueAtTime(w, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// LFO FX
// a Low Frequency Oscillator effect, control tempo, type and depth
//
const LFO = function(_params){
	this._waveMap = {
		sine : 'sine',
		saw : 'sawtooth',
		square : 'square',
		rect : 'square',
		triangle : 'triangle',
		tri : 'triangle',
	}

	this._lfo = new Tone.LFO('8n', 0, 1);
	this._fx = new Tone.Gain();
	this._lfo.connect(this._fx.gain);
	// this._fx = new Tone.Tremolo('8n').start();

	this._speed = (_params[0]) ? Util.toArray(_params[0]) : ['1/8'];
	this._type = (_params[1]) ? Util.toArray(_params[1]) : ['sine'];
	this._depth = (_params[2] !== undefined) ? Util.toArray(_params[2]) : [ 1 ];

	this.set = function(c, time, bpm){
		let w = Util.getParam(this._type, c);
		if (this._waveMap[w]){
			w = this._waveMap[w];
		} else {
			console.log(`'${w} is not a valid waveshape`);
			// default wave if wave does not exist
			w = 'sine';
		}
		this._lfo.set({ type: w });
		
		let s = Util.getParam(this._speed, c);
		let f = Math.max(0.0001, Util.divToS(s, bpm));
		this._lfo.frequency.setValueAtTime(1/f, time);

		let a = Util.getParam(this._depth, c);
		this._lfo.min = Math.min(1, Math.max(0, 1 - a));

		this._lfo.start(time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		let blocks = [ this._fx, this._lfo ];
		
		blocks.forEach((b) => {
			b.disconnect();
			b.dispose();
		});
	}
}

// A filter FX, choose between highpass, lowpass and bandpass
// Set the cutoff frequency and Q factor
//
const Filter = function(_params){
	this._fx = new Tone.Filter();

	this._types = {
		'lo' : 'lowpass',
		'low' : 'lowpass',
		'lowpass' : 'lowpass',
		'hi' : 'highpass',
		'high' : 'highpass',
		'highpass' : 'highpass',
		'band' : 'bandpass',
		'bandpass': 'bandpass'
	}
	if (this._types[_params[0]]){
		this._fx.set({ type: this._types[_params[0]] });
	} else {
		console.log(`'${_params[0]}' is not a valid filter type`);
		this._fx.set({ type: 'lowpass' });
	}
	this._fx.set({ rolloff: -24 });

	this._cutoff = (_params[1]) ? Util.toArray(_params[1]) : [ 1000 ];
	this._q = (_params[2]) ? Util.toArray(_params[2]) : [ 0.5 ];
	this._rt = (_params[3]) ? Util.toArray(_params[3]) : [ 0 ];

	this.set = function(c, time, bpm){
		let f = Util.getParam(this._cutoff, c);
		let r = 1 / (1 - Math.min(0.95, Math.max(0, Util.getParam(this._q, c))));
		let rt = Util.divToS(Util.getParam(this._rt, c), bpm);

		if (rt > 0){
			this._fx.frequency.rampTo(f, rt, time);
		} else {
			this._fx.frequency.setValueAtTime(f, time);
		}

		this._fx.Q.setValueAtTime(r, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// A automated filter (filter with envelope) that is triggered by the note
// Set the filter type (lowpass, highpass, bandpass)
// Set the attack and release time
// Set the low and high filter range
// Set the curve mode
//
const TriggerFilter = function(_params){
	this._fx = new Tone.Filter(1000, 'lowpass', -24);
	this._adsr = new Tone.Envelope({
		attackCurve: "linear",
		decayCurve: "linear",
		sustain: 0,
		release: 0.001
	});
	this._mul = new Tone.Multiply();
	this._add = new Tone.Add();
	this._pow = new Tone.Pow(3);

	this._adsr.connect(this._pow.connect(this._mul));
	this._mul.connect(this._add);
	this._add.connect(this._fx.frequency);

	this._types = {
		'lo' : 'lowpass',
		'low' : 'lowpass',
		'lowpass' : 'lowpass',
		'hi' : 'highpass',
		'high' : 'highpass',
		'highpass' : 'highpass',
		'band' : 'bandpass',
		'bandpass': 'bandpass'
	}

	this.defaults = ['low', 1, '1/16', 4000, 30];
	// replace defaults with provided arguments
	this.defaults.splice(0, _params.length, ..._params);
	_params = this.defaults.map(p => Util.toArray(p));

	if (this._types[_params[0][0]]){
		this._fx.set({ type: this._types[_params[0][0]] });
	} else {
		console.log(`'${_params[0][0]}' is not a valid filter type. Defaulting to lowpass`);
		this._fx.set({ type: 'lowpass' });
	}

	this._att = _params[1];
	this._rel = _params[2];
	this._high = _params[3];
	this._low = _params[4];

	this.set = function(c, time, bpm){
		this._adsr.attack = Util.divToS(Util.getParam(this._att, c), bpm);
		this._adsr.decay = Util.divToS(Util.getParam(this._rel, c), bpm);

		let min = Util.getParam(this._low, c);
		let max = Util.getParam(this._high, c);
		let range = Math.abs(max - min);
		let lower = Math.min(max, min);

		this._mul.setValueAtTime(range, time);
		this._add.setValueAtTime(lower, time);

		// fade-out running envelope over 5 ms
		if (this._adsr.value > 0){
			this._adsr.triggerRelease(time);
			time += this._adsr.release;
		}
		this._adsr.triggerAttack(time, 1);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		let blocks = [ this._fx, this._adsr, this._mul, this._add, this._pow ];

		blocks.forEach((b) => {
			b.disconnect();
			b.dispose();
		});
	}
}

/*const AutoFilter = function(_params){
	console.log('FX => AutoFilter()', _params);

	this._fx = new Tone.AutoFilter('8n', 100, 4000);

	this.set = function(c, time, bpm){

	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx }
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}*/

// Custom stereo delay implementation with lowpass filter in feedback loop
const Delay = function(_params){
	this._fx = new Tone.Gain(1);
	this._fb = new Tone.Gain(0.5);
	this._mix = new Tone.CrossFade(0.5);
	this._split = new Tone.Split(2);
	this._merge = new Tone.Merge(2);
	this._maxDelay = 5;

	this._delayL = new Tone.Delay({ maxDelay: this._maxDelay });
	this._delayR = new Tone.Delay({ maxDelay: this._maxDelay });
	this._flt = new Tone.Filter(1000, 'lowpass', '-12');

	if (_params.length === 2){
		_params[2] = _params[1];
		_params[1] = _params[0];
	}
	// All params and defaults
	this._timeL = (_params[0] !== undefined)? Util.toArray(_params[0]) : [ '2/16' ];
	this._timeR = (_params[1] !== undefined)? Util.toArray(_params[1]) : [ '3/16' ];
	this._feedBack = (_params[2] !== undefined)? Util.toArray(_params[2]) : [ 0.7 ];
	this._fbDamp = (_params[3] !== undefined)? Util.toArray(_params[3]) : [ 0.6 ];

	// split the signal
	this._fx.connect(this._mix.a);
	this._fx.connect(this._fb);

	this._fb.connect(this._split);
	// the feedback node connects to the delay L + R
	this._split.connect(this._delayL, 0, 0);
	this._split.connect(this._delayR, 1, 0);
	// merge back
	this._delayL.connect(this._merge, 0, 0);
	this._delayR.connect(this._merge, 0, 1);
	// the delay is the input chained to the sample and returned
	// the delay also connects to the onepole filter
	this._merge.connect(this._flt);
	// the output of the onepole is stored back in the gain for feedback
	this._flt.connect(this._fb);
	// connect the feedback also to the crossfade mix
	this._fb.connect(this._mix.b);

	this.set = function(c, time, bpm){
		let dL = Math.min(this._maxDelay, Math.max(0, Util.formatRatio(Util.getParam(this._timeL, c), bpm)));
		let dR = Math.min(this._maxDelay, Math.max(0, Util.formatRatio(Util.getParam(this._timeR, c), bpm)));
		let ct = Math.max(10, Util.getParam(this._fbDamp, c) * 5000);
		let fb = Math.max(0, Math.min(0.99, Util.getParam(this._feedBack, c) * 0.707));

		this._delayL.delayTime.setValueAtTime(dL, time);
		this._delayR.delayTime.setValueAtTime(dR, time);
		this._flt.frequency.setValueAtTime(ct, time);
		this._fb.gain.setValueAtTime(fb, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._mix };
	}

	this.delete = function(){
		let blocks = [ this._fx, this._fb, this._mix, this._split, this._merge, this._delayL, this._delayR, this._flt ];

		blocks.forEach((b) => {
			b.disconnect();
			b.dispose();
		});
	}
}

// Old pingpong delay implementation, just using the Tone.PingPongDelay()
const PingPongDelay = function(_params){
	this._fx = new Tone.PingPongDelay();
	this._fx.set({ wet: 0.4 });

	// console.log('delay', param);
	this._dTime = (_params[0] !== undefined)? Util.toArray(_params[0]) : [ '3/16' ];
	this._fb = (_params[1] !== undefined)? Util.toArray(_params[1]) : [ 0.3 ];
	// let del = new Tone.PingPongDelay(formatRatio(t), fb);

	this.set = function(c, time, bpm){
		let t = Math.max(0, Util.formatRatio(Util.getParam(this._dTime, c), bpm));
		let fb = Math.max(0, Math.min(0.99, Util.getParam(this._fb, c)));

		this._fx.delayTime.setValueAtTime(t, time);
		this._fx.feedback.setValueAtTime(fb, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

const FreeVerb = function(_params){
	this._fx = new Tone.Freeverb(_params[0], _params[1]);

	this.set = function(c, time, bpm){

	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		let blocks = [ this._fx ];

		blocks.forEach((b) => {
			b.disconnect();
			b.dispose();
		});
	}
}

// squash/compress an incoming signal
// based on algorithm by Peter McCulloch
const SquashDeprecated = function(_params){
	this._compress = (_params[0] !== undefined)? Util.toArray(_params[0]) : [1];

	this._fx = new Tone.WaveShaper();

	this.shaper = function(amount){
		// (a * c) / ((a * c)^2 * 0.28 + 1) / √c
		// drive amount, minimum of 1
		const c = amount;
		// makeup gain
		const m = 1.0 / Math.sqrt(c);
		// set the waveshaper effect
		this._fx.setMap((x) => {
			return (x * c) / ((x * c) * (x * c) * 0.28 + 1) * m; 
		});
	}
	
	this.set = function(c){
		let d = Util.getParam(this._compress, c);
		this.shaper(isNaN(d)? 1 : Math.max(1, d));
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// A distortion algorithm using the tanh (hyperbolic-tangent) as a 
// waveshaping technique. Some mapping to apply a more equal loudness 
// distortion is applied on the overdrive parameter
//
const DriveDeprecated = function(_params){
	this._drive = (_params[0] !== undefined)? Util.toArray(_params[0]) : [1.5];

	this._fx = new Tone.WaveShaper();

	this.shaper = function(amount){
		// drive curve, minimum drive of 1
		const d = Math.pow(amount, 2);
		// makeup gain
		const m = Math.pow(d, 0.6);
		// preamp gain reduction for linear at drive = 1
		const p = 0.4;
		// set the waveshaping effect
		this._fx.setMap((x) => {
			return Math.tanh(x * p * d) / p / m;
		});
	}
	
	this.set = function(c){
		let d = Util.getParam(this._drive, c);
		this.shaper(isNaN(d)? 1 : Math.max(1, d));
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}
},{"./Util.js":66,"tone":44,"total-serialism":47}],57:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const fxMap = require('./Effects.js');
const Sequencer = require('./Sequencer.js');

// Basic class for all instruments
class Instrument extends Sequencer {
	constructor(engine, canvas){
		// Inherit from Sequencer
		super(engine, canvas);

		// Instrument specific parameters
		this._gain = [-6, 0];		
		this._pan = [ 0 ];
		this._att = [ 0 ];
		this._sus = [ 0 ];
		this._rel = [ 0 ];

		// Instrument specific Tone Nodes
		this.adsr;
		this.panner;
		this.gain;
		this._fx;

		// The source to be defined by inheriting class
		this.source;

		console.log('=> class Instrument()');
	}

	channelStrip(){
		// gain => output
		this.gain = new Tone.Gain(0).toDestination();
		// panning => gain
		this.panner = new Tone.Panner(0).connect(this.gain);
		// adsr => panning
		this.adsr = this.envelope(this.panner);
		// return Node to connect source => adsr
		return this.adsr;
	}

	envelope(d){
		// return an Envelope and connect to next node
		return new Tone.AmplitudeEnvelope({
			attack: 0,
			attackCurve: "linear",
			decay: 0,
			decayCurve: "linear",
			sustain: 1,
			release: 0.001,
			releaseCurve: "linear"
		}).connect(d);
	}

	event(c, time){
		// console.log('=> Instrument()', c);
		// end position for playback
		let e = this._time;

		// set FX parameters
		if (this._fx){
			for (let f=0; f<this._fx.length; f++){
				this._fx[f].set(c, time, this.bpm());
			}
		}
		
		// set panning
		let p = Util.getParam(this._pan, c);
		p = Util.isRandom(p, -1, 1);
		this.panner.pan.setValueAtTime(p, time);

		// ramp volume
		let g = 20 * Math.log(Util.getParam(this._gain[0], c) * 0.707);
		let r = Util.msToS(Math.max(0, Util.getParam(this._gain[1], c)));
		this.source.volume.rampTo(g, r, time);

		this.sourceEvent(c, e, time);

		// fade-out running envelope over 5 ms
		if (this.adsr.value > 0){
			let tmp = this.adsr.release;
			this.adsr.release = 0.005;
			this.adsr.triggerRelease(time);
			this.adsr.release = tmp;
			time += 0.005;
		}

		// set shape for playback (fade-in / out and length)
		if (this._att){
			let att = Util.divToS(Util.getParam(this._att, c), this.bpm());
			let dec = Util.divToS(Util.getParam(this._sus, c), this.bpm());
			let rel = Util.divToS(Util.getParam(this._rel, c), this.bpm());

			this.adsr.attack = att;
			this.adsr.decay = dec;
			this.adsr.release = rel;
			
			e = Math.min(this._time, att + dec + rel);
			// e = Math.min(t, att + dec + rel);

			let rt = Math.max(0.001, e - this.adsr.release);
			this.adsr.triggerAttackRelease(rt, time);
		} else {
			// if shape is 'off' only trigger attack
			this.adsr.triggerAttack(time);
		}
	}

	sourceEvent(c, time){
		// trigger some events specifically for a source
		// specified in more detail in the inheriting class
		console.log('Instrument()', this._name, c);
	}

	fadeIn(t){
		// fade in the sound upon evaluation of code
		this.gain.gain.rampTo(1, t, Tone.now());
	}

	fadeOut(t){
		// fade out the sound upon evaluation of new code
		this.gain.gain.rampTo(0, t, Tone.now());
		setTimeout(() => {
			this.delete();
			// wait a little bit extra before deleting to avoid clicks
		}, t * 1000 + 100);
	}

	delete(){
		// delete super class
		super.delete();
		// disconnect the sound dispose the player
		this.gain.dispose();
		this.panner.dispose();
		// this.adsr.dispose();
		// remove all fx
		this._fx.map((f) => f.delete());
		console.log('=> disposed Instrument() with FX:', this._fx);
	}

	amp(g, r){
		// set the gain and ramp time
		this._gain[0] = Util.toArray(g);
		this._gain[1] = (r !== undefined)? Util.toArray(r) : [ 0 ];

		// convert amplitude to dBFullScale
		// this._gain[0] = g.map(g => 20 * Math.log(g * 0.707) );
		// this._gain[1] = r.map(r => Util.msToS(Math.max(0, r)) );
	}

	env(...e){
		// set the fade-in, sustain and fade-out times
		this._att = [ 0 ];
		this._rel = [ 0 ];
		this._sus = [ 1 ];

		if (e[0] === 'off' || e[0] < 0){
			this._att = null;
		} else {
			if (e.length === 1){
				// one argument is release time
				this._att = [ 1 ];
				this._rel = Util.toArray(e[0]);
			} else if (e.length === 2){
				// two arguments is attack & release
				this._att = Util.toArray(e[0]);
				this._rel = Util.toArray(e[1]);
			} else {
				// three is attack stustain and release
				this._att = Util.toArray(e[0]);
				this._sus = Util.toArray(e[1]);
				this._rel = Util.toArray(e[2]);
			}
		}
	}

	pan(p){
		// the panning position of the sound
		this._pan = Util.toArray(p);
	}

	add_fx(...fx){
		// the effects chain for the sound
		this._fx = [];
		// console.log('Effects currently disabled');
		fx.forEach((f) => {
			if (fxMap[f[0]]){
				let tmpF = fxMap[f[0]](f.slice(1));
				this._fx.push(tmpF);
			} else {
				log(`Effect ${f[0]} does not exist`);
			}
		});
		// if any fx working
		if (this._fx.length){
			console.log(`Adding effect chain`, this._fx);
			// disconnect the panner
			this.panner.disconnect();
			// iterate over effects and get chain (send/return)
			this._ch = [];
			this._fx.map((f) => { this._ch.push(f.chain()) });
			// add all effects in chain and connect to Destination
			// every effect connects it's return to a send of the next
			// allowing to chain multiple effects within one process
			let pfx = this._ch[0];
			this.panner.connect(pfx.send);
			for (let f=1; f<this._ch.length; f++){
				if (pfx){
					pfx.return.connect(this._ch[f].send);
				}
				pfx = this._ch[f];
			}
			// pfx.return.connect(Tone.Destination);
			pfx.return.connect(this.gain);
		}
	}
}
module.exports = Instrument;
},{"./Effects.js":56,"./Sequencer.js":65,"./Util.js":66,"tone":44}],58:[function(require,module,exports){
const Tone = require('tone');
const Instrument = require('./Instrument.js');

class MonoInput extends Instrument {
	constructor(engine, d, canvas){
		super(engine, canvas);

		if (d === 'default'){
			this._device = 0;
		} else if (d.match(/in(\d+)/g)){
			this._device = Number(d.match(/in(\d+)/)[1]);
		} else {
			console.log(`${d} is not a valid microphone input. defaults to in0`);
			this._device = 0;
		}

		this.mic;
		this.createSource();

		console.log('=> MonoInput()', this);
	}

	createSource(){
		this.mic = new Tone.UserMedia().connect(this.channelStrip());
		this.mic.open(this._device).then(() => {
			console.log(`Opened microphone: ${window.devices[this._device]}`);
		}).catch((e) => {
			console.log(`Unable to use microphone`);
		});
		this.mic.channelInterpretation = 'discrete';
		
		this.source = this.mic;
	}

	sourceEvent(c, e, time){
		return;	
	}

	delete(){
		// delete super class
		super.delete();
		// disconnect the sound dispose the player
		this.source.close();
		this.source.disconnect();
		this.source.dispose();

		console.log('=> disposed MonoInput()', this._sound);
	}
}
module.exports = MonoInput;
},{"./Instrument.js":57,"tone":44}],59:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const Sequencer = require('./Sequencer.js');
const WebMidi = require("webmidi");

class MonoMidi extends Sequencer {
	constructor(engine, d='default', canvas){
		super(engine, canvas);

		// Set Midi Device Output
		this._device = WebMidi.getOutputByName(d);
		if (d === 'default'){
			this._device = WebMidi.outputs[0];
		} else if (!this._device){
			console.log(`${d} is not a valid MIDI Device name, set to default`);
			this._device = WebMidi.outputs[0];
		}

		// Midi specific parameters
		this._note = [];		
		this._velocity = [ 127, 0 ];
		this._dur = [ 100 ];
		this._cc = [];
		this._channel = [ 1 ];
		this._chord = false;
		this._bend = [];

		console.log('=> class MonoMidi', this);
	}

	event(c, time){
		// normalized velocity (0 - 1)
		let g = Util.getParam(this._velocity[0], c);
				
		// get the duration
		let d = Util.divToS(Util.getParam(this._dur, c), this.bpm()) * 1000;

		// get the channel
		let ch = Util.getParam(this._channel, c);

		// timing offset to sync WebMidi and WebAudio
		let offset = WebMidi.time - Tone.context.currentTime * 1000;
		let sync = time * 1000 + offset;

		// send pitchbend message in hires -1 1 at specified channel
		if (this._bend.length > 0){
			let b = Util.lookup(this._bend, c);
			// clip the bend range between -1 and 1 (results in hires 14bit)
			b = Math.min(1.0, Math.max(-1, b));
			this._device.sendPitchBend(b, ch, { time: sync });
		}

		// send control changes!
		this._cc.forEach((cc) => {
			let ctrl = Number(cc[0]);
			let val = Util.getParam(cc[1], c);
			val = Math.max(0, Math.min(127, val));

			this._device.sendControlChange(ctrl, val, ch, { time: sync });
		});

		// only play a note if the notes are provided in the function
		// if (this._note.length > 0){

		// note as interval / octave coordinate
		let o = Util.getParam(this._note[1], c);
		let n = [];
		let i = [];
		if (this._chord){
			i = Util.lookup(this._note[0], c);
			i = Util.toArray(i);
		} else {
			i = [ Util.getParam(this._note[0], c) ];
		}
		
		for (let x=0; x<i.length; x++){
			// reconstruct midi note value, (0, 0) = 36
			// convert to scale and include the octave
			n[x] = Util.toMidi(i[x], o);
		}
		
		// play the note(s)!
		this._device.playNote(n, ch, { duration: d, velocity: g, time: sync });

		// }
	}

	amp(g, r){
		// set the gain and ramp time
		g = Util.toArray(g);
		r = (r !== undefined)? Util.toArray(r) : [ 0 ];
		// convert amplitude to velocity range
		this._velocity[0] = g.map(g => Math.min(1, Math.max(0, g*g)));
		// this._velocity[0] = g.map(g => Math.floor(Math.min(127, Math.max(0, g * 127))));
		this._velocity[1] = r;
	}

	env(d){
		this._dur = Util.toArray(d);
	}

	out(c){
		this._channel = Util.toArray(c);
	}

	bend(b=[0]){
		this._bend = Util.toArray(b);
	}

	chord(c){
		this._chord = false;
		if (c === 'on' || c === 1){
			this._chord = true;
		}
	}

	add_fx(...cc){
		// control parameters via control change midi messages
		this._cc = [];
		cc.forEach((c) => {
			if (isNaN(c[0])){
				console.log(`'${c[0]}' is not a valid CC number`);
			} else {
				let cc = [];
				cc[0] = c[0];
				cc[1] = Util.toArray(c[1]);
				this._cc.push(cc);
			}
		});
	}

	sync(s){
		// send out midiclock messages to sync external devices
		// on this specific midi output and channel
		// this._sync;
	}	
}
module.exports = MonoMidi;
},{"./Sequencer.js":65,"./Util.js":66,"tone":44,"webmidi":55}],60:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
// const fxMap = require('./Effects.js');
const Instrument = require('./Instrument.js');

class MonoSample extends Instrument {
	constructor(engine, s, canvas){
		super(engine, canvas);

		this._bufs = this._engine.getBuffers();
		this._sound;
		this.sound(s);

		// sample variables
		this._speed = [ 1 ];
		this._rev = false;
		this._stretch = [ 0 ];
		this._note = [ 'off' ];
		this._tune = [ 261.6255653 ];

		// playback start position
		this._pos = [ 0 ];

		this.sample;
		this.createSource();

		console.log('=> MonoSample()', this);
	}

	createSource(){
		this.sample = new Tone.Player().connect(this.channelStrip());
		this.sample.autostart = false;
		this.source = this.sample;
	}

	sourceEvent(c, e, time){
		// get the sample from array
		let f = Util.getParam(this._sound, c);

		if (this.sample.buffer){
			// clean-up previous buffer
			this.sample.buffer.dispose();
		}
		if (this._bufs.has(f)){	
			this.sample.buffer = this._bufs.get(f);
			// this.sample.buffer = this._bufs.get(f).slice(0);
		} else {
			// default sample if file does not exist
			this.sample.buffer = this._bufs.get('kick_min');
			// this.sample.buffer = this._bufs.get('kick_min').slice(0);
		}
		// the duration of the buffer in seconds
		let dur = this.sample.buffer.duration;

		// get speed and if 2d array pick randomly
		let s = Util.getParam(this._speed, c);

		// check if note is not 'off'
		let i = Util.getParam(this._note[0], c);
		if (i !== 'off'){
			// note as interval / octave coordinate
			let o = Util.getParam(this._note[1], c);
			let t = Util.getParam(this._tune, c);

			// reconstruct midi note value with scale, (0, 0) = 36
			let n = Util.toMidi(i, o);
			let r = Util.mtof(n) / t;
			s = s * r;
		}

		// reversing seems to reverse every time the 
		// value is set to true (so after 2 times reverse
		// it becomes normal playback again) no fix yet
		// this.sample.reverse = s < 0.0;

		let l = Util.lookup(this._stretch, c);
		let n = 1;
		if (l){
			n = dur / (60 * 4 / this.bpm()) / l;
		}
		// playbackrate can not be 0 or negative
		this.sample.playbackRate = Math.max(Math.abs(s) * n, 0.0001);

		// get the start position
		let o = dur * Util.getParam(this._pos, c);

		// when sample is loaded, start
		// this.sample.start(time, o, e);
		this.sample.start(time, o);
		// if (this.sample.loaded){
		// }
	}

	sound(s){
		// load all soundfiles and return as array
		this._sound = this.checkBuffer(Util.toArray(s));
	}

	checkBuffer(a){
		// check if file is part of the loaded samples
		return a.map((s) => {
			if (Array.isArray(s)) {
				return this.checkBuffer(s);
			}
			// error if soundfile does not exist
			else if (!this._bufs.has(s)){
				// set default (or an ampty soundfile?)
				console.log(`sample ${s} not found`);
				return 'kick_909';
			}
			return s;
		});
	}

	speed(s){
		// set the speed pattern as an array
		this._speed = Util.toArray(s);
	}

	tune(t=60){
		// set the fundamental midi note for this sample in Hz, MIDI or Notename
		this._tune = Util.toArray(t);
		this._tune = this._tune.map((t) => {
			if (typeof t === 'number'){
				if (Math.floor(t) !== t){
					return t;
				}
				return Util.mtof(t);
			}
			return Util.mtof(Util.noteToMidi(t));
		});
	}

	stretch(s){
		// set the stretch loop bar length
		this._stretch = Util.toArray(s);
	}

	offset(o){
		// set the playback start position as an array
		this._pos = Util.toArray(o);
	}

	delete(){
		// delete super class
		super.delete();
		// disconnect the sound dispose the player
		this.source.dispose();
		this.sample.dispose();

		console.log('=> disposed MonoSample()', this._sound);
	}
}
module.exports = MonoSample;
},{"./Instrument.js":57,"./Util.js":66,"tone":44}],61:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
// const fxMap = require('./Effects.js');
const TL = require('total-serialism').Translate;
const Instrument = require('./Instrument');

class MonoSynth extends Instrument {
	constructor(engine, t='saw', canvas){
		// Inherit from Instrument
		super(engine, canvas);

		this._wave = Util.toArray(t);
		this._waveMap = {
			sine : 'sine',
			saw : 'sawtooth',
			square : 'square',
			triangle : 'triangle',
			tri : 'triangle',
			rect : 'square',
			fm: 'fmsine',
			am: 'amsine',
			pwm: 'pwm',
			organ: 'sine4',
		}
		// // synth specific variables;
		this._note = [ 0, 0 ];
		this._slide = [ 0 ];
		this._voices = [ 1 ];
		this._detune = [ 0 ];

		this.synth;
		this.createSource();

		console.log('=> MonoSynth()', this);
	}

	createSource(){
		this.synth = new Tone.FatOscillator().connect(this.channelStrip());
		this.synth.count = 1;
		this.synth.start();
		this.source = this.synth;
	}

	sourceEvent(c, e, time){
		// set voice amount for super synth
		let v = Util.getParam(this._voices, c);
		this.synth.count = Math.max(1, Math.floor(v));

		// set the detuning of the unison voices
		// in semitone values from -48 to +48
		let d = Util.getParam(this._detune, c);
		// d = Math.log2(d) * 1200;
		this.synth.spread = d * 100 * 2;

		// set wave to oscillator
		let w = Util.getParam(this._wave, c);
		if (this._waveMap[w]){
			w = this._waveMap[w];
		} else {
			console.log(`${w} is not a valid waveshape`);
			// default wave if wave does not exist
			w = 'sine';
		}
		this.synth.set({ type: w });

		// set the frequency based on the selected note
		// note as interval / octave coordinate
		let o = Util.getParam(this._note[1], c);
		let i = Util.getParam(this._note[0], c);
		// reconstruct midi note value with scale, (0, 0) = 36
		let n = Util.toMidi(i, o);

		// calculate frequency in 12-TET A4 = 440;
		// let f = Math.pow(2, (n - 69)/12) * 440;
		let f = TL.mtof(n);

		// get the slide time for next note and set the frequency
		let s = Util.divToS(Util.getParam(this._slide, c), this.bpm());
		if (s > 0){
			this.synth.frequency.rampTo(f, s, time);
		} else {
			this.synth.frequency.setValueAtTime(f, time);
		}
	}

	super(d=[0.1], v=[3]){
		// add unison voices and detune the spread
		// first argument is the detune amount
		// second argument changes the amount of voices
		this._voices = Util.toArray(v);
		this._detune = Util.toArray(d);
	}

	fat(...a){
		// alias for super synth
		this.super(...a);
	}

	slide(s){
		// portamento from one note to another
		this._slide = Util.toArray(s);
	}

	wave2(w){
		// placeholder function for wave2
	}

	delete(){
		// delete super class
		super.delete();
		// dispose the sound source
		// this.source.delete();
		this.adsr.dispose();
		this.synth.dispose();
		this.source.dispose();
		
		console.log('disposed MonoSynth()', this._wave);
	}
}
module.exports = MonoSynth;
},{"./Instrument":57,"./Util.js":66,"tone":44,"total-serialism":47}],62:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const fxMap = require('./Effects.js');
const TL = require('total-serialism').Translate;
// const Sequencer = require('./Sequencer.js');
const Instrument = require('./Instrument.js');

// Basic class for a poly-instrument
class PolyInstrument extends Instrument {
	constructor(engine, canvas){
		// Inherit from Instrument
		super(engine, canvas);

		// The source to be defined by inheriting class
		this.sources = [];

		// PolyInstrument specific parameters
		this.numVoices = 8;
		this.adsrs = [];
		this.busymap = [];
		this.next = 0;
		this._steal = true;

		this.channelStrip();
		this.createVoices();

		console.log('=> class PolyInstrument()');
	}

	channelStrip(){
		// gain => output
		this.gain = new Tone.Gain(0).toDestination();
		// panning => gain
		this.panner = new Tone.Panner(0).connect(this.gain);
		// adsr => panning
	}

	createVoices(){
		// create adsrs and busymap states for every voice
		for (let i=0; i<this.numVoices; i++){
			this.adsrs[i] = this.envelope(this.panner);
			this.busymap[i] = false;
		}
	}
	
	event(c, time){
		// console.log('=> Instrument()', c);
		// end position for playback
		let e = this._time;

		// set FX parameters
		if (this._fx){
			for (let f=0; f<this._fx.length; f++){
				this._fx[f].set(c, time, this.bpm());
			}
		}
		
		// set panning
		let p = Util.getParam(this._pan, c);
		p = Util.isRandom(p, -1, 1);
		this.panner.pan.setValueAtTime(p, time);

		// use notes from array to trigger multiple voices
		// check which voice is playing and trigger a new voice
		this.manageVoices(c, e, time);
	}

	sourceEvent(c, time, v){
		// trigger some events specifically for a source at index v
		// specified in more detail in the inheriting class
		console.log('PolyInstrument()', this._name, c, v);
	}

	manageVoices(c, e, time){
		// TODO: option for voice stealing can be included
		
		// the first free voices available;
		let free = [];
		
		// set all busymaps based on current amplitude value
		for (let i=0; i<this.busymap.length; i++){
			this.busymap[i] = this.adsrs[i].value > 0;
			if (!this.busymap[i]){
				free.push(i);
			}
		}

		// get the notes from the note array to know how many voices
		// need to be triggered at once
		let notes = Util.toArray(Util.lookup(this._note[0], c));
		// console.log('notes to trigger', notes);

		for (let n=0; n<notes.length; n++){
			// if any voices are free
			if (free.length > 0 || this._steal){
				let i;
				if (this._steal){
					// if stealing is enabled just take the next voice
					i = this.next;
					this.next = (this.next + 1) % this.numVoices;
				} else {
					// get a free voice and make the list smaller
					i = free.pop();
				}
				// if voice is free set all parameters for the source on index i
				this.sourceEvent(c, time, i, n);
				
				// set shape for playback (fade-in / out and length)
				if (this._att){
					let att = Util.divToS(Util.lookup(this._att, c), this.bpm());
					let dec = Util.divToS(Util.lookup(this._sus, c), this.bpm());
					let rel = Util.divToS(Util.lookup(this._rel, c), this.bpm());
		
					this.adsrs[i].attack = att;
					this.adsrs[i].decay = dec;
					this.adsrs[i].release = rel;
					
					e = Math.min(this._time, att + dec + rel);
			
					// trigger the envelope
					let rt = Math.max(0.001, e - this.adsrs[i].release);
					this.adsrs[i].triggerAttackRelease(rt, time);
				} else {
					// if shape is off only trigger attack
					// when voice stealing is 'off' this will lead to all 
					// voices set to busy!
					this.adsrs[i].triggerAttack(time);
				}
		
			}
		}
	}

	voices(v){
		console.log(`Changing voice amount is not yet supported. You can use voice-stealing with steal(on)`);
		// TODO change voice amount
		// set the voiceamount for the polyphonic synth
		// this.numVoices = Math.max(1, isNaN(Number(v))? 6 : Number(v));
		// this.createVoices();
	}

	steal(s=0){
		// enable/disable the voice stealing (default = off)
		this._steal = false;
		if (s === 'on' || s == 1){
			this._steal = true;
		} else if (s === 'off' || s == 0){
			this._steal = false;
		} else {
			console.log(`${s} is not a valid argument for steal()`);
		}
	}

	delete(){
		// delete super class
		super.delete();
		// disconnect the sound dispose the player
		// this.gain.dispose();
		// this.panner.dispose();

		this.adsrs.map((a) => a.dispose());
		this.sources.map((s) => s.dispose());
		// remove all fx
		// this._fx.map((f) => f.delete());
		console.log('=> disposed PolyInstrument() with FX:', this._fx);
	}
}
module.exports = PolyInstrument;
},{"./Effects.js":56,"./Instrument.js":57,"./Util.js":66,"tone":44,"total-serialism":47}],63:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const PolyInstrument = require('./PolyInstrument.js');

class PolySample extends PolyInstrument {
	constructor(engine, s, canvas){
		// Inherit from PolyInstrument
		super(engine, canvas);

		this._bufs = this._engine.getBuffers();
		this._sound;
		this.sound(s);

		// sample variables
		this._speed = [ 1 ];
		this._rev = false;
		this._stretch = [ 0 ];

		// playback start position
		this._pos = [ 0 ];

		this.sample;
		this._note = [ 0, 0 ];
		this._tune = [ 261.6255653 ];

		// this._slide = [ 0 ];
		this._voices = [ 1 ];
		this._detune = [ 0 ];

		this.createSources();

		console.log('=> PolySample()', this);
	}

	createSources(){
		for (let i=0; i<this.numVoices; i++){
			this.sources[i] = new Tone.Player().connect(this.adsrs[i]);
			this.sources[i].autostart = false;
		}
	}

	sourceEvent(c, time, id, num){
		// ramp volume
		let g = 20 * Math.log(Util.getParam(this._gain[0], c) * 0.707);
		let r = Util.msToS(Math.max(0, Util.getParam(this._gain[1], c)));
		this.sources[id].volume.rampTo(g, r, time);


		// let o = Util.getParam(this._note[1], c);
		// let i = Util.getParam(this._note[0], c);
		// let i = Util.toArray(Util.lookup(this._note[0], c))[num];
		// let f = Util.noteToFreq(i, o);

		// get the sample from array
		let b = Util.getParam(this._sound, c);

		if (this.sources[id].buffer){
			// clean-up previous buffer
			this.sources[id].buffer.dispose();
		}
		if (this._bufs.has(b)){	
			this.sources[id].buffer = this._bufs.get(b);
		} else {
			// default sample if file does not exist
			this.sources[id].buffer = this._bufs.get('kick_min');
		}
		// the duration of the buffer in seconds
		let dur = this.sources[id].buffer.duration;

		// get speed and if 2d array pick randomly
		let s = Util.getParam(this._speed, c);

		// set the playbackrate based on the selected note
		// note as interval / octave coordinate
		// check if note is not 'off'
		let i = Util.toArray(Util.lookup(this._note[0], c))[num];
		if (i !== 'off'){
			// note as interval / octave coordinate
			let o = Util.getParam(this._note[1], c);
			let t = Util.getParam(this._tune, c);

			// reconstruct midi note value with scale, (0, 0) = 36
			let n = Util.toMidi(i, o);
			let r = Util.mtof(n) / t;
			s = s * r;
		}

		// reversing seems to reverse every time the 
		// value is set to true (so after 2 times reverse
		// it becomes normal playback again) no fix yet
		// this.sample.reverse = s < 0.0;

		let l = Util.lookup(this._stretch, c);
		let n = 1;
		if (l){
			n = dur / (60 * 4 / this.bpm()) / l;
		}
		// playbackrate can not be 0 or negative
		this.sources[id].playbackRate = Math.max(Math.abs(s) * n, 0.0001);

		// get the start position
		let p = dur * Util.getParam(this._pos, c);

		// when sample is loaded, start
		this.sources[id].start(time, p);
	}

	sound(s){
		// load all soundfiles and return as array
		this._sound = this.checkBuffer(Util.toArray(s));
	}

	checkBuffer(a){
		// check if file is part of the loaded samples
		return a.map((s) => {
			if (Array.isArray(s)) {
				return this.checkBuffer(s);
			}
			// error if soundfile does not exist
			else if (!this._bufs.has(s)){
				// set default (or an ampty soundfile?)
				console.log(`sample ${s} not found`);
				return 'kick_909';
			}
			return s;
		});
	}

	note(i=0, o=0){
		// set the note as semitone interval and octave offset
		// (0, 0) = MidiNote 36
		this._note = [Util.toArray(i), Util.toArray(o)];
	}

	speed(s){
		// set the speed pattern as an array
		this._speed = Util.toArray(s);
	}

	tune(t=60){
		// set the fundamental midi note for this sample in Hz, MIDI or Notename
		this._tune = Util.toArray(t);
		this._tune = this._tune.map((t) => {
			if (typeof t === 'number'){
				if (Math.floor(t) !== t){
					return t;
				}
				return Util.mtof(t);
			}
			return Util.mtof(Util.noteToMidi(t));
		});
	}

	stretch(s){
		// set the stretch loop bar length
		this._stretch = Util.toArray(s);
	}

	offset(o){
		// set the playback start position as an array
		this._pos = Util.toArray(o);
	}

	delete(){
		// delete super class
		super.delete();
		
		console.log('disposed PolySample()', this._sound);
	}
}
module.exports = PolySample;
},{"./PolyInstrument.js":62,"./Util.js":66,"tone":44}],64:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const PolyInstrument = require('./PolyInstrument');

class PolySynth extends PolyInstrument {
	constructor(engine, t='saw', canvas){
		// Inherit from PolyInstrument
		super(engine, canvas);

		// synth specific variables;
		this._wave = Util.toArray(t);
		this._note = [ 0, 0 ];
		this._slide = [ 0 ];
		this._voices = [ 1 ];
		this._detune = [ 0 ];

		this.createSources();

		console.log('=> PolySynth()', this);
	}

	createSources(){
		for (let i=0; i<this.numVoices; i++){
			this.sources[i] = new Tone.FatOscillator().connect(this.adsrs[i]);
			this.sources[i].count = 1;
			this.sources[i].start();
		}
	}

	sourceEvent(c, time, id, num){
		// ramp volume
		let g = 20 * Math.log(Util.getParam(this._gain[0], c) * 0.707);
		let r = Util.msToS(Math.max(0, Util.getParam(this._gain[1], c)));
		this.sources[id].volume.rampTo(g, r, time);

		// set voice amount for super synth
		let v = Util.getParam(this._voices, c);
		this.sources[id].count = Math.max(1, Math.floor(v));

		// set the detuning of the unison voices
		// in semitone values from -48 to +48
		let d = Util.getParam(this._detune, c);
		// d = Math.log2(d) * 1200;
		this.sources[id].spread = d * 100 * 2;

		// set wave to oscillator
		let w = Util.getParam(this._wave, c);
		this.sources[id].set({ type: Util.assureWave(w) });

		// set the frequency based on the selected note
		// note as interval / octave coordinate
		let o = Util.getParam(this._note[1], c);
		// let i = Util.getParam(this._note[0], c);
		let i = Util.toArray(Util.lookup(this._note[0], c))[num];
		let f = Util.noteToFreq(i, o);

		// get the slide time for next note and set the frequency
		let s = Util.divToS(Util.getParam(this._slide, c), this.bpm());
		if (s > 0){
			this.sources[id].frequency.rampTo(f, s, time);
		} else {
			this.sources[id].frequency.setValueAtTime(f, time);
		}
	}

	note(i=0, o=0){
		// set the note as semitone interval and octave offset
		// (0, 0) = MidiNote 36
		this._note = [Util.toArray(i), Util.toArray(o)];
	}

	super(d=[0.1], v=[3]){
		// add unison voices and detune the spread
		// first argument is the detune amount
		// second argument changes the amount of voices
		this._voices = Util.toArray(v);
		this._detune = Util.toArray(d);
	}

	fat(...a){
		// alias for super synth
		this.super(...a);
	}

	slide(s){
		// portamento from one note to another
		this._slide = Util.toArray(s);
	}

	wave2(w){
		// placeholder function for wave2
	}

	delete(){
		// delete super class
		super.delete();
		
		console.log('disposed MonoSynth()', this._wave);
	}
}
module.exports = PolySynth;
},{"./PolyInstrument":62,"./Util.js":66,"tone":44}],65:[function(require,module,exports){
const Tone = require('tone');
const Util = require('./Util.js');
const WebMidi = require("webmidi");

// Basic Sequencer class for triggering events
class Sequencer {
	constructor(engine, canvas){
		// The Tone engine
		this._engine = engine;
		this._canvas = canvas;
		
		// Sequencer specific parameters
		this._count = 0;
		this._beatCount = 0;
		this._time = 1;
		this._subdiv = [ 1 ];
		this._offset = 0;
		this._beat = [ 1 ];
		this._human = 0;

		// visual code
		this._visual = [];

		// Tone looper
		this._event;
		this._loop;
		this.makeLoop();

		console.log('=> class Sequencer()');
	}

	bpm(){
		// get the bpm value from Transport
		return Tone.Transport.bpm.value;
	}

	makeLoop(){
		// dispose of previous loop if active
		if (this._loop){
			this._loop.dispose();
		}

		// create the event for a loop or external trigger
		this._event = (time) => {
			// convert transport time to Ticks and convert reset time to ticks
			let ticks = Tone.Transport.getTicksAtTime(time);
			let rTicks = Tone.Time(`${this._reset}m`).toTicks();
	
			// if reset per bar is a valid argument
			if (this._reset > 0){
				// if ticks % resetTicks === 0 then reset
				if (ticks % rTicks === 0){
					this._count = 0;
					this._beatCount = 0;
				}
			}
			// set subdivision speeds
			this._loop.playbackRate = Util.getParam(this._subdiv, this._count);
	
			// humanize method is interesting to add
			this._loop.humanize = Util.getParam(this._human, this._count);
	
			// get beat probability for current count
			let b = Util.getParam(this._beat, this._count);
	
			// if random value is below probability, then play
			if (Math.random() < b){
				// get the count value
				let c = this._beatCount;
	
				// trigger some events for this instrument based
				// on the current count and time
				this.event(c, time);
	
				// send an osc-message trigger of 1 with the /name
				if (window.ioClient){
					setTimeout(() => {
						window.emit([`/${this._name}`, 1]);
					}, (time - Tone.context.currentTime) * 1000);
				}
				// also emit an internal event for other instruments to sync to
				// let event = new CustomEvent(`/${this._name}`, { detail: 1 });
				// window.dispatchEvent(event);
	
				// execute a visual event for Hydra
				if (this._visual.length > 0){
					this._canvas.eval(Util.getParam(this._visual, c));
				}
	
				// increment internal beat counter
				this._beatCount++;
			}
			// increment count for sequencing
			this._count++;
		}

		if (this._time){
			// generate the standard loop if there is a time value
			// calculate the scheduling
			let schedule = Tone.Time(this._offset).toSeconds();
			// create new loop for synth
			this._loop = new Tone.Loop((time) => { this._event(time) }, this._time).start(schedule);
		} 
		// else {
		// 	// generate a listener for the osc-address
		// 	let oscAddress = `${this._offset}`;
		// 	window.addEventListener(oscAddress, (event) => {
		// 		// trigger the event if value greater than 0
		// 		if (event.detail > 0){ 
		// 			Tone.Transport.scheduleOnce((time) => this._event(time), Tone.immediate());
		// 		}
		// 	});
		// }
	}

	event(c, time){
		// specify some events to be triggered specifically for 
		// the inheritting class
		console.log('Sequencer()', this._name, c, time);
	}

	visual(v){
		this._visual = Util.toArray(v);
	}

	fadeIn(t){
		// fade in?
	}

	fadeOut(t){
		// delete the sound
		this.delete();
	}

	delete(){
		// dispose loop
		this._loop.dispose();
		console.log('=> disposed Sequencer()');
	}

	start(){
		// restart at offset
		this._loop.start(this._offset);
	}

	stop(){
		// stop sequencer
		this._loop.stop();
	}

	time(t, o=0, s=[1]){
		// set the timing interval and offset
		if (t === 'free'){
			this._time = null;
			this._offset = Util.toArray(o)[0];
		} else {
			this._time = Util.formatRatio(t, this.bpm());
			this._offset = Util.formatRatio(o, this.bpm());
			// set timing division optionally, also possible via timediv()
			// this.timediv(s);
		}
	}

	timediv(s){
		// set timing subdivisions for the loop
		let tmp = Util.toArray(s);
		this._subdiv = [];
		for (let i=0; i<tmp.length; i++){
			let sub = Math.max(0.001, Math.floor(tmp[i]));
			for (let j=0; j<sub; j++){
				this._subdiv.push(sub);
			}
		}
	}

	beat(b, r='off'){
		// set the beat pattern as an array and reset time in bars
		this._beat = Util.toArray(b);
		this._reset = Math.floor(r);
		if (r === 'off' || r < 1){
			this._reset = -1;
		}
	}

	human(h){
		// set the humanizing factor for the instrument in seconds
		this._human = Util.toArray(h).map(x => Util.divToS(x));
	}

	note(i=0, o=0){
		// set the note as semitone interval and octave offset
		// (0, 0) = MidiNote 36
		this._note = [Util.toArray(i), Util.toArray(o)];
	}

	name(n){
		// placeholder function for name
		// is not used besides when parsing in mercury-lang
		this._name = n;
	}

	group(g){
		// placeholder function for group
		// is not used besides when parsing in mercury-lang
		this._group = g;
	}
}
module.exports = Sequencer;
},{"./Util.js":66,"tone":44,"webmidi":55}],66:[function(require,module,exports){
const { noteToMidi, toScale, mtof } = require('total-serialism').Translate;

// clip a value between a specified range
function clip(v, l, h){
	return Math.max(l, Math.min(h, v));
}

// make sure the output is a number, else output a default value
function assureNum(v, d=1){
	return isNaN(v) ? d : v;
}

// lookup a value from array with wrap index
function lookup(a, i){
	return a[i % a.length];
}

// get random value from array
function randLookup(a){
	if (Array.isArray(a)){
		return a[Math.floor(Math.random() * a.length)];
	}
	return a;
}

// is argument random?
// return random value between lo and hi range
// else return input
function isRandom(a, l=0, h=1){
	if (String(a).match(/rand(om)?/g)){
		return Math.random() * (h - l) + l;
	}
	return a;
}

// get parameter from 1 or 2d array
function getParam(a, i){
	// also check if value is an osc-address, then use last received value
	// return randLookup(getOSC(lookup(a, i)));
	return evalExpr(randLookup(lookup(getOSC(a), i)));
	// return randLookup(lookup(getOSC(a), i));
}

// retrieve received messages via osc as arguments or pass through
function getOSC(a){
	// only take first value from array to check if an osc-address
	let osc = a[0];
	if (typeof osc !== 'string'){
		// pass through
		return a;
	} else if (osc.match(/^\/[^`'"\s]+/g)){
		if (!window.oscMessages[osc]){
			console.log(`No message received on address ${osc}`);
			return [0];
		}
		return window.oscMessages[osc];
	}
	// pass through
	return a;
}

// global functions for string expressions in eval()
// very experimental currently
window.cos = Math.cos;
window.sin = Math.sin;
window.floor = Math.floor;
window.ceil = Math.ceil;
window.round = Math.round;
window.mod = Math.mod;
window.pow = Math.pow;
window.sqrt = Math.sqrt;
window.pi = Math.PI;
window.twopi = Math.PI * 2;

// check if the string is formatted as an expression, then evaluate it
function evalExpr(a){
	let expr = a;
	if (typeof expr !== 'string'){
		return a;
	} else if (expr.match(/^\{[^{}]+\}$/g)){
		let result = 0;
		// console.log('evaluate this expression:', eval(expr));
		try {
			result = eval(expr);
		} catch (e){
			console.log(`Unable to evaluate expression: ${expr}`);
		}
		return result;
	}
	// pass through
	return a;
}

// convert to array if not an array
function toArray(a){
	return Array.isArray(a) ? a : [a];
}

// convert milliseconds to seconds
function msToS(ms){
	return ms / 1000.0;
}

// parse division formats to Tone Loop intervals in seconds
function formatRatio(d, bpm){
	if (String(d).match(/\d+\/\d+/)){
		return eval(String(d)) * 4.0 * 60 / bpm;
	} else if (!isNaN(Number(d))){
		return Number(d) * 4.0 * 60 / bpm;
	} else {
		// print(`${d} is not a valid time value`);
		console.log(`${d} is not a valid time value`);
		return 60 / bpm;
	}
}

// convert division format to seconds based on bpm
function divToS(d, bpm){
	if (String(d).match(/\d+\/\d+/)){
		return eval(String(d)) * 4.0 * 60 / bpm;
	} else if (!isNaN(Number(d))){
		return Number(d) / 1000;
	} else {
		console.log(`${d} is not a valid time value`);
		return 0.1;
	}
}

// convert note value to a frequency 
function noteToFreq(i, o){
	if (isNaN(i)){
		let _i = noteToMidi(i);
		if (!_i){
			console.log(`${i} is not a valid number or name`);
			i = 0;
		} else {
			i = _i - 48;
		}
	}
	// reconstruct midi note value, (0, 0) = 36
	// let n = i + (o * 12) + 36;
	let n = toScale(i + o * 12 + 36);

	// calculate frequency in 12-TET A4 = 440;
	// let f = Math.pow(2, (n - 69)/12) * 440;
	return mtof(n);
}

function assureWave(w){
	let waveMap = {
		sine : 'sine',
		saw : 'sawtooth',
		square : 'square',
		triangle : 'triangle',
		tri : 'triangle',
		rect : 'square',
		fm: 'fmsine',
		am: 'amsine',
		pwm: 'pwm',
		organ: 'sine4',
	}
	if (waveMap[w]){
		w = waveMap[w];
	} else {
		console.log(`${w} is not a valid waveshape`);
		// default wave if wave does not exist
		w = 'sine';
	}
	return w;
}

// convert note and octave (int/float/name) to a midi value
function toMidi(n=0, o=0){
	if (isNaN(n)){
		let _n = noteToMidi(n);
		if (!_n){
			console.log(`${n} is not a valid number or name`);
			n = 0;
		} else {
			n = _n - 36;
		}
	}
	return toScale(n + o * 12 + 36);
}

module.exports = { clip, assureNum, lookup, randLookup, isRandom, getParam, toArray, msToS, formatRatio, divToS, toMidi, mtof, noteToMidi, noteToFreq, assureWave }
},{"total-serialism":47}],67:[function(require,module,exports){
module.exports={
	"uptempo" : 10,
	"downtempo" : 10,
	"reggae" : 70,
	"rnb" : 80,
	"hiphop" : 90,
	"triphop" : 100,
	"pop" : 110,
	"funk" : 120,
	"house" : 120,
	"rock" : 130,
	"techno" : 130,
	"trance" : 135,
	"acid" : 140,
	"metal" : 140,
	"hardstyle" : 150,
	"jungle" : 160,
	"dnb" : 170,
	"neurofunk" : 180
}
},{}],68:[function(require,module,exports){
module.exports={
  "noise_a": "noise/noise_a.wav",
  "drone_cymbal": "ambient/cymbal/drone_cymbal.wav",
  "drone_cymbal_01": "ambient/cymbal/drone_cymbal_01.wav",
  "clap_808": "drums/clap/clap_808.wav",
  "clap_808_short": "drums/clap/clap_808_short.wav",
  "clap_909": "drums/clap/clap_909.wav",
  "clap_min": "drums/clap/clap_min.wav",
  "hat_808": "drums/hat/hat_808.wav",
  "hat_808_open": "drums/hat/hat_808_open.wav",
  "hat_808_semi": "drums/hat/hat_808_semi.wav",
  "hat_909": "drums/hat/hat_909.wav",
  "hat_909_open": "drums/hat/hat_909_open.wav",
  "hat_909_open_short": "drums/hat/hat_909_open_short.wav",
  "hat_909_short": "drums/hat/hat_909_short.wav",
  "hat_click": "drums/hat/hat_click.wav",
  "hat_dub": "drums/hat/hat_dub.wav",
  "hat_min": "drums/hat/hat_min.wav",
  "hat_min_open": "drums/hat/hat_min_open.wav",
  "kick_808": "drums/kick/kick_808.wav",
  "kick_808_dist": "drums/kick/kick_808_dist.wav",
  "kick_909": "drums/kick/kick_909.wav",
  "kick_909_dist": "drums/kick/kick_909_dist.wav",
  "kick_909_dist_long": "drums/kick/kick_909_dist_long.wav",
  "kick_909_long": "drums/kick/kick_909_long.wav",
  "kick_deep": "drums/kick/kick_deep.wav",
  "kick_dub": "drums/kick/kick_dub.wav",
  "kick_house": "drums/kick/kick_house.wav",
  "kick_min": "drums/kick/kick_min.wav",
  "kick_sub": "drums/kick/kick_sub.wav",
  "kick_ua": "drums/kick/kick_ua.wav",
  "kick_vintage": "drums/kick/kick_vintage.wav",
  "block": "drums/perc/block.wav",
  "block_lo": "drums/perc/block_lo.wav",
  "bongo": "drums/perc/bongo.wav",
  "bongo_lo": "drums/perc/bongo_lo.wav",
  "clave_808": "drums/perc/clave_808.wav",
  "cowbell_808": "drums/perc/cowbell_808.wav",
  "cymbal_808": "drums/perc/cymbal_808.wav",
  "maracas_808": "drums/perc/maracas_808.wav",
  "snare_808": "drums/snare/snare_808.wav",
  "snare_909": "drums/snare/snare_909.wav",
  "snare_909_short": "drums/snare/snare_909_short.wav",
  "snare_ac": "drums/snare/snare_ac.wav",
  "snare_dnb": "drums/snare/snare_dnb.wav",
  "snare_dub": "drums/snare/snare_dub.wav",
  "snare_fat": "drums/snare/snare_fat.wav",
  "snare_hvy": "drums/snare/snare_hvy.wav",
  "snare_min": "drums/snare/snare_min.wav",
  "snare_rock": "drums/snare/snare_rock.wav",
  "snare_step": "drums/snare/snare_step.wav",
  "tabla_01": "drums/tabla/tabla_01.wav",
  "tabla_02": "drums/tabla/tabla_02.wav",
  "tabla_03": "drums/tabla/tabla_03.wav",
  "tabla_hi": "drums/tabla/tabla_hi.wav",
  "tabla_hi_long": "drums/tabla/tabla_hi_long.wav",
  "tabla_hi_short": "drums/tabla/tabla_hi_short.wav",
  "tabla_lo": "drums/tabla/tabla_lo.wav",
  "tabla_lo_long": "drums/tabla/tabla_lo_long.wav",
  "tabla_lo_short": "drums/tabla/tabla_lo_short.wav",
  "tabla_mid": "drums/tabla/tabla_mid.wav",
  "tabla_mid_long": "drums/tabla/tabla_mid_long.wav",
  "tabla_mid_short": "drums/tabla/tabla_mid_short.wav",
  "tom_808": "drums/tom/tom_808.wav",
  "tom_hi": "drums/tom/tom_hi.wav",
  "tom_lo": "drums/tom/tom_lo.wav",
  "tom_mid": "drums/tom/tom_mid.wav",
  "tongue": "foley/body/tongue.wav",
  "tongue_lo": "foley/body/tongue_lo.wav",
  "shatter": "foley/glass/shatter.wav",
  "metal": "foley/metal/metal.wav",
  "metal_lo": "foley/metal/metal_lo.wav",
  "wobble": "foley/plastic/wobble.wav",
  "wobble_02": "foley/plastic/wobble_02.wav",
  "door": "foley/wood/door.wav",
  "scrape": "foley/wood/scrape.wav",
  "scrape_01": "foley/wood/scrape_01.wav",
  "wood_hit": "foley/wood/wood_hit.wav",
  "wood_metal": "foley/wood/wood_metal.wav",
  "wood_plate": "foley/wood/wood_plate.wav",
  "bell": "idiophone/bell/bell.wav",
  "chimes": "idiophone/chimes/chimes.wav",
  "chimes_chord": "idiophone/chimes/chimes_chord.wav",
  "chimes_chord_01": "idiophone/chimes/chimes_chord_01.wav",
  "chimes_chord_02": "idiophone/chimes/chimes_chord_02.wav",
  "chimes_hi": "idiophone/chimes/chimes_hi.wav",
  "gong_hi": "idiophone/gong/gong_hi.wav",
  "gong_lo": "idiophone/gong/gong_lo.wav",
  "kalimba_a": "idiophone/kalimba/kalimba_a.wav",
  "kalimba_ab": "idiophone/kalimba/kalimba_ab.wav",
  "kalimba_cis": "idiophone/kalimba/kalimba_cis.wav",
  "kalimba_e": "idiophone/kalimba/kalimba_e.wav",
  "kalimba_g": "idiophone/kalimba/kalimba_g.wav",
  "bamboo_a": "idiophone/marimba-bamboo/bamboo_a.wav",
  "bamboo_c": "idiophone/marimba-bamboo/bamboo_c.wav",
  "bamboo_f": "idiophone/marimba-bamboo/bamboo_f.wav",
  "bamboo_g": "idiophone/marimba-bamboo/bamboo_g.wav",
  "bowl_hi": "idiophone/singing-bowl/bowl_hi.wav",
  "bowl_lo": "idiophone/singing-bowl/bowl_lo.wav",
  "bowl_mid": "idiophone/singing-bowl/bowl_mid.wav",
  "rhodes_8bit": "keys/pad/rhodes_8bit.wav",
  "piano_a": "keys/piano/piano_a.wav",
  "piano_b": "keys/piano/piano_b.wav",
  "piano_c": "keys/piano/piano_c.wav",
  "piano_d": "keys/piano/piano_d.wav",
  "piano_e": "keys/piano/piano_e.wav",
  "piano_f": "keys/piano/piano_f.wav",
  "piano_g": "keys/piano/piano_g.wav",
  "amen": "loops/breaks/amen.wav",
  "amen_alt": "loops/breaks/amen_alt.wav",
  "amen_break": "loops/breaks/amen_break.wav",
  "amen_fill": "loops/breaks/amen_fill.wav",
  "house": "loops/breaks/house.wav",
  "chimes_l": "loops/chimes/chimes_l.wav",
  "noise_c": "loops/noise/noise_c.wav",
  "noise_e": "loops/noise/noise_e.wav",
  "noise_e_01": "loops/noise/noise_e_01.wav",
  "noise_mw": "loops/noise/noise_mw.wav",
  "noise_p": "loops/noise/noise_p.wav",
  "noise_r": "loops/noise/noise_r.wav",
  "choir_01": "vocal/choir/choir_01.wav",
  "choir_02": "vocal/choir/choir_02.wav",
  "choir_03": "vocal/choir/choir_03.wav",
  "choir_o": "vocal/choir/choir_o.wav",
  "wiper": "loops/foley/car/wiper.wav",
  "wiper_out": "loops/foley/car/wiper_out.wav",
  "wood_l": "loops/foley/wood/wood_l.wav",
  "wood_l_01": "loops/foley/wood/wood_l_01.wav",
  "violin_a": "string/bowed/violin/violin_a.wav",
  "violin_b": "string/bowed/violin/violin_b.wav",
  "violin_c": "string/bowed/violin/violin_c.wav",
  "violin_d": "string/bowed/violin/violin_d.wav",
  "violin_e": "string/bowed/violin/violin_e.wav",
  "violin_f": "string/bowed/violin/violin_f.wav",
  "violin_g": "string/bowed/violin/violin_g.wav",
  "harp_down": "string/plucked/harp/harp_down.wav",
  "harp_up": "string/plucked/harp/harp_up.wav",
  "pluck_a": "string/plucked/violin/pluck_a.wav",
  "pluck_b": "string/plucked/violin/pluck_b.wav",
  "pluck_c": "string/plucked/violin/pluck_c.wav",
  "pluck_d": "string/plucked/violin/pluck_d.wav",
  "pluck_e": "string/plucked/violin/pluck_e.wav",
  "pluck_f": "string/plucked/violin/pluck_f.wav",
  "pluck_g": "string/plucked/violin/pluck_g.wav"
}

},{}],69:[function(require,module,exports){

const Tone = require('tone');
const Mercury = require('mercury-lang');
const TL = require('total-serialism').Translate;
// const Util = require('total-serialism').Utility;

const MonoSample = require('./core/MonoSample.js');
const MonoMidi = require('./core/MonoMidi.js');
const MonoSynth = require('./core/MonoSynth.js');
const MonoInput = require('./core/MonoInput.js');
const PolySynth = require('./core/PolySynth.js');
const PolySample = require('./core/PolySample.js');
const Tempos = require('./data/genre-tempos.json');

class MercuryInterpreter {
	constructor(){
		// cross-fade time
		this.crossFade = 0.5;
		
		// arrays with the current and previous instruments for crossfade
		this._sounds = [];
		this.sounds = [];

		// storage of latest evaluated code
		this._code = '';

		// parsetree storage
		this.parse;
		this.tree;
		this.errors;
	}

	getSounds(){
		return this.sounds;
	}
	
	transferCounts(_s, s){
		// transfer the time of the previous sound to the new sound object
		// to preserve continuity when re-evaluating code
		// this works only for instruments that have a name()
		_s.map((prev) => {
			s.map((cur) => {
				if (cur._name === prev._name){
					cur._count = prev._count;
					cur._beatCount = prev._beatCount;
				}
			});
		});
	}
	
	startSounds(s, f=0){
		// fade in new sounds
		s.map((_s) => {
			_s.fadeIn(f);
		});
	}
	
	removeSounds(s, f=0) {
		// fade out and delete after fade
		s.map((_s) => {
			_s.fadeOut(f);
		});
		// empty array to trigger garbage collection
		s.length = 0;
	}

	code({ file='', canvas, p5canvas } = {}){
		// parse and evaluate the inputted code
		// as an asyncronous function with promise
		let c = (!file)? this._code : file;
		this._code = c;

		let t = Tone.Transport.seconds;
		// is this necessary?
		// let parser = new Promise((resolve) => {
		// 	return resolve(Mercury(c));
		// });
		// this.parse = await parser;
		this.parse = Mercury(c);
		console.log(`Evaluated code in: ${((Tone.Transport.seconds-t) * 1000).toFixed(3)}ms`);

		this.tree = this.parse.parseTree;
		this.errors = this.parse.errors;

		// let l = document.getElementById('console-log');
		// l.innerHTML = '';
		// handle .print and .errors
		this.errors.forEach((e) => {
			console.log(e);
			// log(e);
		});
		if (this.errors.length > 0){
			// return if the code contains any syntax errors
			console.log(`Could not run because of syntax error`);
			console.log(`Please see Help for more information`);
			return;
		}

		this.tree.print.forEach((p) => {
			console.log(p);
		});

		// hide canvas and noLoop
		// p5canvas.hide();

		// handle .display to p5
		// tree.display.forEach((p) => {
		// 	// restart canvas if view is used
		// 	let n = Util.mul(Util.normalize(p), 255);
		// 	p5canvas.sketch.fillCanvas(n);
		// 	p5canvas.display();
		// });

		// set timer to check evaluation time
		t = Tone.Transport.seconds;

		// Handle all the global settings here
		const globalMap = {
			'crossFade' : (args) => {
				// set crossFade time in ms
				this.crossFade = Number(args[0]) / 1000;
				// log(`crossfade time is ${args[0]}ms`);
				console.log(`Crossfade: ${args[0]}ms`);
			},
			'tempo' : (args) => {
				let t = args[0];
				if (isNaN(t)){
					t = Tempos[args[0].toLowerCase()];
					if (t === undefined){
						console.log(`tempo ${args[0]} is not a valid genre or number`);
						return;
					}
					args[0] = t;
				}
				this.bpm(...args);
				// engine.setBPM(...args);
				// log(`set bpm to ${bpm}`);
			}, 
			'silence' : (mute) => {
				if (mute){ 
					// engine.silence(); 
					this.silence(); 
				}
			},
			'scale' : (args) => {
				let s = TL.scaleNames();
				let scl = Array.isArray(args[0])? args[0][0] : args[0];
				let rt = Array.isArray(args[1])? args[1][0] : args[1];
	
				if (scl.match(/(none|null|off)/)){
					TL.setScale('chromatic');
					TL.setRoot('c');
					// document.getElementById('scale').innerHTML = '';
					return;
				}
	
				if (s.indexOf(scl) > -1){
					TL.setScale(scl);
				} else {
					console.log(`${scl} is not a valid scale`);
				}
				if (rt){
					TL.setRoot(rt);
				}
	
				let tmpS = TL.getScale().scale;
				let tmpR = TL.getScale().root;
				// document.getElementById('scale').innerHTML = `scale = ${tmpR} ${tmpS}`;
				// log(`set scale to ${tmpR} ${tmpS}`);
			},
			'amp' : (args) => {
				this.setVolume(...args);
				// engine.setVolume(...args);
			},
			'highPass' : (args) => {
				this.setHighPass(...args);
				// engine.setHiPass(...args);
			},
			'lowPass' : (args) => {
				this.setLowPass(...args);
				// engine.setLowPass(...args);
			}
		}

		// Handling all the different instrument types here
		const objectMap = {
			'sample' : (obj) => {		
				let inst = new MonoSample(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'loop' : (obj) => {		
				let inst = new MonoSample(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'synth' : (obj) => {		
				console.log(obj);
				let inst = new MonoSynth(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'polySynth' : (obj) => {
				let inst = new PolySynth(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'polySample' : (obj) => {
				let inst = new PolySample(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'midi' : (obj) => {
				let inst = new MonoMidi(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'input' : (obj) => {
				let inst = new MonoInput(this, obj.type, canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'applyFunctions' : (args, inst, type) => {
				// apply arguments to instrument if part of instrument
				Object.keys(args).forEach((a) => {
					if (inst[a]){
						inst[a](...args[a]);
					} else {
						console.log(`${a}() is not a function of ${type}`);
					}
				});
				return inst;
			}
		}

		// copy current sounds over to past
		this._sounds = this.sounds.slice();
		// empty new sounds array
		this.sounds = [];

		// handle .global
		Object.keys(this.tree.global).forEach((g) => {
			if (globalMap[g]){
				globalMap[g](this.tree.global[g]);
			}
		});

		// handle .objects
		for (let o in this.tree.objects){
			let type = this.tree.objects[o].object;
			if (objectMap[type]){
				this.sounds.push(objectMap[type](this.tree.objects[o]));
			} else {
				log(`Instrument named '${type}' is not supported`);
			}
		}

		// start new loops;
		this.sounds.map((s) => {
			s.makeLoop();
		});

		console.log(`Instruments added in: ${((Tone.Transport.seconds - t) * 1000).toFixed(3)}ms`);
		
		this.transferCounts(this._sounds, this.sounds);
		
		// when all loops started fade in the new sounds and fade out old
		if (!this.sounds.length){
			this.startSounds(this.sounds);
		}
		this.startSounds(this.sounds, this.crossFade);
		this.removeSounds(this._sounds, this.crossFade);

		this.resume();
	}
}
module.exports = { MercuryInterpreter }
},{"./core/MonoInput.js":58,"./core/MonoMidi.js":59,"./core/MonoSample.js":60,"./core/MonoSynth.js":61,"./core/PolySample.js":63,"./core/PolySynth.js":64,"./data/genre-tempos.json":67,"mercury-lang":27,"tone":44,"total-serialism":47}],70:[function(require,module,exports){

console.log('Mercury Engine Package Included');

const Tone = require('tone');
const { MercuryInterpreter } = require('./interpreter');

// load extra AudioWorkletProcessors from file
// transformed to inline with browserify brfs

const fxExtensions = "\n// A white noise generator at -6dBFS to test AudioWorkletProcessor\n//\nclass NoiseProcessor extends AudioWorkletProcessor {\n\tprocess(inputs, outputs, parameters){\n\t\tconst output = outputs[0];\n\n\t\toutput.forEach((channel) => {\n\t\t\tfor (let i=0; i<channel.length; i++) {\n\t\t\t\tchannel[i] = Math.random() - 0.5;\n\t\t\t}\n\t\t});\n\t\treturn true;\n\t}\n}\nregisterProcessor('noise-processor', NoiseProcessor);\n\n// A Downsampling Chiptune effect. Downsamples the signal by a specified amount\n// Resulting in a lower samplerate, making it sound more like 8bit/chiptune\n// Programmed with a custom AudioWorkletProcessor, see effects/Processors.js\n//\nclass DownSampleProcessor extends AudioWorkletProcessor {\n\tstatic get parameterDescriptors() {\n\t\treturn [{\n\t\t\tname: 'down',\n\t\t\tdefaultValue: 8,\n\t\t\tminValue: 1,\n\t\t\tmaxValue: 2048\n\t\t}];\n\t}\n\n\tconstructor(){\n\t\tsuper();\n\t\t// the frame counter\n\t\tthis.count = 0;\n\t\t// sample and hold variable array\n\t\tthis.sah = [];\n\t}\n\n\tprocess(inputs, outputs, parameters){\n\t\tconst input = inputs[0];\n\t\tconst output = outputs[0];\n\n\t\t// if there is anything to process\n\t\tif (input.length > 0){\n\t\t\t// for the length of the sample array (generally 128)\n\t\t\tfor (let i=0; i<input[0].length; i++){\n\t\t\t\tconst d = (parameters.down.length > 1) ? parameters.down[i] : parameters.down[0];\n\t\t\t\t// for every channel\n\t\t\t\tfor (let channel=0; channel<input.length; ++channel){\n\t\t\t\t\t// if counter equals 0, sample and hold\n\t\t\t\t\tif (this.count % d === 0){\n\t\t\t\t\t\tthis.sah[channel] = input[channel][i];\n\t\t\t\t\t}\n\t\t\t\t\t// output the currently held sample\n\t\t\t\t\toutput[channel][i] = this.sah[channel];\n\t\t\t\t}\n\t\t\t\t// increment sample counter\n\t\t\t\tthis.count++;\n\t\t\t}\n\t\t}\n\t\treturn true;\n\t}\n}\nregisterProcessor('downsampler-processor', DownSampleProcessor);\n\n// A distortion algorithm using the tanh (hyperbolic-tangent) as a \n// waveshaping technique. Some mapping to apply a more equal loudness \n// distortion is applied on the overdrive parameter\n//\nclass TanhDistortionProcessor extends AudioWorkletProcessor {\n\tconstructor(){\n\t\tsuper();\n\t}\n\n\tprocess(inputs, outputs, parameters){\n\t\tconst input = inputs[0];\n\t\tconst output = outputs[0];\n\n\t\tif (input.length > 0){\n\t\t\tfor (let channel=0; channel<input.length; ++channel){\n\t\t\t\tfor (let i=0; i<input[channel].length; i++){\n\t\t\t\t\t// simple waveshaping with tanh\n\t\t\t\t\toutput[channel][i] = Math.tanh(input[channel][i]);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn true;\n\t}\n}\nregisterProcessor('tanh-distortion-processor', TanhDistortionProcessor);\n\n// A distortion/compression effect of an incoming signal\n// Based on an algorithm by Peter McCulloch\n// \nclass SquashProcessor extends AudioWorkletProcessor {\n\tstatic get parameterDescriptors(){\n\t\treturn [{\n\t\t\tname: 'amount',\n\t\t\tdefaultValue: 4,\n\t\t\tminValue: 1,\n\t\t\tmaxValue: 1024\n\t\t}];\n\t}\n\n\tconstructor(){\n\t\tsuper();\n\t}\n\n\tprocess(inputs, outputs, parameters){\n\t\tconst input = inputs[0];\n\t\tconst output = outputs[0];\n\t\t\n\t\tif (input.length > 0){\n\t\t\tfor (let channel=0; channel<input.length; ++channel){\n\t\t\t\tfor (let i=0; i<input[channel].length; i++){\n\t\t\t\t\t// (s * a) / ((s * a)^2 * 0.28 + 1) / √a\n\t\t\t\t\t// drive amount, minimum of 1\n\t\t\t\t\tconst a = (parameters.amount.length > 1)? parameters.amount[i] : parameters.amount[0];\n\t\t\t\t\t// set the waveshaper effect\n\t\t\t\t\tconst s = input[channel][i];\n\t\t\t\t\tconst p = (s * a) / ((s * a) * (s * a) * 0.28 + 1.0);\n\t\t\t\t\toutput[channel][i] = p;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn true;\n\t}\n}\nregisterProcessor('squash-processor', SquashProcessor);";
Tone.getContext().addAudioWorkletModule(URL.createObjectURL(new Blob([ fxExtensions ], { type: 'text/javascript' })));

// Mercury main class controls Tone and loads samples
// also has the interpreter evaluating the code and adding the instruments
// 
class Mercury extends MercuryInterpreter {
	constructor(callback){
		// initalize the constructor of inheriting class
		super();
		// store sample files in buffers
		this.samples = require('./data/samples.json');

		// this.buffers = new Tone.ToneAudioBuffers();
		// add the buffers via function
		// this.addBuffers(['http://localhost:8080/mercury-engine/src/data/samples.json'])

		// effects on main output for Tone
		this.gain = new Tone.Gain(1);
		this.lowPass = new Tone.Filter(18000, 'lowpass');
		this.highPass = new Tone.Filter(5, 'highpass');
		Tone.Destination.chain(this.lowPass, this.highPass, this.gain);

		// a recorder for the sound
		this.recorder = new Tone.Recorder({ mimeType: 'audio/webm' });
		this.gain.connect(this.recorder);

		this.buffers = new Tone.ToneAudioBuffers({
			urls: this.samples,
			baseUrl: "https://raw.githubusercontent.com/tmhglnd/mercury-playground/main/public/assets/samples/",
			onload: () => {
				console.log('Samples loaded', this.buffers);
				// executes a callback from the class constructor
				if (callback){ callback(); }
			}
		});
	}

	// resume webaudio and transport
	resume(){
		try {
			Tone.start();

			if (Tone.Transport.state !== 'started'){
				Tone.Transport.timeSignature = [4, 4];
				// a bit latency for safety
				Tone.Transport.start('+0.1');
				console.log('Resumed Tone Transport');
			}
		} catch {
			console.error('Error starting ToneJS');
		}
	}

	// stop the transport and all the sounds
	silence(){
		try {
			// fade out and remove code after 100ms
			this.removeSounds(this.sounds, 0.1);
			// Stops instead of pause so restarts at 0
			Tone.Transport.stop();
			console.log('Stopped Tone Transport');
		} catch {
			console.error('Error stopping Transport');
		}
	}

	// set the bpm and optionally ramp in milliseconds
	bpm(bpm, ramp=0) {
		if (ramp > 0){
			Tone.Transport.bpm.rampTo(bpm, ramp / 1000);
		} else {
			Tone.Transport.bpm.setValueAtTime(bpm, Tone.now());
		}
	}

	// return the current bpm
	getBPM(){
		return Tone.Transport.bpm.value;
	}

	// generate a random bpm between 75 and 150
	randomBPM(){
		let bpm = Math.floor(Math.random() * 75) + 75.0;
		this.bpm(bpm);
	}

	// add files to the buffer from a single File Link
	// an array or file paths, or a json of { name:file, ... }
	async addSamples(uploads){
		// for every file from uploads
		uploads.forEach((f) => {
			let n = f;
			let url = f;
			if (f.name){
				// get the filename from File object
				n = f.name;
				url = URL.createObjectURL(f);
			}
			if (Array.isArray(f)){
				// if array use first value as the name
				n = f[0];
				url = f[1];
			}
			if (n.endsWith('.json')){
				// read from json if loaded is a json file
				this.addBufferFromJson(url);
			} else {
				// otherwise read the soundfile regularly
				this.addBufferFromURL(url, n);
			}
		});
		console.log('Done loading all sounds!');
	}

	// add a single file to the buffer from URL
	// use the name as reference in the buffer
	// if name is undefined it will be constructed from the URL
	// 
	addBufferFromURL(url, n){
		// get file name from url string
		n = n.split('\\').pop().split('/').pop();
		// remove extension 
		n = n.replace(/\.\w+/g, '');
		// replace whitespaces with _
		n = n.replace(/[\s]+/g, '_');
		// remove leading/trailing whitespace
		n = n.trim().replace(/[\s]+/g, '_');

		// add to ToneAudioBuffers
		this.buffers.add(n, url, () => {
			console.log(`sound added as: ${n}`);
			URL.revokeObjectURL(url);

			// also add soundfiles to menu for easy selection
			// let m = document.getElementById('sounds');
			// let o = document.createElement('option');
			// o.value = o.innerHTML = n;
			// m.appendChild(o);
		}, (e) => {
			console.log(`error adding sound from: ${n}`);
		});
	}

	async addBufferFromJson(url){
		// get the json file via fetch
		let response = await fetch(url);
		let files = await response.json();
		// if there is a _base use that as the start of the url
		let base = files['_base'];
		delete files['_base'];

		Object.keys(files).forEach((f) => {
			if (Array.isArray(files[f])){
				let idx = 0;
				files[f].forEach((i) => {
					// when array is used increment the filename with _x
					let u = (base)? base + i : i;
					let n = (idx > 0)? f + '_' + idx : f;
					this.addBufferFromURL(u, n);
					idx++;
				});
			} else {
				if (base){
					files[f] = base + files[f];
				}
				this.addBufferFromURL(files[f], f);
			}
		});
	}

	// get all the contents of the buffers
	getBuffers(){
		return this.buffers;
	}

	// set lowpass frequency cutoff and ramptime
	setLowPass(f, t=0){
		if (t > 0){
			this.lowPass.frequency.rampTo(f, t/1000, Tone.now());
		} else {
			this.lowPass.frequency.setValueAtTime(f, Tone.now());
		}
	}

	// set highpass frequency cutoff and ramptime
	setHighPass(f, t=0){
		if (t > 0){
			this.highPass.frequency.rampTo(f, t/1000, Tone.now());
		} else {
			this.highPass.frequency.setValueAtTime(f, Tone.now());
		}
	}

	// set volume in floatingpoint and ramptime
	setVolume(v, t=0){
		if (t > 0){
			this.gain.gain.rampTo(v, t/1000, Tone.now());
		} else {
			this.gain.gain.setValueAtTime(v, Tone.now());
		}
	}

	// a recording function
	// default starts recording, a false/0 stops recording
	// optionally add a filename to the downloading file
	async record(start=true, file='recoring'){
		try {
			if (start){
				// star the recording
				this.recorder.start();
			} else {
				// stop the recording and return blob
				const recording = await this.recorder.stop();
				const url = URL.createObjectURL(recording);
				// download via anchor element
				const anchor = document.createElement('a');
				anchor.download = `${file}.webm`;
				anchor.href = url;
				anchor.click();
			}
		} catch(e) {
			console.log(`Error starting/stopping recording ${e}`);
		}
	}

	// returns 'started' if the recording has started
	isRecording(){
		return this.recorder.state;
	}
}
module.exports = { Mercury };
},{"./data/samples.json":68,"./interpreter":69,"tone":44}]},{},[70])(70)
});