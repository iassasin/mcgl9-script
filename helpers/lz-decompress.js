function (input) {
    var dictionary = [0, 1, 2],
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
		f = String.fromCharCode,
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {v:(i = input.charCodeAt(0),i > 92 ? i - 59 : i - 58), p:32, i:1};

    var iteratePower = function(pow) {
      bits = 0;
      maxpower = Math.pow(2,pow);
      power=1;
      while (power!=maxpower) {
        resb = data.v & data.p;
        data.p >>= 1;
        if (data.p == 0) {
          data.p = 32;
          data.v = (i = input.charCodeAt(data.i++), i > 92 ? i - 59 : i - 58);
          // : = 58
          // \ = 92
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }
    };

    iteratePower(2);
    iteratePower(bits*8+8);
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
      if (data.i > input.length) {
        return "";
      }
      */

      iteratePower(numBits);

      if (bits == 2) {
        return result.join('');
      }

      if ((c=bits) < 2 && bits >= 0) {
        iteratePower(bits*8+8);
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
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        }/* else {
          return null;
        }*/
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }