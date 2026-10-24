<?php
/* Creamos la API para cargar los productos al iniciar la app
Para ello, movemos la carpeta del proyecto
a la carpeta xampp/htdocs y levantamos el servidor Apache en XAMPP.
Después accedemos al navegador a http://localhost/agoodshop/agoodshop_AriadnaFriasDiaz_DAW/
*/
header('Content-Type: application/json; charset=utf-8');
?>
{
    "moneda":"EUR",
    "productos":[
        {
            "id": "1111111111",
            "nombre": "Auriculares inalámbricos",
            "precio": "100.50"
        },
         {
            "id": "2222222222",
            "nombre": "Memoria USB 64GB",
            "precio": "32.65"
        },
        {
            "id": "3333333333",
            "nombre": "Batería externa",
            "precio": "67.89"
        },
        {
            "id": "4444444444",
            "nombre": "Samsung W210",
            "precio": "1089.90"
        }
    ]
}