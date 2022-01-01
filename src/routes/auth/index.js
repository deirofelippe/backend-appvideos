async function estaAutenticado(req, res) {
   res.status(401).redirect("/login");
}

async function verificarTokenJWT(req, res) {}

async function gerarTokenJWT(req, res) {
   res.json({});
}

module.exports = {
   estaAutenticado,
};
