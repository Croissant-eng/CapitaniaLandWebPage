const mysql = require('mysql2');

// Configuración de conexión con los valores típicos de XAMPP
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'capitania_db'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    console.log('Connected to database successfully');

    // Check events table
    connection.query("SELECT id, titulo, imagen_url FROM eventos_especiales LIMIT 5",
        function (error, results, fields) {
            if (error) {
                console.error('Error querying events:', error);
                return;
            }

            console.log('Events table contents:');
            results.forEach(event => {
                console.log(`ID: ${event.id}, Titulo: ${event.titulo}, URL: ${event.imagen_url}`);
            });

            // Check promociones table
            connection.query("SELECT id, nombre, imagen_url FROM promociones LIMIT 5",
                function (error2, results2, fields2) {
                    if (error2) {
                        console.error('Error querying promociones:', error2);
                        return;
                    }

                    console.log('\nPromociones table contents:');
                    results2.forEach(promo => {
                        console.log(`ID: ${promo.id}, Nombre: ${promo.nombre}, URL: ${promo.imagen_url}`);
                    });

                    connection.end();
                });
        });
});