document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', function () {
        const pid = this.dataset.productId;

        fetch(`/cart/products/${pid}`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Product added:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
