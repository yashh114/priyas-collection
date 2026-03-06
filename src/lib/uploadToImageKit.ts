/**
 * Uploads a File to ImageKit via the local auth server and returns
 * the permanent CDN URL.
 *
 * Requires: node server.js running on http://localhost:3000
 */
export async function uploadToImageKit(file: File, folder = "priya-collection"): Promise<string> {
    // 1. Get auth params via Vite proxy → Express server
    const authRes = await fetch("/api/imagekit-auth");
    if (!authRes.ok) throw new Error("ImageKit auth server not reachable. Is 'node server.js' running?");
    const { token, expire, signature } = await authRes.json();

    // 2. Build multipart form
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `${Date.now()}-${file.name}`);
    formData.append("folder", `/${folder}`);
    formData.append("publicKey", "public_6F7KIvmANRRlg+HBY58Dt+1KLq0=");
    formData.append("signature", signature);
    formData.append("expire", String(expire));
    formData.append("token", token);

    // 3. Upload directly to ImageKit
    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
    });

    if (!uploadRes.ok) {
        const err = await uploadRes.text();
        throw new Error(`ImageKit upload failed: ${err}`);
    }

    const data = await uploadRes.json();
    return data.url as string;
}
