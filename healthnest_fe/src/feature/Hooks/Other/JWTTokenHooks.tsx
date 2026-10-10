// Short duration JWT token (5-10 min)
export function getJwtToken() {
    return sessionStorage.getItem("authToken")
}

export function setJwtToken(token: any) {
    sessionStorage.setItem("authToken", token)
}