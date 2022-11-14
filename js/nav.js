document.addEventListener("DOMContentLoaded", event =>{
	let navBar = document.createElement("nav");

	let profileBtn = "";
	let username = localStorage.getItem("loggedEmail");
	
	if(username){
		profileBtn = `
			<a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
				<i class="far fa-user fa-2xs mx-1"></i>
				${username}
			</a>
		`
	}
	else{
		profileBtn = `
			<li class="nav-item">
				<a class="nav-link" href="index.html">Iniciar Sesión</a>
			</li>
		`
	}

	navBar.classList = "navbar navbar-expand-lg navbar-dark bg-dark p-1";
	navBar.innerHTML = `
		<div class="container">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav w-100 justify-content-between">
					<li class="nav-item">
						<a class="nav-link" href="main.html">Inicio</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="categories.html">Categorías</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="sell.html">Vender</a>
					</li>
					<li>
						<li class="nav-item dropdown">
							${profileBtn}
							<ul class="dropdown-menu dropdown-menu-dark bg-dark" aria-labelledby="navbarDarkDropdownMenuLink">
								<li><a class="nav-link" href="cart.html">Mi Carrito</a>
								<li><a class="nav-link" href="my-profile.html">Mi perfil</a></li>								
								<li><a class="nav-link" href="#" onclick="logout()">Cerrar sesión</a></li>
							</ul>
						</li>
					</li>
				</ul>
			</div>
		</div>
  `
	//Append this element to the top of body
	document.getElementsByTagName("body")[0].insertAdjacentElement("beforebegin", navBar);


});