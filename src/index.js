const express = require('express');
const cors = require('cors');
const rootRouter = require('./routes');

const PORT = 5000 || process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


rootRouter(app);

app.listen(PORT, () => console.log(`Server is running on PORT: http://localhost:${PORT}`));