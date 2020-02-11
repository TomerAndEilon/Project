var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json"
var allCourses = [];
var idCourse;
var nameCourse;
var numberOfQuestion = 3;
var map = new Map();

$(document).ready(function () {
    isLogin();
    logout();
    updateDataToProfile();
    idCourse = localStorage.getItem("answerCourseId");
    nameCourse = localStorage.getItem("answerCourseName");
    document.getElementById("courseTitle").innerHTML += nameCourse;    

});


$('#save-button').click(function() {
    getAnswerFromDom();
    updateToDB();
});

function getAnswerFromDom(){
    for (let i = 1; i <= numberOfQuestion; i++) {
        let elemnts =document.getElementsByClassName("q" + i);
        for (let j = 0; j < elemnts.length; j++) {
            if(elemnts[j].checked){
                map.set(i,j+1);                
                break;
            }
        }
    }
}

function updateToDB(){
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId + '/rating/' + idCourse).set({
        q1: map.get(1),
        q2: map.get(2),
        q3: map.get(3)
    }, function(error) {
        if (error) {
          // The write failed...
        } else {
          // Data saved successfully!
          window.location.href = "rating.html";
        }

    });
}

/***************************FireBase Function********************************** */
function isLogin() {
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
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user_uid_main = user.uid
            $("#logout-btn").css("display", "block");
            $("#login-btn").css("display", "none");

        } else {
            $("#hello-user").css("display", "none");
            $("#logout-btn").css("display", "none");
            $("#login-btn").css("display", "block");
        }
    });
}

function logout() {
    $("#logout-btn").on("click", function () {
        var user = firebase.auth().currentUser;
        firebase.auth().signOut().then(function () {
            console.log("logout successful")
        }).catch(function (error) {
            console.log("logout error " + error);
        });
    });
}

function updateDataToProfile() {
    setTimeout(function () {
        var user = firebase.auth().currentUser;
        if (user.displayName == null) {
            user.updateProfile({
                displayName: localStorage.getItem("fullname")
            }).then(function () {
                console.log("work update user name");
            }).catch(function (error) {
                // An error happened.
                console.log("error update user name");
            });
        }
    }, 1000);
}




