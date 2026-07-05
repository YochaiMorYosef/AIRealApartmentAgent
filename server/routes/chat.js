const { askGemini } = require("../services/geminiService");
const searchApartmentsTool = require("../tools/searchApartmentsTool");
const { searchApartments } = require("../services/apartmentService");
const buildConversation = require("../utils/buildConversation");
const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const conversation = buildConversation(messages);
    const response = await askGemini(conversation, searchApartmentsTool);

    const parts = response.candidates?.[0]?.content?.parts ?? [];

    const functionCall = parts.find(p => p.functionCall);
    const textPart = parts.find(p => p.text);
    console.log(functionCall?.functionCall?.args);
    if (functionCall) {

        const args = functionCall.functionCall.args;
        const apartments = searchApartments(args);
        let reply;

        if (apartments.length === 0) {
            reply = "לא מצאתי דירות שמתאימות לבקשה שלך.";
        } else {
            const first = apartments[0];
            reply =
                `מצאתי עבורך ${apartments.length} דירות.\n` +
                `הדירה הראשונה נמצאת ב${first.cityHebrew || first.city} ` +
                `במחיר ₪${first.price.toLocaleString()}.`;
        }
        return res.json({
            reply,
            apartments
        });
    }

    return res.json({
        reply: textPart?.text || "",
        // apartments: []
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;