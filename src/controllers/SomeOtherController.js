const puppeteer = require( 'puppeteer');
const fs = require('fs');
const path = require("path");
const { Order, OrderItem, OrderPayment, Customer, Client, ClientShops, ProductType, ClientProductType } = require('../db/Schema');
const {dateformator} = require("./dateformator");
// myEmitter.setMaxListeners(15);
module.exports.printApi = async (req,res) =>{
    try{
    const id = req.params.orderId;
     const [orderData, orderItemData, orderPaymentData] = await Promise.all([
        Order.findOne({ _id: id }).select('id ClientId CustomerId ShopId OrderPlacedDate ExpectedCompletionDate'),
        OrderItem.find({ OrderId: id }).select('ProductTypeId ItemCost ItemDiscount ItemSalesTax'),
        OrderPayment.find({ OrderId: id }).select('PaymentAmount')
    ]);
    const [customerData, clientData, storeData] = await Promise.all([
        Customer.findOne({ _id: orderData.CustomerId }).select('FullName'),
        Client.findOne({ _id: orderData.ClientId }).select('LogoUrl'),
        ClientShops.findOne({ _id: orderData.ShopId }).select('StoreName PrimaryContactName PrimaryContactPhone PrimaryContactEmail Address City')
    ]);
    const ProductTypeId = orderItemData.map(item=> item.ProductTypeId);
    const Productdata = await ClientProductType.find({_id: {$in:ProductTypeId}});
    console.log(ProductTypeId);
    console.log(Productdata);

    const orderItems = orderItemData.map(item =>{
        const productdata = Productdata.filter(product => item.ProductTypeId == product._id);
        // console.log(item);
        // console.log(productdata[0]);
        const itemd = item.toObject();
        const poddata = productdata[0].toObject();
        return {...itemd,...poddata}
    })
    console.log(orderItems);
    const EmptyRows = new Array(65-orderItems.length).fill(0);


const imagePath = path.join(__dirname,`../../${clientData.LogoUrl}`);
console.log(imagePath);


const base64img = await convertImageToBase64(imagePath);

// console.log(base64img)

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Example of generating a simple PDF
  const Advance = orderPaymentData.reduce((acc,item)=> acc+item.PaymentAmount,0);
  const Total = orderItems.reduce((acc,item)=> acc+item.ItemCost,0)

   await page.setContent(`<html>
    <head>
    
        <title>Bill Print</title>
    </head>
    <body style="margin:0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
        <div style="margin: 5px 10px">
            <div  style="background-color:#891555e2 ;
                color: white;
                padding: 0px 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;">
                <div style="text-align: center;">
                    <h1 style="margin: 2px 0px;">${storeData.StoreName}</h1>
                    <h2 style="margin: 2px 0px; font-size: medium;">Fashion Designing <br> Trailor & EMB</h2>
                </div>
                <div class="me-3">
                    <img src="data:image/png;base64,${base64img}" width="70" height="70" style="border-radius: 50%" width:100px; height:100px; />
                </div>
            </div>
            <div style="text-align: center; border-bottom: 2px solid; border-color: #891555e2; padding: 2px 0px; color: #891555e2; font-size: larger;">
                <h3 style="margin: 2px 0px">${storeData.PrimaryContactName}: ${storeData.PrimaryContactPhone}</h3>
                <p style="margin: 2px 0px">Email: ${storeData.PrimaryContactEmail}</p>
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div style="display: flex; justify-content: start; width: 25%;">
                    <h5 style="margin: 0px 3px; color: #891555;">No.</h5>
                    <div style="border-bottom: 1px solid #891555; width: 100%; text-align:center"> ${orderData.id} </div>
                </div>
                <div style="display: flex; justify-content: start; width: 30%;">
                    <h5 style="margin: 0px 3px; width: 170px; color: #891555;">Booking Date.</h5>
                    <div style="border-bottom: 1px solid #891555; width: 100%; text-align:center"> ${dateformator(orderData.OrderPlacedDate)} </div>
                </div>
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between; ">
                <div style="display: flex; justify-content: start; width: 70%;">
                    <h5 style="margin: 0px 3px; width: 75px; color: #891555;">Mr. & Mrs.</h5>
                    <div style="border-bottom: 1px solid #891555; width: 100%; padding-left: 10px"> ${customerData.FullName} </div>
                </div>
                <div style="display: flex; justify-content: start; width: 30%;">
                    <h5 style="margin: 0px 3px; width: 170px; color: #891555;">Delivery Date.</h5>
                    <div style="border-bottom: 1px solid #891555; width: 100%; text-align:center"> ${dateformator(orderData.ExpectedCompletionDate)} </div>
                </div>
            </div>
            <div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <thead>
            <tr>
            <th style="border: 2px solid #891555; width: 5%; padding: 8px 5px; border-right: 2px solid white; background-color: #891555;"><span style="background-color: white; color: #891555; padding: 5px; border-radius: 7px;">Qty.</span></th>
            <th style="border: 2px solid #891555; width: 70%; padding: 8px 5px; border-right: 2px solid white; background-color: #891555;"><span style="background-color: white; color: #891555; padding: 5px; border-radius: 7px;">Particular</span></th>
            <th style="border: 2px solid #891555; padding: 8px 5px; border-right: 2px solid white; background-color: #891555;"><span style="background-color: white; color: #891555; padding: 5px; border-radius: 7px;">Rate</span></th>
            <th style="border: 2px solid #891555; padding: 8px 5px; background-color: #891555;"><span style="background-color: white; color: #891555; padding: 5px; border-radius: 7px;">RateAmount</span></th>
            </tr>
            </thead>
            
        <tbody>
        ${orderItems.map(item=>`<tr>
                <td style="border-left: 2px solid #891555; width: 5%; padding: 5px; border-right: 2px solid #891555; text-align: center;">1</td>
                <td style="border-left: 2px solid #891555; width: 70%; padding: 5px; border-right: 2px solid #891555; text-align: center;">${item.Title}</td>
                <td style="border-left: 2px solid #891555; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
                <td style="border-left: 2px solid #891555; padding: 5px; border-right: 2px solid #891555; text-align: center;">${item.ItemCost}</td>
            </tr>`).join('')}
        ${EmptyRows.map(item=>`<tr>
                <td style="border-left: 2px solid #891555; width: 5%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
                <td style="border-left: 2px solid #891555; width: 70%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
                <td style="border-left: 2px solid #891555; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
                <td style="border-left: 2px solid #891555; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            </tr>`).join('')}
            
        </tbody>
        <tfoot>
        <tr>
            <td style=" border-left: 2px solid #891555; width: 5%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            <td style=" border-left: 2px solid #891555; width: 70%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            <td style="border: 2px solid #891555; padding: 5px;  text-align: center; font-weight: bold; color: #891555;">Advance</td>
            <td style="border: 2px solid #891555; padding: 5px;  text-align: center;">${Advance}</td>
        </tr>
        <tr>
            <td style=" border-left: 2px solid #891555; width: 5%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            <td style=" border-left: 2px solid #891555; width: 70%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            <td style="border: 2px solid #891555; padding: 5px;  text-align: center; font-weight: bold; color: #891555;">Total</td>
            <td style="border: 2px solid #891555; padding: 5px;  text-align: center;">${Total}</td>
        </tr>
        <tr>
            <td style="border-bottom: 2px solid #891555; border-left: 2px solid #891555; width: 5%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            <td style="border-bottom: 2px solid #891555; border-left: 2px solid #891555; width: 70%; padding: 5px; border-right: 2px solid #891555; text-align: center;"></td>
            <td style="border: 2px solid #891555; padding: 5px;  text-align: center; font-weight: bold; color: #891555;">To Paid</td>
            <td style="border: 2px solid #891555; padding: 5px;  text-align: center;">${Total-Advance}</td>
        </tr>
    </tfoot>
       
    </table>

            </div>
            <div style="display: flex; justify-content: space-between; color: #891555; font-weight: 600; margin-Top:20px">
                <div>
                    <p>
                        ${storeData.Address} ${storeData.City}
                    </p>

                </div>

                <div style="align-self: center; text-align: left; width: 25%;">

                    <div style="display: flex; font-weight: 600; justify-content: start; ">
                        <h4 style="margin: 0px 3px; ">Signature.</h4>
                        <div style="border-bottom: 2px solid #891555; width: 100%;"> </div>
                    </div>
                </div>
            </div>
            
            

        </div>

    </body>
</html>`);

await page.emulateMediaType('screen');
  const pdfBuffer = await page.pdf({
        format: 'A4', // Paper format
        printBackground: true ,// Whether to print background graphics
        preferCSSPageSize:true
    });
  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
  res.status(200).send(pdfBuffer);
  }catch(e){
        console.error(e);
    }
}
function convertImageToBase64(imagePath) {
    // Read the image file
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                // Convert data to base64
                const base64Data = Buffer.from(data).toString('base64');
                resolve(base64Data);
            }
        });
    });
    
}