const express = require('express');

const app = express();
const port = 5000;

app.get('/', (req: any, res: any) => {
  res.send('good job man');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
