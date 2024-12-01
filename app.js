const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Página principal
app.get("/", (req, res) => {
    res.render("index");
});

// Ruta para la conversión de MP3
app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoID;

    // Validación de videoId
    if (!videoId || videoId.trim() === "") {
        return res.render("index", { 
            success: false, 
            message: "Por favor, selecciona una URL correcta" 
        });
    }

    try {
        // Llamada a la API externa
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        // Comprobar si la respuesta fue exitosa
        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === "ok") {
            return res.render("index", { 
                success: true, 
                song_title: fetchResponse.title, 
                song_link: fetchResponse.link 
            });
        } else {
            return res.render("index", { 
                success: false, 
                message: fetchResponse.msg 
            });
        }
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        return res.render("index", { 
            success: false, 
            message: "Hubo un error al procesar la solicitud, por favor intente más tarde." 
        });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor conectado en el puerto ${PORT}`);
});
