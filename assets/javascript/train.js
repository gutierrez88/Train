var config = {
    apiKey: "AIzaSyAwxfm5CsgytfNXrh3MNDJDXY-gvjfRimk",
    authDomain: "trainschedule-cfcf9.firebaseapp.com",
    databaseURL: "https://trainschedule-cfcf9.firebaseio.com",
    projectId: "trainschedule-cfcf9",
    storageBucket: "trainschedule-cfcf9.appspot.com",
    messagingSenderId: "181167227321"
};

firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var des = "";
var first = "";
var freq = "";
var firstArray= [];
var freqArray=[];
var counter = 0;

$("#go").on("click", function(e){

    e.preventDefault();
    
    name = $("#name").val().trim();
    des = $("#des").val().trim();
    first = $("#first").val().trim();
    freq = $("#freq").val().trim();

    if ( name === ""){
        alert("Please fill in Train Name!")
    }else if( des === "" ){
        alert("Please fill in Destination!")
    }else if(first === ""){
        alert("Please fill in First Train Time (HHmm - Military Time)!")
    }else if(freq == 0){
        alert("Please fill in Freqency (min)!")
    }else{
        database.ref().push({
            name : name,
            des : des,
            first : first,
            freq : freq,
            dateAdded : firebase.database.ServerValue.TIMESTAMP
        });
        $(".done").val("");
    };

    

});

function currentTime(){
    var curTime = moment().format("hh:mma");
    $("#showTime").html("Current Time "+curTime);
    setTimeout(currentTime, 60000);
};

database.ref().on("child_added", function (childInfo){
    console.log(childInfo.val().name);
    console.log(childInfo.val().des);
    console.log(childInfo.val().first);
    console.log(childInfo.val().freq);
    console.log(childInfo.key);
    


    var key = childInfo.key
    var username = childInfo.val().name;
    var userdes = childInfo.val().des;
    var userfreq = childInfo.val().freq;
    var userfirst = childInfo.val().first;
    
    firstArray.push(userfirst)
    freqArray.push(userfreq)
    console.log(firstArray)
    console.log(freqArray)
    

    // Time Stuff
    var firstTime = moment(childInfo.val().first, "HH:mm").format("hh:mma");
    var timeConvert = moment(firstTime,"hh:mma").subtract(7, "days");
    var freqMin = childInfo.val().freq;
    var difference = moment().diff(timeConvert, "minutes");
    var remaining = difference % freqMin;
    var left = freqMin - remaining;
    var nextArrival = moment().add(left, "minutes").format("h:mma")
    var lastArrival = moment().subtract(remaining, "minutes").format("h:mma")
    

   
    
    $("#showMe").append("<tr><td>" 

        + username + "</td><td>"
        + userdes + "</td><td>"
        + userfreq + "</td><td id='lastarr" + counter+ "'>"
        + lastArrival + "</td><td id='nextarr" + counter +"'>"
        + nextArrival + "</td><td id='left"+counter+"'>"
        + left + "</td><td><button class='btn btn-info btn-sm mb-2 mt-1' data-key='"+key+"' id='delete'>X</button>"
        + "</tr>"
    );
    counter++
},function(errorObject) {
    console.log(errorObject.code);
});



$(document).on("click", "#delete", function() {
    keygrab = $(this).attr("data-key");
    database.ref().child(keygrab).remove();
    location.reload();
});

currentTime();

setInterval(function (){

    for (i=0 ; i<firstArray.length; i++) {

    var firstTime = moment(firstArray[i], "HH:mm").format("hh:mma");
    var timeConvert = moment(firstTime,"hh:mma").subtract(7, "days");
    var freqMin = freqArray[i];
    var difference = moment().diff(timeConvert, "minutes");
    var remaining = difference % freqMin;
    var left = freqMin - remaining;
    var nextArrival = moment().add(left, "minutes").format("h:mma")
    var lastArrival = moment().subtract(remaining, "minutes").format("h:mma")

    $("#lastarr"+[i]).text(lastArrival)
    $("#nextarr"+[i]).text(nextArrival)
    $("#left"+[i]).text(left)
    }

}, 60000);
