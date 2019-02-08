
 var database = firebase.database();

 var minutesTillTrain = 0;

function displayRealTime() {
setInterval(function(){
    $('#current-time').html(moment().format('hh:mm A'))
  }, 1000);
}
displayRealTime();

 var row = "";
 var key = "";

 $("#submit-button").on("click", function() {

    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
	var firstTrainTime = $("#first-train-time").val().trim();
    var trainFrequency = $("#frequency").val().trim();
   

	if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === ""){
		$("#not-military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}


	else if (trainName === null || destination === null || firstTrainTime === null || trainFrequency === null){
		$("#not-a-number").empty();
		$("#not-military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}


	else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3)!== ":") {
		$("#not-a-number").empty();
		$("#missing-field").empty();
		$("#not-military-time").html("Time must be in military format: HH:mm. For example, 15:00.");
		return false;
	}


	else if (isNaN(trainFrequency)) {
		$("#not-military-time").empty();
		$("#missing-field").empty();
    	$("#not-a-number").html("Not a number. Enter a number (in minutes).");
    	return false;
	}


	else {
		$("#not-a-number").empty();
		$("#missing-field").empty();
		$("#not-military-time").empty();

	    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	    console.log(firstTimeConverted);


	    var currentTime = moment();

	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	    var tRemainder = diffTime % trainFrequency;

	    var tMinutesTillTrain = trainFrequency - tRemainder;

	    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");

		database.ref().push(newTrain);


		$(".add-train-modal").html("<p>" + newTrain.trainName + " was successfully added to the current schedule.");
		$('#addTrain').modal();


		$("#frequency").val("");
		$("#destination").val("");
		$("#train-name").val("");
		$("#first-train-time").val("");
		
	}
});



database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());
	console.log(prevChildKey);

	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var destination = childSnapshot.val().destination;
	var nextTrain = childSnapshot.val().nextTrain;
	var trainName = childSnapshot.val().trainName;
	var trainFrequency = childSnapshot.val().trainFrequency;
	var currentTime = childSnapshot.val().currentTime;
	var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;
	
   
	var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

   
	var trainTd = $("<td>").text(trainName);
	var tRow = $("<tr>");
	var trainFrequencyTd = $("<td>").text(trainFrequency);
    var destTd = $("<td>").text(destination);
	var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);
	var nextTrainTd = $("<td>").text(nextTrain);

    tRow.append("<img src='assets/images/if_trash_1608958.svg' alt='trash can' class='trash-can mr-3'>", trainTd, destTd, trainFrequencyTd, nextTrainTd, tMinutesTillTrainTd);

    $("#schedule-body").append(tRow);
});



 $("body").on("click", ".trash-can", function(){

	event.preventDefault();


	var confirmDelete = confirm("Deleting a train permanently removes the train from the system. Are you sure you want to delete this train?");
	if (confirmDelete) {
		$(this).closest('tr').remove();

	}

	else {
		return;
	}
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})