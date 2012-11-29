var bigint = require('bigint');

exports.codeFunc = function (id, data) {
  var i, char, tmp1, tmp3, tmp7, tmp2 = 0;

  data = new Buffer(data);
  var length = data.length;

  tmp1 = bigint(id).and(0x0000FF00).shiftRight(8);

  if (bigint(id).and(0x0000FF00).eq(0)) {
    tmp3 = bigint(0x000000FF).and(~tmp1);
  } else {
    tmp3 = bigint(0x000000FF).and(bigint(id).and(0x00FF0000).shiftRight(16));
  }

  tmp3 = tmp3
    .or(bigint(0x000000FF).and(id).shiftLeft(8))
    .shiftLeft(8)
    .or(bigint(0x000000FF).and(tmp1))
    .shiftLeft(8);

  if (bigint(id).and(0xFF000000).eq(0)) {
    tmp3 = tmp3.or(bigint(0x000000FF).and(~id));
  } else {
    tmp3 = tmp3.or(bigint(0x000000FF).and(bigint(id).shiftRight(24)));
  }

  i = length - 1;
  while (i >= 0) {
    char = bigint(data[i]);
    if (char.ge(0x80)) {
      char = char.sub(0x100);
    }
    tmp1 = char.add(tmp2).and(0x00000000FFFFFFFF);
    tmp2 = bigint(tmp2).shiftLeft(i % 2 + 4).and(0x00000000FFFFFFFF);
    tmp2 = tmp1.add(tmp2).and(0x00000000FFFFFFFF);
    i -= 1;
  }

  i = 0;
  tmp1 = 0;
  while (i <= length - 1) {
    char = bigint(data[i]);
    if (char.ge(128)) {
      char = char.sub(256);
    }
    tmp7 = char.add(tmp1).and(0x00000000FFFFFFFF);
    tmp1 = bigint(tmp1).shiftLeft(i % 2 + 3).and(0x00000000FFFFFFFF);
    tmp1 = tmp1.add(tmp7).and(0x00000000FFFFFFFF);
    i += 1;
  }

  tmp1 = tmp2
    .xor(tmp3)
    .and(0x00000000FFFFFFFF)
    .add(tmp1.or(id))
    .and(0x00000000FFFFFFFF)
    .mul(tmp1.or(tmp3))
    .and(0x00000000FFFFFFFF)
    .mul(tmp2.xor(id))
    .and(0x00000000FFFFFFFF);

  if (tmp1.gt(0x80000000)) {
    tmp1 = tmp1.sub(0x100000000);
  }
  return tmp1.toString();
};


exports.encode = function (str) {
  var s = '';
  str = new Buffer(str, 'ucs2');
  for (var i = 0, l = str.length; i < l; i++) {
    s += str[i].toString(16);
  }
  return s;
};

