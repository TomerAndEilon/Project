var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json";
var url_json_wikicourse = "https://tomerandeilon.github.io/Project/wikidata.json";
var glob_co_arr = [];
var comments_array = [];
var total_rating_co = 0;
var cnt_rating_co = 0;
var q_one = 0;
var q_two = 0;
var q_three = 0;
var dict_group = {
    'software': "בפיתוח תוכנה",
    'signal': "בעיבוד אותות ולמידה חישובית",
    'AI': "בלמידה חישובית ו AI",
    'network': "במערכות זמן אמת ורשתות",
    'web': "בתכנות ב Web",
    'required':"קורס כללי"
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

    download_db();
    update_stars();
});


/***************************************star rate******************************/
function update_stars() {
    var starRatingClass = $(".star-rating");
    // var star_val = starRatingClass.find(".rating-value");
    // var $star_rating = $('.star-rating .fa');
    
    var SetRatingStar = function() {
      $.each(starRatingClass,function(index,val) {
        var star_val = $(val).find(".rating-value");
        
        var number_star = parseInt(star_val.val());
        if(number_star>0)
            $(val).find(".star_1").removeClass("fa-star-o").addClass("fa-star");
        if(number_star>1)
            $(val).find(".star_2").removeClass("fa-star-o").addClass("fa-star");
        if(number_star>2)
            $(val).find(".star_3").removeClass("fa-star-o").addClass("fa-star");
        if(number_star>3)
            $(val).find(".star_4").removeClass("fa-star-o").addClass("fa-star");
        if(number_star>4)
            $(val).find(".star_5").removeClass("fa-star-o").addClass("fa-star");
        
      });
    };
    
    
    SetRatingStar();
}

/***************************************download_db ******************************/
function download_db() {
    $('#loader_now').show();
    firebase.database().ref('/users').once('value').then(function (snapshot) {
        let array_data = snapshot.val();
        comments_array = array_data;
        console.log(comments_array);
        $('#loader_now').hide();
        update_comments_from_db();

    });

}
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

    $("#name_co_page").text(localStorage.getItem("name-co"));
    $("#heb_group_co_page").text(localStorage.getItem("heb_group-co"));
    $("#data_co_page").text(localStorage.getItem("data-co"));
    $("#wikipage-id").text("קוד קורס: " + localStorage.getItem("id-co"));
    $("#wikipage-value").text(localStorage.getItem("value-co"));
 
    if (localStorage.getItem("condition-co").localeCompare('')==0) {
        $("#wikipage-condition").text("דרישות קדם: אין" );
      }
      else{
        $("#wikipage-condition").text("דרישות קדם: " + localStorage.getItem("condition-co"));
      }
    

}
/***************************************loging and updating profile ******************************/
function update_comments_from_db() {
    function get_only_rating_and_add_id_user(arr_comments) {
        users_ratings = {};
        jQuery.each(arr_comments, function (i, val) {
            $.each(val.rating, function (co_num, val) {
                if (co_num in users_ratings) {
                    users_ratings[co_num].push(val);
                } else {
                    users_ratings[co_num] = [val];
                }
            });
        });
        return users_ratings
    }
    console.log(get_only_rating_and_add_id_user(comments_array));
    let list_ratis_by_id = get_only_rating_and_add_id_user(comments_array);
    $('#list_comments').empty();
    let co_num = localStorage.getItem("id-co")
    $.each(list_ratis_by_id[co_num], function (id, val) {
        cnt_rating_co++;
        let local_avg_rating = val.q2;
        total_rating_co+= local_avg_rating;
        q_one+=val.q1;
        q_two+=val.q2;
        q_three+=val.q3;
        if(val.freeAnswer.checked == 1){
            $('#list_comments').append(
                "  <div class='row comment-user'>" +
                "  <div class='col-lg-2 col-md-2 mb-2'>" +
                "  </div>" +
                "  <div class='col-lg-8 col-md-8 mb-8'>" +
                "    <div class='card card-white post'>" +
                "      <div class='post-heading'>" +
                "        <div class='float-left image'>" +
                "          <img src='images/icons8-user-100.png' class='img-circle avatar' alt='user profile image'>" +
                "        </div>" +
                "        <div class='float-left meta'>" +
                "          <div class='title h5'>" +
                "            <p><b>אנונימי</b></p>" +

                "          </div>" +
                "          <h6 class='text-muted time'>שעה "+val.time+"</h6>" +
                "          <h6 class='text-muted time'>תאריך "+val.date+"</h6>" +
                "          <h6 class='text-muted time'>ציון - "+local_avg_rating+"</h6>" +
                "        </div>" +
                "      </div>" +
                "      <div class='post-description'>" +
                "        <p>" +
                val.freeAnswer.text +
                "        </p>" +

                "      </div>" +
                "    </div>" +
                "  </div>" +
                "  <div class='col-lg-2 col-md-2 mb-2'>" +
                "  </div>" +
                "</div>"

            );
        }

        
    });
    
    
    if (q_one!=0) {
        $("#q_one_val").val(q_one/cnt_rating_co);
        update_stars();
    }
    if (q_two!=0) {
        $("#q_two_val").val(q_two/cnt_rating_co);
        update_stars();
    }
    if (q_three!=0) {
        $("#q_three_val").val(q_three/cnt_rating_co);
        update_stars();
    }



}

