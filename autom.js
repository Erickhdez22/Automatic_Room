var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(5, 'out'); //use GPIO pin 4 as output
var VEN = new Gpio(6, 'out');
var CUA = new Gpio(13, 'out'); //use GPIO pin 4 as output
var TEL = new Gpio(19, 'out');
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var pushButton2 = new Gpio(27, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var pushButton3 = new Gpio(22, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var pushButton4 = new Gpio(10, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled



http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/proyectoh.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  var lv = 0; //static variable for current status
  var cua = 0;
  var tel = 0;
  
    pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    lightvalue = value;
    socket.emit('light', lightvalue); //send button status to client
  });
      pushButton2.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    l = value;
    socket.emit('light', l); //send button status to client
  });
      pushButton3.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    cua = value;
    socket.emit('light', cua); //send button status to client
  });
      pushButton4.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    tel = value;
    socket.emit('light', tel); //send button status to client
  });
  
  
  
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    if (lightvalue != LED.readSync()) { //only change LED if status has changed
      LED.writeSync(lightvalue); //turn LED on or off
    }
  });
    socket.on('l', function(data) { //get light switch status from client
    lv = data;
    if (lv != VEN.readSync()) { //only change LED if status has changed
      VEN.writeSync(lv); //turn LED on or off
    }
  });
    socket.on('cua', function(data) { //get light switch status from client
    cua = data;
    if (cua != CUA.readSync()) { //only change LED if status has changed
      CUA.writeSync(cua); //turn LED on or off
    }
  });
    socket.on('tel', function(data) { //get light switch status from client
    tel = data;
    if (tel != TEL.readSync()) { //only change LED if status has changed
      TEL.writeSync(tel); //turn LED on or off
    }
  });
});


process.on('SIGINT', function () { //on ctrl+c
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  VEN.writeSync(0);
  VEN.unexport();
  CUA.writeSync(0); // Turn LED off
  CUA.unexport(); // Unexport LED GPIO to free resources
  TEL.writeSync(0);
  TEL.unexport();
  pushButton.unexport();
 pushButton2.unexport();
 pushButton3.unexport();
 pushButton4.unexport();
  process.exit(); //exit completely
});
