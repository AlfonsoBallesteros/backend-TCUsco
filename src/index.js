require('dotenv').config()
const app = require('./app')
require('./database')

async function main(){
    await app.listen(app.get('port'));
    console.log('Server on Port 4000', app.get('port'));
}
main()
