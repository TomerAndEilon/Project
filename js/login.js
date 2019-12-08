var obj = { 0: { name: "John", age: 30, city: "New York" } };
var myJSON = JSON.stringify(obj);

console.log("what hepand")
$(document).ready(function () {
    console.log("ready!");
    choose_course() 
    choose_course_number()


    pdfreader()
    
    console.log("end!");
});



function pdfreader() {
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = '../pdfreader/numbers.pdf';

// The workerSrc property shall be specified.
PDFJS.workerSrc = '../pdfreader/pdf.worker.js';

PDFJS.getDocument(url).then(function (pdf) {
    var pdfDocument = pdf;
    var pagesPromises = [];

    for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
        // Required to prevent that i is always the total of pages
        (function (pageNumber) {
            pagesPromises.push(getPageText(pageNumber, pdfDocument));
        })(i + 1);
    }

    Promise.all(pagesPromises).then(function (pagesText) {
    	
        
        // Render text
        for(var i = 0;i < pagesText.length;i++){
            console.log(pagesText[i])
            $("#pdf-text").append("<div><h3>Page "+ (i + 1) +"</h3><p>"+pagesText[i]+"</p><br></div>")
        }
    });

}, function (reason) {
    // PDF loading error
    console.error(reason);
});


/**
 * Retrieves the text of a specif page within a PDF Document obtained through pdf.js 
 * 
 * @param {Integer} pageNum Specifies the number of the page 
 * @param {PDFDocument} PDFDocumentInstance The PDF document obtained 
 **/
function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";

                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];

                    finalString += item.str + " ";
                }

                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}

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