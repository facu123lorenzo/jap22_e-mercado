function showProductsList(productsArray){
	let htmlContentToAppend = "";
    for(let i = 0; i < productsArray.length; i++){
        let product = productsArray[i];

		htmlContentToAppend += `
		<div class="list-group-item list-group-item-action cursor-active">
			<div class="row">
				<div class="col-3">
					<img src="${product.image}" alt="${product.description}" class="img-thumbnail">
				</div>
				<div class="col">
					<div class="d-flex w-100 justify-content-between">
						<h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
						<small class="text-muted">${product.soldCount} vendidos</small>
					</div>
					<p class="mb-1">${product.description}</p>
				</div>
			</div>
		</div>`
	}
	document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function(){
	getJSONData(PRODUCTS_URL + "101.json").then(result =>{
		if (result.status === "ok"){
            showProductsList(result.data.products);
        }
	})
});