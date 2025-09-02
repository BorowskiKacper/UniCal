import { GoogleAuth } from "google-auth-library";

// Any request to /api/* is routed to this function because its in api/[...path].js and has a default export
export default async function handler(req, res) {
  try {
    const base = process.env.CLOUD_RUN_URL;
    if (!base) {
      res.status(500).json({ message: "CLOUD_RUN_URL not set" });
      return;
    }

    // Build target URL; keep the /api prefix since backend expects it
    const targetUrl = base.replace(/\/$/, "") + req.url;

    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
    });
    const idClient = await auth.getIdTokenClient(base);
    const authHeaders = await idClient.getRequestHeaders();

    // Forward headers except hop-by-hop and client Authorization
    const forwardHeaders = { ...authHeaders };
    for (const [k, v] of Object.entries(req.headers)) {
      const key = k.toLowerCase();
      if (key === "host" || key === "authorization") continue;
      forwardHeaders[k] = v;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
    });

    res.status(response.status);
    response.headers.forEach((v, k) => {
      if (k.toLowerCase() === "transfer-encoding") return;
      res.setHeader(k, v);
    });

    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Proxy error" });
  }
}
