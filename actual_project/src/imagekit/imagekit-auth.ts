// This runs on the server and returns an authentication signature
import type { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: "public_+ANrQ6VCgQdV8HcsnyVZJASccUQ=",
    privateKey: "private_VmrMvIZ5M5ImWpu0vzPYeq+gcaE=",
    urlEndpoint: "https://ik.imagekit.io/kzg8aohm0",
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authenticationParameters);
}