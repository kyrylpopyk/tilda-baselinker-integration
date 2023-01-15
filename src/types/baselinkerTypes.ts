export type Currency = "USD" | "PLN" | "HUF" | "EUR";

export type CountriesCode = "EN" | "PL" | "HU";

export interface Product {
    storage: string,
    storage_id: number,
    product_id: string,
    variant_id: number,
    name: string,
    sku: string,
    ean : string,
    location: string,
    warehouse_id: number,
    attributes: string,
    price_brutto: number,
    tax_rate: number,
    quantity: number,
    weight: number
}

export interface NewOrderData {
    order_status_id: number,
    custom_source_id: number,
    date_add: number,
    currency: Currency,
    payment_method: string,
    payment_method_cod: 0 | 1,
    paid: 0 | 1,
    user_comments?: string,
    admin_comments?: string,
    email: string,
    phone: string,
    user_login: string,
    delivery_method: string,
    delivery_price: number,
    delivery_fullname: string,
    delivery_company: string,
    delivery_address: string,
    delivery_postcode: string,
    delivery_city: string,
    delivery_country_code: CountriesCode,
    delivery_point_id: string,
    delivery_point_name: string,
    delivery_point_address: string,
    delivery_point_postcode: string,
    delivery_point_city: string,
    invoice_fullname: string,
    invoice_company: string,
    invoice_nip: string,
    invoice_address: string,
    invoice_postcode: string,
    invoice_city: string,
    invoice_country_code: CountriesCode,
    want_invoice: 0 | 1,
    extra_field_1: string,
    extra_field_2: string,
    custom_extra_fields: any[],
    products: Product[]
}