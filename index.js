const OpenAI =require('openai')
const express = require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const openai = new OpenAI({
    apiKey:'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'
});

const app=express();

app.use(bodyParser.json())
app.use(cors())

const port = 3080

app.post('/',async(req,res)=>{
    const {message}=req.body;
    // console.log(message)
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        stream: true,
    });
    let responseContent=''
    for await (const chunk of stream) {
        responseContent += chunk.choices[0]?.delta?.content || '';

        // process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    // console.log(responseContent)
    res.json({
        data:responseContent,
    })
})


app.get('/models',async(req,res)=>{
   const response=await openai.models.list();
   for await (const model of response) {
    console.log(model);
  }
   res.json({
    models:response
   })
})
app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})
