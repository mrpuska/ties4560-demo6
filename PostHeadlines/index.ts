import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const client = new CosmosClient({endpoint: process.env["COSMOS_DB_ENDPOINT"], key: process.env["COSMOS_DB_KEY"]});
    const container = client.database("News").container("Headlines");

    var headline = req.body;
    let res;
    let status = 200;

    if (headline && headline.id && headline.title && headline.link){
        let item = await container.item(headline.id, headline.id)
        //item.replace(headline)
        res = {status: "success"}
    }
    else {
        res = {error: "Failed to insert new headline."}
        status = 500
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: res,
        status: status
    };

};

export default httpTrigger;