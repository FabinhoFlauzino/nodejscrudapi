//importando pacotes 
var express = require('express'); //olha no node_models e ve se tem esse pacote
var app = express(); //chamando a biblioteca e joga na vareavel app
var bodyParser = require('body-parser');

//configurar a app para usar o body-parser
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

//colocando o mongoose dentro da app
var mongoose = require('mongoose');
var Produto = require('./app/models/produto');

//usando o MLAB
mongoose.connect('mongodb://Fabinho Flauzino:minhanossa8@ds050739.mlab.com:50739/banco1?authSource=yourDB&w=1');

//definindo a porta onde o servidor vai responder
var port = process.env.port || 8000; // se estiver algum arquivo de conf de porta fora usa um se nao tiver usa a 8000

//definido a rota
var router = express.Router(); //Interpreta todas as rotas

router.get('/', function(req, res){
    res.json({'message':'OK, rota principal está funcionando'});
});

//Criando uma rota padrão para produto, tudo que for api/produto cai aqui
router.route('/produtos')
    .post(function(req,res){
        var produto = new Produto();
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function(error){
            if(error)
                res.send("Erro ao tentar incluir um novo produto " + error);

            res.json({message:"Produto inserido com sucesso."});
        });
});

//vincular a app com o motor de rotas
//para esta aplição vamos criar um caminho padrão para as APIs REST
app.use('/api', router);

app.listen(port);//fica escutando 
console.log("API Server subindo na porta " + port);//quando subir mostra q a app subiu
