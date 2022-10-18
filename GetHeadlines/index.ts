import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const client = new CosmosClient({endpoint: process.env["COSMOS_DB_ENDPOINT"], key: process.env["COSMOS_DB_KEY"]});
    const container = client.database("News").container("Headlines");

    var id = context.bindingData.id;
    let res;

    if (id){
        res = (await container.item(id.toString(), id.toString()).read()).resource
    }
    else {
        var items = await container.items.query({
            query: "SELECT * FROM Headlines h ORDER BY h.isoDate DESC OFFSET 0 LIMIT 10",
            parameters: [{name: "@id", value: id}]
        }).fetchAll();
        console.log(items)
        res = items.resources;
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: res
    };

};

export default httpTrigger;