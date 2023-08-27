// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL_TAG = environment.apiUrl + "/tags"
const API_URL = environment.apiUrl + "/inventory-transactions"

@Injectable()
export class InventoryManagementService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public createPhysicalInventoryTag(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG, data, { headers: httpHeaders })
    }
    public add(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG+ '/new', data, { headers: httpHeaders })
    }
    public getTag(data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG + '/find', data, { headers: httpHeaders })
    }
    public updateTag(id, data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_TAG +`/${id}`, data, { headers: httpHeaders }) 
    }
    public ReupdateTag(ids, data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_TAG +`/${ids}`, data, { headers: httpHeaders }) 
    }

    public getLastIdTag(data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG + '/findlastid', data, { headers: httpHeaders })
    }
    public getGap(data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG + '/gap', data, { headers: httpHeaders })
    }
    public freezeInventory(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG+'/freeze', data, { headers: httpHeaders })
    }
    public validateTag(data){ 
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG+'/validate', data, { headers: httpHeaders })
    }
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_TAG, { headers: httpHeaders })
    }
    public inventoryOfDate(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventoryOfDate',data, { headers: httpHeaders })
    }
    public inventoryActivity(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventoryactivity',data, { headers: httpHeaders })
    }
    public inventoryByLoc(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventorybyloc',data, { headers: httpHeaders })
    }
    public inventoryByStatus(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventorybystatus',data, { headers: httpHeaders })
    }
    public inventoryOfSecurity(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventoryofsecurity',data, { headers: httpHeaders })
    }
}

