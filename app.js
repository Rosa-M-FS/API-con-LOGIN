const express=require('express');
const app=express();
const axios=require('axios');
const hashedSecret=require('./crypto/config');
const users=require('./data/user');
const usersRoutes=require('./routes/users');
const session=require('express-session');

app.use(
    session({
      secret: hashedSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', usersRoutes);



const PORT=4000;
app.listen(PORT,()=>{
    console.log(`Express escuchando en http://localhost:${PORT}`)
});