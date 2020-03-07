var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json";
var url_json_wikicourse = "https://tomerandeilon.github.io/Project/wikidata.json";
var wikidata_array = [];
var flag_wikidata_array = false;
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
    is_login();
    // add lisaner to the logout button
    logout();
    update_data_to_profile();
    //add json
    add_json();
    //add_wiki
    add_wiki();

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
/**************************************add json******************************/

function add_json() {
    $('#add_json').on('click', function () {
        $('#panel-admin').empty();
        $('#panel-admin').append(
            "<label for='json_url'> קישור(url)</label>" +
            "<input type='text' id='json_url' name='json_url'><br><br>" +
            "<label for='name_json'>שם באנגלית שיופיע בשרת</label>" +
            "<input type='text' id='name_json' name='name_json'><br><br>" +
            "<button id='update_server' type='button' class='btn btn-primary'>עדכון בשרת</button>"
        );
        $('#show-group-wiki').css('display','none');
        update_server_btn();
    });
}
/**************************************update server******************************/
function update_server_btn() {
    function update_by_name_and_arr(name, arr) {
        firebase.database().ref('data/' + name).set({
            array: arr

        }, function (error) {
            if (error) {
                // The write failed...
            } else {
                // Data saved successfully!
                alert("server update")
            }

        });

    }
    $('#update_server').on('click', function () {
        alert("wait for message");
        let json_url_user = $('#json_url').val();
        let json_name_user = $('#name_json').val();
        if (json_url_user === "") {
            alert(" json url empty");
            return false;
        }
        if (json_name_user === "") {
            alert(" json name empty");
            return false;
        }

        requestURL = json_url_user;
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json'; // now we're getting a string!
        request.send();

        request.onload = function () {
            const arrText = request.response;
            update_by_name_and_arr($('#name_json').val(), arrText)
        };




    });

}
/**************************************add wiki******************************/
function add_wiki() {
    firebase.database().ref('/data/wikidata/array').once('value').then(function (snapshot) {
        let array_data = snapshot.val();
        wikidata_array = array_data;
        flag_wikidata_array = true;
        console.log(flag_wikidata_array);


    });

    $('#add_wiki').on('click', function () {
        console.log(wikidata_array);
        var list_condition_wiki = [];


        $('#panel-admin').empty();
        $('#panel-admin').append(
            

            "<div class='row'>" +
            "<label for='name_new_co'> שם הקורס</label>" +
            "<input type='text' id='name_new_co' name='name_new_co'>" +
            "</div>" +

            "<div class='row'>" +
            "<label for='name_id_co'> id של הקורס</label>" +
            "<input type='text' id='name_id_co' name='name_id_co'>" +
            "</div>" +

            "<div class='row'>" +
            "<label for='name_value_co'> נקודות זכות</label>" +
            "<input type='text' id='name_value_co' name='name_value_co'>" +
            "</div>" +

            "<div class='row'>" +
            "<label for='name_condition_co'>קורסי קדם </label>" +
            "<input type='text' id='name_condition_co' name='name_condition_co'>" +
            "</div>" +

            "<div class='row'>" +
            "<button id='name_condition_co_btn' type='button' class='btn btn-primary'>הוסף קורס קדם לרשימה </button>" +
            "<p id='list_name_condition_co'>קורסי קדם הרשימה</p>"+
            "</div>" +

            "<div class='row'>" +
            "<label for='name_data_co'>תיאור הקורס</label>" +
            "<textarea class='form-control' rows='5' id='name_data_co' name='text'></textarea>"+
            "</div>" +

            "<div class='row'>" +
            "<button id='update_wiki_co_btn' type='button' class='btn btn-primary'>עדכון בשרת</button>" +
            "</div>" +

            "   <div class='row'>" +
            "   <ul id='myUL'>" +
            "     <li><span class='caret'>wikicoures</span>" +
            "       <ul class='nested' id='semeter0'>" +
            "       </ul>" +
            "     </li>" +
            "   </ul>" +
            " </div>"
        );
        $('#show-group-wiki').css('display','block')
        add_condition_to_list(list_condition_wiki);
        updateTree(wikidata_array);
        update_wikidata(list_condition_wiki);

    });

}

function updateTree(array_wiki) {
    var toggler = document.getElementsByClassName("caret");
    var i;
    let wiki_tree = document.getElementById("semeter0");

    for (let j = 0; array_wiki && j < array_wiki.length; j++) {

        wiki_tree.innerHTML +=
            "<li><span class='caret'>" + array_wiki[j].name + "</span>" +
            "    <ul class='nested'>" +
            "        <li> נקודות זכות -" + array_wiki[j].value + "</li>" +
            "        <li>קורסי קדם -" + array_wiki[j].condition + "</li>" +
            "        <li>מקבץ -" + array_wiki[j].group + "</li>" +
            "        <li>מספר קורס -" + array_wiki[j].id + "</li>" +
            "        <li>תיאור קורס -" + array_wiki[j].data + "</li>" +
            "    </ul>" +
            "</li>"

    }


    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
}
function add_condition_to_list(list_condition_wiki){
    $('#name_condition_co_btn').on('click', function () {
        let con = $('#name_condition_co').val();
        list_condition_wiki.push(con);
        $('#list_name_condition_co').text(list_condition_wiki);
        $('#name_condition_co').val('');
    });
}
function update_wikidata(list_condition_wiki) {
    function check_if_coures_exists(id) {
        if (wikidata_array.length==0){
            alert("חכה 10 שניות");
            return false;
        }
        for (let index = 0; index < wikidata_array.length; index++) {
            const element = wikidata_array[index].id;
            if(id.localeCompare(element)==0)
            {
                return false;
            }
            
        }
        return true; 
    }
    $('#update_wiki_co_btn').on('click', function () {
        alert("חכה עד להודעה שהשרת התעדכן")
        let name_co = $('#name_new_co').val();
        let id_co = $('#name_id_co').val();
        let value_co = $('#name_value_co').val();
        let group_co = $('#name_group_co').val();;
        let condition_co = list_condition_wiki;
        let data_co = $('#name_data_co').val();
        console.log(name_co);
        console.log(id_co);
        console.log(value_co);
        console.log(group_co);
        console.log(condition_co);
        console.log(data_co);
        new_co = {
            'name':name_co,
            'id':id_co,
            'value':value_co,
            'group':group_co,
            'condition':condition_co,
            'data': data_co
        }
        console.log(check_if_coures_exists(id_co));
        if(check_if_coures_exists(id_co)==true){
            wikidata_array.push(new_co);
            arr_update = wikidata_array;
            firebase.database().ref('data/wikidata').set({
                array: arr_update
    
            }, function (error) {
                if (error) {
                    // The write failed...
                } else {
                    // Data saved successfully!
                    alert("server update")
                }
    
            });
        }
        


    });
    
}
