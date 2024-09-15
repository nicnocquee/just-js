export function GET() {
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vercel Region</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f0f0f0;
              }
              .container {
                  text-align: center;
                  padding: 20px;
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #333;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Hello from ${process.env.VERCEL_REGION}</h1>
              <p>This page is served from a Vercel serverless function.</p>
          </div>
      </body>
      </html>
    `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
