var dataCart = [];
fetchRequest(`${URL}/carts`, "get")
  .then(function (res) {
    dataCart = res;
    renderCart();
  })
  .finally(function () {});

function renderCart() {
  var cartBody = $("cart-body");

  var cartBodyHtml = dataCart.map(function (item, index) {
    const { title, number, price } = item;
    return `
        <tr>
          <td>${title}</td>
          <td><button class='minus' data-index=${index}>-</button>
          <button>${number}</button>
          <button class='add' data-index=${index}>+</button></td>
          <td>${price}$</td>
          <td>${number * price}$</td>
          <td><button data-index=${index} class='delete'>X</button></td>
        </tr>
    `;
  });
  cartBody.innerHTML = cartBodyHtml.join("");

  const minusButton = document.getElementsByClassName("minus");
  for (let index = 0; index < minusButton.length; index++) {
    minusButton[index].onclick = handleMinusCart;
  }

  const addButton = document.getElementsByClassName("add");
  for (let index = 0; index < addButton.length; index++) {
    addButton[index].onclick = handleAddCart;
  }

  const deleteButton = document.getElementsByClassName("delete");
  for (let index = 0; index < deleteButton.length; index++) {
    deleteButton[index].onclick = handleDeleteCart;
  }
}

const handleMinusCart = (e) => {
  const indexCart = e.target.getAttribute("data-index");
  const cart = { ...dataCart[indexCart] };

  if (cart.number === 1) {
    fetchRequest(`${URL}/carts/${cart.id}`, "delete")
      .then(() => {
        fetchRequest(`${URL}/carts`, "get")
          .then(function (res) {
            dataCart = res;
            renderCart();
          })
          .finally(function () {});
      })
      .finally(function () {});
  } else {
    fetchRequest(`${URL}/carts/${cart.id}`, "patch", {
      number: cart.number - 1,
    })
      .then(() => {
        fetchRequest(`${URL}/carts`, "get")
          .then(function (res) {
            dataCart = res;
            renderCart();
          })
          .finally(function () {});
      })
      .finally(function () {});
  }
};
const handleAddCart = (e) => {
  const indexCart = e.target.getAttribute("data-index");
  console.log(indexCart);
};

const handleDeleteCart = (e) => {
  const index = e.target.getAttribute("data-index");
  const cart = dataCart[index];
  fetchRequest(`${URL}/carts/${cart.id}`, "delete")
    .then(() => {
      fetchRequest(`${URL}/carts`, "get")
        .then(function (res) {
          dataCart = res;
          renderCart();
        })
        .finally(function () {});
    })
    .finally(function () {});
};
