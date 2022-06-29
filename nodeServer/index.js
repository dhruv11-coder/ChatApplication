//This will act as our node server and will handle socket io connections.

/* socket-io: used for real time applications. the problem with http and https i mean to 
connect the backend and frontend is that only frontend can send the request to the backend
and backend can only give the respnse of the request. the backend cannot itdelf send request
to client. Hence,if there are any updates in the backend then the backend will not be able
to notify the frontend or the client as it is unable to send requests. 

This problem is solved by Socket-io as it makes two way connection where real time connection
is build and hence no dealy occurs in recieving and sending messages */

//const io = require('socket.io')(8000) // hum koisa bhee port le sakte hai. yaha humari marzi thee ki humne 8000 port liya
//ye socket.io jo seerver hai ye listen karega incoming events ko

const users = {}

//const io = require('socket.io')(8000)

const io = require('socket.io')(8000, {
    cors: {                             //for solving the problem of @depreciated name
      origin: '*',
    }
  });           


/* IN SHORT YE CONNECTION OPEN KAR RAHA HAI OR JESE HEE NAYA USER CONNECTION MEIN JOIN 
HO JATA HAI USKO USERS MEIN ADD KAR DETA HAI OR BAAKIYO KO NAME KE SATH NOTICE MILTA HAI
USER JOINED KARKE */ 

io.on('connection', socket=>{ //ye "io.on" socket.io ka instance hai jo ki bhout saare socket saare socket connections ko listen karega jese ki ram ne connet kiya , fir harry ne bhee connect kiya , divya ne bhee kiya, kisi se kisi ko message bheja toh ye un sabko listen karega
    
    socket.on('new-user-joined', name=>{ // ye "socket.on" kya karega ki jab bhee kisi ek particular connection ke saath kuch hoga toh us particular connection ke sath kya hona chahiye vo socket.on handle karta hai. is example mein agr socket.on ek 'new-user-joined' connection bhej rah ahai toh kya karu(name='{}) mein.
        console.log("new user",name)
        users[socket.id] = name; // jesi socket ko 'new-user-joined' event mila toh users ke andar 'name' set kar diya 
        socket.broadcast.emit('user-joined',name) //broadcast.emit kya karta hai ki jab ek new userr join hota hai toh uske alwa jitne bhee connection mein hai un sabko event behj deta hai ki 'user-joined'. HUm yahi karna chahte bhee hai ki jab bhee ek naya user chat mein aaye toh baakiyo ko notice aa jaaye 'useer-joined' karke uske "",name" ke saath
    });
    socket.on('send', message=>{ // ab yaha kya hua ki jesi socket.on ko send vala event mila toh isne kya kiya , isne broadcast karwa diya yaani sabko bta diya ki dekho (message: message) mtlb ye mesaage hai or (name:user[socked.id]) matlab is naam ke viyakti ne bheja hai
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });  
    socket.on('disconnect', message=>{ // socket.io mein ek inbult event hai juska naam 'disconnect' hai
      socket.broadcast.emit('left', users[socket.id])   
      delete users[socket.id]; // jesi humara user left hua humne use connected users ki list mein se bhee hata diya . SOcket.id?: Ans: har connection ki ek id hai jo ki socket.id hai. humm log users ko naam ke sahare naa pehchan ke uski id se pehchante hai
  });       
})
  
/* END */   

