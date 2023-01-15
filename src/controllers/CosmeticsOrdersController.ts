import {Request, Response, NextFunction} from "express-serve-static-core";
import baselinkerApi from "../helpers/apis/BaselinkerApi";

class CosmeticsOrdersController {
    public async processOrder(req: Request, res: Response) {
        const orderWasAdded = await baselinkerApi.addNewOrder(req.body);
        // console.log(JSON.stringify(req.body))
        if(orderWasAdded) {
            res.status(200).send("Order was added")
        } else {
            res.status(501).send("Order was not added")
        }
    }
    public async processPayment(req: Request, res: Response) {
      const body = req.body;
      if(body.data.object.captured) {
        const capturedAmount = Number.parseFloat(body.data.object.amount_captured) / 100;
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const utcTime = Math.trunc(date.getTime() / 1000);
        const lookingOrder = await baselinkerApi.getOrderByOrderIdExtraField(utcTime, body.data.object.metadata.invoiceid);
        const success = await baselinkerApi.updateOrderPayment(lookingOrder.order_id as number, capturedAmount);
        if(success) {
          res.status(200).send("Payment was uppdated");
        }
      }
    }
}

export default new CosmeticsOrdersController();
/* Payment from stripe "OK"
{
  "id": "evt_3MIfB5JZvEUzPr1D1iW3EcIO",
  "object": "event",
  "api_version": "2019-09-09",
  "created": 1671916987,
  "data": {
    "object": {
      "id": "ch_3MIfB5JZvEUzPr1D1RaQSc4Z",
      "object": "charge",
      "amount": 60900,
      "amount_captured": 60900,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "application_fee_amount": null,
      "balance_transaction": "txn_3MIfB5JZvEUzPr1D1HXvUNuM",
      "billing_details": {
        "address": {
          "city": null,
          "country": "PL",
          "line1": null,
          "line2": null,
          "postal_code": null,
          "state": null
        },
        "email": "kyrylpopyk@gmail.com",
        "name": "pekao pOPYK",
        "phone": null
      },
      "calculated_statement_descriptor": "GLOBAL TRENDLINE",
      "captured": true,
      "created": 1671916986,
      "currency": "pln",
      "customer": "cus_N2kgnjKCyPIxtQ",
      "description": "Order # 1922419209 from pl.robeauty.me",
      "destination": null,
      "dispute": null,
      "disputed": false,
      "failure_balance_transaction": null,
      "failure_code": null,
      "failure_message": null,
      "fraud_details": {},
      "invoice": null,
      "livemode": false,
      "metadata": {
        "projectid": "6512256",
        "invoiceid": "1922419209"
      },
      "on_behalf_of": null,
      "order": null,
      "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "risk_score": 6,
        "seller_message": "Payment complete.",
        "type": "authorized"
      },
      "paid": true,
      "payment_intent": "pi_3MIfB5JZvEUzPr1D1WjpOwAB",
      "payment_method": "pm_1MIfBNJZvEUzPr1DHZAfqcDS",
      "payment_method_details": {
        "card": {
          "brand": "mastercard",
          "checks": {
            "address_line1_check": null,
            "address_postal_code_check": null,
            "cvc_check": "pass"
          },
          "country": "US",
          "exp_month": 6,
          "exp_year": 2026,
          "fingerprint": "M3z92u7HdFikEQkq",
          "funding": "credit",
          "installments": null,
          "last4": "4444",
          "mandate": null,
          "network": "mastercard",
          "three_d_secure": null,
          "wallet": null
        },
        "type": "card"
      },
      "receipt_email": null,
      "receipt_number": null,
      "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xRlBjSmlKWnZFVXpQcjFEKLzbnZ0GMgZvdAGRQdo6LBYDwHH4iL855DP9qRV4W8rvsfW6RkaigoR1cuDBXtjawQKoOGWJjCD9IIgf",
      "refunded": false,
      "refunds": {
        "object": "list",
        "data": [],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_3MIfB5JZvEUzPr1D1RaQSc4Z/refunds"
      },
      "review": null,
      "shipping": null,
      "source": null,
      "source_transfer": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
  },
  "livemode": false,
  "pending_webhooks": 4,
  "request": {
    "id": "req_4UqGvrXzG8qZzz",
    "idempotency_key": "2d6761a1-a4e2-4765-b618-d257d932120a"
  },
  "type": "charge.succeeded"
}
*/

