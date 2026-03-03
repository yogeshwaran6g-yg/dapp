import jwt from 'jsonwebtoken';

try {
    const payload = { test: 123 };
    const secret = undefined;
    const token = jwt.sign(payload, secret);
    console.log("Token generated with undefined secret:", token);

    const decoded = jwt.verify(token, secret);
    console.log("Decoded with undefined secret:", decoded);
} catch (err) {
    console.log("Error with undefined secret:", err.message);
}

try {
    const payload = { test: 123 };
    const secret = "correct-secret";
    const token = jwt.sign(payload, secret);
    console.log("Token generated with correct secret");

    const decoded = jwt.verify(token, "wrong-secret");
    console.log("Decoded with wrong secret:", decoded);
} catch (err) {
    console.log("Error with wrong secret:", err.message);
}
