import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: "public_+ANrQ6VCgQdV8HcsnyVZJASccUQ=",
    privateKey: "private_VmrMvIZ5M5ImWpu0vzPYeq+gcaE=",
    urlEndpoint: "https://ik.imagekit.io/kzg8aohm0",
});

export async function GET(req: NextRequest) {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
} 