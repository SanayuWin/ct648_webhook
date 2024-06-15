const express = require("express");
const fetch = require('node-fetch-commonjs');
const app = express();


app.get("/", async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    const response = await fetch(`https://api.iplocation.net/?ip=${ip}`);
    const locationData = await response.json();
    const ID = '65130406'
    const currentDateTime = new Date().toLocaleString();
    const country = locationData.country_name;
    const isp = locationData.isp;
    
    const message = `
      รหัสนักศึกษา: ${ID}
      วันเวลาที่เปิดหน้าเว็บ: ${currentDateTime}
      IP Address: ${ip}
      ประเทศ: ${country}
      หน่วยงาน: ${isp}
    `;
    SendToLine(message);


    res.send(`
      <p>รหัสนักศึกษา: ${ID}</p>
      <p>วันเวลาที่เปิดหน้าเว็บ: ${currentDateTime}</p>
      <p>IP Address: ${ip}</p>
      <p>ประเทศ: ${country}</p>
      <p>หน่วยงาน: ${isp}</p>
    `);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).send('Error fetching location data');
  }
});


async function SendToLine(message){
 
  // var token = 'MeHN6VNE4a3m4CnB2IPJAvly7hNvlMdCCVi9pyzDaGh';
  var token = 'xc9Od32gX4RgWZxtuWncJ4ucyrkFyk7Xylif0TmygGA'; // สำหรับทดสอบ

  const paras = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    },
    body: new URLSearchParams({
      'message': message
    })
  };

  const response = await fetch('https://notify-api.line.me/api/notify', paras);
}


app.listen(8080);
