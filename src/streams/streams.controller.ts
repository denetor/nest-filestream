import { Controller, Get, Logger } from '@nestjs/common';
import { StreamsService } from "./streams.service";

@Controller('streams')
export class StreamsController {
    private readonly logger = new Logger(StreamsController.name);

    constructor(private readonly streamsService: StreamsService) {
    }

    @Get('document')
    async getDocument() {
        this.logger.debug('getDocument()');
        const documentPromise = this.streamsService.getSampleDocumentStream();
        documentPromise.then(
            response => {
                this.logger.debug('ON RESOLVE');
                this.logger.debug(response);
                this.logger.debug(typeof response);
            }
        )
        return 'ritorno da getDocument()'
    }
}

