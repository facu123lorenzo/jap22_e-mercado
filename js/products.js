let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let searchText = "";

function showLead(catName){
	let leadContainer = document.getElementById("lead-container");
	leadContainer.innerHTML = `
		<h2>Productos</h2>
			<p class="lead">Verás aquí todos los productos de la categoría ${catName}</p>
		`
}

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showProductsList(){
	let htmlContentToAppend = "";

	for(let i = 0; i < currentProductsArray.length; i++){
		let product = currentProductsArray[i];
		if (
			((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
			((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount)) &&
			((searchText == "") || (product.name.toLowerCase().includes(searchText) || product.description.toLowerCase().includes(searchText)))
			){
			htmlContentToAppend += `
				<div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
					<div class="row">
						<div class="col-3">
							<img src="${product.image}" alt="${product.description}" class="img-thumbnail">
						</div>
						<div class="col">
							<div class="d-flex w-100 justify-content-between">
								<h4 class="mb-1">${product.name} - ${formatCurrency(product.cost, product.currency)}</h4>
								<small class="text-muted">${product.soldCount} vendidos</small>
							</div>
							<p class="mb-1">${product.description}</p>
						</div>
					</div>
				</div>
			`
		}
	}
	if(htmlContentToAppend == ""){
		htmlContentToAppend = `
			<div class="mt-5 list-group-item list-group-item-action cursor-active w-100 text-center ">
				<div class="d-flex row container justify-content-between">
					<div class="col">
						<div id="alertBox" class="" role="alert">No hay productos que coincidan con este criterio</div>
					</div>
				</div>
			</div>
		`
	}
	document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}

document.addEventListener("DOMContentLoaded", function(){	

	let catId = localStorage.getItem('catID');
	getJSONData(PRODUCTS_URL + catId + ".json").then(result =>{
		if (result.status === "ok"){
			showLead(result.data.catName);
			currentProductsArray = result.data.products;
            sortAndShowProducts(ORDER_ASC_BY_COST);
        }
	});


	//Sorting and filtering functionality
	document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList();
    });

	document.getElementById("productSearchBar").addEventListener("input", e =>{
		let inputStr = e.target.value;
		searchText = e.target.value.toLowerCase();
		showProductsList();
	});
});