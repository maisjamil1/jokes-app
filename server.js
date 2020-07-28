'use strict'
require('dotenv').config();
const express=require('express')
const pg=require('pg')
const superagent=require('superagent')
const methodOverride=require('method-override')

const PORT=process.env.PORT||3000
const app=express();
const client=new pg.Client(process.env.DATABASE_URL)
// client.on('error',(err)=>console.log(err))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public',express('public'))
app.use(methodOverride('_method'))
//____________________________________________________________________
app.set('view engine','ejs')
app.get('/',homeHandler)
app.post('/addtolist',addtoFav)
app.get('/renderFav',renderFavHandler)
app.get('/viewdetails/:id',viewdetailsHandler)
app.put('/update/:id',updateHandler)
app.delete('/delete/:id',deleteHandler)
app.get('/randomjoke',randomjokeHandler)




    




//____________________________________________________________________
function homeHandler(req,res){
let url='https://official-joke-api.appspot.com/jokes/programming/ten'
superagent.get(url).then(results=>{
    // console.log(results.body)
    // console.log(results.body)
    let datajoke=results.body
    let myFinalJoke=datajoke.map(obj=>{
        return new JokeCON(obj)
    })
    // console.log(myFinalJoke)
    res.render('index.ejs',{data:myFinalJoke})
})
}

function JokeCON(obj){
    this.jokenumber=obj.id||'not ffffound'
    this.typee=obj.type||'not ffffound'
    this.setup=obj.setup||'not ffffound'
    this.punchline=obj.punchline||'not ffffound'
}

//____________________________________________________________________
function addtoFav(req,res){
    let {jokenumber,typee,setup,punchline}=req.body
    // console.log(jokenumber,typee,setup,punchline);
    let SQL='INSERT INTO joketb(jokenumber,typee,setup,punchline)VALUES($1,$2,$3,$4);'
    let VALUES=[jokenumber,typee,setup,punchline]
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFav')
    })

}

//____________________________________________________________________
function renderFavHandler(req,res){
    let SQL='SELECT * FROM joketb;'
    client.query(SQL).then(results=>{
        res.render('pages/fav.ejs',{data:results.rows})
    })
}
//____________________________________________________________________


function viewdetailsHandler(req,res){
    console.log(req.params.id)
    let SQL='SELECT * FROM joketb WHERE id=$1;'
    let VALUES=[req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.render('pages/jokedetails.ejs',{val:results.rows[0]})
    })
}
//____________________________________________________________________
function updateHandler(req,res){ 
    let {jokenumber,typee,setup,punchline}=req.body
    let SQL='UPDATE joketb SET jokenumber=$1,typee=$2,setup=$3,punchline=$4 WHERE id=$5;'
    let VALUES=[jokenumber,typee,setup,punchline,req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.redirect(`/viewdetails/${req.params.id}`)
    })
    
}
//____________________________________________________________________
function deleteHandler(req,res){
    let SQL='DELETE FROM joketb WHERE id=$1;'
    let VALUES=[req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFav')
    })  
}


//____________________________________________________________________
function randomjokeHandler(req,res){
    let url='https://official-joke-api.appspot.com/jokes/programming/random'
superagent.get(url).then(results=>{
    console.log(results.body)
    let randomjoke=results.body
    let myFinalrandom=new JokeCON(randomjoke[0])
    res.render('pages/randomjoke.ejs',{val:myFinalrandom})
    })
    // console.log(myFinalJoke)
}


































//__________________________________________________________
app.get('/test',test)
function test(req,res){
    res.send('yessssssssssss')
}

app.use('*',notFoundHandler)

function errorHandler(err,req,res){
res.status(500).send(err)
}
function notFoundHandler(req,res){
    res.status(404).send('page not found')
    }




client.connect().then(()=>{
    app.listen(PORT,()=>console.log('up and running on',PORT))
})