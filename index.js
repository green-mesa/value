/**
 * Module dependencies.
 */

var typeOf = require('type');

/**
 * Set or get `el`'s' value.
 *
 * @param {Element} el
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

module.exports = function(el, val){
  if (2 == arguments.length) return set(el, val);
  return get(el);
};

/**
 * Get `el`'s value.
 */

function get(el) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (el.checked) {
        var attr = el.getAttribute('value');
        return null == attr ? true : attr;
      } else {
        return false;
      }
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        if (radio.checked) return radio.value;
      }
      break;
    case 'select':
      var vals = [];
      for (var i = 0, option; option = el.options[i]; i++) {
        if (option.selected) vals.push(option.value);
      }
      return (vals.length===1 ? vals[0] : vals);
      break;
    default:
      return el.value;
  }
}

/**
 * Set `el`'s value.
 */


function set(el, val) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      el.checked = (val == el.getAttribute('value'));
      break;
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        radio.checked = radio.value === val;
      }
      break;
    case 'select':
      var vals = ('array' == typeOf(val) ? val : [val]), found;
      for (var i = 0, option; option = el.options[i]; i++) {
        found = 0;
        for (var j = 0, v; v = vals[j]; j++){
          found |= v === option.value;
        }
        option.selected = (found === 1);
      }
      break;
    default:
      el.value = val;
  }
}

/**
 * Element type.
 */

function type(el) {
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);
  if (group) el = el[0];
  var name = el.nodeName.toLowerCase();
  var type = el.getAttribute('type');

  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';
  if ('select' == name) return 'select';
  return name;
}
