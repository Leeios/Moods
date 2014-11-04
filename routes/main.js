var sass = require('node-sass');

exports.main = function(req, res) {
  sass.render({
    file: 'public/css/index.sass',
    outFile: '../public/css/index.css',
    success: function(css) {
      console.log(css);
      console.log('Render sass file: OK');
      res.render('index.jade');
    },
    error: function(error) {
      console.log('An error occured in index.sass rendering: ' + error);
      res.redirect('/CSSError');
    }
  });

}
