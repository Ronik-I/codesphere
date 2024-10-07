const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL);

const projectSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  type: String,
  date: {
    type: Date,
    default: Date.now
  },
  htmlCode: {
    type: String,
    default: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
    
    </body>
    </html>`
  },
  cssCode: {
    type: String,
    default: `
    body{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }`
  },
  jsCode: {
    type: String,
    default: 'console.log("Hello World")'
  },
  code: {
    type: String,
    default: `
   //Start Writing Here`
  },
  language: {
    type: String,
    default: `
   python (3.8.1)`
  },
  input: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model("Project", projectSchema);