const respHandler = require('../services/responseHandler');
const config = require('../config/constants');
const templates = require('../config/email-template');
const MailJet = require('node-mailjet').connect(config.MAILJET_APIKEY, config.MAILJET_APISECRET);
const sendEmail = MailJet.post('send');
const mailController = {
    sendMailAfterUpdate: function (data, req, res, next) {
        sendMailNow(data, res);
    }
};
module.exports = mailController;

function sendMailNow(data, res) {
    // console.log('User ', data);
    if(!data.userEmail) { return false; }
    const subject = 'Thank you for creating website with us!',
        location = 'https://webchoice.ng',
        imgLocation = 'https://webchoice.ng/assets/img/logo/wb-neg.png',
        companyName = data.companyName,
        mailContent = `Hurray!!!<br>
        Your website has been created. To preview your website visit this link <a href='${data.website}'>${data.website}</a>
        <br>
        To move your website to your private domain and obtain a domain for yourself. Visit <a href='https://domains.upperlink.ng'>https://domains.upperlink.ng</a>.`,
        content2 =  `You are receiving this email because you created a website on <a href='https://www.webchoice.ng'>webchoice.ng</a>`,
        thankYou = 'Cheers';

    const emailData = {
        'FromEmail': 'hello@webchoice.ng',
        'FromName': 'WebChoice',
        'Subject': subject,
        // 'Text-part': 'Hello NodeJs !',
        "Html-Part": templates.templateUpdateTeamMembers(subject, companyName, mailContent, content2, thankYou, location, imgLocation ),
        'Recipients': [{'Email': data.userEmail}],
        // 'Recipients': recipients,
    };

        sendEmail
        .request(emailData)
        .then((_res) => {console.log('Mail sent successfully');
            // respHandler.sendSuccess(res, 200, 'Mail sent successfully');
        })
        .catch((error) => { console.log('Error sending email', error);
            // respHandler.sendError(res, 406, 'FAILURE', 'Unable to send mail');
        });
}