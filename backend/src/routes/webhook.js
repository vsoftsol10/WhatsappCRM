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

    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    if (message) {

        const phone = message.from;
        const text = message.text?.body;

        console.log("Phone :", phone);
        console.log("Message :", text);

    }

    res.sendStatus(200);
});

module.exports = router;