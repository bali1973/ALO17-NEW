const http = require('http');

const id = 'cmcuepxh7001hqjgcxy3d704h';
const name = 'Bebek Arabası';
const icon = 'Baby';

const postData = JSON.stringify({ name, icon });
const options = {
  hostname: 'localhost',
  port: 3004,
  path: `/api/subcategories/${id}`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Yanıt:', data);
  });
});
req.on('error', (e) => {
  console.error('Hata:', e.message);
});
req.write(postData);
req.end(); 
 
 