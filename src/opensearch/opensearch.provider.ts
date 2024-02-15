import { Injectable, Provider } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';

const host = "localhost";
const protocol = "https";
const port = 9200;
const auth = "admin:admin";

export const OpensearchProvider: Provider =
{
    provide: 'OPENSEARCH',
    useFactory: () => {
        const client = new Client({
            node: protocol + "://" + auth + "@" + host + ":" + port,
            ssl: {
                rejectUnauthorized: false
            }
        });
        return client;
    },
}
