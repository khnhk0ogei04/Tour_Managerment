
const sliderMain = document.querySelector(".sliderMain");
if (sliderMain){
    // console.log("OKE");
    const swiper = new Swiper(".sliderMain", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: '.swiper-button-prev',
        }
    });
}
// Alert-add-cart-success:
const alertAddCartSuccess = () => {
    const elementAlert = document.querySelector("[alert-add-cart-success]");
    if (elementAlert){
        elementAlert.classList.remove("alert-hidden");
        setTimeout(() => {
            console.log("OKEE");
            elementAlert.classList.add("alert-hidden");
        }, 3000);
    }
}

const showMiniCart = () => {
    const miniCart = document.querySelector("[mini-cart]");
    if (miniCart){
        const cart = JSON.parse(localStorage.getItem("cart"));
        miniCart.innerHTML = cart.length;
    }
}
showMiniCart();

const cart = localStorage.getItem("cart");
if (!cart){
    localStorage.setItem("cart", JSON.stringify([]));
}
// Them tour vao gio hang
const formAddToCart = document.querySelector("[form-add-to-cart]");
if (formAddToCart){
    formAddToCart.addEventListener("submit", (event) => {
        event.preventDefault();
        const quantity = parseInt(formAddToCart.quantity.value);
        const tourId = parseInt(formAddToCart.getAttribute("tour-id"));
        if (quantity > 0 && tourId) {
            const cart = JSON.parse(localStorage.getItem("cart"));
            const indexExistTour = cart.findIndex(item => item.tourId == tourId);
            if (indexExistTour == -1){
                cart.push({
                    tourId: tourId,
                    quantity: quantity
                })
            } else {
                cart[indexExistTour].quantity = cart[indexExistTour].quantity + quantity;
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            showMiniCart();
            alertAddCartSuccess();
        }
    });
}

// Hàm vẽ giỏ hàng

const drawCart = () => {
const tableCart = document.querySelector("[table-cart]");
if (tableCart){
    fetch("/cart/list-json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: localStorage.getItem("cart")
    })
    .then(res => res.json())
    .then(data => {
        const htmlArray = data.cart.map((item, index) => (
            `
            <tr>
            <td>${index+1}</td>
            <td>
              <img 
                src="${item.infoTour.image}" 
                alt="${item.infoTour.title}" 
                width="80px"
              >
            </td>
            <td>
              <a href="/tours/detail/${item.infoTour.slug}">
                ${item.infoTour.title}
              </a>
            </td>
            <td>${item.infoTour.price_special.toLocaleString()}đ</td>
            <td>
              <input 
                type="number" 
                name="quantity" 
                value="${item.quantity}" 
                min="1" 
                item-id="${item.id}" 
                style="width: 60px"
              >
            </td>
            <td>${item.infoTour.total.toLocaleString()}đ</td>
            <td>
              <button 
                class="btn btn-sm btn-danger" 
                btn-delete="${item.tourId}"
              >
                Xóa
              </button>
            </td>
          </tr>           
            `
        ));
        const tbody = tableCart.querySelector("tbody");
        tbody.innerHTML = htmlArray.join("");

        const elementTotalPrice = document.querySelector("[total-price]");
        if (elementTotalPrice){
            elementTotalPrice.innerHTML = data.total.toLocaleString();
        }
        deleteItemInCart();
        updateQuantityInCart();
        showMiniCart();
    })
}
}


// Xóa sản phẩm trong giỏ hàng
const deleteItemInCart = () => {
    const listBtnDelete = document.querySelectorAll("[btn-delete]");
    if(listBtnDelete.length > 0) {
      listBtnDelete.forEach(button => {
        button.addEventListener("click", () => {
          const tourId = button.getAttribute("btn-delete");
          const cart = JSON.parse(localStorage.getItem("cart"));
          const newCart = cart.filter(item => item.tourId != tourId);
          localStorage.setItem("cart", JSON.stringify(newCart));
            
          drawCart();
        })
      })
    }
  }
  // Hết Xóa sản phẩm trong giỏ hàng
  
/// Cập nhật số lượng trong giỏ hàng
const updateQuantityInCart = () => {
    const listInputQuantity = document.querySelectorAll("input[name='quantity']");
    if(listInputQuantity.length > 0) {
      listInputQuantity.forEach(input => {
        input.addEventListener("change", () => {
          const quantity = parseInt(input.value);
          const tourId = input.getAttribute("item-id");
  
          const cart = JSON.parse(localStorage.getItem("cart"));
          const tourUpdate = cart.find(item => item.tourId == tourId);
          if(tourUpdate) {
            tourUpdate.quantity = quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            drawCart();
          }
        })
      });
    }
  }
  // Hết Cập nhật số lượng trong giỏ hàng
  // Hiển thị data ra giỏ hàng
drawCart();
// Hết Hiển thị data ra giỏ hàng

// Đặt tour
const formOrder = document.querySelector("[form-order]");
if(formOrder) {
  formOrder.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = formOrder.fullName.value;
    const phone = formOrder.phone.value;
    const note = formOrder.note.value;

    const cart = JSON.parse(localStorage.getItem("cart"));

    const dataFinal = {
      info: {
        fullName: fullName,
        phone: phone,
        note: note
      },
      cart: cart
    };

    fetch("/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataFinal)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code == 200){
            localStorage.setItem("cart", JSON.stringify([]));
            window.location.href = `/order/success?orderCode=${data.orderCode}`;
        } else {
            alert("Đặt hàng thất bại")
        }
      })
  })
}
// Hết Đặt tour