// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Devise } from "../_models/devise.model"

const API_URL = environment.apiUrl + "/devises"
const API_URL_EXR = environment.apiUrl + '/exchange-rates'

@Injectable()
export class DeviseService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(devise: Devise) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL, devise, { headers: httpHeaders })
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

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
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

    public getByExr(data:any){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_EXR}/find`,data, { headers: httpHeaders })
    }

    public addExr(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_EXR, data, { headers: httpHeaders })
    }

    public getExRate(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_EXR + '/getExRate', data, { headers: httpHeaders })
    }
    
}
