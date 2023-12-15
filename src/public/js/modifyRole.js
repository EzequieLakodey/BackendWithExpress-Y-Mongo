document.querySelectorAll('.delete-user').forEach((button) => {
    button.addEventListener('click', async (event) => {
        const userId = event.target.dataset.id;
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        window.location.reload();
    });
});

document.querySelectorAll('.role-select').forEach((select) => {
    select.addEventListener('change', async (event) => {
        const userId = event.target.dataset.id;
        const newRole = event.target.value;
        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
        });
        window.location.reload();
    });
});
