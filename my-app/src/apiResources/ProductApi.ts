

import { HTTP } from '@/HTTPServices';
import { BaseApi } from '@/apiResources/BaseApi';
import { Product } from '@/models/Product';
class ProductApi extends BaseApi {
    
    search(): Promise<Product[]> {
        return new Promise<Product[]>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/products`, { params: {} })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    insert(product: Product): Promise<Product> {
        return new Promise<Product>((resolve: any, reject: any) => {
            HTTP.post(`api/product`,product)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    update(productId: number, baiHatID: number, product: Product): Promise<Product> {
        return new Promise<Product>((resolve: any, reject: any) => {
            HTTP.put(`api/product/${productId}/${baiHatID}`, product)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
    delete(productId: number): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.delete(`api/v1/products/${productId}`)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
}
export default new ProductApi();
