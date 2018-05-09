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

//usando o Banco local
mongoose.connect('mongodb://localhost/bdCrud');


//definindo a porta onde o servidor vai responder
var port = process.env.port || 8000; // se estiver algum arquivo de conf de porta fora usa um se nao tiver usa a 8000

//definido a rota
var router = express.Router(); //Interpreta todas as rotas

//MIDDLEWARE
router.use(function(req,res,next){
    console.log("Interceptação pelo Middleware OK");
    next();
});

router.get('/', function(req, res){
    res.json({'message':'OK, rota principal está funcionando'});
});

//GetById
router.route('/produtos/:produtoId')
.get(function(req,res){
    const id = req.params.produtoId;

    Produto.findById(id,function(err,produto){
        if(err){
            res.status(500).json({
                message:"Erro ao tentar encontrar produto, ID mal formado"
            });
        }
        else if(produto ==null){
            res.status(400).json({
                message:"produto não encontrado"
            });
        }else{
            res.status(200).json({
                message:"Produto Encontrado",
                produto : produto
            });
        }
    });
})
.put(function(req,res){
    const id = req.params.produtoId;
    Produto.findById(id, function(err,produto){
        if(err){
            res.status(500).json({
                message:"Id mal formado, erro ao tentar encontrar produto"
            });
        }
        else if(produto == null){
            res.status(400).json({
                message:"Produto não encontrado"
            });
        }
        else{
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.descricao = req.body.descricao;

            produto.save(function(error){
                if(error)
                    res.send("Erro ao tentar atualizar o produto "+ error);

                    res.status(200).json({message:"produto atualizado com sucesso"});
            });
        }
    });

})
.delete(function(req,res){
    Produto.findByIdAndRemove(req.params.produtoId, (err,produto)=>{
        if(err) return res.status(500).send(err);

        const response = {
            message : "Produto removido com sucesso",
            id : produto.id
        };
        return res.status(200).send(response);
    });
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

            res.status(201).json({message:"Produto inserido com sucesso."});
        });
   })

        .get(function(req, res){
            Produto.find(function(err, prods){
                if(err)
                    res.send(err);
                
                res.status(200).json({
                    message:"Retorno de todos os produtos",
                    todosProdutos:prods
                });
            });
});


//vincular a app com o motor de rotas
//para esta aplição vamos criar um caminho padrão para as APIs REST
app.use('/api', router);

app.listen(port);//fica escutando 
console.log("API Server subindo na porta " + port);//quando subir mostra q a app subiu
