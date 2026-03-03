import { ethers } from 'ethers';

async function testSignature() {
    // Simulated data
    const wallet = ethers.Wallet.createRandom();
    const address = await wallet.getAddress();
    const nonce = "123456";
    const origin = process.env.CLIENT_URL || "http://localhost:3000";

    // Frontend Template
    const frontendMessage = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${nonce}`;
    console.log("Frontend Message:\n" + frontendMessage);
    console.log("-------------------");

    // Sign the message (simulates window.ethereum.request({ method: 'personal_sign', ... }))
    const signature = await wallet.signMessage(frontendMessage);
    console.log("Signature:", signature);

    // Backend Template
    const backendMessage = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${nonce}`;
    console.log("Backend Message:\n" + backendMessage);
    console.log("-------------------");

    // Recover address in Backend
    const recoveredAddress = ethers.verifyMessage(backendMessage, signature);
    console.log("Recovered Address:", recoveredAddress);
    console.log("Original Address: ", address);
    console.log("Matches:          ", recoveredAddress.toLowerCase() === address.toLowerCase());
}

testSignature().catch(console.error);
