import { Dropbox } from "dropbox";

export const dbx = new Dropbox({
    clientId: process.env.DROPBOX_CLIENT_ID,
    clientSecret: process.env.DROPBOX_CLIENT_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN
})