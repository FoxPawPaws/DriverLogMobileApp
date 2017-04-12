$(function() {

    var $body = $(document);
    $body.bind('scroll', function() {
        // "Disable" the horizontal scroll.
        if ($body.scrollLeft() !== 0) {
            $body.scrollLeft(0);
        }
    });

});
//Login Forms
function loginForm() {
	event.preventDefault();

	var email = $('#email').val();
	var pass = $('#password').val();
		
	$.post('http://appproject.ben-littleton.com/oauth/token',{
		grant_type: "password",
		client_id:2,
		client_secret: "xyhA3Fi4WIq8IF9xeo5HPO1t6cMAzdt3xvHS4mOd",
		username: email,
		password: pass
	}).then(function (success){
		var token = success['access_token'];
		//console.log(token);
		localStorage['token'] = token;
		window.location.href = "dashboard.html";
	},function (error){
		
		alert(JSON.parse(error.responseText).message + " " + JSON.parse(error.responseText).hint);
	})
}
//Register Form
function registerForm() {
	event.preventDefault();

	var name = $('#name').val();
	var email = $('#email').val();
	var pass = $('#password').val();
	
	$.post('http://appproject.ben-littleton.com/api/user/register', {
		name: name,
		email: email,
		password: pass
	}).then(function (success){
		$.post('http://appproject.ben-littleton.com/oauth/token',{
			grant_type: "password",
			client_id:2,
			client_secret: "xyhA3Fi4WIq8IF9xeo5HPO1t6cMAzdt3xvHS4mOd",
			username: email,
			password: pass
		}).then(function (success){
			var token = success['access_token'];
			//console.log(token);
			localStorage['token'] = token;
			window.location.href = "editProfile.html";
		},function (error){
			console.error(error)
		})
	},function (error){
		console.error(error)
	})
}
//profile Form
function profileForm() {
	event.preventDefault();
		
	$.post('http://appproject.ben-littleton.com/api/user/update',{
		name: $("#name").val(),
		country: $("#country").val(),
		province: $("#province").val(),
		city: $("#city").val(),
		address: $("#address").val(),
		postal_code: $("#postal").val()
	})
}
//profile Form
function vehicleForm() {
	event.preventDefault();
		
	$.post('http://appproject.ben-littleton.com/api/user/create',{
		make: $("#make").val(),
		model: $("#model").val(),
		year: $("#year").val(),
		colour: $("#colour").val(),
		license_plate: $("#plate").val(),
		VIN: $("#vinNum").val()
	})
}
// vehicle Id
function setRecordId() {
	var token = "Bearer "+localStorage['token'];
	console.log(token);
	
	$.ajaxSetup({
		beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', token);
		}
	});
	$.get("http://appproject.ben-littleton.com/api/user/vehicles").then(function (success){
			console.log(success);
			$("#vId").html(success[0].id);
		},function (error){
			console.error(error)
		});
	
}
// add records
function recordsForm() {
	console.log("here is the form");
	event.preventDefault();
	
	var token = "Bearer "+localStorage['token'];
	console.log(token);
	
	$.ajaxSetup({
		beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', token);
		}
	});
	
	var totalDistance = $("#start").val() - $("#end").val();
	var vId = "'http://appproject.ben-littleton.com/api/user/vehicles/"+$("#vId").html()+"/stat'";
	console.log(vId);
		
	$.post("http://appproject.ben-littleton.com/api/user/vehicles/4/stat",{
		litres_of_fuel_used: $("#fuel").val(),
		odo_start: $("#start").val(),
		odo_end: $("#end").val(),
		meters_travelled: -(totalDistance)
	})
	window.location.href = "listview.html";
}

//get the records
function getRecords() {
	var token = "Bearer "+localStorage['token'];
	console.log(token);
	
	$.ajaxSetup({
		beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', token);
		}
	});
		
	$.get("http://appproject.ben-littleton.com/api/user/vehicles").then(function (success){
			
		for(i=0; i < (success[0].vehicle_stats).length; i++){
				
			var	$div = $("<tr>").addClass("")
			.append($("<td>").text(i+1))
			.append($("<td>").text(success[0].vehicle_stats[i].created_at))
			.append($("<td>").text(success[0].vehicle_stats[i].litres_of_fuel_used+" l"))
			.append($("<td>").text(success[0].vehicle_stats[i].odo_start+" m"))
			.append($("<td>").text(success[0].vehicle_stats[i].odo_end+" m"))
			.append($("<td>").text(success[0].vehicle_stats[i].meters_travelled+" m"))
		;
		
		$("#list").append($div);
				
		}	
			
		},function (error){
			console.error(error)
		});
}

