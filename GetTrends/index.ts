import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import fetch from "node-fetch"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    var type = req.query.type;

    var key = process.env["TREND_GET_KEY"];
    var getTrendsUrl = "https://iltalehdet-functions.azurewebsites.net/api/TrendsGet?code=" + key + "&type=" + type;
    var res = await fetch(getTrendsUrl)
    let items
    let status

    if(res.status == 200)
    {
        items = await res.text()
        status = 200;
    } else {
        console.log(res)
        status = 500
    }


    context.res = {
        body: items,
        status: status
    };

};

export default httpTrigger;