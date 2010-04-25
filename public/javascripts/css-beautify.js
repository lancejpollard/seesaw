//gogo global variable
var level = 0;

function css_beautify(code) {
  if ('\n' == code[0]) code = code.substr(1);
  code = code.replace(/([^\/])?\n*/g, '$1');
  code = code.replace(/\n\s+/g, '\n');
  code = code.replace(/[	 ]+/g, ' ');
  code = code.replace(/\s?([;:{},+>])\s?/g, '$1');
  code = code.replace(/\{(.*):(.*)\}/g, '{$1: $2}');
	
  var out = tabs();
  var li = level;
  
  for (var i = 0; i < code.length && i < code.length; i++) {
    if ('{' == code.charAt(i)) {
      level++;
      out += ' {\n' + tabs();
    } else if ('}' == code.charAt(i)) {
      out = out.replace(/\s*$/, '');
      level--;
      out += '\n' + tabs() + '}\n' + tabs();
    } else if (';' == code.charAt(i)) {
      out += ';\n' + tabs();
    } else if ('\n' == code.charAt(i)) {
      out += '\n' + tabs();
    } else {
      out += code.charAt(i);
    }
  }

  out = out.replace(/[\s\n]*$/, '');

  out = out.replace(/\n\s*\n/g, '\n'); //blank lines
  out = out.replace(/^[\s\n]*/, ''); //leading space
  out = out.replace(/[\s\n]*$/, ''); //trailing space
  level = 0;
	return out;
}

function tabs() {
  var s = '';
  for (var j = 0; j < level; j++) s += '  '; // or \t
  return s;
}