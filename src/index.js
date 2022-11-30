const dotenv =  require('dotenv').config()
const app = require('./app')



//port
const PORT = process.env.PORT || 3000

//server 
app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
})