//Log Out
function logOut() {
	event.preventDefault();
	
	localStorage.removeItem('token');
	window.location.href = "index.html";
}
//Nav Manipulation
function navCheck() {
	if(typeof(localStorage['token']) != "undefined" && localStorage['token'] !== null){
		$(".loggedIn").show();
		$(".loggedOut").hide();
	}else{
		$(".loggedIn").hide();
		$(".loggedOut").show();
	}
}
//Get Profile Info
function getProfile() {
	var token = "Bearer "+localStorage['token'];
	console.log(token);
	
	$.ajaxSetup({
		beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', token);
		}
	});
	
	$.get("http://appproject.ben-littleton.com/api/user").then(function (success){
			console.log(success);
			$("#name").html(success.name);
			$("#address").html(success.address);
			$("#city").html(success.city);
			$("#province").html(success.province);
			$("#postal").html(success.postal_code);
			$("#country").html(success.country);
		},function (error){
			console.error(error)
		});
		
	$.get("http://appproject.ben-littleton.com/api/user/vehicles").then(function (success){
			console.log(success);
			$(".model").html(success[0].model);
			$(".make").html(success[0].make);
			$(".colour").html(success[0].colour);
			$(".year").html(success[0].year);
			$(".plate").html(success[0].license_plate);
			$(".vinNum").html(success[0].VIN);
		},function (error){
			console.error(error)
		});
}
//Get Profile Info for edit page
function getEditProfile() {
	var token = "Bearer "+localStorage['token'];
	console.log(token);
	
	$.ajaxSetup({
		beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', token);
		}
	});
	
	$.get("http://appproject.ben-littleton.com/api/user").then(function (success){
			console.log(success);
			$("#name").val(success.name);
			$("#address").val(success.address);
			$("#city").val(success.city);
			$("#province").val(success.province);
			$("#postal").val(success.postal_code);
			$("#country").val(success.country);
		},function (error){
			console.error(error)
		});
		
	$.get("http://appproject.ben-littleton.com/api/user/vehicles").then(function (success){
			console.log(success);
			$("#model").val(success[0].model);
			$("#make").val(success[0].make);
			$("#colour").val(success[0].colour);
			$("#year").val(success[0].year);
			$("#plate").val(success[0].license_plate);
			$("#vinNum").val(success[0].VIN);
		},function (error){
			console.error(error)
		});
}
//Redirect page
function pagePermissions() {
	var pageName = document.location.href.match(/[^\/]+$/)[0];
	
	if(typeof(localStorage['token']) != "undefined" && localStorage['token'] !== null){
		if(pageName == "login.html"){
			window.location.href = "editProfile.html";
		}else if(pageName == "register.html"){
			window.location.href = "editProfile.html";
		}else{
			console.log("Correct Page")
		}
	}else{
		if(pageName == "editProfile.html"){
			window.location.href = "index.html";
		}else if(pageName =="dashboard.html"){
			window.location.href = "index.html";
		}else if(pageName =="profile.html"){
			window.location.href = "index.html";
		}else if(pageName =="addRecords.html"){
			window.location.href = "index.html";
		}else{
			console.log("Correct Page")
		}
	}
}
//Page Ready
$( document ).ready(function() {
	pagePermissions();
	navCheck();
	
	var pageName = document.location.href.match(/[^\/]+$/)[0];
	
	if(typeof(localStorage['token']) != "undefined" && localStorage['token'] !== null){
		if(pageName == "editProfile.html"){
			getEditProfile();
		}else if(pageName == "profile.html"){
			getProfile();
		}else if(pageName == "listview.html"){
			getRecords();
		}else if(pageName == "addRecords.html"){
			setRecordId();
		}
	}
});