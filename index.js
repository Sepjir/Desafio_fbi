//instanciando modulos
const express = require("express")
const res = require("express/lib/response")
const app = express()
const jwt = require("jsonwebtoken")
agents = require("./data/agentes")

//clave JSON Web Token
const key = "FBY"

//Ruta raíz para consumir y mostrar el html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

//Ruta para asignar un Token con JWT en base a usuarios ya creados en el archivo agentes.js
app.get("/SignIn", (req, res) => {
    const {email, password} = req.query
    agent = agents.results.find((a) => a.email == email && a.password == password)

    if(agent) {
        const token = jwt.sign({
            exp: Math.floor(Date.now()/ 1000) + 120,
            data: agent
        }, key)

        res.send(`<h1> Bienvenido agente ${email}</h1>
                    <a href="/mission?token=${token}"><p> Ir a su asignación de misión</p></a>
                    <script>
                    sessionStorage.setItem('token', JSON.stringify("${token}"))
                    </script>
        `)
    } else{
        res.status(401).send(`<h1> el usuario y/o contraseña son incorrectos</h1>
                                <h2> Devolviendo al panel original de la misión...</h2>
                                <script>
                                setTimeout(function(){window.location.href = 'http://localhost:3000/'}, 3000)
                                </script>
        `)
    }
})

//Ruta restringida que valida el token creado anteriormente
app.get("/mission", (req, res) => {
    const {token} = req.query
    jwt.verify(token, key, (err, decoded) => {
        err
            ? res.status(401).send({
                error: "401 Unauthorized",
                message: err.message
            })
            : res.send(`<h1>Bienvenido a su asignación de misión agente: ${decoded.data.email}</h1>`)
    })
})


app.listen(3000, () => console.log("Servidor levantado en puerto 3000"))