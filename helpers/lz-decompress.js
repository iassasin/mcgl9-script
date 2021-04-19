function (input) {
    var dictionary = [0, 1, 2],
        enlargeIn = 1,
        dictSize = 3,
        numBits = 1,
        entry = "",
        result = [],
        f = String.fromCharCode,
        w,
        bits, power,
        c,
        value,
        pos = 0,
        idx = 0;

    var readBits = function(pow) {
      bits = 0;
      power=0;
      while (power < pow) {
        if (pos == 0) {
          pos = 32;
          value = (value = input.charCodeAt(idx++), value > 92 ? value - 59 : value - 58);
          // : = 58
          // \ = 92
        }

        bits |= ((value & pos) > 0 ? 1 : 0) << power;
        ++power;
        pos >>= 1;
      }
    };

    while (true) { // idx > input.length => return ""
      readBits(numBits+1);

      if (bits == 2) {
        return result.join('');
      }

      // actually, array contents doesnt matter, all we need is indexes 0,1
      if ((c=bits) in [0,1]) {
        readBits(bits*8+8);
        dictionary[c = dictSize++] = f(bits);

        if (!--enlargeIn) {
          enlargeIn = 2 << numBits++;
        }
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else { // c !== dictSize => return null
        entry = w + w[0];
      }
      result.push(entry);

      if (w) {
        dictionary[dictSize++] = w + entry[0];

        if (!--enlargeIn) {
          enlargeIn = 2 << numBits++;
        }
      }

      w = entry;
    }
  }