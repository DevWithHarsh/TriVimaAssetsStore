import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

function Orders() {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            item['amount'] = order.amount;
            item['couponDiscount'] = order.couponDiscount;
            item['couponCode'] = order.couponCode;
            // Add zipFile and zipFileType from the enriched items
            item['zipFile'] = item.zipFile || null;
            item['zipFileType'] = item.zipFileType || 'upload';
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleWriteReview = (productId, orderId) => {
    navigate(`/write-review?productId=${productId}&orderId=${orderId}`);
  };

  // Download handler for 3D assets
  const handleDownload = async (zipFile, zipFileType, productName) => {
    if (!zipFile) {
      toast.error('No download file available for this product');
      return;
    }

    try {
      if (zipFileType === 'drive_link') {
        // Extract file ID from Google Drive URL
        let fileId = '';

        // Handle different Google Drive URL formats
        if (zipFile.includes('/file/d/')) {
          // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
          fileId = zipFile.split('/file/d/')[1].split('/')[0];
        } else if (zipFile.includes('id=')) {
          // Format: https://drive.google.com/uc?export=download&id=FILE_ID
          fileId = zipFile.split('id=')[1].split('&')[0];
        }

        if (fileId) {
          // Create proper download URL
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

          // Try direct download first
          try {
            const response = await fetch(downloadUrl);

            if (response.ok) {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${productName.replace(/[^a-zA-Z0-9]/g, '_')}_3D_Model.zip`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
              toast.success('Download started!');
            } else {
              // If direct download fails, open in new tab
              window.open(downloadUrl, '_blank');
              toast.info('Opening Google Drive download...');
            }
          } catch (fetchError) {
            // Fallback to opening in new tab
            window.open(downloadUrl, '_blank');
            toast.info('Opening Google Drive download...');
          }
        } else {
          // If we can't extract file ID, try the original URL
          window.open(zipFile, '_blank');
          toast.info('Opening download link...');
        }

      } else {
        // For uploaded files, direct download
        const response = await fetch(zipFile);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${productName.replace(/[^a-zA-Z0-9]/g, '_')}_3D_Model.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success('Download started!');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again or contact support.');
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center gap-4'
          >
            {/* Left: Product Info */}
            <div className='flex items-start gap-6 flex-[1]'>
              <img className='w-16 sm:w-20' src={item.image[0]} alt='' />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                  <p className='text-lg font-semibold'>
                    Order Total: {currency}{item.amount}
                    {item.couponDiscount > 0 && (
                      <span className='text-green-600 text-sm ml-2'>
                        (Coupon Discount: -{currency}{item.couponDiscount} {item.couponCode ? `(${item.couponCode})` : ''})
                      </span>
                    )}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                <p className='mt-2'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
              </div>
            </div>

            {/* Center: Order Status */}
            <div className='flex justify-center items-center flex-[1]'>
              <div className='flex items-center gap-2'>
                <span className={`w-2 h-2 rounded-full ${
                  item.status === 'Completed' ? 'bg-green-500' :
                  item.status === 'Digital Asset Ready' ? 'bg-blue-500' :
                  item.status === 'Processing' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}></span>
                <span className='text-sm md:text-base'>{item.status}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className='flex justify-end flex-[1] gap-2 flex-wrap'>
              {/* Download Button - Show only for paid orders */}
              {item.payment && item.zipFile && (
                <button
                  onClick={() => handleDownload(item.zipFile, item.zipFileType, item.name)}
                  className='bg-green-600 text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-green-700 transition-colors'
                  title={item.zipFileType === 'drive_link' ? 'Download from Google Drive' : 'Download ZIP file'}
                >
                  Download 3D Asset
                </button>
              )}

              {/* Show Write Review button only for completed orders */}
              {item.status === 'Completed' && (
                <button
                  onClick={() => handleWriteReview(item._id, item.orderId)}
                  className='bg-black text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors'
                >
                  Write Review
                </button>
              )}

              {/* Show payment pending message for unpaid orders */}
              {!item.payment && (
                <div className='text-red-600 text-sm font-medium px-4 py-2'>
                  Payment Pending
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {orderData.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No orders found</p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default Orders;