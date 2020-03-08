var ratingCoursesList = [];
var listDoneCourses;
var year;
var proCourses;
$(document).ready(function () {
    is_login();
    readPdf();
    search_table();
    chenge_progress();
    update_data_to_profile();
    logout();
    update_to_db_after_click_save();
});




function update_to_db_after_click_save() {

    function writeUserData(userId, year, list_pro_coures, list_done_coures) {
        firebase.database().ref('users/' + userId).set({
            year: year,
            list_pro_coures: list_pro_coures,
            list_done_coures: list_done_coures,
            rating : ratingCoursesList
        }, function(error) {
            if (error) {
              // The write failed...
            } else {
              // Data saved successfully!
              window.location.href = "schedule.html";
            }

        });
    
        
    }
    $("#save-user-info").click(function () {
        var userId = firebase.auth().currentUser.uid;
        let id_done_list = [];
        let year_number = $('#choose-year-number').selectpicker('val');
        let pro_coures = $('#choose-pro-courses').selectpicker('val');
        pro_coures = getProCoursesInEnglish(pro_coures);
        let coures_done_list = $('.coures-ids:checkbox:checked')
        for (let i = 0; i < coures_done_list.length; i++) {
            let courseNumber = $(coures_done_list[i]).data("id");
            var numberPattern = /\d+/g;
            let valid = courseNumber.match(numberPattern)
            id_done_list.push(valid);
        }
        if (userId != null) {
            writeUserData(userId, year_number, pro_coures, id_done_list);
        }




    });
    function getProCoursesInEnglish(proCourse){
        let courseInEnglish = [];
        for (let index = 0; index < proCourse.length; index++) {
            switch (proCourse[index]) {
                case "פיתוח תוכנה":
                    courseInEnglish.push("software");
                    break;
                case "אינטרנט":
                    courseInEnglish.push("Internet technology");
                    break;
                case "עיבוד אותות":
                    courseInEnglish.push("Signal Processing");
                    break;
                case "רשתות":
                    courseInEnglish.push("Real-time systems and networks");
                    break;
                case "בינה מלאכותית":
                    courseInEnglish.push("Computational Learning and Artificial Intelligence");
                    break;
                
                default:
                    break;
            }
            
        }
       
        return courseInEnglish;

    }






}

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



function get_result_in_precent_where_you_are() {

    var arr = $('.checkthis:checkbox:checked');

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += parseFloat($(arr[i]).data("value"));
    }
    console.log("sum:" + sum);

    let percent_degre = sum / 126 * 100;
    percent_degre = parseFloat(percent_degre).toFixed(2)
    console.log(percent_degre);
    $("#progress-bar-course-student").attr("aria-valuenow", percent_degre);
    $("#progress-bar-course-student").html(percent_degre + "%");
    $("#progress-bar-course-student").css("width", percent_degre + "%");


}


function chenge_progress() {
    $("#table-course-profile").change(function () {


        get_result_in_precent_where_you_are();

    });

}

