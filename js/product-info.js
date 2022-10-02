let productScore = 0;
let productComments = [];
let commentRate = 0;

const cardStyle = {
	CARD_RELATED:	0,
	CARD_BUY:		1,
};

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
};

function formatUsername(str){
	if(!str || str.includes('@')){return str;} // Do not apply formatting to null strings or emails

	let resultStr = '';
	for(let token of str.split('_')){
		token = token.charAt(0).toUpperCase() + token.slice(1);
		resultStr += " "+token;
	}
	return resultStr;
};

function sendComment(){
	let comments = [];
	let comment = {
		"user": "",
		"description": "",
		"score": "",
		"dateTime": "",
	};

	// Get comment data
	let prodID = localStorage.getItem("prodID");
	comment.user = localStorage.getItem("loggedEmail");
	comment.description = document.getElementById("comment-box").value;
	document.getElementById("comment-box").value = ""; // Clear textarea
	comment.score = document.getElementById("comment-rate-input").value;
	document.getElementById("comment-rate-input").value = 0;
	comment.dateTime = new Date().toISOString().split('T')[0] +" "+ new Date().toLocaleTimeString();

	if(!comment.description){return;};
	comments = JSON.parse(localStorage.getItem("comments-"+prodID));
	if(!comments){comments = []};
	
	// Add comment and update comments-section
	comments.push(comment);
	localStorage.setItem("comments-"+prodID, JSON.stringify(comments));
	document.getElementById("comments-section").innerHTML = createCommentsSection();
}

function generateScoreStars(score){
	let element = document.createElement("div");
	for(let i=0; i<5; i++){
		let star = document.createElement("span");
		star.className = `${i<score ? "fa checked" : "far"} fa-star `;
		element.appendChild(star);
	}
	return element.innerHTML;
}

function createCommentsSection(){
	let localStorageComments = JSON.parse(localStorage.getItem("comments-"+localStorage.getItem("prodID")));
	let comments = productComments.concat(localStorageComments);
	let commentsHtml = "";
	let scoreCount = 0;
	
	comments.sort(function(a, b) {
		if(a == null || b == null){return 0;}
		var dateA = new Date(a.dateTime);
		var dateB = new Date(b.dateTime);
		return dateB-dateA;
	});

	for(let i=0; i<comments.length; i++){
		let comment = comments[i];

		if(!comment){continue;}
		productScore+=comment.score;
		scoreCount++;
		
		commentsHtml +=  `
		<div class="d-flex row w-auto container">
			<small class="text-muted">${comment.dateTime}</small>
			<div class="d-flex row justify-content-between">
				<h5 class="">${formatUsername(comment.user)}</h5>
				<p>${generateScoreStars(comment.score)}</p>
			</div>
			
			<div class="">
				<p>${comment.description}</p>
			</div>
			<hr>
		</div>
	`;
	}
	
	productScore /= scoreCount; //Calculate average score
	Math.round(productScore);
	return commentsHtml;
};

function createProductCard(product, style){
	let previewCard = false; // Used to decide whether to create a preview card or a buy card
	let htmlContentToAppend = "";

	if(style == cardStyle.CARD_RELATED){
		previewCard = true;
		buyBtn = "";
	}else if(style=cardStyle.CARD_BUY){
		previewCard = false;
	}

	if(previewCard){
		let imageSection = `<img class="d-block img-thumbnail w-auto" src=${product.images[0]} alt=${product.category}>`;
		let infoSection = `
			<div class="lead m-3 justify-content-between col">
				<h1 class="">${product.name}</h1>
				<div class="px-5 row ">
					<div class="col">
						<h3 class="text-muted">${product.currency+" "+formatCurrency(product.cost, product.currency)}</h3>
					</div>
				</div>
			</div>
		`;
		htmlContentToAppend += `
		<div class="p-3 w-50 container list-group-item-action cursor-active" onclick="setProdID(${product.id})">
			<div class="col">
					${imageSection}
					${infoSection}
			</div>
		</div>
		`;
	}
	else{
		let carouselImages = "";
		let active = "";
		for(let i=0; i<product.images.length; i++){
			active = i==0 ? "active":"";
			carouselImages += `
				<div class="carousel-item ${active}">
					<img class="d-block w-100 img-thumbnail" src=${product.images[i]} alt=${product.category}>
				</div>
			`
		}
		let imageSection = `
		<div class="col text-center ">
			<div id="carousel-images" class="carousel slide" data-bs-ride="carousel">
				<div class="carousel-inner">
					${carouselImages}
				</div>
				<button class="carousel-control-prev" type="button" data-bs-target="#carousel-images" data-bs-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="visually-hidden">Previous</span>
				</button>
				<button class="carousel-control-next" type="button" data-bs-target="#carousel-images" data-bs-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="visually-hidden">Next</span>
				</button>
			</div>
		</div>
	`;
		let infoSection = `
			<div class="lead m-3 justify-content-between col">
				<h1 class="">${product.name}</h1>
				<p class="text-muted">Valoración ${generateScoreStars(productScore)}</p>
				<p class="py-2 pb-5">${product.description}</p>
				<div class="px-5 row text-end ">
					<div class="col">
						<h3 class="text-muted">${product.currency+" "+formatCurrency(product.cost, product.currency)}</h3>
						<p>${product.soldCount} vendidos</p>
					</div>
					<button class="d-inline-block btn btn-primary w-auto h-100 p-4 mx-4 ">
						<i class="fa fa-lg fa-shopping-cart m-1"></i>	
						Añadir al carrito
					</button>							
				</div>
			</div>
		`;
		htmlContentToAppend += `
		<div class="container">
			<div class="row">
					${imageSection}
					${infoSection}
			</div>
		</div>
		`;
	}
		
	return htmlContentToAppend;
};

document.addEventListener("DOMContentLoaded", e => {
	getJSONData(PRODUCT_INFO_URL + localStorage.getItem("prodID") + ".json").then(result =>{
		if (result.status === "ok"){
			let product = result.data;
			// Get product comments
			getJSONData(PRODUCT_INFO_COMMENTS_URL+localStorage.getItem("prodID")+".json").then(result =>{
				if(result.status === "ok"){
					
					productComments = result.data; // Used internally by createCommentsSection()
					document.getElementById("comments-section").innerHTML = createCommentsSection();
					
					// Called after comments because we need product score to be calculated first
					document.getElementById("product-section").innerHTML += createProductCard(product, cardStyle.CARD_BUY);
				}
			});

			// Get related products list
			for(relatedProd of result.data.relatedProducts){
				getJSONData(PRODUCT_INFO_URL+relatedProd.id+".json").then(result =>{
					if (result.status === "ok"){
						document.getElementById("related-products-section").innerHTML += createProductCard(result.data, cardStyle.CARD_RELATED);
					}
				});
			}
        }
		
	});
});