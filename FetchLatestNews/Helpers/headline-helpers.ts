import { BulkOperationType, CosmosClient, CreateOperationInput, OperationInput, UpsertOperationInput } from "@azure/cosmos";

export async function batchHeadlines(newItems: any[], client: CosmosClient, operationType: string = BulkOperationType.Create) {
    
    const operations: OperationInput[] = [];

    newItems.forEach(headline => {
        var createOperation: OperationInput;
        if (operationType === BulkOperationType.Create)
            createOperation = { resourceBody: headline, operationType: operationType } as CreateOperationInput;
        else if (operationType === BulkOperationType.Upsert)
            createOperation = { resourceBody: headline, operationType: operationType } as UpsertOperationInput;

        operations.push(createOperation);
    });

    // Do batch insert
    for (let i = 0; i < operations.length; i += 50) {

        try {
            let operationsBatch = operations.slice(i, i + 50);
            console.log("Inserting " + operationsBatch.length + " items...");
            await client.database('News').container('Headlines').items.bulk(operationsBatch, { continueOnError: true });
        } catch (err) {
            console.log(err);
        }
    }
}