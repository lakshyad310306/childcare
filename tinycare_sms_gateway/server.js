const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
<<<<<<< HEAD
const QRCodeImage = require('qrcode');
const path = require('path');

// Global unhandled promise rejection and exception handler to prevent process crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
=======
const qrcodeImage = require('qrcode');
>>>>>>> b8346557681b6a9d7fad4b61f4bcc102d20ff435

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
});

let isClientReady = false;

client.on('qr', async (qr) => {
    console.log('QR RECEIVED. Please scan it using WhatsApp:');
    qrcode.generate(qr, { small: true });
<<<<<<< HEAD

    // Also save as PNG in artifacts directory for easy scanning
    try {
        const qrPath = 'C:/Users/laksh/.gemini/antigravity-ide/brain/f7653888-bd1a-4d62-b34c-7cbfb66692c7/qr_code.png';
        await QRCodeImage.toFile(qrPath, qr, {
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        });
        console.log(`Saved QR code image to: ${qrPath}`);
    } catch (err) {
        console.error('Failed to save QR code image:', err);
    }
=======
    
    const imagePath = 'C:/Users/PC/.gemini/antigravity-ide/brain/c1ea6d7f-eb4c-42fd-b334-918485c4d14e/qr.png';
    qrcodeImage.toFile(imagePath, qr, {
        color: { dark: '#000000', light: '#FFFFFF' }
    }, function (err) {
        if (err) console.error('Failed to save QR code image:', err);
        else console.log('QR code saved as ' + imagePath);
    });
>>>>>>> b8346557681b6a9d7fad4b61f4bcc102d20ff435
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isClientReady = true;
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp Client was disconnected:', reason);
    isClientReady = false;
});

client.initialize().catch(err => {
    console.error('Error during client.initialize():', err);
});

app.post('/dispatch-message/', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required fields.' });
    }

    if (!isClientReady) {
        console.error('Failed to send message: WhatsApp client is not ready yet.');
        return res.status(503).json({ error: 'WhatsApp client is not ready yet. Please wait for the gateway to connect.' });
    }

    // Clean phone number: remove non-numeric characters
    let cleanedPhone = phone.replace(/\D/g, '');

    // Assuming India prefix if 10 digits
    if (cleanedPhone.length === 10) {
        cleanedPhone = `91${cleanedPhone}`;
    }

    const chatId = `${cleanedPhone}@c.us`;

    try {
        // Resolve the exact serialized ID to prevent 'getChat' undefined errors on new contacts
        const numberId = await client.getNumberId(cleanedPhone);
        if (!numberId) {
            console.error(`Number not registered on WhatsApp: ${cleanedPhone}`);
            return res.status(404).json({ error: 'Number not registered on WhatsApp.' });
        }

        await client.sendMessage(numberId._serialized, message);
        console.log(`Message sent to ${numberId._serialized}`);
        res.status(200).json({ success: true, message: 'Message dispatched successfully.' });
    } catch (error) {
        console.error(`Failed to send message to ${cleanedPhone}:`, error);
        res.status(500).json({ error: 'Failed to send message.', details: error.toString(), stack: error.stack });
    }
});

app.listen(port, () => {
    console.log(`TinyCare SMS Gateway listening on port ${port}`);
});
