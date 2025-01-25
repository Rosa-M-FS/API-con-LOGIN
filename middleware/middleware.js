const jwt=require('jsonwebtoken');
const{secret}=require('../crypto/config');

function generateToken(user) {
    return jwt.sign({ user: user.id }, secret, {
      expiresIn: '1h',
    });
  }
  

  function verifyToken(req, res, next) {
    const header=req.headers['authorization'];
    if(!header){
      return res.status(401).json({mensaje:'Token no generado'})
    }
    const token = req.session.token;
    if (!token) {
      return res.status(401).json({ mensaje: 'token no generado' });
    }
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ mensaje: 'token inválido' });
      }
      req.user = decoded.user;
      next();
    });
  }

module.exports = { generateToken, verifyToken };