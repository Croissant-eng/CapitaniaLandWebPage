
const { db } = require('./Capitania_Admin/backend/config/database');

async function updateImageUrls() {
    try {
        console.log('Connecting to database...');

        // Test connection
        await db.execute('SELECT 1');
        console.log('Connected to database successfully');

        // Check current events with problematic URLs
        console.log('\nChecking events table...');
        const [events] = await db.execute(
            "SELECT id, titulo, imagen_url FROM eventos_especiales WHERE imagen_url LIKE 'http://localhost:3001/uploads/%'"
        );

        console.log(`Found ${events.length} events with problematic URLs`);
        events.forEach(event => {
            console.log(`  ID: ${event.id}, Titulo: ${event.titulo}, URL: ${event.imagen_url}`);
        });

        // Check current promociones with problematic URLs
        console.log('\nChecking promociones table...');
        const [promociones] = await db.execute(
            "SELECT id, nombre, imagen_url FROM promociones WHERE imagen_url LIKE 'http://localhost:3001/uploads/%'"
        );

        console.log(`Found ${promociones.length} promociones with problematic URLs`);
        promociones.forEach(promo => {
            console.log(`  ID: ${promo.id}, Nombre: ${promo.nombre}, URL: ${promo.imagen_url}`);
        });

        // Update events
        if (events.length > 0) {
            console.log('\nUpdating events...');
            for (const event of events) {
                const newUrl = event.imagen_url.replace('http://localhost:3001', '');
                await db.execute(
                    'UPDATE eventos_especiales SET imagen_url = ? WHERE id = ?',
                    [newUrl, event.id]
                );
                console.log(`Updated event ${event.id}: ${event.imagen_url} -> ${newUrl}`);
            }
        }

        // Update promociones
        if (promociones.length > 0) {
            console.log('\nUpdating promociones...');
            for (const promo of promociones) {
                const newUrl = promo.imagen_url.replace('http://localhost:3001', '');
                await db.execute(
                    'UPDATE promociones SET imagen_url = ? WHERE id = ?',
                    [newUrl, promo.id]
                );
                console.log(`Updated promocion ${promo.id}: ${promo.imagen_url} -> ${newUrl}`);
            }
        }

        console.log('\nUpdate completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    }
}

updateImageUrls();