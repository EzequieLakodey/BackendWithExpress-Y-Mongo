document.getElementById('purchase-button').addEventListener('click', async () => {
    const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include the user's token in the 'Authorization' header if you're using token-based authentication
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (response.ok) {
        alert('Purchase successful');
        location.reload();
    } else {
        alert('Purchase failed');
    }
});
