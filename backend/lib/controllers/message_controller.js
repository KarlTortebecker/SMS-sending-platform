const Messages = require('../models/messages')
const autoCatch = require('../auto-catch') 
var axios = require('axios')

module.exports = {
    createMessage: autoCatch(createMessage),
    getMessage: autoCatch(getMessage),
    deleteMessage: autoCatch(deleteMessage)
}

 
var data = JSON.stringify({
  "phoneNumber": "+237691325895",
  "message": "On dit quoi ?",
  "mediaUrl": "",
  "externalId": "",
  "lineId": ""
});

var config = {
  method: 'post',
  url: 'https://asap-desk.com/api/v0/whatsapp/message',
  headers: { 
    'Authorization': 'Basic NThkMGVhMjU4N2E3OmJiYjA5YWJjLTFlMzctNDA3NC04ZDM3LTAzZjVkZWQ1YjkyYw==', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});


//handle create message request
async function createMessage(req, res, next){
    const fields = req.body

    fields.sender = req.user.id

    const message_API_URL = "https://asap-desk.com/api/v0/whatsapp/message"; //https://asap-desk.com/api/v0/whatsapp/message

    const sendingResponse =  axios.post(message_API_URL,
        {
            phoneNumber: req.body.receiverPhoneNumber ,
            message: req.body.text
        },{
            auth:{
                username: "f16187da70b6",
                password: "b6901d40-f211-930a-8e0c-1cdad7a64f99"
            }
        }).then(
            (response) =>{
                console.log("___________________________________________")
                if(response.status === 201){
                    console.log(response.data)

                }
            }

        ).catch((error) => {
            console.log(error.data);
            
            return next(error);
        })

       const message = await Messages.create(fields)

       res.json(message)
}

//handle get message request
async function getMessage(req, res, next){
    const message = await Messages.get(req.params.id)

    if(!message) return next()

    if(message && message.sender._id === req.user.id){

        res.json(message)
    }else{
        res.status(401).json({message: 'Unauthorized'})
    }
}

//handle delete message request
async function deleteMessage(req, res, next){
    const message = await Messages.get(req.params.id)

    if(message && message.sender._id === req.user.id){
        await Messages.remove(req.params.id)

        res.json({success: true})

    }else{
        res.status(401).json({message: 'Unauthorized'})
    }
}