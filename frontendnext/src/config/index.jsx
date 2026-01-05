import axios from "axios";

  

export const BASE_URL="http://localhost:8000";

export const client=axios.create({
    baseURL:"http://localhost:8000",
})