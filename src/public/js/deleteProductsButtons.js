document.querySelectorAll('.delete-product').forEach((button) => {
    button.addEventListener('click', function () {
        fetch(`/api/products/${this.dataset.id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert('Product deleted successfully');
                    location.reload();
                }
            })
            .catch((error) => {
                alert(`Error: ${error}`);
            });
    });
});
