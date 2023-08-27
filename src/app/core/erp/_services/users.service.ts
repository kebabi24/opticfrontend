// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Profile } from '../_models/profile.model'
import { User } from '../_models/user.model'

const API_URL_PROFILE = environment.apiUrl + "/profiles"
const API_URL_USER = environment.apiUrl + "/users"


@Injectable()
export class UsersService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public addProfile(profile: Profile) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_PROFILE, profile, { headers: httpHeaders })
    }
    public getProfile(id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_PROFILE+'/'+id, { headers: httpHeaders })
    }
    public addUser(user: User) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_USER, user, { headers: httpHeaders })
    }

    public getAllProfiles() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_PROFILE, { headers: httpHeaders })
    }
    public updateProfile(data,id) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_PROFILE + '/'+ id,data , { headers: httpHeaders })
    }
    public getAllUsers() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_USER, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_USER}/${id}`, { headers: httpHeaders })
    }

    public update(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL_USER}/${id}`,data, { headers: httpHeaders })
    }
    public updated(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL_USER}/up${id}`,data, { headers: httpHeaders })
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_USER}/find`,data, { headers: httpHeaders })   
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_USER}/findone`,data, { headers: httpHeaders })   
    }
    
}
