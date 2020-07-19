// https://m.miaojiang8.com/6_6233/
const fetch = require('node-fetch');
const tmp = async ()=>{
    const content = await fetch('https://read.qidian.com/chapter/sUgfCWf2lNTiqv-XmFZxCQ2/AW5YzZKCjUTgn4SMoDUcDQ2');
    // const data = await content.json();
    // JSON.stringify(content)
    console.log(content);
}

tmp();