const express=require('express');
const axios=require('axios');
const users=require('../data/user');
const router=express.Router();
const {generateToken,verifyToken}=require('../middleware/middleware');

router.get('/',(req,res)=>{
    const loginFormSession = `  
    <a href="/search">search</a>
     <form action="/logout" method="post"> 
        <button type="submit">Cerrar sesión</button> 
      </form>
      `;
    const loginFormNoSession= `
    <form action="/login" method="post">
    <label for="username">Usuario:</label>
    <input type="text" id="username" name="username" required><br>

            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br>

            <button type="submit">Iniciar sesión</button>
        </form>

    `;
    if(req.session.token){
        res.send(loginFormSession)
    }else{
        res.send(loginFormNoSession)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body; 
    const user = users.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/search');
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' }); 
    }
});

router.get('/search', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
        res.send(`
        <h1>Busca tú personaje favorito</h1>
        <a href="/">home</a>
        
        <a href="/allcharacters">Todos los personajes</a><br>

        <form action="/character" method="get">
        <label for="name">Personaje:</label>
        <input type="text" id="name" name="name" placeholder="Rick" required>      
        <button type="submit">Enviar</button>
        </form>

        <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
        </form>
        
        `);
    } else {
        res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
});
router.get('/characters/:name',verifyToken, async (req,res)=>{
    const name=req.params.name
    const url=`https://rickandmortyapi.com/api/character/?name=${name}`

    try {
        const response = await axios.get(url)

        const {name,status,species,gender,origin,image}=response.data.results[0];
        res.json({name,status,species,gender,origin,image})
    } catch (error) {
        res.status(404).json({error:'Personaje no encontrado'})
    }
})

router.get('/allcharacters',verifyToken, async (req,res)=>{
    const url=`https://rickandmortyapi.com/api/character`
    try {
        const response = await axios.get(url)
        const characters=response.data.results.map(({name,status,species,gender,origin,image})=>({
            name,
            status,
            species,
            gender,
            origin:origin.name,
            image
        }));
        res.json(characters)
    } catch (error) {
        res.status(404).json({error:'Error al obtener personajes'})
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports=router;