function make_html_builds() {

    function remove_dubli_cousre(arr) {
        let uniqueArray = [];
        let inArr = false;
        for (let i = 0; i < arr.length; i++) {
            let val = arr[i];
            inArr = false;
            for (let j = 0; j < uniqueArray.length; j++) {
                if (val.id.localeCompare(uniqueArray[j].id) == 0) {
                    inArr = true;
                    break;
                }
            }
            if (!inArr)
                uniqueArray.push(val);

        }
        return uniqueArray;

    }

    function mergeArray(arr) {
        let merged_arr = [];
        Object.entries(arr).forEach(([key, value]) => {

            merged_arr = merged_arr.concat(value)
        });

        return merged_arr
    }
    function make_html_in_remove_couses(arr) {

        $("#table-course-profile").empty();
        for (let index = 0; index < arr.length; index++) {

            let id = parseInt(arr[index].id)
            $("#table-course-profile").append(
                '<tr>' +
                '<td><input  id= ' + id  +' data-id="' + arr[index].id + '" data-name="' + arr[index].name + '" data-value="' + arr[index].value + '"  type="checkbox" class="checkthis coures-ids" /></td>' +
                '<td>' + arr[index].name + '</td>' +
                '<td>' + arr[index].value + '</td>' +
                '<th scope="row">' + arr[index].id + '</th>' +
                '</tr>'
            );
        }




    }
    function updateSelectionFromDB(){
        for (const key in listDoneCourses) {
            let id = parseInt(listDoneCourses[key]);
            document.getElementById(id).click();
        }
        for (const pro in proCourses) {
            let idPro = proCourses[pro];
            document.getElementById(idPro).selected = true;

        }
        let yearId = "one";
        switch (year) {
            case "1":
                yearId = "one";
                break;
            case "2":
                yearId = "two";
                break;
            case "3":
                yearId = "three";
                break;
            case "4":
                yearId = "four";
                break;
        
            default:
                break;
        }
        document.getElementById(yearId).selected = true;

        $('.selectpicker').selectpicker('refresh');
        removeLoader();
    }
    var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json";

    requestURL = url_json_course;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'text'; // now we're getting a string!
    request.send();

    request.onload = function () {
        const arrText = request.response; // get the string from the response
        let arr = JSON.parse(arrText); // convert it to an object


        arr = mergeArray(arr);//arr["General courses"];

        let uniqueArr = remove_dubli_cousre(arr);

        console.log(uniqueArr);



        make_html_in_remove_couses(uniqueArr);
        updateSelectionFromDB();


    };



}

function search_table() {
    $(".search").keyup(function () {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' item');

        if (jobCount == '0') { $('.no-result').show(); }
        else { $('.no-result').hide(); }
    });

}

function is_login() {
    function add_user_name_on_nav(user) {
        if (user.displayName != null) {
            $("#hello-user").text("שלום " + user.displayName);
            $("#hello-user").css("display", "block");
        }
        let userId = firebase.auth().currentUser.uid;

        firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            params_data = snapshot.val();
            if(params_data!=null){
                ratingCoursesList = params_data.rating !=null ?params_data.rating : "" ;
                listDoneCourses = params_data.list_done_coures;
                proCourses = params_data.list_pro_coures;
                year = params_data.year;
            }
            make_html_builds();

        });
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

            userNow2 = user;
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





function readPdf() {
    var fileButton = document.getElementById('photo-upload');
    fileButton.addEventListener('change', function (e) {
        make_html_builds();

        //Step 1: Get the file from the input element                


        var file = e.target.files[0];

        //Step 2: Read the file using file reader
        var fileReader = new FileReader();

        fileReader.onload = function () {

            //Step 4:turn array buffer into typed array
            var typedarray = new Uint8Array(this.result);

            //Step 5:PDFJS should be able to read this
            pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
                makeroyipdf(pdf);
            });


        };
        //Step 3:Read the file as ArrayBuffer
        fileReader.readAsArrayBuffer(file);






    });

}
function removeLoader() {
    document.getElementById("loader").style.display = "none";
}
function makeroyipdf(pdf) {
    function update_course_table_after_parser(list_ids_course) {
        let element_to_check = document.querySelectorAll('[data-id]');


        for (let index = 0; index < list_ids_course.length; index++) {

            for (let j = 0; j < element_to_check.length; j++) {
                if (String(list_ids_course[index]).localeCompare($(element_to_check[j]).data("id")) == 0) {
                    $(element_to_check[j]).prop('checked', true);
                }


            }



        }

        $("#pdf-input-p").text("הנתונים עודכנו");
        $("#pdf-input-p").css("color", "green");
        $("#pdf-input-p").css("font-weight", " bold");




    }
    //
    // Fetch the first page
    //
    var course_students = new Array();
    for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function (page) {
            page.getTextContent().then(function (textContent) {
                for (let j = 0; j < textContent.items.length; j++) {
                    var line = textContent.items[j].str;
                    if (/\d\d\d\-\d*\-\d\d.*$/.test(line)) {


                        course_students.push(line.match(/(\d\d\d\d\d\d\d)/g));

                    }
                }

            });
        });

    }


    setTimeout(function () {
        update_course_table_after_parser(course_students);

    }, 2000);
    setTimeout(function () {
        get_result_in_precent_where_you_are();

    }, 3000);



}
