const express = require("express");
const fetch = require('node-fetch-commonjs');
const app = express();


app.get("/", async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    const ipv4Address = extractIPv4(ip);
    const response = await fetch(`https://api.iplocation.net/?ip=${ipv4Address}`);
    const locationData = await response.json();
    const ID = '65130406'
    const currentDateTime = new Date().toLocaleString();
    const country = locationData.country_name;
    const isp = locationData.isp;
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    const message = `
      ชื่อนักศึกษา: สนายุ จินตนาวรรณกุล
      รหัสนักศึกษา: ${ID}
      วันเวลาที่เปิดหน้าเว็บ: ${currentDateTime}
      URL: ${fullUrl}
      IP Address: ${ipv4Address}
      ประเทศ: ${country}
      หน่วยงาน: ${isp}
    `;
    SendToLine(message);


    res.send(`
      <p>รหัสนักศึกษา: ${ID}</p>
      <p>วันเวลาที่เปิดหน้าเว็บ: ${currentDateTime}</p>
      <p>URL: ${fullUrl}</p>
      <p>IP Address: ${ipv4Address}</p>
      <p>ประเทศ: ${country}</p>
      <p>หน่วยงาน: ${isp}</p>
    `);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).send('Error fetching location data');
  }
});

function extractIPv4(ip) {
  const match = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (match && match.length === 2) {
    return match[1]; // Return the IPv4 address part
  } else {
    return ip; // Return the original IP if not in ::ffff: format
  }
}

async function SendToLine(message){
 
  var token = 'MeHN6VNE4a3m4CnB2IPJAvly7hNvlMdCCVi9pyzDaGh';

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
