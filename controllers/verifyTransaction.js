const crypto = require("crypto");

const { request, postRequest } = require("../helpers/bluebird");
const client = require("../helpers/mailer");

const User = require("../schemas/userSchema");
const Project = require("../schemas/projectSchema");
const Download = require("../schemas/downloadSchema");

module.exports = {
  verify: async (req, res) => {
    const project = await Project.findById(req.query.refp);
    const reference = req.query.reference;
    const secret = process.env.PAYSTACK_SECRET;

    const options = {
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    };
    try {
      let response = (await request(options))[0];
      let body = JSON.parse(response.body);
      if (response.statusCode == 200) {
        let user = await User.findOne({ username: project.username });
        let bodyEmail = body.data.customer.email;
        if (!user.noOfProjectsSold) {
          user.noOfProjectsSold = 1;
        } else {
          user.noOfProjectsSold = user.noOfProjectsSold + 1;
        }

        let token = crypto.randomBytes(20).toString("hex");
        let projectDownload = new Download({
          projectUserEmail: bodyEmail,
          token: token,
          projectId: project._id,
        });

        var email = {
          from: "writeplugng@gmail.com",
          to: bodyEmail,
          subject: "Download Your File",
          text:
            "Please click on the following link, or paste this into your browser to download your file. Please note, this is a one time download link:\n\n" +
            "http://" +
            req.headers.host +
            "/download/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email",
        };

        await client.sendMail(email);
        await projectDownload.save();
        await user.save();
        req.flash(
          "success",
          "Payment has been made. Please check email provided for file"
        );
        res.redirect("back");
      } else {
        req.flash("error", "Error Occurred");
        res.redirect("back");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back");
    }
  },
};
