import { HttpService, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
const Stream = require('stream');

@Injectable()
export class StreamsService {
    private readonly logger = new Logger(StreamsService.name);

    constructor(private readonly httpService: HttpService) {}


    getSampleDocumentStream() {
        return new Promise(async (resolve, reject) => {
            const url = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf';
            const documentObservable = await this.httpService.get(url, {responseType: 'stream'});
            const writableStream = new Stream.Writable();
            writableStream._write = (chunk, encoding, next) => {
                next();
            };
            writableStream.on('finish', resolve);
            writableStream.on('error', reject);
            documentObservable.subscribe(
                response => {
                    this.logger.debug('ON RESPONSE');
                    if (response && response.data) {
                        // this.logger.debug(typeof response.data);
                        // console.log(response.data);
                        // writableStream.write(response.data);

                        // response.data è un IncomingMessage, che estende stream.Readable
                        // quindi posso farne il pipe nel writableStream
                        response.data.pipe(writableStream);
                    }
                },
                err => {
                    this.logger.debug('ON ERROR');
                    return new InternalServerErrorException();
                },
                () => {
                    this.logger.debug('ON FINISH');
                    writableStream.end();
                }
            );
        });
    }

    async getSampleDocument() {
        this.logger.debug('getSampleDocument()');
        const documentObservable = await this.httpService.get('https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf');
        let documentContent = '';
        documentObservable.subscribe(
            response => {
                this.logger.debug('ON RESPONSE');
                if (response && response.data) {
                    documentContent += response.data;
                }
            },
            err => {
                this.logger.debug('ON ERROR');
                return new InternalServerErrorException();
            },
            () => {
                this.logger.debug('ON FINISH');
                this.logger.debug(typeof documentContent);
                this.logger.debug(documentContent.length);
                return documentContent;
            }
        )
    }
}
