function _getData() {
  const url = `${process.env.TORSO_DB_HTTP_URL}/v2/pipeline`;
  const authToken = process.env.TORSO_TOKEN;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql: "SELECT * FROM users" } },
        { type: "close" },
      ],
    }),
  })
    .then((res) => res.json())
    .then((data) => data.results[0].response.result.rows) // [[{"type":"integer","value":"1"},{"type":"text","value":"Nico"}],[{"type":"integer","value":"2"},{"type":"text","value":"Jobs"}]]
    .catch((err) => console.log(err));
}

async function _addUser(name) {
  const url = `${process.env.TORSO_DB_HTTP_URL}/v2/pipeline`;
  const authToken = process.env.TORSO_TOKEN;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: { sql: `INSERT INTO users (name) VALUES ('${name}')` },
        },
        { type: "close" },
      ],
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

export async function GET() {
  const data = await _getData();

  // Create a formatted table for users
  const userTable = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (user) => `
            <tr>
              <td>${user[0].value}</td>
              <td>${user[1].value}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

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
                min-height: 100vh;
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
            h2 {
                color: #555;
                margin-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .add-user-form {
                margin-top: 20px;
            }
            input[type="text"] {
                padding: 5px;
                margin-right: 10px;
            }
            button {
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            }
            button:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello from ${process.env.VERCEL_REGION}</h1>
            <p>This page is served from a Vercel serverless function.</p>
            <h2>Users</h2>
            ${userTable}
            <div class="add-user-form">
                <input type="text" id="newUserName" placeholder="Enter new user name">
                <button onclick="addUser()">Add User</button>
            </div>
        </div>
        <script>
            async function addUser() {
                const nameInput = document.getElementById('newUserName');
                const name = nameInput.value.trim();
                if (name) {
                    const response = await fetch('/api/hello', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name }),
                    });
                    if (response.ok) {
                        nameInput.value = '';
                        location.reload(); // Reload the page to show the updated user list
                    } else {
                        alert('Failed to add user');
                    }
                }
            }
        </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(request) {
  const { name } = await request.json();
  await _addUser(name);
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
