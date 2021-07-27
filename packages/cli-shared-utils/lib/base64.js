// base64 加密
const _utf8_encode_new = function(string) {
  const code = encodeURIComponent(string);
  const bytes = [];
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2);
      const hexVal = parseInt(hex, 16);
      bytes.push(hexVal);
      i += 2;
    } else bytes.push(c.charCodeAt(0));
  }
  return bytes;
};


// private method for UTF-8 decoding
const _utf8_decode = function(utftext) {
  let c2; let c3;
  let string = '';
  let i = 0;
  let c = (c2 = 0);
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
};


function Base64() {
  // private property
  const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  // public method for encoding
  this.encode = function(input) {
    let output = '';
    let chr1; let chr2; let chr3; let enc1; let enc2; let enc3; let enc4;
    let i = 0;
    input = _utf8_encode_new(input);
    while (i < input.length) {
      chr1 = input[i++];
      chr2 = input[i++];
      chr3 = input[i++];
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output =
        output +
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4);
    }
    return output;
  };

  // public method for decoding
  this.decode = function(input) {
    let output = '';
    const outputArr = [];
    let chr1; let chr2; let chr3;
    let enc1; let enc2; let enc3; let enc4;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9+/=]/g, '');
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output += String.fromCharCode(chr1);
      outputArr.push(chr1);
      if (enc3 != 64) {
        output += String.fromCharCode(chr2);
        outputArr.push(chr2);
      }
      if (enc4 != 64) {
        output += String.fromCharCode(chr3);
        outputArr.push(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  };


  this.safeUrlEncode = function(input) {
    const encodeBase64 = this.encode(input);
    const safeBase64 = encodeBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/, '');
    return safeBase64;
  };

  this.safeUrlDecode = function(input) {
    let safeBase64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const mod4 = safeBase64.length % 4;
    if(mod4) {
      safeBase64 += '=';
    }
    return this.decode(safeBase64);
  };
}

exports.base64 = new Base64();
