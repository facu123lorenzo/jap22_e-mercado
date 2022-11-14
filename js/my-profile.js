document.addEventListener("DOMContentLoaded", () => {
	let username = localStorage.getItem("loggedEmail");
	let profile = {};
	let profilePicInput = document.getElementById("profile-pic-input");
	let profilePicElement = document.getElementById("profile-pic");
	let uploadedPic = "";

	// Check if the user is logged
	if(!username){
		let profileContainer = document.getElementById("profile-section");
		profileContainer.innerHTML = `
			<div class="mt-5 card w-100 text-center ">
				<div class="container p-4">
					<div id="alertBox" class="row " role="alert">
						<h3>Debes estar logueado para ver esta página</p3>
					</div>
					<a class="btn btn-primary mx-3 mt-4" href="./index.html">Iniciar sesión</a>
				</div>
			</div>
		`
		return;
	}

	// Create a profile entry for the user if not already present
	if(!localStorage.getItem("profile-"+username)){
		profile = {
			'email': username,
			'firstName': '',
			'secondName': '',
			'lastName': '',
			'secondLastName': '',
			'phone': '',
			'profilePic': ''
		}
		localStorage.setItem("profile-"+username, JSON.stringify(profile));
	}
	
	profile = JSON.parse(localStorage.getItem("profile-"+username));
	let form = document.getElementById("user-form");

	// Fill form inputs with current profile data
	form['email'].value = 				profile.email;
	form['first-name'].value = 			profile.firstName;
	form['second-name'].value = 		profile.secondName;
	form['last-name'].value = 			profile.lastName;
	form['second-last-name'].value = 	profile.secondLastName;
	form['phone'].value = 				profile.phone;
	if(profile.profilePic && profile.profilePic.length >0){
		profilePicElement.src = profile.profilePic;
		profilePicInput.value = null;
	}

	// Update profile data on submit
	form.addEventListener("submit", (e)=>{
		// Check validations first
		if (!form.checkValidity()) {
			e.preventDefault();
			e.stopPropagation();
			form.classList.add('was-validated');
			Array.from(form).forEach(item => {
				console.log("foreach")
				if(item.required == true){
					console.log(item);
					item.classList.add('was-validated');
				}
			});
			return;
		}

		let prevUsername = username;

		username = profile.email = 	form['email'].value;
		profile.firstName =			form['first-name'].value;
		profile.secondName =		form['second-name'].value;
		profile.lastName =			form['last-name'].value;
		profile.secondLastName = 	form['second-last-name'].value;
		profile.phone = 			form['phone'].value;
		profile.profilePic =		uploadedPic.length>0? uploadedPic : '';

		// Renamed user
		if(username != prevUsername){
			// Move user cart
			setCart(username, getCart(prevUsername));

			// Remove previous profile and cart
			localStorage.removeItem("profile-"+prevUsername);
			localStorage.removeItem("cart-"+prevUsername);

			// Update logged username
			localStorage.setItem("loggedEmail", username);
			
		}

		// Save profile
		localStorage.setItem("profile-"+username, JSON.stringify(profile));
	});

	// Handle profile pic loading
	profilePicInput.addEventListener("change", () =>{
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			if(reader.result.length>0){
				uploadedPic = reader.result;
				profilePicElement.src = reader.result;
			}
		});

		if(profilePicInput.files[0]){
			reader.readAsDataURL(profilePicInput.files[0]);
		}
	});
});