import { ZonosCart, ZonosConfig } from "./types.ts";

/*
    * Zonos API
    A basic integration with the zonos rest api. 
    This will allow you to quickly get started with our API and start creating and managing orders.
*/
export class Zonos {
    constructor(private config: ZonosConfig) {
        if (!config.apiUrl) {
            this.config = {
                ...config,
                apiVersion: config.apiVersion ?? "2",
                apiUrl: `https://api.iglobalstores.com/v${config.apiVersion}`,
            };
        }
    }

    private buildApiUrl(): void {
        this.config = {
          ...this.config,
          apiVersion: this.config.apiVersion ?? "2",
          apiUrl: `https://api.iglobalstores.com/v${this.config.apiVersion}`,
        };
    }

    setVersion(version: string | number): void {
        this.config = {
          ...this.config,
          apiVersion: version.toString(),
        };
        this.buildApiUrl();
    }

    setCorsProxy(proxy: string): void {
        this.config = {
            ...this.config,
            corsProxy: proxy,
        };
    }

    async directApiCall(
        path: string,
        body: any,
        method: string = "POST"
    ): Promise<any> {
        const url: string = this.config.corsProxy ? `${this.config.corsProxy}/${this.config.apiUrl}/${path}` : `${this.config.apiUrl}/${path}`;
        try{
        const apiResponse = await fetch(url, {
            headers: {
            "Content-Type": "application/json",
            },
            method,
            body: JSON.stringify({
            ...body,
            store: this.config.account_number.toString(),
            secret: this.config.api_key,
            }),
        })
            .then((result) => result.json())
            .catch((error: any) => {
            console.log(error);
            return error;
            });
            return apiResponse;
        } catch (error) {
            console.log(error);
            return error;
        }
        
    }

    async getOrder(
        id: string | number,
        isReferenceId?: boolean
    ): Promise<any> {
        if (!id) return { error: "orderId or referenceId is required" };

        const searchParamiters = isReferenceId
            ? { referenceId: id.toString() }
            : { orderId: id.toString() };

        return await this.directApiCall("orderDetail", searchParamiters);
    }

    async getOrders(
        options?: { 
            sinceDate?: string, 
            statuses?: boolean, 
            missingMerchantOrderId?: boolean 
        }
    ): Promise<any> {
        const { sinceDate, statuses, missingMerchantOrderId } = options || {};
        return await this.directApiCall("orderNumbers", {
            sinceDate,
            statuses,
            missingMerchantOrderId,
        });
    }

    async updateOrderStatus(
        orderId: string | number,
        status: string
    ): Promise<any> {
        const statusMap = {
            preparing: "VENDOR_PREPARING_ORDER",
            ready: "VENDOR_SHIPMENT_READY",
            printed: "VENDOR_LABELS_PRINTED_DATE",
            cancelled: "VENDOR_CANCELLATION_REQUEST",
            completed: "VENDOR_END_OF_DAY_COMPLETE",
        };
        const statusValue = statusMap[status] ?? status;

        this.setVersion(1);

        return await this.directApiCall("updateVendorOrderStatus", {
            orderId: orderId.toString(),
            orderStatus: statusValue,
        });
    }

    async updateOrderNumber(
        orderId: string | number,
        merchantOrderId: string | number
    ): Promise<any> {
        this.setVersion(1);

        return await this.directApiCall("updateMerchantOrderId", {
            orderId: orderId.toString(),
            merchantOrderId: merchantOrderId.toString(),
        });
    }

    async updateOrderTracking(
        orderId: string | number,
        trackingNumber: string
    ): Promise<any> {
        this.setVersion(2);

        return await this.directApiCall("setShipmentTracking", {
            orderId: orderId.toString(),
            trackingList: [{ numbers: trackingNumber }],
        });
    }

    /* 
        CreateCheckout
        Creates a checkout for a customer.
        This will return a checkout url that you can redirect the customer to.
        
        Passing in a country code will set the default country for the checkout (customers can change this in checkout). 
        If no code is specificed, the country will be set to the defualt specified for your store in the zonos dashboard. 
    */
    async createCheckout(cart: ZonosCart, countryCode?: string){
        this.setVersion(1);
        if(!cart.storeId){ cart.storeId = this.config.account_number.toString(); }
        if(!countryCode){ countryCode = ""; }

        const tempCart = await this.directApiCall(
            "createTempCart",
            cart
        );

        if(tempCart.tempCartUUID){
            return {
                "tempCartUUID": tempCart.tempCartUUID,
                "redirectUrl": `https://checkout.iglobalstores.com/?tempCartUUID=${tempCart.tempCartUUID}&country=${countryCode}`
            };
        }
        return tempCart;
    }
    

    /* end CheckoutApi */
}