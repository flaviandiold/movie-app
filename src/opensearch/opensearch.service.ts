import { Inject, Injectable } from '@nestjs/common';
import { ApiResponse, Client } from '@opensearch-project/opensearch';
import { MovieOS } from 'src/movies/dto/movie.opensearch.dto';

@Injectable()
export class OpensearchService {
  constructor(@Inject('OPENSEARCH') private client: Client) { }
  async delete(index: any, id: any) {
    await this.client.delete({
      id: id,
      index: index
    });
  }
  
    async search(index: string, search: string) {
        const docs = await this.client.search({
            index: index,
            body: {
                query: {
                    multi_match: {
                        query: search,
                        type: "phrase_prefix"
                    }
                }
            }
        });
        // console.log(docs);
        return this.decorate(docs);
    }


    async liked(index: string, order: string) {
        const result = await this.client.search({
            index: index,
            body: {
                size: 0,
                aggs: {
                    buckets: {
                      terms: {
                        field: "name.raw",
                        size: 10,
                        order: [
                          {
                            liked: order
                          },
                          {
                            _key: "asc"
                          }
                        ]
                      },
                      aggs: {
                        liked: {
                          nested: {
                            path: "liked"
                          },
                          aggs: {
                            values: {
                              value_count: {
                                field: "liked.userId"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
            }
        });
        return result.body.aggregations.buckets.buckets;
    }
    async sort(order: string, index: string, ...fields: string[]) {
        let sortObj: [{}] = [{}];
        for (const field of fields){
            sortObj.push({[field] : order });  
        }
        const result = await this.client.search({
            index: index,
            body: {
                sort: sortObj
            }
        })
        return this.decorate(result);
    }
    private decorate(result: ApiResponse<Record<string, any>, unknown>) {
        const hits = result.body.hits.hits;
        let data = [];
        for (const hit of hits) {
            data.push(hit._source);
        }
        // console.log('comes',data);

        return data;
    }
    
    async getAll(index: string) {
        const docs = await this.client.search({
            index: index,
        });
        return this.decorate(docs);
    }
    
    async updateMovieAddLike(index: string, userId: number, comment: string,id:string) {
        const movie = await this.client.get({
            id: id,
            index: index
        });
        if (movie.body._source.liked)
            movie.body._source.liked.push({ userId, comment });
        else
            movie.body._source.liked = [{ userId, comment }];
        // console.log(movie.body._source.liked);
        await this.client.update({
            id: id,
            index: index,
            body: {
                doc: {
                    liked : [...movie.body._source.liked]
                }
            }
        });
    }

    async updateMovieRemoveLike(index:string, id: string, userId: number) {
        const movie = await this.client.get({
            id: id,
            index: index
        });
        // console.log(movie.body._source.liked);
        movie.body._source.liked = movie.body._source.liked.filter((item) => item.userId !== userId);
        // console.log(movie.body._source.liked);
        await this.client.update({
            id: id,
            index: index,
            body: {
                doc: {
                    liked : [...movie.body._source.liked]
                }
            }
        });
    }

    async index(index: string, opensearchEntry: any, id: string) {
        if (!(await this.client.indices.exists({
            index: index
        })).body) {
            await this.client.indices.create({
                index: 'movies',
                body: {
                    mappings:{
                      properties: {
                        name:{
                          type: "text",
                          fields:{
                            raw:{
                              type:"keyword"
                            }
                          }
                        },
                        description:{
                          type:"text"
                        },
                        director:{
                          properties: {
                              directorName: {
                                type: "text",
                                fields: {
                                  keyword: {
                                    type: "keyword",
                                    ignore_above: 256
                                  }
                                }
                              }
                            }
                        },
                        liked:{
                          type:"nested",
                          properties: {
                              comment: {
                                type: "text",
                                fields: {
                                  keyword: {
                                    type: "keyword",
                                    ignore_above: 256
                                  }
                                }
                              },
                              userId: {
                                type: "long"
                              }
                            }
                        }
                      }
                    }
                }
            })
        }
        await this.client.index({
            id: id,
            body: opensearchEntry,
            index: index
        });        
    }
    
}
