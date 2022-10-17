let exchangeRates = null;

function setProductCount(prodId, val){
	if(!prodId || val < 0) return;

	let username = localStorage.getItem("loggedEmail");
	let cart = getCart(username);
	if(!cart) return;
	let index = cart.findIndex(function(art){
		return art.id == prodId;
	})
	
	cart[index].count = val;
	setCart(username, cart);
	document.getElementById("cart-section").innerHTML = createCartSection(getCart(localStorage.getItem("loggedEmail")));
}

function removeFromCart(prodId){
	let index = null;
	let cart = getCart(localStorage.getItem("loggedEmail"));
	index = cart.findIndex(prod => (prod.id == prodId));
	if(index < 0) return;

	setCart(localStorage.getItem("loggedEmail"), cart);
	document.getElementById("cart-section").innerHTML = createCartSection(getCart(localStorage.getItem("loggedEmail")));
}

function createCartSection(products){
	let html = "";
	let totalCost = 0;
	let cartItems = "";

	// Convert currencies to local if not in UYU
	for(let product of products){
		let productCost = product.unitCost*product.count;
		if(product.currency != "UYU") productCost *= exchangeRates[product.currency].sell;
		totalCost += productCost;
	}
	// If cart is empty create an alert and return
	if(!products || products.length <= 0){
		html = `
			<div class="mt-5 card w-100 text-center ">
				<div class="container p-4">
					<div id="alertBox" class="row " role="alert">
						<h3>Tu carrito está vacío</p3>
					</div>
					<a class="btn btn-primary mx-3 mt-4" href="./categories.html">¡Comienza a llenarlo ahora mismo!</a>
				</div>
			</div>
		`
		return html;
	}

	// Create a row for each cart item
	for(let i = 0; i<products.length; i++){
		let prod = products[i];
		cartItems +=`
			<div class="rounded-3 mb-4">
				<div class="card-body p-4">
					<div class="row d-flex justify-content-between align-items-center">
						<div class="col-md-2 col-lg-2 col-xl-2">
							<img src=${prod.image} class="img-fluid rounded-3" alt="${prod.name}">
						</div>
						<div class="col-md-3 col-lg-3 col-xl-3">
							<p class="lead fw-normal mb-2">${prod.name}</p>
							<p>${formatCurrency(prod.unitCost, prod.currency)}</p>
						</div>
						<div class="col-md-3 col-lg-3 col-xl-2 d-flex">
							<button class="btn btn-link px-2" onclick="setProductCount(${prod.id}, ${prod.count-1})">
								<i class="fas fa-minus"></i>
							</button>
							<p class="form-control form-control-sm bg-light text-center my-auto">${prod.count}</p>
							<button class="btn btn-link px-2" onclick="setProductCount(${prod.id}, ${prod.count+1})">
								<i class="fas fa-plus"></i>
							</button>
						</div>
						<div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
							<h5 class="mb-0">${formatCurrency(prod.count * prod.unitCost, prod.currency)}</h5>
						</div>
						<div class="col-md-1 col-lg-1 col-xl-1 text-end">
							<a href="#!" class="text-danger" onclick="removeFromCart(${prod.id})">
								<i class="fas fa-trash-alt fa-lg"></i>
							</a>
						</div>
					</div>
				</div>
			</div>
		`
	}

	// Full section body, cart items are inserted here
	html = `
		<div class="container h-100 py-5">
			<div class="row d-flex justify-content-center align-items-center h-100">
				<div class="col-10">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h3 class="fw-normal mb-0 w-100 text-black text-center">Tu carrito</h3>
					</div>
					${cartItems}
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h3 class="fw-normal mb-0 w-100 text-black text-center">Datos de envío</h3>
					</div>
					<div class="card mb-4">
						<div class="card-body p-4">
							<form action="#">
								<div class="form-outline">
									<h4>Tipo de envío</h4>
										<label class="form-label"><input class="mx-2" type="radio" name="shipping-type">Premium 2 a 5 días (15%)</label><br>
										<label class="form-label"><input class="mx-2" type="radio" name="shipping-type">Express 5 a 8 días (7%)</label><br>
										<label class="form-label"><input class="mx-2" type="radio" name="shipping-type">Standard 12 a 15 días (5%)</label><br>
								</div>
								<div class="form-outline row">
									<h4>Dirección de envío</h4>
										<label class="form-label">Calle<br><input class="form-control form-control-lg" type="text"></label>
										<label class="form-label">Número<br><input class="form-control form-control-lg" type="text"></label>
										<label class="form-label">Esquina<br><input class="form-control form-control-lg" type="text"></label>
									<div class="text-center">
										<input class="btn btn-outline-primary btn-lg" type="submit" value="Finalizar compra\n${formatCurrency(totalCost, 'UYU')}">
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
	return html;
}

document.addEventListener("DOMContentLoaded", async () => {

	exchangeRates = await getJSONData(BROUEXCHANGE_URL).then(json => json.data.rates);
	document.getElementById("cart-section").innerHTML = createCartSection(getCart(localStorage.getItem("loggedEmail")));
});