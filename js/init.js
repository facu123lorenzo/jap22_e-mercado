const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const BROUEXCHANGE_URL = "https://cotizaciones-brou.herokuapp.com/api/currency/latest";

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_ASC_BY_COST = "CostAsc.";
const ORDER_DESC_BY_COST = "CostDesc.";
const ORDER_BY_PROD_COUNT = "Cant.";
const ORDER_BY_SOLD_COUNT = "Sold.";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = async function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function formatCurrency(cost, currency){
	let str = currency+" ";
	if(currency == 'USD'){
		str += Number(cost).toLocaleString('en');
	}else{
		str += Number(cost).toLocaleString('uy');
	}
	return str;
}

/**
* Load the predefined product into the local
* cart if not already present.
*/
 async function fetchUserCart(){
	fetch(CART_INFO_URL+"25801.json").then(res => res.json())
	.then(json =>{
		let username = localStorage.getItem("loggedEmail");

		let localArticles = getCart(username);
		if(!localArticles || localArticles.length <= 0){
			// Local cart is empty, just save this article and skip verifications
			setCart(username, json.articles);
			return;
		}

		// Skip when the fetched article is already in the storage
		let article = null;
		article = localArticles.find(function(art){
			return art.id == json.articles[0].id;
		});
		if(article){
			return;
		}

		// Save the article in the local cart
		localArticles.push(json.articles[0]);
		setCart(username, localArticles);
	})
	.catch(error => console.log(error));
}

async function login(username){
	localStorage.setItem("loggedEmail", username);
	await fetchUserCart();
	window.location.href = "./main.html";
}

function logout(){
	window.location.href = "./index.html";
	localStorage.removeItem("loggedEmail");
}

function getCart(username){
	return JSON.parse(localStorage.getItem("cart-"+username));
}

function setCart(username, productsJSON){
	localStorage.setItem("cart-"+username, JSON.stringify(productsJSON));
}