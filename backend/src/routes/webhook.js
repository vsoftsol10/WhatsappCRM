const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === process.env.VERIFY_TOKEN
    ) {
        console.log("Webhook Verified");

        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);

});

router.post("/", (req, res) => {
    console.log("====================================");
    console.log("WHATSAPP WEBHOOK RECEIVED");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("====================================");

    res.sendStatus(200);
});

module.exports = router;