import url, {URLSearchParams} from 'url';
import dotenv from "dotenv";
import { NewOrderData } from '../../types/baselinkerTypes';
import { convertOrderParams } from '../baselinkerHelper';
import fetch from 'node-fetch';
import { pause } from '../pause';

dotenv.config();

class BaselinkerApiController {
    private token = process.env.BASELINKERTOKEN ? process.env.BASELINKERTOKEN : "";

    private createHeader(): any {
        return {
            'X-BLToken': this.token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
    
    public async addNewOrder(body: any): Promise<boolean> {
        const params = await this.generateBaselinkerRequestConfig("addOrder", convertOrderParams(body));
        const response = await fetch("https://api.baselinker.com/connector.php", {method: "POST", body: params, headers: this.createHeader() })//await axios.post("https://api.baselinker.com/connector.php", params, options);
        const data = await response.json() as any;
        if(data.status === "SUCCESS") {
            return true;
        } else {
            return false;
        }
    }

    public async updateOrderPayment(orderId: number, paymentDone: number): Promise<boolean> {
        const params = await this.generateBaselinkerRequestConfig("setOrderPayment", {
            "order_id": orderId,
            "payment_done": paymentDone,
            "payment_date": new Date().getTime(),
            "payment_comment": ""
        });
        const response = await fetch("https://api.baselinker.com/connector.php", {method: "POST", body: params, headers: this.createHeader() })
        const resData = await response.json();

        if(resData.status === "SUCCESS") {
            return true;
        }
        throw new Error(`Error! Function ${this.updateOrderPayment.name}. Baselinker error: ${resData.error_message}. Baselinker order id: ${orderId}.`);
    }

    public async getOrderByOrderIdExtraField(dateFrom: number, lookingExtraField: string) {
        const ordersList = await this.getListOfOrders(dateFrom);
        let lookingOrder: any = undefined;

        for(let order of ordersList) {
            if(order.extra_field_1 === lookingExtraField) {
                lookingOrder = order;
            }
        }

        if(!lookingOrder) {
            throw new Error("Error! Can not find order in baselinker by tilda order id. It could be a consequence of small order looking time period");
        }

        return lookingOrder
    }

    private async getListOfOrders(date: number): Promise<any[]> { // date cointaine date in timestamp
        return new Promise(async (res, rej) => {
            let orders: any[] = [];

            let params = await this.generateBaselinkerRequestConfig("getOrders", {
                "get_unconfirmed_orders": "true",
                "date_from": date
            });

            const responce = await fetch('https://api.baselinker.com/connector.php', {method: "POST", body: params, headers: this.createHeader()})
            const responceData = await responce.json();
                orders = orders.concat(responceData.orders);
                if(responceData.orders.length === 100) {
                    date = responceData.orders[responceData.orders.length - 1].date_confirmed + 1;
                    orders = orders.concat(await this.getListOfOrders(date));
                }
                res(orders);
        })
    }

    private async generateBaselinkerRequestConfig(method: string, params?: Object): Promise<string> {
        await pause(1000);
        return new url.URLSearchParams({
            "method": method,
            "parameters": params ? JSON.stringify(params) : ""
        }).toString();
    }
}

export default new BaselinkerApiController();