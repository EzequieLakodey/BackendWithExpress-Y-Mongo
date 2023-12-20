document.querySelectorAll('.delete-user').forEach((button) => {
    button.addEventListener('click', async (event) => {
        const userId = event.target.closest('.delete-user').dataset.id;
        console.log(`Deleting user with ID: ${userId}`);
        await fetch(`/api/sessions/users/${userId}`, { method: 'DELETE' });
        window.location.reload();
    });
});

document.querySelectorAll('.role-select').forEach((select) => {
    select.addEventListener('change', async (event) => {
        const userId = event.target.dataset.id;
        const newRole = event.target.value;
        console.log(`Changing role of user with ID: ${userId} to ${newRole}`);
        await fetch(`/api/sessions/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
            credentials: 'include',
        });

        window.location.reload();
    });
});
