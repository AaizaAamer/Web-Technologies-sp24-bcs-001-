
let menuBtn = document.getElementById("menuBtn");
let subnavbar = document.getElementById("mobile-subnavbar-items");
function toggleMenu() {
    if (subnavbar.style.display === "block") {
        subnavbar.style.display = "none";
    } else {
        subnavbar.style.display = "block";
    }
}

//mid lad code addition
$(document).ready(function () {

    $.ajax({
        url: "https://fakestoreapi.com/products?limit=4",
        method: "GET",
        success: function (data) {
            $("#featuredContainer").empty();

            data.forEach(product => {
                $("#featuredContainer").append(`
                    <div class="productCard">
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>$${product.price}</p>
                        <button class="quickViewBtn"
                            data-title="${product.title}"
                            data-image="${product.image}"
                            data-price="${product.price}"
                            data-description="${product.description}"
                            data-rating="${product.rating.rate}">
                            Quick View
                        </button>
                    </div>
                `);
            });
        },
        error: () => $("#featuredContainer").html("<p>Products not loaded</p>")
    });

    $(document).on("click", ".quickViewBtn", function () {
        const btn = $(this);
        $("#modalTitle").text(btn.data("title"));
        $("#modalImage").attr("src", btn.data("image"));
        $("#modalPrice").text("Price: $" + btn.data("price"));
        $("#modalDescription").text(btn.data("description"));
        $("#modalRating").text("Rating: " + btn.data("rating"));
        $("#productModal").css("display", "flex");
    });

    $("#closeModal").click(() => $("#productModal").hide());

    $(window).click(e => {
        if ($(e.target).is("#productModal")) $("#productModal").hide();
    });

});
