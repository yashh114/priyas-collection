import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors({ origin: "*" }));

const PRIVATE_KEY = "private_F4gFNhevVx357MYNZGc6ZOvl33o=";
const PUBLIC_KEY = "public_6F7KIvmANRRlg+HBY58Dt+1KLq0=";

/**
 * Generates ImageKit client-side upload auth params manually.
 * Equivalent to the old ImageKit SDK getAuthenticationParameters().
 */
app.get("/api/imagekit-auth", (req, res) => {
    try {
        const token = crypto.randomUUID();
        const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour
        const signature = crypto
            .createHmac("sha1", PRIVATE_KEY)
            .update(token + expire)
            .digest("hex");

        res.json({ token, expire, signature, publicKey: PUBLIC_KEY });
    } catch (err) {
        console.error("Auth error:", err);
        res.status(500).json({ error: String(err) });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ ImageKit auth server running at http://localhost:${PORT}`);
    console.log(`   Endpoint: http://localhost:${PORT}/api/imagekit-auth`);
});
