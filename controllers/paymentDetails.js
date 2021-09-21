const { request, postRequest } = require("../helpers/bluebird");

const User = require("../schemas/userSchema");

const paymentDetails = {
  verifyAccount: async (req, res) => {
    const bankCode = req.query.bankCode;
    const accountNumber = req.query.account;
    const paystackSecret = process.env.PAYSTACK_SECRET;

    if (bankCode != null || accountNumber != null) {
      const options = {
        url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      };
      try {
        const response = (await request(options))[0];
        const responseBody = JSON.parse(response.body).data;
        if (response.statusCode == 200) {
          let user = await User.findById(req.user._id);
          let options = {
            url: "https://api.paystack.co/subaccount",
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json",
            },
            form: {
              business_name: `writeplug_ng_${req.user.username}`,
              bank_code: bankCode,
              account_number: accountNumber,
              percentage_charge: 40,
            },
          };
          let response = (await postRequest(options))[0];
          let accountBody = JSON.parse(response.body).data;

          user.subAccountDetails = accountBody;
          user.accountDetails = responseBody;
          await user.save();
          req.flash(
            "success",
            "Account has been verified and created. You can now receive payments"
          );
          res.redirect("/payment-details");
        }
      } catch (error) {
        console.error(error);
        req.flash("error", error.message);
        res.redirect("back");
      }
    } else {
      let options = {
        url: `https://api.paystack.co/bank/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      };

      try {
        let response = (await request(options))[0];
        let responseBody = JSON.parse(response.body).data;
        // console.log(responseBody);
        res.render("payment", {
          user: req.user,
          banks: responseBody,
          isVerified:
            req.user.subAccountDetails != {} &&
            typeof req.user.subAccountDetails != "undefined"
              ? true
              : false,
        });
      } catch (error) {
        console.error(error);
        req.flash("error", error.message);
        res.redirect("back");
      }
    }
  },
};

module.exports = paymentDetails;
