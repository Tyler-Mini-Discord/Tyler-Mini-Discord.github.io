// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDdnzlp0JlZ2OxTFhBk1elqGzC3Fd13WY",
  authDomain: "web-sec-a6838.firebaseapp.com",
  databaseURL: "https://web-sec-a6838-default-rtdb.firebaseio.com",
  projectId: "web-sec-a6838",
  storageBucket: "web-sec-a6838.appspot.com",
  messagingSenderId: "591461225701",
  appId: "1:591461225701:web:8748b74d84a7bd6da4f00c",
  measurementId: "G-0C25B8K9HY"
};
 // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let db = rtdb.getDatabase(app);
let auth = fbauth.getAuth(app);

var input = document.getElementById("text");
var list = document.getElementById("chats");
let chatRef = rtdb.ref(db,"/chats/home");
let pageRef=rtdb.ref(db,"/pages")

let current_user="";
let current_user_id=""
let messUser="";
let currPage="home";

export const escapeHtml = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

$("#goReg").click(()=>{
  window.history.pushState('', 'Title', '/register');
  $("#login").hide();
  $("#register").show();
});
$("#goLog").click(()=>{
  window.history.pushState('', 'Title', '/');
  $("#login").show();
  $("#register").hide();
})

$("#logout").click(event=>{
  window.history.pushState('', 'Title', '/');
  event.preventDefault(event);
  fbauth.signOut(auth);
  current_user="";
  return false;
})

fbauth.onAuthStateChanged(auth, user => {
      if (!!user){
        console.log(user);
        document.getElementById("logemail").value='';
        document.getElementById("logpass").value='';
        document.getElementById("regemail").value='';
        document.getElementById("regpass1").value='';
        document.getElementById("regpass2").value='';
        loadChats();
        loadPages();
        let usernameRef=rtdb.ref(db,`/users/${user.uid}/username`)
        current_user_id=user.uid;
        window.history.pushState('', 'Title',`/${currPage}`);
        rtdb.get(usernameRef).then(ss=>{
          current_user=ss.val();
        })
        $("#register").hide();
        $("#login").hide();
        $("#home").show();
        $("#allChannels").show();
      } else {
        document.getElementById("logemail").value='';
        document.getElementById("logpass").value='';
        document.getElementById("regemail").value='';
        document.getElementById("regpass1").value='';
        document.getElementById("regpass2").value='';
        $("#register").hide();
        $("#home").hide();
        $("#login").show();
        $("#allChannels").hide();
      }
});



$("#register").on("click", ()=>{
  let email = $("#regemail").val();
  let p1 = $("#regpass1").val();
  let p2 = $("#regpass2").val();
  if (p1 != p2){
    alert("Passwords don't match");
    return;
  }
  if($("#username").val() == ''){
    alert("Please create username");
    return;
  }
  fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata=>{
    let uid = somedata.user.uid;
    let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
    let userAdminRef=rtdb.ref(db,`/users/${uid}/roles/admin`);
    let userRef = rtdb.ref(db,`/users/${uid}`);
    rtdb.update(userRef,{username: $("#username").val()})
    rtdb.update(userRef,{email:email});
    rtdb.set(userRoleRef, true);
    rtdb.set(userAdminRef,false);

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});


$("#login").on("click", ()=>{
  let email = $("#logemail").val();
  let pwd = $("#logpass").val();
  fbauth.signInWithEmailAndPassword(auth, email, pwd).then(currUser=>{
      let userRef = rtdb.ref(db,`/users/${currUser.user.uid}/username`)
      rtdb.get(userRef).then(ss=>{
        current_user=ss.val()
      })
      currPage="home"
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

var loadPages=function(){
    rtdb.onValue(pageRef,ss=>{
    let pageObj=ss.val();
    $("#channels").empty();
    if(pageObj!=null){
      let pageIDS = Object.keys(pageObj);
      pageIDS.map(key=>{
      let pageButton=$(`<button id="${key}">${pageObj[key].name.replace('<', '')}</button>`);
        pageButton.click(()=>{
          currPage=pageObj[key].name;
          $("#header").html(`Welcome to the ${currPage} chat`)
          window.history.pushState('', 'Title', `/${currPage}`);
          chatRef=rtdb.ref(db,`/chats/${currPage}`)
          loadChats();
        })
      $("#channels").append(pageButton);
      });
    }
  });
};

var loadChats=function(){
  rtdb.onValue(chatRef, ss=>{
    let chatObj = ss.val();
    $(chats).empty();
    if (chatObj!= null){
      let chatIDS = Object.keys(chatObj);
      chatIDS.map(key=>{
        let li=document.createElement('li');
        li.id = key;
        li.innerText=`${chatObj[key].user}: ${chatObj[key].chat}`;
        $(chats).append(li);
        li.click(editChat);
      });
    }
})
}

var addChat = function(){
  var text=input.value;
  var id;
  if( text.length ==0){
    return false;
  }
  let x={"chat":text,"user":current_user,"uid":current_user_id}
  id=rtdb.push(chatRef,x);
  input.value="";
  loadChats();
  return false;
}
$("#form").click(addChat);

let editChat=function(event){
  event.preventDefault(event);
  let $id = $(event.currentTarget).attr("id");
  var parent = document.getElementById($id);
  if (parent.childNodes.length>1){
    return false;
  }
  var newText = parent.appendChild(document.createElement("input"));
  var editButton = parent.appendChild(document.createElement("button"));
  var cancelButton = parent.appendChild(document.createElement("button"));
  cancelButton.textContent = "Cancel";
  editButton.textContent = "Edit";
  $(editButton).click(
    evt=>{
      let newMsg = $(newText).val();
      let msgRef = rtdb.child(chatRef, $id);
      let textRef = rtdb.child(msgRef, "chat");
      let messUserRef=rtdb.child(msgRef,"uid");
      rtdb.get(messUserRef).then(ss=>{
        if(current_user_id.localeCompare(ss.val())){
          loadChats();
          return;
        }
        else{
          rtdb.set(textRef, newMsg);
        }
      }); 
    }
  );
  $(cancelButton).click(()=>{
    loadChats();
  });
  return false;  
}

$(createPage).click(event=>{
  event.preventDefault(event);
  var parent=document.getElementById("allChannels")
  let pageName=parent.appendChild(document.createElement("input"));
  var newbutton=parent.appendChild(document.createElement("button"));
  newbutton.textContent="Create Page";
  $(newbutton).click(event=>{
    if (pageName.value != ""){
      rtdb.push(pageRef,{"name":pageName.value})
      currPage=pageName.value;
      chatRef=rtdb.ref(db,`/chats/${currPage}`)
      loadChats();
      pageName.remove();
      newbutton.remove();
    }; 
  });
});
