var sass = require('node-sass');
var fs = require('fs');

exports.main = function(req, res) {
  sass.render({
    file: 'public/css/index.sass',
    success: function(css) {
      console.log('Render sass file: OK');
      fs.writeFile('public/css/index.css', css, function(err) {console.log('Write CSS file: ' + (err || 'OK'))});
      res.render('index.jade');
    },
    error: function(error) {
      console.log('An error occured in index.sass rendering: ' + error);
      res.redirect('/');
    }
  });

}
