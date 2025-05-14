document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 300);
  });

  const searchBox = document.querySelector('.search');
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      alert('Search feature is a placeholder for now.');
    });
  }
});
