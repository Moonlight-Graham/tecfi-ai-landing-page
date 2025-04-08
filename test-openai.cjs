require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;

async function test() {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hi!" }],
    }),
  });

  const data = await res.json();
  console.log(data);
}

test();

