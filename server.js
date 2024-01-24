const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const proxy = httpProxy.createProxyServer();

const targetApiUrl = "http://localhost:3000/target"; // Replace with your API server's URL

// Middleware to handle API requests
app.use("/api", (req, res) => {
  console.log(`Received request for: ${req.originalUrl}`);
  const targetUrl = targetApiUrl;

  // Log before forwarding the request
  console.log(`Forwarding request to: ${targetUrl}`);

  // Forward the request to the target URL
  proxy.web(req, res, { target: targetUrl }, (err) => {
    if (err) {
      handleProxyError(err, res);
    } else {
      // Log after forwarding the request
      console.log(`Request forwarded successfully.`);
    }
  });
});

// Parse JSON requests
app.use(express.json());

// Handle requests to /target
app.get("/target", (req, res) => {
  res.json({ message: "Hello " + req.body.user });
});

// Handle errors during proxying
proxy.on("error", (err, req, res) => {
  handleProxyError(err, res);
});

// Helper function to handle proxy errors
function handleProxyError(err, res) {
  console.error("Proxy error:", err);
  res.status(500).send("Something went wrong with the proxy.");
}

// Start the server on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is listening on port ${PORT}`);
});
