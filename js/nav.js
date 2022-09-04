document.addEventListener("DOMContentLoaded", event =>{
	let navBar = document.createElement("nav");

	navBar.classList = "navbar navbar-expand-lg navbar-dark bg-dark p-1";
	navBar.innerHTML = `
		<div class="container">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav w-100 justify-content-between">
					<li class="nav-item">
						<a class="nav-link active" href="main.html">Inicio</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="categories.html">Categorías</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="sell.html">Vender</a>
					</li>
					<li class="nav-item">
						<a class="nav-link">
							<i class="far fa-user fa-2xs mx-1"></i>
							${localStorage.getItem("loggedEmail")}
						</a>
					</li>
				</ul>
			</div>
		</div>
  `
	//Append this element to the top of body
	document.getElementsByTagName("body")[0].insertAdjacentElement("beforebegin", navBar);

  
});