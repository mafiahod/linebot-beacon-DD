## สร้าง Line Beacon ด้วย Raspberry Pi ตามลิงค์ด้านล่าง
https://medium.com/@phayao/%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99-line-beacon-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-raspberry-pi-e99e076ba20a


## ไว้หาhwidให้beacon
https://manager.line.biz/beacon/register#/

# line-bot-nodejs-starter
starter point to create new line bot project

## How it work
Start express server to handle webhook from LINE

# Install
Clone and run
```
npm install
npm install dotenv
```
Modify `config.js`
 export  let port = '3000' ,
 channelAccessToken= process.env.channelAccessToken,channelSecret= process.env.channelSecret,
  ReportGroupId= "C6ce76af8d6b199b60bb675b85e8cea2f"
สร้างenviroment variable ชื่อ channelAccessTokenกับchannelSecret และเปลี่ยน ReportGroupId ตามกลุ่มไลน์ที่บอทอยู่

Run
```
npm start
```
then you can access [http://localhost:3000](http://localhost:3000)

Use [ngrok](https://ngrok.com/) to expose your local url
```
path/to/ngrok http 3000
``` 

config webhook url in developer console then enjoy your bot!


## โครงสร้างงาน
└───src
    ├───core
    │   ├───data_access_layer
    │   ├───model
    │   └───service
    └───resource
    
    
## เครคิต
Sitthi Thiammekha
