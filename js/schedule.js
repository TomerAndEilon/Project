

console.log("what hepand")
$(document).ready(function () {
    is_login()
    logout()
    update_data_to_profile()
    console.log("ready!");
    choose_course() 
    choose_course_number()


   
    
    console.log("end!");
});

// function is_login() {
//     var firebaseConfig = {
//         apiKey: "AIzaSyC5TD5bZiZz40XmGIFdjM5nIwga_QBTlBM",
//         authDomain: "projectet-8baf2.firebaseapp.com",
//         databaseURL: "https://projectet-8baf2.firebaseio.com",
//         projectId: "projectet-8baf2",
//         storageBucket: "projectet-8baf2.appspot.com",
//         messagingSenderId: "614014308460",
//         appId: "1:614014308460:web:5650642485d3e60f3dc849",
//         measurementId: "G-EF5TVMPS6S"
//     };
//     // Initialize Firebase
//     firebase.initializeApp(firebaseConfig);
//     if (!firebase.apps.length) {
//         firebase.initializeApp({});
//     }

//     var userNow2

//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             userNow2 = user
//             console.log(user);
           
//         } else {

//             console.log("not loging");
//         }
//     });
// }

function if_have_user_name_show_me(user){
    setTimeout(function(){
        if (user.displayName != null){
            $("#hello-user").text("שלום "+ user.displayName);
            $("#hello-user").css("display","block");
        }
    },1000);
    
}
function logout(){
    $("#logout-btn").on("click", function () {
        var user = firebase.auth().currentUser;
        firebase.auth().signOut().then(function () {
          console.log("logout successful")
        }).catch(function (error) {
          console.log("logout error " + error);
        });
      });
}
function update_data_to_profile(){
    setTimeout(function () {
        var user = firebase.auth().currentUser;
        console.log(user.displayName)
        console.log(localStorage.getItem("fullname"))
        if (user.displayName == null){
            user.updateProfile({
                displayName: localStorage.getItem("fullname")
              }).then(function () {
                console.log("work update user name");
              }).catch(function (error) {
                // An error happened.
                console.log("error update user name");
              });
        }
        if_have_user_name_show_me(user)
    },3000);
}
function is_login() {
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
            $("#logout-btn").css("display", "block");
            $("#login-btn").css("display", "none");
            
        } else {
            $("#hello-user").css("display","none");
            $("#logout-btn").css("display", "none");
            $("#login-btn").css("display", "block");
            console.log("not loging");
        }
    });
}


function choose_course() {
    var mySelect = $('#choose-course');
    $('#choose-info').on('click', function () {
        localStorage.setItem("course_allready_done",mySelect.selectpicker('val'))
        console.log(mySelect.selectpicker('val'));
        mySelect.selectpicker('refresh');
    });
    //reset btn
    $("#choose-reset-btn").on('click', function () {
        console.log("in the reset btn")
        mySelect.selectpicker('deselectAll');
    })

}
function choose_course_number() {
    var mySelect = $('#choose-course-number');
    $('#choose-info-number').on('click', function () {
        localStorage.setItem("course_number",mySelect.selectpicker('val'))
        console.log(mySelect.selectpicker('val'));
        mySelect.selectpicker('refresh');
    });
    //reset btn
    $("#choose-number-reset-btn").on('click', function () {
        console.log("in the reset btn")
        mySelect.selectpicker('deselectAll');
    })

}