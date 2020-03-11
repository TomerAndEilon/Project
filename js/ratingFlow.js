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
    update_data_to_profile();
    idCourse = localStorage.getItem("answerCourseId");
    nameCourse = localStorage.getItem("answerCourseName");
    document.getElementById("courseTitle").innerHTML += nameCourse;    

});

function if_have_user_name_show_me(user) {
    setTimeout(function () {
        if (user.displayName != null) {
            $("#hello-user").text("שלום " + user.displayName);
            $("#hello-user").css("display", "block");
        }
    }, 1000);

}
function update_data_to_profile() {
    setTimeout(function () {
        var user = firebase.auth().currentUser;
        console.log(user.displayName)
        console.log(localStorage.getItem("fullname"))
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
        if_have_user_name_show_me(user)
    }, 3000);
}

$('#save-button').click(function() {
    getAnswerFromDom();
    updateToDB();
});

function getAnswerFromDom(){
   
    if ($("#q1_rating").find(".emoji-rating-emotion-container-q1_rating").val().localeCompare("undefined")==0)
    {
        map.set(1,0);
    }else{
        let q1_val = $("#q1_rating").find(".emoji-rating-emotion-container-q1_rating").val();
        map.set(1,parseInt(q1_val));
    }

    if ($("#q2_rating").find(".emoji-rating-emotion-container-q2_rating").val().localeCompare("undefined")==0)
    {
        map.set(2,0);
    }else{
        let q2_val = $("#q2_rating").find(".emoji-rating-emotion-container-q2_rating").val();
        map.set(2,parseInt(q2_val));
    }

    if ($("#q3_rating").find(".emoji-rating-emotion-container-q3_rating").val().localeCompare("undefined")==0)
    {
        map.set(3,0);
    }else{
        let q3_val = $("#q3_rating").find(".emoji-rating-emotion-container-q3_rating").val();
        map.set(3,parseInt(q3_val));
    }

    let textAreaValue = $('#textArea').val();
    map.set(numberOfQuestion+1 ,textAreaValue)
}

function updateToDB() {
    let userId = firebase.auth().currentUser.uid;

    var currentdate = new Date();
    var date = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() ;
    var time = currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
      
        
    firebase.database().ref('users/' + userId + '/rating/' + idCourse).set({
        q1: map.get(1),
        q2: map.get(2),
        q3: map.get(3),
        freeAnswer: {
            text: map.get(4),
            checked: 0
        },
        date:date,
        time:time
    }, function (error) {
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
            window.location.href = "login.html";
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


/***************************smile rating********************************** */


var emotionsArray = ['angry','disappointed','meh', 'happy', 'inLove'];
  $("#q1_rating").emotionsRating({
    emotionSize: 50,
    bgEmotion: 'happy',
    emotions: emotionsArray,
    color: 'gold'
  });
  $("#q2_rating").emotionsRating({
    emotionSize: 50,
    bgEmotion: 'happy',
    emotions: emotionsArray,
    color: 'gold'
  });
  $("#q3_rating").emotionsRating({
    emotionSize: 50,
    bgEmotion: 'happy',
    emotions: emotionsArray,
    color: 'gold'
  });



  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-36251023-1']);
  _gaq.push(['_setDomainName', 'jqueryscript.net']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    console.log(s);
    
  })();

