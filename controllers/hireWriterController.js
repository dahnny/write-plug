const client = require("../helpers/mailer");

const hireWriter = {
  getWriter: async (req, res) => {
    res.render("hire", { user: req.user });
  },
  postWriter: async (req, res) => {
    const { topic, budget } = req.body;

    let email = {
      from: req.user.emailAddress,
      to: "writeplugng@gmail.com",
      subject: "Hire a writer",
      text: `Name: ${req.user.fullname}\nEmail: ${req.user.emailAddress}\nPhone Number: ${req.user.phone}\n I want to hire a writer for the topic ${topic} and with a budget of  ${budget} naira`,
    };

    try {
      await client.sendMail(email);
      req.flash("info", "Successfully sent the email to writeplugng@gmail.com");
      res.redirect("back");
    } catch (error) {
      console.log(error);
      req.flash("error", "We experienced an error");
      res.redirect("back");
    }
  },
};

module.exports = hireWriter;
