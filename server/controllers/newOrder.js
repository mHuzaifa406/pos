const NewOrder = require('../models/NewOrder');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Customer = require('../models/Customer');
require('dotenv').config();
// Create a transporter using your email service configuration
const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send order confirmation email with order details
const sendOrderEmail = async (order, userEmail,dueDate) => {
  const humanDueDate = new Date(dueDate).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Order Confirmation',
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height:1.6; background-color:#f4f4f4; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                <h1 style="text-align:center; color:#333;">Order Confirmation</h1>
                <p>Hi,</p>
                <p>Your order has been placed successfully.</p>
                <hr style="border:0; border-top:1px solid #eee;" />
                <h3 style="color:#555;">Order Details</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Due Date:</strong> ${humanDueDate}</p>
                <h3 style="color:#555;">Items Ordered</h3>
                <div style="background:#f9f9f9; padding:10px; border-radius:4px; margin-bottom:20px;">
                  <pre style="font-size:14px; color:#333; white-space:pre-wrap;">${JSON.stringify(order.items, null, 2)}</pre>
                </div>
                <p style="text-align:center;">Thank you for your order!</p>
                <p style="text-align:center; font-size:12px; color:#888;">If you have any questions, please contact our support team.</p>
              </div>
            </body>
          </html>
        `
    };

    await transporter.sendMail(mailOptions);
};
// Function to create a new order and send email confirmation if customerEmail is provided
async function createNewOrder(req, res) {
    try {
        // Destructure with an extra customerEmail field from request body
        const { items, createdBy, duedate, customer, design, payments } = req.body;
        console.log(duedate);
        const user = await User.findOne({ username: createdBy });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user_id = user._id;
        const customerExists = await Customer.findById(customer);
        if (!customerExists) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        const customeremail = customerExists.email;
        // Create a new order instance
        const newOrder = new NewOrder({
            items,
            design,
            createdBy:user_id,
            customer,
            dueDate: duedate,
            payments,
        });

        // Save the order to the database
        await newOrder.save();

        // If customerEmail is provided, send the order details by email
        if (customeremail) {
            await sendOrderEmail(newOrder, customeremail,duedate);
        }
        // console.log(newOrder);
        // Send a response back to the client
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.log(error);
        res.status(500).json({ message: 'Error creating order', error });
    }
}


module.exports =  createNewOrder;