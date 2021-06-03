import EventEmitter from 'events';
import { Consumer, KafkaClient, Admin } from 'kafka-node';
import { apply_patch } from 'jsonpatch';

import { KAFKA } from './config';
import { getDoc } from './http';

console.log(`DB UPDATER: Connecting to Kafka at ${KAFKA.BROKER_URL}`);

const kafkaClient = new KafkaClient({kafkaHost: KAFKA.BROKER_URL});
const admin = new Admin(kafkaClient);

const topics = {};
const e = new EventEmitter();

setInterval(() => {
    admin.listTopics((err, [_, { metadata }]) => {
        Object.keys(metadata).forEach((topic) => {
            if (!topics[topic]) {
                topics[topic] = true;
                e.emit('topic', topic);
            }
        });
    });
}, 1000);

e.on('topic', (topic) => {
    const consumer = new Consumer(kafkaClient, [
        { topic, partition: 0 }
    ], { autoCommit: false });
    consumer.on('message', (message) => {
        const { action, docId } = parseAction(message.value);
        getDoc(docId).then((response) => {
            const oldDoc = response.data.document;
            console.log(oldDoc);
            console.log(action);
        });
    });
});

function parseAction(rawMessage) {
    const obj = JSON.parse(rawMessage);
    return {
        action: obj.action,
        docId: obj.docId
    };
}