import { Controller, HttpModule, Module } from "@nestjs/common";
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';

@Module({
    imports: [HttpModule],
    controllers: [StreamsController],
    providers: [StreamsService],
})
export class StreamsModule {}
