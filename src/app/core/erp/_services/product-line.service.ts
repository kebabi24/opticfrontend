// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { ProductLine} from "../_models/product-line.model"

const API_URL = environment.apiUrl + "/productlines"

@Injectable()
export class ProductLineService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(ProductLine: ProductLine) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL, ProductLine, { headers: httpHeaders })
    }
    // READ 
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })

        
        
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findOne`,data, { headers: httpHeaders })

        
        
    }
    // UPDATE
    public update(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`,data, { headers: httpHeaders })
    }
    // DELETE
    public delete(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders })
    }
}
