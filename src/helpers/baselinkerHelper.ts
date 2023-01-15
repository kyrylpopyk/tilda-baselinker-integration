import { AdditionalProduct, additionalProducts } from "../public/db/additionalProducts";
import { CountriesCode, Currency, NewOrderData, Product } from "../types/baselinkerTypes";


export function convertOrderParams(body: any): NewOrderData {
    const deliveryOptions: string[] = (body.deliveryOptions as string).split("=")[0].split(",");
    const name = `${body.name} ${body.surname}`;

    let newOrderData: NewOrderData = {
        currency: getCurrency(body),
        custom_source_id: Number.parseInt(body.payment.orderid),
        custom_extra_fields: [],
        date_add: new Date().getTime(),
        delivery_address: "adress should be added to a form",
        delivery_city: body.CITY,
        delivery_company: "",
        phone: body.phone,
        delivery_country_code: getCountryCode(body),
        delivery_fullname: name,
        delivery_method: deliveryOptions.includes("standard") ? "Standard" : "Express",
        delivery_point_address: "",
        delivery_point_city: "",
        delivery_point_id: "",
        delivery_point_name: "",
        delivery_point_postcode: "",
        delivery_postcode: "postcode should be added to a form",
        delivery_price: 0,
        email: "email should be added to a form",
        extra_field_1: body.payment.orderid,
        extra_field_2: "",
        invoice_address: "adress should be added to a form",
        invoice_city: body.CITY,
        invoice_company: "",
        invoice_country_code: getCountryCode(body),
        invoice_fullname: name,
        invoice_nip: "",
        invoice_postcode: "postcode should be added to a form",
        order_status_id: 166416, // New Orders
        paid: 0,
        payment_method: body.paymentsystem,
        payment_method_cod: body.paymentsystem === "cash" ? 1 : 0,
        products: generateProducts(body),
        admin_comments: "",
        user_login: "",
        want_invoice: 0,
        user_comments: ""
    }

    return newOrderData;
}

function getCurrency(params: any): Currency {
    switch(params.formid) {
        case "form526328071":
            return "PLN";
        default:
            throw new Error(`Error! Error with order ${params}.\n Please add validation to ${getCurrency.name} function with ${params.formid}`)
    }
}

function getCountryCode(params: any): CountriesCode {
    switch(params.formid) {
        case "form526328071":
            return "PL";
        default:
            throw new Error(`Error! Error with order ${params}.\n Please add validation to ${getCurrency.name} function with ${params.formid}`)
    }
}

function generateProducts(body: any): Product[] {
    const orderData: any = body.payment;
    let products: Product[] = (orderData.products as any[]).map( productData => {
        let attributes = productData.options ? (productData.options as any[]).map( option => `${option.option} - ${option.variant}`).join(" ; "): "";

        return {
            weight: 0,
            attributes,
            ean: "",
            location: "",
            name: productData.name,
            price_brutto: productData.price,
            product_id: "",
            quantity: productData.quantity,
            sku: productData.sku ? productData.sku : "",
            storage: "",
            storage_id: 0,
            tax_rate: 0,
            variant_id: 0,
            warehouse_id: 0
        } as Product;
    });

    try {
        const additionalProducts: Product[] = generateAdditionalProductsArray(body.deliveryOptions).map( productData => {
            return {
                weight: 0,
                attributes: "",
                ean: "",
                location: "",
                name: productData[0],
                price_brutto: productData[1],
                product_id: "",
                quantity: 1,
                sku: "",
                storage: "",
                storage_id: 0,
                tax_rate: 0,
                variant_id: 0,
                warehouse_id: 0
            } as Product;
        })
        products = [...products, ...additionalProducts];
    } catch(e: any) {
        throw new Error(`Error! ${e.message}`)
    }

    return products;
}

function generateAdditionalProductsArray(deliveryOptions: string): any[][] {
    let [productsString, priceString] = deliveryOptions.split("=");
    let products: any[][] = productsString.split(",").map( productName => {
        for(let additionalProductName of Object.keys(additionalProducts)) {
            const additionalProduct = (additionalProducts as any)[additionalProductName] as AdditionalProduct;
            if(additionalProduct.ProductTypeId === productName) {
                return [additionalProduct.ProductTitle, additionalProduct.ProductPrice]
            }
        }

        throw new Error(`Additional Products variable does not contain description for "${productName}"\n\nAdditional Products variable data - ${additionalProducts}`);
    })

    return products;
}
