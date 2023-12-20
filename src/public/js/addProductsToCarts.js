document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', function () {
        const pid = this.dataset.productId;
        const userId = this.dataset.userId;

        // Add the product to the cart
        fetch(`/api/carts/${userId}/products/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 1 }),
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
