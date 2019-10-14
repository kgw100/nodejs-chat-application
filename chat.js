var socket = io();
var allChatMessages = [];
var chatNotificationCount = [];
var myUser = {};
var myFriend = {};
var answer ="";
var cookies="";
var random = Math.floor(Math.random() * 100000000) + 1;

// Document Ready function called automatically on page load
function SHA256(s){

        var chrsz   = 8;
        var hexcase = 0;

        function safe_add (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
        function R (X, n) { return ( X >>> n ); }
        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }


function core_sha256 (m, l) {

    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
        0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
        0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
        0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
        0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
        0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F,
               0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for ( var i = 0; i<m.length; i+=16 ) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
            T2 = safe_add(Sigma0256(a), Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }

        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
}

function str2binb (str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
    }
    return bin;
}

function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

function binb2hex (binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
        hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
    }
    return str;
}

s = Utf8Encode(s);
return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

} // SHA256 암호화

function setCookie(cname, cvalue, exdays){ // set Cookie
  var d = new Date();
  d.setTime(d.getTime()+ (exdays*24*60*60*1000))
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "="+ cvalue+";"+expires+";path=/";
}
var getCookie = function(name) { // get Cookie
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
};
function deleteCookie(cookieName)  //delete cookie
{
 var expireDate = new Date();

 //어제 날짜를 쿠키 소멸 날짜로 설정한다.
 expireDate.setDate( expireDate.getDate() - 1 );
 document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
}

function Fixed(target, fixedclass){

  var jbOffset = $( target ).offset();
         $( window ).scroll( function() {
           if ( $( document ).scrollTop() > jbOffset.top ) {
             $( target ).addClass( fixedclass );
           }
           else {
             $( target ).removeClass( fixedclass );
           }
         });
         return jbOffset;
}


$(document).ready(function(){
         Fixed('.userInfo', 'Userinfo_fixed');
         Fixed('.caution','cau_fixed');
         $('.modal-window').on('click', function(){
             $('.modal-window').removeClass('do');
             $(this).addClass('do');
         });
         loginMe();
      // if(cookies==""){ // set cookie
      //   cookies = setCookie("cookies",String(random),1);
      //   loginMe();
      // }
      // else{
      //   loginMe();
      // }
  }
);

// function Answer(answer){
//
// }


// Function to ask user to supply his/her name before entering a chatbox
function loginMe() {

    $('#Empty').hide();
    var person = prompt("사용하실 닉네임을 입력하세요.(8글자 이내)", "입력");
    setCookie("cookies",SHA256(String(person)),1);
    // var totalByte= 0;
    // var oneChar="";
    // var strValue = person.value;
    // var strLen = strValue.length;
    // for (var i = 0; i < strLen; i++) {
    //      oneChar = strValue.charAt(i);
    //      if (escape(oneChar).length > 4) {
    //          totalByte += 2;
    //      } else {
    //          totalByte++;
    //      }
    //    }
    const totalByte = person.length;

    if (/([^\s])/.test(person) && person != null && person != "" && totalByte < 9) {
      //$('#user').val(person);
      socket.emit('newUser', person, function(returnCode){
      if(returnCode == 1){
        document.title = "\""+ person +"\""+"님의 접속";
      }
      else{
        alert(person+'은 이미 접속해 있는 이름입니다. 다른 이름으로 시도해주세요.');
        location.reload();
      }
      });

    } else {
      alert('잘못된 입력입니다. 다시 입력해주세요.')
      location.reload();
    }
  }
  // socket.on('disconnect', function(){
  //   $()
  //
  // });
function time_getchar(){
  var ampm;
  var d = new Date();
  var min= d.getMinutes();
  var hour_24 = d.getHours();
  var hour_12;
  var res;

  if(hour_24<12){ ampm = '오전';}
  else {  ampm = '오후';}
  if(hour_24 == 12){ hour_12 = hour_24;}
  else{ hour_12 = hour_24%12;}

res = ampm+' '+hour_12+'시'+min+'분'
return res;

}

