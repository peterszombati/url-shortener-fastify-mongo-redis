import {connect} from "mongoose";
import {apiKeyAuthentication} from "../api-key-authentication/db/api-key-authentication";

export const mongo = {
  init: async (url: string) => {
    await connect(url)

    await apiKeyAuthentication.init()
  }
}