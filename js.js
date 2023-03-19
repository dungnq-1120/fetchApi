var loading = $("loading");
var pagination = {
  _limit: 5,
};
var product = [];
var carts = [];

showLoading();
fetchRequest(`${URL}/products?_limit=${pagination._limit}`, "get")
  .then(function (res) {
    renderProduct(res.data);
    product = res.data;
    pagination = res.pagination;
    renderPagination(pagination);
  })
  .finally(function () {
    hideLoading();
  });
fetchRequest(`${URL}/carts`, "get")
  .then(function (res) {
    carts = res;
    renderNumberCart();
  })
  .finally(function () {
    hideLoading();
  });

function renderProduct(data) {
  productsHtml = data.map(function (item, index) {
    const { title, image, price } = item;
    return `<div class='card m-2' style='width: 18rem'>
              <img
                src='${image}'
                class='card-img-top'
                alt='...'
              />
              <div class='card-body'>
                <h5 class='card-title'>${title}</h5>
                <h5 class='Price'>${price}$</h5>
                <p class='card-text'>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </p>
                <button class='btn btn-primary add-to-card' data-index='${index}'>Add to cart</button>
              </div>
            </div>`;
  });

  $("product-list").innerHTML = productsHtml.join("");

  var buttonAddToCarts = document.getElementsByClassName("add-to-card");
  for (let index = 0; index < buttonAddToCarts.length; index++) {
    buttonAddToCarts[index].onclick = handleAddToCart;
  }
}

function handleAddToCart(e) {
  e.preventDefault();

  // lay duoc index product ma ban muon add
  const indexProduct = this.getAttribute("data-index");
  let cart = { ...product[indexProduct] };

  //check xem product nay da co trong carts hay chua
  const indexCart = (carts || []).findIndex(
    (item) => item.idProduct === cart.id
  );
  if (indexCart === -1) {
    cart = {
      ...cart,
      number: 1,
      idProduct: cart.id,
      id: null,
    };

    showLoading();
    fetchRequest(`${URL}/carts?`, "post", cart)
      .then((res) => alert("ban da them sp thanh cong"))
      .catch((error) => alert(error))
      .finally(() => hideLoading());

    carts.push(cart);
  } else {
    fetchRequest(`${URL}/carts/${carts[indexCart].id}`, "patch", {
      number: carts[indexCart].number + 1,
    })
      .then((res) => alert("ban da them sp thanh cong"))
      .catch((error) => alert(error))
      .finally(() => hideLoading());

    carts[indexCart] = {
      ...carts[indexCart],
      number: carts[indexCart].number + 1,
    };
  }
  renderNumberCart();
}

function renderPagination(data) {
  var totalPage = Math.ceil(data._totalRows / data._limit);
  paginationHtml = [];

  for (let index = 1; index <= totalPage; index++) {
    paginationHtml.push(
      `<li class="page-item"><button class="page-link" href="#" data-page=${index}>${index}</button></li>`
    );
  }

  $("pagination").innerHTML = paginationHtml.join("");

  var paginationLinks = document.getElementsByClassName("page-link") || [];

  for (let index = 0; index < paginationLinks.length; index++) {
    paginationLinks[index].onclick = handleChangePage;
  }
}

function handleChangePage() {
  var page = this.getAttribute("data-page");
  fetchRequest(
    `${URL}/products?_limit=${pagination._limit}&_page=${page}`,
    "get"
  )
    .then(function (res) {
      renderProduct(res.data);
      pagination = res.pagination;
      renderPagination(pagination);
    })
    .finally(function () {
      hideLoading();
    });
}

function showLoading() {
  loading.setAttribute("class", "lds-facebook");
}

function hideLoading() {
  loading.setAttribute("class", "hide");
}

// search
$("search-btn").onclick = handleSearchProduct;

function handleSearchProduct(e) {
  e.preventDefault();
}
// sort
$("sort").onchange = handleSortProduct;

function handleSortProduct(e) {
  e.preventDefault();

  var sort = this.value;
  showLoading();
  fetchRequest(
    `${URL}/products?_sort=price&_order=${sort}&_limit=${pagination._limit}`,
    "get"
  )
    .then(function (data) {
      renderProduct(data.data);
      renderPagination(data.pagination);
    })
    .finally(function () {
      hideLoading();
    });
}

const renderNumberCart = () => {
  $("number-cart").innerText = carts.length;
};
