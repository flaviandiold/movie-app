import { OpensearchService } from "src/opensearch/opensearch.service";

export class HooksHelper{
    constructor(private service: OpensearchService) { }
    index(index: string, body: any, id: string) {
        
    }

}