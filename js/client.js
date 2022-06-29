 const socket = io('http://localhost:8000');
 

 const form = document.getElementById('send-container');
 const messageInput = document.getElementById('messageInp');
 const messageContainer = document.querySelector(".container"); // yaani jab bhee mere paas messgaes aayenge toh hume kaha daalne hai? , Hume unhe container mein daalne hai(yaha conainer humara vo frontend hai jisme humchat karenge)
 var audio = new Audio('ting.wav'); //to use the audio while sending messages


 const append=(message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);                                                                                                                                                                                                                                                               
    messageContainer.append(messageElement); 

    if(position == 'left') //agr position left ho tabhi sound play ho why??
    {
      audio.play();
    } 
}

 const name = prompt("enter your name to join"); // isse kya hoga ki chat app khulne se pehle humse name mangenge. agr humne name nahi diya toh ye nahi chalega
 socket.emit('new-user-joined',name); //ab jesi hum name daalenge ye name socket pe jaega or 'new-user-joined' naam ka message show ho jaega

 socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
 })

 form.addEventListener('submit', (e)=>{ //ye tab ke liye hai ki jab bhee koi submit kare messgae toh kya ho
   e.preventDefault(); //isse page reload nahi hoga
   const message = messageInput.value;
   append(`You: ${message}`, 'right'); //ye iske loye ki hume bhee pata hona chahiye ki kya msg bheja hai
   socket.emit('send',message); //mein ye socket ko bata rha hu ki ye message mein send karunga
   messageInput.value='' //humne messageInput ki value ko blank karke ab aopne input box ko msg likhke send karne ke baad apne aap khaali kardiya
})
 socket.on('receive', data =>{     //index.js mein jo last mein send event launch kiya usko hum yaha client.js mein handle karenge(addEventListener ke through kyuki index.js se reequest pehle iske paas aayegi or vaha se hum ise receive karenge) or handle karwaenge ki jaisi send request gayi toh jitne bhee users node server mein jude hue hai unko 'receive' event chla jaaye or jo bhee msg send hua hai vo sabhi ki broadcast ho jaaye
   append(`${data.name}: ${data.message}`, 'left')  
})
socket.on('left', name =>{     //index.js mein jo last mein send event launch kiya usko hum yaha client.js mein handle karenge(addEventListener ke through kyuki index.js se reequest pehle iske paas aayegi or vaha se hum ise receive karenge) or handle karwaenge ki jaisi send request gayi toh jitne bhee users node server mein jude hue hai unko 'receive' event chla jaaye or jo bhee msg send hua hai vo sabhi ki broadcast ho jaaye
   append(`${name}: left the chat`, 'left')  
})
