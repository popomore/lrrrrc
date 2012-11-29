var request = require('request');
var xml2js = require('xml2js');
var util = require('./util');


var SEARCHURL='http://lrcct2.ttplayer.com/dll/lyricsvr.dll?sh?Artist={{artist}}&Title={{title}}&Flags=0';
var DOWNLOADURL = 'http://lrcct2.ttplayer.com/dll/lyricsvr.dll?dl?Id={{id}}&Code={{code}}&uid=01&t={{t}}';


exports.search = function(options, callback) {
  options = options || {};
  options.artist = options.artist ? util.encode(options.artist) : '';
  options.title = options.title ? util.encode(options.title) : '';

  var url = template(SEARCHURL, options);
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var parser = new xml2js.Parser();
      parser.on('end', function(data) {
        var r = [];
        for (var i in data.result.lrc) {
          r.push(data.result.lrc[i]['$']);
        }
        callback(null, r);
      });
      parser.parseString(body);
    }
  });
};

exports.download = function(options, callback) {
  options = options || {};
  options.id = options.id ? parseInt(options.id, 10) : 0;
  options.code = util.codeFunc(options.id, (options.artist + options.title) || '');
  options.t = new Date().getTime();

  var url = template(DOWNLOADURL, options);
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        callback(null, body);
    }
  });
};

function template (tpl, model) {
  return tpl.replace(/{{(.*?)}}/g, function(a, b) {
    return model[b] || '';
  });
}

//exports.search({artist: 'SHE', title: '美丽新世界'}, function(err, data) {
//  console.log(data);
//  exports.download(data[0], function(err, data) {
//    console.log(data);
//  })
//})
