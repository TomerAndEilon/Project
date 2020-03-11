var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json";
var url_json_wikicourse = "https://tomerandeilon.github.io/Project/wikidata.json";
var glob_co_arr = [];
var dict_group = {
'software': "בפיתוח תוכנה",
'signal': "בעיבוד אותות ולמידה חישובית",
'AI': "בלמידה חישובית ו AI",
'network': "במערכות זמן אמת ורשתות",
'web': "בתכנות ב Web",
'required':"קורס כללי",
'gen':'קורס כללי'
};

$(document).ready(function () {
    console.log("ready!");
    //check if loging?
    is_login()
    // add lisaner to the logout button
    logout()
    update_data_to_profile()
 
    //add search and filter
    add_listener_search_and_filter();
     //building card and download from db
    download_db();

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
/***************************************course cards ******************************/
function filter_coures(arr_coures) {
    let list_arr_coures = [];

    jQuery.each(arr_coures, function (i, val) {
        for (let index = 0; index < val.length; index++) {
            list_arr_coures.push(val[index]);
        }
    });

    console.log(list_arr_coures);
    const filteredArr = list_arr_coures.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);
    console.log(filteredArr);


    return filteredArr;
}
function make_cards_on_html(arr) {
    console.log("make_cards_on_html");
    $("#list-co").empty();
    jQuery.each(arr, function (index, item) {
        let heb_group = [];
        $.each(item.group, function(index,eng_grp){
            if(index==0){
                heb_group.push(dict_group[eng_grp]);
            }else{
                heb_group.push("</br>"+dict_group[eng_grp]);
            }
        });
        $("#list-co").append(
            
            '<div class="col-lg-3 col-md-6 mb-4">' +
            '<div class="card h-100">' +
            '<img class="card-img-top" src="images/cs-image.jfif" alt="">' +
            '<div class="card-body">' +
            '<h4 class="card-title item_name_co">' + item.name + '</h4>' +
            '<p class="card-text item_value_co">נקודות זכות-' + item.value + '</p>' +
            '<p style="display: none;" class="card-text item_id_co">' + item.id + '</p>' +
            '<p style="display: none;" class="card-text item_data_co">' + item.data + '</p>' +
            '<p style="display: none;" class="card-text item_group_co">' + item.group + '</p>' +
            '<p style="display: none;" class="card-text item_condition_co">' + item.condition + '</p>' +
            '<p class="card-text item_heb_group_co">'+ "מקבץ: "+ heb_group + '</p>' +
            '</div>' +
            '<div class="card-footer">' +
            '<a class="go-to-co btn btn-primary ">כניסה לקורס</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

    });

}

function download_db() {
    $('#loader_now').show();
    firebase.database().ref('/data/wikidata/array').once('value').then(function (snapshot) {
        let array_data = snapshot.val();
        glob_co_arr = array_data;
        make_cards_on_html(glob_co_arr);
       
        $('#loader_now').hide();
       
    });
   
    
}
function making_coures_cards() {
    requestURL = url_json_wikicourse;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json'; // now we're getting a string!
    request.send();

    request.onload = function () {
        const arrText = request.response;
        glob_co_arr = arrText;

        // let filteredArr = filter_coures(arrText);
        // make_cards_on_html(filteredArr);
        // make_cards_on_html(arrText);
    };

}

/***************************************update course to localstorage ******************************/
$('body').on('click', '.go-to-co', function (event) {
    console.log("take pic");
    let btn = $(this).parent().parent();
    localStorage.setItem("id-co", btn.find(".item_id_co").text());
    localStorage.setItem("name-co", btn.find(".item_name_co").text());
    localStorage.setItem("value-co", btn.find(".item_value_co").text());
    localStorage.setItem("data-co", btn.find(".item_data_co").text());
    localStorage.setItem("group-co", btn.find(".item_group_co").text());
    localStorage.setItem("heb_group-co", btn.find(".item_heb_group_co").text());
    localStorage.setItem("condition-co", btn.find(".item_condition_co").text());
    console.log("take co info");

    window.location.href = "wikipage.html";

});

/***************************************filters list co******************************/

function add_listener_search_and_filter() {
    $("#search-co").keyup('change', function () {
        let current_search = $(this).val();
        let temp_arr_filter = [];
        $.each(glob_co_arr, function (index, co) {
            if (co.name.includes(current_search))
                temp_arr_filter.push(co);
        });
        make_cards_on_html(temp_arr_filter);
    });

    $("#group-filter-co").on('change', function () {
        let list_group = $("#group-filter-co").val();
        console.log(list_group);
        let temp_arr_filter = [];
        console.log(list_group.indexOf('all'));
        if (list_group.indexOf('all') >= 0) { //if chosen all 
            console.log('inside all');
            make_cards_on_html(glob_co_arr);
        } else {
            $.each(glob_co_arr, function (index, co) {
                $.each(co.group,function(index,grp){
                    if (list_group.indexOf(grp) >= 0) { //if chosen all 
                        temp_arr_filter.push(co);
                        return false;
                    }
                });
            });
            make_cards_on_html(temp_arr_filter);
        }
    });
}

