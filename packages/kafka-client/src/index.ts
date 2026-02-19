import { Kafka, Producer, Consumer, KafkaConfig } from 'kafkajs';
import type { KafkaEvent } from '@ospetitions/shared-types';

export class OsKafkaClient {
    private kafka: Kafka;
    private producer: Producer;

    constructor(config: KafkaConfig) {
        this.kafka = new Kafka(config);

        this.producer = this.kafka.producer({
            retry: { retries: 5 }
        });
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }

    async emit(event: KafkaEvent): Promise<void> {
        await this.producer.send({
            topic: event.eventType,
            messages: [
                {
                    key: event.sessionId ?? (event as any).userId,
                    value: JSON.stringify(event),
                },
            ],
        });
    }

    createConsumer(groupId: string): Consumer {
        return this.kafka.consumer({
            groupId,
            sessionTimeout: 30000
        })
    }
}

export type { KafkaEvent };
