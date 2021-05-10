const Promise = require("bluebird");
var request = Promise.promisify(require("request"), { multiArgs: true });
Promise.promisifyAll(request, { multiArgs: true });
var postRequest = Promise.promisify(require("request").post, { multiArgs: true });
Promise.promisifyAll(postRequest, { multiArgs: true });

const User = require('../schemas/userSchema');

const paymentDetails = {
    verifyAccount: async (req, res, next) => {
        const bankCode = req.query.bankCode;
        const accountNumber = req.query.account;
        const paystackSecret = process.env.PAYSTACK_SECRET;

        if (bankCode != null || accountNumber != null) {
            const options = {
                url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${paystackSecret}`
                }
            }
            try {
                const response = (await request(options))[0];
                const responseBody = JSON.parse(response.body);
                if (response.statusCode == 200) {
                    let user = await User.findById(req.user._id);
                    let options = {
                        url: 'https://api.paystack.co/subaccount',
                        headers: {
                            Authorization: `Bearer ${paystackSecret}`,
                            'Content-Type': 'application/json'
                        },
                        form: {
                            business_name: `writeplug_ng_${req.user.username}`,
                            bank_code: bankCode,
                            account_number: accountNumber,
                            percentage_charge: 40
                        }
                    }
                    let response = (await postRequest(options))[0];
                    let accountBody = JSON.parse(response.body);

                    user.subAccountDetails = accountBody
                    // res.render('payment', { user: req.user });
                }
            } catch (error) {
                console.error(error);
                req.flash('error', error.message);
                res.redirect('back');
            }
        } else {
            res.render('payment', { user: req.user });
        }
    }
}

module.exports = paymentDetails;