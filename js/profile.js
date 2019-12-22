$(document).ready(function () {
    is_login();
    readPdf();




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




});

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


 


function readPdf() {
    var fileButton = document.getElementById('photo-upload');
    fileButton.addEventListener('change', function (e) {


                //Step 1: Get the file from the input element                
                

        var file = e.target.files[0];

        //Step 2: Read the file using file reader
        var fileReader = new FileReader();  

        fileReader.onload = function() {

            //Step 4:turn array buffer into typed array
            var typedarray = new Uint8Array(this.result);

            //Step 5:PDFJS should be able to read this
            pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
              makeroyipdf(pdf);
            });


        };
        //Step 3:Read the file as ArrayBuffer
        fileReader.readAsArrayBuffer(file);

      




    });
    
}

function makeroyipdf(pdf) {
    //
    // Fetch the first page
    //
    let str = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function (page) {
            page.getTextContent().then(function (textContent) {
                for (let j = 0; j < textContent.items.length; j++) {
                    var line = textContent.items[j].str;
                    if (/\d\d\d\-\d*\-\d\d.*$/.test(line)) {
                        str.push(line.match(/\d\d\d\-\d*/g));
                        // str.push(line);
                        console.log(textContent.items[j].str);
                    }
                }
            });
        });

    }
    // setTimeout(function () {
    //     var txt;
    //     txt = "";
    //     for (let i = 0; i < str.length; i++) {
    //         txt = txt + str[i] + " '<br>' ";
    //         console.log(str[i] + "kokoko");

    //     }
    //     txt = txt + "len:" + str.length + " '<br>' "
    //     document.getElementById("code").innerHTML = txt;
    // }, 2000)



}
