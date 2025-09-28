import nodemailer from 'nodemailer';

// build correct download URL for drive links
const buildDownloadUrl = (zipFile, zipFileType) => {
  if (zipFileType !== 'drive_link' || !zipFile) return zipFile;

  let fileId = '';

  if (zipFile.includes('/file/d/')) {
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    fileId = zipFile.split('/file/d/')[1].split('/')[0];
  } else if (zipFile.includes('id=')) {
    // https://drive.google.com/uc?export=download&id=FILE_ID
    fileId = zipFile.split('id=')[1].split('&')[0];
  }

  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // fallback to original URL
  return zipFile;
};

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL, // your email
      pass: process.env.SMTP_PASS,  // your app password
    },
  });
};

// Send download links email after successful payment
export const sendDownloadEmail = async (userEmail, userName, orderItems, orderId) => {
  try {
    const transporter = createTransporter();

    // Filter items that have downloadable content
    const downloadableItems = orderItems.filter(item => item.zipFile);

    if (downloadableItems.length === 0) {
      console.log('No downloadable items in this order');
      return;
    }

    // Create download links HTML
    const downloadLinksHTML = downloadableItems.map(item => {
      const downloadUrl = buildDownloadUrl(item.zipFile, item.zipFileType);

      return `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
          <h3 style="color: #333; margin: 0 0 10px 0;">${item.name}</h3>
          <p style="color: #666; margin: 5px 0;">Quantity: ${item.quantity}</p>
          <a href="${downloadUrl}" 
             style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;"
             target="_blank">
            Download 3D Model
          </a>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">
            ${item.zipFileType === 'drive_link' ? 'This link will open in Google Drive' : 'Direct download link'}
          </p>
        </div>
      `;
    }).join('');

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: userEmail,
      subject: `Your 3D Assets are Ready for Download - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Your 3D Assets Are Ready!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
            
            <p style="color: #666; line-height: 1.6;">
              Your payment has been confirmed and your 3D assets are now ready for download! 
              Below are the download links for each item in your order.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Order #${orderId}</h2>
              ${downloadLinksHTML}
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">📝 Important Notes:</h3>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>Download links are valid for 30 days from the date of purchase</li>
                <li>Please save the files to your computer immediately after download</li>
                <li>For Google Drive links, make sure you're logged into your Google account</li>
                <li>If you have any issues downloading, please contact our support team</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders" 
                 style="display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View My Orders
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>Need help? Contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #007bff;">${process.env.SUPPORT_EMAIL}</a></p>
              <p>© 2024 Your 3D Assets Store. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Download email sent successfully to:', userEmail);
    
  } catch (error) {
    console.error('Error sending download email:', error);
    throw error;
  }
};
