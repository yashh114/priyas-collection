import ImageKit from "imagekit-javascript";

// TODO: Replace with your actual ImageKit keys
export const imagekitInit = new ImageKit({
    publicKey: "public_6F7KIvmANRRlg+HBY58Dt+1KLq0=",
    urlEndpoint: "https://ik.imagekit.io/qsx2nylmv",
    // @ts-expect-error - Expected for client side
    authenticationEndpoint: "http://localhost:3000/api/imagekit-auth"
});
