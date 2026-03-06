import crypto from "crypto";

const PRIVATE_KEY = "private_F4gFNhevVx357MYNZGc6ZOvl33o=";
const PUBLIC_KEY = "public_6F7KIvmANRRlg+HBY58Dt+1KLq0=";

export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const token = crypto.randomUUID();
        const expire = Math.floor(Date.now() / 1000) + 3600;
        const signature = crypto
            .createHmac("sha1", PRIVATE_KEY)
            .update(token + expire)
            .digest("hex");
        res.json({ token, expire, signature, publicKey: PUBLIC_KEY });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
