import { jwtDecode } from "jwt-decode"

export const verificaTokenExpirado =
    (token?: string | null) => {

        if (token) {
            let decodedToken = jwtDecode(token)

            if (
                !decodedToken.exp
                ||
                decodedToken.exp < new Date().getTime() / 1000
            ) {

                return true

            }
            return false
        }

    }