/* Payment from stripe error
{
  "id": "evt_3MIf8SJZvEUzPr1D1mpj86Po",
  "object": "event",
  "api_version": "2019-09-09",
  "created": 1671916820,
  "data": {
    "object": {
      "id": "ch_3MIf8SJZvEUzPr1D1NkU9GXO",
      "object": "charge",
      "amount": 63130,
      "amount_captured": 0,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "application_fee_amount": null,
      "balance_transaction": null,
      "billing_details": {
        "address": {
          "city": null,
          "country": "PL",
          "line1": null,
          "line2": null,
          "postal_code": null,
          "state": null
        },
        "email": "kyrylpopyk@gmail.com",
        "name": "pekao pOPYK",
        "phone": null
      },
      "calculated_statement_descriptor": "GLOBAL TRENDLINE",
      "captured": false,
      "created": 1671916820,
      "currency": "pln",
      "customer": "cus_N2kdTFLFiixEp7",
      "description": "Order # 1906949921 from pl.robeauty.me",
      "destination": null,
      "dispute": null,
      "disputed": false,
      "failure_balance_transaction": null,
      "failure_code": "card_declined",
      "failure_message": "Your card has insufficient funds.",
      "fraud_details": {},
      "invoice": null,
      "livemode": false,
      "metadata": {
        "projectid": "6512256",
        "invoiceid": "1906949921"
      },
      "on_behalf_of": null,
      "order": null,
      "outcome": {
        "network_status": "declined_by_network",
        "reason": "insufficient_funds",
        "risk_level": "normal",
        "risk_score": 26,
        "seller_message": "The bank returned the decline code `insufficient_funds`.",
        "type": "issuer_declined"
      },
      "paid": false,
      "payment_intent": "pi_3MIf8SJZvEUzPr1D1FOmSNLn",
      "payment_method": "pm_1MIf8gJZvEUzPr1DDngViKBN",
      "payment_method_details": {
        "card": {
          "brand": "visa",
          "checks": {
            "address_line1_check": null,
            "address_postal_code_check": null,
            "cvc_check": "pass"
          },
          "country": "US",
          "exp_month": 6,
          "exp_year": 2026,
          "fingerprint": "k1oVw9kAB1VPB3n9",
          "funding": "credit",
          "installments": null,
          "last4": "9995",
          "mandate": null,
          "network": "visa",
          "three_d_secure": null,
          "wallet": null
        },
        "type": "card"
      },
      "receipt_email": null,
      "receipt_number": null,
      "receipt_url": null,
      "refunded": false,
      "refunds": {
        "object": "list",
        "data": [],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_3MIf8SJZvEUzPr1D1NkU9GXO/refunds"
      },
      "review": null,
      "shipping": null,
      "source": null,
      "source_transfer": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "failed",
      "transfer_data": null,
      "transfer_group": null
    }
  },
  "livemode": false,
  "pending_webhooks": 5,
  "request": {
    "id": "req_1Ca7opaAE16jYW",
    "idempotency_key": "adf63299-65a9-4a1b-91ce-31d07eb0ef12"
  },
  "type": "charge.failed"
}
*/

/* Order from tilda
{
  "name": "Test",
  "surname": "Test",
  "CITY": "Cracow",
  "phone": "+48 (881) 719-668",
  "spices": "Peeling do twarzy 79zl",
  "deliveryOptions": "ubezpieczenie,niespodzianka,gwarancja,express,pobranie=105.3",
  "paymentsystem": "cash",
  "payment": {
    "orderid": "2040504151",
    "products": [
      {
        "name": "Samoopalacz",
        "quantity": 2,
        "amount": 1180,
        "price": "590",
        "sku": "tno",
        "options": [
          {
            "option": "Pojemność",
            "variant": "100"
          }
        ]
      },
      {
        "name": "Gorący peeling 129zl",
        "quantity": 1,
        "amount": 129,
        "price": "129"
      },
      {
        "name": "Samoopalacz 129zl",
        "quantity": 1,
        "amount": 129,
        "price": "129"
      },
      {
        "name": "Peeling do twarzy 79zl",
        "quantity": 1,
        "amount": 79,
        "price": "79"
      }
    ],
    "amount": "1622.3",
    "subtotal": "1517",
    "delivery": "ubezpieczenie,niespodzianka,gwarancja,express,pobranie",
    "delivery_price": 105.3,
    "delivery_fio": "",
    "delivery_address": "",
    "delivery_comment": ""
  },
  "formid": "form526328071",
  "formname": "Cart"
}
*/