// Function to be called when sent a message from chatbox
function submitfunction() {
  var message = {};
  text = $('#m').val();

  time = time_getchar();
  if(text != '') {
    message.text = text;
    message.sender = myUser.id;
    message.receiver = myFriend.id;

    // $('#messages').append('<li class="chatMessageRight">'+message.text + '<span class="chat_time">'+'ddd'+'</span>'+'</li>');
     $('#messages').append('<div class="chatMessageRight">'+message.text+'<span class="msg_time_send">'+ time_getchar() +'</span>'+'</div>');

    if(allChatMessages[myFriend.id] != undefined) {
      allChatMessages[myFriend.id].push(message);
    } else {
      allChatMessages[myFriend.id] = new Array(message);
    }
    socket.emit('chatMessage', message);
  }
  $('#m').val('').focus();
  var objDiv = document.getElementById("messages"); objDiv.scrollTop = objDiv.scrollHeight; // 스크롤 항상 최하단
  return false;
}
// function to emit an even to notify friend that I am typing a message
function notifyTyping() {
  socket.emit('notifyTyping', myUser, myFriend);
}
// Load all messages for the selected user
function loadChatBox(messages) {
  $('#messages').html('');
  messages.forEach(function(message){
    var cssClass = (message.sender == myUser.id) ? 'chatMessageRight' : 'chatMessageLeft';
      var cssClass2 = (message.sender == myUser.id) ? 'msg_time_send' : 'msg_time';
  //   $('#messages').append('<li class="' + cssClass + '">' + message.text + '</li>');
  // });
  $('#messages').append('<div class="'+cssClass+'">'+message.text+'<span class="'+cssClass2+'">'+ time_getchar() +'</span>'+'</div>');
});
}
// Append a single chant message to the chatbox
function appendChatMessage(message) {
  if(message.receiver == myUser.id && message.sender == myFriend.id) {
    playNewMessageAudio();
    var cssClass = (message.sender == myUser.id) ? 'chatMessageRight' : 'chatMessageLeft';
    var cssClass2 = (message.sender == myUser.id) ? 'msg_time_send' : 'msg_time';
    $('#messages').append('<div class="'+cssClass+'">'+message.text+'<span class="'+cssClass2+'">'+ time_getchar() +'</span>'+'</div>');
  } else {
    playNewMessageNotificationAudio();
    updateChatNotificationCount(message.sender);
  }
  if(allChatMessages[message.sender] != undefined) {
    allChatMessages[message.sender].push(message);
  } else {
    allChatMessages[message.sender] = new Array(message);
  }
}
//Function to play a audio when new message arrives on selected chatbox
function playNewMessageAudio() {
  (new Audio('https://notificationsounds.com/soundfiles/8b16ebc056e613024c057be590b542eb/file-sounds-1113-unconvinced.mp3')).play();
}
// Function to play a audio when new message arrives on selected chatbox
function playNewMessageNotificationAudio() {
  (new Audio('https://notificationsounds.com/soundfiles/dd458505749b2941217ddd59394240e8/file-sounds-1111-to-the-point.mp3')).play();
}

// Function to update chat notifocation count
function updateChatNotificationCount(userId) {
  var count = (chatNotificationCount[userId] == undefined) ? 1 : chatNotificationCount[userId] + 1;
  chatNotificationCount[userId] = count;
  $('#' + userId + ' label.chatNotificationCount').html(count);
  $('#' + userId + ' label.chatNotificationCount').show();
}
// Function to clear chat notifocation count to 0
function clearChatNotificationCount(userId) {
  chatNotificationCount[userId] = 0;
  $('#' + userId + ' label.chatNotificationCount').hide();

}
// Function to be called when a friend is selected from the list of online users
function selectUerChatBox(element, userId, userName) {
  myFriend.id = userId;
  myFriend.name = userName;
  $('#form').show();
  $('#messages').show();
  $('#onlineUsers li').removeClass('active');
  $(element).addClass('active');
  $('#notifyTyping').text('');
  $('#m').val('').focus();
  // Reset chat message count to 0
  clearChatNotificationCount(userId);
  // load all chat message for selected user
  if(allChatMessages[userId] != undefined) {
    loadChatBox(allChatMessages[userId]);
  } else {
    $('#messages').html('');
  }
}
// ############# Event listeners and emitters ###############
// Listen to newUser even to set client with the current user information
socket.on('newUser', function(newUser){
  myUser = newUser;
  $('#myName').html(myUser.name);
});

// Listen to notifyTyping event to notify that the friend id typying a message
socket.on('notifyTyping', function(sender, recipient){
  if(myFriend.id == sender.id) {
    $('#notifyTyping').text(sender.name + ' 님이 입력중입니다...');
  }
  setTimeout(function(){ $('#notifyTyping').text(''); }, 2500);
});
// Listen to onlineUsers event to update the list of online users
socket.on('onlineUsers', function(onlineUsers){
  var usersList = '';

  if(onlineUsers.length == 2) {
    onlineUsers.forEach(function(user){
      if(myUser.id != user.id){
        myFriend.id = user.id;
        myFriend.name = user.name;
        $('#form').show();
        $('#messages').show();
      }
    });
  }

  onlineUsers.forEach(function(user){
    if(user.id != myUser.id) {
      var activeClass = (user.id == myFriend.id) ? 'active' : '';
      usersList += '<li id="' + user.id + '" class="' + activeClass + '" onclick="selectUerChatBox(this, \'' + user.id + '\', \'' + user.name + '\')"><a href="javascript:void(0)">' + user.name + '</a><label class="chatNotificationCount"></label></li>';
      $('#Empty').hide();
    }
  });
  $('#onlineUsers').html(usersList);
  if( usersList=="")
  {
    $('#Empty').show();
  }
});
// Listen to chantMessage event to receive a message sent by my friend
socket.on('chatMessage', function(message){
  appendChatMessage(message);
});


// Listen to userIsDisconnected event to remove its chat history from chatbox
socket.on('userIsDisconnected', function(userId){
  delete allChatMessages[userId];
  $('#form').hide();
  $('#messages').hide();
});


// CREATE SHA256
