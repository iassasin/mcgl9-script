function (input) {
    var dictionary = [0, 1, 2],
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        f = String.fromCharCode,
        mpow = Math.pow,
        w,
        bits, power,
        c,
        value,
        pos = 0,
        idx = 0;

    var readBits = function(pow) {
      bits = 0;
      power=1;
      while (power != mpow(2,pow)) {
        if (pos == 0) {
          pos = 32;
          value = (value = input.charCodeAt(idx++), value > 92 ? value - 59 : value - 58);
          // : = 58
          // \ = 92
        }

        bits |= ((value & pos) > 0 ? 1 : 0) * power;
        power <<= 1;
        pos >>= 1;
      }
    };

    readBits(2);
    readBits(bits*8+8);
    c = f(bits);

    /*
    // was:
    switch (bits) {
      case 0:
        iteratePower(8);
        c = f(bits);
        break;
      case 1:
        iteratePower(16);
        c = f(bits);
        break;
      case 2:
        return "";
    }
    */

    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      /*
      if (idx > input.length) {
        return "";
      }
      */

      readBits(numBits);

      if (bits == 2) {
        return result.join('');
      }

      if ((c=bits) < 2 && bits >= 0) {
        readBits(bits*8+8);
        dictionary[dictSize++] = f(bits);
        c = dictSize-1;
        enlargeIn--;
      }


      /*
      // was:
      switch (c = bits) {
        case 0:
          iteratePower(8);

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          iteratePower(16);
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }
      */


      if (enlargeIn == 0) {
        enlargeIn = mpow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w[0];
        }/* else {
          return null;
        }*/
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry[0];
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = mpow(2, numBits);
        numBits++;
      }

    }
  }