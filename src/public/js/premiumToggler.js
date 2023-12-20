console.log('Script loaded');

document.addEventListener('DOMContentLoaded', (event) => {
    document
        .getElementById('premium-form')
        .addEventListener('submit', function (event) {
            event.preventDefault();
            const isPremium = document.getElementById('premium').checked;
            fetch('/api/sessions/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ premium: isPremium }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
});
