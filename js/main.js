// Cargar componentes dinámicamente
document.addEventListener('DOMContentLoaded', function() {
    // Array de componentes a cargar
    const components = [
        { id: 'header', file: 'components/header.html' },
        { id: 'hero', file: 'components/hero.html' },
        { id: 'features', file: 'components/features.html' },
        { id: 'how-it-works', file: 'components/how-it-works.html' },
        { id: 'services', file: 'components/services.html' },
        { id: 'cta', file: 'components/cta.html' },
        { id: 'footer', file: 'components/footer.html' }
    ];

    // Cargar cada componente
    components.forEach(component => {
        fetch(component.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error cargando ${component.file}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(component.id).innerHTML = data;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById(component.id).innerHTML = '<p>Error cargando el componente</p>';
            });
    });
});

// Navegación suave
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});