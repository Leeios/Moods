//LAUNCHER
sand.require('Moods/Master->App', function(r) {

  socket = io.connect();
  console.log(r)
  var app = new r.App();/*<- passer DP en param*/
});
