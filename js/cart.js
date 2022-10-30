let exchangeRates = null;
let subTotalCost = 0;
let shippingCost = 0;



function setProductCount(prodId, val){
	if(!prodId || val < 1) return;

	let username = localStorage.getItem("loggedEmail");
	let cart = getCart(username);
	if(!cart) return;
	let index = cart.findIndex(function(art){
		return art.id == prodId;
	})
	
	cart[index].count = val;
	setCart(username, cart);
	document.getElementById("cart-section").innerHTML = createCartSection();
	updateCost();
}

function removeFromCart(prodId){
	let index = null;
	let cart = getCart(localStorage.getItem("loggedEmail"));
	index = cart.findIndex(prod => (prod.id == prodId));
	if(index < 0) return;

	cart.splice(index, 1);
	setCart(localStorage.getItem("loggedEmail"), cart);
	document.getElementById("cart-section").innerHTML = createCartSection();
	updateCost();
}

function clearCart(){
	localStorage.removeItem("cart-"+localStorage.getItem("loggedEmail"));
}

function createCartSection(){
	let cartItems = "";
	let html = "";
	// Get current cart
	let products = getCart(localStorage.getItem("loggedEmail"));

	// Convert UYU to USD
	subTotalCost = 0;
	for(let i = 0; i<products.length; i++){
		let product = products[i];
		let productCost = product.unitCost*product.count;
		if(product.currency == "UYU"){
			productCost /= exchangeRates.USD.sell;
		}
		subTotalCost += productCost;
	}
	// If cart is empty create an alert and return
	if(!products || products.length <= 0){
		let checkoutPageElement = document.getElementById("checkout-page");
		checkoutPageElement.innerHTML = `
			<div class="mt-5 card w-100 text-center ">
				<div class="container p-4">
					<div id="alertBox" class="row " role="alert">
						<h3>Tu carrito está vacío</p3>
					</div>
					<a class="btn btn-primary mx-3 mt-4" href="./categories.html">¡Comienza a llenarlo ahora mismo!</a>
				</div>
			</div>
		`
		return;
	}

	// Create a row for each cart item and calc costs
	subTotalCost = 0;
	for(let i = 0; i<products.length; i++){
		let prod = products[i];

		//Convert prices to USD for use in SubTotal and Total;
		let productCost = prod.unitCost*prod.count;
		if(prod.currency == "UYU"){
			productCost /= exchangeRates.USD.sell;
		}
		subTotalCost += productCost;

		// Create cart item
		html +=`
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
	return html;
}

function updateCost(){
	let form = document.getElementById("cart-form");
	let subTotalCostElement = document.getElementById("cart-subtotal");
	let shippingCostElement = document.getElementById("cart-shipping-cost");
	let totalCostElement = document.getElementById("cart-total-cost");
	let totalCostBtn = document.getElementById("cart-pay-btn");
	// Calc shipping cost
	shippingCost = 0;
	for(radio of form.shipping){
		if(radio.checked){
			shippingCost = subTotalCost * parseFloat(radio.getAttribute("data-value"));
			subTotalCostElement.innerHTML = "Sub total: "+ formatCurrency(subTotalCost, "USD");
			shippingCostElement.innerHTML = "Envío: "+ formatCurrency(shippingCost, "USD");
			totalCostBtn.innerHTML = "Confirmar compra<br>Total: "+formatCurrency(subTotalCost+shippingCost, "USD");
			totalCostElement.innerHTML = "<b>Total: "+formatCurrency(subTotalCost+shippingCost, "USD")+"</b>";
			break;
		}
	}
}
function setInputsState(inputs, state){
	for(element of inputs){
		if(element.localName == "input"){
			element.disabled = !state;
		}
	}
}

function setRequired(elements, bool){
	for(let element of elements){
		element.required = bool;
	}
}

function updatePaymentModal(){
	let cardTab = document.getElementById("payment-radio-card");
	let bankTab = document.getElementById("payment-radio-bank");
	let cardDataContainer = document.getElementById("card-data-container");
	let bankDataContainer = document.getElementById("bank-data-container");
	if(cardTab.checked){
		setInputsState(cardDataContainer.children, true);
		cardDataContainer.classList.remove("d-none");
		setInputsState(bankDataContainer.children, false);
		bankDataContainer.classList.add("d-none");
		
	}else if(bankTab.checked){
		setInputsState(cardDataContainer.children, false);
		cardDataContainer.classList.add("d-none");
		setInputsState(bankDataContainer.children, true);
		bankDataContainer.classList.remove("d-none");
	}
}

function validateShippingInfo(form){
	form.classList.add('was-validated');
	for(input of form.address){
		input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
		if(!input.checkValidity()){
			return false;
		}
	}
	return true;
}

function validatePaymentInfo(form){
	let cardTab = document.getElementById("payment-radio-card");
	let inputs = cardTab.checked ? form['card-data'] : [form['bank-data']];
	
	setRequired(form['card-data'], false);
	setRequired([form['bank-data']], false);
	setRequired(inputs, true);
	form.classList.add('was-validated');
	for(input of inputs){
		input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
		if(!input.checkValidity()){
			return false;
		}
	}
	return true;
}

document.addEventListener("DOMContentLoaded", async () => {
	let formElement = document.getElementById("cart-form");
	exchangeRates = await getJSONData(BROUEXCHANGE_URL).then(json => json.data.rates);
	document.getElementById("cart-section").innerHTML = createCartSection();
	updateCost();
	updatePaymentModal();
	formElement.addEventListener("change", () =>{
		updateCost();
		updatePaymentModal();
	});

	// Modal functionality
	document.getElementById("payment-modal-button").addEventListener("click", ()=>{
		let modal = $("#payment-modal");
		if(validateShippingInfo(formElement)){
			modal.modal('toggle');
			formElement.classList.remove("was-validated");
		}
	});

	document.getElementById("cart-pay-btn").addEventListener("click", (e) =>{
		if(validatePaymentInfo(formElement)){
			let checkoutPageElement = document.getElementById("checkout-page");
			let modal = $("#payment-modal");
			modal.modal("hide");
			clearCart();
			checkoutPageElement.innerHTML = `
				<div class="mt-5 card w-100 text-center">
					<div class="container p-4">
						<div id="alertBox" class="row" role="alert">
							<h3>¡Felicidades, tu compra se ha completado con éxito!</p3>
						</div>
						<a class="btn btn-primary mx-3 mt-4" href="./main.html">Volver al inicio</a>
					</div>
				</div>
			`
		}
	});

	let cardTab = document.getElementById("payment-radio-card").addEventListener("change", () => {
		formElement.classList.remove("was-validated");
	});

	let bankTab = document.getElementById("payment-radio-bank").addEventListener("change", () => {
		formElement.classList.remove("was-validated");
	});
});
