//LAUNCHER
var app;
sand.require('Moods/Master', function(r) {

  socket = io.connect();
  console.log(r)
  /*var*/ app = new r.Master();/*<- passer DP en param*/
  document.body.appendChild(app.el);
});
