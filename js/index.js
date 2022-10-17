function validateEntry(str){
	if(str.length == 0){return false}
	else{ return true};
};

function alertMessage(str){
	let alertBox = document.getElementById("alertBox");
	alertBox.innerText = str;
	alertBox.hidden = false;
}

window.handleGISResponse = (response)=>{
	login("defaultUser");
}

document.addEventListener("DOMContentLoaded", () =>{
	let formElement = document.getElementById("formLogin");

	formElement.addEventListener("submit", event =>{
		event.preventDefault();
		let str_alert = "";
		let invalid = false;
		if(!validateEntry(event.target[0].value)){
			str_alert += "\nIngresar Email";
			invalid = true;
		}
		if(!validateEntry(event.target[1].value)){
			str_alert += "\nIngresar Contraseña";
			invalid = true;
		}

		if(invalid == true){
			alertMessage(str_alert);
			return;
		}
		login(event.target[0].value);
	});
});
