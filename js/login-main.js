
(function ($) {
    "use strict";

    
    //global func
    
  function IsEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!email.match(re)) {
      return false;
    } else {
      return true;
    }
  }

  function isDate18orMoreYearsOld(day, month, year) {
    return new Date(year+18, month-1, day) <= new Date();
}

    //// Your web app's Firebase configuration
    // var firebaseConfig = {
    //     apiKey: "AIzaSyDRuTZBnUqVjLk3JiK0bu6AcIBBkjEEFCQ",
    //     authDomain: "galileecreation.firebaseapp.com",
    //     databaseURL: "https://galileecreation.firebaseio.com",
    //     projectId: "galileecreation",
    //     storageBucket: "galileecreation.appspot.com",
    //     messagingSenderId: "375193438625",
    //     appId: "1:375193438625:web:2ad1f68d1a9a28a6"
    // };
    // // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);
    // if (!firebase.apps.length) {
    //     firebase.initializeApp({});
    // }

   
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyC5TD5bZiZz40XmGIFdjM5nIwga_QBTlBM",
        authDomain: "projectet-8baf2.firebaseapp.com",
        databaseURL: "https://projectet-8baf2.firebaseio.com",
        projectId: "projectet-8baf2",
        storageBucket: "projectet-8baf2.appspot.com",
        messagingSenderId: "614014308460",
        appId: "1:614014308460:web:5650642485d3e60f3dc849",
        measurementId: "G-EF5TVMPS6S"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    if (!firebase.apps.length) {
        firebase.initializeApp({});
    }

    var userNow2

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userNow2 = user
            console.log(user);
            window.location.href = "index.html";
        } else {

            console.log("not loging");
        }
    });
    ///index page
    $("#login").click(function () {
        var emailUser = document.getElementById("first-name").value;
        var passwordUser = document.getElementById("pass").value;
        var errLogMessage = document.getElementById("login-err");

        const auth = firebase.auth();
        const flag = auth.signInWithEmailAndPassword(emailUser, passwordUser);
        flag.catch(function (e) {

            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            e.message+" </p>");
            setTimeout(function(){$("#login-err").empty();},3000) ;
            console.log(e.message);
            $("#login-err").css("display", "block");
            return;
        });
        console.log(emailUser);
        console.log(passwordUser);

    });


    ///login with google
    $("#google-btn").click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    });
    
    ///login with facebook
    $("#facebook-btn").click(function () {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    });
    




    //sign up  bt on main page
    $("#signup").click(function () {
        window.location.href = "signup.html";
    });

    $("#username-password").click(function () {
        $("#login").css("display", "none");
        $("#pass").css("display", "none");
        $("#first-name").css("display", "none");
        $("#passdiv").css("display", "none");
        $("#first-namediv").css("display", "none");
        $("#signup").css("display", "none");
        $("#resetemail").css("display", "block");
        $("#resetemaildiv").css("display", "block");
        $("#send-email").css("display", "block");
        $("#login-err").css("display", "none");
        $("#login-err").empty();


    });
    $("#send-email").click(function () {
        $("#login").css("display", "block");
        $("#pass").css("display", "block");
        $("#first-name").css("display", "block");
        $("#passdiv").css("display", "block");
        $("#first-namediv").css("display", "block");
        $("#signup").css("display", "block");
        $("#resetemail").css("display", "none");
        $("#resetemaildiv").css("display", "none");
        $("#send-email").css("display", "none");
        $("#login-err").css("display", "none");
        $("#login-err").empty();
        var auth = firebase.auth();
        var emailAddress = document.getElementById("resetemail").value

        console.log(emailAddress);

        auth.sendPasswordResetEmail(emailAddress).then(function () {
            
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            "email sent, check your email </p>");
            setTimeout(function(){$("#login-err").empty();},3000) ;
            $("#login-err").css("display", "block");
        }).catch(function (error) {
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            error.message+" </p>");
            setTimeout(function(){$("#login-err").empty();},3000) ;
            $("#login-err").css("display", "block");
            console.log(error);
        });
    });

    ///sign up
    $("#login2").click(function(){
        window.location.href = "login.html";
    });
    $("#signup2").click(function () {
        $("#login-err").css("display", "none");
        var radios = document.getElementsByName('genderS');
        var gender;
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                gender = radios[i].value;
                break;
            }
        }
        var email = $("#first-nameup").val();
        var password = $("#passup").val();
        var password2 = $("#pass2up").val();
        var fullname = $("#fullnameup").val();
        var bday = $("#bdayup").val();
        var dateUser = new Date(bday);


        var pass="";
        var repass="";
         pass = $("#passup").val();
         repass = $("#pass2").val();
         console.log(pass);
         console.log(repass);

        if ((pass.length == 0) || (repass.length == 0)) {
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
           "the password is empty </p>");
            setTimeout(function(){$("#login-err").empty();},10000) ;
            $("#login-err").css("display", "block");
            return;
        }
        else if (pass != repass) {
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            "the password is not the some </p>");
            setTimeout(function(){$("#login-err").empty();},10000) ;
            $("#login-err").css("display", "block");
            return;
        }
        else {
           console.log("pass the some");
        }
        if(fullname.length>20){
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            "full name is too long only 20 Letters </p>");
            setTimeout(function(){$("#login-err").empty();},10000) ;
            $("#login-err").css("display", "block");
            return;
        }
        if(fullname.length==0){
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            "full name is empty</p>");
            setTimeout(function(){$("#login-err").empty();},10000) ;
            $("#login-err").css("display", "block");
            return;
        }

        if(isDate18orMoreYearsOld(dateUser.getDay(),dateUser.getMonth(),dateUser.getFullYear())==false)
        {
            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            "you Must be older than 18 </p>");
            setTimeout(function(){$("#login-err").empty();},10000) ;
            $("#login-err").css("display", "block");
            return;
        }




        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("bday", bday);
        localStorage.setItem("gender", gender);
        localStorage.setItem("signup","yes");

       

        var okToMove = true;
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            okToMove = false;
            var errorCode = error.code;
            var errorMessage = error.message;

            $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
            error.message+" </p>");
            setTimeout(function(){$("#login-err").empty();},3000) ;
            
           
            $("#login-err").css("display", "block");


        });

        setTimeout(function () {


            if (okToMove === true) {
                

                window.location.href = "index.html";
            }
        }, 3000)
    });


})(jQuery);