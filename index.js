'use strict';

var path = require('path');
var isglob = require('is-glob');
var pathDirname = require('path-dirname');
var isWin32 = require('os').platform() === 'win32';

module.exports = function globParent(str) {
	// flip windows path separators
	if (isWin32 && str.indexOf('/') < 0) str = str.split('\\').join('/');

	// special case for strings ending in enclosure containing path separator
	if (isEnclosure(str)) str += '/';

	// preserves full path in case of trailing path separator
	str += 'a';

	// remove path parts that are globby
	do {str = pathDirname.posix(str)}
	while (isglob(str) || /(^|[^\\])([\{\[]|\([^\)]+$)/.test(str));

	// remove escape chars and return result
	return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, '$1');
};

function isEnclosure(str) {
	// /[\{\[].*[\}\]]$/ in linear time: `.` stops at these line terminators,
	// and no path separator is needed.
	var text = String(str);
	var line = text.slice(Math.max(text.lastIndexOf('\n'), text.lastIndexOf('\r'),
		text.lastIndexOf('\u2028'), text.lastIndexOf('\u2029')) + 1);
	return /[\}\]]$/.test(line) && /[\{\[]/.test(line);
}
