var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json";
var url_json_wikicourse = "https://tomerandeilon.github.io/Project/wikidata.json";
var glob_co_arr = [];
var dict_group = {
'software': "בפיתוח תוכנה",
'signal': "בעיבוד אותות ולמידה חישובית",
'AI': "בלמידה חישובית ו AI",
'network': "במערכות זמן אמת ורשתות",
'web': "בתכנות ב Web"
};

$(document).ready(function () {
    console.log("ready!");
    //check if loging?
    is_login()
    // add lisaner to the logout button
    logout()
    update_data_to_profile()
    //building card
    add_data_from_localstorage();
    
});


/***************************************loging and updating profile ******************************/

function if_have_user_name_show_me(user) {
    setTimeout(function () {
        if (user.displayName != null) {
            $("#hello-user").text("שלום " + user.displayName);
            $("#hello-user").css("display", "block");
        }
    }, 1000);

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

function is_login() {
    function add_user_name_on_nav(user) {
        if (user.displayName != null) {
            $("#hello-user").text("שלום " + user.displayName);
            $("#hello-user").css("display", "block");
        }
    }
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
            add_user_name_on_nav(user);
            $("#logout-btn").css("display", "block");
            $("#login-btn").css("display", "none");

        } else {
            $("#hello-user").css("display", "none");
            $("#logout-btn").css("display", "none");
            $("#login-btn").css("display", "block");
            console.log("not loging");
        }
    });
}

/***************************************loging and updating profile ******************************/
function add_data_from_localstorage() {
    console.log("wowow");
    
    $("#name_co_page").text(localStorage.getItem("name-co"));
    $("#heb_group_co_page").text(localStorage.getItem("heb_group-co"));
    $("#data_co_page").text(localStorage.getItem("data-co"));
    $("#wikipage-id").text("קוד קורס: "+localStorage.getItem("id-co"));
    // $("#wikipage-grade").text(localStorage.getItem("grade-co"));//TODO
    $("#wikipage-value").text(localStorage.getItem("value-co"));
    $("#wikipage-condition").text("דרישות קדם: "+localStorage.getItem("condition-co"));
    
}

