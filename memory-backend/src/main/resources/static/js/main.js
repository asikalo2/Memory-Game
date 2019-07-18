'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var logArea = document.querySelector('#logArea');

var stompClient = null;
var username = null;
var connected = false;

var colors = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];


//Kada pokrenemo novu igru
function newGame(event) {
  if (event) {
    event.preventDefault();
  }

  username = document.querySelector('#name').value.trim();
  if (username) {
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    var socket = new SockJS('/ws');
    stompClient = window.Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, onConnectedNewGame, onError);
  }
}

//Ovo se poziva na click new game
function onConnectedNewGame() {
  connected = true;

  // Subscribe to the Public Topic
  stompClient.subscribe('/topic/newGame', onKeyReceived);

  // Tell your username to the server
  stompClient.send("/app/memory/getKey",
      {},
      JSON.stringify({sender: username})
      );

  logArea.classList.add('hidden');
}

function joinGame(event) {
  if (event) {
    event.preventDefault();
  }

  username = document.querySelector('#name').value.trim();
  if (username) {
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    var socket = new SockJS('/ws');
    stompClient = window.Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, onConnectedJoinGame, onError);
  }
}

//Ovo se poziva na click new game
function onConnectedJoinGame() {
  connected = true;
  
  var user="ja";
  // Subscribe to the Public Topic
  
  //Ovdje stavimo key koji player ukuca
  stompClient.subscribe('/topic/group-id'+username, onGameStarted);

  // Tell your username to the server
  stompClient.send("/app/memory/loadGame",
      {},
      JSON.stringify({key:username, username: user})
      );

  logArea.classList.add('hidden');
}





function onError(error) {
  console.log(error);
  connected = false;
  setTimeout(connect, 1000);

  logArea.textContent = 'Not connected. Connecting ...';
  logArea.classList.remove('hidden');
}


function sendMessage(event) {
  event.preventDefault();
  if (!connected) {
    return;
  }

  var messageContent = messageInput.value.trim();
  if (messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      type: 'CHAT'
    };

    stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
    messageInput.value = '';
  }
}

function onKeyReceived(payload) {
  var key = JSON.parse(payload.body);
  console.log(key.key);
  
  //Ovdje stavimo key koji mu server vrati
  stompClient.subscribe('/topic/group-id'+key.key, onGameStarted);
  
    stompClient.send("/app/memory/loadGame",
      {},
      JSON.stringify({key: key.key, username: "prvi", status:1, level:1})
      );
}

function onGameStarted(payload) {
  var game = JSON.parse(payload.body);
    console.log(game);
    
}

function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);

  var messageElement = document.createElement('li');

  if (message.type === 'JOIN') {
    messageElement.classList.add('event-message');
    message.content = message.sender + ' joined!';
  } else if (message.type === 'LEAVE') {
    messageElement.classList.add('event-message');
    message.content = message.sender + ' left!';
  } else {
    messageElement.classList.add('chat-message');

    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(message.sender);

    messageElement.appendChild(avatarElement);

    var usernameElement = document.createElement('span');
    var usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);
  }

  var textElement = document.createElement('p');
  var messageText = document.createTextNode(message.content);
  textElement.appendChild(messageText);

  messageElement.appendChild(textElement);

  messageArea.appendChild(messageElement);
  messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }

  var index = Math.abs(hash % colors.length);
  return colors[index];
}

document.getElementById('submit1').addEventListener('click', newGame, true);

document.getElementById('submit2').addEventListener('click', joinGame, true);

//usernameForm.addEventListener('submit', connect, true);

messageForm.addEventListener('submit', sendMessage, true);
