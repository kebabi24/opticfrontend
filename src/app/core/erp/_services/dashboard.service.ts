import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
//import { Daybook } from "../_models/daybook.model"

const API_URL = environment.apiUrl + "/dashboards"

@Injectable()
export class DashboardService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    
    // READ 
    public DaySales() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/daysales`, { headers: httpHeaders })
    }
}
