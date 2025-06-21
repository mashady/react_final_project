const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    const port = process.env.PORT || 3000;
    require("http")
      .createServer((req, res) => handle(req, res))
      .listen(port, () => {
        console.log(`> Next.js ready on http://localhost:${port}`);
      });
  })
  .catch(console.error);
