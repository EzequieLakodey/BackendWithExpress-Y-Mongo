document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', function () {
        const pid = this.dataset.productId;

        fetch(`api/carts/products/${pid}`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                'Product added:', data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
